// 第7章：文字列処理
registerChapter({
  number: 7,
  title: "文字列処理",
  description: "PHPの豊富な文字列関数を学び、検索・置換・分割・整形など実務で毎日使うテクニックを身につける。",
  steps: [
    {
      id: 61,
      title: "strlenとmb_strlen（日本語文字列の長さ）",
      explanation: `<p>文字列の長さを調べる関数は2つあります。<code>strlen()</code>は<strong>バイト数</strong>を、<code>mb_strlen()</code>は<strong>文字数</strong>を返します。</p>
<p>PHPの文字列は内部的には「バイトの並び」です。半角英数字は1文字=1バイトですが、UTF-8では日本語（ひらがな・カタカナ・漢字）はほとんどが1文字=3バイトになります。そのため日本語に<code>strlen()</code>を使うと、見た目の文字数の約3倍の値が返ってきます。</p>
<pre><code>$word = "こんにちは";
echo strlen($word);     // 15（5文字×3バイト）
echo mb_strlen($word);  // 5（文字数）</code></pre>
<table>
<tr><th>関数</th><th>返す値</th><th>"PHP入門"の結果</th></tr>
<tr><td><code>strlen()</code></td><td>バイト数</td><td>9（半角3＋全角2×3）</td></tr>
<tr><td><code>mb_strlen()</code></td><td>文字数</td><td>5</td></tr>
</table>
<p><code>mb_</code>で始まる関数はマルチバイト文字列関数（mbstring拡張）と呼ばれ、日本語を「文字単位」で正しく扱えます。「文字数を数えたいのに<code>strlen()</code>を使ってしまい、バリデーションの上限が実質3分の1になっていた」というのは実務でも本当によくあるバグです。<strong>日本語を扱うときは<code>mb_</code>系関数を使う</strong>と覚えてください。</p>
<p>なお英数字だけの文字列なら両者の結果は一致するので、パスワードのバイト長チェックなど「バイト数を数えたい」場面では<code>strlen()</code>が正解になります。目的に応じて使い分けましょう。</p>`,
      task: `まずそのまま実行して<code>strlen()</code>と<code>mb_strlen()</code>の結果の違いを観察しよう。次に<code>$word</code>を<code>"PHP入門"</code>に変えて再実行し、バイト数が9になることを確認しよう。`,
      code: `<?php
// まずこのまま実行して、2つの関数の結果の違いを観察しよう
$word = "こんにちは";
echo "バイト数: " . strlen($word) . "\\n";
echo "文字数: " . mb_strlen($word) . "\\n";

// TODO: 観察できたら$wordを"PHP入門"に変えて再実行しよう
`,
      solution: `<?php
// 半角英数字は1文字1バイト、日本語はUTF-8で1文字3バイト
$word = "PHP入門";
echo "バイト数: " . strlen($word) . "\\n";  // 3 + 2×3 = 9
echo "文字数: " . mb_strlen($word) . "\\n"; // 5
`,
      hints: [
        `UTF-8では日本語1文字が3バイトになる。"PHP入門"は半角3文字と全角2文字の組み合わせ。`,
        `$word = "PHP入門"; に書き換えるだけでよい。バイト数は3+6=9、文字数は5になるはず。`,
      ],
      expectedOutput: "バイト数: 9",
    },
    {
      id: 62,
      title: "大文字小文字変換とtrim系関数",
      explanation: `<p>文字列の見た目を整える基本関数を覚えましょう。まず大文字・小文字の変換です。</p>
<table>
<tr><th>関数</th><th>働き</th><th>"php code"の結果</th></tr>
<tr><td><code>strtoupper()</code></td><td>すべて大文字に</td><td>PHP CODE</td></tr>
<tr><td><code>strtolower()</code></td><td>すべて小文字に</td><td>php code</td></tr>
<tr><td><code>ucfirst()</code></td><td>先頭の1文字だけ大文字に</td><td>Php code</td></tr>
<tr><td><code>ucwords()</code></td><td>各単語の先頭を大文字に</td><td>Php Code</td></tr>
</table>
<p>次に<code>trim()</code>系です。<code>trim()</code>は文字列の<strong>前後にある空白（スペース・タブ・改行など）を取り除く</strong>関数で、フォーム入力の掃除に必ず使います。ユーザーが「 tanaka 」のように前後にスペースを入れて入力してくるのは日常茶飯事だからです。</p>
<pre><code>$input = "  hello  ";
echo trim($input);   // "hello"（前後の空白を除去）
echo ltrim($input);  // "hello  "（左＝先頭のみ）
echo rtrim($input);  // "  hello"（右＝末尾のみ）</code></pre>
<p><code>ltrim()</code>のlはleft、<code>rtrim()</code>のrはrightです。第2引数で削る文字を指定することもでき、<code>rtrim("a,b,c,", ",")</code>は末尾のカンマだけを削って"a,b,c"を返します。</p>
<p>注意点として、<code>strtoupper()</code>系は半角英字にしか効きません（全角の"ａ"は変換されない）。また入力値の正規化では「trimしてからstrtolowerする」のように組み合わせて使うのが定番パターンです。</p>`,
      task: `TODOの2か所を修正しよう。1つ目は<code>trim()</code>で前後の空白を除去し、2つ目は<code>strtoupper()</code>で大文字に変換して出力する。`,
      code: `<?php
$input = "  php tutorial  ";

// TODO: trim()を使って前後の空白を取り除いた文字列を$trimmedに代入する
$trimmed = $input;
echo "[" . $trimmed . "]\\n";

// TODO: strtolowerをstrtoupperに直して、全部大文字で出力する
echo strtolower($trimmed) . "\\n";

echo ucfirst($trimmed) . "\\n";
`,
      solution: `<?php
$input = "  php tutorial  ";

// trim()で前後の空白を除去する
$trimmed = trim($input);
echo "[" . $trimmed . "]\\n";      // [php tutorial]

// strtoupper()ですべて大文字に変換する
echo strtoupper($trimmed) . "\\n"; // PHP TUTORIAL

echo ucfirst($trimmed) . "\\n";    // Php tutorial
`,
      hints: [
        `trim()は引数の文字列の前後の空白を取り除いた「新しい文字列」を返す。元の変数は変わらない。`,
        `$trimmed = trim($input); と書く。大文字化はstrtoupper($trimmed)。`,
      ],
      expectedOutput: "PHP TUTORIAL",
    },
    {
      id: 63,
      title: "str_replaceで文字列を置換する",
      explanation: `<p><code>str_replace()</code>は文字列の中の特定の部分を別の文字列に置き換える関数です。引数は「検索文字列、置換文字列、対象文字列」の順で、<strong>対象の中に出てくるすべての箇所</strong>が置換されます。</p>
<pre><code>$text = "私は犬が好きです。犬は可愛い。";
echo str_replace("犬", "猫", $text);
// 私は猫が好きです。猫は可愛い。（2か所とも置換される）</code></pre>
<p>引数の順番は「<strong>何を、何に、どこで</strong>」と覚えましょう。「対象文字列が最初」と勘違いするミスが非常に多いので注意してください。</p>
<p>強力なのは、検索・置換に<strong>配列を渡せる</strong>ことです。複数の置換を1回の呼び出しでまとめて行えます。</p>
<pre><code>// 配列同士: "a"を"1"に、"b"を"2"に置換
echo str_replace(["a", "b"], ["1", "2"], "abc"); // 12c

// 検索が配列で置換が文字列: どちらも""に置換（＝削除）
echo str_replace(["-", " "], "", "090-1234 5678"); // 09012345678</code></pre>
<p>2つ目の例のように「置換文字列に空文字を渡して不要な文字を削除する」のは、電話番号や郵便番号の整形で頻出のテクニックです。</p>
<p>なお<code>str_replace()</code>はマルチバイト対応を意識せずとも、UTF-8の日本語をそのまま検索・置換できます（バイト列として完全一致で探すため）。大文字小文字を区別せずに置換したい場合は<code>str_ireplace()</code>という兄弟関数もあります。</p>`,
      task: `TODOの2か所を完成させよう。1つ目は文中の「犬」をすべて「猫」に置換する。2つ目は配列を使ってハイフンとスペースを一度に削除する。`,
      code: `<?php
$text = "私は犬が好きです。犬は可愛い。";
// TODO: str_replace()を使って「犬」を「猫」に置換して出力する
echo $text . "\\n";

$tel = "090-1234 5678";
// TODO: 検索文字列に配列["-", " "]を渡して、ハイフンとスペースを""に置換する
echo $tel . "\\n";
`,
      solution: `<?php
$text = "私は犬が好きです。犬は可愛い。";
// 「何を、何に、どこで」の順に渡す。すべての「犬」が置換される
echo str_replace("犬", "猫", $text) . "\\n";

$tel = "090-1234 5678";
// 検索に配列を渡し、置換を空文字にすると「まとめて削除」になる
echo str_replace(["-", " "], "", $tel) . "\\n"; // 09012345678
`,
      hints: [
        `str_replace()の引数は「検索、置換、対象」の順。対象文字列は3番目に渡す。`,
        `1つ目はstr_replace("犬", "猫", $text)。2つ目はstr_replace(["-", " "], "", $tel)。`,
      ],
      expectedOutput: "私は猫が好きです。猫は可愛い。",
    },
    {
      id: 64,
      title: "substrとmb_substr（部分文字列の取り出し）",
      explanation: `<p><code>substr()</code>は文字列の一部を取り出す関数です。引数は「対象、開始位置、長さ」で、開始位置は0から数えます。長さを省略すると末尾まで取り出します。</p>
<pre><code>$id = "user-20260802-tokyo";
echo substr($id, 0, 4);  // user（0文字目から4文字）
echo substr($id, 5, 8);  // 20260802
echo substr($id, -5);    // tokyo（マイナスは末尾から数える）</code></pre>
<p>開始位置に<strong>負の数</strong>を渡すと「末尾から数えた位置」になるのが便利なポイントです。<code>substr($file, -4)</code>で拡張子の".png"を取る、といった使い方をします。</p>
<p>ただし<code>substr()</code>は<strong>バイト単位</strong>で切り出します。日本語（1文字3バイト）の途中でぶった切ると、文字が壊れて「文字化け」した出力になります。</p>
<pre><code>$jp = "吾輩は猫である";
echo substr($jp, 3, 4);     // 文字の途中で切れて文字化けする
echo mb_substr($jp, 3, 4);  // 猫である（文字単位で正しく切れる）</code></pre>
<p>strlenとmb_strlenの関係と同じで、<strong>日本語の切り出しには<code>mb_substr()</code></strong>を使います。引数の意味は同じですが、開始位置と長さが「文字数」で解釈されます。</p>
<p>実務では「一覧画面でタイトルを20文字に丸めて表示する」「コードの先頭3文字で種別を判定する」など出番の多い関数です。日本語が混ざる可能性が少しでもあるならmb_substrを選んでおくのが安全です。</p>`,
      task: `そのまま実行すると3行目が文字化けする。<code>substr()</code>を<code>mb_substr()</code>に直して「猫である」と正しく出力されるようにしよう。`,
      code: `<?php
$id = "user-20260802-tokyo";
echo substr($id, 0, 4) . "\\n";  // user
echo substr($id, -5) . "\\n";    // tokyo

$jp = "吾輩は猫である";
// TODO: このままだと文字化けする。日本語を文字単位で切り出せる関数に直そう
echo substr($jp, 3, 4) . "\\n";
`,
      solution: `<?php
$id = "user-20260802-tokyo";
echo substr($id, 0, 4) . "\\n";  // user（半角のみならsubstrでよい）
echo substr($id, -5) . "\\n";    // tokyo（負の数は末尾から数える）

$jp = "吾輩は猫である";
// 日本語は1文字3バイトなので、文字単位のmb_substr()を使う
echo mb_substr($jp, 3, 4) . "\\n"; // 猫である（3文字目から4文字）
`,
      hints: [
        `substr()はバイト単位で切るため、3バイトで1文字の日本語は途中で壊れる。文字単位版の関数があった。`,
        `mb_substr($jp, 3, 4)に直す。開始位置3・長さ4が「文字数」として扱われる。`,
      ],
      expectedOutput: "猫である",
    },
    {
      id: 65,
      title: "strpos・str_contains・str_starts_with（検索と判定）",
      explanation: `<p>文字列の中に特定の文字列があるか調べる方法を学びます。昔からあるのが<code>strpos()</code>で、見つかった<strong>位置（0始まり）</strong>を返し、見つからなければ<code>false</code>を返します。</p>
<p>ここに有名な落とし穴があります。先頭で見つかると<code>0</code>が返りますが、<code>0 == false</code>は緩い比較では<strong>true</strong>になってしまうのです（第2章で学んだ<code>==</code>と<code>===</code>の違いです）。</p>
<pre><code>$file = "img_2026.png";
if (strpos($file, "img") != false) {  // 位置0が返り、0 != falseはfalse！
    echo "見つかった";                 // 実行されない（バグ）
}
if (strpos($file, "img") !== false) { // 型まで比較すれば正しく判定できる
    echo "見つかった";                 // 実行される
}</code></pre>
<p>このバグを根本から解決するため、PHP 8で<strong>真偽値を直接返す関数</strong>が追加されました。</p>
<table>
<tr><th>関数</th><th>判定内容</th><th>例（true になる）</th></tr>
<tr><td><code>str_contains($s, $x)</code></td><td>$xを含むか</td><td>str_contains("abc", "b")</td></tr>
<tr><td><code>str_starts_with($s, $x)</code></td><td>$xで始まるか</td><td>str_starts_with("abc", "a")</td></tr>
<tr><td><code>str_ends_with($s, $x)</code></td><td>$xで終わるか</td><td>str_ends_with("a.png", ".png")</td></tr>
</table>
<p>「含むかどうか」だけ知りたいならstr_contains、「位置」も必要ならstrposと使い分けます。新規コードでは判定にはPHP 8の3関数を使うのが現代的な書き方です。</p>`,
      task: `このコードはバグっていて「imgを含みません」と表示されてしまう。比較を<code>!==</code>に直して正しく判定させ、さらに<code>str_starts_with()</code>で「img_」で始まる場合に「画像ファイルです」と出力する判定を追加しよう。`,
      code: `<?php
$file = "img_2026_summer.png";

// このコードは意図どおりに動かない。実行して確認してから直そう
// ヒント: strposは先頭で見つかると0を返す。0 != falseの結果は？
if (strpos($file, "img") != false) {
    echo "imgを含みます\\n";
} else {
    echo "imgを含みません\\n";
}

// TODO: str_starts_with()を使い、"img_"で始まるなら「画像ファイルです」と出力する
`,
      solution: `<?php
$file = "img_2026_summer.png";

// strposの戻り値は int|false なので、必ず!==でfalseと厳密比較する
if (strpos($file, "img") !== false) {
    echo "imgを含みます\\n";
} else {
    echo "imgを含みません\\n";
}

// PHP 8ならstr_starts_with()で意図が明確に書ける
if (str_starts_with($file, "img_")) {
    echo "画像ファイルです\\n";
}

// 含むかどうかだけならstr_contains()が最も簡潔
if (str_contains($file, "summer")) {
    echo "summerを含みます\\n";
}
`,
      hints: [
        `"img"は先頭（位置0）で見つかる。0はfalseと「値としては」等しいので、!=では区別できない。`,
        `!= を !== に変えると、int(0)とbool(false)は型が違うので正しく「見つかった」と判定される。`,
        `追加分は if (str_starts_with($file, "img_")) { echo "画像ファイルです\\n"; } と書く。`,
      ],
      expectedOutput: "画像ファイルです",
    },
    {
      id: 66,
      title: "explodeとimplode（分割と結合）",
      explanation: `<p><code>explode()</code>は文字列を区切り文字で<strong>分割して配列にする</strong>関数、<code>implode()</code>は逆に配列を<strong>区切り文字でつないで1つの文字列にする</strong>関数です。名前のとおり「爆発（分解）」と「内破（結合）」で、ペアで覚えましょう。</p>
<pre><code>$csv = "りんご,みかん,ぶどう";
$fruits = explode(",", $csv);
// ["りんご", "みかん", "ぶどう"] という配列になる
echo $fruits[1]; // みかん

$joined = implode(" / ", $fruits);
echo $joined; // りんご / みかん / ぶどう</code></pre>
<p>引数の順番はどちらも<strong>区切り文字が先</strong>です（<code>explode(",", $csv)</code>、<code>implode(",", $array)</code>）。str_replaceと同様、順番の勘違いが定番のミスなので注意してください。</p>
<p>実務での出番は非常に多く、たとえば次のような場面で使います。</p>
<ul>
<li>CSVの1行やタグの一覧（"php,web,初心者"）を配列に分解して処理する</li>
<li>配列のデータをカンマ区切りにしてログやCSVとして出力する</li>
<li>URLのパス"/users/42/edit"を<code>explode("/", ...)</code>で分解する</li>
</ul>
<p>explodeで分割した各要素には前後の空白が残ることがあります（"a, b"を","で割ると2つ目は" b"）。第6章で学んだ<code>array_map()</code>と<code>trim()</code>を組み合わせて<code>array_map("trim", $parts)</code>と掃除するのが定番パターンです。また第6章の<code>sort()</code>などと組み合わせれば「分割→並べ替え→再結合」も数行で書けます。</p>`,
      task: `TODOの2か所を完成させよう。1つ目はカンマ区切りの文字列を<code>explode()</code>で配列に分割する。2つ目は<code>implode()</code>で" / "区切りの1つの文字列に結合して出力する。`,
      code: `<?php
$csv = "りんご,みかん,ぶどう";

// TODO: explode()で$csvをカンマで分割して$fruitsに代入する
$fruits = [];

echo "要素数: " . count($fruits) . "\\n";
echo "2番目: " . $fruits[1] . "\\n";

// TODO: implode()を使って" / "区切りで結合した文字列を出力する
echo "" . "\\n";
`,
      solution: `<?php
$csv = "りんご,みかん,ぶどう";

// 区切り文字が第1引数、対象文字列が第2引数
$fruits = explode(",", $csv);

echo "要素数: " . count($fruits) . "\\n"; // 3
echo "2番目: " . $fruits[1] . "\\n";      // みかん

// implodeは配列を区切り文字でつないで1つの文字列にする
echo implode(" / ", $fruits) . "\\n";     // りんご / みかん / ぶどう
`,
      hints: [
        `explode("区切り文字", 対象文字列)で配列が返る。区切り文字が先。`,
        `$fruits = explode(",", $csv); と implode(" / ", $fruits) を使う。`,
      ],
      expectedOutput: "りんご / みかん / ぶどう",
    },
    {
      id: 67,
      title: "sprintfの書式指定（%d・%s・%05d・%.2f）",
      explanation: `<p><code>sprintf()</code>は「書式（フォーマット）」に従って文字列を組み立てる関数です。書式文字列の中の<code>%</code>で始まる指定子が、後ろに並べた引数で順番に置き換えられます。</p>
<pre><code>$name = "コーヒー";
$price = 380;
echo sprintf("%sの価格は%d円です", $name, $price);
// コーヒーの価格は380円です</code></pre>
<table>
<tr><th>指定子</th><th>意味</th><th>sprintf("...", 7) の例</th></tr>
<tr><td><code>%d</code></td><td>整数</td><td>"%d" → 7</td></tr>
<tr><td><code>%s</code></td><td>文字列</td><td>"%s" → 7</td></tr>
<tr><td><code>%05d</code></td><td>5桁になるよう0で埋めた整数</td><td>"%05d" → 00007</td></tr>
<tr><td><code>%.2f</code></td><td>小数点以下2桁の小数</td><td>"%.2f" → 7.00</td></tr>
<tr><td><code>%%</code></td><td>%の文字そのもの</td><td>"%d%%" → 7%</td></tr>
</table>
<p><code>%05d</code>の読み方は「0で埋めて・全体5桁の・整数」です。注文番号や会員IDの「00042」のようなゼロ埋め表示に使います。<code>%.2f</code>は「小数点以下2桁」で、金額や割合の表示桁を揃えるのに便利です（指定桁で四捨五入されます）。</p>
<p>文字列連結（.）だけでも同じ結果は作れますが、sprintfは<strong>文全体の形が書式文字列として一目で分かる</strong>のが利点です。「連結が3つ以上続いて読みにくくなったらsprintfを検討する」を目安にするとよいでしょう。兄弟関数の<code>printf()</code>は組み立てた文字列を返す代わりにそのまま出力します。</p>`,
      task: `TODOの3行を書式指定を使って完成させよう。注文番号は<code>%05d</code>で5桁ゼロ埋め、価格の行は<code>%s</code>と<code>%d</code>、税率は<code>%.2f</code>で小数点以下2桁にする。`,
      code: `<?php
$no = 7;
$name = "コーヒー";
$price = 380;
$rate = 8.5;

// TODO: %05dを使って「注文番号: 00007」と出力する
echo sprintf("注文番号: %d", $no) . "\\n";

// TODO: %sと%dを使って「コーヒーの価格は380円です」と出力する
echo "" . "\\n";

// TODO: %.2fを使って「税率: 8.50%」と出力する（%そのものは%%と書く）
echo "" . "\\n";
`,
      solution: `<?php
$no = 7;
$name = "コーヒー";
$price = 380;
$rate = 8.5;

// %05d: 0で埋めて全体5桁の整数
echo sprintf("注文番号: %05d", $no) . "\\n";        // 注文番号: 00007

// %sは文字列、%dは整数。引数の順に置き換わる
echo sprintf("%sの価格は%d円です", $name, $price) . "\\n";

// %.2f: 小数点以下2桁。%の文字自体は%%と書く
echo sprintf("税率: %.2f%%", $rate) . "\\n";        // 税率: 8.50%
`,
      hints: [
        `書式文字列の中の%指定子が、第2引数以降の値で順番に置き換えられる。`,
        `1行目は"注文番号: %05d"に直す。2行目はsprintf("%sの価格は%d円です", $name, $price)。`,
        `3行目はsprintf("税率: %.2f%%", $rate)。%%が「%という文字」になる。`,
      ],
      expectedOutput: "注文番号: 00007",
    },
    {
      id: 68,
      title: "number_formatで数値を読みやすくする",
      explanation: `<p><code>number_format()</code>は数値を「1,234,568」のように<strong>3桁ごとのカンマ区切り</strong>の文字列に整形する関数です。金額表示のある画面ではほぼ必ず登場します。</p>
<pre><code>$price = 1234567.891;
echo number_format($price);      // 1,234,568（整数に四捨五入）
echo number_format($price, 2);   // 1,234,567.89（小数点以下2桁）
echo number_format(9800) . "円"; // 9,800円</code></pre>
<p>引数は次のとおりです。</p>
<table>
<tr><th>引数</th><th>意味</th><th>省略時</th></tr>
<tr><td>第1引数</td><td>整形する数値</td><td>必須</td></tr>
<tr><td>第2引数</td><td>小数点以下の桁数（四捨五入される）</td><td>0</td></tr>
<tr><td>第3引数</td><td>小数点の記号</td><td>"."</td></tr>
<tr><td>第4引数</td><td>3桁区切りの記号</td><td>","</td></tr>
</table>
<p>第3・第4引数を使うと、ヨーロッパ式の「1.234.567,89」（小数点がカンマ、区切りがピリオド）のような表記にも対応できます：<code>number_format($n, 2, ",", ".")</code>。</p>
<p>大事な注意点は、<strong>戻り値が数値ではなく文字列</strong>だということです。カンマ入りの"1,234,568"はもう計算に使えません。計算はすべて済ませて、<strong>画面に出す直前の最後の仕上げ</strong>としてnumber_formatをかける、という順番を守りましょう。前ステップのsprintfと組み合わせて<code>sprintf("合計: %s円", number_format($total))</code>のように使うのも定番です。</p>`,
      task: `TODOの2か所を完成させよう。1つ目は<code>$price</code>を小数点以下2桁のカンマ区切りで出力する。2つ目は合計金額をカンマ区切りにして「合計: 46,800円」と出力する。`,
      code: `<?php
$price = 1234567.891;
echo number_format($price) . "\\n"; // 1,234,568

// TODO: 第2引数を指定して小数点以下2桁で出力する（1,234,567.89）
echo $price . "\\n";

$total = 12800 + 34000;
// TODO: number_format()を使って「合計: 46,800円」と出力する
echo "合計: " . $total . "円\\n";
`,
      solution: `<?php
$price = 1234567.891;
echo number_format($price) . "\\n";    // 1,234,568（整数に四捨五入）

// 第2引数は小数点以下の桁数
echo number_format($price, 2) . "\\n"; // 1,234,567.89

$total = 12800 + 34000;
// 計算を済ませてから、表示の直前で整形するのがポイント
echo "合計: " . number_format($total) . "円\\n"; // 合計: 46,800円
`,
      hints: [
        `number_format()の第2引数が小数点以下の桁数。指定した桁で四捨五入される。`,
        `2つ目はnumber_format($price, 2)、3つ目は"合計: " . number_format($total) . "円\\n"。`,
      ],
      expectedOutput: "1,234,567.89",
    },
    {
      id: 69,
      title: "str_repeat・str_pad・strrev",
      explanation: `<p>CLIでの表示整形に便利な3つの関数を紹介します。</p>
<p><code>str_repeat()</code>は文字列を指定回数繰り返します。区切り線を引くのに最適です。</p>
<pre><code>echo str_repeat("=", 20); // ====================
echo str_repeat("ab", 3); // ababab</code></pre>
<p><code>str_pad()</code>は文字列が指定の長さになるまで<strong>別の文字で埋める（パディングする）</strong>関数です。第4引数で埋める方向を指定します。</p>
<table>
<tr><th>呼び出し</th><th>結果</th><th>用途</th></tr>
<tr><td><code>str_pad("5", 3, "0", STR_PAD_LEFT)</code></td><td>"005"</td><td>ゼロ埋め</td></tr>
<tr><td><code>str_pad("PHP", 8, ".")</code></td><td>"PHP....."</td><td>右埋め（既定）</td></tr>
<tr><td><code>str_pad("A", 5, "-", STR_PAD_BOTH)</code></td><td>"--A--"</td><td>中央寄せ風</td></tr>
</table>
<p><code>STR_PAD_LEFT</code>のような大文字の名前は、PHPがあらかじめ用意している定数です。左を埋める＝<strong>右寄せ</strong>になるので、表で数値の桁を揃えるときに重宝します。なおstr_padの長さは<strong>バイト数基準</strong>なので、日本語（1文字3バイト）を混ぜると見た目の幅は揃いません。これはmb系のない関数の共通の注意点です。</p>
<p><code>strrev()</code>は文字列を逆順にします。<code>strrev("abc")</code>は"cba"です。回文チェックなどで使いますが、これもバイト単位なので<strong>日本語に使うと文字化けします</strong>。「rev系・pad系はシングルバイト前提」と覚えておくと、いつかバグを未然に防げるはずです。</p>`,
      task: `TODOの3か所を完成させよう。<code>str_repeat()</code>で"="を20個の区切り線、<code>str_pad()</code>で"5"を3桁ゼロ埋め（005）、<code>strrev()</code>で"stressed"を逆順にして出力する。`,
      code: `<?php
// TODO: str_repeat()で"="を20個並べた区切り線を出力する
echo "====" . "\\n";

// TODO: str_pad()とSTR_PAD_LEFTで"5"を3桁ゼロ埋め（005）にする
echo "5" . "\\n";

// TODO: strrev()で"stressed"を逆順にして出力する（何という単語になる？）
echo "stressed" . "\\n";
`,
      solution: `<?php
// str_repeat(文字列, 回数)
echo str_repeat("=", 20) . "\\n"; // ====================

// str_pad(対象, 長さ, 埋める文字, 方向)。左埋め＝右寄せ
echo str_pad("5", 3, "0", STR_PAD_LEFT) . "\\n"; // 005

// strrevは逆順。バイト単位なので日本語には使わないこと
echo strrev("stressed") . "\\n"; // desserts
`,
      hints: [
        `str_repeat("=", 20)、str_pad("5", 3, "0", STR_PAD_LEFT)の形で呼び出す。`,
        `strrev("stressed")の結果はdesserts（デザート）。英単語の遊びとして有名。`,
      ],
      expectedOutput: "005",
    },
    {
      id: 70,
      title: "総合演習：レシート整形出力",
      explanation: `<p>第7章の総まとめとして、商品リストからレシート風の出力を組み立てます。使う道具はすべてこの章で学んだものです。</p>
<table>
<tr><th>関数</th><th>この演習での役割</th></tr>
<tr><td><code>str_repeat()</code></td><td>区切り線（------）を引く</td></tr>
<tr><td><code>number_format()</code></td><td>金額を3桁カンマ区切りにする</td></tr>
<tr><td><code>str_pad()</code>＋<code>STR_PAD_LEFT</code></td><td>金額を右寄せして桁を揃える</td></tr>
<tr><td><code>sprintf()</code></td><td>行の組み立て</td></tr>
</table>
<p>設計の考え方はこうです。各商品について「小計＝単価×数量」を計算しながら合計に足し込み、1行ずつ整形して出力します。金額の列は<code>str_pad(..., 10, " ", STR_PAD_LEFT)</code>で右寄せにすると、桁数が違っても末尾が揃って一気にレシートらしくなります。</p>
<pre><code>$amount = str_pad(number_format(760) . "円", 10, " ", STR_PAD_LEFT);
// "      760円" のように右寄せされる</code></pre>
<p>処理の流れは第4章で学んだ<code>foreach</code>と第5章の変数の積み上げ（<code>$total += ...</code>）の復習でもあります。「データの配列→ループで計算→整形して出力」という流れは、Webアプリで注文一覧や請求書を表示するときとまったく同じ構造です。</p>
<p>なおstr_padはバイト数基準なので、日本語の商品名が混ざると名前欄の見た目の幅は完全には揃いません。実務で厳密に揃えたい場合は<code>mb_strwidth()</code>（表示幅を数える関数）を使いますが、今回は金額の右寄せが揃っていれば合格です。</p>`,
      task: `TODOの3か所を埋めてレシートを完成させよう。小計の計算と合計への加算、金額の右寄せ整形（<code>number_format</code>＋<code>str_pad</code>）、合計行の出力の3つ。金額列は幅10で右寄せする。`,
      code: `<?php
$items = [
    ["name" => "コーヒー", "price" => 380, "qty" => 2],
    ["name" => "サンドイッチ", "price" => 450, "qty" => 1],
    ["name" => "クッキー", "price" => 1200, "qty" => 3],
];

$line = str_repeat("-", 30);
echo "        RECEIPT\\n";
echo $line . "\\n";

$total = 0;
foreach ($items as $item) {
    // TODO: 小計（単価×数量）を$subtotalに計算し、$totalに加算する
    $subtotal = 0;

    $label = $item["name"] . " x" . $item["qty"];
    // TODO: number_format($subtotal)."円" を幅10で右寄せ（STR_PAD_LEFT）して$amountに入れる
    $amount = "";
    echo str_pad($label, 20) . $amount . "\\n";
}

echo $line . "\\n";
// TODO: 「合計」ラベル（幅20）と、$totalを同じ形式で右寄せした金額を出力する
`,
      solution: `<?php
$items = [
    ["name" => "コーヒー", "price" => 380, "qty" => 2],
    ["name" => "サンドイッチ", "price" => 450, "qty" => 1],
    ["name" => "クッキー", "price" => 1200, "qty" => 3],
];

$line = str_repeat("-", 30);
echo "        RECEIPT\\n";
echo $line . "\\n";

$total = 0;
foreach ($items as $item) {
    // 小計を計算して合計に積み上げる
    $subtotal = $item["price"] * $item["qty"];
    $total += $subtotal;

    $label = $item["name"] . " x" . $item["qty"];
    // 金額はカンマ区切りにしてから幅10で右寄せする
    $amount = str_pad(number_format($subtotal) . "円", 10, " ", STR_PAD_LEFT);
    echo str_pad($label, 20) . $amount . "\\n";
}

echo $line . "\\n";
// 合計行も明細と同じ整形ルールで揃える
echo str_pad("合計", 20) . str_pad(number_format($total) . "円", 10, " ", STR_PAD_LEFT) . "\\n";
`,
      hints: [
        `小計は$item["price"] * $item["qty"]。$total += $subtotal; で積み上げる。`,
        `金額はstr_pad(number_format($subtotal) . "円", 10, " ", STR_PAD_LEFT)で右寄せできる。`,
        `合計はコーヒー760円＋サンドイッチ450円＋クッキー3,600円で4,810円になるはず。`,
      ],
      expectedOutput: "4,810円",
    },
  ],
});
