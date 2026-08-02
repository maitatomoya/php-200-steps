// 第24章：よくあるエラー：クラスと例外
registerChapter({
  number: 24,
  title: "よくあるエラー：クラスと例外",
  description: "クラス・継承・例外処理で実際によく起きるFatal errorを再現し、メッセージの読み方と修正パターンを身につけます。",
  steps: [
    {
      id: 231,
      title: "Call to undefined method（メソッド名のtypo）",
      explanation: `<p>実行すると次のFatal errorで停止します。</p>
<pre><code>Fatal error: Uncaught Error: Call to undefined method Cart::addItm()
in main.php:19
Stack trace:
#0 {main}</code></pre>
<p>読み方のポイントは<strong>Cart::addItm()</strong>の部分です。<code>クラス名::メソッド名()</code>の形式で「どのクラスの、どのメソッドが見つからなかったか」が示されます。<code>Cart</code>クラスに定義されているのは<code>addItem()</code>で、呼び出しは<code>addItm()</code>。<strong>eが1文字抜けたtypo（打ち間違い）</strong>が原因です。</p>
<p>このエラーを見たときの調査手順は次の通りです。</p>
<ol>
<li>メッセージ中のメソッド名と、クラス定義側のメソッド名を<strong>1文字ずつ</strong>見比べる（typo・単数複数・大文字小文字の思い違いが大半）</li>
<li>typoでなければ「そのクラスに本当にそのメソッドがあるか」を確認する（別クラスのオブジェクトが入っている可能性）</li>
<li><code>in main.php:19</code>の行番号から呼び出し箇所を特定する</li>
</ol>
<p>豆知識として、PHPの<strong>メソッド名は大文字小文字を区別しない</strong>ため、<code>$cart-&gt;additem()</code>は実はエラーになりません。ただし定義と違う表記で呼ぶのは可読性を損なうだけなので、常に定義通りに書きましょう。エディタの補完（<code>$cart-&gt;</code>まで打って候補から選ぶ）を使うのが最良のtypo予防です。</p>
<pre><code>$cart-&gt;addItem('みかん');   // 定義通りの名前で呼ぶ</code></pre>`,
      task: `エラーメッセージが指すtypoを見つけて修正し、「商品数：2個」と表示されるようにしてください。`,
      code: `<?php
class Cart
{
    private array $items = [];

    public function addItem(string $name): void
    {
        $this->items[] = $name;
    }

    public function count(): int
    {
        return count($this->items);
    }
}

$cart = new Cart();
$cart->addItem('りんご');
$cart->addItm('みかん'); // メソッド名を打ち間違えている
echo '商品数：' . $cart->count() . '個' . "\\n";
`,
      solution: `<?php
class Cart
{
    private array $items = [];

    public function addItem(string $name): void
    {
        $this->items[] = $name;
    }

    public function count(): int
    {
        return count($this->items);
    }
}

$cart = new Cart();
$cart->addItem('りんご');
$cart->addItem('みかん');
echo '商品数：' . $cart->count() . '個' . "\\n";
`,
      hints: [
        `エラーメッセージのCart::addItm()と、クラスに定義されているメソッド名を1文字ずつ見比べましょう。`,
        `19行目の呼び出しをaddItemに直します。`
      ],
      expectedOutput: "商品数：2個"
    },
    {
      id: 232,
      title: "Cannot access private property",
      explanation: `<p>実行すると次のFatal errorで停止します。</p>
<pre><code>Fatal error: Uncaught Error: Cannot access private property User::$name
in main.php:13
Stack trace:
#0 {main}</code></pre>
<p><strong>Cannot access private property User::$name</strong>は「Userクラスのprivateプロパティ$nameに（アクセスできない場所から）アクセスした」という意味です。<code>private</code>を付けたプロパティは<strong>そのクラスの内部からしか</strong>読み書きできません。13行目の<code>$user-&gt;name</code>はクラスの外からのアクセスなので拒否されます。</p>
<p>ここで「privateをpublicに変えれば動く」と考えるのは悪手です。privateにするのは、外部から自由に書き換えられると困る（不正な値を入れられたくない・内部実装を後から変えたい）からでした。正しい修正パターンは<strong>ゲッター（値を返すだけの公開メソッド）を用意する</strong>ことです。</p>
<pre><code>public function getName(): string
{
    return $this-&gt;name;    // クラスの内側からならアクセスできる
}</code></pre>
<p>アクセス権を整理しておきましょう。</p>
<table>
<tr><th>修飾子</th><th>アクセスできる範囲</th></tr>
<tr><td><code>public</code></td><td>どこからでも</td></tr>
<tr><td><code>protected</code></td><td>そのクラスと子クラスの中</td></tr>
<tr><td><code>private</code></td><td>そのクラスの中だけ</td></tr>
</table>
<p>なお「読むのは自由、書き換えは禁止」だけが目的なら、<code>public readonly</code>プロパティ（ステップ236で扱います）という選択肢もあります。用途に応じて使い分けてください。</p>`,
      task: `privateプロパティに外からアクセスしているのが原因です。<code>getName()</code>ゲッターを追加して、「こんにちは、佐藤さん」と表示されるように修正してください。`,
      code: `<?php
class User
{
    private string $name;

    public function __construct(string $name)
    {
        $this->name = $name;
    }
}

$user = new User('佐藤');
echo 'こんにちは、' . $user->name . 'さん' . "\\n"; // privateに外から直接アクセス
`,
      solution: `<?php
class User
{
    private string $name;

    public function __construct(string $name)
    {
        $this->name = $name;
    }

    // 外部にはゲッター経由で公開する
    public function getName(): string
    {
        return $this->name;
    }
}

$user = new User('佐藤');
echo 'こんにちは、' . $user->getName() . 'さん' . "\\n";
`,
      hints: [
        `privateプロパティはクラスの中からしか読めません。publicに変えるのではなく、公開用のメソッドを作りましょう。`,
        `return $this->name; するだけのpublic function getName(): string を追加し、呼び出し側を$user->getName()に変えます。`
      ],
      expectedOutput: "こんにちは、佐藤さん"
    },
    {
      id: 233,
      title: "Using $this when not in object context",
      explanation: `<p>実行すると次のFatal errorで停止します。</p>
<pre><code>Fatal error: Uncaught Error: Using $this when not in object context in main.php:8
Stack trace:
#0 main.php(17): Visitor::increment()
#1 {main}</code></pre>
<p><strong>Using $this when not in object context</strong>は「オブジェクトの文脈ではない場所で$thisを使った」という意味です。スタックトレースを見ると<code>Visitor::increment()</code>と<strong>::（ダブルコロン）で静的呼び出し</strong>されていることが分かります。</p>
<p><code>$this</code>は「このメソッドを呼び出したインスタンス自身」を指す変数です。しかし<code>static</code>メソッドは<strong>インスタンスを作らずクラスから直接呼ぶ</strong>ためのメソッドなので、「自身のインスタンス」が存在せず、<code>$this</code>は使えません。</p>
<p>staticの世界では<code>$this</code>の代わりに<code>self::</code>（このクラス）を使います。対応関係を整理します。</p>
<table>
<tr><th></th><th>インスタンスのメンバー</th><th>staticのメンバー</th></tr>
<tr><td>プロパティ</td><td><code>$this-&gt;count</code></td><td><code>self::$count</code>（$を付ける）</td></tr>
<tr><td>メソッド</td><td><code>$this-&gt;update()</code></td><td><code>self::update()</code></td></tr>
</table>
<pre><code>public static function increment(): void
{
    self::$count++;    // staticプロパティはself::でアクセス
}</code></pre>
<p>注意点は、staticプロパティは<code>self::$count</code>のように<strong>$を付けたまま</strong>書くことです（<code>$this-&gt;count</code>では$が消えるのと対照的で、間違えやすいポイントです）。このエラーが出たら「staticメソッドの中で$thisを書いていないか」をまず疑ってください。</p>`,
      task: `staticメソッドの中で<code>$this</code>を使っているのが原因です。<code>self::</code>に修正して「来場者数：2人」と表示されるようにしてください。`,
      code: `<?php
class Visitor
{
    private static int $count = 0;

    public static function increment(): void
    {
        $this->count++; // staticメソッド内では$thisは使えない
    }

    public static function getCount(): int
    {
        return self::$count;
    }
}

Visitor::increment();
Visitor::increment();
echo '来場者数：' . Visitor::getCount() . '人' . "\\n";
`,
      solution: `<?php
class Visitor
{
    private static int $count = 0;

    public static function increment(): void
    {
        self::$count++; // staticプロパティにはself::でアクセスする
    }

    public static function getCount(): int
    {
        return self::$count;
    }
}

Visitor::increment();
Visitor::increment();
echo '来場者数：' . Visitor::getCount() . '人' . "\\n";
`,
      hints: [
        `staticメソッドはインスタンスなしで呼ばれるため、「自身のインスタンス」を指す$thisが存在しません。`,
        `staticプロパティにはself::$countのように、self::と$を付けてアクセスします。getCount()の書き方が参考になります。`
      ],
      expectedOutput: "来場者数：2人"
    },
    {
      id: 234,
      title: "抽象メソッドの実装忘れ",
      explanation: `<p>実行すると、1行も動く前に次のFatal errorで停止します。</p>
<pre><code>Fatal error: Class Circle contains 1 abstract method and must therefore be
declared abstract or implement the remaining method (Shape::area)
in main.php on line 12</code></pre>
<p>これは実行時ではなく<strong>クラス定義の読み込み時点</strong>で検出されるエラーです。分解して読みます。</p>
<ul>
<li><strong>Class Circle contains 1 abstract method</strong>：Circleクラスには抽象メソッドが1つ残っている</li>
<li><strong>must therefore be declared abstract or implement the remaining method</strong>：だから「自分もabstract宣言する」か「残りのメソッドを実装する」かのどちらかにせよ</li>
<li><strong>(Shape::area)</strong>：残っているのはShapeクラス由来のarea。<strong>どのメソッドを書けばよいかまで教えてくれています</strong></li>
</ul>
<p>抽象メソッド（<code>abstract</code>付きで宣言され、本体を持たないメソッド）は「子クラスが必ず実装する」という契約です。契約を果たしていないクラスは不完全なので、インスタンス化できる普通のクラスとしては定義できません。修正は原則1択で、<strong>指定されたシグネチャ通りにメソッドを実装する</strong>ことです。</p>
<pre><code>class Circle extends Shape
{
    public function area(): float
    {
        return M_PI * $this-&gt;radius ** 2;   // 半径×半径×円周率
    }
}</code></pre>
<p>このとき戻り値の型（<code>: float</code>）や引数も親の宣言と互換でなければ、今度は別のFatal errorになります。親の<code>describe()</code>のように「共通処理は親が持ち、差分だけを子に強制する」のがテンプレートメソッドと呼ばれる設計の型で、抽象メソッドはその要になります。</p>`,
      task: `Circleクラスが<code>area()</code>を実装していないのが原因です。円の面積（<code>M_PI * 半径の2乗</code>）を返す<code>area()</code>を実装し、「面積：12.57」と表示されるようにしてください。`,
      code: `<?php
abstract class Shape
{
    abstract public function area(): float;

    public function describe(): string
    {
        return sprintf('面積：%.2f', $this->area());
    }
}

class Circle extends Shape
{
    public function __construct(
        private float $radius,
    ) {}
    // area()を実装し忘れている
}

$circle = new Circle(2.0);
echo $circle->describe() . "\\n";
`,
      solution: `<?php
abstract class Shape
{
    abstract public function area(): float;

    public function describe(): string
    {
        return sprintf('面積：%.2f', $this->area());
    }
}

class Circle extends Shape
{
    public function __construct(
        private float $radius,
    ) {}

    // 抽象メソッドは子クラスで必ず実装する
    public function area(): float
    {
        return M_PI * $this->radius ** 2;
    }
}

$circle = new Circle(2.0);
echo $circle->describe() . "\\n";
`,
      hints: [
        `エラーメッセージの(Shape::area)が「実装すべきメソッド」を教えてくれています。`,
        `Circleクラスの中にpublic function area(): floatを追加し、M_PI * $this->radius ** 2を返します。`
      ],
      expectedOutput: "面積：12.57"
    },
    {
      id: 235,
      title: "インターフェースのメソッド未実装",
      explanation: `<p>実行すると前のステップとほぼ同じ形のFatal errorが出ます。</p>
<pre><code>Fatal error: Class JapaneseGreeter contains 1 abstract method and must therefore
be declared abstract or implement the remaining method (Greeter::greet)
in main.php on line 7</code></pre>
<p>今回はabstractクラスを継承していないのに「abstract methodが残っている」と言われています。実は<strong>インターフェースのメソッドは、実装クラスから見るとすべて抽象メソッド扱い</strong>だからです。<code>implements Greeter</code>と宣言した瞬間、<code>greet()</code>を実装する義務が生じ、果たさなければ抽象クラスの実装忘れと同じエラーになります。カッコ内の<strong>(Greeter::greet)</strong>で、どの契約のどのメソッドが未実装かが分かります。</p>
<p>修正時はメソッド名だけでなく<strong>シグネチャの互換性</strong>にも注意が必要です。インターフェース側が<code>greet(string $name): string</code>なら、実装側も引数の型・個数と戻り値の型を互換に保つ必要があります。合っていないと今度は次のようなエラーになります。</p>
<pre><code>Fatal error: Declaration of JapaneseGreeter::greet(): void must be compatible
with Greeter::greet(string $name): string</code></pre>
<p>abstractクラスとインターフェースの違いも整理しておきましょう。</p>
<table>
<tr><th></th><th>abstractクラス</th><th>インターフェース</th></tr>
<tr><td>実装済みメソッドやプロパティ</td><td>持てる</td><td>持てない（メソッド宣言と定数のみ）</td></tr>
<tr><td>多重指定</td><td>1つしか継承できない</td><td>複数implementsできる</td></tr>
<tr><td>使い分け</td><td>共通処理を配りたい</td><td>できることの契約だけ決めたい</td></tr>
</table>`,
      task: `<code>greet()</code>が未実装なのが原因です。インターフェースの宣言通りに実装して、「こんにちは、PHP！」と表示されるようにしてください。`,
      code: `<?php
interface Greeter
{
    public function greet(string $name): string;
}

class JapaneseGreeter implements Greeter
{
    // greet()を実装していない
}

$greeter = new JapaneseGreeter();
echo $greeter->greet('PHP') . "\\n";
`,
      solution: `<?php
interface Greeter
{
    public function greet(string $name): string;
}

class JapaneseGreeter implements Greeter
{
    // インターフェースが宣言する全メソッドを実装する
    public function greet(string $name): string
    {
        return 'こんにちは、' . $name . '！';
    }
}

$greeter = new JapaneseGreeter();
echo $greeter->greet('PHP') . "\\n";
`,
      hints: [
        `implementsしたインターフェースの全メソッドを実装する義務があります。エラーの(Greeter::greet)が未実装のメソッドです。`,
        `インターフェースの宣言と同じシグネチャpublic function greet(string $name): stringで実装し、'こんにちは、' . $name . '！'を返します。`
      ],
      expectedOutput: "こんにちは、PHP！"
    },
    {
      id: 236,
      title: "readonlyプロパティへの再代入",
      explanation: `<p>実行すると次のFatal errorで停止します。</p>
<pre><code>Fatal error: Uncaught Error: Cannot modify readonly property Point::$x
in main.php:11
Stack trace:
#0 {main}</code></pre>
<p><strong>Cannot modify readonly property Point::$x</strong>は「readonly（読み取り専用）と宣言されたPoint::$xを変更しようとした」という意味です。<code>readonly</code>プロパティは<strong>初期化（コンストラクタでの代入）の1回だけ</strong>書き込みが許され、以降は外からも中からも再代入できません。</p>
<p>「エラーが出るなら readonly を外せばいい」ではなく、これは<strong>意図的な設計</strong>だと理解するのが重要です。座標・金額・日付のような値は、一度作ったら変わらない<strong>不変（イミュータブル）</strong>なオブジェクトにしておくと、「いつの間にか誰かに書き換えられていた」という追跡困難なバグを根本から防げます。</p>
<p>では値を変えたいときはどうするか。定石は<strong>「変更後の値を持つ新しいオブジェクトを作る」</strong>です。</p>
<pre><code>$p = new Point(1, 2);
$moved = new Point(10, $p-&gt;y);   // 再代入ではなく新規作成
</code></pre>
<p>実務ではこの操作をメソッドにした<code>withX(10)</code>のような命名（withメソッド）がよく使われます。DateTimeImmutableの<code>modify()</code>が新しいインスタンスを返すのも同じ思想です。</p>
<p>なお、似たエラーに<code>Cannot initialize readonly property ... from global scope</code>（初期化をクラスの外から行おうとした場合）もあります。「readonlyは<strong>宣言したクラスの中で1回だけ</strong>初期化できる」と覚えておきましょう。</p>`,
      task: `readonlyプロパティに再代入しているのが原因です。再代入の代わりに変更後の値を持つ新しい<code>Point</code>を作り、「移動後：(10, 2)」と表示されるように修正してください。`,
      code: `<?php
class Point
{
    public function __construct(
        public readonly int $x,
        public readonly int $y,
    ) {}
}

$p = new Point(1, 2);
$p->x = 10; // readonlyプロパティは再代入できない
echo sprintf('(%d, %d)', $p->x, $p->y) . "\\n";
`,
      solution: `<?php
class Point
{
    public function __construct(
        public readonly int $x,
        public readonly int $y,
    ) {}
}

$p = new Point(1, 2);
// readonlyは再代入せず、変更後の値を持つ新しいオブジェクトを作る
$moved = new Point(10, $p->y);
echo sprintf('移動後：(%d, %d)', $moved->x, $moved->y) . "\\n";
`,
      hints: [
        `readonlyプロパティはコンストラクタでの初期化以降、書き換えできません。これは不変オブジェクトのための意図的な仕様です。`,
        `new Point(10, $p->y)で新しいインスタンス$movedを作り、出力を「移動後：(%d, %d)」の形式にします。`
      ],
      expectedOutput: "移動後：(10, 2)"
    },
    {
      id: 237,
      title: "Uncaught Exception（catchし忘れ）",
      explanation: `<p>実行すると最初のdivideは成功しますが、2回目で停止します。</p>
<pre><code>5
Fatal error: Uncaught InvalidArgumentException: 0では割れません in main.php:5
Stack trace:
#0 main.php(11): divide(10, 0)
#1 {main}</code></pre>
<p>読み方を整理します。</p>
<ul>
<li><strong>Uncaught InvalidArgumentException</strong>：InvalidArgumentException型の例外が投げられたが、誰もcatchしなかった</li>
<li><strong>0では割れません</strong>：throw時に渡したメッセージ。ここに原因を書いておくと未来の自分が救われます</li>
<li><strong>in main.php:5</strong>：例外が<strong>投げられた場所</strong>（throw文の行）</li>
<li><strong>#0 main.php(11): divide(10, 0)</strong>：呼び出し経路。11行目から<code>divide(10, 0)</code>と呼ばれたことまで分かります</li>
</ul>
<p>例外はcatchされないままトップレベルに達するとFatal errorになり、<strong>プログラム全体がそこで死にます</strong>。後続の「処理を続行します」は実行されません。throwする関数を呼ぶ側は、失敗に備えて<code>try-catch</code>で受け止める責任があります。</p>
<pre><code>try {
    echo divide(10, 0);
} catch (InvalidArgumentException $e) {
    echo 'エラー：' . $e-&gt;getMessage();   // メッセージを取り出せる
}
// catchすればプログラムはここから続行できる</code></pre>
<p>tryの中で例外が投げられると、残りの処理を飛ばして即catchブロックへ移り、その後は通常通り継続します。「失敗しうる処理はtryで囲む」「catchでは握りつぶさず、最低限メッセージを記録・表示する」が基本姿勢です。</p>`,
      task: `例外がcatchされずFatal errorになっています。divideの呼び出しをtry-catchで囲み、エラーメッセージを表示した上で「処理を続行します」まで実行されるように修正してください。`,
      code: `<?php
function divide(int $a, int $b): int
{
    if ($b === 0) {
        throw new InvalidArgumentException('0では割れません');
    }
    return intdiv($a, $b);
}

echo divide(10, 2) . "\\n";
echo divide(10, 0) . "\\n"; // 例外をcatchしていない
echo '処理を続行します' . "\\n";
`,
      solution: `<?php
function divide(int $a, int $b): int
{
    if ($b === 0) {
        throw new InvalidArgumentException('0では割れません');
    }
    return intdiv($a, $b);
}

// 例外が起こりうる処理はtryで囲み、catchで受け止める
try {
    echo divide(10, 2) . "\\n";
    echo divide(10, 0) . "\\n";
} catch (InvalidArgumentException $e) {
    echo 'エラー：' . $e->getMessage() . "\\n";
}
echo '処理を続行します' . "\\n";
`,
      hints: [
        `Uncaughtは「誰もcatchしなかった」という意味です。呼び出し側でtry-catchを書きます。`,
        `catch (InvalidArgumentException $e)で受け、$e->getMessage()で「0では割れません」を取り出して表示します。`
      ],
      expectedOutput: "エラー：0では割れません"
    },
    {
      id: 238,
      title: "catchの順序ミス（親クラスが先）",
      explanation: `<p>このコードはエラーなく動きますが、出力がおかしいバグです。</p>
<pre><code>想定外のエラーです</code></pre>
<p>投げられたのは<code>InvalidArgumentException</code>なので、「入力エラー：IDは1以上を指定してください」と出てほしいのに、汎用メッセージのほうが表示されています。</p>
<p>原因はcatchブロックの<strong>順序</strong>です。複数のcatchは<strong>上から順に</strong>判定され、「投げられた例外がそのクラスのインスタンスか（instanceof）」で最初に一致したブロックだけが実行されます。ここで重要なのが、<strong>子クラスの例外は親クラスのcatchにも一致する</strong>という点です。<code>InvalidArgumentException</code>は<code>Exception</code>を継承しているため、先頭の<code>catch (Exception $e)</code>にマッチしてしまい、下の専用catchには<strong>永遠に到達しません</strong>。PHPはこれを警告してくれないので、自分で気づくしかありません。</p>
<p>修正パターンは<strong>「具体的な（子の）例外を上に、汎用的な（親の）例外を下に」</strong>並べることです。</p>
<pre><code>try {
    // ...
} catch (InvalidArgumentException $e) {   // 子（具体的）が先
    echo '入力エラー：' . $e-&gt;getMessage();
} catch (Exception $e) {                  // 親（汎用）は最後の受け皿
    echo '想定外のエラーです';
}</code></pre>
<p>主な組み込み例外の継承関係も頭に入れておくと順序を決めやすくなります。<code>Exception</code>の下に<code>RuntimeException</code>や<code>LogicException</code>があり、<code>InvalidArgumentException</code>は<code>LogicException</code>の子です。また、同じ処理でよければ<code>catch (TypeError | ValueError $e)</code>のように<code>|</code>で複数型を1つのcatchにまとめる書き方もあります。</p>`,
      task: `catchの順序が原因で専用のエラー処理に到達していません。順序を入れ替えて「入力エラー：IDは1以上を指定してください」と表示されるように修正してください。`,
      code: `<?php
function findUser(int $id): string
{
    if ($id <= 0) {
        throw new InvalidArgumentException('IDは1以上を指定してください');
    }
    return 'ユーザー' . $id;
}

try {
    echo findUser(-1) . "\\n";
} catch (Exception $e) {
    // 親クラスを先に書くと、すべてここで捕まってしまう
    echo '想定外のエラーです' . "\\n";
} catch (InvalidArgumentException $e) {
    echo '入力エラー：' . $e->getMessage() . "\\n";
}
`,
      solution: `<?php
function findUser(int $id): string
{
    if ($id <= 0) {
        throw new InvalidArgumentException('IDは1以上を指定してください');
    }
    return 'ユーザー' . $id;
}

try {
    echo findUser(-1) . "\\n";
} catch (InvalidArgumentException $e) {
    // 具体的な（子クラスの）catchを先に書く
    echo '入力エラー：' . $e->getMessage() . "\\n";
} catch (Exception $e) {
    echo '想定外のエラーです' . "\\n";
}
`,
      hints: [
        `catchは上から順に判定され、子クラスの例外は親クラスのcatchにも一致します。InvalidArgumentExceptionはExceptionの子です。`,
        `具体的なInvalidArgumentExceptionのcatchを上に、汎用のExceptionのcatchを下に入れ替えます。`
      ],
      expectedOutput: "入力エラー：IDは1以上を指定してください"
    },
    {
      id: 239,
      title: "parent::__construct()の呼び忘れ",
      explanation: `<p>実行すると次のFatal errorで停止します。</p>
<pre><code>Fatal error: Uncaught Error: Typed property Product::$name must not be accessed
before initialization in main.php:19
Stack trace:
#0 main.php(24): Book-&gt;summary()
#1 {main}</code></pre>
<p><strong>Typed property Product::$name must not be accessed before initialization</strong>は「型宣言付きプロパティ$nameが、初期化される前にアクセスされた」という意味です。型宣言付きプロパティは、値が代入されるまで「未初期化」という特別な状態にあり、nullですらないため読むとこのErrorになります。</p>
<p>なぜ未初期化のままなのか。<code>Book</code>が<code>Product</code>を継承しつつ<strong>自分のコンストラクタを定義した</strong>からです。子クラスがコンストラクタを持つと親のコンストラクタは<strong>自動では呼ばれません</strong>。親の<code>__construct</code>が担っていた<code>$name</code>の初期化が丸ごとスキップされ、後で<code>summary()</code>が<code>$this-&gt;name</code>を読んだ瞬間に爆発します。<strong>エラーが出る場所（19行目）と原因の場所（コンストラクタ）が離れている</strong>のがこのバグの厄介なところで、「Typed property ... before initialization」を見たら、まずコンストラクタの初期化漏れとparent::__construct()の呼び忘れを疑うのが定石です。</p>
<pre><code>public function __construct(string $name, private string $author)
{
    parent::__construct($name);   // 親の初期化を明示的に呼ぶ
}</code></pre>
<p>修正は、子のコンストラクタで親に必要な引数も受け取り、<code>parent::__construct()</code>へ引き渡すことです。呼び出し側も<code>new Book('入門PHP', '佐藤')</code>のように親の分の引数を渡す形に変わります。「子でコンストラクタを書いたら、親のコンストラクタを呼ぶ必要がないか必ず確認」を習慣にしましょう。</p>`,
      task: `親クラスの初期化が呼ばれていないのが原因です。Bookのコンストラクタで書名も受け取って<code>parent::__construct()</code>を呼び、<code>new Book('入門PHP', '佐藤')</code>で「入門PHP（著：佐藤）」と表示されるように修正してください。`,
      code: `<?php
class Product
{
    public function __construct(
        protected string $name,
    ) {}
}

class Book extends Product
{
    public function __construct(
        private string $author,
    ) {
        // parent::__construct()を呼び忘れている
    }

    public function summary(): string
    {
        return $this->name . '（著：' . $this->author . '）';
    }
}

$book = new Book('佐藤');
echo $book->summary() . "\\n";
`,
      solution: `<?php
class Product
{
    public function __construct(
        protected string $name,
    ) {}
}

class Book extends Product
{
    public function __construct(
        string $name,
        private string $author,
    ) {
        parent::__construct($name); // 親クラスの初期化を必ず呼ぶ
    }

    public function summary(): string
    {
        return $this->name . '（著：' . $this->author . '）';
    }
}

$book = new Book('入門PHP', '佐藤');
echo $book->summary() . "\\n";
`,
      hints: [
        `子クラスがコンストラクタを定義すると、親のコンストラクタは自動では呼ばれず、$nameが未初期化のままになります。`,
        `Bookのコンストラクタの第1引数にstring $nameを追加し、本体でparent::__construct($name)を呼びます。`,
        `呼び出し側もnew Book('入門PHP', '佐藤')と2つの引数を渡す形に変えます。`
      ],
      expectedOutput: "入門PHP（著：佐藤）"
    },
    {
      id: 240,
      title: "総合演習：クラス設計のエラーを直す",
      explanation: `<p>この章の総仕上げです。銀行口座プログラムに、この章で学んだバグが3つ仕込まれています。実行するとまず1つ目のエラーが出ます。</p>
<pre><code>Fatal error: Uncaught Error: Call to undefined method Account::depositt()
in main.php:30</code></pre>
<p>実際のデバッグと同じく、<strong>直しては実行し、次のエラーを読む</strong>を繰り返します。このコードでは次の3つが順に現れます。</p>
<ol>
<li><strong>Call to undefined method Account::depositt()</strong>：ステップ231のtypoです。定義側の<code>deposit</code>と見比べて直します</li>
<li><strong>Cannot access private property Account::$owner</strong>：ステップ232のprivate違反です。すでに用意されている<code>getOwner()</code>ゲッターを使います</li>
<li><strong>Uncaught InvalidArgumentException: 入金額は1円以上にしてください</strong>：ステップ237のcatch忘れです。負の入金は仕様として拒否されるので、<code>try-catch</code>で受け止めてプログラムを最後まで走らせます</li>
</ol>
<p>3つ目の修正後の期待される全出力はこうなります。</p>
<pre><code>佐藤さんの残高：800円
エラー：入金額は1円以上にしてください
記帳が完了しました</code></pre>
<p>ここまでの流れが、実務のデバッグの縮図です。最後にエラーメッセージの読み方の要点を総復習します。</p>
<table>
<tr><th>メッセージの部品</th><th>読み取れること</th></tr>
<tr><td>Error/Exceptionの種類</td><td>何系の問題か（未定義・アクセス権・例外など）</td></tr>
<tr><td><code>Class::member</code></td><td>どのクラスのどのメンバーが問題か</td></tr>
<tr><td><code>in main.php:30</code></td><td>発生したファイルと行番号</td></tr>
<tr><td>Stack trace</td><td>そこに至る呼び出し経路</td></tr>
</table>
<p>エラーは敵ではなく、原因の場所と種類を教えてくれる最良の手がかりです。恐れず、まず読む。この章で身につけた習慣を忘れないでください。</p>`,
      task: `3つのバグ（メソッド名のtypo・privateプロパティへの直接アクセス・例外のcatch忘れ）をすべて修正し、残高表示からエラー表示、「記帳が完了しました」まで実行されるようにしてください。`,
      code: `<?php
class Account
{
    public function __construct(
        private string $owner,
        private int $balance = 0,
    ) {}

    public function deposit(int $amount): void
    {
        if ($amount <= 0) {
            throw new InvalidArgumentException('入金額は1円以上にしてください');
        }
        $this->balance += $amount;
    }

    public function getOwner(): string
    {
        return $this->owner;
    }

    public function getBalance(): int
    {
        return $this->balance;
    }
}

$account = new Account('佐藤');
$account->deposit(500);
$account->depositt(300); // バグ1：メソッド名のtypo
echo $account->owner . 'さんの残高：' . $account->getBalance() . '円' . "\\n"; // バグ2：privateへ直接アクセス
$account->deposit(-100); // バグ3：例外をcatchしていない
echo '記帳が完了しました' . "\\n";
`,
      solution: `<?php
class Account
{
    public function __construct(
        private string $owner,
        private int $balance = 0,
    ) {}

    public function deposit(int $amount): void
    {
        if ($amount <= 0) {
            throw new InvalidArgumentException('入金額は1円以上にしてください');
        }
        $this->balance += $amount;
    }

    public function getOwner(): string
    {
        return $this->owner;
    }

    public function getBalance(): int
    {
        return $this->balance;
    }
}

$account = new Account('佐藤');
$account->deposit(500);
$account->deposit(300); // バグ1修正：正しいメソッド名
echo $account->getOwner() . 'さんの残高：' . $account->getBalance() . '円' . "\\n"; // バグ2修正：ゲッター経由

// バグ3修正：例外をcatchして処理を続行できるようにする
try {
    $account->deposit(-100);
} catch (InvalidArgumentException $e) {
    echo 'エラー：' . $e->getMessage() . "\\n";
}
echo '記帳が完了しました' . "\\n";
`,
      hints: [
        `1つ直すごとに実行して次のエラーメッセージを読みます。まずCall to undefined methodのtypoから。`,
        `privateプロパティ$ownerには、用意されているgetOwner()ゲッターでアクセスします。`,
        `deposit(-100)は仕様通り例外を投げます。try-catchで受けて$e->getMessage()を表示し、最後の行まで到達させます。`
      ],
      expectedOutput: "佐藤さんの残高：800円"
    }
  ]
});
