// 第15章：型システムの活用
registerChapter({
  number: 15,
  title: "型システムの活用",
  description: "strict_typesからunion型・intersection型・readonlyクラスまで、PHPの型システムを使いこなしてバグを未然に防ぐ書き方を学びます。",
  steps: [
    {
      id: 141,
      title: "strict_types宣言と効果の違い",
      explanation: `<p>PHPの型宣言には「弱いモード（coercive）」と「厳密モード（strict）」の2つの動作があります。ファイルの先頭に<code>declare(strict_types=1);</code>と書くと、そのファイル内の関数呼び出しで厳密な型チェックが行われます。</p>
<p>弱いモードでは、<code>int</code>型の引数に数値文字列<code>"21"</code>を渡すと自動的に<code>21</code>へ変換されます。一方、厳密モードでは型が一致しない値を渡した瞬間に<code>TypeError</code>（型違反を表す例外）が投げられます。</p>
<table>
<tr><th>呼び出し</th><th>弱いモード</th><th>strict_types=1</th></tr>
<tr><td><code>double(21)</code></td><td>OK</td><td>OK</td></tr>
<tr><td><code>double("21")</code></td><td>21に自動変換</td><td>TypeError</td></tr>
<tr><td><code>double("abc")</code></td><td>TypeError</td><td>TypeError</td></tr>
</table>
<p>宣言はファイルの<strong>最初の文</strong>でなければなりません（前にコメントは書けますが、コードは書けません）。また、効果が及ぶのは「そのファイルの中で行われる関数呼び出し」だけで、他のファイルには影響しません。</p>
<pre><code>&lt;?php
declare(strict_types=1); // 必ず最初の文に書く

function double(int $n): int
{
    return $n * 2;
}

echo double(21);   // 42
double("21");      // TypeError！
</code></pre>
<p>実務では「暗黙の変換によるバグを早期に発見できる」ため、strict_typesを常に付けるのが主流です。TypeErrorは例外なので、<code>try/catch</code>で捕捉することもできます。</p>`,
      task: `コメントアウトされている<code>declare(strict_types=1);</code>を有効にし、<code>double("21")</code>の呼び出しを<code>try/catch</code>で囲んで<code>TypeError</code>を捕捉し、「TypeErrorを捕捉: 文字列は渡せない」と出力してください。`,
      code: `<?php
// TODO: 次の行のコメントを外して厳密な型チェックを有効にしよう
// declare(strict_types=1);

function double(int $n): int
{
    return $n * 2;
}

echo double(21) . "\\n";

// 弱いモードでは"21"が21に自動変換されて動いてしまう
echo double("21") . "\\n";

// TODO: strict_typesを有効にしたら上の呼び出しをtry/catchで囲み、
// TypeErrorを捕捉して「TypeErrorを捕捉: 文字列は渡せない」と出力しよう
`,
      solution: `<?php
declare(strict_types=1);

function double(int $n): int
{
    return $n * 2;
}

// 正しい型ならそのまま動く
echo double(21) . "\\n";

// strict_typesでは数値文字列"21"でもTypeErrorになる
try {
    echo double("21") . "\\n";
} catch (TypeError $e) {
    echo "TypeErrorを捕捉: 文字列は渡せない" . "\\n";
}
`,
      hints: [
        `declare(strict_types=1);はファイルの最初の文として書く必要があります。<?phpの直後に置きましょう。`,
        `TypeErrorは例外クラスなので、catch (TypeError $e) { ... } で捕捉できます。`,
      ],
      expectedOutput: "TypeErrorを捕捉: 文字列は渡せない"
    },
    {
      id: 142,
      title: "union型（int|string）",
      explanation: `<p>union型（ユニオン型）は「複数の型のうちどれか」を表す型宣言で、型名を<code>|</code>（縦棒）でつなげて書きます。PHP 8.0で導入されました。</p>
<pre><code>function formatId(int|string $id): string
{
    if (is_int($id)) {
        return sprintf("番号ID: %05d", $id);
    }
    return "文字ID: " . strtoupper($id);
}
</code></pre>
<p>この関数は<code>int</code>と<code>string</code>のどちらでも受け取れますが、それ以外（配列など）を渡すとTypeErrorになります。「何でも受け取れる」のではなく「受け取れる型を明示的に列挙する」のがポイントです。</p>
<p>union型を受け取った側では、<code>is_int()</code>や<code>is_string()</code>などの型判定関数で分岐して、それぞれの型に応じた処理を書くのが定石です。この分岐を「型の絞り込み（narrowing）」と呼び、静的解析ツールも分岐後の型を理解してくれます。</p>
<table>
<tr><th>書き方</th><th>意味</th></tr>
<tr><td><code>int|string</code></td><td>intまたはstring</td></tr>
<tr><td><code>int|float</code></td><td>数値全般でよく使う組み合わせ</td></tr>
<tr><td><code>int|string|null</code></td><td>nullも許容する場合は明示的にnullを加える</td></tr>
</table>
<p>戻り値にもunion型を使えます。ただし、union型が増えすぎると呼び出し側の分岐も増えて複雑になるため、「本当に複数の型を受ける必要があるか」を設計段階で考えることが大切です。</p>`,
      task: `<code>formatId()</code>の引数の型を<code>int|string</code>のunion型に変更し、intと文字列の両方の呼び出しが成功するようにしてください。`,
      code: `<?php
declare(strict_types=1);

// TODO: 引数の型をint|stringのunion型に変更して、
// 両方の呼び出しを成功させよう
function formatId(int $id): string
{
    if (is_int($id)) {
        return sprintf("番号ID: %05d", $id);
    }
    return "文字ID: " . strtoupper($id);
}

echo formatId(42) . "\\n";
echo formatId("abc") . "\\n"; // 今はTypeErrorになる
`,
      solution: `<?php
declare(strict_types=1);

// int|string: intまたはstringを受け付けるunion型
function formatId(int|string $id): string
{
    if (is_int($id)) {
        return sprintf("番号ID: %05d", $id);
    }
    return "文字ID: " . strtoupper($id);
}

echo formatId(42) . "\\n";
echo formatId("abc") . "\\n";
`,
      hints: [
        `union型は型名を|でつなげて書きます。引数の型宣言の部分だけを書き換えれば動きます。`,
        `function formatId(int|string $id): string のように書きます。`,
      ],
      expectedOutput: "番号ID: 00042"
    },
    {
      id: 143,
      title: "nullable型と?の記法",
      explanation: `<p>「値があるかもしれないし、ないかもしれない」を型で表すのがnullable型（null許容型）です。型名の前に<code>?</code>を付けて<code>?string</code>と書くと、<code>string|null</code>と同じ意味になります。</p>
<pre><code>function greet(?string $name): string
{
    $who = $name ?? "ゲスト"; // null合体演算子で既定値
    return "こんにちは、" . $who . "さん";
}
</code></pre>
<p>nullableを受け取ったら、null合体演算子<code>??</code>（左がnullのとき右を返す演算子）や<code>is_null()</code>で必ずnullの場合の動きを決めます。「nullチェックを関数の入口で済ませる」と、以降のコードがシンプルになります。</p>
<p>戻り値にもnullableは使えます。「見つからなければnullを返す」検索系の関数でよく使うパターンです。</p>
<pre><code>function findScore(array $scores, string $key): ?int
{
    return $scores[$key] ?? null; // キーがなくてもWarningが出ない
}
</code></pre>
<p>設計上の注意点として、nullableを増やしすぎると呼び出し側のnullチェックだらけになります。次の指針を意識しましょう。</p>
<ul>
<li>「未指定」を表したいだけなら、デフォルト引数で済まないか検討する</li>
<li>戻り値のnullは「正常系の一種（見つからなかった）」に限定し、異常系は例外にする</li>
<li>nullを返した理由が複数あるなら、nullではなく専用の型やenumを検討する</li>
</ul>
<p>なお、<code>?string</code>と<code>string|null</code>は完全に同じ意味なので、チームでどちらの表記を使うか統一しておくと読みやすくなります。</p>`,
      task: `<code>greet()</code>の引数を<code>?string</code>にしてnullを受け取れるようにし、nullのときは「ゲスト」と挨拶してください。さらに戻り値<code>?int</code>の関数<code>findScore()</code>を作り、キーがなければnullを返して<code>?? -1</code>で表示してください。`,
      code: `<?php
declare(strict_types=1);

// TODO: 引数の型を?stringにして、nullも受け取れるようにしよう
function greet(string $name): string
{
    // TODO: null合体演算子??で、nullのとき"ゲスト"を使おう
    $who = $name;
    return "こんにちは、" . $who . "さん";
}

echo greet("鈴木") . "\\n";
echo greet(null) . "\\n"; // 今はTypeErrorになる

// TODO: 戻り値?intの関数findScore(array $scores, string $key)を作り、
// キーがなければnullを返そう。$scores = ["math" => 80] で
// "eng"を探し、?? -1 で-1を表示する
`,
      solution: `<?php
declare(strict_types=1);

// ?string は string|null と同じ意味
function greet(?string $name): string
{
    // null合体演算子で既定値を決める
    $who = $name ?? "ゲスト";
    return "こんにちは、" . $who . "さん";
}

echo greet("鈴木") . "\\n";
echo greet(null) . "\\n";

// 戻り値もnullableにできる（見つからなければnull）
function findScore(array $scores, string $key): ?int
{
    return $scores[$key] ?? null;
}

$scores = ["math" => 80];
echo (findScore($scores, "eng") ?? -1) . "\\n";
`,
      hints: [
        `型名の前に?を付けると、その型かnullのどちらかを受け取れます。`,
        `$name ?? "ゲスト" は「$nameがnullならゲストを使う」という意味です。配列アクセスでも $scores[$key] ?? null と書けばWarningを防げます。`,
      ],
      expectedOutput: "こんにちは、ゲストさん"
    },
    {
      id: 144,
      title: "intersection型（PHP 8.1）",
      explanation: `<p>intersection型（インターセクション型・交差型）は「複数の型を<strong>すべて</strong>満たす」ことを表す型宣言で、型名を<code>&amp;</code>でつなげて書きます。PHP 8.1で導入されました。union型の<code>|</code>が「どれか」なのに対し、<code>&amp;</code>は「全部」です。</p>
<pre><code>function describe(HasName&amp;HasPrice $item): string
{
    // getName()とgetPrice()の両方を安全に呼べる
    return $item-&gt;getName() . "は" . $item-&gt;getPrice() . "円";
}
</code></pre>
<p>intersection型に指定できるのはクラス型・インターフェイス型のみで、<code>int&amp;string</code>のようなスカラー型の組み合わせは書けません（同時に満たせないため）。実務では「複数のインターフェイスを両方実装したオブジェクトだけを受け取りたい」ときに使います。</p>
<table>
<tr><th>記法</th><th>意味</th><th>例</th></tr>
<tr><td><code>A|B</code></td><td>AまたはBのどちらか</td><td><code>int|string</code></td></tr>
<tr><td><code>A&amp;B</code></td><td>AとBの両方を満たす</td><td><code>Countable&amp;Stringable</code></td></tr>
</table>
<p>intersection型がないと、<code>HasName</code>型で受けて<code>getPrice()</code>を呼ぶような「型宣言に書かれていないメソッド呼び出し」が発生し、静的解析ツールに警告されます。<code>HasName&amp;HasPrice</code>と書けば、両方のメソッドが保証された値しか渡せなくなり、コンパイル前にバグを防げます。</p>
<p>なお、PHP 8.2からは<code>(A&amp;B)|null</code>のようにDNF型（union型との組み合わせ）も書けるようになっています。まずは基本形の<code>A&amp;B</code>をしっかり押さえましょう。</p>`,
      task: `<code>describe()</code>の引数の型を<code>HasName&amp;HasPrice</code>のintersection型に変更し、名前と価格の両方のメソッドを型宣言で保証してください。`,
      code: `<?php
declare(strict_types=1);

interface HasName
{
    public function getName(): string;
}

interface HasPrice
{
    public function getPrice(): int;
}

class Product implements HasName, HasPrice
{
    public function __construct(
        private string $name,
        private int $price
    ) {
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getPrice(): int
    {
        return $this->price;
    }
}

// TODO: 引数の型をHasNameとHasPriceの両方を満たすintersection型にして、
// getPrice()の呼び出しも型宣言で保証しよう
function describe(HasName $item): string
{
    return $item->getName() . "は" . $item->getPrice() . "円";
}

echo describe(new Product("りんご", 150)) . "\\n";
`,
      solution: `<?php
declare(strict_types=1);

interface HasName
{
    public function getName(): string;
}

interface HasPrice
{
    public function getPrice(): int;
}

// 両方のインターフェイスを実装したクラス
class Product implements HasName, HasPrice
{
    public function __construct(
        private string $name,
        private int $price
    ) {
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getPrice(): int
    {
        return $this->price;
    }
}

// HasName&HasPrice: 両方を満たすオブジェクトだけ渡せる
function describe(HasName&HasPrice $item): string
{
    return $item->getName() . "は" . $item->getPrice() . "円";
}

echo describe(new Product("りんご", 150)) . "\\n";
`,
      hints: [
        `union型が|で「どちらか」を表すのに対し、intersection型は&で「両方を満たす」を表します。`,
        `function describe(HasName&HasPrice $item): string のように、型名を&でつなげます。`,
      ],
      expectedOutput: "りんごは150円"
    },
    {
      id: 145,
      title: "mixed型とnever型",
      explanation: `<p>PHP 8.0で追加された<code>mixed</code>と、PHP 8.1で追加された<code>never</code>は、型システムの「両端」を表す特別な型です。</p>
<table>
<tr><th>型</th><th>意味</th><th>使いどころ</th></tr>
<tr><td><code>mixed</code></td><td>あらゆる値を受け取れる</td><td>本当に何でも受け取る関数（デバッグ用・汎用ユーティリティ）</td></tr>
<tr><td><code>never</code></td><td>決して正常に戻らない</td><td>必ず例外を投げる関数・無限ループする関数</td></tr>
</table>
<p><code>mixed</code>は「型を書き忘れた」のではなく「意図的に何でも受け取る」ことを宣言する型です。型宣言なしと実行時の動きは同じですが、読み手と静的解析ツールに意図が伝わります。受け取った側では<code>get_debug_type()</code>（値の型名を返す関数）や<code>is_int()</code>などで分岐してから使います。</p>
<pre><code>function describeType(mixed $value): string
{
    return get_debug_type($value) . "型";
}
</code></pre>
<p><code>never</code>は戻り値専用の型で、「この関数はreturnで戻ることがない」と宣言します。必ず例外を投げる関数に付けるのが典型で、静的解析ツールは「この関数を呼んだ後のコードは、例外が投げられなかった場合しか実行されない」と正しく理解できます。</p>
<pre><code>function fail(string $message): never
{
    throw new RuntimeException($message);
    // returnを書くと逆にエラーになる
}
</code></pre>
<p><code>never</code>の関数がうっかり正常にreturnしようとすると、その時点でTypeErrorになります。「絶対に戻らない」という契約を実行時にも守らせる仕組みです。</p>`,
      task: `戻り値の型が<code>never</code>の関数<code>fail(string $message)</code>を作り、<code>RuntimeException</code>を投げてください。<code>try/catch</code>で捕捉して「捕捉: 設定が見つかりません」と出力します。`,
      code: `<?php
declare(strict_types=1);

// mixed: あらゆる型を受け取れる（型を諦めるのではなく明示する）
function describeType(mixed $value): string
{
    return get_debug_type($value) . "型";
}

echo describeType(1) . "\\n";
echo describeType("php") . "\\n";
echo describeType([1, 2]) . "\\n";

// TODO: 戻り値の型がneverの関数fail(string $message)を作り、
// RuntimeExceptionを投げよう。
// fail("設定が見つかりません")をtry/catchで囲み、
// 「捕捉: 」に続けてメッセージを出力しよう
`,
      solution: `<?php
declare(strict_types=1);

// mixed: あらゆる型を受け取れる（型を諦めるのではなく明示する）
function describeType(mixed $value): string
{
    return get_debug_type($value) . "型";
}

echo describeType(1) . "\\n";
echo describeType("php") . "\\n";
echo describeType([1, 2]) . "\\n";

// never: 決して正常に戻らない関数（必ず例外を投げる）
function fail(string $message): never
{
    throw new RuntimeException($message);
}

try {
    fail("設定が見つかりません");
} catch (RuntimeException $e) {
    echo "捕捉: " . $e->getMessage() . "\\n";
}
`,
      hints: [
        `neverは戻り値専用の型です。関数の中では必ずthrowするか、無限ループにする必要があります。`,
        `function fail(string $message): never { throw new RuntimeException($message); } と書き、呼び出し側でcatch (RuntimeException $e)します。`,
      ],
      expectedOutput: "捕捉: 設定が見つかりません"
    },
    {
      id: 146,
      title: "静的解析を意識した型の書き方（docblockとの関係）",
      explanation: `<p>PHPの型宣言（ネイティブ型）は実行時にチェックされますが、表現力には限界があります。たとえば「intだけが入った配列」はネイティブ型では<code>array</code>としか書けません。この足りない部分を補うのがdocblock（<code>/** ... */</code>形式のコメント）です。</p>
<pre><code>/**
 * @param list&lt;int&gt; $scores 点数のリスト
 * @return int 合計点
 */
function sumScores(array $scores): int
</code></pre>
<p><code>list&lt;int&gt;</code>は「0から始まる連番キーでintだけが入った配列」を表す記法で、PHPStanやPsalmといった静的解析ツール（実行せずにコードの誤りを検出するツール）が理解します。実行時には何もチェックされませんが、「stringの配列を渡している」といった誤りを実行前に検出できます。</p>
<table>
<tr><th>記法</th><th>意味</th></tr>
<tr><td><code>list&lt;int&gt;</code></td><td>連番キーのintの配列</td></tr>
<tr><td><code>array&lt;string, int&gt;</code></td><td>stringキー・int値の連想配列</td></tr>
<tr><td><code>int[]</code></td><td>intの配列（古い記法。list&lt;int&gt;が推奨）</td></tr>
<tr><td><code>non-empty-string</code></td><td>空文字ではないstring</td></tr>
</table>
<p>役割分担の考え方はシンプルです。</p>
<ul>
<li><strong>ネイティブ型で書けるものはネイティブ型で書く</strong>（実行時にも守られるため）</li>
<li><strong>ネイティブ型で表現できない詳細だけをdocblockで補う</strong>（配列の中身・値の範囲など）</li>
</ul>
<p>変数にも<code>/** @var list&lt;int&gt; $scores */</code>のように型を注釈できます。docblockは「動くコメント」ではなく静的解析ツールへの契約書だと考えると、書く意味が明確になります。</p>`,
      task: `<code>sumScores()</code>に<code>@param list&lt;int&gt; $scores</code>と<code>@return int</code>を含むdocblockを付けてください。動作は変わりませんが、静的解析ツールが配列の中身まで検証できるようになります。`,
      code: `<?php
declare(strict_types=1);

// TODO: この関数にdocblockを付けよう
// @param list<int> $scores（intのリスト）と @return int を記述する
function sumScores(array $scores): int
{
    $total = 0;
    foreach ($scores as $score) {
        $total += $score;
    }
    return $total;
}

$scores = [70, 85, 92];
echo "合計: " . sumScores($scores) . "\\n";
`,
      solution: `<?php
declare(strict_types=1);

/**
 * 合計点を計算する
 *
 * ネイティブ型ではarrayとしか書けないが、
 * docblockで「intのリスト」だと静的解析ツールに伝えられる
 *
 * @param list<int> $scores 点数のリスト
 * @return int 合計点
 */
function sumScores(array $scores): int
{
    $total = 0;
    foreach ($scores as $score) {
        $total += $score;
    }
    return $total;
}

/** @var list<int> $scores */
$scores = [70, 85, 92];
echo "合計: " . sumScores($scores) . "\\n";
`,
      hints: [
        `docblockは /** で始まり */ で終わるコメントで、関数定義の直前に書きます。`,
        `@param list<int> $scores のように「@タグ 型 変数名 説明」の順で書きます。実行結果は変わらないことも確認しましょう。`,
      ],
      expectedOutput: "合計: 247"
    },
    {
      id: 147,
      title: "型ジャグリングの罠総復習（==の暗黙変換）",
      explanation: `<p>緩い比較<code>==</code>は、比較の前に両辺の型を自動変換（型ジャグリング）します。この暗黙変換が思わぬバグの温床になるため、ここで代表的なパターンを総復習しましょう。PHP 8で文字列と数値の比較ルールが改善されましたが、それでも注意すべき組み合わせは残っています。</p>
<table>
<tr><th>比較</th><th>PHP 8の結果</th><th>理由</th></tr>
<tr><td><code>"1" == "01"</code></td><td>true</td><td>数値文字列同士は数値として比較される</td></tr>
<tr><td><code>100 == "1e2"</code></td><td>true</td><td>指数表記の文字列も数値として解釈される</td></tr>
<tr><td><code>0 == "abc"</code></td><td>false</td><td>PHP 7まではtrueだった（PHP 8で改善）</td></tr>
<tr><td><code>0 == ""</code></td><td>false</td><td>これもPHP 8で仕様変更された</td></tr>
<tr><td><code>"" == null</code></td><td>true</td><td>どちらも「空」とみなされる（今もtrue）</td></tr>
<tr><td><code>"1" === "01"</code></td><td>false</td><td>===は変換せず型も値も比較する</td></tr>
</table>
<p>PHP 8で「非数値文字列と数値の比較」は直感的になりましたが、<code>"" == null</code>や<code>0 == "0"</code>のような組み合わせは今もtrueです。実務の指針は次の2つです。</p>
<ul>
<li><strong>原則として厳密比較<code>===</code>を使う</strong>。型が違えば必ずfalseになるため、暗黙変換の暗記が不要になる</li>
<li>==をあえて使うのは「型が揃っていることが保証されている」か「数値文字列を数値として比べたい」と明確に意図できる場合だけにする</li>
</ul>
<pre><code>var_export("1" == "01");  // true（数値比較）
var_export("1" === "01"); // false（型ジャグリングなし）
</code></pre>
<p><code>var_export($value, true)</code>は値をPHPコード形式の文字列で返す関数で、trueやfalseの確認に便利です。予想してから実行し、表の内容を自分の目で確かめましょう。</p>`,
      task: `実行前に各比較の結果を予想してから実行してください。その後、<code>"" == null</code>・<code>0 == ""</code>・<code>"1" === "01"</code>の3つの比較を追加して結果を確認してください。`,
      code: `<?php
declare(strict_types=1);

// 比較結果を表示する補助関数
function show(string $label, bool $result): void
{
    echo $label . " => " . var_export($result, true) . "\\n";
}

// 実行前に結果を予想してから実行してみよう
show('"1" == "01"', "1" == "01");
show('100 == "1e2"', 100 == "1e2");
show('0 == "abc"', 0 == "abc");

// TODO: 次の3つの比較も追加して結果を確認しよう
// "" == null
// 0 == ""
// "1" === "01"
`,
      solution: `<?php
declare(strict_types=1);

// 比較結果を表示する補助関数
function show(string $label, bool $result): void
{
    echo $label . " => " . var_export($result, true) . "\\n";
}

show('"1" == "01"', "1" == "01");     // 数値文字列同士は数値比較
show('100 == "1e2"', 100 == "1e2");   // 指数表記も数値として解釈
show('0 == "abc"', 0 == "abc");       // PHP 8からはfalse
show('"" == null', "" == null);       // 空文字とnullはtrueのまま
show('0 == ""', 0 == "");             // PHP 8からはfalse
show('"1" === "01"', "1" === "01");   // ===なら型も値も一致が必要
`,
      hints: [
        `show()の第1引数はラベル用の文字列、第2引数に実際の比較式を書きます。既存の3行をまねしましょう。`,
        `ラベルに"を含めたいので、ラベル側はシングルクォートで囲むと書きやすいです。例：show('"" == null', "" == null);`,
      ],
      expectedOutput: "0 == \"abc\" => false"
    },
    {
      id: 148,
      title: "match式と型の網羅性",
      explanation: `<p><code>match</code>式は既に学びましたが、型システムの観点から見直すと「網羅性チェック」という強力な性質を持っています。switchとの違いを型の視点で整理しましょう。</p>
<table>
<tr><th>観点</th><th>switch文</th><th>match式</th></tr>
<tr><td>比較方法</td><td>==（緩い比較）</td><td>===（厳密比較）</td></tr>
<tr><td>値を返せるか</td><td>返せない（文）</td><td>返せる（式）</td></tr>
<tr><td>どれにも一致しない場合</td><td>何も起きず素通り</td><td>UnhandledMatchErrorが発生</td></tr>
<tr><td>break</td><td>必要</td><td>不要</td></tr>
</table>
<p>特に重要なのが3行目です。<code>default</code>のないmatch式で、どのアームにも一致しない値が来ると<code>UnhandledMatchError</code>という例外が投げられます。これは一見不便に思えますが、「処理漏れが静かに素通りする」switchより安全です。ケースの追加漏れが実行時に即座に発覚するからです。</p>
<pre><code>$result = match (99) {
    1 =&gt; "one",
    2 =&gt; "two",
}; // UnhandledMatchError!
</code></pre>
<p>使い分けの指針は次の通りです。</p>
<ul>
<li><strong>取りうる値をすべて列挙できる場合はdefaultを書かない</strong>。列挙漏れをUnhandledMatchErrorで検出できる（enumとの組み合わせが典型）</li>
<li>任意の値が来る可能性がある場合はdefaultで受ける</li>
</ul>
<p>また、matchは<code>===</code>で比較するため、<code>match(200)</code>のアームに<code>"200"</code>（文字列）を書いても一致しません。型ジャグリングの罠（前ステップ）がmatchでは起きない、という点も型安全性への貢献です。</p>`,
      task: `<code>label()</code>のmatch式に<code>default</code>アームを追加して<code>label(500)</code>を動くようにしてください。さらにdefaultのないmatch式を<code>try/catch</code>で囲み、<code>UnhandledMatchError</code>を捕捉して「網羅漏れを検出: UnhandledMatchError」と出力してください。`,
      code: `<?php
declare(strict_types=1);

function label(int|string $code): string
{
    // TODO: defaultアームを追加して、どんな値でも文字列を返せるようにしよう
    // defaultでは "その他: " . $code を返す
    return match ($code) {
        200 => "OK",
        404 => "Not Found",
        "unknown" => "不明コード",
    };
}

echo label(200) . "\\n";
echo label("unknown") . "\\n";
echo label(500) . "\\n"; // 今はUnhandledMatchErrorで落ちる

// TODO: さらにdefaultのないmatch式（アームは 1 => "one", 2 => "two" のみ）に
// 99を渡し、try/catchでUnhandledMatchErrorを捕捉して
// 「網羅漏れを検出: UnhandledMatchError」と出力しよう
`,
      solution: `<?php
declare(strict_types=1);

// matchは===で比較し、値を返す式
function label(int|string $code): string
{
    return match ($code) {
        200 => "OK",
        404 => "Not Found",
        "unknown" => "不明コード",
        default => "その他: " . $code,
    };
}

echo label(200) . "\\n";
echo label("unknown") . "\\n";
echo label(500) . "\\n";

// defaultがないmatchで一致しない値が来るとUnhandledMatchError
try {
    $result = match (99) {
        1 => "one",
        2 => "two",
    };
    echo $result . "\\n"; // ここには到達しない
} catch (UnhandledMatchError $e) {
    echo "網羅漏れを検出: UnhandledMatchError" . "\\n";
}
`,
      hints: [
        `defaultアームは default => 値 の形で最後に書きます。`,
        `UnhandledMatchErrorは例外と同じようにcatchできます。catch (UnhandledMatchError $e) { ... } と書きましょう。`,
      ],
      expectedOutput: "網羅漏れを検出: UnhandledMatchError"
    },
    {
      id: 149,
      title: "readonlyクラス（PHP 8.2）",
      explanation: `<p>PHP 8.1でプロパティ単位の<code>readonly</code>（初期化後の変更禁止）が導入され、PHP 8.2では<strong>クラス全体</strong>をreadonlyにできるようになりました。<code>class</code>の前に<code>readonly</code>を付けると、全プロパティが自動的にreadonlyになります。</p>
<pre><code>readonly class Point
{
    public function __construct(
        public float $x,
        public float $y,
    ) {
    }
}

$p = new Point(1.0, 2.0);
$p-&gt;x = 99.0; // Error: Cannot modify readonly property
</code></pre>
<p>readonlyプロパティはコンストラクタでの初期化後、一切変更できません。変更しようとすると<code>Error</code>が投げられます。<code>public</code>プロパティでも書き換えの心配がないため、getterメソッドを作らずに直接公開できるのが実用上の大きな利点です。</p>
<p>「値を変更したい」ときはどうするか。答えは<strong>変更した新しいインスタンスを返す</strong>ことです。</p>
<pre><code>public function moveX(float $dx): Point
{
    return new Point($this-&gt;x + $dx, $this-&gt;y);
}
</code></pre>
<p>この「一度作ったら変わらない」性質をイミュータブル（不変）と呼びます。イミュータブルなオブジェクトには次の利点があります。</p>
<ul>
<li>どこかで勝手に書き換えられる心配がなく、コードを追う範囲が減る</li>
<li>関数に渡しても元の値が壊れない（防御的コピーが不要）</li>
</ul>
<p>readonlyクラスには「全プロパティに型宣言が必須」「静的プロパティを持てない」という制約もあります。座標・金額・日付のような「値そのもの」を表すクラスに特に向いています。</p>`,
      task: `<code>Point</code>クラスを<code>readonly class</code>にし、末尾の代入<code>$p1-&gt;x = 99.0;</code>を<code>try/catch</code>で囲んで<code>Error</code>を捕捉し、「変更は拒否された: readonlyプロパティ」と出力してください。`,
      code: `<?php
declare(strict_types=1);

// TODO: classの前にreadonlyを付けて、不変のクラスにしよう
class Point
{
    public function __construct(
        public float $x,
        public float $y,
    ) {
    }

    // 変更したいときは新しいインスタンスを返す
    public function moveX(float $dx): Point
    {
        return new Point($this->x + $dx, $this->y);
    }
}

$p1 = new Point(1.0, 2.0);
$p2 = $p1->moveX(5.0);

echo "p1: (" . $p1->x . ", " . $p1->y . ")\\n";
echo "p2: (" . $p2->x . ", " . $p2->y . ")\\n";

// 今は代入できてしまう。readonlyにするとErrorになる
$p1->x = 99.0;
// TODO: 上の代入をtry/catchで囲み、Errorを捕捉して
// 「変更は拒否された: readonlyプロパティ」と出力しよう
`,
      solution: `<?php
declare(strict_types=1);

// readonly class: 全プロパティが自動的にreadonlyになる（PHP 8.2）
readonly class Point
{
    public function __construct(
        public float $x,
        public float $y,
    ) {
    }

    // 変更したいときは新しいインスタンスを返す
    public function moveX(float $dx): Point
    {
        return new Point($this->x + $dx, $this->y);
    }
}

$p1 = new Point(1.0, 2.0);
$p2 = $p1->moveX(5.0);

echo "p1: (" . $p1->x . ", " . $p1->y . ")\\n";
echo "p2: (" . $p2->x . ", " . $p2->y . ")\\n";

// readonlyプロパティへの代入はErrorになる
try {
    $p1->x = 99.0;
} catch (Error $e) {
    echo "変更は拒否された: readonlyプロパティ" . "\\n";
}
`,
      hints: [
        `readonly class Point { ... } のように、classキーワードの前にreadonlyを付けます。`,
        `readonlyプロパティへの代入で投げられるのは例外（Exception）ではなくErrorです。catch (Error $e) { ... } で捕捉しましょう。`,
      ],
      expectedOutput: "変更は拒否された: readonlyプロパティ"
    },
    {
      id: 150,
      title: "総合演習：型安全な計算機クラス",
      explanation: `<p>第15章の総合演習です。この章で学んだ道具を総動員して、型安全な計算機クラスを完成させます。使う道具を整理しましょう。</p>
<table>
<tr><th>道具</th><th>この演習での使い方</th></tr>
<tr><td>strict_types</td><td>数値以外が紛れ込んだら即TypeError</td></tr>
<tr><td>union型</td><td>計算値は<code>int|float</code>で受ける</td></tr>
<tr><td>readonlyクラス</td><td>計算機自体をイミュータブルにする</td></tr>
<tr><td>match式</td><td>演算子で分岐し、defaultで未対応演算子を検出</td></tr>
<tr><td>never型</td><td>必ず例外を投げる<code>fail()</code>メソッド</td></tr>
</table>
<p>設計の核は「applyは新しいCalculatorを返す」ことです。readonlyクラスなので内部状態を書き換えられませんが、その代わりに戻り値をつなげてメソッドチェーンで計算を組み立てられます。</p>
<pre><code>$answer = $calc-&gt;apply("+", 5)-&gt;apply("*", 2)-&gt;result();
</code></pre>
<p>エラー処理には2つの経路を用意します。0除算と未対応演算子はどちらも<code>fail()</code>（戻り値never）に集約し、<code>InvalidArgumentException</code>を投げます。never型の関数はmatch式のアームにも書けるという点に注目してください。</p>
<pre><code>$result = match ($op) {
    "+" =&gt; $this-&gt;value + $operand,
    default =&gt; $this-&gt;fail("未対応の演算子: " . $op),
};
</code></pre>
<p>0の判定には<code>===</code>を使い、int の<code>0</code>とfloatの<code>0.0</code>を別々にチェックします。<code>==</code>で書くと楽に見えますが、前々ステップで学んだ通り厳密比較で書くのがこの章の流儀です。完成したら、メソッドチェーンの結果と2つのエラーメッセージが正しく出力されることを確認しましょう。</p>`,
      task: `<code>apply()</code>のmatch式、<code>divide()</code>の0チェック、never型の<code>fail()</code>メソッドを実装して計算機を完成させてください。「結果: 30」と2つのエラーメッセージが出力されれば成功です。`,
      code: `<?php
declare(strict_types=1);

// 総合演習：型安全な計算機クラスを完成させよう
final readonly class Calculator
{
    public function __construct(
        private int|float $value = 0,
    ) {
    }

    public function apply(string $op, int|float $operand): Calculator
    {
        // TODO: match式で"+", "-", "*", "/"を処理しよう
        // "/"は$this->divide($operand)を呼ぶ
        // defaultは$this->fail("未対応の演算子: " . $op)を呼ぶ
        $result = 0;
        return new Calculator($result);
    }

    public function result(): int|float
    {
        return $this->value;
    }

    private function divide(int|float $operand): int|float
    {
        // TODO: $operandが0（int）または0.0（float）なら
        // $this->fail("0では割れません")を呼ぼう（===で判定）
        return $this->value / $operand;
    }

    // TODO: 戻り値の型がneverで、InvalidArgumentExceptionを投げる
    // privateメソッドfail(string $message)を作ろう
}

$calc = new Calculator(10);
$answer = $calc->apply("+", 5)->apply("*", 2)->result();
echo "結果: " . $answer . "\\n";

try {
    (new Calculator(1))->apply("/", 0);
} catch (InvalidArgumentException $e) {
    echo "エラー: " . $e->getMessage() . "\\n";
}

try {
    (new Calculator(1))->apply("%", 3);
} catch (InvalidArgumentException $e) {
    echo "エラー: " . $e->getMessage() . "\\n";
}
`,
      solution: `<?php
declare(strict_types=1);

// 総合演習：型安全な計算機クラス（この章の総まとめ）
final readonly class Calculator
{
    public function __construct(
        private int|float $value = 0,
    ) {
    }

    // applyは自身を変更せず、新しいCalculatorを返す
    public function apply(string $op, int|float $operand): Calculator
    {
        $result = match ($op) {
            "+" => $this->value + $operand,
            "-" => $this->value - $operand,
            "*" => $this->value * $operand,
            "/" => $this->divide($operand),
            default => $this->fail("未対応の演算子: " . $op),
        };
        return new Calculator($result);
    }

    public function result(): int|float
    {
        return $this->value;
    }

    private function divide(int|float $operand): int|float
    {
        // ===で int の0とfloatの0.0を厳密にチェックする
        if ($operand === 0 || $operand === 0.0) {
            $this->fail("0では割れません");
        }
        return $this->value / $operand;
    }

    // never: 必ず例外を投げて戻らない
    private function fail(string $message): never
    {
        throw new InvalidArgumentException($message);
    }
}

$calc = new Calculator(10);
$answer = $calc->apply("+", 5)->apply("*", 2)->result();
echo "結果: " . $answer . "\\n";

try {
    (new Calculator(1))->apply("/", 0);
} catch (InvalidArgumentException $e) {
    echo "エラー: " . $e->getMessage() . "\\n";
}

try {
    (new Calculator(1))->apply("%", 3);
} catch (InvalidArgumentException $e) {
    echo "エラー: " . $e->getMessage() . "\\n";
}
`,
      hints: [
        `matchの各アームは "+" => $this->value + $operand, のように書きます。defaultアームにはfail()の呼び出しをそのまま書けます（never型なので値を返さなくてもエラーになりません）。`,
        `failメソッドは private function fail(string $message): never { throw new InvalidArgumentException($message); } です。`,
        `divide()の0チェックは if ($operand === 0 || $operand === 0.0) と2つの型を別々に比較します。`,
      ],
      expectedOutput: "結果: 30"
    }
  ]
});
