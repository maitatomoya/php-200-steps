// 第13章：組み込み関数の実践
registerChapter({
  number: 13,
  title: "組み込み関数の実践",
  description: "日付・JSON・正規表現・数学関数など、実務で毎日のように使うPHPの組み込み関数を実践的に学びます。",
  steps: [
    {
      id: 121,
      title: "dateとDateTimeImmutableの基本",
      explanation: `<p>日付と時刻の扱いは、実務のPHPで最も頻出するテーマの1つです。PHPには手軽な<code>date()</code>関数と、日時をオブジェクトとして扱う<code>DateTimeImmutable</code>クラスがあります。</p>
<p><code>date('Y-m-d')</code>のように書くと「現在時刻」を指定した書式の文字列にできます。ただし実行するたびに結果が変わるため、テストや自動判定には向きません。そこで本章では、<code>DateTimeImmutable::createFromFormat()</code>という静的メソッドで「固定の日時」を作って練習します。第1引数に書式、第2引数に日時文字列を渡すと、その日時を表すオブジェクトが得られます。</p>
<pre><code>$dt = DateTimeImmutable::createFromFormat('Y-m-d H:i:s', '2026-01-15 12:00:00');
echo $dt-&gt;format('Y/m/d');  // 2026/01/15</code></pre>
<p>書式指定子（フォーマット文字）の主なものは次のとおりです。<code>format()</code>と<code>date()</code>で共通です。</p>
<table>
<tr><th>指定子</th><th>意味</th><th>例</th></tr>
<tr><td><code>Y</code></td><td>4桁の年</td><td>2026</td></tr>
<tr><td><code>m</code> / <code>d</code></td><td>2桁の月 / 日（ゼロ埋め）</td><td>08 / 02</td></tr>
<tr><td><code>H</code> / <code>i</code> / <code>s</code></td><td>時（24時間制）/ 分 / 秒</td><td>09 / 30 / 00</td></tr>
<tr><td><code>N</code></td><td>曜日番号（1=月曜〜7=日曜）</td><td>7</td></tr>
</table>
<p>クラスには<code>DateTime</code>と<code>DateTimeImmutable</code>の2種類があります。Immutable（イミュータブル＝不変）の方は、日時を変更するメソッドが元のオブジェクトを書き換えず「新しいオブジェクトを返す」ため、意図しない書き換え事故が起きません。現在はDateTimeImmutableの使用が推奨されています。</p>`,
      task: `<code>createFromFormat()</code>を使って「2026-08-02 09:30:00」を表すDateTimeImmutableを作り、日本語の日付・時刻・曜日番号を出力してください。`,
      code: `<?php
// TODO: createFromFormatを使って固定日時のDateTimeImmutableを作る
// 書式は 'Y-m-d H:i:s'、日時文字列は '2026-08-02 09:30:00'
$dt = null;

echo $dt->format('Y年m月d日') . PHP_EOL;
echo $dt->format('H:i:s') . PHP_EOL;
echo '曜日番号: ' . $dt->format('N') . PHP_EOL;`,
      solution: `<?php
// 固定の日時からDateTimeImmutableを作る（現在時刻に依存しない）
$dt = DateTimeImmutable::createFromFormat('Y-m-d H:i:s', '2026-08-02 09:30:00');

echo $dt->format('Y年m月d日') . PHP_EOL;
echo $dt->format('H:i:s') . PHP_EOL;
echo '曜日番号: ' . $dt->format('N') . PHP_EOL;`,
      hints: [
        `createFromFormatは「クラス名::メソッド名」の形で呼び出す静的メソッドです。第1引数が書式、第2引数が日時文字列です。`,
        `DateTimeImmutable::createFromFormat('Y-m-d H:i:s', '2026-08-02 09:30:00') の戻り値を$dtに代入します。`
      ],
      expectedOutput: "2026年08月02日"
    },
    {
      id: 122,
      title: "DateTimeの差分diffとDateInterval",
      explanation: `<p>「開始日から締切まであと何日か」のような日付の計算は、<code>diff()</code>メソッドと<code>DateInterval</code>クラスで行います。</p>
<p><code>$a-&gt;diff($b)</code>は2つの日時の差を表す<code>DateInterval</code>オブジェクトを返します。差の内訳はプロパティや<code>format()</code>で取り出せます。</p>
<table>
<tr><th>書き方</th><th>意味</th></tr>
<tr><td><code>$interval-&gt;days</code></td><td>差の総日数（プロパティ）</td></tr>
<tr><td><code>%y %m %d</code></td><td>format()用。年・月・日の内訳</td></tr>
<tr><td><code>%a</code></td><td>format()用。総日数</td></tr>
<tr><td><code>%h %i</code></td><td>format()用。時・分</td></tr>
</table>
<p>また、<code>new DateInterval('P10D')</code>のようにISO 8601の期間表記で間隔を作り、<code>add()</code>や<code>sub()</code>で日時に足し引きできます。<code>P10D</code>は「10日間」、<code>P1M</code>は「1ヶ月」、<code>PT2H</code>は「2時間」です（時刻部分にはTを挟みます）。</p>
<pre><code>$start = DateTimeImmutable::createFromFormat('!Y-m-d', '2026-04-01');
$next = $start-&gt;add(new DateInterval('P7D'));
echo $next-&gt;format('Y-m-d');  // 2026-04-08</code></pre>
<p>1つ注意があります。<code>createFromFormat('Y-m-d', ...)</code>のように時刻を指定しない書式を使うと、<strong>時刻部分は「現在時刻」で埋められます</strong>。日数計算がずれる原因になるため、書式の先頭に<code>!</code>を付けて「指定しなかった部分を00:00:00にリセット」するのが定石です。</p>`,
      task: `2026-04-01から2026-08-02までの差を求め、「◯ヶ月◯日」と総日数を出力してください。さらに開始日の10日後を締切として出力してください。`,
      code: `<?php
$start = DateTimeImmutable::createFromFormat('!Y-m-d', '2026-04-01');
$end = DateTimeImmutable::createFromFormat('!Y-m-d', '2026-08-02');

// TODO: $startと$endの差をdiff()で求めて$intervalに代入する
$interval = null;

echo $interval->format('%mヶ月%d日') . PHP_EOL;
echo '総日数: ' . $interval->days . '日' . PHP_EOL;

// TODO: $startの10日後をadd()とDateInterval('P10D')で求めて$deadlineに代入する
$deadline = null;

echo '締切: ' . $deadline->format('Y-m-d') . PHP_EOL;`,
      solution: `<?php
$start = DateTimeImmutable::createFromFormat('!Y-m-d', '2026-04-01');
$end = DateTimeImmutable::createFromFormat('!Y-m-d', '2026-08-02');

// 2つの日時の差はDateIntervalオブジェクトとして得られる
$interval = $start->diff($end);

echo $interval->format('%mヶ月%d日') . PHP_EOL;
echo '総日数: ' . $interval->days . '日' . PHP_EOL;

// DateIntervalを足すと新しいDateTimeImmutableが返る（元は変わらない）
$deadline = $start->add(new DateInterval('P10D'));

echo '締切: ' . $deadline->format('Y-m-d') . PHP_EOL;`,
      hints: [
        `差分は$start->diff($end)で取得できます。戻り値がDateIntervalです。`,
        `10日後は$start->add(new DateInterval('P10D'))です。DateTimeImmutableなので戻り値を受け取るのを忘れずに。`
      ],
      expectedOutput: "総日数: 123日"
    },
    {
      id: 123,
      title: "json_encode（配列をJSONに変換する）",
      explanation: `<p>JSON（JavaScript Object Notation）は、APIや設定ファイルで広く使われるデータ交換フォーマットです。PHPの配列は<code>json_encode()</code>でJSON文字列に変換できます。</p>
<pre><code>$user = ['name' =&gt; '佐藤', 'age' =&gt; 28];
echo json_encode($user);
// {"name":"佐藤","age":28}</code></pre>
<p>そのまま使うと日本語が<code>佐</code>のようなUnicodeエスケープになり、1行に詰め込まれて読みにくい形になります。第2引数にオプション定数を渡すと出力を調整できます。</p>
<table>
<tr><th>オプション</th><th>効果</th></tr>
<tr><td><code>JSON_UNESCAPED_UNICODE</code></td><td>日本語などをエスケープせずそのまま出力する</td></tr>
<tr><td><code>JSON_PRETTY_PRINT</code></td><td>改行とインデントで整形して出力する</td></tr>
<tr><td><code>JSON_UNESCAPED_SLASHES</code></td><td>スラッシュ/をエスケープしない（URL向き）</td></tr>
<tr><td><code>JSON_THROW_ON_ERROR</code></td><td>変換に失敗したとき例外JsonExceptionを投げる</td></tr>
</table>
<p>複数のオプションは<code>|</code>（ビットOR演算子）でつなぎます。「フラグを重ねて指定する」PHPの定番イディオムなので、この形ごと覚えてしまいましょう。</p>
<pre><code>echo json_encode($user, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);</code></pre>
<p>なお、キーが0から始まる連番の配列はJSONの配列<code>[...]</code>に、連想配列はJSONのオブジェクト<code>{...}</code>に変換されます。この対応関係は次のステップのjson_decodeでも重要になります。</p>`,
      task: `コードをそのまま実行して3つの出力の違いを観察してください。その後、<code>$user</code>に好きなキーを1つ追加して再実行してみましょう。`,
      code: `<?php
$user = [
    'name' => '佐藤',
    'age' => 28,
    'skills' => ['PHP', 'SQL'],
];

// オプションなし（日本語がエスケープされる）
echo json_encode($user) . PHP_EOL;

// 日本語をそのまま出力
echo json_encode($user, JSON_UNESCAPED_UNICODE) . PHP_EOL;

// 整形＋日本語そのまま
echo json_encode($user, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . PHP_EOL;`,
      solution: `<?php
$user = [
    'name' => '佐藤',
    'age' => 28,
    'skills' => ['PHP', 'SQL'],
];

// オプションなし（日本語がエスケープされる）
echo json_encode($user) . PHP_EOL;

// 日本語をそのまま出力
echo json_encode($user, JSON_UNESCAPED_UNICODE) . PHP_EOL;

// 整形＋日本語そのまま
echo json_encode($user, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . PHP_EOL;`,
      hints: [
        `まずはそのまま実行して、3つの出力を1行ずつ見比べてみましょう。`,
        `オプションを2つ同時に使うときは JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE のように|でつなぎます。`
      ],
      expectedOutput: "\"name\": \"佐藤\""
    },
    {
      id: 124,
      title: "json_decode（JSONを配列に戻す）",
      explanation: `<p>外部APIから受け取ったJSON文字列をPHPで使うには、<code>json_decode()</code>で変換します。ここで最重要なのが<strong>第2引数の連想配列フラグ</strong>です。</p>
<pre><code>$json = '{"title":"PHP入門","price":2800}';

$obj = json_decode($json);          // stdClassオブジェクトになる
echo $obj-&gt;title;                   // アロー演算子でアクセス

$arr = json_decode($json, true);    // 連想配列になる
echo $arr['title'];                 // 角括弧でアクセス</code></pre>
<p>第2引数を省略するとstdClass（PHPの汎用オブジェクト）が返り、<code>true</code>を渡すと連想配列が返ります。実務では配列関数（<code>array_map</code>や<code>count</code>など）をそのまま使える連想配列形式がよく選ばれます。</p>
<table>
<tr><th>JSON側</th><th>decode結果（true指定時）</th></tr>
<tr><td><code>{"a": 1}</code></td><td>連想配列 <code>['a' =&gt; 1]</code></td></tr>
<tr><td><code>[1, 2, 3]</code></td><td>配列 <code>[1, 2, 3]</code></td></tr>
<tr><td><code>null / true / 数値 / 文字列</code></td><td>対応するPHPの値</td></tr>
</table>
<p>不正なJSONを渡すと<code>json_decode()</code>は<code>null</code>を返します。JSON自体の<code>null</code>と区別がつかないため、確実にエラーを検出したい場面では第4引数に<code>JSON_THROW_ON_ERROR</code>を渡して例外で処理するのが現代的な書き方です。</p>`,
      task: `JSON文字列を連想配列としてデコードし、タイトル・価格・タグ数を出力してください。最後にオブジェクト形式でもデコードして違いを確認します。`,
      code: `<?php
$json = '{"title":"PHP入門","price":2800,"tags":["初心者","Web"]}';

// TODO: 連想配列としてデコードする（第2引数に注目）
$data = json_decode($json);

echo $data['title'] . PHP_EOL;
echo '価格: ' . $data['price'] . '円' . PHP_EOL;
echo 'タグ数: ' . count($data['tags']) . PHP_EOL;

// こちらはオブジェクト形式のまま
$obj = json_decode($json);
echo $obj->title . PHP_EOL;`,
      solution: `<?php
$json = '{"title":"PHP入門","price":2800,"tags":["初心者","Web"]}';

// 第2引数trueで連想配列としてデコードされる
$data = json_decode($json, true);

echo $data['title'] . PHP_EOL;
echo '価格: ' . $data['price'] . '円' . PHP_EOL;
echo 'タグ数: ' . count($data['tags']) . PHP_EOL;

// 第2引数を省略するとstdClassオブジェクトになる
$obj = json_decode($json);
echo $obj->title . PHP_EOL;`,
      hints: [
        `初期コードのままだと$dataはオブジェクトなので、$data['title']の角括弧アクセスがエラーになります。`,
        `json_decode($json, true) のように第2引数にtrueを渡すと連想配列になります。`
      ],
      expectedOutput: "価格: 2800円"
    },
    {
      id: 125,
      title: "preg_match（正規表現の基本とキャプチャ）",
      explanation: `<p>正規表現は「文字列のパターン」を記述するミニ言語です。PHPでは<code>preg_match()</code>でパターンに一致するか調べられます。パターンは<code>/</code>などの区切り文字（デリミタ）で囲んで文字列として渡します。</p>
<table>
<tr><th>記法</th><th>意味</th></tr>
<tr><td><code>\\d</code> / <code>\\w</code> / <code>\\s</code></td><td>数字 / 英数字とアンダースコア / 空白</td></tr>
<tr><td><code>+</code> / <code>*</code> / <code>?</code></td><td>1回以上 / 0回以上 / 0回か1回</td></tr>
<tr><td><code>{4}</code> / <code>{2,5}</code></td><td>ちょうど4回 / 2〜5回</td></tr>
<tr><td><code>^</code> / <code>$</code></td><td>先頭 / 末尾</td></tr>
<tr><td><code>[abc]</code> / <code>[a-z]</code></td><td>いずれか1文字 / 範囲指定</td></tr>
</table>
<p><code>preg_match()</code>は一致すると<code>1</code>、一致しないと<code>0</code>、パターン自体が不正なら<code>false</code>を返します。戻り値がintとboolの混在なので、判定は<code>=== 1</code>と厳密比較するのが安全です。</p>
<p>パターンの一部を<code>( )</code>で囲むと、その部分だけを取り出せます。これを<strong>キャプチャ（捕捉）</strong>と呼び、第3引数に渡した変数に結果が入ります。<code>$m[0]</code>が全体一致、<code>$m[1]</code>以降が括弧の中身です。</p>
<pre><code>$log = 'ID:1234 status:OK';
if (preg_match('/ID:(\\d+)/', $log, $m) === 1) {
    echo $m[1];  // 1234
}</code></pre>
<p><code>(?&lt;year&gt;\\d{4})</code>のように名前を付けると<code>$m['year']</code>で取り出せる「名前付きキャプチャ」もあり、可読性が上がるので実務でよく使われます。</p>`,
      task: `ログの行頭から日付「YYYY-MM-DD」を3つのキャプチャで取り出し、年・月・日を出力してください。パターンは<code>\\d{4}</code>のような桁数指定を使います。`,
      code: `<?php
$log = '2026-08-02 09:30:15 [ERROR] disk full';

// TODO: 行頭の日付を (年)-(月)-(日) の3つのグループでキャプチャする
$pattern = '/^/';

if (preg_match($pattern, $log, $m) === 1) {
    echo '年: ' . $m[1] . PHP_EOL;
    echo '月: ' . $m[2] . PHP_EOL;
    echo '日: ' . $m[3] . PHP_EOL;
} else {
    echo '一致しませんでした' . PHP_EOL;
}`,
      solution: `<?php
$log = '2026-08-02 09:30:15 [ERROR] disk full';

// 行頭^から、4桁-2桁-2桁の数字をそれぞれキャプチャする
$pattern = '/^(\\d{4})-(\\d{2})-(\\d{2})/';

if (preg_match($pattern, $log, $m) === 1) {
    echo '年: ' . $m[1] . PHP_EOL;
    echo '月: ' . $m[2] . PHP_EOL;
    echo '日: ' . $m[3] . PHP_EOL;
} else {
    echo '一致しませんでした' . PHP_EOL;
}`,
      hints: [
        `4桁の数字は\\d{4}、2桁は\\d{2}です。取り出したい部分をそれぞれ( )で囲みます。`,
        `パターン全体は '/^(\\d{4})-(\\d{2})-(\\d{2})/' の形になります。ハイフンは括弧の外に置きます。`
      ],
      expectedOutput: "年: 2026"
    },
    {
      id: 126,
      title: "preg_match_allとpreg_replace",
      explanation: `<p>preg_matchは「最初の1件」しか見つけません。文字列中の<strong>すべての一致</strong>を集めるには<code>preg_match_all()</code>、一致した部分を<strong>置換</strong>するには<code>preg_replace()</code>を使います。</p>
<pre><code>$text = 'A-101とB-205とC-330';
$count = preg_match_all('/[A-Z]-\\d+/', $text, $m);
// $count は 3、$m[0] は ['A-101', 'B-205', 'C-330']</code></pre>
<p><code>preg_match_all()</code>は一致した件数を返し、第3引数の<code>$m[0]</code>に全一致の配列が入ります。キャプチャを使った場合は<code>$m[1]</code>に1番目の括弧の一致が配列で入ります。</p>
<p><code>preg_replace(パターン, 置換文字列, 対象)</code>は一致箇所をすべて置き換えた新しい文字列を返します。置換文字列の中では<code>$1</code>や<code>$2</code>でキャプチャした内容を参照できます（後方参照）。これを使うと「日付の形式変換」のような処理が1行で書けます。</p>
<pre><code>echo preg_replace('/(\\d{4})\\/(\\d{2})/', '$2月・$1年', '2026/08');
// 08月・2026年</code></pre>
<table>
<tr><th>関数</th><th>戻り値</th><th>用途</th></tr>
<tr><td><code>preg_match</code></td><td>1 / 0 / false</td><td>最初の1件の検査・抽出</td></tr>
<tr><td><code>preg_match_all</code></td><td>一致件数</td><td>全件の抽出</td></tr>
<tr><td><code>preg_replace</code></td><td>置換後の文字列</td><td>一致箇所の置き換え</td></tr>
</table>`,
      task: `文中のメールアドレスを全件抽出して件数と一覧を出力し、次に@より前を***にマスクしてください。最後に日付をスラッシュ区切りからハイフン区切りの「日-月-年」に変換します。`,
      code: `<?php
$text = '連絡先: alice@example.com と bob@example.org です';

// TODO: メールアドレス（英小文字+@+英小文字+ドット+英小文字）を全件抽出する
$count = 0;
$matches = [[]];

echo 'メール数: ' . $count . PHP_EOL;
foreach ($matches[0] as $email) {
    echo $email . PHP_EOL;
}

// TODO: 「英小文字の連続+@」を '***@' に置換して$maskedに代入する
$masked = $text;
echo $masked . PHP_EOL;

$date = '2026/08/02';
// TODO: キャプチャと後方参照$1〜$3で '02-08-2026' に変換する
echo $date . PHP_EOL;`,
      solution: `<?php
$text = '連絡先: alice@example.com と bob@example.org です';

// 全件抽出：戻り値が件数、$matches[0]に一致した文字列の配列が入る
$count = preg_match_all('/[a-z]+@[a-z]+\\.[a-z]+/', $text, $matches);

echo 'メール数: ' . $count . PHP_EOL;
foreach ($matches[0] as $email) {
    echo $email . PHP_EOL;
}

// @より前をマスクする（一致箇所はすべて置換される）
$masked = preg_replace('/[a-z]+@/', '***@', $text);
echo $masked . PHP_EOL;

$date = '2026/08/02';
// 後方参照$1〜$3で順序を入れ替える（パターン内の/は\\/とエスケープ）
echo preg_replace('/(\\d{4})\\/(\\d{2})\\/(\\d{2})/', '$3-$2-$1', $date) . PHP_EOL;`,
      hints: [
        `メールアドレスのパターンは '/[a-z]+@[a-z]+\\.[a-z]+/' です。ドットは\\.とエスケープします。`,
        `マスクは preg_replace('/[a-z]+@/', '***@', $text) で作れます。`,
        `日付変換は '/(\\d{4})\\/(\\d{2})\\/(\\d{2})/' でキャプチャし、置換文字列を '$3-$2-$1' にします。`
      ],
      expectedOutput: "メール数: 2"
    },
    {
      id: 127,
      title: "math系関数（abs・round・floor・ceil・max・min・intdiv）",
      explanation: `<p>数値計算の基本関数をまとめて押さえましょう。金額計算や集計処理で毎日使う顔ぶれです。</p>
<table>
<tr><th>関数</th><th>意味</th><th>例</th></tr>
<tr><td><code>abs($n)</code></td><td>絶対値</td><td><code>abs(-7)</code> → 7</td></tr>
<tr><td><code>round($n, $桁)</code></td><td>四捨五入（桁数指定可）</td><td><code>round(3.456, 2)</code> → 3.46</td></tr>
<tr><td><code>floor($n)</code></td><td>切り捨て（小さい方の整数へ）</td><td><code>floor(3.9)</code> → 3</td></tr>
<tr><td><code>ceil($n)</code></td><td>切り上げ（大きい方の整数へ）</td><td><code>ceil(3.1)</code> → 4</td></tr>
<tr><td><code>max(...) / min(...)</code></td><td>最大値 / 最小値</td><td><code>max(3, 8, 5)</code> → 8</td></tr>
<tr><td><code>intdiv($a, $b)</code></td><td>整数の割り算（商）</td><td><code>intdiv(17, 5)</code> → 3</td></tr>
</table>
<p>いくつか注意点があります。</p>
<ul>
<li><code>floor()</code>と<code>ceil()</code>の戻り値は<strong>float型</strong>です。int型が必要なら<code>(int)</code>でキャストします。</li>
<li><code>max()</code>と<code>min()</code>は<code>max(1, 2, 3)</code>のような可変長引数でも、<code>max([1, 2, 3])</code>のような配列1つでも呼べます。</li>
<li><code>intdiv()</code>は商だけを返す整数除算です。余りは<code>%</code>演算子で求めます。「17個を5個ずつ箱詰めすると3箱できて2個余る」のような計算はこのペアで書きます。</li>
<li>負の数では<code>floor(-3.1)</code>は-4、<code>ceil(-3.1)</code>は-3になります。「切り捨て＝0に近づく」ではない点に注意してください。</li>
</ul>
<p><code>round()</code>は端数がちょうど0.5のとき0から遠ざかる方向へ丸めます（<code>round(2.5)</code>は3）。丸め方式は第3引数で変更できますが、まずは既定の動作を覚えれば十分です。</p>`,
      task: `コードをそのまま実行して各関数の結果を確認してください。その後、数値をいろいろ変えて（特に負の数で）floorとceilの動きを観察しましょう。`,
      code: `<?php
echo 'abs: ' . abs(-7) . PHP_EOL;
echo 'round: ' . round(3.456, 2) . PHP_EOL;
echo 'floor: ' . floor(3.9) . PHP_EOL;
echo 'ceil: ' . ceil(3.1) . PHP_EOL;
echo 'max: ' . max(3, 8, 5) . PHP_EOL;
echo 'min: ' . min([4, 2, 9]) . PHP_EOL;

// 17個を5個ずつ箱詰めすると？
echo '箱の数: ' . intdiv(17, 5) . PHP_EOL;
echo '余り: ' . (17 % 5) . PHP_EOL;`,
      solution: `<?php
echo 'abs: ' . abs(-7) . PHP_EOL;
echo 'round: ' . round(3.456, 2) . PHP_EOL;
echo 'floor: ' . floor(3.9) . PHP_EOL;
echo 'ceil: ' . ceil(3.1) . PHP_EOL;
echo 'max: ' . max(3, 8, 5) . PHP_EOL;
echo 'min: ' . min([4, 2, 9]) . PHP_EOL;

// 17個を5個ずつ箱詰めすると？
echo '箱の数: ' . intdiv(17, 5) . PHP_EOL;
echo '余り: ' . (17 % 5) . PHP_EOL;`,
      hints: [
        `まずはそのまま実行して、表の内容と出力が一致することを確認しましょう。`,
        `floor(-3.1)とceil(-3.1)も試すと、負の数での挙動がよく分かります。`
      ],
      expectedOutput: "round: 3.46"
    },
    {
      id: 128,
      title: "固定シードmt_srandで再現可能な乱数",
      explanation: `<p>乱数はゲームや抽選、テストデータ生成などで使います。PHPの乱数関数には歴史的な経緯でいくつか種類があります。</p>
<table>
<tr><th>関数</th><th>特徴</th></tr>
<tr><td><code>rand()</code></td><td>古い乱数。現在はmt_randの別名だが、あえて使う理由はない</td></tr>
<tr><td><code>mt_rand($min, $max)</code></td><td>メルセンヌ・ツイスタ方式。高速で品質もよい</td></tr>
<tr><td><code>random_int($min, $max)</code></td><td>暗号学的に安全。パスワードやトークン生成はこちら</td></tr>
</table>
<p>乱数は毎回結果が変わるのが本来の姿ですが、それでは「同じ入力なら同じ結果」を確認するテストが書けません。そこで使うのが<code>mt_srand($seed)</code>です。乱数の<strong>シード（種）</strong>を固定すると、以降の<code>mt_rand()</code>の出力列が毎回同じになります。</p>
<pre><code>mt_srand(42);
echo mt_rand(1, 6);  // 何度実行しても同じ値になる</code></pre>
<p>これを「再現可能な乱数」と呼びます。ゲームのリプレイ機能、乱数を使うロジックの単体テスト、デバッグ時の不具合再現などで実際に使われるテクニックです。逆に、セキュリティ用途では予測できてしまうため絶対に使いません。用途で使い分けましょう。</p>
<ul>
<li>テストやシミュレーションの再現 → <code>mt_srand()</code> + <code>mt_rand()</code></li>
<li>トークンや抽選など予測されては困るもの → <code>random_int()</code>（シード指定は不可）</li>
</ul>`,
      task: `シードを2024に固定してサイコロ（1〜6）を5回振り、結果の一覧と合計を出力してください。何度実行しても同じ結果になることを確認しましょう。`,
      code: `<?php
// TODO: シードを2024に固定する（この1行がないと毎回結果が変わる）

$rolls = [];
for ($i = 0; $i < 5; $i++) {
    // TODO: mt_randで1〜6の乱数を生成して$rollsに追加する
}

echo 'サイコロ: ' . implode(', ', $rolls) . PHP_EOL;
echo '合計: ' . array_sum($rolls) . PHP_EOL;`,
      solution: `<?php
// シードを固定すると、以降のmt_randの結果列は毎回同じになる
mt_srand(2024);

$rolls = [];
for ($i = 0; $i < 5; $i++) {
    $rolls[] = mt_rand(1, 6);
}

echo 'サイコロ: ' . implode(', ', $rolls) . PHP_EOL;
echo '合計: ' . array_sum($rolls) . PHP_EOL;`,
      hints: [
        `シードの固定はループの前に一度だけmt_srand(2024)を呼びます。`,
        `ループ内は $rolls[] = mt_rand(1, 6); で追加できます。`
      ],
      expectedOutput: "サイコロ: 3, 3, 5, 3, 4"
    },
    {
      id: 129,
      title: "rangeとarray_fill・array_combine",
      explanation: `<p>「連番の配列がほしい」「同じ値で初期化した配列がほしい」という場面のための生成系関数を学びます。</p>
<table>
<tr><th>関数</th><th>意味</th><th>例</th></tr>
<tr><td><code>range($開始, $終了)</code></td><td>連続する値の配列</td><td><code>range(1, 5)</code> → [1,2,3,4,5]</td></tr>
<tr><td><code>range($開始, $終了, $間隔)</code></td><td>間隔つきの連番</td><td><code>range(0, 10, 2)</code> → [0,2,4,6,8,10]</td></tr>
<tr><td><code>array_fill($開始添字, $個数, $値)</code></td><td>同じ値で埋めた配列</td><td><code>array_fill(0, 3, 0)</code> → [0,0,0]</td></tr>
<tr><td><code>array_combine($キー配列, $値配列)</code></td><td>2つの配列から連想配列を作る</td><td>下のコード例参照</td></tr>
</table>
<p><code>range()</code>は数値だけでなく<code>range('a', 'e')</code>のように文字にも使えます。テストデータの生成やループ回数の指定に便利です。</p>
<p><code>array_combine()</code>は、片方をキー、もう片方を値として組み合わせます。CSVの「ヘッダー行＋データ行」を連想配列にする、といった実務処理の定番です。</p>
<pre><code>$header = ['name', 'age'];
$row = ['佐藤', 28];
$assoc = array_combine($header, $row);
// ['name' =&gt; '佐藤', 'age' =&gt; 28]</code></pre>
<p>1つだけ重要な注意があります。<code>array_combine()</code>は<strong>2つの配列の要素数が同じでないとValueErrorが発生します</strong>。外部データを扱うときは、事前に<code>count()</code>で件数を確認するか、try-catchで受け止める設計にしましょう。</p>`,
      task: `実行するとValueErrorが発生します。エラーメッセージを読み、array_combineに渡す2つの配列の要素数が合うように修正してください。`,
      code: `<?php
$nums = range(1, 5);
echo implode(',', $nums) . PHP_EOL;

$evens = range(0, 10, 2);
echo implode(',', $evens) . PHP_EOL;

$initial = array_fill(0, 3, 0);
echo implode('/', $initial) . PHP_EOL;

$subjects = ['国語', '数学', '英語'];
$points = [80, 92];  // 要素数が合っていない！

$scores = array_combine($subjects, $points);
foreach ($scores as $subject => $point) {
    echo $subject . ': ' . $point . '点' . PHP_EOL;
}`,
      solution: `<?php
$nums = range(1, 5);
echo implode(',', $nums) . PHP_EOL;

$evens = range(0, 10, 2);
echo implode(',', $evens) . PHP_EOL;

$initial = array_fill(0, 3, 0);
echo implode('/', $initial) . PHP_EOL;

$subjects = ['国語', '数学', '英語'];
$points = [80, 92, 75];  // キー側と同じ3要素にそろえる

$scores = array_combine($subjects, $points);
foreach ($scores as $subject => $point) {
    echo $subject . ': ' . $point . '点' . PHP_EOL;
}`,
      hints: [
        `エラーメッセージに「must have the same number of elements（同じ要素数でなければならない）」とあります。`,
        `$subjectsは3教科なので、$pointsにも3つ目の点数（例：75）を追加します。`
      ],
      expectedOutput: "数学: 92点"
    },
    {
      id: 130,
      title: "総合演習：JSONデータの集計レポート",
      explanation: `<p>この章の総仕上げとして、実務で頻出する「JSONデータを読み込んで集計レポートを作る」処理を書きます。使う道具はすべてこの章と過去の章で学んだものです。</p>
<ol>
<li><code>json_decode($json, true)</code>でJSON文字列を連想配列にする</li>
<li><code>preg_match()</code>で対象月のレコードだけに絞り込む</li>
<li>カテゴリ別にループで合計を積み上げる</li>
<li><code>arsort()</code>で金額の大きい順に並べ、<code>sprintf()</code>で整形して出力する</li>
</ol>
<p>集計の中心になるのは「キーがなければ0で初期化してから加算する」というパターンです。未定義キーに<code>+=</code>するとWarningが出るため、必ず初期化を挟みます。</p>
<pre><code>if (!isset($totals[$category])) {
    $totals[$category] = 0;
}
$totals[$category] += $record['amount'];</code></pre>
<p>絞り込みには<code>preg_match('/^2026-07/', $date)</code>のように「先頭一致」を使います。ループの先頭で条件を満たさないものを<code>continue</code>で飛ばす書き方（早期スキップ）は、ネストを浅く保つ実務の定石です。</p>
<p>最後の並べ替えに使う<code>arsort()</code>は「キーと値の対応を保ったまま、値の降順でソート」する関数です。カテゴリ名（キー）と合計金額（値）の対応を崩さずに順位付けできるため、ランキング系の集計と相性が抜群です。</p>`,
      task: `家計簿のJSONデータから2026年7月のレコードだけを集計し、カテゴリ別合計を金額の大きい順に出力してください。最後に総合計も出力します。`,
      code: `<?php
$json = '[
    {"date": "2026-07-01", "category": "食費", "amount": 1200},
    {"date": "2026-07-03", "category": "交通費", "amount": 800},
    {"date": "2026-07-15", "category": "食費", "amount": 1500},
    {"date": "2026-07-20", "category": "娯楽", "amount": 3000},
    {"date": "2026-08-01", "category": "食費", "amount": 900},
    {"date": "2026-08-02", "category": "交通費", "amount": 600}
]';

// TODO: JSONを連想配列にデコードする
$records = [];

$totals = [];
foreach ($records as $record) {
    // TODO: dateが2026-07で始まらないレコードはcontinueで飛ばす

    // TODO: カテゴリ別に$totalsへ加算する（未定義キーの初期化を忘れずに）
}

// TODO: 金額の大きい順に並べ替える

echo '=== 2026年7月 支出レポート ===' . PHP_EOL;
foreach ($totals as $category => $total) {
    echo sprintf('%s: %d円', $category, $total) . PHP_EOL;
}
echo '合計: ' . array_sum($totals) . '円' . PHP_EOL;`,
      solution: `<?php
$json = '[
    {"date": "2026-07-01", "category": "食費", "amount": 1200},
    {"date": "2026-07-03", "category": "交通費", "amount": 800},
    {"date": "2026-07-15", "category": "食費", "amount": 1500},
    {"date": "2026-07-20", "category": "娯楽", "amount": 3000},
    {"date": "2026-08-01", "category": "食費", "amount": 900},
    {"date": "2026-08-02", "category": "交通費", "amount": 600}
]';

// JSONを連想配列にデコードする
$records = json_decode($json, true);

$totals = [];
foreach ($records as $record) {
    // 2026年7月以外のレコードは早期スキップ
    if (preg_match('/^2026-07/', $record['date']) !== 1) {
        continue;
    }

    $category = $record['category'];
    // 未定義キーへの加算はWarningになるので、必ず初期化してから足す
    if (!isset($totals[$category])) {
        $totals[$category] = 0;
    }
    $totals[$category] += $record['amount'];
}

// キーとの対応を保ったまま値の降順に並べ替える
arsort($totals);

echo '=== 2026年7月 支出レポート ===' . PHP_EOL;
foreach ($totals as $category => $total) {
    echo sprintf('%s: %d円', $category, $total) . PHP_EOL;
}
echo '合計: ' . array_sum($totals) . '円' . PHP_EOL;`,
      hints: [
        `デコードはjson_decode($json, true)、絞り込みはpreg_match('/^2026-07/', $record['date']) !== 1 のときcontinueです。`,
        `加算の前に if (!isset($totals[$category])) { $totals[$category] = 0; } で初期化します。`,
        `並べ替えはarsort($totals)です。ソート関数は配列を直接書き換えるので戻り値の代入は不要です。`
      ],
      expectedOutput: "食費: 2700円"
    }
  ]
});
