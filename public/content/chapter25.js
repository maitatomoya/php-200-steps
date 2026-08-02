// 第25章：よくあるエラー：実行時と論理
registerChapter({
  number: 25,
  title: "よくあるエラー：実行時と論理",
  description: "構文は正しいのに実行時に落ちるエラーと、エラーメッセージすら出ない論理バグを修復する訓練です。最終ステップでは6個のバグを含むスクリプトを完全修復して卒業します。",
  steps: [
    {
      id: 241,
      title: "json_decode失敗時のnullチェック忘れ",
      explanation: `<p>第25章では、構文チェックは通るのに実行時に落ちるエラーや、エラーすら出ずに間違った結果を返す論理バグを扱います。最初はJSONの落とし穴です。</p>
<p><code>json_decode()</code>（JSON文字列をPHPの値に変換する関数）は、解析に失敗しても<strong>例外を投げず、静かにnullを返します</strong>。戻り値をチェックせずに使うと、失敗した瞬間ではなく「そのあとnullを使った場所」でエラーが出るため、原因が分かりにくくなります。</p>
<pre><code>$data = json_decode('{"name": "佐藤",}', true); // 失敗してnull
echo $data['name'];
// Warning: Trying to access array offset on null</code></pre>
<p>Warningの「Trying to access array offset on null（nullに配列の添字アクセスをしようとした）」を見たら、「なぜこの変数はnullなのか」と一段さかのぼるのが定石です。今回の根本原因はJSON文字列の<strong>末尾カンマ</strong>です。JSONの文法はPHPの配列リテラルより厳しく、次のような書き方をすべて拒否します。</p>
<table>
<tr><th>壊れたJSONの典型</th><th>例</th></tr>
<tr><td>末尾カンマ</td><td><code>{"a": 1,}</code></td></tr>
<tr><td>シングルクォート</td><td><code>{'a': 1}</code></td></tr>
<tr><td>キーをクォートしない</td><td><code>{a: 1}</code></td></tr>
<tr><td>コメントを書く</td><td><code>{"a": 1 // メモ}</code></td></tr>
</table>
<p>修正の定石は、<strong>使う前に<code>=== null</code>で失敗を検出</strong>し、<code>json_last_error_msg()</code>（直前のJSONエラーの説明文を返す関数）で理由を表示することです。なおPHP 7.3以降は第4引数に<code>JSON_THROW_ON_ERROR</code>を渡すと失敗時に例外を投げるようにもでき、第24章で学んだtry-catchで受け取れます。</p>`,
      task: `実行するとWarningが出て名前が空になります。<code>json_decode()</code>の結果がnullかどうかを先にチェックし、失敗時は「JSONの解析に失敗しました：」に続けて<code>json_last_error_msg()</code>の結果を表示するように修正してください。`,
      code: `<?php
// APIから受け取った想定のJSON（末尾カンマがあり壊れている）
$json = '{"name": "佐藤", "age": 28,}';

$data = json_decode($json, true);

// nullチェックせずに配列アクセスしている
echo '名前：' . $data['name'] . "\\n";
`,
      solution: `<?php
// APIから受け取った想定のJSON（末尾カンマがあり壊れている）
$json = '{"name": "佐藤", "age": 28,}';

$data = json_decode($json, true);

// 失敗（null）を先にチェックしてから使う
if ($data === null) {
    echo 'JSONの解析に失敗しました：' . json_last_error_msg() . "\\n";
} else {
    echo '名前：' . $data['name'] . "\\n";
}
`,
      hints: [
        `json_decode()は失敗すると例外ではなくnullを返します。使う前に「失敗したかどうか」を確認しましょう。`,
        `if ($data === null) { ... } else { ... } の形で分岐し、失敗側でjson_last_error_msg()を連結して表示します。`
      ],
      expectedOutput: "JSONの解析に失敗しました：Syntax error"
    },
    {
      id: 242,
      title: "preg_matchのデリミタ忘れ",
      explanation: `<p>正規表現（文字列のパターンを表す記法）を使う<code>preg_match()</code>で最も多い失敗が、<strong>デリミタ（パターン全体を囲む区切り文字）の書き忘れ</strong>です。実行すると次のWarningが出ます。</p>
<pre><code>Warning: preg_match(): Delimiter must not be alphanumeric,
backslash, or NUL byte</code></pre>
<p>「デリミタは英数字・バックスラッシュ・NULバイトであってはならない」という意味です。PHPの正規表現は、パターンの<strong>最初の1文字をデリミタとして解釈</strong>します。<code>'\\d{3}-\\d{4}'</code>と書くと先頭の<code>\\</code>をデリミタにしようとして、この文字は使えないと怒られるわけです。</p>
<pre><code>preg_match('\\d{3}-\\d{4}', $postal);   // NG：デリミタがない
preg_match('/\\d{3}-\\d{4}/', $postal); // OK：/で囲む</code></pre>
<p>さらに怖いのは失敗時の戻り値です。<code>preg_match()</code>はマッチしたら1、しなかったら0、<strong>パターン自体が壊れているとfalse</strong>を返します。if文の条件に入れると0もfalseも「マッチしなかった」ように見えるため、Warningを見落とすと「正しい郵便番号なのに形式エラーと判定される」という誤動作になります。</p>
<table>
<tr><th>ポイント</th><th>内容</th></tr>
<tr><td>デリミタ</td><td><code>/パターン/</code>のように囲む。<code>#</code>や<code>~</code>も使える</td></tr>
<tr><td>全体一致</td><td>先頭<code>^</code>と末尾<code>$</code>で「文字列全体がこの形式」を表す</td></tr>
<tr><td>日本語対応</td><td>UTF-8の文字を扱うときは末尾に<code>u</code>修飾子（<code>/パターン/u</code>）</td></tr>
</table>
<p>URLのように<code>/</code>を多く含むパターンでは、デリミタを<code>#</code>にするとエスケープが減って読みやすくなります。</p>`,
      task: `実行するとWarningが出て、正しい郵便番号なのに「形式ではありません」と判定されます。パターンをデリミタで囲み、<code>^</code>と<code>$</code>で全体一致にして修正してください。`,
      code: `<?php
$postal = '150-0001';

// デリミタ（正規表現を囲む区切り文字）を忘れている
if (preg_match('\\d{3}-\\d{4}', $postal)) {
    echo '郵便番号の形式です' . "\\n";
} else {
    echo '郵便番号の形式ではありません' . "\\n";
}
`,
      solution: `<?php
$postal = '150-0001';

// パターン全体を / で囲む（デリミタ）
if (preg_match('/^\\d{3}-\\d{4}$/', $postal)) {
    echo '郵便番号の形式です' . "\\n";
} else {
    echo '郵便番号の形式ではありません' . "\\n";
}
`,
      hints: [
        `PHPの正規表現はパターンの最初の1文字を「区切り文字」として解釈します。パターン全体をスラッシュで囲みましょう。`,
        `'/^\\d{3}-\\d{4}$/' のように、/で囲んだ内側の先頭に^、末尾に$を置くと「文字列全体がこの形式」という意味になります。`
      ],
      expectedOutput: "郵便番号の形式です"
    },
    {
      id: 243,
      title: "dateフォーマット文字の間違い（YYYY）",
      explanation: `<p>今度はエラーが一切出ないのに出力がおかしくなる「静かなバグ」です。<code>date()</code>のフォーマット指定で<code>'YYYY-MM-DD'</code>と書くと、次のような奇妙な出力になります。</p>
<pre><code>echo date('YYYY-MM-DD', $timestamp);
// 2026202620262026-AugAug-SatSat</code></pre>
<p>原因は、PHPの<code>date()</code>がフォーマット文字列を<strong>1文字ずつ独立した指定として解釈する</strong>ことです。<code>Y</code>は「4桁の年」なので、<code>YYYY</code>は「4桁の年を4回」＝<code>2026202620262026</code>になります。<code>M</code>は「月の英語3文字（Aug）」、<code>D</code>は「曜日の英語3文字（Sat）」で、月日ではなく英語表記が2回ずつ並んでしまいました。</p>
<p>JavaやMySQLでは<code>yyyy-MM-dd</code>のような複数文字の指定を使うため、他言語の経験者ほど踏みやすい罠です。PHPの主なフォーマット文字を整理します。</p>
<table>
<tr><th>文字</th><th>意味</th><th>例</th></tr>
<tr><td><code>Y</code></td><td>4桁の年</td><td>2026</td></tr>
<tr><td><code>m</code></td><td>2桁の月（ゼロ埋め）</td><td>08</td></tr>
<tr><td><code>d</code></td><td>2桁の日（ゼロ埋め）</td><td>01</td></tr>
<tr><td><code>H</code></td><td>24時間制の時（ゼロ埋め）</td><td>12</td></tr>
<tr><td><code>i</code></td><td>分（ゼロ埋め）</td><td>00</td></tr>
<tr><td><code>s</code></td><td>秒（ゼロ埋め）</td><td>00</td></tr>
<tr><td><code>M</code></td><td>月の英語3文字</td><td>Aug</td></tr>
<tr><td><code>D</code></td><td>曜日の英語3文字</td><td>Sat</td></tr>
</table>
<p>つまり<code>2026-08-01</code>形式なら<code>'Y-m-d'</code>が正解です。この種のバグはエラーメッセージが頼れないので、<strong>出力を目で検算する</strong>ことと、フォーマット文字が1文字単位である仕様を知っていることが防御になります。なお<code>mktime(時, 分, 秒, 月, 日, 年)</code>は指定日時のタイムスタンプ（1970年1月1日からの経過秒数）を作る関数です。</p>`,
      task: `実行すると「2026202620262026-AugAug-SatSat」という壊れた日時が表示されます。フォーマットを修正して「2026-08-01 12:00」と表示されるようにしてください。`,
      code: `<?php
date_default_timezone_set('Asia/Tokyo');

// 2026年8月1日12時0分0秒のタイムスタンプを作る
$timestamp = mktime(12, 0, 0, 8, 1, 2026);

// YYYY・MM・DDはPHPのフォーマット文字ではない
echo date('YYYY-MM-DD', $timestamp) . "\\n";
`,
      solution: `<?php
date_default_timezone_set('Asia/Tokyo');

// 2026年8月1日12時0分0秒のタイムスタンプを作る
$timestamp = mktime(12, 0, 0, 8, 1, 2026);

// 年はY、月はm、日はd、時はH、分はi（1文字ずつが指定）
echo date('Y-m-d H:i', $timestamp) . "\\n";
`,
      hints: [
        `PHPのdate()はフォーマット文字列を1文字ずつ解釈します。Yを4回書くと年が4回出力されます。`,
        `年月日は'Y-m-d'、時分は'H:i'です。合わせて'Y-m-d H:i'とします。`
      ],
      expectedOutput: "2026-08-01 12:00"
    },
    {
      id: 244,
      title: "substrで日本語が壊れる（mb_関数）",
      explanation: `<p>日本語の文字列を<code>substr()</code>で切ると、文字化けが起きることがあります。</p>
<pre><code>echo substr('こんにちは世界', 0, 5);
// こ� のような壊れた出力になる</code></pre>
<p>原因は文字の内部表現です。UTF-8（現在標準の文字エンコーディング）では、半角英数字は1文字1バイトですが、<strong>日本語は1文字3バイト</strong>で格納されます。<code>substr()</code>は「先頭から5<strong>バイト</strong>」を切り出す関数なので、「こ」（3バイト）＋「ん」の先頭2バイトという中途半端な位置で切断され、壊れたバイト列は<code>�</code>（置換文字）として表示されます。</p>
<p>日本語を扱うときは、<strong>バイト単位ではなく文字単位で動くmb_（マルチバイト）系関数</strong>を使います。</p>
<table>
<tr><th>バイト単位</th><th>文字単位</th><th>用途</th></tr>
<tr><td><code>strlen()</code></td><td><code>mb_strlen()</code></td><td>長さを数える</td></tr>
<tr><td><code>substr()</code></td><td><code>mb_substr()</code></td><td>一部を切り出す</td></tr>
<tr><td><code>strpos()</code></td><td><code>mb_strpos()</code></td><td>検索位置を調べる</td></tr>
<tr><td><code>strtoupper()</code></td><td><code>mb_strtoupper()</code></td><td>大文字化</td></tr>
</table>
<p>たとえば<code>strlen('こんにちは')</code>は15（バイト数）を返しますが、<code>mb_strlen('こんにちは')</code>は5（文字数）を返します。「文字数制限のバリデーション」「先頭N文字の抜粋表示」など実務で頻出する処理は、日本語が入る可能性がある限りmb_系を使うのが原則です。エラーも警告も出ないバグなので、<strong>日本語データでのテスト</strong>が唯一の検出手段になることも覚えておいてください。</p>`,
      task: `実行すると「こ�」のように文字化けします。文字単位で切り出す関数に修正して「先頭5文字：こんにちは」と表示されるようにしてください。`,
      code: `<?php
$title = 'こんにちは世界';

// substrはバイト単位で切るため、UTF-8の日本語が壊れる
echo '先頭5文字：' . substr($title, 0, 5) . "\\n";
`,
      solution: `<?php
$title = 'こんにちは世界';

// mb_substrは文字単位で切るので日本語も安全
echo '先頭5文字：' . mb_substr($title, 0, 5) . "\\n";
`,
      hints: [
        `UTF-8の日本語は1文字3バイトです。substr()はバイト単位で切るため、文字の途中で切断されています。`,
        `文字単位で切り出すにはmb_substr($title, 0, 5)を使います。引数の並びはsubstrと同じです。`
      ],
      expectedOutput: "先頭5文字：こんにちは"
    },
    {
      id: 245,
      title: "浮動小数点の比較ミス（0.1+0.2）",
      explanation: `<p>プログラミング全言語共通の有名な罠です。次のコードは直感に反してelse側に進みます。</p>
<pre><code>$total = 0.1 + 0.2;
var_dump($total == 0.3); // bool(false) ！
printf("%.20f", $total); // 0.30000000000000004441</code></pre>
<p>原因は、コンピュータが小数を2進数で保持していることです。10進数の0.1は2進数では<strong>無限に続く循環小数</strong>になるため、どこかで打ち切られ、ごくわずかな誤差を含んだ近似値として格納されます。0.1＋0.2の結果は0.3ちょうどではなく0.30000000000000004…なので、<code>==</code>でも<code>===</code>でも一致しません。</p>
<p>対策は主に3つあります。</p>
<table>
<tr><th>対策</th><th>方法</th><th>向いている場面</th></tr>
<tr><td>誤差を許して比較</td><td><code>abs($a - $b) &lt; 0.00001</code></td><td>科学計算・一般の小数比較</td></tr>
<tr><td>整数に直して扱う</td><td>金額は「円」でなく「銭」、つまり100倍して整数で計算</td><td>金額計算（実務の定石）</td></tr>
<tr><td>丸めてから比較</td><td><code>round($a, 2) === round($b, 2)</code></td><td>表示桁数が決まっている場合</td></tr>
</table>
<p>誤差許容の比較では、許容する誤差の上限を<strong>イプシロン（epsilon）</strong>と呼びます。<code>abs()</code>（絶対値を返す関数）で差の大きさを取り、それがイプシロンより小さければ「実質的に等しい」とみなす書き方が定番です。実務で特に事故が多いのは金額計算で、消費税の端数などが浮動小数点誤差と重なると1円ズレます。だから会計システムは金額を最小単位の整数で持つのです。</p>`,
      task: `実行すると「合計は0.3ではありません？」と表示されてしまいます。イプシロン（許容誤差）0.00001を使った比較に修正し、「合計は0.3です」と表示されるようにしてください。`,
      code: `<?php
$total = 0.1 + 0.2;

// 浮動小数点数を == で比較している
if ($total == 0.3) {
    echo '合計は0.3です' . "\\n";
} else {
    echo '合計は0.3ではありません？' . "\\n";
    printf("実際の値：%.20f\\n", $total);
}
`,
      solution: `<?php
$total = 0.1 + 0.2;

// 差が十分小さいかどうかで比較する
$epsilon = 0.00001;
if (abs($total - 0.3) < $epsilon) {
    echo '合計は0.3です' . "\\n";
} else {
    echo '合計は0.3ではありません？' . "\\n";
}
`,
      hints: [
        `0.1+0.2は内部的に0.30000000000000004…なので、==では0.3と一致しません。「差が十分小さいか」で判定しましょう。`,
        `abs($total - 0.3) < 0.00001 のように、差の絶対値がイプシロンより小さいかを条件にします。`
      ],
      expectedOutput: "合計は0.3です"
    },
    {
      id: 246,
      title: "無限ループ（条件更新忘れ）",
      explanation: `<p><strong>注意：このステップの初期コードは実行すると無限ループになります。</strong>先にコードを読んで原因を特定し、修正してから実行してください。</p>
<pre><code>$count = 0;
while ($count &lt; 3) {
    echo '処理中...';
    // $count++ を忘れている！
}</code></pre>
<p>whileループは「条件がtrueの間、繰り返す」構文です。ループ本体のどこかで<strong>条件に使っている変数を更新しない限り、条件は永遠にtrueのまま</strong>で、プログラムは同じ処理を無限に繰り返します。ループを正しく書くための3点セットを確認しましょう。</p>
<table>
<tr><th>要素</th><th>例</th><th>忘れたときの症状</th></tr>
<tr><td>初期化</td><td><code>$count = 0;</code></td><td>Undefined variable警告</td></tr>
<tr><td>条件</td><td><code>$count &lt; 3</code></td><td>1回も実行されない・回りすぎる</td></tr>
<tr><td>更新</td><td><code>$count++;</code></td><td><strong>無限ループ</strong></td></tr>
</table>
<p>無限ループしたときの止まり方は環境によって違います。CLI（コマンドライン）では既定で時間制限がなく、Ctrl+Cで手動停止するまで回り続けます。Webサーバー経由では<code>max_execution_time</code>（既定30秒）を超えると「Fatal error: Maximum execution time of 30 seconds exceeded」で強制終了されます。<strong>画面が固まって応答しなくなったら、まず無限ループを疑う</strong>のがデバッグの第一歩です。</p>
<p>なお、この種の事故を構造的に防ぐのがforeachです。foreachは配列の要素を自動で1つずつ進めるため、更新忘れが起きません。回数が決まった繰り返しはfor、コレクションの走査はforeachを優先し、whileは「終了条件が特殊な場合」に限定すると安全です。</p>`,
      task: `初期コードは<code>$count</code>を更新し忘れているため無限ループします。実行する前にループ内に更新処理を追加し、「処理中...」を3回表示したあと「完了：3回実行しました」と表示されるようにしてください。`,
      code: `<?php
$count = 0;

// ループ内で$countを増やし忘れているため条件が永遠にtrue
while ($count < 3) {
    echo '処理中...' . "\\n";
}

echo '完了：' . $count . '回実行しました' . "\\n";
`,
      solution: `<?php
$count = 0;

// 毎回$countを更新して、いつか条件がfalseになるようにする
while ($count < 3) {
    echo '処理中...' . "\\n";
    $count++;
}

echo '完了：' . $count . '回実行しました' . "\\n";
`,
      hints: [
        `whileの条件に使っている変数が、ループ本体の中で一度も変化していないことに注目してください。`,
        `echoの次の行に$count++;を追加すれば、3回目のあとに条件$count < 3がfalseになってループを抜けます。`
      ],
      expectedOutput: "完了：3回実行しました"
    },
    {
      id: 247,
      title: "off-by-oneエラー（添字のズレ）",
      explanation: `<p>off-by-oneエラー（1つずれのバグ）は、ループの範囲が正解より1つ多い・少ないという古典的バグです。今回のコードは1位から3位までを表示したいのに、こう出力されます。</p>
<pre><code>1位：銀
2位：銅
Warning: Undefined array key 3
3位：</code></pre>
<p>原因は<strong>配列の添字が0始まり</strong>であることを忘れて、ループを1から回していることです。<code>$medals[1]</code>は2番目の要素（銀）なので全体が1つずれ、最後は存在しない<code>$medals[3]</code>にアクセスして「Undefined array key 3」の警告が出ます。この警告は第21章で学んだとおり「そのキーが配列に存在しない」という意味で、off-by-oneの現場では<strong>ズレの決定的な証拠</strong>になります。</p>
<p>要素数<code>count($arr)</code>がNのとき、有効な添字は0からN-1までです。forループの正しい定石はこれです。</p>
<pre><code>for ($i = 0; $i &lt; count($medals); $i++) {
    echo ($i + 1) . '位：' . $medals[$i] . "\\n";
}</code></pre>
<p>ポイントは2つあります。<strong>開始は0</strong>、そして<strong>条件は<code>&lt;=</code>ではなく<code>&lt;</code></strong>です。<code>$i &lt;= count($medals)</code>と書くと、$iがNのときにも本体が実行され、やはり存在しない添字を踏みます。「N個の要素を0からN-1で回す」ため、<code>&lt; count()</code>がちょうどN回になります。表示上の順位（1始まり）が必要なら、添字はそのままにして表示のときだけ<code>$i + 1</code>すると、境界の管理が1か所で済みます。そもそも添字を自分で管理しないforeachを使えばこの種のバグは構造的に起きません。forを使うのは添字そのものが必要な場合に限るのが安全策です。</p>`,
      task: `実行すると順位が1つずれ、最後にWarningが出ます。ループを添字0始まりに修正し、「1位：金」「2位：銀」「3位：銅」と正しく表示されるようにしてください（表示の順位は<code>$i + 1</code>で作ります）。`,
      code: `<?php
$medals = ['金', '銀', '銅'];

// 添字が0始まりであることを忘れ、1からcountまで回している
for ($i = 1; $i <= count($medals); $i++) {
    echo $i . '位：' . $medals[$i] . "\\n";
}
`,
      solution: `<?php
$medals = ['金', '銀', '銅'];

// 有効な添字は0〜count-1。開始は0、条件は < にする
for ($i = 0; $i < count($medals); $i++) {
    echo ($i + 1) . '位：' . $medals[$i] . "\\n";
}
`,
      hints: [
        `配列の添字は0から始まります。$medals[1]は2番目の要素です。Warningの「array key 3」は存在しない4番目を指しています。`,
        `$i = 0から始めて条件を$i < count($medals)にし、表示する順位は($i + 1)で作ります。`
      ],
      expectedOutput: "1位：金"
    },
    {
      id: 248,
      title: "集計変数をループ内で初期化する罠",
      explanation: `<p>次のコードはエラーも警告も出ませんが、合計が90になります。正しくは80+65+90=235のはずです。</p>
<pre><code>foreach ($scores as $score) {
    $total = 0;        // ループの中で毎回リセットされる！
    $total += $score;
}
echo $total; // 90（最後の要素だけ）</code></pre>
<p>原因は<strong>集計変数の初期化がループの内側にある</strong>ことです。ループ本体は要素の数だけ実行されるので、<code>$total = 0;</code>も毎回実行されます。つまり「足しては0に戻す」を繰り返し、ループを抜けた時点で残っているのは<strong>最後の要素を足した結果だけ</strong>です。90という値が「最後の要素と同じ」なのが典型的な症状で、この形を見たら初期化位置を疑ってください。</p>
<p>変数には「いつ作られ、いつ消えるか」というライフサイクルがあります。集計のように<strong>ループをまたいで値を持ち越したい変数はループの外で1回だけ初期化</strong>し、ループ内では更新だけを行います。逆に、その回しか使わない一時変数はループ内で作って構いません。</p>
<pre><code>$total = 0;              // 持ち越す変数：外で1回だけ
foreach ($scores as $score) {
    $total += $score;    // 中では更新だけ
}</code></pre>
<p>この種の論理バグはエラーメッセージが出ないため、<strong>「入力から手計算した期待値」と「実際の出力」を突き合わせる検算</strong>が唯一の検出手段です。原因を探すときは、ループ内に<code>var_dump($total);</code>を仕込んで毎回の値の変化を観察すると、「増えては0に戻っている」ことが一目で分かります。テストコードを書く習慣が論理バグの最大の防御になる、という実務の教訓につながるステップです。</p>`,
      task: `実行すると合計が90になってしまいます（正しくは235）。集計変数<code>$total</code>の初期化をループの前に移動して、「合計：235」と表示されるようにしてください。`,
      code: `<?php
$scores = [80, 65, 90];

foreach ($scores as $score) {
    // 集計変数の初期化がループの中にあるため、毎回0に戻ってしまう
    $total = 0;
    $total += $score;
}

echo '合計：' . $total . "\\n";
`,
      solution: `<?php
$scores = [80, 65, 90];

// 集計変数はループの前に1回だけ初期化する
$total = 0;
foreach ($scores as $score) {
    $total += $score;
}

echo '合計：' . $total . "\\n";
`,
      hints: [
        `$total = 0;がループ本体にあると、要素を足すたびに0へリセットされます。結果が「最後の要素と同じ値」になるのが典型的な症状です。`,
        `$total = 0;をforeachの直前に移動し、ループ内には$total += $score;だけを残します。`
      ],
      expectedOutput: "合計：235"
    },
    {
      id: 249,
      title: "早期returnの欠如で条件が上書きされる",
      explanation: `<p>在庫0のときに「在庫切れです」と表示したいのに、「残りわずかです」になってしまうバグです。</p>
<pre><code>if ($stock === 0) {
    $message = '在庫切れです';
}
if ($stock &lt; 10) {          // 0も10未満なので、ここも実行される！
    $message = '残りわずかです';
}</code></pre>
<p>独立したif文を並べると、<strong>条件を満たすすべてのブロックが上から順に実行</strong>されます。在庫0は「0である」と「10未満である」の両方に該当するため、先に代入した'在庫切れです'が次のifで'残りわずかです'に上書きされてしまうのです。エラーは出ないので、出力を見て初めて気づく論理バグです。</p>
<p>修正パターンは3つあります。</p>
<table>
<tr><th>パターン</th><th>書き方</th><th>特徴</th></tr>
<tr><td>早期return</td><td>条件を満たしたら即<code>return</code></td><td>後続の判定を構造的に実行させない</td></tr>
<tr><td>elseif連鎖</td><td><code>if 〜 elseif 〜 else</code></td><td>どれか1つだけ実行される</td></tr>
<tr><td>match式</td><td><code>match (true) { ... }</code></td><td>値を返す式として書ける（第20章）</td></tr>
</table>
<p>おすすめは<strong>早期return（ガード節とも呼びます）</strong>です。「特殊なケースを先頭で片付けて即座に関数を抜ける」ことで、(1)条件の上書きが構造的に起こらない、(2)ネストが深くならない、(3)後ろに行くほど「前の条件はすべて該当しなかった」と読める、という3つの利点があります。並べる<strong>順序も重要</strong>で、より特殊な条件（=== 0）を先に、より広い条件（&lt; 10）を後に書きます。逆順にすると0が「10未満」に先に捕まってしまいます。第24章のcatchの順序（具体的な例外クラスを先に書く）と同じ発想です。</p>`,
      task: `実行すると在庫0なのに「残りわずかです」と表示されます。3つのif文を早期return（条件を満たしたら即return）に書き換えて、在庫0で「在庫切れです」と表示されるようにしてください。`,
      code: `<?php
function checkStock(int $stock): string
{
    $message = '';
    if ($stock === 0) {
        $message = '在庫切れです';
    }
    if ($stock < 10) {
        $message = '残りわずかです';
    }
    if ($stock >= 10) {
        $message = '在庫あり';
    }
    return $message;
}

echo checkStock(0) . "\\n";
echo checkStock(5) . "\\n";
echo checkStock(20) . "\\n";
`,
      solution: `<?php
function checkStock(int $stock): string
{
    // 条件を満たしたら即returnし、後の判定を実行させない
    if ($stock === 0) {
        return '在庫切れです';
    }
    if ($stock < 10) {
        return '残りわずかです';
    }
    return '在庫あり';
}

echo checkStock(0) . "\\n";
echo checkStock(5) . "\\n";
echo checkStock(20) . "\\n";
`,
      hints: [
        `在庫0は「=== 0」と「< 10」の両方に該当するため、あとのif文がメッセージを上書きしています。`,
        `各ifの中で$messageに代入する代わりにreturnで即座に返すと、後続の判定は実行されません。最後は無条件にreturn '在庫あり';とできます。`
      ],
      expectedOutput: "在庫切れです"
    },
    {
      id: 250,
      title: "卒業課題：バグだらけのスクリプトを完全修復する",
      explanation: `<p>いよいよ最終ステップです。会員ポイントを集計するスクリプトに、この章と第21〜24章で学んだ種類のバグが<strong>6個</strong>仕込まれています。すべて修正して、正しいレポートを出力させてください。</p>
<p>実際の開発と同じで、エラーは一度に全部は表示されません。<strong>最初のFatal errorを直すと、次のWarningが見えてくる</strong>という連鎖です。デバッグの手順を整理します。</p>
<ol>
<li>実行して、最初に出たエラーメッセージの種類・内容・行番号を読む</li>
<li>その行だけでなく「そこに来た値がなぜおかしいのか」を1段さかのぼる</li>
<li>1つ直したら再実行し、次のメッセージへ進む</li>
<li>エラーが消えたら、出力を期待値と突き合わせて論理バグを探す</li>
</ol>
<p>仕込まれているバグの種類は次のとおりです（学んだステップの復習です）。</p>
<table>
<tr><th>種類</th><th>復習ステップ</th></tr>
<tr><td>壊れたJSON（末尾カンマ）とnullチェック忘れ</td><td>241</td></tr>
<tr><td>正規表現のデリミタ忘れ</td><td>242</td></tr>
<tr><td>dateフォーマット文字の間違い</td><td>243</td></tr>
<tr><td>substrによる日本語の破壊</td><td>244</td></tr>
<tr><td>ループ範囲のoff-by-one</td><td>247</td></tr>
<tr><td>集計変数のループ内初期化</td><td>248</td></tr>
</table>
<p>すべて修正できたときの期待出力はこちらです。</p>
<pre><code>田中さん（M001）：120pt
鈴木さん（M002）：80pt
※MX3は会員IDの形式が不正のためスキップ
合計：200pt
集計日：2026-08-02</code></pre>
<p>会員IDの正しい形式は「Mに続けて数字3桁」で、形式が不正な会員はスキップして合計に含めません。JSON自体の修正（末尾カンマの削除）に加えて、解析失敗に備えたnullチェックも残しておくのが実務流です。ここまでの50ステップで、あなたはエラーメッセージを「怖いもの」ではなく「原因を教えてくれる案内板」として読めるようになったはずです。卒業おめでとうございます。</p>`,
      task: `スクリプトに仕込まれた6個のバグをすべて修正し、期待出力どおり（合計：200pt、集計日：2026-08-02など5行）になるようにしてください。JSONの修正とnullチェックの追加の両方を行うこと。`,
      code: `<?php
// 会員ポイント集計レポート（バグが6個あります）
$json = '[
    {"id": "M001", "name": "田中太郎", "point": 120},
    {"id": "M002", "name": "鈴木花子", "point": 80},
    {"id": "MX3", "name": "佐藤次郎", "point": 55},
]';

$members = json_decode($json, true);

for ($i = 0; $i <= count($members); $i++) {
    $total = 0;
    $member = $members[$i];

    if (!preg_match('^M\\d{3}$', $member['id'])) {
        echo '※' . $member['id'] . 'は会員IDの形式が不正のためスキップ' . "\\n";
        continue;
    }

    $sei = substr($member['name'], 0, 2);
    echo $sei . 'さん（' . $member['id'] . '）：' . $member['point'] . 'pt' . "\\n";
    $total += $member['point'];
}

echo '合計：' . $total . 'pt' . "\\n";

date_default_timezone_set('Asia/Tokyo');
echo '集計日：' . date('YYYY-MM-DD', mktime(9, 0, 0, 8, 2, 2026)) . "\\n";
`,
      solution: `<?php
// 会員ポイント集計レポート（修正済み）
$json = '[
    {"id": "M001", "name": "田中太郎", "point": 120},
    {"id": "M002", "name": "鈴木花子", "point": 80},
    {"id": "MX3", "name": "佐藤次郎", "point": 55}
]';

$members = json_decode($json, true);
if ($members === null) {
    echo 'JSONの解析に失敗しました：' . json_last_error_msg() . "\\n";
    exit;
}

$total = 0;
for ($i = 0; $i < count($members); $i++) {
    $member = $members[$i];

    if (!preg_match('/^M\\d{3}$/', $member['id'])) {
        echo '※' . $member['id'] . 'は会員IDの形式が不正のためスキップ' . "\\n";
        continue;
    }

    $sei = mb_substr($member['name'], 0, 2);
    echo $sei . 'さん（' . $member['id'] . '）：' . $member['point'] . 'pt' . "\\n";
    $total += $member['point'];
}

echo '合計：' . $total . 'pt' . "\\n";

date_default_timezone_set('Asia/Tokyo');
echo '集計日：' . date('Y-m-d', mktime(9, 0, 0, 8, 2, 2026)) . "\\n";
`,
      hints: [
        `まず実行して最初のFatal errorから読みましょう。count()にnullが渡るのは、json_decodeが失敗しているからです。JSONの末尾カンマを削除し、nullチェックも追加します。`,
        `次はループです。条件の<=を<に直し、$total = 0;をループの前に移動します。`,
        `仕上げに、preg_matchのパターンを/で囲み、substrをmb_substrに、date('YYYY-MM-DD')をdate('Y-m-d')に直します。`
      ],
      expectedOutput: "合計：200pt"
    }
  ]
});
