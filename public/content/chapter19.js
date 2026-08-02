// 第19章：Web開発への橋渡し
registerChapter({
  number: 19,
  title: "Web開発への橋渡し",
  description: "Web開発で頻出するセキュリティ対策・バリデーション・URL処理・ルーティングの考え方を、CLIで動くデータ処理として学びます。",
  steps: [
    {
      id: 181,
      title: "htmlspecialcharsとXSS対策の考え方",
      explanation: `<p>Webアプリケーションでは、ユーザーが入力した文字列をHTMLとして画面に表示する場面が必ず出てきます。このとき入力をそのまま出力すると、<strong>XSS（クロスサイトスクリプティング）</strong>という攻撃が成立してしまいます。XSSとは、攻撃者が入力欄に<code>&lt;script&gt;</code>タグなどを仕込み、他の閲覧者のブラウザで勝手にJavaScriptを実行させる攻撃です。</p>
<p>PHPでの基本的な防御策が<code>htmlspecialchars()</code>関数です。HTMLで特別な意味を持つ文字を、画面には同じ見た目で表示されるが「タグとしては機能しない」文字（文字実体参照）へ変換します。</p>
<table>
<tr><th>変換前</th><th>変換後</th></tr>
<tr><td><code>&lt;</code></td><td><code>&amp;lt;</code></td></tr>
<tr><td><code>&gt;</code></td><td><code>&amp;gt;</code></td></tr>
<tr><td><code>&amp;</code></td><td><code>&amp;amp;</code></td></tr>
<tr><td><code>"</code></td><td><code>&amp;quot;</code>（ENT_QUOTES指定時）</td></tr>
<tr><td><code>'</code></td><td><code>&amp;#039;</code>（ENT_QUOTES指定時）</td></tr>
</table>
<p>使い方は次の通りです。第2引数の<code>ENT_QUOTES</code>はシングルクォートとダブルクォートの両方を変換するフラグで、実務では基本的に必ず指定します。第3引数は文字エンコーディングです。</p>
<pre><code>$safe = htmlspecialchars($input, ENT_QUOTES, 'UTF-8');</code></pre>
<p>重要な考え方は「<strong>エスケープは出力の直前に行う</strong>」ことです。データベースに保存する時ではなく、HTMLとして出力する瞬間に変換するのが原則です。CLI実行でもこの変換結果は文字列として確認できるので、まずは変換の挙動を体で覚えましょう。</p>`,
      task: `変数<code>$comment</code>を<code>htmlspecialchars()</code>（ENT_QUOTESと'UTF-8'を指定）でエスケープした結果を変数<code>$safe</code>に代入し、出力を完成させてください。`,
      code: `<?php
// ユーザーが掲示板に投稿したと想定するコメント
$comment = '<script>alert("XSS")</script>';

// TODO: htmlspecialcharsでエスケープした結果を$safeに代入する
// 第2引数はENT_QUOTES、第3引数は'UTF-8'を指定すること
$safe = $comment;

echo '元の文字列: ' . $comment . "\\n";
echo 'エスケープ後: ' . $safe . "\\n";
`,
      solution: `<?php
// ユーザーが掲示板に投稿したと想定するコメント
$comment = '<script>alert("XSS")</script>';

// htmlspecialcharsでHTMLの特殊文字をエスケープする
// ENT_QUOTES：シングル・ダブル両方のクォートを変換する
$safe = htmlspecialchars($comment, ENT_QUOTES, 'UTF-8');

echo '元の文字列: ' . $comment . "\\n";
echo 'エスケープ後: ' . $safe . "\\n";
`,
      hints: [
        `htmlspecialchars()は「変換後の新しい文字列」を返す関数です。元の変数は変更されません。`,
        `書き方はhtmlspecialchars($comment, ENT_QUOTES, 'UTF-8')です。戻り値を$safeに代入しましょう。`
      ],
      expectedOutput: "エスケープ後: &lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;"
    },
    {
      id: 182,
      title: "filter_varでバリデーション（メール、URL、int）",
      explanation: `<p>Webアプリケーションはユーザーからの入力を信用してはいけません。「メールアドレス欄に本当にメールアドレスが入っているか」「数値であるべき値が本当に数値か」を確認する処理を<strong>バリデーション（入力検証）</strong>と呼びます。</p>
<p>PHPには<code>filter_var()</code>という組み込みのバリデーション関数があります。第1引数に検証したい値、第2引数に検証ルール（フィルタ定数）を渡します。</p>
<table>
<tr><th>フィルタ定数</th><th>検証内容</th><th>成功時の戻り値</th></tr>
<tr><td><code>FILTER_VALIDATE_EMAIL</code></td><td>メールアドレス形式か</td><td>そのメールアドレス文字列</td></tr>
<tr><td><code>FILTER_VALIDATE_URL</code></td><td>URL形式か</td><td>そのURL文字列</td></tr>
<tr><td><code>FILTER_VALIDATE_INT</code></td><td>整数として解釈できるか</td><td>int型に変換された値</td></tr>
</table>
<p>失敗するとどのフィルタも<code>false</code>を返します。ここで注意が必要なのは比較方法です。<code>FILTER_VALIDATE_INT</code>で<code>'0'</code>を検証すると<code>0</code>が返り、緩い比較<code>==</code>では<code>false</code>と区別できません。必ず厳密な比較<code>!== false</code>を使いましょう。</p>
<pre><code>$age = filter_var('20', FILTER_VALIDATE_INT);
if ($age !== false) {
    // ここでは$ageはint型の20になっている
    echo '有効な整数: ' . $age;
}</code></pre>
<p><code>FILTER_VALIDATE_INT</code>は「文字列を整数に安全に変換する」用途にも使えます。<code>(int)'abc'</code>が<code>0</code>になってしまうキャストと違い、変換できない入力を<code>false</code>として検出できるのが大きな利点です。</p>`,
      task: `TODO部分を埋めて、<code>$url</code>を<code>FILTER_VALIDATE_URL</code>で、<code>$ageInput</code>を<code>FILTER_VALIDATE_INT</code>で検証する処理を完成させてください。`,
      code: `<?php
$email1 = 'taro@example.com';
$email2 = 'taro@@example';
$url = 'https://example.com/page';
$ageInput = '20';

// メールアドレスの検証（完成例）
echo 'email1: ' . (filter_var($email1, FILTER_VALIDATE_EMAIL) !== false ? 'OK' : 'NG') . "\\n";
echo 'email2: ' . (filter_var($email2, FILTER_VALIDATE_EMAIL) !== false ? 'OK' : 'NG') . "\\n";

// TODO: $urlをFILTER_VALIDATE_URLで検証し、有効なら'OK'、無効なら'NG'を出力する
echo 'url: ' . 'NG' . "\\n";

// TODO: $ageInputをFILTER_VALIDATE_INTで検証し、
// 有効なら「age: 20」の形式で、無効なら「age: NG」と出力する
$age = false;
if ($age !== false) {
    echo 'age: ' . $age . "\\n";
} else {
    echo 'age: NG' . "\\n";
}
`,
      solution: `<?php
$email1 = 'taro@example.com';
$email2 = 'taro@@example';
$url = 'https://example.com/page';
$ageInput = '20';

// メールアドレスの検証（完成例）
echo 'email1: ' . (filter_var($email1, FILTER_VALIDATE_EMAIL) !== false ? 'OK' : 'NG') . "\\n";
echo 'email2: ' . (filter_var($email2, FILTER_VALIDATE_EMAIL) !== false ? 'OK' : 'NG') . "\\n";

// URLの検証
echo 'url: ' . (filter_var($url, FILTER_VALIDATE_URL) !== false ? 'OK' : 'NG') . "\\n";

// 整数の検証。成功時はint型の値が返るので、そのまま数値として使える
$age = filter_var($ageInput, FILTER_VALIDATE_INT);
if ($age !== false) {
    echo 'age: ' . $age . "\\n";
} else {
    echo 'age: NG' . "\\n";
}
`,
      hints: [
        `完成例のメールアドレス検証と同じ形で、フィルタ定数だけを差し替えます。`,
        `整数の検証はfilter_var($ageInput, FILTER_VALIDATE_INT)の戻り値を$ageに代入します。falseとの比較は必ず!==を使いましょう。`
      ],
      expectedOutput: "email2: NG"
    },
    {
      id: 183,
      title: "password_hashとpassword_verify",
      explanation: `<p>会員制サイトを作るとき、パスワードを平文（そのままの文字列）で保存するのは絶対にやってはいけません。データベースが漏洩したら全ユーザーのパスワードが流出するからです。そこで使うのが<strong>ハッシュ化</strong>です。ハッシュ化とは、元の文字列から一方向にしか変換できない別の文字列を作ることで、ハッシュ値から元のパスワードを復元することは事実上できません。</p>
<p>PHPでは次の2つの関数をペアで使います。</p>
<table>
<tr><th>関数</th><th>役割</th></tr>
<tr><td><code>password_hash($password, PASSWORD_DEFAULT)</code></td><td>登録時：パスワードをハッシュ化する</td></tr>
<tr><td><code>password_verify($password, $hash)</code></td><td>ログイン時：入力とハッシュが一致するか判定（trueかfalse）</td></tr>
</table>
<pre><code>$hash = password_hash('secret1234', PASSWORD_DEFAULT);
if (password_verify('secret1234', $hash)) {
    echo 'ログイン成功';
}</code></pre>
<p>重要な性質として、<code>password_hash()</code>は<strong>同じパスワードでも実行のたびに違うハッシュ値を生成します</strong>。内部で「ソルト」というランダムな値が毎回混ぜられるためです。そのため「入力を再度ハッシュ化して文字列比較する」方法では照合できず、必ず<code>password_verify()</code>を使います。</p>
<p><code>PASSWORD_DEFAULT</code>を指定すると、その時点でPHPが推奨するアルゴリズム（現在はbcrypt）が使われます。将来より強いアルゴリズムが標準になっても、コードを変えずに追従できる設計です。自前でmd5やsha1を使うのは現在では脆弱とされているので避けましょう。</p>`,
      task: `TODO部分で<code>password_verify()</code>を使い、正しいパスワードと間違ったパスワードそれぞれの認証結果を出力してください。`,
      code: `<?php
$password = 'secret1234';

// パスワードをハッシュ化する（実行のたびに異なる文字列になる）
$hash = password_hash($password, PASSWORD_DEFAULT);

// ハッシュ値そのものは毎回変わるため、長さの目安だけ確認する
echo 'ハッシュの長さ: ' . (strlen($hash) >= 60 ? '60文字以上' : '60文字未満') . "\\n";

// TODO: password_verifyを使って認証結果を出力する
// 'secret1234'を検証 → 「正しいパスワード: 認証成功」
// 'wrong9999'を検証 → 「間違ったパスワード: 認証失敗」
echo '正しいパスワード: ' . '???' . "\\n";
echo '間違ったパスワード: ' . '???' . "\\n";
`,
      solution: `<?php
$password = 'secret1234';

// パスワードをハッシュ化する（実行のたびに異なる文字列になる）
$hash = password_hash($password, PASSWORD_DEFAULT);

// ハッシュ値そのものは毎回変わるため、長さの目安だけ確認する
echo 'ハッシュの長さ: ' . (strlen($hash) >= 60 ? '60文字以上' : '60文字未満') . "\\n";

// password_verifyは「入力されたパスワード」と「保存済みハッシュ」を照合する
echo '正しいパスワード: ' . (password_verify('secret1234', $hash) ? '認証成功' : '認証失敗') . "\\n";
echo '間違ったパスワード: ' . (password_verify('wrong9999', $hash) ? '認証成功' : '認証失敗') . "\\n";
`,
      hints: [
        `password_verify(入力パスワード, ハッシュ値)はtrueかfalseを返します。三項演算子で表示文字列を切り替えましょう。`,
        `(password_verify('secret1234', $hash) ? '認証成功' : '認証失敗')の形が使えます。`
      ],
      expectedOutput: "正しいパスワード: 認証成功"
    },
    {
      id: 184,
      title: "クエリ文字列の組み立て：http_build_queryとparse_str",
      explanation: `<p>Webでは<code>https://example.com/search?page=2&amp;keyword=php</code>のように、URLの<code>?</code>以降にパラメータを付けてデータを渡します。この部分を<strong>クエリ文字列</strong>と呼びます。<code>キー=値</code>のペアを<code>&amp;</code>でつないだ形式です。</p>
<p>PHPには、連想配列とクエリ文字列を相互変換する関数が用意されています。</p>
<table>
<tr><th>関数</th><th>変換の向き</th></tr>
<tr><td><code>http_build_query($array)</code></td><td>連想配列 → クエリ文字列</td></tr>
<tr><td><code>parse_str($query, $result)</code></td><td>クエリ文字列 → 連想配列</td></tr>
</table>
<pre><code>$params = ['page' =&gt; 2, 'keyword' =&gt; 'php'];
echo http_build_query($params);
// 出力：page=2&amp;keyword=php</code></pre>
<p><code>http_build_query()</code>は日本語や記号を自動的にURLエンコード（<code>%E3%81%82</code>のような形式に変換）してくれるため、手作業で文字列連結するより安全です。</p>
<p>逆方向の<code>parse_str()</code>は少し特殊な関数で、<strong>戻り値ではなく第2引数に渡した変数へ結果を格納します</strong>（参照渡し）。</p>
<pre><code>parse_str('page=2&amp;keyword=php', $parsed);
echo $parsed['keyword']; // php</code></pre>
<p>実際のWebアプリケーションでは、ブラウザから送られたクエリ文字列をPHPが自動で解析し、スーパーグローバル変数<code>$_GET</code>に格納してくれます。その裏側で行われているのがまさにこの変換処理です。仕組みを知っておくと<code>$_GET</code>の中身が想像できるようになります。</p>`,
      task: `TODO部分で<code>parse_str()</code>を使ってクエリ文字列<code>$query</code>を連想配列<code>$parsed</code>に戻し、pageとkeywordの値を出力してください。`,
      code: `<?php
$params = [
    'page' => 2,
    'keyword' => 'php',
    'limit' => 10,
];

// 連想配列からクエリ文字列を組み立てる（完成例）
$query = http_build_query($params);
echo 'query: ' . $query . "\\n";

// TODO: parse_strで$queryを連想配列$parsedに変換する
// parse_strは戻り値ではなく第2引数に結果が入ることに注意

echo 'page: ' . '???' . "\\n";
echo 'keyword: ' . '???' . "\\n";
`,
      solution: `<?php
$params = [
    'page' => 2,
    'keyword' => 'php',
    'limit' => 10,
];

// 連想配列からクエリ文字列を組み立てる
$query = http_build_query($params);
echo 'query: ' . $query . "\\n";

// クエリ文字列を連想配列に戻す。結果は第2引数の$parsedに格納される
parse_str($query, $parsed);

echo 'page: ' . $parsed['page'] . "\\n";
echo 'keyword: ' . $parsed['keyword'] . "\\n";
`,
      hints: [
        `parse_str($query, $parsed); と書くと、$parsedに連想配列が入ります。代入文ではない点に注意してください。`,
        `変換後は$parsed['page']や$parsed['keyword']でアクセスできます。`
      ],
      expectedOutput: "query: page=2&keyword=php&limit=10"
    },
    {
      id: 185,
      title: "URLの分解：parse_url",
      explanation: `<p>URLは一見ただの文字列ですが、実は明確な構造を持っています。<code>parse_url()</code>関数を使うと、URLを構成要素ごとに分解した連想配列が得られます。</p>
<pre><code>$parts = parse_url('https://example.com:8080/search?q=php#result');</code></pre>
<table>
<tr><th>キー</th><th>意味</th><th>上の例での値</th></tr>
<tr><td><code>scheme</code></td><td>プロトコル</td><td>https</td></tr>
<tr><td><code>host</code></td><td>ホスト名</td><td>example.com</td></tr>
<tr><td><code>port</code></td><td>ポート番号</td><td>8080</td></tr>
<tr><td><code>path</code></td><td>パス</td><td>/search</td></tr>
<tr><td><code>query</code></td><td>クエリ文字列（?の後ろ）</td><td>q=php</td></tr>
<tr><td><code>fragment</code></td><td>フラグメント（#の後ろ）</td><td>result</td></tr>
</table>
<p>ここで重要な注意点があります。<strong>URLに含まれない要素のキーは、配列に存在しません</strong>。たとえばポート番号のないURLなら<code>$parts['port']</code>は未定義で、そのままアクセスするとWarningが発生します。そこで、これまでに学んだnull合体演算子（左がnullのとき右を返す<code>??</code>）でデフォルト値を用意するのが定石です。</p>
<pre><code>echo $parts['port'] ?? '(なし)';</code></pre>
<p>また、<code>query</code>の値は<code>q=php&amp;page=2</code>のような文字列なので、前のステップで学んだ<code>parse_str()</code>と組み合わせれば個々のパラメータまで取り出せます。「parse_urlで大枠を分解し、parse_strでクエリを分解する」という二段構えは、リダイレクト先の検証やログ解析などの実務でもよく使うパターンです。</p>`,
      task: `TODO部分を埋めて、<code>$parts</code>からpath・query・fragmentを出力し、さらに<code>parse_str()</code>でクエリからパラメータ<code>q</code>を取り出してください。存在しない可能性があるキーには<code>??</code>を使うこと。`,
      code: `<?php
$url = 'https://example.com:8080/search?q=php&page=2#result';

// URLを構成要素に分解する
$parts = parse_url($url);

echo 'scheme: ' . ($parts['scheme'] ?? '(なし)') . "\\n";
echo 'host: ' . ($parts['host'] ?? '(なし)') . "\\n";
echo 'port: ' . ($parts['port'] ?? '(なし)') . "\\n";

// TODO: path、query、fragmentも同じ形式で出力する

// TODO: parse_strを使って$parts['query']を分解し、
// 「q: php」の形式でパラメータqの値を出力する
`,
      solution: `<?php
$url = 'https://example.com:8080/search?q=php&page=2#result';

// URLを構成要素に分解する
$parts = parse_url($url);

echo 'scheme: ' . ($parts['scheme'] ?? '(なし)') . "\\n";
echo 'host: ' . ($parts['host'] ?? '(なし)') . "\\n";
echo 'port: ' . ($parts['port'] ?? '(なし)') . "\\n";
echo 'path: ' . ($parts['path'] ?? '(なし)') . "\\n";
echo 'query: ' . ($parts['query'] ?? '(なし)') . "\\n";
echo 'fragment: ' . ($parts['fragment'] ?? '(なし)') . "\\n";

// クエリ文字列をさらに連想配列へ分解する
parse_str($parts['query'] ?? '', $queryParams);
echo 'q: ' . ($queryParams['q'] ?? '(なし)') . "\\n";
`,
      hints: [
        `path・query・fragmentの出力は、上のscheme等の行とまったく同じパターンで書けます。`,
        `parse_str($parts['query'] ?? '', $queryParams); としてから$queryParams['q']を取り出します。`
      ],
      expectedOutput: "host: example.com"
    },
    {
      id: 186,
      title: "配列からHTMLテーブル文字列を組み立てる",
      explanation: `<p>Webアプリケーションの本質は「データを受け取り、加工し、HTMLとして出力する」ことです。このステップでは、商品データの配列からHTMLの<code>&lt;table&gt;</code>文字列を組み立てる処理を書きます。ブラウザがなくても、生成されるHTML文字列そのものをCLIで確認できます。</p>
<p>HTMLのテーブルは次の構造を持ちます。</p>
<pre><code>&lt;table&gt;
&lt;tr&gt;&lt;th&gt;見出し&lt;/th&gt;&lt;/tr&gt;
&lt;tr&gt;&lt;td&gt;データ&lt;/td&gt;&lt;/tr&gt;
&lt;/table&gt;</code></pre>
<p><code>&lt;tr&gt;</code>が行、<code>&lt;th&gt;</code>が見出しセル、<code>&lt;td&gt;</code>がデータセルです。PHP側は「foreachで行を回し、1行分のHTMLを文字列に追記していく」だけの、これまで学んだ文字列連結の応用です。</p>
<pre><code>$html = '';
foreach ($products as $product) {
    $html .= sprintf("&lt;tr&gt;&lt;td&gt;%s&lt;/td&gt;&lt;/tr&gt;\\n", $product['name']);
}</code></pre>
<p><code>sprintf()</code>を使うとHTMLの雛形と埋め込む値が分離され、連結演算子だらけのコードより読みやすくなります。</p>
<p>そしてもうひとつ大事なのが、ステップ181で学んだ<strong>htmlspecialcharsによるエスケープ</strong>です。商品名はユーザー入力由来かもしれないため、HTMLに埋め込む値は必ずエスケープします。「動的な値をHTMLに埋め込む場所すべてがXSSの危険地帯」という意識は、フレームワークを使うようになっても変わらない基本です。</p>`,
      task: `TODO部分でforeachの中身を実装してください。商品名を<code>htmlspecialchars()</code>でエスケープし、<code>sprintf()</code>で1行分の<code>&lt;tr&gt;</code>を組み立てて<code>$html</code>に追記します。`,
      code: `<?php
$products = [
    ['name' => 'りんご', 'price' => 120],
    ['name' => 'みかん', 'price' => 80],
    ['name' => 'ぶどう', 'price' => 450],
];

$html = "<table>\\n";
$html .= "<tr><th>商品名</th><th>価格</th></tr>\\n";
foreach ($products as $product) {
    // TODO: 商品名をhtmlspecialchars(ENT_QUOTES, 'UTF-8')でエスケープし、
    // sprintfで "<tr><td>商品名</td><td>価格</td></tr>\\n" の形の行を$htmlに追記する
}
$html .= "</table>\\n";

echo $html;
`,
      solution: `<?php
$products = [
    ['name' => 'りんご', 'price' => 120],
    ['name' => 'みかん', 'price' => 80],
    ['name' => 'ぶどう', 'price' => 450],
];

$html = "<table>\\n";
$html .= "<tr><th>商品名</th><th>価格</th></tr>\\n";
foreach ($products as $product) {
    // 動的な値をHTMLに埋め込む前に必ずエスケープする
    $name = htmlspecialchars($product['name'], ENT_QUOTES, 'UTF-8');
    $html .= sprintf("<tr><td>%s</td><td>%d</td></tr>\\n", $name, $product['price']);
}
$html .= "</table>\\n";

echo $html;
`,
      hints: [
        `まず$product['name']をエスケープして変数に受け、次にsprintfで行を作って$htmlに.=で追記する、という2段階で考えましょう。`,
        `sprintfの書式は "<tr><td>%s</td><td>%d</td></tr>\\n" です。%sに商品名、%dに価格が入ります。`
      ],
      expectedOutput: "<tr><td>りんご</td><td>120</td></tr>"
    },
    {
      id: 187,
      title: "リクエストデータの検証パターン",
      explanation: `<p>Webアプリケーションでは、ブラウザから送られたパラメータが連想配列（<code>$_GET</code>や<code>$_POST</code>）としてPHPに渡されます。この配列は<strong>何が入っているか一切保証がありません</strong>。キーが存在しないかもしれないし、数値のはずが文字列かもしれません。そこで「検証専用の関数」を作るのが実務の定石です。</p>
<p>このステップでは、検証関数の代表的な設計パターンを学びます。</p>
<ul>
<li>入力の連想配列を受け取り、<strong>エラーメッセージの配列</strong>を返す</li>
<li>エラーがなければ空配列<code>[]</code>を返す（呼び出し側は空かどうかで成否を判断）</li>
<li>1つエラーを見つけても途中でやめず、<strong>全項目を検証してすべてのエラーを集める</strong>（ユーザーが一度に全部直せるように）</li>
</ul>
<pre><code>function validateSearchParams(array $input): array
{
    $errors = [];
    if (!isset($input['keyword']) || $input['keyword'] === '') {
        $errors[] = 'keywordは必須です';
    }
    return $errors;
}</code></pre>
<p>検証の材料はこれまでに学んだものだけです。キーの存在確認は<code>isset()</code>、空文字チェックは<code>=== ''</code>、数値の検証はステップ182の<code>filter_var()</code>を使います。</p>
<p>「必須項目」と「任意項目」の扱いの違いにも注目してください。任意項目のpageは、<strong>存在しないのはOKだが、存在するなら正しい形式であるべき</strong>、という二段階の条件になります。この考え方はどんなフォーム検証にも応用できます。</p>`,
      task: `TODO部分に、任意項目<code>page</code>の検証を実装してください。<code>page</code>が存在する場合のみ、<code>filter_var()</code>のFILTER_VALIDATE_INTで検証し、整数でないか1未満なら「pageは1以上の整数で指定してください」をエラーに追加します。`,
      code: `<?php
/**
 * 検索パラメータ（$_GET相当の連想配列）を検証する
 * 戻り値：エラーメッセージの配列（空配列なら検証OK）
 */
function validateSearchParams(array $input): array
{
    $errors = [];

    // keywordは必須かつ空文字でないこと（完成例）
    if (!isset($input['keyword']) || $input['keyword'] === '') {
        $errors[] = 'keywordは必須です';
    }

    // TODO: pageは任意項目。ただし存在する場合は
    // FILTER_VALIDATE_INTで検証し、整数でない・または1未満なら
    // 'pageは1以上の整数で指定してください' を$errorsに追加する

    return $errors;
}

// 不正な入力の例（keywordがなく、pageが数値でない）
$badInput = ['page' => 'abc'];
foreach (validateSearchParams($badInput) as $error) {
    echo 'エラー: ' . $error . "\\n";
}

// 正しい入力の例
$goodInput = ['keyword' => 'php', 'page' => '2'];
if (validateSearchParams($goodInput) === []) {
    echo '検証OK' . "\\n";
}
`,
      solution: `<?php
/**
 * 検索パラメータ（$_GET相当の連想配列）を検証する
 * 戻り値：エラーメッセージの配列（空配列なら検証OK）
 */
function validateSearchParams(array $input): array
{
    $errors = [];

    // keywordは必須かつ空文字でないこと
    if (!isset($input['keyword']) || $input['keyword'] === '') {
        $errors[] = 'keywordは必須です';
    }

    // pageは任意項目。ただし存在する場合は1以上の整数であること
    if (isset($input['page'])) {
        $page = filter_var($input['page'], FILTER_VALIDATE_INT);
        if ($page === false || $page < 1) {
            $errors[] = 'pageは1以上の整数で指定してください';
        }
    }

    return $errors;
}

// 不正な入力の例（keywordがなく、pageが数値でない）
$badInput = ['page' => 'abc'];
foreach (validateSearchParams($badInput) as $error) {
    echo 'エラー: ' . $error . "\\n";
}

// 正しい入力の例
$goodInput = ['keyword' => 'php', 'page' => '2'];
if (validateSearchParams($goodInput) === []) {
    echo '検証OK' . "\\n";
}
`,
      hints: [
        `まずisset($input['page'])で「存在する場合だけ」検証するifを作ります。任意項目なので、存在しなければ何もしません。`,
        `中ではfilter_var($input['page'], FILTER_VALIDATE_INT)の結果を変数に受け、=== falseまたは1未満のときにエラーを追加します。`
      ],
      expectedOutput: "検証OK"
    },
    {
      id: 188,
      title: "セッションの概念とデータ設計",
      explanation: `<p>HTTPには「前のリクエストを覚えていない」という性質があります（<strong>ステートレス</strong>と呼びます）。ページを移動するたびに、サーバーから見れば毎回初対面の相手からのアクセスです。しかし、ログイン状態やショッピングカートは、複数のページをまたいで保持する必要があります。この問題を解決する仕組みが<strong>セッション</strong>です。</p>
<p>セッションの仕組みを分解すると次の通りです。</p>
<ol>
<li>サーバーがユーザーごとにランダムなID（セッションID）を発行し、ブラウザのCookieに保存させる</li>
<li>ブラウザは以降のリクエストで毎回そのIDを送る</li>
<li>サーバーはIDに紐づく保存領域（連想配列<code>$_SESSION</code>）を復元する</li>
</ol>
<p>つまりセッションの正体は「<strong>ユーザーごとに用意された、リクエストをまたいで生き残る連想配列</strong>」です。データ構造としては、これまで学んだ連想配列の操作そのものです。このステップでは<code>$_SESSION</code>の代わりに普通の連想配列<code>$session</code>を使い、カート機能のデータ設計を体験します。</p>
<pre><code>// カートの設計例：商品名 =&gt; 個数 の連想配列を'cart'キーに持つ
$session = [
    'cart' =&gt; ['りんご' =&gt; 2, 'みかん' =&gt; 1],
];</code></pre>
<p>関数でセッションを書き換えるため、引数を<code>&amp;$session</code>のように参照渡しにしている点にも注目してください。同じ商品を追加したら個数を加算する、キーがなければ0から始める（<code>?? 0</code>）といった処理は、実際のECサイトのカート実装でも同じ考え方です。</p>`,
      task: `TODO部分で<code>cartAdd()</code>関数の中身を実装してください。すでに同じ商品がカートにあれば個数を加算し、なければ新規追加します（<code>?? 0</code>を活用）。`,
      code: `<?php
// セッションのシミュレーション（Webでは$_SESSIONが担う役割）
$session = [];

/**
 * カートに商品を追加する。同じ商品があれば個数を加算する
 */
function cartAdd(array &$session, string $name, int $qty): void
{
    if (!isset($session['cart'])) {
        $session['cart'] = [];
    }
    // TODO: $session['cart'][$name]の現在の個数（なければ0）に$qtyを加算する
}

/**
 * カート内の合計点数を返す
 */
function cartTotalCount(array $session): int
{
    return array_sum($session['cart'] ?? []);
}

cartAdd($session, 'りんご', 2);
cartAdd($session, 'みかん', 1);
cartAdd($session, 'りんご', 1);

foreach ($session['cart'] as $name => $qty) {
    echo $name . ': ' . $qty . '個' . "\\n";
}
echo '合計: ' . cartTotalCount($session) . '点' . "\\n";
`,
      solution: `<?php
// セッションのシミュレーション（Webでは$_SESSIONが担う役割）
$session = [];

/**
 * カートに商品を追加する。同じ商品があれば個数を加算する
 */
function cartAdd(array &$session, string $name, int $qty): void
{
    if (!isset($session['cart'])) {
        $session['cart'] = [];
    }
    // 未追加の商品はnull合体演算子で0から始める
    $current = $session['cart'][$name] ?? 0;
    $session['cart'][$name] = $current + $qty;
}

/**
 * カート内の合計点数を返す
 */
function cartTotalCount(array $session): int
{
    return array_sum($session['cart'] ?? []);
}

cartAdd($session, 'りんご', 2);
cartAdd($session, 'みかん', 1);
cartAdd($session, 'りんご', 1);

foreach ($session['cart'] as $name => $qty) {
    echo $name . ': ' . $qty . '個' . "\\n";
}
echo '合計: ' . cartTotalCount($session) . '点' . "\\n";
`,
      hints: [
        `「現在の個数を取り出す」「加算した値を代入し直す」の2行で書くと分かりやすくなります。`,
        `現在の個数は$session['cart'][$name] ?? 0で取れます。キーが未定義でもWarningが出ません。`
      ],
      expectedOutput: "合計: 4点"
    },
    {
      id: 189,
      title: "簡易ルーターの仕組み",
      explanation: `<p>WebフレームワークのLaravelやSymfonyには「<code>/users</code>にアクセスされたらこの処理を実行する」という対応を定義する<strong>ルーティング</strong>機能があります。一見魔法のようですが、その中心にあるのは「<strong>パスとコールバック（処理）の対応表</strong>」というシンプルなデータ構造です。</p>
<p>これまでに学んだ2つの道具で作れます。</p>
<ul>
<li><strong>連想配列</strong>：キーをパス、値を処理にする対応表</li>
<li><strong>無名関数（クロージャ）</strong>：処理そのものを値として配列に格納する</li>
</ul>
<pre><code>$routes = [
    '/' =&gt; function (): string {
        return 'トップページを表示';
    },
    '/users' =&gt; function (): string {
        return 'ユーザー一覧を表示';
    },
];</code></pre>
<p>そして「ディスパッチ（振り分け）」関数が、リクエストされたパスに対応する処理を探して実行します。配列に格納された無名関数は、<code>$routes[$path]()</code>のように<strong>変数の後ろに()を付けるだけで呼び出せます</strong>。</p>
<pre><code>function dispatch(array $routes, string $path): string
{
    return $routes[$path]();
}</code></pre>
<p>実際のWebサーバーでは、対応するパスが見つからないときにブラウザへ「404 Not Found」というステータスを返します。今回の簡易版でも<code>array_key_exists()</code>で存在チェックを行い、未登録のパスには404メッセージを返すようにします。フレームワークのルーティング定義を見たとき、「裏側はこの対応表の豪華版だ」と想像できるようになることがこのステップの狙いです。</p>`,
      task: `TODO部分で<code>dispatch()</code>関数を完成させてください。<code>$routes</code>にパスが存在しなければ「404 Not Found: パス」を返し、存在すれば対応するコールバックを実行して結果を返します。`,
      code: `<?php
// パスと処理（コールバック）の対応表
$routes = [
    '/' => function (): string {
        return 'トップページを表示';
    },
    '/users' => function (): string {
        return 'ユーザー一覧を表示';
    },
    '/users/new' => function (): string {
        return 'ユーザー登録フォームを表示';
    },
];

/**
 * パスに対応する処理を実行して結果を返す
 */
function dispatch(array $routes, string $path): string
{
    // TODO: $routesに$pathが存在しなければ '404 Not Found: ' . $path を返す
    // 存在すれば対応するコールバックを実行し、その戻り値を返す
    return '';
}

echo dispatch($routes, '/') . "\\n";
echo dispatch($routes, '/users') . "\\n";
echo dispatch($routes, '/nothing') . "\\n";
`,
      solution: `<?php
// パスと処理（コールバック）の対応表
$routes = [
    '/' => function (): string {
        return 'トップページを表示';
    },
    '/users' => function (): string {
        return 'ユーザー一覧を表示';
    },
    '/users/new' => function (): string {
        return 'ユーザー登録フォームを表示';
    },
];

/**
 * パスに対応する処理を実行して結果を返す
 */
function dispatch(array $routes, string $path): string
{
    if (!array_key_exists($path, $routes)) {
        return '404 Not Found: ' . $path;
    }
    // 配列に入った無名関数は、後ろに()を付けて呼び出せる
    return $routes[$path]();
}

echo dispatch($routes, '/') . "\\n";
echo dispatch($routes, '/users') . "\\n";
echo dispatch($routes, '/nothing') . "\\n";
`,
      hints: [
        `まず「見つからない場合」を先に処理する早期リターンで書くと読みやすくなります。`,
        `array_key_exists($path, $routes)で存在確認し、コールバックの呼び出しは$routes[$path]()と書きます。`
      ],
      expectedOutput: "ユーザー一覧を表示"
    },
    {
      id: 190,
      title: "総合演習：お問い合わせフォームの検証・整形処理",
      explanation: `<p>第19章の総合演習です。お問い合わせフォームの送信データを想定した連想配列に対し、「検証（バリデーション）」と「整形（サニタイズして確認画面用の文字列を作る）」を行う、実務のフォーム処理の縮図を実装します。</p>
<p>処理の流れは実際のWebアプリケーションと同じ2段構えです。</p>
<ol>
<li><strong>validateContact()</strong>：入力を検証し、エラーメッセージの配列を返す（ステップ187のパターン）</li>
<li><strong>formatContact()</strong>：検証を通った入力をhtmlspecialcharsでエスケープし、確認画面用の文字列に整形する（ステップ181・186の応用）</li>
</ol>
<p>検証ルールは次の3つです。</p>
<table>
<tr><th>項目</th><th>ルール</th><th>使う道具</th></tr>
<tr><td>name</td><td>必須（トリム後に空でない）</td><td><code>trim()</code>、<code>=== ''</code></td></tr>
<tr><td>email</td><td>必須かつメール形式</td><td><code>filter_var()</code></td></tr>
<tr><td>message</td><td>必須</td><td><code>trim()</code>、<code>=== ''</code></td></tr>
</table>
<p><code>trim()</code>（文字列の前後の空白を取り除く関数）を通してから空チェックするのは、スペースだけの入力を「未入力」として弾くためです。また、emailは「空である」と「形式が不正である」でエラーメッセージを分けます。<code>elseif</code>を使い、空の場合に形式エラーまで重ねて出さないのがポイントです。</p>
<p>ここまでの章で学んだ関数・配列・条件分岐・文字列処理がすべて登場します。1つ1つはすでに知っている道具であることを確認しながら組み立ててください。</p>`,
      task: `<code>validateContact()</code>のemail検証（必須チェックと形式チェックをelseifで分ける）と、<code>formatContact()</code>のエスケープ処理を実装してください。`,
      code: `<?php
/**
 * お問い合わせフォームの入力を検証する
 * 戻り値：エラーメッセージの配列（空配列なら検証OK）
 */
function validateContact(array $input): array
{
    $errors = [];

    $name = trim($input['name'] ?? '');
    if ($name === '') {
        $errors[] = 'お名前は必須です';
    }

    // TODO: emailの検証を実装する
    // 空なら「メールアドレスは必須です」
    // 空でないがメール形式でなければ「メールアドレスの形式が正しくありません」
    $email = trim($input['email'] ?? '');

    $message = trim($input['message'] ?? '');
    if ($message === '') {
        $errors[] = 'お問い合わせ内容は必須です';
    }

    return $errors;
}

/**
 * 検証済みの入力を確認画面用の文字列に整形する
 */
function formatContact(array $input): string
{
    // TODO: name、email、messageをそれぞれtrimしてから
    // htmlspecialchars(ENT_QUOTES, 'UTF-8')でエスケープする
    $name = $input['name'];
    $email = $input['email'];
    $message = $input['message'];

    $lines = [];
    $lines[] = '--- 確認画面 ---';
    $lines[] = 'お名前: ' . $name;
    $lines[] = 'メール: ' . $email;
    $lines[] = '内容: ' . $message;
    return implode("\\n", $lines) . "\\n";
}

// 不正な入力
$badInput = ['name' => '', 'email' => 'not-an-email', 'message' => ''];
foreach (validateContact($badInput) as $error) {
    echo 'エラー: ' . $error . "\\n";
}

// 正しい入力（タグ入りでもエスケープされて無害化される）
$goodInput = [
    'name' => '山田太郎',
    'email' => 'taro@example.com',
    'message' => '<b>資料</b>を希望します',
];
if (validateContact($goodInput) === []) {
    echo formatContact($goodInput);
}
`,
      solution: `<?php
/**
 * お問い合わせフォームの入力を検証する
 * 戻り値：エラーメッセージの配列（空配列なら検証OK）
 */
function validateContact(array $input): array
{
    $errors = [];

    $name = trim($input['name'] ?? '');
    if ($name === '') {
        $errors[] = 'お名前は必須です';
    }

    // 必須チェックと形式チェックはelseifで分け、二重にエラーを出さない
    $email = trim($input['email'] ?? '');
    if ($email === '') {
        $errors[] = 'メールアドレスは必須です';
    } elseif (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
        $errors[] = 'メールアドレスの形式が正しくありません';
    }

    $message = trim($input['message'] ?? '');
    if ($message === '') {
        $errors[] = 'お問い合わせ内容は必須です';
    }

    return $errors;
}

/**
 * 検証済みの入力を確認画面用の文字列に整形する
 */
function formatContact(array $input): string
{
    // 出力の直前に必ずエスケープする（XSS対策）
    $name = htmlspecialchars(trim($input['name']), ENT_QUOTES, 'UTF-8');
    $email = htmlspecialchars(trim($input['email']), ENT_QUOTES, 'UTF-8');
    $message = htmlspecialchars(trim($input['message']), ENT_QUOTES, 'UTF-8');

    $lines = [];
    $lines[] = '--- 確認画面 ---';
    $lines[] = 'お名前: ' . $name;
    $lines[] = 'メール: ' . $email;
    $lines[] = '内容: ' . $message;
    return implode("\\n", $lines) . "\\n";
}

// 不正な入力
$badInput = ['name' => '', 'email' => 'not-an-email', 'message' => ''];
foreach (validateContact($badInput) as $error) {
    echo 'エラー: ' . $error . "\\n";
}

// 正しい入力（タグ入りでもエスケープされて無害化される）
$goodInput = [
    'name' => '山田太郎',
    'email' => 'taro@example.com',
    'message' => '<b>資料</b>を希望します',
];
if (validateContact($goodInput) === []) {
    echo formatContact($goodInput);
}
`,
      hints: [
        `emailの検証はif ($email === '') { ... } elseif (filter_var(...) === false) { ... }の形です。`,
        `formatContactでは htmlspecialchars(trim($input['name']), ENT_QUOTES, 'UTF-8') のように、trimしてからエスケープします。`,
        `正しい入力のmessageにはタグが含まれているので、出力では&lt;b&gt;のようにエスケープされた形になります。`
      ],
      expectedOutput: "お名前: 山田太郎"
    }
  ]
});
