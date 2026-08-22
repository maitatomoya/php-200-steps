/**
 * PHP実行用Web Worker（moduleワーカー）
 *
 * php-wasm（PHP 8.5のWebAssemblyビルド）をWorker内で動かし、
 * ページ本体を固まらせずにPHPコードを実行する。
 * 無限ループはページ側からのterminateで停止される。
 *
 * php-wasmのwebビルドはメインスレッド（DOMあり）を想定しているため、
 * importより前にdocumentの最小スタブを用意してからdynamic importする。
 */
self.document = {
  currentScript: { src: self.location.href },
  createElement: function () { return {}; },
};
self.window = self;

let php = null;
let readyPromise = null;
let currentOut = [];
let currentErr = [];

async function ensurePhp() {
  if (!php) {
    const { PhpWeb } = await import("./vendor/php-wasm/PhpWeb.mjs");
    php = new PhpWeb({ version: "8.5" });
    readyPromise = new Promise((resolve) => {
      php.addEventListener("ready", resolve, { once: true });
    });
    // 出力イベントは常設リスナーで現在の実行バッファに集める
    php.addEventListener("output", (e) => {
      currentOut.push((e.detail || []).join(""));
    });
    php.addEventListener("error", (e) => {
      currentErr.push((e.detail || []).join(""));
    });
  }
  return readyPromise;
}

// このwasmビルドにはmbstring拡張が含まれないため、教材で使う
// mb_系関数をユーザーランドで補う。エラーメッセージの行番号が
// ずれないよう、<?php直後に1行（改行なし）で注入する。
const MB_POLYFILL =
  "if (!function_exists('mb_strlen')) { " +
  "function __mb_chars(string $s): array { preg_match_all('/./us', $s, $m); return $m[0]; } " +
  "function mb_strlen(string $s, ?string $e = null): int { return count(__mb_chars($s)); } " +
  "function mb_substr(string $s, int $st, ?int $len = null, ?string $e = null): string { $c = __mb_chars($s); if ($st < 0) { $st = max(0, count($c) + $st); } $sl = $len === null ? array_slice($c, $st) : array_slice($c, $st, $len); return implode('', $sl); } " +
  "function mb_strpos(string $h, string $n, int $off = 0, ?string $e = null) { $c = __mb_chars($h); $nc = __mb_chars($n); $cnt = count($c); $ncnt = count($nc); if ($ncnt === 0) { return $off; } for ($i = $off; $i <= $cnt - $ncnt; $i++) { if (array_slice($c, $i, $ncnt) == $nc) { return $i; } } return false; } " +
  "function mb_strtoupper(string $s, ?string $e = null): string { return strtoupper($s); } " +
  "function mb_strwidth(string $s, ?string $e = null): int { $w = 0; foreach (__mb_chars($s) as $ch) { $w += strlen($ch) >= 2 ? 2 : 1; } return $w; } " +
  "}";

function injectPolyfill(code) {
  const idx = code.indexOf("<?php");
  if (idx === -1) return code;

  // namespace宣言があるコードは先頭に何も差し込めないため、
  // 事前に別スクリプトとしてグローバル空間へ定義しておく
  if (/^\s*namespace\s+[A-Za-z_\\]/m.test(code)) {
    return { pre: "<?php " + MB_POLYFILL, main: code };
  }

  let insertAt = idx + "<?php".length;
  // declare(strict_types=1);はスクリプトの最初の文でなければならないため、
  // それがある場合はその直後に注入する
  const declareMatch = /declare\s*\(\s*strict_types\s*=\s*1\s*\)\s*;/i.exec(code);
  if (declareMatch && declareMatch.index < insertAt + 40) {
    insertAt = declareMatch.index + declareMatch[0].length;
  }
  return { pre: null, main: code.slice(0, insertAt) + " " + MB_POLYFILL + " " + code.slice(insertAt) };
}

self.onmessage = async (e) => {
  const { id, code } = e.data || {};
  try {
    await ensurePhp();
    currentOut = [];
    currentErr = [];
    let exitCode = 0;
    try {
      const prepared = injectPolyfill(code);
      if (prepared.pre) {
        // namespaceを含むコードでは、先にポリフィルだけを実行して定義しておく
        await php.run(prepared.pre);
        currentOut = [];
        currentErr = [];
      }
      exitCode = await php.run(prepared.main);
    } catch (err) {
      currentErr.push(String((err && err.message) || err));
      exitCode = 255;
    }
    // 実行間で状態が残らないようにリフレッシュする
    try { await php.refresh(); } catch { /* refresh失敗時は次回作り直しに任せる */ }
    self.postMessage({
      id,
      type: "result",
      success: exitCode === 0,
      stdout: currentOut.join(""),
      stderr: currentErr.join(""),
    });
  } catch (err) {
    self.postMessage({
      id,
      type: "result",
      success: false,
      stdout: "",
      stderr: "PHP実行環境の初期化に失敗しました: " + String((err && err.stack) || err),
    });
  }
};

self.postMessage({ type: "boot" });
