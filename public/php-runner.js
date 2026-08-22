/**
 * PHP教材のブラウザ内実行ランナー
 *
 * php-wasm（PHP 8.5）を載せたWeb Workerでコードを実行する。
 * サーバー実行版と同じ形のresult（success/compiler/stdout/stderr）を返す。
 * タイムアウト時はWorkerをterminateして作り直す（無限ループ対策）。
 */
(function () {
  "use strict";

  var HARD_TIMEOUT_MS = 15000;
  var worker = null;
  var booted = false;
  var nextId = 1;
  var inflight = {};

  function spawn() {
    worker = new Worker("php-worker.mjs", { type: "module" });
    booted = false;
    worker.onmessage = function (e) {
      var msg = e.data || {};
      if (msg.type === "boot") { booted = true; return; }
      if (msg.type === "result" && inflight[msg.id]) {
        var entry = inflight[msg.id];
        delete inflight[msg.id];
        clearTimeout(entry.timer);
        entry.resolve({
          success: msg.success,
          compiler: "",
          stdout: msg.stdout,
          stderr: msg.stderr,
          backend: "browser-wasm",
        });
      }
    };
    worker.onerror = function (e) {
      var err = (e && e.message) ? e.message : "PHP実行環境の読み込みに失敗しました。";
      Object.keys(inflight).forEach(function (id) {
        var entry = inflight[id];
        delete inflight[id];
        clearTimeout(entry.timer);
        entry.resolve({ success: false, compiler: "", stdout: "", stderr: err, backend: "browser-wasm" });
      });
    };
  }

  function run(code, callbacks) {
    if (!worker) spawn();
    var id = nextId++;

    var timer = setTimeout(function () {
      if (!inflight[id]) return;
      var entry = inflight[id];
      delete inflight[id];
      // 無限ループ等：Workerごと破棄して次回作り直す
      worker.terminate();
      worker = null;
      entry.resolve({
        success: false,
        compiler: "",
        stdout: "",
        stderr: "実行がタイムアウトしました（15秒）。無限ループがないか確認してください。",
        backend: "browser-wasm",
      });
    }, HARD_TIMEOUT_MS);

    inflight[id] = {
      resolve: function (result) { callbacks.onResult(result); },
      timer: timer,
    };
    worker.postMessage({ id: id, code: code });
  }

  // ページ表示と同時にWorkerを起動してwasmを先読みしておく（初回実行を速くする）
  spawn();

  window.PhpRunner = { run: run };
})();
