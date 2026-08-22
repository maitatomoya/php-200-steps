/**
 * PHP 200 Steps 開発サーバー
 *
 * 依存パッケージゼロ（Node標準ライブラリのみ）で動作する。
 * - public/ 配下の静的ファイル配信
 * - POST /api/run：PHPコードの構文チェック・実行
 *   - php -l で構文チェックし、通れば php で実行する（要ローカルphp）
 */
const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { spawnSync } = require("child_process");

const PORT = process.env.PORT ? Number(process.env.PORT) : 3941;
const PUBLIC_DIR = path.join(__dirname, "public");
const MAX_CODE_BYTES = 64 * 1024;
const RUN_TIMEOUT_MS = 8000;

// 起動時に一度だけローカルphpの有無を判定する
const phpCheck = spawnSync("php", ["-v"], { encoding: "utf8" });
const HAS_PHP = phpCheck.status === 0;
const PHP_VERSION = HAS_PHP ? phpCheck.stdout.split("\n")[0].trim() : null;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".wasm": "application/wasm",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

/** php -l で構文チェックし、通れば実行する */
function runPhp(code) {
  const workDir = fs.mkdtempSync(path.join(os.tmpdir(), "php-tutor-"));
  const srcPath = path.join(workDir, "main.php");
  try {
    fs.writeFileSync(srcPath, code, "utf8");

    // 構文チェック（コンパイラ出力に相当）
    const lint = spawnSync("php", ["-l", srcPath], {
      encoding: "utf8",
      timeout: RUN_TIMEOUT_MS,
    });
    if (lint.status !== 0) {
      return {
        success: false,
        compiler: (lint.stdout || "") + (lint.stderr || ""),
        stdout: "",
        stderr: "",
        backend: "local",
      };
    }

    // 実行（メモリ・時間を制限。危険な関数はディレクティブで無効化）
    const run = spawnSync(
      "php",
      [
        "-d", "memory_limit=128M",
        "-d", "max_execution_time=8",
        "-d", "display_errors=stderr",
        "-d", "disable_functions=exec,shell_exec,system,passthru,proc_open,popen",
        srcPath,
      ],
      { encoding: "utf8", timeout: RUN_TIMEOUT_MS, cwd: workDir }
    );
    const timedOut = run.error && run.error.code === "ETIMEDOUT";
    return {
      success: !timedOut && run.status === 0,
      compiler: "",
      stdout: run.stdout || "",
      stderr: timedOut
        ? "実行がタイムアウトしました（8秒）。無限ループがないか確認してください。"
        : run.stderr || "",
      backend: "local",
    };
  } finally {
    fs.rmSync(workDir, { recursive: true, force: true });
  }
}

function sendJson(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

function serveStatic(req, res) {
  let urlPath = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  if (urlPath === "/") urlPath = "/index.html";

  // ディレクトリトラバーサル対策：public配下に正規化されるパスのみ許可
  const filePath = path.normalize(path.join(PUBLIC_DIR, urlPath));
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not Found");
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": MIME_TYPES[ext] || "application/octet-stream",
    });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/api/status") {
    sendJson(res, 200, {
      backend: HAS_PHP ? "local" : "none",
      rustcVersion: PHP_VERSION,
    });
    return;
  }

  if (req.method === "POST" && req.url === "/api/run") {
    let body = "";
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_CODE_BYTES) {
        sendJson(res, 413, { error: "コードが大きすぎます（上限64KB）。" });
        req.destroy();
        return;
      }
      body += chunk;
    });
    req.on("end", () => {
      let code;
      try {
        code = JSON.parse(body).code;
      } catch {
        sendJson(res, 400, { error: "リクエストの形式が不正です。" });
        return;
      }
      if (typeof code !== "string" || code.trim() === "") {
        sendJson(res, 400, { error: "コードが空です。" });
        return;
      }
      if (!HAS_PHP) {
        sendJson(res, 500, {
          error: "phpが見つかりません。brew install php でインストールしてください。",
        });
        return;
      }
      try {
        sendJson(res, 200, runPhp(code));
      } catch (e) {
        sendJson(res, 500, { error: "実行に失敗しました。", detail: String(e) });
      }
    });
    return;
  }

  if (req.method === "GET" || req.method === "HEAD") {
    serveStatic(req, res);
    return;
  }

  res.writeHead(405);
  res.end("Method Not Allowed");
});

server.listen(PORT, "127.0.0.1", () => {
  console.log("PHP 200 Steps: http://localhost:" + PORT);
  console.log("実行バックエンド: " + (HAS_PHP ? PHP_VERSION : "phpが見つかりません"));
});
