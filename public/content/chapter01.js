// 第1章：はじめてのPHP
registerChapter({
  number: 1,
  title: "はじめてのPHP",
  description: "PHPの開始タグ、echoによる出力、変数と定数、文字列の組み立てなど、PHPプログラミングの第一歩を学びます。",
  steps: [
    {
      id: 1,
      title: "Hello Worldとecho",
      explanation: `<p>PHPはWebサイトの裏側（サーバーサイド）で広く使われているプログラミング言語です。WordPressやLaravelなど、世界中のWebサービスを支えています。まずは伝統の「Hello, World!」を出力してみましょう。</p>
<p>PHPのコードは<code>&lt;?php</code>という<strong>開始タグ</strong>から書き始めます。このタグより後ろがPHPのプログラムとして実行されます。ファイル全体がPHPコードの場合、終了タグ<code>?&gt;</code>は書かないのが公式推奨です（ファイル末尾の余計な改行が出力されてしまう事故を防ぐためです）。</p>
<pre><code>&lt;?php
echo 'Hello, World!';</code></pre>
<p><code>echo</code>は文字列を出力する命令です。出力したい文字列はシングルクォート<code>'</code>で囲みます。文の終わりには必ずセミコロン<code>;</code>を付けます。セミコロンは「文がここで終わる」ことを示す大切な区切り記号です。</p>
<p>この教材ではCLI（コマンドライン）での実行を前提に学びます。CLIとはターミナル上で<code>php ファイル名.php</code>のようにコマンドを打って実行する方法のことで、出力はそのままターミナルに表示されます。Webサーバー経由だとブラウザに表示されますが、言語の基礎を学ぶにはCLIのほうがシンプルで確認しやすいのです。</p>`,
      task: `まずはそのまま実行して出力を確認しましょう。次に、出力される文字列を<code>Hello, PHP!</code>に書き換えて再実行してください。`,
      code: `<?php
// まずはこのまま実行してみましょう
echo 'Hello, World!';`,
      solution: `<?php
// クォートの中の文字列がそのまま出力される
echo 'Hello, PHP!';`,
      hints: [
        `echoの後ろにあるシングルクォートの中身が、そのまま画面に出力されます。`,
        `クォートの中の文字列だけをHello, PHP!に書き換えます。セミコロンを消さないように注意しましょう。`
      ],
      expectedOutput: "Hello, PHP!"
    },
    {
      id: 2,
      title: "構文エラーを体験する",
      explanation: `<p>プログラミング学習で最初にぶつかる壁が<strong>構文エラー（Parse error）</strong>です。構文エラーとは、PHPの文法ルールに違反した書き方をしたためにプログラムを実行できない状態のことです。今回はわざと壊れたコードを実行して、エラーメッセージを読む練習をします。</p>
<p>PHPで特に多いのが<strong>セミコロン忘れ</strong>です。文の終わりのセミコロンを忘れると、次のような形のエラーが表示されます。</p>
<pre><code>PHP Parse error:  syntax error, unexpected token "echo",
expecting "," or ";" in test.php on line 4</code></pre>
<p>エラーメッセージの読み方のコツは次の3点です。</p>
<ul>
<li><strong>種類</strong>：Parse error＝文法エラーで、プログラムは1行も実行されません</li>
<li><strong>内容</strong>：unexpected token "echo"＝「予期しない場所にechoが現れた」という意味です</li>
<li><strong>場所</strong>：on line 4＝4行目でエラーを検出した、という意味です</li>
</ul>
<p>ここで重要なのは、<strong>エラーが報告される行は「原因の行」ではなく「異変に気づいた行」</strong>だということです。セミコロンを忘れた行の「次の行」でエラーが報告されることが多いため、報告された行の1つ前も必ず確認する習慣を付けましょう。エラーメッセージは敵ではなく、間違いの場所を教えてくれる味方です。</p>`,
      task: `このコードは実行するとParse errorになります。まず実行してエラーメッセージを読み、足りないセミコロンを補って2つのメッセージが出力されるように直してください。`,
      code: `<?php
// このコードはわざと壊れています。まず実行してエラーメッセージを読みましょう
echo 'PHPの文はセミコロンで終わる'
echo 'エラーを直せたら成功です';`,
      solution: `<?php
// 1つ目のechoの行末にセミコロンを補った
echo 'PHPの文はセミコロンで終わる';
echo 'エラーを直せたら成功です';`,
      hints: [
        `エラーメッセージのon line Nは「異変に気づいた行」です。その1つ前の行を見てみましょう。`,
        `1つ目のecho文の行末に;が抜けています。`
      ],
      expectedOutput: "エラーを直せたら成功です"
    },
    {
      id: 3,
      title: "echoとprint、改行PHP_EOL",
      explanation: `<p>PHPで文字列を出力する命令には<code>echo</code>と<code>print</code>の2つがあります。違いを表で整理しましょう。</p>
<table>
<tr><th></th><th>echo</th><th>print</th></tr>
<tr><td>複数の値をカンマ区切りで渡す</td><td>できる</td><td>できない（1つだけ）</td></tr>
<tr><td>戻り値</td><td>なし</td><td>常に1を返す</td></tr>
<tr><td>実務での使用頻度</td><td>高い</td><td>低い</td></tr>
</table>
<p>実務ではほぼ<code>echo</code>だけ覚えれば十分です。echoはカンマ区切りで複数の値を続けて出力できます。</p>
<pre><code>echo 'おはよう', 'こんにちは';  // おはようこんにちは と続けて出力される</code></pre>
<p>ところで、echoは自動では改行してくれません。改行したい場所には<strong>PHP_EOL</strong>という定義済み定数を出力します。EOLはEnd Of Line（行末）の略で、OSに合った改行文字（LinuxやmacOSでは\\n、Windowsでは\\r\\n）に自動でなってくれます。</p>
<pre><code>echo 'おはよう', PHP_EOL;
echo 'こんにちは', PHP_EOL;</code></pre>
<p>ダブルクォート文字列の中で<code>\\n</code>と書いても改行できますが（第15ステップで学びます）、まずはどこでも使えるPHP_EOLに慣れておくのがおすすめです。</p>`,
      task: `2つのecho文がつながって1行で出力されてしまいます。それぞれの行末にカンマ区切りで<code>PHP_EOL</code>を追加して、2行に分けて出力してください。`,
      code: `<?php
// 2行に分けて出力したいのに、1行につながってしまいます
echo 'おはよう';
echo 'こんにちは';`,
      solution: `<?php
// カンマ区切りでPHP_EOLを渡すと行末で改行される
echo 'おはよう', PHP_EOL;
echo 'こんにちは', PHP_EOL;`,
      hints: [
        `echoはカンマ区切りで複数の値を出力できます。文字列の後ろに改行用の定数を続けましょう。`,
        `echo 'おはよう', PHP_EOL; のように書きます。PHP_EOLはクォートで囲みません。`
      ],
      expectedOutput: "おはよう\nこんにちは"
    },
    {
      id: 4,
      title: "コメントの書き方",
      explanation: `<p><strong>コメント</strong>とは、プログラムの実行に影響しないメモ書きのことです。コードの意図や背景を残したり、一時的にコードを無効化（コメントアウト）したりするのに使います。PHPには3種類の書き方があります。</p>
<table>
<tr><th>書き方</th><th>範囲</th><th>主な用途</th></tr>
<tr><td><code>// コメント</code></td><td>行末まで</td><td>もっとも一般的。1行のメモ</td></tr>
<tr><td><code># コメント</code></td><td>行末まで</td><td>//と同じ働き。あまり使われない</td></tr>
<tr><td><code>/* コメント */</code></td><td>/*から*/まで</td><td>複数行のメモや、まとまったコードの無効化</td></tr>
</table>
<pre><code>&lt;?php
// これは1行コメント
echo 'A';  // 行の途中から後ろもコメントにできる

/*
  ここは複数行コメント。
  この中に書いたechoは実行されない。
*/
echo 'B';</code></pre>
<p>行頭に<code>//</code>を付けてコードを無効化することを<strong>コメントアウト</strong>と呼びます。動作を確認しながら「この行を消したらどうなるか」を試すときに便利で、デバッグ（不具合調査）の基本テクニックです。</p>
<p>良いコメントは「何をしているか」ではなく「なぜそうしているか」を書くものです。コードを読めば分かることを繰り返すのではなく、背景や理由を残すよう意識すると、未来の自分やチームの助けになります。</p>`,
      task: `1つ目のecho文の行頭に<code>//</code>を付けてコメントアウトし、「コメントを理解した」だけが出力されるようにしてください。`,
      code: `<?php
echo 'この行は出力しない', PHP_EOL;
echo 'コメントを理解した', PHP_EOL;`,
      solution: `<?php
// echo 'この行は出力しない', PHP_EOL;
echo 'コメントを理解した', PHP_EOL;`,
      hints: [
        `行頭に//を付けると、その行は実行されなくなります。`,
        `1行目のechoの前に//を書き足すだけです。削除はしません。`
      ],
      expectedOutput: "コメントを理解した"
    },
    {
      id: 5,
      title: "変数（$で始まる）",
      explanation: `<p><strong>変数</strong>とは、値に名前を付けて保存しておく「箱」のようなものです。PHPの変数は必ず<strong>ドル記号$</strong>で始まるのが大きな特徴です。他の多くの言語（JavaScriptやPythonなど）には無いルールなので、最初にしっかり覚えましょう。</p>
<pre><code>&lt;?php
$name = 'PHP';       // $nameという変数に文字列'PHP'を代入
echo $name, PHP_EOL;  // 変数の中身が出力される</code></pre>
<p><code>=</code>は「等しい」ではなく<strong>代入</strong>（右の値を左の変数に入れる操作）を意味します。数学のイコールとは別物です。</p>
<p>変数をechoするときは、クォートで囲まずにそのまま書きます。<code>echo '$name';</code>のようにシングルクォートで囲むと、変数の中身ではなく<code>$name</code>という文字がそのまま出力されてしまうので注意してください。</p>
<p>また、PHPは<strong>動的型付け言語</strong>です。変数を使う前に「この変数は文字列用」のような型の宣言は不要で、代入した値によって型が自動的に決まります。手軽な反面、意図しない型の値が入っても気づきにくいという側面もあり、その付き合い方は第2章「データ型」でじっくり学びます。</p>`,
      task: `<code>$language</code>という変数に文字列<code>'学習中'</code>を代入し、echoで出力する2行を追加してください。`,
      code: `<?php
$name = 'PHP';
echo $name, PHP_EOL;

// TODO: この下に$languageという変数を作って'学習中'を代入し、echoで出力しましょう`,
      solution: `<?php
$name = 'PHP';
echo $name, PHP_EOL;

$language = '学習中';
echo $language, PHP_EOL;`,
      hints: [
        `変数への代入は「$変数名 = 値;」の形で書きます。変数名の前の$を忘れずに。`,
        `$language = '学習中'; と代入してから echo $language, PHP_EOL; で出力します。`
      ],
      expectedOutput: "学習中"
    },
    {
      id: 6,
      title: "変数の命名規則と再代入",
      explanation: `<p>変数名は自由に付けられますが、PHPの文法上のルールがあります。</p>
<table>
<tr><th>ルール</th><th>OKな例</th><th>NGな例</th></tr>
<tr><td>$の直後は英字か_で始める</td><td><code>$score</code> <code>$_tmp</code></td><td><code>$1st_score</code>（数字始まり）</td></tr>
<tr><td>使える文字は英数字と_のみ</td><td><code>$user_name</code></td><td><code>$user-name</code>（ハイフン不可）</td></tr>
<tr><td>大文字と小文字は区別される</td><td><code>$name</code>と<code>$Name</code>は別の変数</td><td>―</td></tr>
</table>
<p>文法ルールとは別に、読みやすさのための<strong>命名慣習</strong>もあります。PHPでは単語の区切りを大文字にする<strong>キャメルケース</strong>（例：<code>$userName</code>）が広く使われています。プロジェクト内でスタイルを統一することが何より大切です。</p>
<p>次に<strong>再代入</strong>です。変数は同じ名前に何度でも値を入れ直すことができ、最後に代入した値だけが残ります。</p>
<pre><code>$score = 50;
$score = 80;          // 50は上書きされて消える
echo $score;          // 80</code></pre>
<p>再代入は便利ですが、1つの変数を使い回しすぎるとコードが追いにくくなります。「1つの変数には1つの役割」を意識すると読みやすいコードになります。</p>`,
      task: `変数名が数字で始まっているためParse errorになります。<code>$1st_score</code>を<code>$firstScore</code>に直して、90と80が出力されるようにしてください。`,
      code: `<?php
// 変数名が文法違反なのでParse errorになります。正しい名前に直しましょう
$1st_score = 90;
echo $1st_score, PHP_EOL;

// 再代入：あとから代入した値で上書きされる
$score = 50;
$score = 80;
echo $score, PHP_EOL;`,
      solution: `<?php
// 変数名は英字か_で始める必要がある
$firstScore = 90;
echo $firstScore, PHP_EOL;

// 再代入：あとから代入した値で上書きされる
$score = 50;
$score = 80;
echo $score, PHP_EOL;`,
      hints: [
        `変数名の$の直後に数字は使えません。英字で始まる名前に変えましょう。`,
        `$1st_scoreが登場する2箇所を、両方とも$firstScoreに変更します。`
      ],
      expectedOutput: "80"
    },
    {
      id: 7,
      title: "定数const",
      explanation: `<p><strong>定数</strong>とは、一度決めたら変更できない値のことです。消費税率やアプリ名のように「プログラムの実行中に変わってはいけない値」に使います。<code>const</code>キーワードで定義します。</p>
<pre><code>&lt;?php
const APP_NAME = 'PHP 200 Steps';
echo APP_NAME, PHP_EOL;</code></pre>
<p>変数との違いを整理しましょう。</p>
<table>
<tr><th></th><th>変数</th><th>定数</th></tr>
<tr><td>書き方</td><td><code>$name = 値;</code></td><td><code>const NAME = 値;</code></td></tr>
<tr><td>$記号</td><td>付ける</td><td>付けない</td></tr>
<tr><td>再代入</td><td>できる</td><td>できない（エラーになる）</td></tr>
<tr><td>命名慣習</td><td>キャメルケースなど</td><td>大文字とアンダースコア（例：TAX_RATE）</td></tr>
</table>
<p>定数名を<code>TAX_RATE</code>のようにすべて大文字で書くのは、コードを読む人が「これは変更されない値だ」と一目で分かるようにするための慣習です。</p>
<p>定数を使う最大のメリットは<strong>意図が伝わること</strong>です。コード中に突然<code>0.1</code>という数値が現れるより、<code>TAX_RATE</code>という名前が付いているほうが意味が明確ですし、税率が変わったときも定義の1箇所を直すだけで済みます。このような説明のない数値は「マジックナンバー」と呼ばれ、避けるべきものとされています。なお、定数を定義する方法には<code>define()</code>関数もありますが、まずはシンプルな<code>const</code>を使えれば十分です。</p>`,
      task: `消費税率を表す定数<code>TAX_RATE</code>を<code>0.1</code>で定義し、echoで出力する2行を追加してください。`,
      code: `<?php
const APP_NAME = 'PHP 200 Steps';
echo APP_NAME, PHP_EOL;

// TODO: この下に定数TAX_RATEを0.1で定義し、echoで出力しましょう`,
      solution: `<?php
const APP_NAME = 'PHP 200 Steps';
echo APP_NAME, PHP_EOL;

const TAX_RATE = 0.1;
echo TAX_RATE, PHP_EOL;`,
      hints: [
        `定数の定義は「const 定数名 = 値;」の形です。定数名に$は付けません。`,
        `const TAX_RATE = 0.1; と定義してから echo TAX_RATE, PHP_EOL; で出力します。`
      ],
      expectedOutput: "0.1"
    },
    {
      id: 8,
      title: "var_dumpで中身を観察",
      explanation: `<p><code>var_dump()</code>は、値の<strong>型と中身</strong>を詳しく表示してくれる関数です。echoは値を人間向けに表示するだけですが、var_dumpは「その値が何型で、正確にはどんな値か」まで教えてくれます。開発中の調査（デバッグ）で最もよく使う道具の1つです。</p>
<pre><code>&lt;?php
var_dump('PHP');   // string(3) "PHP"
var_dump(200);     // int(200)</code></pre>
<p>出力の読み方は次のとおりです。</p>
<ul>
<li><code>string(3) "PHP"</code>：文字列型で、長さは3バイト、中身は"PHP"</li>
<li><code>int(200)</code>：整数型で、値は200</li>
</ul>
<p>1つ注意点があります。stringのカッコ内の数字は「文字数」ではなく<strong>バイト数</strong>です。日本語の文字はUTF-8では1文字あたり3バイトで表現されることが多いため、<code>var_dump('あ');</code>は<code>string(3) "あ"</code>と表示されます。「1文字なのに3？」と驚かないようにしましょう。</p>
<p>echoとの使い分けはシンプルです。<strong>ユーザーに見せる出力はecho、開発中に中身を確認したいときはvar_dump</strong>と覚えてください。この後の章でも「この値はいま何型だろう？」と思ったら、すぐvar_dumpで観察する習慣を付けると、理解のスピードが大きく上がります。</p>`,
      task: `変数<code>$step</code>に整数<code>8</code>を代入し、<code>var_dump($step)</code>で観察する2行を追加してください。<code>int(8)</code>と表示されれば成功です。`,
      code: `<?php
// var_dumpは型と値の両方を表示してくれる
var_dump('PHP');
var_dump(200);

// TODO: この下で$stepに8を代入し、var_dumpで観察しましょう`,
      solution: `<?php
// var_dumpは型と値の両方を表示してくれる
var_dump('PHP');
var_dump(200);

$step = 8;
var_dump($step);`,
      hints: [
        `まず$stepに8を代入し、その変数をvar_dumpに渡します。`,
        `$step = 8; のあとに var_dump($step); と書きます。カッコの中に変数を入れるのがポイントです。`
      ],
      expectedOutput: "int(8)"
    },
    {
      id: 9,
      title: "文字列連結（.演算子）とsprintf",
      explanation: `<p>変数と文字列を組み合わせて1つの文を作りたい場面は非常に多くあります。PHPでは<strong>ドット.</strong>が文字列を連結する演算子です（多くの言語の+とは違うので注意）。</p>
<pre><code>$name = 'PHP';
echo 'こんにちは、' . $name . 'の世界！';  // こんにちは、PHPの世界！</code></pre>
<p>連結する部品が増えると読みにくくなってきます。そこで便利なのが<code>sprintf()</code>関数です。<strong>テンプレート（ひな型）に値を流し込む</strong>イメージで文字列を組み立てられます。</p>
<pre><code>$message = sprintf('%sはバージョン%dです', 'PHP', 8);
echo $message;  // PHPはバージョン8です</code></pre>
<p>%から始まる記号は<strong>フォーマット指定子</strong>と呼ばれ、流し込む値の種類を表します。</p>
<table>
<tr><th>指定子</th><th>意味</th><th>例</th></tr>
<tr><td><code>%s</code></td><td>文字列</td><td>'PHP'</td></tr>
<tr><td><code>%d</code></td><td>整数</td><td>8</td></tr>
<tr><td><code>%f</code></td><td>小数</td><td>3.14（%.1fで小数1桁に丸めて表示）</td></tr>
</table>
<p>なお、PHPにはダブルクォート文字列の中に変数を直接埋め込む「変数展開」という機能もありますが、埋め込み位置が分かりにくくバグの温床にもなりやすいため、この教材では<strong>連結またはsprintfで組み立てる方針</strong>で統一します。部品が2〜3個なら連結、形式が決まった文ならsprintf、と使い分けるのがおすすめです。</p>`,
      task: `<code>sprintf('%sはバージョン%dです', $name, 8)</code>の結果を<code>$message</code>に代入し、echoで出力する行を追加してください。`,
      code: `<?php
$name = 'PHP';
// .演算子による連結
echo 'こんにちは、' . $name . 'の世界！' . PHP_EOL;

// TODO: sprintfで「PHPはバージョン8です」という文字列を$messageに作り、echoで出力しましょう`,
      solution: `<?php
$name = 'PHP';
// .演算子による連結
echo 'こんにちは、' . $name . 'の世界！' . PHP_EOL;

// sprintfはテンプレートに値を流し込んで文字列を作る
$message = sprintf('%sはバージョン%dです', $name, 8);
echo $message, PHP_EOL;`,
      hints: [
        `sprintfの第1引数はテンプレート文字列、第2引数以降が%sや%dの位置に流し込まれる値です。`,
        `$message = sprintf('%sはバージョン%dです', $name, 8); と書いてから echo $message, PHP_EOL; で出力します。`
      ],
      expectedOutput: "PHPはバージョン8です"
    },
    {
      id: 10,
      title: "総合演習：自己紹介カード",
      explanation: `<p>第1章の総仕上げとして、これまで学んだ知識を全部使って「自己紹介カード」を整形出力します。使う道具を振り返りましょう。</p>
<ul>
<li><strong>echo</strong>：文字列の出力（ステップ1）</li>
<li><strong>PHP_EOL</strong>：改行（ステップ3）</li>
<li><strong>変数</strong>：<code>$name</code>のように$で始まる（ステップ5）</li>
<li><strong>定数const</strong>：変更されない値に名前を付ける（ステップ7）</li>
<li><strong>連結.とsprintf</strong>：文字列の組み立て（ステップ9）</li>
</ul>
<p>今回のような「決まった形式の文書を出力する」処理では、連結とsprintfの使い分けが活きてきます。</p>
<pre><code>echo '名前：' . $name . PHP_EOL;          // 部品が少なければ連結
echo sprintf('年齢：%d歳', $age), PHP_EOL;  // 数値を埋め込むならsprintfが安全</code></pre>
<p>sprintfの<code>%d</code>は整数専用の指定子なので、「年齢に文字列が紛れ込んでいた」といった異常にも気づきやすくなります。単純な出力処理でも、値の種類に合った道具を選ぶ意識が品質につながります。</p>
<p>また、カードのタイトルのような固定文言を定数にしておくと、「この値は書き換わらない」という意図が明確になり、複数箇所で使い回すときも修正が1箇所で済みます。小さなプログラムのうちから、変数と定数を意図的に使い分ける習慣を付けましょう。</p>`,
      task: `TODOの位置に3行追加し、名前・年齢・趣味の行を出力して自己紹介カードを完成させてください。年齢の行は<code>sprintf('年齢：%d歳', $age)</code>を使いましょう。`,
      code: `<?php
const CARD_TITLE = '自己紹介カード';
$name = '山田太郎';
$age = 25;
$hobby = 'プログラミング';

echo '==== ' . CARD_TITLE . ' ====' . PHP_EOL;
// TODO: 以下の3行を出力しましょう
// 名前：山田太郎
// 年齢：25歳
// 趣味：プログラミング`,
      solution: `<?php
const CARD_TITLE = '自己紹介カード';
$name = '山田太郎';
$age = 25;
$hobby = 'プログラミング';

echo '==== ' . CARD_TITLE . ' ====' . PHP_EOL;
echo '名前：' . $name . PHP_EOL;
echo sprintf('年齢：%d歳', $age), PHP_EOL;
echo '趣味：' . $hobby . PHP_EOL;`,
      hints: [
        `名前と趣味の行は.演算子の連結で、年齢の行はsprintfで組み立てるのがおすすめです。`,
        `名前の行は echo '名前：' . $name . PHP_EOL; の形です。年齢と趣味も同じ要領で書きましょう。`,
        `年齢の行は echo sprintf('年齢：%d歳', $age), PHP_EOL; と書けます。`
      ],
      expectedOutput: "年齢：25歳"
    }
  ]
});
