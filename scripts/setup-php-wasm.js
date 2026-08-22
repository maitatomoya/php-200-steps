/**
 * php-wasm（ブラウザ内PHP実行環境）のセットアップスクリプト
 *
 * public/vendor/php-wasm/ に必要なファイルを配置する。
 * wasmバイナリが約17MBあるためリポジトリには含めず、このスクリプトで取得する。
 *
 * 使い方：node scripts/setup-php-wasm.js
 */
const fs = require("fs");
const path = require("path");
const os = require("os");
const { execFileSync } = require("child_process");

const VERSION = "0.1.0";
const TARBALL = `https://registry.npmjs.org/php-wasm/-/php-wasm-${VERSION}.tgz`;
const VENDOR_DIR = path.join(__dirname, "..", "public", "vendor", "php-wasm");
const NEEDED = [
  "PhpWeb.mjs",
  "PhpBase.mjs",
  "OutputBuffer.mjs",
  "_Event.mjs",
  "webTransactions.mjs",
  "fsOps.mjs",
  "resolveDependencies.mjs",
  "php8.5-web.mjs",
  "5eec04f740c83548a49d4dfa5f4ad074383cc188.wasm",
];

if (NEEDED.every((f) => fs.existsSync(path.join(VENDOR_DIR, f)))) {
  console.log("php-wasmは配置済みです。");
  process.exit(0);
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "php-wasm-setup-"));
const tgz = path.join(tmp, "php-wasm.tgz");

console.log(`php-wasm ${VERSION} をダウンロードしています（約47MB）...`);
execFileSync("curl", ["-sL", "-o", tgz, TARBALL], { stdio: "inherit" });

console.log("必要なファイルを展開しています...");
execFileSync("tar", ["-xzf", tgz, "-C", tmp], { stdio: "inherit" });

fs.mkdirSync(VENDOR_DIR, { recursive: true });
for (const name of NEEDED) {
  fs.copyFileSync(path.join(tmp, "package", name), path.join(VENDOR_DIR, name));
}
fs.rmSync(tmp, { recursive: true, force: true });

console.log(`配置しました: ${VENDOR_DIR}`);
console.log("node server.js で起動できます。");
