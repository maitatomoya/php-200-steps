// 第21章：よくあるエラー：構文と未定義
registerChapter({
  number: 21,
  title: "よくあるエラー：構文と未定義",
  description: "実際のエラーメッセージを読んで原因を特定し、修正する訓練の章です。Parse error・Fatal error・Warningの違いと読み方を、構文ミスと未定義エラーを題材に身につけます。",
  steps: [
    {
      id: 201,
      title: "Parse error：セミコロン忘れ",
      explanation: `<p>この章からは「エラーを直す訓練」です。エラーメッセージは敵ではなく、<strong>原因の場所を教えてくれる地図</strong>です。まずPHPのエラーの種類を整理しましょう。</p>
<table>
<tr><th>種類</th><th>意味</th><th>実行は？</th></tr>
<tr><td><code>Parse error</code></td><td>構文エラー。文法が壊れていて解釈できない</td><td>1行も実行されない</td></tr>
<tr><td><code>Fatal error</code></td><td>致命的エラー。実行中にそれ以上続行できない</td><td>その場で停止</td></tr>
<tr><td><code>Warning</code></td><td>警告。問題はあるが実行は続く</td><td>続行する</td></tr>
<tr><td><code>Deprecated</code></td><td>非推奨。将来のバージョンで動かなくなる予告</td><td>続行する</td></tr>
</table>
<p>今回のコードを実行すると、次のメッセージが出ます。</p>
<pre><code>Parse error: syntax error, unexpected token "echo" in main.php on line 3</code></pre>
<p>読み方は「<strong>種類→内容→ファイル→行番号</strong>」の順です。「unexpected token "echo"（予期しないechoが現れた）」とあり、場所は3行目。しかし本当の原因は<strong>その1つ前の行のセミコロン忘れ</strong>です。PHPはセミコロンが来るまで文が続いていると解釈するので、「文の途中なのにechoが現れた」と次の行で報告します。</p>
<p>ここから得られる教訓は、<strong>Parse errorは報告された行だけでなく、その直前の行も疑う</strong>ということです。セミコロン忘れ・閉じ忘れの多くはこのパターンで発見できます。</p>`,
      task: `実行すると<code>Parse error: syntax error, unexpected token "echo"</code>が出ます。メッセージの行番号とその直前の行を確認し、エラーを修正してください。`,
      code: `<?php
// あいさつ文を組み立てて表示する
$name = "太郎"
echo "こんにちは、" . $name . "さん\\n";
`,
      solution: `<?php
// あいさつ文を組み立てて表示する
$name = "太郎";
echo "こんにちは、" . $name . "さん\\n";
`,
      hints: [
        `エラーは3行目と報告されていますが、原因は2行目にあります。文の終わりに必要な記号は何でしたか。`,
        `$name = "太郎" の直後にセミコロン（;）を追加します。`
      ],
      expectedOutput: "こんにちは、太郎さん"
    },
    {
      id: 202,
      title: "Parse error：波括弧の閉じ忘れ",
      explanation: `<p>関数やif文の波括弧<code>{ }</code>を閉じ忘れると、次のようなParse errorが出ます。</p>
<pre><code>Parse error: Unclosed '{' on line 4 in main.php on line 8</code></pre>
<p>このメッセージは情報が2つ入っている点に注目してください。</p>
<ul>
<li><code>Unclosed '{' on line 4</code>：<strong>4行目で開いた波括弧が閉じられていない</strong></li>
<li><code>on line 8</code>：ファイルの終わり（8行目）まで読んだが対応する<code>}</code>が見つからなかった</li>
</ul>
<p>つまり「どこで開いた括弧が問題か」まで教えてくれています。古いPHPでは<code>unexpected end of file</code>（予期しないファイル終端）としか出ず原因の行を自力で探す必要がありましたが、現在のPHPは開始位置を示してくれるため、<strong>まず前半の行番号を見る</strong>のが正解です。</p>
<p>波括弧の対応ミスを防ぐコツは次の通りです。</p>
<ul>
<li>エディタの<strong>括弧ハイライト機能</strong>で対応関係を確認する（括弧の上にカーソルを置くと相方が光る）</li>
<li><strong>インデント（字下げ）を揃える</strong>。閉じ括弧は開いた行と同じ深さに書く習慣をつけると、ズレが目視で分かる</li>
<li>括弧は<strong>開いたら先に閉じてから中身を書く</strong></li>
</ul>
<p>今回は関数定義の閉じ括弧が抜けています。どの行で開いた<code>{</code>かをメッセージから読み取って修正しましょう。</p>`,
      task: `実行すると<code>Parse error: Unclosed '{'</code>が出ます。メッセージが示す「開いた行」を確認し、閉じ括弧を正しい位置に追加してください。`,
      code: `<?php
// 2つの価格の合計を返す関数
function calcTotal(int $a, int $b): int
{
    return $a + $b;

echo "合計は" . calcTotal(500, 700) . "円です\\n";
`,
      solution: `<?php
// 2つの価格の合計を返す関数
function calcTotal(int $a, int $b): int
{
    return $a + $b;
}

echo "合計は" . calcTotal(500, 700) . "円です\\n";
`,
      hints: [
        `Unclosed '{' on line 4は「4行目で開いた括弧が閉じていない」という意味です。関数定義の終わりを探しましょう。`,
        `return文の次の行に } を追加して、関数定義を閉じます。`
      ],
      expectedOutput: "合計は1200円です"
    },
    {
      id: 203,
      title: "Parse error：変数の$忘れ",
      explanation: `<p>PHPの変数は必ず<code>$</code>で始まります。他の言語（JavaScriptやPython）に慣れていると<code>$</code>を忘れやすく、その場合は次のParse errorになります。</p>
<pre><code>Parse error: syntax error, unexpected token "=" in main.php on line 2</code></pre>
<p>なぜ「unexpected token "="（予期しない=）」なのでしょうか。PHPは<code>price</code>という単語を見た時点で、<strong>変数ではなく定数（constで定義する固定値）の名前</strong>だと解釈します。定数には代入できないため、直後の<code>=</code>が「文法的にありえない位置の記号」となり構文エラーになるのです。</p>
<p>このように、<strong>Parse errorのメッセージは「本当の原因」ではなく「文法が破綻した地点」を指す</strong>ことがよくあります。「=が予期しない」と言われたら、=の左側（代入先）が正しい形かを確認する習慣をつけましょう。</p>
<table>
<tr><th>書き方</th><th>意味</th></tr>
<tr><td><code>$price = 1200;</code></td><td>変数priceへの代入（正しい）</td></tr>
<tr><td><code>price = 1200;</code></td><td>定数priceへの代入と解釈→構文エラー</td></tr>
</table>
<p>なお、読み取り側（<code>echo price;</code>のような箇所）で<code>$</code>を忘れた場合は構文としては通ってしまい、実行時に「未定義定数」という別のエラーになります。これはステップ207で扱います。</p>`,
      task: `実行すると<code>unexpected token "="</code>のParse errorが出ます。=の左側に注目して修正してください。`,
      code: `<?php
price = 1200;
echo "価格：" . $price . "円\\n";
`,
      solution: `<?php
$price = 1200;
echo "価格：" . $price . "円\\n";
`,
      hints: [
        `「=が予期しない」と言われたら、=の左側を見ます。PHPの変数に必ず付く記号は何でしたか。`,
        `priceを$priceに変更します。3行目はすでに$が付いています。`
      ],
      expectedOutput: "価格：1200円"
    },
    {
      id: 204,
      title: "Warning：Undefined variable（変数名のtypo）",
      explanation: `<p>ここからは実行時の警告（Warning）です。Parse errorと違い、<strong>Warningが出てもプログラムは止まらず続行します</strong>。今回のコードを実行すると次のメッセージが出ます。</p>
<pre><code>Warning: Undefined variable $messsage in main.php on line 3</code></pre>
<p>「Undefined variable（未定義の変数）」、つまり<code>$messsage</code>という変数は一度も代入されていない、という警告です。よく見ると<strong>sが3つ</strong>あります。2行目で定義したのは<code>$message</code>なので、タイプミスで別の変数を参照してしまったのが原因です。</p>
<p>このとき未定義変数は<code>null</code>として扱われ、echoすると空文字になります。つまり<strong>画面には何も表示されないのに処理は成功したように見える</strong>わけです。これがWarningの怖いところで、放置すると「なぜか表示されない」という発見しづらいバグになります。</p>
<p>対策は次の通りです。</p>
<ul>
<li>Warningを<strong>絶対に放置しない</strong>。メッセージ中の変数名を定義箇所と1文字ずつ見比べる</li>
<li>エディタの補完機能で変数名を入力する（手打ちしない）</li>
<li>PHP 7までは同じ状況がNotice（より軽い通知）でしたが、<strong>PHP 8からWarningに格上げ</strong>されました。それだけ見逃されやすく危険なミスだということです</li>
</ul>`,
      task: `実行すると<code>Warning: Undefined variable</code>が出て、本文が表示されません。メッセージ中の変数名をよく見て修正してください。`,
      code: `<?php
$message = "今日もいい天気ですね";
echo $messsage . "\\n";
`,
      solution: `<?php
$message = "今日もいい天気ですね";
echo $message . "\\n";
`,
      hints: [
        `Warningに表示された変数名$messsageと、2行目で定義した変数名を1文字ずつ見比べてください。`,
        `3行目のsが1つ多い$messsageを$messageに直します。`
      ],
      expectedOutput: "今日もいい天気ですね"
    },
    {
      id: 205,
      title: "Warning：Undefined array key（キーのtypo）",
      explanation: `<p>連想配列に存在しないキーでアクセスすると、次のWarningが出ます。</p>
<pre><code>Warning: Undefined array key "mail" in main.php on line 6</code></pre>
<p>「Undefined array key（未定義の配列キー）」で、<strong>どのキー名で失敗したかがダブルクォート付きで表示される</strong>のがポイントです。配列に実際にあるキーは<code>email</code>なのに、<code>mail</code>でアクセスしてしまっています。未定義キーの値は<code>null</code>扱いになるため、前ステップの未定義変数と同じく「エラーで止まらないが表示が空になる」挙動をします。</p>
<p>この種のバグの調査手順を覚えましょう。</p>
<ol>
<li>Warningのキー名（<code>"mail"</code>）を確認する</li>
<li><code>var_dump($user);</code>で配列の中身を表示し、<strong>実際に存在するキーの一覧</strong>を見る</li>
<li>両者を見比べてtypoか、そもそもデータにないのかを判断する</li>
</ol>
<p>また、キーが「存在しない可能性が正常にありえる」場合（ユーザーが任意項目を未入力など）は、typo修正ではなく<strong>null合体演算子<code>??</code></strong>でデフォルト値を用意するのが定石です。</p>
<pre><code>echo $user["email"] ?? "未登録";  // なければ「未登録」と表示</code></pre>
<p>今回は登録済みデータへのtypoアクセスなので、キー名の修正が正解です。</p>`,
      task: `実行すると<code>Warning: Undefined array key</code>が出ます。配列に実際にあるキー名を確認して修正してください。`,
      code: `<?php
$user = [
    "name" => "太郎",
    "email" => "taro@example.com",
];
echo "メール：" . $user["mail"] . "\\n";
`,
      solution: `<?php
$user = [
    "name" => "太郎",
    "email" => "taro@example.com",
];
echo "メール：" . $user["email"] . "\\n";
`,
      hints: [
        `Warningのキー名"mail"と、配列定義に書かれているキー名を見比べてください。`,
        `$user["mail"]を$user["email"]に直します。`
      ],
      expectedOutput: "メール：taro@example.com"
    },
    {
      id: 206,
      title: "Fatal error：Call to undefined function（関数名のtypo）",
      explanation: `<p>存在しない関数を呼び出すと、今度はWarningではなく<strong>Fatal error</strong>になります。</p>
<pre><code>Fatal error: Uncaught Error: Call to undefined function strlem() in main.php:2
Stack trace:
#0 {main}
  thrown in main.php on line 2</code></pre>
<p>読み解きましょう。</p>
<ul>
<li><code>Call to undefined function strlem()</code>：<strong>未定義の関数strlemを呼んだ</strong>。文字列長を返す関数は<code>strlen</code>（string lengthの略）なので、末尾がmになったtypoです</li>
<li><code>Uncaught Error</code>：PHP 8ではこの失敗は<code>Error</code>という例外として投げられ、catchされなかった（Uncaught）ため停止した、という意味です</li>
<li><code>Stack trace</code>：どの呼び出し経路でエラーに至ったかの記録。<code>#0 {main}</code>は「トップレベル（関数の外）で直接発生」を意味します。関数の中で起きた場合はここに呼び出し元が並び、原因調査の重要な手がかりになります</li>
</ul>
<p>WarningとFatal errorの違いも整理しておきましょう。未定義変数・未定義キーは「nullとして進める」余地があるためWarningですが、<strong>未定義関数は呼び先が存在せず続行のしようがない</strong>ためFatal errorで即停止します。</p>
<p>関数名のtypoはエディタの補完と、公式マニュアルで正式名を確認する習慣で防げます。</p>`,
      task: `実行すると<code>Call to undefined function</code>のFatal errorが出ます。正しい組み込み関数名に修正してください。`,
      code: `<?php
echo "文字数は" . strlem("hello") . "です\\n";
`,
      solution: `<?php
echo "文字数は" . strlen("hello") . "です\\n";
`,
      hints: [
        `文字列の長さを返す組み込み関数の正式名を思い出してください。string lengthの略です。`,
        `strlemの最後の1文字が間違っています。strlenに直します。`
      ],
      expectedOutput: "文字数は5です"
    },
    {
      id: 207,
      title: "Fatal error：Undefined constant（クォート忘れ）",
      explanation: `<p>文字列のクォートを忘れると、PHPはそれを<strong>定数名</strong>として解釈します。定義していない定数なら、次のFatal errorになります。</p>
<pre><code>Fatal error: Uncaught Error: Undefined constant "tokyo" in main.php:6</code></pre>
<p>今回のコードでは配列のキーを<code>$area[tokyo]</code>と書いてしまいました。正しくは<code>$area["tokyo"]</code>です。クォートがないため、PHPは「tokyoという定数の値をキーにする」と解釈し、そんな定数は存在しないのでErrorになります。</p>
<p>実はこの挙動には歴史があります。<strong>PHP 7までは未定義定数は警告付きで「文字列'tokyo'とみなす」という救済措置</strong>があり、クォート忘れでもなんとなく動いてしまいました。この曖昧さがバグの温床だったため、<strong>PHP 8で完全にエラー化</strong>されました。古い記事やレガシーコードで<code>$arr[key]</code>のような書き方を見ても、真似してはいけません。</p>
<p>「Undefined constant」を見たときのチェックポイントは2つです。</p>
<ul>
<li><strong>文字列のつもりならクォートを付ける</strong>（今回のケース。圧倒的に多い）</li>
<li>本当に定数を使うつもりなら、<code>const</code>や<code>define()</code>で定義済みか、名前のtypoがないかを確認する</li>
</ul>
<p>なお前ステップの未定義「関数」はエラーメッセージに<code>()</code>が付き、未定義「定数」には付きません。この違いでも区別できます。</p>`,
      task: `実行すると<code>Undefined constant "tokyo"</code>のFatal errorが出ます。配列キーの書き方を修正してください。`,
      code: `<?php
$area = [
    "tokyo" => "東京",
    "osaka" => "大阪",
];
echo "行き先：" . $area[tokyo] . "\\n";
`,
      solution: `<?php
$area = [
    "tokyo" => "東京",
    "osaka" => "大阪",
];
echo "行き先：" . $area["tokyo"] . "\\n";
`,
      hints: [
        `文字列をキーとして使うときに必要な記号は何でしたか。クォートがないと定数として解釈されます。`,
        `$area[tokyo]を$area["tokyo"]に直します。`
      ],
      expectedOutput: "行き先：東京"
    },
    {
      id: 208,
      title: "TypeError：文字列連結を+で書く罠",
      explanation: `<p>JavaScriptやPythonでは文字列を<code>+</code>でつなぎますが、<strong>PHPの連結演算子は<code>.</code>（ドット）</strong>です。<code>+</code>は純粋に算術の足し算なので、日本語の文字列同士に使うと次のエラーになります。</p>
<pre><code>Fatal error: Uncaught TypeError: Unsupported operand types: string + string in main.php:3</code></pre>
<p><code>TypeError</code>は「型のエラー」、<code>Unsupported operand types: string + string</code>は「文字列と文字列の+はサポートしない演算」という意味です。PHP 8ではこのように<strong>数値に変換できない文字列の算術演算は即エラー</strong>になります。</p>
<p>ここで注意したいのが、<strong>数値に見える文字列だとエラーにならない</strong>ことです。</p>
<table>
<tr><th>式</th><th>結果</th></tr>
<tr><td><code>"こんにちは" + "太郎"</code></td><td>TypeErrorで停止</td></tr>
<tr><td><code>"1" + "2"</code></td><td>3（数値として足し算される）</td></tr>
<tr><td><code>"1" . "2"</code></td><td>"12"（文字列として連結される）</td></tr>
</table>
<p>つまり<code>+</code>で連結を書いてしまっても、数字っぽいデータのときだけ静かに間違った結果（3）を返し、エラーにすらなりません。<strong>「エラーが出ないこと」と「正しいこと」は別物</strong>という好例です。文字列をつなぐ意図なら、必ず<code>.</code>を使いましょう。同様に、代入しながらの連結は<code>.=</code>（<code>+=</code>ではなく）です。</p>`,
      task: `実行すると<code>Unsupported operand types: string + string</code>のTypeErrorが出ます。文字列連結の正しい演算子に修正してください。`,
      code: `<?php
$name = "花子";
$greeting = "おはよう、" + $name + "さん";
echo $greeting . "\\n";
`,
      solution: `<?php
$name = "花子";
$greeting = "おはよう、" . $name . "さん";
echo $greeting . "\\n";
`,
      hints: [
        `PHPで文字列をつなぐ演算子は+ではありません。`,
        `3行目の+を2か所とも.（ドット）に変更します。`
      ],
      expectedOutput: "おはよう、花子さん"
    },
    {
      id: 209,
      title: "Parse error：クォートの閉じ忘れ・混在",
      explanation: `<p>シングルクォートの文字列の中にアポストロフィ（'）を含めると、PHPはそこで<strong>文字列が終わった</strong>と解釈します。今回のコードでは<code>'It's a pen'</code>と書いたため、<code>'It'</code>で文字列が閉じ、直後の<code>s</code>が宙に浮いて次のParse errorになります。</p>
<pre><code>Parse error: syntax error, unexpected identifier "s", expecting "," or ";" in main.php on line 2</code></pre>
<p>「unexpected identifier "s"（予期しない識別子s）」という一見謎のメッセージも、<strong>クォートの区切り位置がずれた</strong>と考えると説明がつきます。エディタのシンタックスハイライトで文字列の色がどこで途切れているかを見るのが、最速の発見方法です。</p>
<p>直し方は2通りあります。</p>
<table>
<tr><th>方法</th><th>例</th></tr>
<tr><td>外側を別種のクォートにする</td><td><code>"It's a pen"</code></td></tr>
<tr><td>バックスラッシュでエスケープする</td><td><code>'It\\'s a pen'</code></td></tr>
</table>
<p>読みやすさの観点では、<strong>中身にアポストロフィがあるならダブルクォートで囲む</strong>のがおすすめです。逆に、中身にダブルクォートを含めたいときはシングルクォートで囲みます。エスケープだらけの文字列は読み間違いのもとなので、外側のクォートの選択で回避するのが定石です。</p>
<p>なお行末のクォート自体を閉じ忘れた場合は、文字列が次の行以降を飲み込み続け、まったく別の行でParse errorが報告されます。これもステップ201と同じく「報告行の手前を疑う」パターンです。</p>`,
      task: `実行するとParse errorが出ます。クォートの区切り位置がずれている原因を直し、<code>It's a pen</code>と表示してください。`,
      code: `<?php
echo 'It's a pen';
echo "\\n";
`,
      solution: `<?php
echo "It's a pen";
echo "\\n";
`,
      hints: [
        `'It's a pen'は'It'で文字列が終わったと解釈されています。中にアポストロフィを含む文字列はどう囲めばよいでしょうか。`,
        `外側のクォートをダブルクォートに変えて"It's a pen"とします。`
      ],
      expectedOutput: "It's a pen"
    },
    {
      id: 210,
      title: "総合演習：エラーだらけのスクリプトを直す",
      explanation: `<p>この章の総仕上げです。複数のバグを含むスクリプトを、エラーメッセージを頼りに1つずつ修正します。ここで大事なのは<strong>エラーは一度に全部は表示されない</strong>という性質です。</p>
<ol>
<li>まず<strong>Parse error</strong>が出ます。構文エラーがあるとPHPはファイルを一切実行できないため、実行時の問題（WarningやFatal error）はまだ見えません</li>
<li>構文を直して再実行すると、初めて<strong>実行時のエラー・警告</strong>が現れます</li>
<li>それも直して再実行し、<strong>警告ゼロで期待どおりの出力</strong>になるまで繰り返します</li>
</ol>
<p>この「直しては再実行」のサイクルが、実務のデバッグの基本動作です。今回のコードには3種類のバグが仕込まれています。</p>
<table>
<tr><th>種類</th><th>メッセージの例</th><th>学んだステップ</th></tr>
<tr><td>変数の$忘れ＋セミコロン忘れ</td><td><code>Parse error: syntax error, unexpected token "="</code></td><td>201・203</td></tr>
<tr><td>配列キーのクォート忘れ</td><td><code>Fatal error: Uncaught Error: Undefined constant "price"</code></td><td>207</td></tr>
<tr><td>変数名のtypo</td><td><code>Warning: Undefined variable $totl</code></td><td>204</td></tr>
</table>
<p>Parse errorの報告行は「破綻が発覚した場所」であって原因そのものとは限らないこと、Fatal errorは即停止すること、Warningは止まらないぶん見逃しやすいこと。この章で学んだ読み方を総動員して、合計金額が正しく表示されるまで修正してください。</p>`,
      task: `3種類のバグ（$とセミコロン忘れ・キーのクォート忘れ・変数名typo）を含むコードです。エラーメッセージを読みながらすべて修正し、<code>合計：1200円</code>と表示してください。`,
      code: `<?php
// 商品リストから合計金額を計算する（バグが3種類ある）
$items = [
    ["name" => "コーヒー", "price" => 500],
    ["name" => "サンドイッチ", "price" => 700],
];

total = 0
foreach ($items as $item) {
    $total += $item[price];
}
echo "合計：" . $totl . "円\\n";
`,
      solution: `<?php
// 商品リストから合計金額を計算する
$items = [
    ["name" => "コーヒー", "price" => 500],
    ["name" => "サンドイッチ", "price" => 700],
];

$total = 0;
foreach ($items as $item) {
    $total += $item["price"];
}
echo "合計：" . $total . "円\\n";
`,
      hints: [
        `まずParse errorから。total = 0の行には$の付け忘れとセミコロン忘れの2つの問題があります。`,
        `構文が直ったら再実行を。$item[price]はキーのクォート忘れ（Undefined constant）です。`,
        `最後にWarningを確認。echoしている変数名$totlと集計に使った変数名を見比べてください。`
      ],
      expectedOutput: "合計：1200円"
    }
  ]
});
