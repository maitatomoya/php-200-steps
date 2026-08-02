// 第22章：よくあるエラー：型とnull
registerChapter({
  number: 22,
  title: "よくあるエラー：型とnull",
  description: "TypeError・DivisionByZeroError・nullがらみの警告など、型とnullに起因する実行時エラーの読み方と、型安全な直し方を学びます。",
  steps: [
    {
      id: 211,
      title: "TypeError：引数の型不一致（strict_types）",
      explanation: `<p>この章では実行時の<strong>型エラー</strong>を扱います。まずは<code>declare(strict_types=1)</code>（厳密な型チェックを有効にする宣言）があるコードに、intの引数へ文字列を渡した場合です。</p>
<pre><code>Fatal error: Uncaught TypeError: calcTax(): Argument #1 ($price)
must be of type int, string given, called in main.php on line 10</code></pre>
<p>このメッセージは非常に親切で、必要な情報がすべて入っています。</p>
<ul>
<li><code>calcTax()</code>：エラーが起きた<strong>関数名</strong></li>
<li><code>Argument #1 ($price)</code>：<strong>何番目のどの引数</strong>が問題か</li>
<li><code>must be of type int, string given</code>：<strong>intが必要なのにstringが渡された</strong></li>
<li><code>called in ... on line 10</code>：問題の<strong>呼び出し元の行番号</strong>。修正すべきはたいてい関数定義ではなくこちらです</li>
</ul>
<p>strict_typesがない場合、<code>"1000"</code>のような数値形式の文字列は自動でintに変換されて動いてしまいます。一見便利ですが、変換に頼ると「たまたま動く」コードになりがちです。<strong>strict_typesは型の食い違いを早期に発見してくれる味方</strong>だと捉えましょう。</p>
<p>修正の定石は、値が本当に数値であることを確認したうえで<strong>境界（入力を受け取った直後）で明示的に型変換する</strong>ことです。フォーム入力やCSVはすべて文字列で届くので、<code>(int)</code>キャストで「ここからはintとして扱う」と宣言してから内部の関数に渡します。</p>`,
      task: `実行すると<code>TypeError: ... must be of type int, string given</code>が出ます。呼び出し側で<code>(int)</code>キャストしてから渡すように修正してください。`,
      code: `<?php
declare(strict_types=1);

// 税込価格（10%）を計算する
function calcTax(int $price): int
{
    return intdiv($price * 110, 100);
}

// フォームから届いた入力を想定した文字列
$input = "1000";
echo "税込：" . calcTax($input) . "円\\n";
`,
      solution: `<?php
declare(strict_types=1);

// 税込価格（10%）を計算する
function calcTax(int $price): int
{
    return intdiv($price * 110, 100);
}

// フォームから届いた入力を想定した文字列
$input = "1000";
echo "税込：" . calcTax((int)$input) . "円\\n";
`,
      hints: [
        `メッセージのcalled in ... on lineが示すのは呼び出し側の行です。関数定義ではなく渡し方を直します。`,
        `calcTax($input)をcalcTax((int)$input)に変更し、文字列をintに変換してから渡します。`
      ],
      expectedOutput: "税込：1100円"
    },
    {
      id: 212,
      title: "==の暗黙変換バグ（エラーが出ない不具合）",
      explanation: `<p>今回はエラーメッセージが<strong>一切出ないのに結果が間違う</strong>、最も厄介なタイプのバグです。コードを実行すると、異なる2つのコードなのに「一致」と表示されてしまいます。</p>
<p>原因は緩やかな比較<code>==</code>です。<code>==</code>は比較の前に型変換を行い、<strong>両辺が数値形式の文字列なら数値として比較</strong>します。<code>"0e12345"</code>と<code>"0e99999"</code>はどちらも指数表記（0×10のn乗）として解釈できるため、数値としては両方0となり、<code>==</code>では等しいと判定されるのです。</p>
<pre><code>var_dump("0e12345" == "0e99999"); // bool(true)  数値0同士の比較になる
var_dump("1e3" == "1000");        // bool(true)  1000 == 1000
var_dump("0e12345" === "0e99999"); // bool(false) 文字列として比較</code></pre>
<p>歴史的な補足をすると、PHP 7までは<code>"abc" == 0</code>もtrueという有名な罠がありました（文字列が数値0に変換されていた）。<strong>PHP 8で比較ルールが改善され、これはfalseになりました</strong>。しかし上記のように「両辺が数値形式の文字列」のケースは今もPHP 8で再現します。実際、この挙動はハッシュ値の比較を<code>==</code>で書いたシステムの脆弱性（マジックハッシュ問題）として知られています。</p>
<p>結論はシンプルで、<strong>値の比較は常に厳密な比較<code>===</code>（型も値も一致して初めてtrue）を使う</strong>ことです。<code>==</code>をあえて使う正当な理由がある場面は、実務ではほぼありません。</p>`,
      task: `実行するとエラーは出ませんが、異なるコードなのに「コード一致」と表示されてしまいます。厳密な比較に修正して<code>コード不一致</code>と表示してください。`,
      code: `<?php
// 保存済みの確認コードと入力されたコードを照合する
$savedCode = "0e12345";
$inputCode = "0e99999";

if ($savedCode == $inputCode) {
    echo "コード一致：ログイン成功\\n";
} else {
    echo "コード不一致\\n";
}
`,
      solution: `<?php
// 保存済みの確認コードと入力されたコードを照合する
$savedCode = "0e12345";
$inputCode = "0e99999";

if ($savedCode === $inputCode) {
    echo "コード一致：ログイン成功\\n";
} else {
    echo "コード不一致\\n";
}
`,
      hints: [
        `==は両辺が数値形式の文字列だと数値として比較します。"0e12345"は指数表記の0と解釈されます。`,
        `型まで含めて比較する===に変更すれば、文字列同士として比較されます。`
      ],
      expectedOutput: "コード不一致"
    },
    {
      id: 213,
      title: "Warning：nullのプロパティを読む",
      explanation: `<p>「見つからなければnullを返す」関数の戻り値を、nullチェックせずにそのまま使うと次のWarningが出ます。</p>
<pre><code>Warning: Attempt to read property "name" on null in main.php on line 9</code></pre>
<p>「Attempt to read property "name" on null（null上のプロパティnameを読もうとした）」。つまり<code>$user-&gt;name</code>の<code>$user</code>がオブジェクトではなく<strong>nullだった</strong>ということです。読み取り結果はnull扱いになり、処理は止まらず続行します。画面には「名前：」とだけ表示され、肝心の名前が空になります。</p>
<p>このエラーは実務で最も頻繁に目にするものの1つです。原因のほとんどは<strong>「存在しないかもしれない」戻り値の未チェック</strong>で、検索系の関数（DBの1件取得など）は見つからないときにnullを返す設計が一般的だからです。戻り値の型が<code>?User</code>や<code>?object</code>のように<code>?</code>付き（nullable型）なら、「nullが返りうる」という宣言なので必ずチェックが必要です。</p>
<p>基本の修正パターンは早期リターン（ガード節）です。</p>
<pre><code>if ($user === null) {
    echo "ユーザーが見つかりません\\n";
    exit;
}
echo "名前：" . $user-&gt;name . "\\n"; // ここではnullでないと保証される</code></pre>
<p>なお、これがプロパティ読み取りではなく<strong>メソッド呼び出し</strong>だとWarningでは済まずFatal errorになります。次のステップで扱います。</p>`,
      task: `実行すると<code>Attempt to read property "name" on null</code>のWarningが出ます。nullチェックを追加し、見つからない場合は<code>ユーザーが見つかりません</code>と表示してください。`,
      code: `<?php
// IDでユーザーを探す。見つからなければnullを返す
function findUser(int $id): ?object
{
    $users = [1 => (object)["name" => "太郎"]];
    return $users[$id] ?? null;
}

$user = findUser(99);
echo "名前：" . $user->name . "\\n";
`,
      solution: `<?php
// IDでユーザーを探す。見つからなければnullを返す
function findUser(int $id): ?object
{
    $users = [1 => (object)["name" => "太郎"]];
    return $users[$id] ?? null;
}

$user = findUser(99);
if ($user === null) {
    echo "ユーザーが見つかりません\\n";
} else {
    echo "名前：" . $user->name . "\\n";
}
`,
      hints: [
        `戻り値の型?objectは「nullが返ることがある」という宣言です。使う前に確認が必要です。`,
        `if ($user === null)で分岐し、nullなら「ユーザーが見つかりません」を表示します。`
      ],
      expectedOutput: "ユーザーが見つかりません"
    },
    {
      id: 214,
      title: "Fatal error：nullへのメソッド呼び出しとnullsafe演算子",
      explanation: `<p>前ステップの「null上のプロパティ読み取り」はWarningでしたが、<strong>nullに対するメソッド呼び出しはFatal error</strong>で即停止します。</p>
<pre><code>Fatal error: Uncaught Error: Call to a member function getName() on null in main.php:14</code></pre>
<p>「Call to a member function getName() on null（null上のメンバー関数getNameを呼んだ）」。プロパティ読み取りは「nullとみなして続行」できますが、メソッドは実行すべき本体が存在しないため続行不能、という理屈です。<strong>on nullという末尾表現を見たら、矢印<code>-&gt;</code>の左側の変数がnullだった</strong>と即断してかまいません。</p>
<p>if文でのnullチェックでも直せますが、PHP 8には専用の<strong>nullsafe演算子<code>?-&gt;</code></strong>があります。左側がnullなら<strong>メソッドを呼ばずに式全体をnullにする</strong>演算子です。</p>
<pre><code>$name = $user?-&gt;getName();          // $userがnullなら$nameもnull
$name = $user?-&gt;getName() ?? "不明"; // null合体演算子と組み合わせて既定値まで用意</code></pre>
<p>この<code>?-&gt;</code>と<code>??</code>の組み合わせは「nullなら既定値」を1行で表現できる現代PHPの定番イディオムです。使い分けの目安は次の通りです。</p>
<ul>
<li>nullの場合に<strong>別の処理（エラー表示・早期リターン）</strong>をしたい→if文でチェック</li>
<li>nullの場合は<strong>既定値で流したい</strong>→<code>?-&gt;</code>＋<code>??</code></li>
</ul>`,
      task: `実行すると<code>Call to a member function getName() on null</code>のFatal errorが出ます。nullsafe演算子<code>?-&gt;</code>とnull合体演算子<code>??</code>を使い、見つからない場合は<code>名前：不明</code>と表示してください。`,
      code: `<?php
class User
{
    public function __construct(private string $name) {}

    public function getName(): string
    {
        return $this->name;
    }
}

// IDでユーザーを探す。見つからなければnullを返す
function findUser(int $id): ?User
{
    $users = [1 => new User("太郎")];
    return $users[$id] ?? null;
}

$user = findUser(99);
echo "名前：" . $user->getName() . "\\n";
`,
      solution: `<?php
class User
{
    public function __construct(private string $name) {}

    public function getName(): string
    {
        return $this->name;
    }
}

// IDでユーザーを探す。見つからなければnullを返す
function findUser(int $id): ?User
{
    $users = [1 => new User("太郎")];
    return $users[$id] ?? null;
}

$user = findUser(99);
echo "名前：" . ($user?->getName() ?? "不明") . "\\n";
`,
      hints: [
        `on nullは「矢印の左側がnullだった」の合図です。$userがnullでも安全に呼ぶ書き方がありました。`,
        `$user?->getName()とすると、nullのとき式全体がnullになります。さらに?? "不明"で既定値を与えます。`
      ],
      expectedOutput: "名前：不明"
    },
    {
      id: 215,
      title: "Warning：Array to string conversion",
      explanation: `<p>配列をそのまま文字列連結やechoに使うと、次のWarningが出ます。</p>
<pre><code>Warning: Array to string conversion in main.php on line 4
購入商品：Array</code></pre>
<p>「Array to string conversion（配列から文字列への変換）」が起き、変換結果は中身に関係なく<strong>常に"Array"という6文字</strong>になります。画面に「Array」と表示されたら、このWarningとセットで<strong>配列を文字列の文脈に置いてしまった</strong>と判断できます。</p>
<p>直し方は「配列をどう文字列にしたいか」で選びます。</p>
<table>
<tr><th>やりたいこと</th><th>方法</th><th>結果の例</th></tr>
<tr><td>区切り文字でつないで表示</td><td><code>implode("、", $items)</code></td><td>りんご、みかん、ぶどう</td></tr>
<tr><td>デバッグで中身を確認</td><td><code>var_dump($items)</code>や<code>print_r($items)</code></td><td>型と構造つきの表示</td></tr>
<tr><td>データとして文字列化</td><td><code>json_encode($items)</code></td><td>JSON文字列</td></tr>
</table>
<p>表示目的なら<code>implode(区切り文字, 配列)</code>（配列の要素を区切り文字でつないだ1つの文字列を返す関数）が定番です。逆向きの<code>explode(区切り文字, 文字列)</code>とペアで覚えましょう。</p>
<p>このWarningは「変数が配列だと気づかずに扱った」サインでもあります。関数の戻り値が配列なのか文字列なのか曖昧なまま書いていないか、型を意識するきっかけにしてください。</p>`,
      task: `実行すると<code>Array to string conversion</code>のWarningが出て「Array」と表示されます。<code>implode</code>を使って要素を「、」区切りで表示してください。`,
      code: `<?php
// カートの中身を1行で表示したい
$items = ["りんご", "みかん", "ぶどう"];
echo "購入商品：" . $items . "\\n";
`,
      solution: `<?php
// カートの中身を1行で表示したい
$items = ["りんご", "みかん", "ぶどう"];
echo "購入商品：" . implode("、", $items) . "\\n";
`,
      hints: [
        `配列を文字列にそのまま連結はできません。要素をつないで1つの文字列にする関数がありました。`,
        `implode("、", $items)で「りんご、みかん、ぶどう」という文字列が得られます。`
      ],
      expectedOutput: "購入商品：りんご、みかん、ぶどう"
    },
    {
      id: 216,
      title: "DivisionByZeroError：ゼロ除算",
      explanation: `<p>0で割り算をすると、PHP 8では<strong>DivisionByZeroError</strong>というエラーが投げられ、catchしなければ停止します。</p>
<pre><code>Fatal error: Uncaught DivisionByZeroError: Division by zero in main.php:5
Stack trace:
#0 main.php(5): intdiv(0, 0)
#1 main.php(9): average(Array)
#2 {main}</code></pre>
<p>今回はStack trace（呼び出し履歴）が実際に役立つ形をしています。下から読むと「トップレベル（#2）→9行目でaverage関数を呼び（#1）→その中の5行目のintdivで発生（#0）」という経路が分かります。<strong>エラーの発生場所は関数の中でも、直すべき原因は呼び出し側のデータ（空配列）にある</strong>と突き止められるわけです。</p>
<p>ゼロ除算は<code>/</code>・<code>intdiv()</code>・剰余<code>%</code>のすべてで発生します。PHP 7までは<code>/</code>のゼロ除算はWarningを出してfalseを返すだけでしたが、<strong>PHP 8からは3つともDivisionByZeroErrorに統一</strong>され、見逃せなくなりました。</p>
<p>平均値の計算は「件数がゼロかもしれない」典型例です。定石は<strong>割る前に分母を確認するガード節</strong>で、空のときに何を返すか（0を返す・nullを返す・エラーにする）を仕様として決めておくことが重要です。今回は0を返す仕様にします。</p>
<pre><code>if (count($scores) === 0) {
    return 0; // 空なら平均は0とする仕様
}</code></pre>`,
      task: `実行すると空配列の平均計算で<code>DivisionByZeroError</code>が出ます。割り算の前にガード節を追加し、空配列のときは0を返すようにしてください。`,
      code: `<?php
// 点数の平均（整数）を返す
function average(array $scores): int
{
    return intdiv(array_sum($scores), count($scores));
}

echo "平均：" . average([80, 90, 70]) . "\\n";
echo "平均：" . average([]) . "\\n";
`,
      solution: `<?php
// 点数の平均（整数）を返す。空配列のときは0を返す
function average(array $scores): int
{
    if (count($scores) === 0) {
        return 0;
    }
    return intdiv(array_sum($scores), count($scores));
}

echo "平均：" . average([80, 90, 70]) . "\\n";
echo "平均：" . average([]) . "\\n";
`,
      hints: [
        `Stack traceを下から読むと、空配列[]を渡した呼び出しが原因と分かります。分母count($scores)が0になっています。`,
        `intdivの前にif (count($scores) === 0) { return 0; }のガード節を入れます。`
      ],
      expectedOutput: "平均：0"
    },
    {
      id: 217,
      title: "Warning：foreachにnullを渡す",
      explanation: `<p>foreachに配列でもオブジェクトでもない値（特にnull）を渡すと、次のWarningが出ます。</p>
<pre><code>Warning: foreach() argument must be of type array|object, null given in main.php on line 9</code></pre>
<p>「foreach()の引数はarray|object型でなければならないのに、nullが渡された（null given）」という意味です。ループは1回も実行されず、<strong>処理自体は止まらずに次へ進みます</strong>。そのため「一覧が表示されないだけで他は正常」という中途半端な画面になり、原因に気づきにくいバグです。</p>
<p>発生源はステップ213・214と同じく「見つからなければnullを返す」関数の戻り値です。修正は状況に応じて2パターンあります。</p>
<table>
<tr><th>方針</th><th>書き方</th><th>向いている場面</th></tr>
<tr><td>nullなら空配列として回す</td><td><code>foreach ($tags ?? [] as $tag)</code></td><td>「なければ何も表示しない」でよいとき</td></tr>
<tr><td>nullを事前に弾く</td><td><code>if ($tags === null) { ... }</code></td><td>「見つかりません」の表示など別処理をしたいとき</td></tr>
</table>
<p><code>?? []</code>のイディオムは「nullなら空配列に差し替える」という意味で、foreachは空配列に対しては単に0回ループするだけなので安全に通過できます。1行で済む手軽さから実務でも頻出です。</p>
<p>より根本的には、関数側の設計を「見つからなければnullではなく<strong>空配列を返す</strong>」に変える手もあります。戻り値の型が<code>array</code>に統一され、呼び出し側のnullチェックが一切不要になるためです。</p>`,
      task: `実行すると<code>foreach() argument must be of type array|object, null given</code>のWarningが出ます。<code>?? []</code>を使ってnullのときは空配列としてループするよう修正してください。`,
      code: `<?php
// 記事のタグ一覧を返す。なければnullを返す
function getTags(string $post): ?array
{
    $tags = ["news" => ["速報", "国内"]];
    return $tags[$post] ?? null;
}

$tags = getTags("blog");
foreach ($tags as $tag) {
    echo "タグ：" . $tag . "\\n";
}
echo "表示完了\\n";
`,
      solution: `<?php
// 記事のタグ一覧を返す。なければnullを返す
function getTags(string $post): ?array
{
    $tags = ["news" => ["速報", "国内"]];
    return $tags[$post] ?? null;
}

$tags = getTags("blog");
foreach ($tags ?? [] as $tag) {
    echo "タグ：" . $tag . "\\n";
}
echo "表示完了\\n";
`,
      hints: [
        `getTagsは?array型、つまりnullを返すことがあります。foreachに渡る前にnullを配列へ差し替えましょう。`,
        `foreach ($tags ?? [] as $tag)とすると、nullのときは空配列として0回ループになります。`
      ],
      expectedOutput: "表示完了"
    },
    {
      id: 218,
      title: "TypeError：count()に配列以外を渡す",
      explanation: `<p><code>count()</code>に配列でないものを渡すと、PHP 8ではTypeErrorになります。</p>
<pre><code>Fatal error: Uncaught TypeError: count(): Argument #1 ($value)
must be of type Countable|array, string given in main.php:5</code></pre>
<p>「count()の第1引数はCountable|array型でなければならないのに、stringが渡された」。<code>Countable</code>とは「数えられる」ことを表すインターフェースで、要するに<strong>count()は配列（と数えられる特別なオブジェクト）専用</strong>ということです。文字列の長さを数えたいなら<code>strlen()</code>（バイト数）や<code>mb_strlen()</code>（文字数）を使います。</p>
<p>ここにも歴史があります。<strong>PHP 7.2以前は<code>count("hello")</code>は警告すら出さずに1を返していました</strong>。「文字列も1個の値だから1」という理屈ですが、バグの温床でしかなく、7.2でWarning、8.0でTypeErrorへと段階的に厳格化されました。古いコードの移行時に踏みやすいポイントです。</p>
<p>今回のように<code>mixed</code>型（何でも受け取れる型）の引数を扱う関数では、<strong>使う前に型を確認する</strong>のが鉄則です。</p>
<pre><code>if (is_array($data)) {
    echo "件数：" . count($data) . "\\n";
} else {
    echo "配列ではないので数えられません\\n";
}</code></pre>
<p><code>is_array()</code>のほか、<code>is_string()</code>・<code>is_int()</code>などの型判定関数と組み合わせて、型ごとに適切な処理へ振り分けます。</p>`,
      task: `実行すると<code>count(): Argument #1 ($value) must be of type Countable|array, string given</code>のTypeErrorが出ます。<code>is_array()</code>で型を確認し、配列でなければ<code>配列ではないので数えられません</code>と表示してください。`,
      code: `<?php
// 渡されたデータの件数を表示する
function showCount(mixed $data): void
{
    echo "件数：" . count($data) . "\\n";
}

showCount(["a", "b", "c"]);
showCount("hello");
`,
      solution: `<?php
// 渡されたデータの件数を表示する
function showCount(mixed $data): void
{
    if (is_array($data)) {
        echo "件数：" . count($data) . "\\n";
    } else {
        echo "配列ではないので数えられません\\n";
    }
}

showCount(["a", "b", "c"]);
showCount("hello");
`,
      hints: [
        `count()は配列専用です。mixed型の引数は、使う前に型を確認する必要があります。`,
        `if (is_array($data))で分岐し、配列ならcount、そうでなければメッセージを表示します。`
      ],
      expectedOutput: "配列ではないので数えられません"
    },
    {
      id: 219,
      title: "Warning：数値と文字列の自動変換の落とし穴",
      explanation: `<p><code>"10個"</code>のような「数字で始まるが数値ではない文字列」を算術演算に使うと、次のWarningが出ます。</p>
<pre><code>Warning: A non-numeric value encountered in main.php on line 5
合計：15</code></pre>
<p>注目すべきは、<strong>警告を出しながらも計算は15と成功してしまう</strong>点です。PHPは先頭の数値部分だけを読み取って（"10個"→10）計算を続行します。整理すると、文字列を算術に使ったときの挙動は3段階あります。</p>
<table>
<tr><th>文字列</th><th><code>+ 5</code>の結果</th><th>エラー・警告</th></tr>
<tr><td><code>"10"</code>（完全な数値形式）</td><td>15</td><td>なし</td></tr>
<tr><td><code>"10個"</code>（数字で始まる）</td><td>15</td><td>Warning: A non-numeric value encountered</td></tr>
<tr><td><code>"個"</code>（数字で始まらない）</td><td>—</td><td>TypeError（ステップ208で学習）</td></tr>
</table>
<p>危険なのは真ん中の行です。動いてしまうため本番までWarningが放置され、「単位付きのデータが混ざると集計がずれる」といった発見しづらい不具合につながります。</p>
<p>修正は<strong>数値として扱う前に<code>(int)</code>キャストで意図を明示する</strong>ことです。<code>(int)"10個"</code>は警告なしで10になります（キャストは「先頭の数値を取り出す」仕様だと明確に決まっているため）。さらに堅牢にするなら、<code>is_numeric()</code>で完全な数値形式かを検証し、単位付きデータの混入自体を入口で検出する設計が理想です。今回はキャストで修正しましょう。</p>`,
      task: `実行すると<code>A non-numeric value encountered</code>のWarningが出ます（結果は15と表示される）。<code>(int)</code>キャストで警告なしに計算するよう修正してください。`,
      code: `<?php
// 在庫データに単位付きの文字列が混ざってしまった
$stock = "10個";
$added = 5;
echo "合計：" . ($stock + $added) . "\\n";
`,
      solution: `<?php
// 在庫データに単位付きの文字列が混ざってしまった
$stock = "10個";
$added = 5;
echo "合計：" . ((int)$stock + $added) . "\\n";
`,
      hints: [
        `"10個"をそのまま足すと、PHPは警告を出しつつ先頭の10だけで計算します。数値として扱う意図を明示しましょう。`,
        `$stockを(int)$stockに変更すると、警告なしで10として計算されます。`
      ],
      expectedOutput: "合計：15"
    },
    {
      id: 220,
      title: "総合演習：型安全に書き直す",
      explanation: `<p>この章の総仕上げです。カート集計のスクリプトに、この章で学んだ型エラーが2つ仕込まれています。1つ直すと次のエラーが現れる構成なので、エラーメッセージを読みながら順に修正してください。</p>
<p>1つ目は<strong>strict_types下のTypeError</strong>（ステップ211）です。</p>
<pre><code>Fatal error: Uncaught TypeError: Cart::add(): Argument #2 ($price)
must be of type int, string given, called in main.php on line 28</code></pre>
<p><code>Cart::add()</code>のようにクラス名::メソッド名の形で表示される点が関数のときとの違いです。<code>called in ... line 28</code>が示す呼び出し側で、文字列を渡している箇所を直します。</p>
<p>2つ目は<strong>nullへのメソッド呼び出し</strong>（ステップ214）です。</p>
<pre><code>Fatal error: Uncaught Error: Call to a member function total() on null</code></pre>
<p><code>on null</code>を見たら矢印の左側がnullです。<code>findCart()</code>は<code>?Cart</code>型、つまり見つからなければnullを返す設計なので、nullsafe演算子<code>?-&gt;</code>とnull合体演算子<code>??</code>で既定値0円につなげます。</p>
<p>最後に、この章の教訓を整理します。</p>
<ul>
<li><strong>TypeError</strong>は「呼び出し側の渡し方」をまず疑う（called inの行番号）</li>
<li><strong>on null</strong>系は「nullを返しうる関数の戻り値チェック漏れ」をまず疑う（<code>?</code>付き戻り値型が手がかり）</li>
<li>エラーにならない<code>==</code>や暗黙変換こそ危険。<strong><code>===</code>・明示的キャスト・nullチェック</strong>で意図をコードに書き込む</li>
</ul>`,
      task: `2つのバグ（strict_typesのTypeError・nullへのメソッド呼び出し）を順に修正してください。数値は<code>int</code>で渡し、ゲストのカートは<code>?-&gt;</code>と<code>??</code>で合計0円と表示します。`,
      code: `<?php
declare(strict_types=1);

// 買い物カート
class Cart
{
    private array $items = [];

    public function add(string $name, int $price): void
    {
        $this->items[] = ["name" => $name, "price" => $price];
    }

    public function total(): int
    {
        $sum = 0;
        foreach ($this->items as $item) {
            $sum += $item["price"];
        }
        return $sum;
    }
}

// 会員IDのカートを探す。なければnullを返す
function findCart(int $userId): ?Cart
{
    $carts = [1 => new Cart()];
    return $carts[$userId] ?? null;
}

$cart = findCart(1);
$cart->add("コーヒー", "500");
$cart->add("クッキー", 300);

$guestCart = findCart(99);
echo "会員の合計：" . $cart->total() . "円\\n";
echo "ゲストの合計：" . $guestCart->total() . "円\\n";
`,
      solution: `<?php
declare(strict_types=1);

// 買い物カート
class Cart
{
    private array $items = [];

    public function add(string $name, int $price): void
    {
        $this->items[] = ["name" => $name, "price" => $price];
    }

    public function total(): int
    {
        $sum = 0;
        foreach ($this->items as $item) {
            $sum += $item["price"];
        }
        return $sum;
    }
}

// 会員IDのカートを探す。なければnullを返す
function findCart(int $userId): ?Cart
{
    $carts = [1 => new Cart()];
    return $carts[$userId] ?? null;
}

$cart = findCart(1);
$cart->add("コーヒー", 500);
$cart->add("クッキー", 300);

$guestCart = findCart(99);
echo "会員の合計：" . $cart->total() . "円\\n";
echo "ゲストの合計：" . ($guestCart?->total() ?? 0) . "円\\n";
`,
      hints: [
        `まずTypeErrorのcalled in行を見ます。add()に"500"という文字列を渡している箇所を数値の500に直します。`,
        `次にCall to a member function total() on null。$guestCartはnullなので、そのまま->で呼べません。`,
        `$guestCart?->total() ?? 0とすれば、nullのとき合計0円として表示できます。`
      ],
      expectedOutput: "ゲストの合計：0円"
    }
  ]
});
