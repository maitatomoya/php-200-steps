// 第2章：データ型
registerChapter({
  number: 2,
  title: "データ型",
  description: "int・float・bool・string・nullといったPHPの基本データ型と、型変換や比較の落とし穴を学びます。",
  steps: [
    {
      id: 11,
      title: "int型（整数）",
      explanation: `<p>ここからはPHPが扱う<strong>データ型</strong>を1つずつ見ていきます。データ型とは「値の種類」のことで、種類によってできる操作や注意点が変わります。まずは最も基本的な<strong>int型（整数）</strong>です。</p>
<pre><code>$count = 100;
var_dump($count);   // int(100)</code></pre>
<p>intはintegerの略で、小数点を含まない数を表します。マイナスの値も扱えます。桁の大きい数値は、アンダースコア<code>_</code>で3桁ごとに区切って書くと読みやすくなります（PHP 7.4以降の機能で、実行結果には影響しません）。</p>
<pre><code>$population = 1_000_000;   // 100万。1000000と同じ値
var_dump($population);      // int(1000000)</code></pre>
<p>intが扱える値には上限があり、64ビット環境では約922京（<code>PHP_INT_MAX</code>定数で確認できます）です。日常的な計算で困ることはまずありませんが、上限を超えると自動的にfloat型（次のステップで学びます）に変わって精度が落ちるため、「intは無限に大きい数を扱えるわけではない」ことは頭の片隅に置いておきましょう。</p>
<p>なお、数値はクォートで囲みません。<code>'100'</code>と書くと数値ではなく文字列になってしまいます。この違いは後のステップで重要になるので、var_dumpで型を確認する癖を付けておきましょう。</p>`,
      task: `変数<code>$year</code>に整数<code>2026</code>を代入し、var_dumpで観察する2行を追加してください。<code>int(2026)</code>と表示されれば成功です。`,
      code: `<?php
$count = 100;
var_dump($count);

// アンダースコア区切りは読みやすさのための記法
$population = 1_000_000;
var_dump($population);

// TODO: この下で$yearに2026を代入し、var_dumpで観察しましょう`,
      solution: `<?php
$count = 100;
var_dump($count);

// アンダースコア区切りは読みやすさのための記法
$population = 1_000_000;
var_dump($population);

$year = 2026;
var_dump($year);`,
      hints: [
        `整数はクォートで囲まずにそのまま書きます。`,
        `$year = 2026; と代入してから var_dump($year); で観察します。`
      ],
      expectedOutput: "int(2026)"
    },
    {
      id: 12,
      title: "float型と小数計算の注意",
      explanation: `<p><strong>float型（浮動小数点数）</strong>は小数を表す型です。<code>3.14</code>のように小数点を付けて書きます。ここで、プログラミング全般に共通する重要な罠を体験してもらいます。次のコードの結果を予想してみてください。</p>
<pre><code>var_dump(0.1 + 0.2);   // float(0.30000000000000004)</code></pre>
<p>なんと0.3ちょうどになりません。これはPHPのバグではなく、コンピュータが小数を<strong>2進数</strong>で近似して保存しているために起きる、ほぼすべての言語に共通する現象です。10進数の0.1は2進数では割り切れない無限小数になるため、ごくわずかな誤差が生じるのです。</p>
<p>この性質から、実務では次の2点が鉄則になります。</p>
<ul>
<li><strong>floatの等価比較をしない</strong>：0.1+0.2と0.3を比較してもfalseになってしまいます</li>
<li><strong>金額計算にfloatを使わない</strong>：誤差が積み重なると致命的です。金額は「12345円」のようにintで扱うのが定石です</li>
</ul>
<p>表示のうえで小数を丸めたいときは<code>round()</code>関数を使います。</p>
<pre><code>$rounded = round(0.30000000000000004, 1);   // 小数第1位に丸める
var_dump($rounded);                          // float(0.3)</code></pre>
<p>round(値, 桁数)の第2引数は「小数第何位まで残すか」です。誤差の存在を知っていること自体が、初心者とそうでない人を分ける知識の1つです。</p>`,
      task: `まず実行して<code>0.1 + 0.2</code>が0.3ちょうどにならないことを観察してください。そのあと<code>round($result, 1)</code>の結果を<code>$rounded</code>に代入してvar_dumpする2行を追加しましょう。`,
      code: `<?php
$result = 0.1 + 0.2;
// 0.3ちょうどにならないことを観察しましょう
var_dump($result);

// TODO: round($result, 1)の結果を$roundedに代入し、var_dumpで観察しましょう`,
      solution: `<?php
$result = 0.1 + 0.2;
// 0.3ちょうどにならないことを観察しましょう
var_dump($result);

// roundで小数第1位に丸める
$rounded = round($result, 1);
var_dump($rounded);`,
      hints: [
        `roundの第1引数は丸めたい値、第2引数は残す小数の桁数です。`,
        `$rounded = round($result, 1); のあとに var_dump($rounded); と書きます。`
      ],
      expectedOutput: "float(0.3)"
    },
    {
      id: 13,
      title: "数値演算と整数除算intdiv",
      explanation: `<p>PHPの数値演算に使う主な演算子をまとめます。</p>
<table>
<tr><th>演算子</th><th>意味</th><th>例</th><th>結果</th></tr>
<tr><td><code>+</code></td><td>足し算</td><td><code>7 + 2</code></td><td>9</td></tr>
<tr><td><code>-</code></td><td>引き算</td><td><code>7 - 2</code></td><td>5</td></tr>
<tr><td><code>*</code></td><td>掛け算</td><td><code>7 * 2</code></td><td>14</td></tr>
<tr><td><code>/</code></td><td>割り算</td><td><code>7 / 2</code></td><td>3.5</td></tr>
<tr><td><code>%</code></td><td>余り（剰余）</td><td><code>7 % 2</code></td><td>1</td></tr>
<tr><td><code>**</code></td><td>べき乗</td><td><code>2 ** 3</code></td><td>8</td></tr>
</table>
<p>注意したいのは<strong>割り算/の結果の型</strong>です。intどうしの割り算でも、割り切れない場合の結果はfloatになります（<code>7 / 2</code>は<code>float(3.5)</code>。割り切れる<code>6 / 3</code>は<code>int(2)</code>のまま）。</p>
<p>「小数は要らない、商だけ欲しい」ときは<strong>intdiv()関数（整数除算）</strong>を使います。整数除算とは、割り算の結果の小数部分を切り捨てて商だけを求める計算のことです。余りが欲しいときは<code>%</code>演算子と組み合わせます。</p>
<pre><code>echo intdiv(7, 2);   // 3（商）
echo 7 % 2;          // 1（余り）</code></pre>
<p>この組み合わせは「7個のりんごを2人で分けると1人3個で1個余る」のような場面で活躍します。ページ分割（ページネーション）や時間の計算（秒を分と秒に分解する）など、実務でも登場頻度の高い計算パターンです。</p>`,
      task: `<code>intdiv(7, 2)</code>と<code>7 % 2</code>を使って「商は3であまりは1」という1行を出力するecho文を追加してください。`,
      code: `<?php
echo 7 + 2, PHP_EOL;
// intどうしでも割り切れなければ結果はfloatになる
echo 7 / 2, PHP_EOL;

// TODO: intdivと%を使って「商は3であまりは1」と出力しましょう
// echo '商は', ここ, 'であまりは', ここ, PHP_EOL; の形が使えます`,
      solution: `<?php
echo 7 + 2, PHP_EOL;
// intどうしでも割り切れなければ結果はfloatになる
echo 7 / 2, PHP_EOL;

// intdivで商、%で余りを求める
echo '商は', intdiv(7, 2), 'であまりは', 7 % 2, PHP_EOL;`,
      hints: [
        `商はintdiv(7, 2)、余りは7 % 2で求められます。`,
        `echoはカンマ区切りで文字列と計算結果を交互に並べて出力できます。`
      ],
      expectedOutput: "商は3であまりは1"
    },
    {
      id: 14,
      title: "bool型とvar_dumpでの表示",
      explanation: `<p><strong>bool型（論理型）</strong>は「はい／いいえ」を表す型で、値は<code>true</code>（真）と<code>false</code>（偽）の2つだけです。「処理が成功したか」「ユーザーはログイン済みか」など、プログラムの分岐条件の主役になる型です（分岐そのものは次章で学びます）。</p>
<pre><code>$isReady = true;
$isFinished = false;</code></pre>
<p>boolの変数名は<code>$isReady</code>や<code>$hasError</code>のように、is・has・canなどで始めると「これはtrue/falseが入る変数だ」と一目で伝わります。実務でも広く使われる命名テクニックです。</p>
<p>boolで注意したいのが<strong>echoでの表示</strong>です。</p>
<table>
<tr><th>値</th><th>echoの表示</th><th>var_dumpの表示</th></tr>
<tr><td><code>true</code></td><td>1</td><td>bool(true)</td></tr>
<tr><td><code>false</code></td><td>（何も表示されない）</td><td>bool(false)</td></tr>
</table>
<p>echoだとtrueは<code>1</code>になり、falseに至っては<strong>空文字列</strong>になって画面に何も出ません。「出力されないのはバグ？」と混乱しがちですが、これはechoが値を文字列に変換してから表示する仕様のためです。boolの中身を確認したいときは必ずvar_dumpを使いましょう。<code>bool(true)</code>／<code>bool(false)</code>とはっきり表示してくれます。ステップ8で学んだ「調査にはvar_dump」の原則が、boolでは特に効いてきます。</p>`,
      task: `変数<code>$isFinished</code>に<code>false</code>を代入し、var_dumpで観察する2行を追加してください。<code>bool(false)</code>と表示されれば成功です。`,
      code: `<?php
$isReady = true;
var_dump($isReady);

// echoだとtrueは1になり、falseは何も表示されない
echo $isReady, PHP_EOL;

// TODO: この下で$isFinishedにfalseを代入し、var_dumpで観察しましょう`,
      solution: `<?php
$isReady = true;
var_dump($isReady);

// echoだとtrueは1になり、falseは何も表示されない
echo $isReady, PHP_EOL;

$isFinished = false;
var_dump($isFinished);`,
      hints: [
        `trueやfalseはクォートで囲みません。囲むと文字列になってしまいます。`,
        `$isFinished = false; のあとに var_dump($isFinished); と書きます。`
      ],
      expectedOutput: "bool(false)"
    },
    {
      id: 15,
      title: "string型とクォートの違い",
      explanation: `<p><strong>string型（文字列）</strong>を囲む記号には、シングルクォート<code>'</code>とダブルクォート<code>"</code>の2種類があります。見た目は似ていますが、動作に大きな違いがあります。</p>
<table>
<tr><th></th><th>シングルクォート</th><th>ダブルクォート</th></tr>
<tr><td>書いた文字</td><td>ほぼそのまま出力</td><td>特別な解釈をする</td></tr>
<tr><td><code>\\n</code>などのエスケープ</td><td>そのまま2文字として出力</td><td>改行などに変換される</td></tr>
<tr><td>変数の埋め込み（変数展開）</td><td>されない</td><td>される</td></tr>
</table>
<pre><code>echo 'A\\nB';   // A\\nB とそのまま表示される
echo "A\\nB";   // AとBの間で改行される</code></pre>
<p><code>\\n</code>のようにバックスラッシュで始まる特別な記法を<strong>エスケープシーケンス</strong>と呼びます。ダブルクォートの中でだけ効果を発揮します。</p>
<p>またダブルクォートには、文字列中の変数を自動で中身に置き換える<strong>変数展開</strong>という機能もあります。一見便利ですが、どこからどこまでが変数名か曖昧になりやすく、記号の付け忘れによるバグの温床にもなります。そこでこの教材では一貫して、<strong>文字列の組み立ては連結（.）またはsprintfを使い、変数展開は使わない</strong>方針を取ります。</p>
<p>使い分けの指針はシンプルです。<strong>基本はシングルクォート</strong>を使い、改行<code>\\n</code>などのエスケープシーケンスが必要なときだけダブルクォートにする。この習慣なら「意図せず何かが変換されてしまう」事故を防げます。</p>`,
      task: `シングルクォートの<code>'A\\nB'</code>と同じ内容をダブルクォートにした<code>echo "A\\nB", PHP_EOL;</code>を追加して出力の違いを観察し、最後に<code>'クォートの違いを確認'</code>と出力してください。`,
      code: `<?php
$name = '世界';
echo 'こんにちは、' . $name . '！' . PHP_EOL;

// シングルクォートでは\\nはただの2文字
echo 'A\\nB', PHP_EOL;

// TODO: 同じ内容をダブルクォートで出力して違いを観察しましょう
// TODO: 最後に「クォートの違いを確認」と出力しましょう`,
      solution: `<?php
$name = '世界';
echo 'こんにちは、' . $name . '！' . PHP_EOL;

// シングルクォートでは\\nはただの2文字
echo 'A\\nB', PHP_EOL;

// ダブルクォートでは\\nが改行になる
echo "A\\nB", PHP_EOL;

echo 'クォートの違いを確認', PHP_EOL;`,
      hints: [
        `2つ目のecho文をコピーして、クォート記号だけシングルからダブルに変えてみましょう。`,
        `echo "A\\nB", PHP_EOL; と echo 'クォートの違いを確認', PHP_EOL; の2行を追加します。`
      ],
      expectedOutput: "クォートの違いを確認"
    },
    {
      id: 16,
      title: "nullとisset",
      explanation: `<p><strong>null</strong>は「値が存在しない」ことを表す特別な値です。0でも空文字列でもなく、「何も入っていない」という状態そのものを表します。たとえば「ミドルネームを持たない人のミドルネーム」のように、値が無いことに意味がある場面で使います。</p>
<pre><code>$middleName = null;
var_dump($middleName);   // NULL</code></pre>
<p>var_dumpではそのまま<code>NULL</code>と表示されます。</p>
<p>nullとセットで覚えたいのが<strong>isset()</strong>です。issetは「変数が定義されていて、かつ値がnullでない」ときにtrueを返します。</p>
<table>
<tr><th>変数の状態</th><th>issetの結果</th></tr>
<tr><td>値が代入されている（null以外）</td><td>true</td></tr>
<tr><td>nullが代入されている</td><td>false</td></tr>
<tr><td>そもそも定義されていない</td><td>false</td></tr>
</table>
<p>注目すべきは2行目です。<strong>nullを代入した変数は、issetではfalse扱い</strong>になります。「代入したのにissetがfalse？」と混乱しやすいポイントですが、「issetは使える値が入っているかを調べる関数」と理解すればすっきりします。</p>
<p>もう1つissetの便利な性質として、未定義の変数に渡してもエラーや警告が出ません。通常、未定義変数を使うとPHP 8ではWarningが出ますが、issetは「存在チェック」が仕事なので安全に調べられるのです。この性質は、後の章で学ぶ配列のキー存在チェックでも大活躍します。</p>`,
      task: `変数<code>$nickname</code>に文字列<code>'こめ'</code>を代入し、<code>isset($nickname)</code>の結果をvar_dumpする2行を追加してください。<code>bool(true)</code>と表示されれば成功です。`,
      code: `<?php
$middleName = null;
var_dump($middleName);

// nullが入っている変数はissetでfalseになる
var_dump(isset($middleName));

// TODO: $nicknameに'こめ'を代入し、isset($nickname)の結果をvar_dumpしましょう`,
      solution: `<?php
$middleName = null;
var_dump($middleName);

// nullが入っている変数はissetでfalseになる
var_dump(isset($middleName));

$nickname = 'こめ';
var_dump(isset($nickname));`,
      hints: [
        `issetは変数に使える値（null以外）が入っているかを調べる関数です。`,
        `$nickname = 'こめ'; のあとに var_dump(isset($nickname)); と書きます。`
      ],
      expectedOutput: "bool(true)"
    },
    {
      id: 17,
      title: "型の自動変換（ゆるやかな比較の罠）",
      explanation: `<p>PHPは異なる型どうしを比較すると、<strong>自動的に型を変換してから</strong>比較します。<code>==</code>による比較は「ゆるやかな比較」と呼ばれ、直感に反する結果を生むことがあります。</p>
<pre><code>var_dump(1 == '1');      // bool(true)  文字列'1'が数値1に変換されて比較される
var_dump('1' == '01');   // bool(true)  数値形式の文字列どうしは数値として比較される
var_dump(null == false); // bool(true)  どちらも「空」とみなされる</code></pre>
<p>「'1'と'01'は違う文字列なのにtrue？」と驚いたのではないでしょうか。これが自動型変換の罠です。会員番号'01'と'1'を==で比較して同一人物と判定してしまう、といったバグが実際に起こり得ます。</p>
<p>なお、PHP 8で挙動が改善された点も知っておきましょう。かつて<code>0 == 'abc'</code>はtrueという有名な罠がありました（文字列'abc'が数値0に変換されていたため）。PHP 8からは数値らしくない文字列との比較は文字列として扱われるようになり、<code>0 == 'abc'</code>は<strong>false</strong>になります。古い記事を読むときはこの違いに注意してください。</p>
<p>とはいえ改善後も、ゆるやかな比較に頼るのは危険です。次のステップで明示的な型変換を、ステップ19で型まで含めて比較する<code>===</code>を学び、「型を意識して比較する」習慣を完成させましょう。まずは本ステップで、罠の実例をvar_dumpでじっくり観察してください。</p>`,
      task: `まず実行して3つの比較結果を観察してください。そのあと<code>null == false</code>の結果を予想してから、確認用の2行（<code>echo 'null == false は ';</code>と<code>var_dump(null == false);</code>）を追加しましょう。`,
      code: `<?php
// ゆるやかな比較（==）は型を自動変換してから比較する
var_dump(1 == '1');
var_dump(0 == 'abc');
var_dump('1' == '01');

// TODO: null == false の結果を予想してから、以下の2行で確認しましょう
// echo 'null == false は ';
// var_dump(null == false);`,
      solution: `<?php
// ゆるやかな比較（==）は型を自動変換してから比較する
var_dump(1 == '1');
var_dump(0 == 'abc');
var_dump('1' == '01');

echo 'null == false は ';
var_dump(null == false);`,
      hints: [
        `nullもfalseも「空っぽ」の仲間です。ゆるやかな比較ではどう扱われるでしょうか。`,
        `コメントにある2行をそのまま追加すれば確認できます。echoの行は改行しないため、var_dumpの結果が同じ行に続きます。`
      ],
      expectedOutput: "null == false は bool(true)"
    },
    {
      id: 18,
      title: "明示的な型変換（キャスト）",
      explanation: `<p>前のステップでは、PHPが勝手に型を変換する怖さを見ました。今回はその逆で、<strong>プログラマが意図的に型を変換する「キャスト」</strong>を学びます。値の前に<code>(型名)</code>を付けるだけです。</p>
<pre><code>$input = '42';           // 文字列
$number = (int)$input;   // 整数に変換
var_dump($number);       // int(42)</code></pre>
<p>主なキャストと変換結果の例をまとめます。</p>
<table>
<tr><th>キャスト</th><th>例</th><th>結果</th></tr>
<tr><td><code>(int)</code></td><td><code>(int)'42'</code></td><td>int(42)</td></tr>
<tr><td><code>(int)</code></td><td><code>(int)3.9</code></td><td>int(3)（四捨五入ではなく切り捨て）</td></tr>
<tr><td><code>(float)</code></td><td><code>(float)'3.14'</code></td><td>float(3.14)</td></tr>
<tr><td><code>(string)</code></td><td><code>(string)123</code></td><td>string(3) "123"</td></tr>
<tr><td><code>(bool)</code></td><td><code>(bool)0</code></td><td>bool(false)</td></tr>
</table>
<p>覚えておきたい注意点が2つあります。1つ目、<code>(int)3.9</code>は<strong>3</strong>になります。四捨五入ではなく小数部分の切り捨てです（四捨五入したいときはround関数）。2つ目、<code>(bool)</code>へのキャストでは<code>0</code>・<code>0.0</code>・<code>''</code>（空文字列）・<code>'0'</code>・<code>null</code>などがfalseになり、それ以外はほぼtrueになります。</p>
<p>キャストの価値は「この時点でこの型であるべき」という意図をコードで表明できることです。外部から来た文字列を数値として計算する前に明示的にキャストしておけば、後続の処理を安心して書けます。自動変換に任せず、境界で自分で変換するのがプロの流儀です。</p>`,
      task: `<code>(string)123</code>の結果をvar_dumpする1行を追加し、<code>string(3) "123"</code>と表示されること（数値が文字列に変わったこと）を確認してください。`,
      code: `<?php
$input = '42';
// 文字列を整数へキャスト
$number = (int)$input;
var_dump($number);

// floatへのキャストとboolへのキャスト
var_dump((float)'3.14');
var_dump((bool)0);

// TODO: (string)123 の結果をvar_dumpして、文字列に変わることを確認しましょう`,
      solution: `<?php
$input = '42';
// 文字列を整数へキャスト
$number = (int)$input;
var_dump($number);

// floatへのキャストとboolへのキャスト
var_dump((float)'3.14');
var_dump((bool)0);

var_dump((string)123);`,
      hints: [
        `キャストは値の前に(型名)を付けます。カッコごとvar_dumpの引数に書けます。`,
        `var_dump((string)123); の1行を追加します。カッコの対応に注意しましょう。`
      ],
      expectedOutput: 'string(3) "123"'
    },
    {
      id: 19,
      title: "===と==の違い",
      explanation: `<p>いよいよ比較の総まとめです。PHPには等しさを調べる演算子が2つあります。</p>
<table>
<tr><th>演算子</th><th>名前</th><th>比較の仕方</th></tr>
<tr><td><code>==</code></td><td>ゆるやかな比較</td><td>型を自動変換してから値を比較</td></tr>
<tr><td><code>===</code></td><td>厳密な比較</td><td><strong>型と値の両方</strong>が一致して初めてtrue</td></tr>
</table>
<pre><code>var_dump('1' == 1);    // bool(true)   型変換されて値だけ比較される
var_dump('1' === 1);   // bool(false)  string型とint型なので型が不一致
var_dump(1 === 1.0);   // bool(false)  int型とfloat型も別の型</code></pre>
<p><code>===</code>は「値が同じでも型が違えばfalse」という明快なルールなので、ステップ17で見たような自動型変換の罠が原理的に発生しません。実務では<strong>迷わず===を使うのが原則</strong>です。多くの企業のコーディング規約でも==は原則禁止とされています。「等しくない」の判定も同様に、<code>!=</code>ではなく厳密版の<code>!==</code>を使います。</p>
<p>「==のほうがゆるくて便利では？」と思うかもしれませんが、比較結果が入力の型次第で変わるコードは、読む人が型の変換ルールを全部覚えていないと正しさを判断できません。===なら「型も値も同じときだけtrue」の一行で説明が終わります。コードの読みやすさとは、こうした「考えることの少なさ」の積み重ねです。型が違う値を比較したいときは、前のステップで学んだキャストで型を揃えてから===で比較しましょう。</p>`,
      task: `<code>1 == 1.0</code>と<code>1 === 1.0</code>の結果を、コメントにある形式（<code>echo</code>でラベルを出してから<code>var_dump</code>）でそれぞれ確認する4行を追加してください。`,
      code: `<?php
var_dump('1' == 1);
var_dump('1' === 1);

// TODO: 以下の4行を追加して、intとfloatの比較を確認しましょう
// echo '1 == 1.0 は ';
// var_dump(1 == 1.0);
// echo '1 === 1.0 は ';
// var_dump(1 === 1.0);`,
      solution: `<?php
var_dump('1' == 1);
var_dump('1' === 1);

echo '1 == 1.0 は ';
var_dump(1 == 1.0);
echo '1 === 1.0 は ';
var_dump(1 === 1.0);`,
      hints: [
        `1と1.0は値としては等しいですが、int型とfloat型で型が異なります。===はどう判定するでしょうか。`,
        `コメントの4行をそのまま追加します。==はtrue、===はfalseになるはずです。`
      ],
      expectedOutput: "1 === 1.0 は bool(false)"
    },
    {
      id: 20,
      title: "総合演習：BMI計算機",
      explanation: `<p>第2章の総仕上げとして、BMI計算機を作ります。BMI（Body Mass Index）は体格の目安となる指数で、次の式で計算します。</p>
<pre><code>BMI = 体重(kg) ÷ (身長(m) × 身長(m))</code></pre>
<p>この演習には本章で学んだ型の知識が詰まっています。</p>
<ul>
<li><strong>float型</strong>：体重60.0kgや身長1.7mは小数なのでfloatで扱います（ステップ12）</li>
<li><strong>数値演算</strong>：割り算と掛け算を組み合わせます。計算の順序はカッコで明示します（ステップ13）</li>
<li><strong>round関数</strong>：計算結果は20.761…のような長い小数になるため、小数第1位に丸めます（ステップ12）</li>
<li><strong>sprintfの%f</strong>：小数の表示桁数は<code>%.1f</code>（小数1桁）や<code>%.2f</code>（小数2桁）で指定します（第1章ステップ9）</li>
</ul>
<p>計算式をコードにするときは、数式の構造がそのまま見えるように書くのがコツです。</p>
<pre><code>$bmi = $weightKg / ($heightM * $heightM);</code></pre>
<p>カッコが無くても掛け算と割り算は左から順に評価されてしまい、この式では正しい結果になりません。<strong>意図した計算順序はカッコで明示する</strong>と、正しさの確認も後からの読解も楽になります。</p>
<p>また、float計算の結果をそのまま表示すると誤差を含む長い小数が出ることがあります。「計算はfloatで行い、表示の直前にroundや%.1fで整える」という役割分担は、実務の帳票出力などでも定番のパターンです。</p>`,
      task: `TODOの位置に、BMIを計算して<code>$bmi</code>に代入する行、<code>round($bmi, 1)</code>を<code>$rounded</code>に代入する行、<code>sprintf('BMIは%.1fです', $rounded)</code>を出力する行の3行を追加してください。`,
      code: `<?php
const BMI_LABEL = 'BMI計算機';
$weightKg = 60.0;
$heightM = 1.7;

echo '==== ' . BMI_LABEL . ' ====' . PHP_EOL;
echo sprintf('体重%.1fkg、身長%.2fm', $weightKg, $heightM), PHP_EOL;

// TODO: BMI = 体重 ÷ (身長 × 身長) を計算して$bmiに代入しましょう
// TODO: round($bmi, 1)の結果を$roundedに代入しましょう
// TODO: sprintf('BMIは%.1fです', $rounded)を出力しましょう`,
      solution: `<?php
const BMI_LABEL = 'BMI計算機';
$weightKg = 60.0;
$heightM = 1.7;

echo '==== ' . BMI_LABEL . ' ====' . PHP_EOL;
echo sprintf('体重%.1fkg、身長%.2fm', $weightKg, $heightM), PHP_EOL;

// BMI = 体重 ÷ (身長 × 身長)
$bmi = $weightKg / ($heightM * $heightM);
$rounded = round($bmi, 1);
echo sprintf('BMIは%.1fです', $rounded), PHP_EOL;`,
      hints: [
        `身長×身長を先に計算する必要があるので、割る側をカッコで囲みます。`,
        `$bmi = $weightKg / ($heightM * $heightM); で計算し、round($bmi, 1)で小数第1位に丸めます。`,
        `出力は echo sprintf('BMIは%.1fです', $rounded), PHP_EOL; と書けます。体重60kg・身長1.7mならBMIは20.8になります。`
      ],
      expectedOutput: "BMIは20.8です"
    }
  ]
});
