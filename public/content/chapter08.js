// 第8章：クラスの基本
registerChapter({
  number: 8,
  title: "クラスの基本",
  description: "オブジェクト指向の入口として、クラスの定義・プロパティ・メソッド・コンストラクタから、PHP 8の現代的な書き方までを学ぶ。",
  steps: [
    {
      id: 71,
      title: "classの定義とnew",
      explanation: `<p>ここからオブジェクト指向プログラミングに入ります。<strong>クラス</strong>とは「データと処理をひとまとめにした設計図」、<strong>オブジェクト（インスタンス）</strong>とはその設計図から作った実体です。たい焼きの型（クラス）と、そこから焼き上がるたい焼き（インスタンス）の関係に例えられます。</p>
<pre><code>// クラスの定義。クラス名は大文字始まり（パスカルケース）が慣習
class Dog
{
}

// newで設計図からインスタンスを作る
$pochi = new Dog();
$hachi = new Dog();</code></pre>
<p>ポイントは3つです。</p>
<ul>
<li><code>class クラス名 { ... }</code>で定義する。クラス名は<code>Dog</code>や<code>BankAccount</code>のように大文字始まりにするのがPHPの慣習</li>
<li><code>new クラス名()</code>と書くたびに<strong>新しい別のインスタンス</strong>が作られる。$pochiと$hachiは同じ設計図から生まれた別個体</li>
<li>変数にはインスタンスへの参照が入る。<code>get_class($pochi)</code>でそのインスタンスのクラス名を調べられる</li>
</ul>
<p>「なぜクラスが必要なのか」は今後のステップで実感していきますが、先取りすると<strong>関連するデータ（変数）と処理（関数）を1つの部品にまとめられる</strong>のが最大の利点です。第5章までの関数は「処理」だけの部品でしたが、クラスは「状態を持った部品」を作れます。Laravelなどのフレームワークのコードはほぼすべてクラスでできているので、ここからの10ステップはPHPの実務への直結区間です。</p>`,
      task: `まずそのまま実行して、クラス名の出力と<code>===</code>比較の結果を観察しよう。次に<code>Cat</code>クラスを追加で定義し、<code>new Cat()</code>で作ったインスタンスのクラス名も出力してみよう。`,
      code: `<?php
// クラスの定義（中身は空でも定義できる）
class Dog
{
}

// newでインスタンスを作る。2つは別々の実体
$pochi = new Dog();
$hachi = new Dog();

echo "クラス名: " . get_class($pochi) . "\\n";
var_dump($pochi === $hachi); // 別インスタンスなのでfalse

// TODO: Catクラスを定義し、new Cat()で作って get_class() の結果を出力しよう
`,
      solution: `<?php
// クラスの定義（中身は空でも定義できる）
class Dog
{
}

// クラスは1ファイルにいくつでも定義できる
class Cat
{
}

$pochi = new Dog();
$hachi = new Dog();

echo "クラス名: " . get_class($pochi) . "\\n"; // Dog
var_dump($pochi === $hachi); // bool(false) 同じ設計図でも別の実体

$tama = new Cat();
echo "クラス名: " . get_class($tama) . "\\n"; // Cat
`,
      hints: [
        `class Cat { } のように、Dogと同じ形でもう1つクラスを定義すればよい。`,
        `$tama = new Cat(); echo "クラス名: " . get_class($tama) . "\\n"; を末尾に追加する。`,
      ],
      expectedOutput: "クラス名: Cat",
    },
    {
      id: 72,
      title: "プロパティとアロー演算子（->）",
      explanation: `<p><strong>プロパティ</strong>とは、クラスが持つ変数のことです。インスタンスごとに別々の値を保持できます。クラス定義の中に<code>public 型 $名前 = 初期値;</code>の形で宣言します。</p>
<pre><code>class User
{
    public string $name = "名無し";
    public int $age = 0;
}</code></pre>
<p><code>public</code>は「クラスの外からアクセスしてよい」という印です（詳しくはステップ76で学びます）。<code>string</code>や<code>int</code>の型宣言を付けると、違う型を代入したときにエラーで教えてくれるので、付ける習慣にしましょう。</p>
<p>プロパティの読み書きには<strong>アロー演算子<code>-&gt;</code></strong>を使います。「インスタンス<code>-&gt;</code>プロパティ名」で、<code>$</code>はプロパティ名側には付けない点に注意してください。</p>
<pre><code>$user = new User();
echo $user-&gt;name;      // 名無し（初期値が入っている）
$user-&gt;name = "田中";  // 代入もできる
$user-&gt;age = 25;
echo $user-&gt;name . "さん(" . $user-&gt;age . "歳)";</code></pre>
<p>よくある間違いは<code>$user-&gt;$name</code>のように$を付けてしまうことです（これは「$name変数の中身の名前のプロパティ」という別の意味になってしまいます）。</p>
<p>連想配列<code>$user["name"]</code>と似ていると感じたかもしれません。実際、役割は近いのですが、クラスは「どんな項目があるか」が定義として明文化され、型もチェックされ、さらに次ステップで学ぶ「処理（メソッド）」も持てる点が違います。</p>`,
      task: `TODOの2か所を完成させよう。アロー演算子<code>-&gt;</code>を使って<code>$user</code>のnameに"田中"、ageに25を代入し、「田中さん(25歳)」と出力されるようにする。`,
      code: `<?php
class User
{
    public string $name = "名無し";
    public int $age = 0;
}

$user = new User();
echo $user->name . "\\n"; // 初期値の「名無し」が表示される

// TODO: アロー演算子を使って$userのnameに"田中"を代入する

// TODO: 同様にageに25を代入する

echo $user->name . "さん(" . $user->age . "歳)\\n";
`,
      solution: `<?php
class User
{
    public string $name = "名無し";
    public int $age = 0;
}

$user = new User();
echo $user->name . "\\n"; // 名無し

// プロパティへの代入は「インスタンス->プロパティ名 = 値」
// プロパティ名側に$は付けないことに注意
$user->name = "田中";
$user->age = 25;

echo $user->name . "さん(" . $user->age . "歳)\\n"; // 田中さん(25歳)
`,
      hints: [
        `プロパティへの代入は $user->name = "田中"; の形。読むときと同じくアロー演算子を使う。`,
        `$user->$name と書かないこと。->の右側のプロパティ名に$は不要。`,
      ],
      expectedOutput: "田中さん(25歳)",
    },
    {
      id: 73,
      title: "メソッド（クラスの中の関数）と$this",
      explanation: `<p><strong>メソッド</strong>とは、クラスの中に定義された関数のことです。書き方は第5章で学んだ関数とほぼ同じで、クラスの中に置き、先頭に<code>public</code>を付けます。呼び出しはプロパティと同じくアロー演算子で<code>$obj-&gt;メソッド名()</code>です。</p>
<p>メソッドの中では特別な変数<strong><code>$this</code></strong>が使えます。<code>$this</code>は「このメソッドが呼ばれたインスタンス自身」を指し、<code>$this-&gt;count</code>のように書くことで自分のプロパティを読み書きできます。</p>
<pre><code>class Counter
{
    public int $count = 0;

    public function increment(): void
    {
        // $this = このインスタンス自身
        $this-&gt;count = $this-&gt;count + 1;
    }
}

$a = new Counter();
$b = new Counter();
$a-&gt;increment();
$a-&gt;increment();
echo $a-&gt;count; // 2
echo $b-&gt;count; // 0（$bは別インスタンスなので影響なし）</code></pre>
<p>この例が示すように、<strong>同じメソッドでも呼び出したインスタンスによって操作されるデータが違う</strong>のがオブジェクト指向の核心です。$aのincrementは$aのcountだけを増やします。</p>
<p>これが「データと処理をひとまとめにする」の具体的な意味です。第5章の関数では<code>increment($count)</code>のようにデータを毎回引数で渡す必要がありましたが、メソッドなら自分が抱えるデータ（プロパティ）に<code>$this</code>で直接触れます。戻り値の型宣言（何も返さないなら<code>: void</code>）も関数と同様に書けます。</p>`,
      task: `<code>increment()</code>メソッドの中身をTODOに従って実装し、<code>$this</code>を使ってcountプロパティを1増やそう。完成したら実行して「現在の値: 3」になることを確認する。`,
      code: `<?php
class Counter
{
    public int $count = 0;

    public function increment(): void
    {
        // TODO: $thisを使って、countプロパティを1増やす
    }

    public function show(): void
    {
        echo "現在の値: " . $this->count . "\\n";
    }
}

$counter = new Counter();
$counter->increment();
$counter->increment();
$counter->increment();
$counter->show(); // 現在の値: 3 になれば成功
`,
      solution: `<?php
class Counter
{
    public int $count = 0;

    public function increment(): void
    {
        // $thisは「このメソッドが呼ばれたインスタンス自身」
        $this->count = $this->count + 1; // $this->count += 1; でもよい
    }

    public function show(): void
    {
        echo "現在の値: " . $this->count . "\\n";
    }
}

$counter = new Counter();
$counter->increment();
$counter->increment();
$counter->increment();
$counter->show(); // 現在の値: 3
`,
      hints: [
        `メソッドの中から自分のプロパティに触るには $this->count と書く。`,
        `$this->count = $this->count + 1; または $this->count += 1; の1行でよい。`,
      ],
      expectedOutput: "現在の値: 3",
    },
    {
      id: 74,
      title: "コンストラクタ__construct",
      explanation: `<p>前ステップまでのクラスはプロパティに初期値を書いていましたが、「インスタンスを作るときに値を渡して初期化したい」ことのほうが多いはずです。そのための仕組みが<strong>コンストラクタ</strong>、名前が<code>__construct</code>（アンダースコア2つ）の特別なメソッドです。</p>
<pre><code>class Book
{
    public string $title;
    public int $price;

    public function __construct(string $title, int $price)
    {
        // 引数で受け取った値をプロパティに保存する
        $this-&gt;title = $title;
        $this-&gt;price = $price;
    }
}

$book = new Book("リーダブルコード", 2640);
echo $book-&gt;title; // リーダブルコード</code></pre>
<p>コンストラクタは<strong><code>new</code>した瞬間に自動で呼ばれます</strong>。<code>new Book("リーダブルコード", 2640)</code>の括弧内の値が、そのまま__constructの引数に渡されます。自分で<code>$book-&gt;__construct()</code>と呼ぶことはありません。</p>
<p>重要な注意点があります。<code>public string $title;</code>のように<strong>初期値なしで型宣言したプロパティ</strong>は、値を代入する前に読むと「must not be accessed before initialization」というErrorで停止します。初期コードのエラーはまさにこれです。コンストラクタで必ず全プロパティを初期化する設計にすれば、「初期化し忘れた中途半端なインスタンス」が存在できなくなります。これは<strong>不正な状態のオブジェクトを作らせない</strong>という、オブジェクト指向設計の大切な考え方の第一歩です。</p>`,
      task: `初期コードはプロパティ未初期化のErrorで停止する。まず実行してエラーメッセージを読み、<code>__construct(string $title, int $price)</code>を追加して2つのプロパティを初期化し、動くようにしよう。`,
      code: `<?php
class Book
{
    public string $title;
    public int $price;

    // TODO: __constructを追加して、引数$titleと$priceをプロパティに代入する

    public function describe(): void
    {
        echo $this->title . "は" . $this->price . "円です\\n";
    }
}

// まず実行してみよう。プロパティが未初期化のためErrorになる
$book = new Book("リーダブルコード", 2640);
$book->describe();
`,
      solution: `<?php
class Book
{
    public string $title;
    public int $price;

    // newした瞬間に自動で呼ばれる特別なメソッド
    public function __construct(string $title, int $price)
    {
        $this->title = $title;
        $this->price = $price;
    }

    public function describe(): void
    {
        echo $this->title . "は" . $this->price . "円です\\n";
    }
}

$book = new Book("リーダブルコード", 2640);
$book->describe(); // リーダブルコードは2640円です
`,
      hints: [
        `エラーは「Typed property Book::$title must not be accessed before initialization」。型付きプロパティは代入前に読めない。`,
        `public function __construct(string $title, int $price) { ... } をクラス内に追加する。`,
        `中身は $this->title = $title; と $this->price = $price; の2行。`,
      ],
      expectedOutput: "リーダブルコードは2640円です",
    },
    {
      id: 75,
      title: "コンストラクタプロモーション（PHP 8）",
      explanation: `<p>前ステップのコードをよく見ると、$titleという名前が「プロパティ宣言」「引数」「代入」で<strong>3回も</strong>登場していました。この定型文を一掃するのがPHP 8で導入された<strong>コンストラクタプロモーション</strong>（プロパティ昇格）です。</p>
<p>書き方は簡単で、<strong>コンストラクタの引数に<code>public</code>などの可視性を付けるだけ</strong>。するとその引数は自動的に同名のプロパティになり、代入も自動で行われます。</p>
<pre><code>// 従来の書き方（8行）
class Point
{
    public float $x;
    public float $y;
    public function __construct(float $x, float $y)
    {
        $this-&gt;x = $x;
        $this-&gt;y = $y;
    }
}

// プロモーションを使った書き方（意味は完全に同じ）
class Point
{
    public function __construct(
        public float $x,
        public float $y,
    ) {
    }
}</code></pre>
<p>引数を縦に並べ、最後の引数の後ろにもカンマを付ける（末尾カンマ）のが読みやすい定番スタイルです。使い方は従来と変わらず、<code>new Point(3.0, 4.0)</code>とすれば<code>$p-&gt;x</code>で3.0が取れます。</p>
<p>注意点は、<code>public</code>（や後で学ぶ<code>private</code>）を<strong>付けた引数だけ</strong>がプロパティに昇格することです。付けない引数はただのローカル変数として扱われ、コンストラクタの外には残りません。普通の宣言と混在させることもできます。モダンなPHPコードでは、値をまとめて持つだけのクラスはほぼこの書き方一択になっています。</p>`,
      task: `従来の書き方で書かれた<code>Point</code>クラスを、コンストラクタプロモーションを使った書き方に書き換えよう。プロパティ宣言と代入の行を削除し、引数に<code>public</code>を付ける。動作が変わらないことを実行して確認する。`,
      code: `<?php
// TODO: このクラスをコンストラクタプロモーションで書き直そう
// （プロパティ宣言2行と代入2行を消し、引数にpublicを付ける）
class Point
{
    public float $x;
    public float $y;

    public function __construct(float $x, float $y)
    {
        $this->x = $x;
        $this->y = $y;
    }
}

$p = new Point(3.0, 4.0);
echo "x=" . $p->x . ", y=" . $p->y . "\\n";
echo "原点からの距離: " . sqrt($p->x * $p->x + $p->y * $p->y) . "\\n";
`,
      solution: `<?php
// コンストラクタプロモーション: 引数にpublicを付けると
// プロパティ宣言・代入が自動で行われる
class Point
{
    public function __construct(
        public float $x,
        public float $y,
    ) {
    }
}

$p = new Point(3.0, 4.0);
echo "x=" . $p->x . ", y=" . $p->y . "\\n"; // x=3, y=4
echo "原点からの距離: " . sqrt($p->x * $p->x + $p->y * $p->y) . "\\n"; // 5
`,
      hints: [
        `プロパティ宣言（public float $x; など）と$this->x = $x;の代入は全部削除してよい。`,
        `__construct(public float $x, public float $y) と引数にpublicを付ければ、宣言と代入が自動になる。`,
      ],
      expectedOutput: "原点からの距離: 5",
    },
    {
      id: 76,
      title: "可視性（public・private・protected）とゲッター",
      explanation: `<p>プロパティやメソッドの前に付けてきた<code>public</code>は<strong>可視性（アクセス修飾子）</strong>と呼ばれ、「どこから触れるか」を制御します。</p>
<table>
<tr><th>修飾子</th><th>クラスの中から</th><th>クラスの外から</th></tr>
<tr><td><code>public</code></td><td>OK</td><td>OK</td></tr>
<tr><td><code>private</code></td><td>OK</td><td><strong>Error</strong></td></tr>
<tr><td><code>protected</code></td><td>OK</td><td><strong>Error</strong>（継承先からはOK。継承は後の章で学ぶ）</td></tr>
</table>
<p>なぜわざわざ触れなくするのでしょうか。財布クラスを例に考えます。残高が<code>public</code>だと、外から<code>$wallet-&gt;balance = -9999;</code>のような<strong>不正な値を自由に書き込めて</strong>しまいます。<code>private</code>にすれば、残高を変える手段はクラスが用意したメソッドだけになり、そこで「マイナスは受け付けない」などのチェックを強制できます。これを<strong>カプセル化</strong>と呼びます。</p>
<pre><code>class Wallet
{
    private int $balance = 0;

    public function add(int $amount): void
    {
        if ($amount &gt; 0) {          // 不正な値はここで弾ける
            $this-&gt;balance += $amount;
        }
    }

    public function getBalance(): int  // ゲッター
    {
        return $this-&gt;balance;
    }
}</code></pre>
<p>privateにすると外から読むこともできなくなるので、読み取り用の公開メソッドを用意します。これが<strong>ゲッター</strong>で、<code>get＋プロパティ名</code>（getBalanceなど）と命名するのが慣習です。「書き込みは検証付きメソッド経由、読み取りはゲッター」がクラス設計の基本形です。</p>`,
      task: `初期コードは<code>private</code>プロパティに外から触っているためErrorになる。まず実行してエラーを確認し、(1)残高を読む行を<code>getBalance()</code>ゲッターの呼び出しに直し、(2)そのゲッターをクラスに追加して動くようにしよう。`,
      code: `<?php
class Wallet
{
    private int $balance = 0;

    public function add(int $amount): void
    {
        // マイナスの入金はここで弾く（privateだからこのチェックを迂回できない）
        if ($amount > 0) {
            $this->balance += $amount;
        }
    }

    // TODO: 残高を返すゲッター getBalance() を追加する
}

$wallet = new Wallet();
$wallet->add(1000);
$wallet->add(-500); // 不正な値は無視される
$wallet->add(300);

// まず実行してみよう。privateプロパティへの外部アクセスはErrorになる
echo "残高: " . $wallet->balance . "円\\n";
`,
      solution: `<?php
class Wallet
{
    private int $balance = 0;

    public function add(int $amount): void
    {
        // マイナスの入金はここで弾く（privateだからこのチェックを迂回できない）
        if ($amount > 0) {
            $this->balance += $amount;
        }
    }

    // ゲッター: privateプロパティを読み取り専用で公開する
    public function getBalance(): int
    {
        return $this->balance;
    }
}

$wallet = new Wallet();
$wallet->add(1000);
$wallet->add(-500); // 無視される
$wallet->add(300);

echo "残高: " . $wallet->getBalance() . "円\\n"; // 残高: 1300円
`,
      hints: [
        `エラーは「Cannot access private property Wallet::$balance」。privateはクラスの外から読み書きできない。`,
        `public function getBalance(): int { return $this->balance; } をクラスに追加する。`,
        `最後のechoは $wallet->getBalance() に書き換える。メソッド呼び出しなので()を忘れずに。`,
      ],
      expectedOutput: "残高: 1300円",
    },
    {
      id: 77,
      title: "readonlyプロパティ（PHP 8.1）",
      explanation: `<p>「作った後は変更されたくない」値はたくさんあります。商品の名前、注文日時、ユーザーIDなど。こうしたプロパティに<strong><code>readonly</code></strong>を付けると、<strong>一度初期化した後の再代入がErrorになります</strong>（PHP 8.1で導入）。</p>
<pre><code>class Product
{
    public function __construct(
        public readonly string $name,
        public readonly int $price,
    ) {
    }
}

$item = new Product("ノートPC", 128000);
echo $item-&gt;name;      // 読むのは自由
$item-&gt;price = 100;    // Error: Cannot modify readonly property</code></pre>
<p>前ステップのprivateとの違いを整理しましょう。</p>
<table>
<tr><th>修飾子</th><th>外から読む</th><th>外から書く</th><th>中から再代入</th></tr>
<tr><td><code>public</code></td><td>OK</td><td>OK</td><td>OK</td></tr>
<tr><td><code>private</code></td><td>Error（ゲッター経由）</td><td>Error</td><td>OK</td></tr>
<tr><td><code>public readonly</code></td><td>OK</td><td>Error</td><td>Error（初期化後）</td></tr>
</table>
<p><code>public readonly</code>なら「読むのは自由・書くのは禁止」なので、<strong>ゲッターを書かなくても安全に公開できる</strong>のが利点です。値を保持するだけのクラスでは、コンストラクタプロモーションとreadonlyの組み合わせが現代PHPの定番スタイルになっています。</p>
<p>一度作ったら変わらないオブジェクトを<strong>イミュータブル（不変）</strong>と呼びます。不変なら「いつの間にか誰かに書き換えられていた」というバグが原理的に起きず、コードを追う負担が激減します。「変更が必要な設計か？」をまず疑い、不要ならreadonlyを付けるのが良い習慣です。</p>`,
      task: `まずそのまま実行して正常に動くことを確認しよう。次に最終行のコメントを外して実行し、「Cannot modify readonly property」のErrorが出ることを観察したら、コメントに戻して提出しよう。`,
      code: `<?php
class Product
{
    public function __construct(
        public readonly string $name,
        public readonly int $price,
    ) {
    }
}

$item = new Product("ノートPC", 128000);

// readonlyでも読み取りは自由にできる
echo $item->name . ": " . number_format($item->price) . "円\\n";

// TODO: 次の行のコメントを外して実行し、Errorを観察したら元に戻そう
// $item->price = 100;
`,
      solution: `<?php
class Product
{
    public function __construct(
        // readonly: 初期化後の再代入を禁止する（PHP 8.1）
        public readonly string $name,
        public readonly int $price,
    ) {
    }
}

$item = new Product("ノートPC", 128000);

// 読み取りは自由。書き込みだけがErrorになる
echo $item->name . ": " . number_format($item->price) . "円\\n";

// $item->price = 100; は
// Error: Cannot modify readonly property Product::$price になる
`,
      hints: [
        `コメントを外すと「Cannot modify readonly property Product::$price」というErrorで停止する。`,
        `readonlyは「読み取りOK・再代入Error」。ゲッターなしで安全に公開したいときに使う。`,
      ],
      expectedOutput: "ノートPC: 128,000円",
    },
    {
      id: 78,
      title: "静的プロパティ・静的メソッド（staticと::）",
      explanation: `<p>これまでのプロパティは「インスタンスごと」に値を持ちました。これに対し<strong><code>static</code></strong>を付けた静的プロパティは、<strong>インスタンスではなくクラス自体に1つだけ</strong>存在し、全インスタンスで共有されます。</p>
<pre><code>class Visitor
{
    public static int $count = 0;   // クラスに1つだけ

    public static function visit(): void
    {
        self::$count++;             // クラスの中からはself::
    }
}

Visitor::visit();          // インスタンスを作らずに呼べる
Visitor::visit();
echo Visitor::$count;      // 2</code></pre>
<p>アクセスには<code>-&gt;</code>ではなく<strong>スコープ解決演算子<code>::</code></strong>（ダブルコロン）を使います。書き分けを整理します。</p>
<table>
<tr><th></th><th>通常（インスタンス）</th><th>静的（クラス）</th></tr>
<tr><td>外からプロパティ</td><td><code>$obj-&gt;count</code></td><td><code>Visitor::$count</code>（$が付く）</td></tr>
<tr><td>外からメソッド</td><td><code>$obj-&gt;visit()</code></td><td><code>Visitor::visit()</code></td></tr>
<tr><td>中から自分の</td><td><code>$this-&gt;count</code></td><td><code>self::$count</code></td></tr>
</table>
<p><code>self</code>は「このクラス自身」を指すキーワードです。静的メソッドの中はインスタンスが存在しない文脈なので、<strong><code>$this</code>は使えません</strong>。</p>
<p>staticの用途は「全体で共有するカウンター」「インスタンス不要のユーティリティ関数（例：<code>Math::round2($n)</code>のような計算だけの処理）」などです。ただし静的プロパティは実質グローバル変数に近く、どこからでも書き換えられて追いにくくなるため、乱用は禁物です。「本当にクラス全体で1つであるべき値か」を考えてから使いましょう。</p>`,
      task: `TODOの2か所を完成させよう。<code>visit()</code>の中で<code>self::</code>を使って静的プロパティ<code>$count</code>を1増やし、最後に<code>Visitor::$count</code>を読んで合計を出力する。`,
      code: `<?php
class Visitor
{
    // 静的プロパティ: インスタンスではなくクラス自体に属する
    public static int $count = 0;

    public static function visit(): void
    {
        // TODO: self::を使って$countを1増やし、
        // 「(値)人目の訪問です」と出力する
    }
}

// 静的メソッドはインスタンスを作らずクラス名::で呼ぶ
Visitor::visit();
Visitor::visit();
Visitor::visit();

// TODO: Visitor::$countを使って「合計: 3人」と出力する
`,
      solution: `<?php
class Visitor
{
    // 静的プロパティ: インスタンスではなくクラス自体に属する
    public static int $count = 0;

    public static function visit(): void
    {
        // クラスの中から静的プロパティに触るときはself::を使う
        // （静的メソッド内では$thisは使えない）
        self::$count++;
        echo self::$count . "人目の訪問です\\n";
    }
}

Visitor::visit(); // 1人目の訪問です
Visitor::visit(); // 2人目の訪問です
Visitor::visit(); // 3人目の訪問です

// 外からはクラス名::$プロパティ名で読む（$が付くことに注意）
echo "合計: " . Visitor::$count . "人\\n";
`,
      hints: [
        `静的プロパティにクラス内から触るときは self::$count と書く。$this->countではない。`,
        `visit()の中身は self::$count++; と echo self::$count . "人目の訪問です\\n"; の2行。`,
        `外から読むときは Visitor::$count。プロパティは::の後ろに$が付く。`,
      ],
      expectedOutput: "合計: 3人",
    },
    {
      id: 79,
      title: "クラス定数（const）",
      explanation: `<p>消費税率や円周率のように「クラスに関係する変わらない値」は、<strong>クラス定数</strong>として定義します。<code>const 名前 = 値;</code>と書き、名前は<strong>大文字のスネークケース</strong>（TAX_RATEなど）、<strong>$は付けない</strong>のがルールです。</p>
<pre><code>class Circle
{
    public const PI = 3.14;

    public function __construct(
        public readonly float $radius,
    ) {
    }

    public function area(): float
    {
        return self::PI * $this-&gt;radius * $this-&gt;radius;
    }
}

echo Circle::PI;          // 外からはクラス名::定数名
$c = new Circle(10.0);
echo $c-&gt;area();          // 314</code></pre>
<p>アクセス方法は静的プロパティと同じ<code>::</code>ですが、定数には$が付きません。<code>Circle::PI</code>（定数）と<code>Visitor::$count</code>（静的プロパティ）の見た目の違いを意識してください。クラスの中からは<code>self::PI</code>で参照します。</p>
<table>
<tr><th></th><th>クラス定数</th><th>静的プロパティ</th></tr>
<tr><td>宣言</td><td><code>const PI = 3.14;</code></td><td><code>public static int $count = 0;</code></td></tr>
<tr><td>値の変更</td><td>不可（コンパイル時に確定）</td><td>可能</td></tr>
<tr><td>アクセス</td><td><code>Circle::PI</code></td><td><code>Visitor::$count</code></td></tr>
</table>
<p>定数を使う利点は、値に<strong>名前が付く</strong>ことと<strong>1か所で管理できる</strong>ことです。コード中に3.14や0.1が直接書かれている状態（マジックナンバーと呼ばれます）は、意味が読み取れず修正漏れの温床になります。なおPHP 8.3以降では<code>public const float PI = 3.14;</code>のように定数にも型宣言を付けられます。</p>`,
      task: `TODOの2か所を完成させよう。クラス定数<code>TAX_RATE</code>（値0.1）を定義し、<code>taxIncluded()</code>メソッドの中で<code>self::TAX_RATE</code>を使って税込価格を計算する。`,
      code: `<?php
class Item
{
    // TODO: 消費税率のクラス定数 TAX_RATE を定義する（値は0.1、$は付けない）

    public function __construct(
        public readonly string $name,
        public readonly int $price,
    ) {
    }

    public function taxIncluded(): int
    {
        // TODO: self::TAX_RATEを使って税込価格を計算して返す
        // 計算式: (int)round($this->price * (1 + 税率))
        return $this->price;
    }
}

$item = new Item("キーボード", 5000);
echo "税率: " . Item::TAX_RATE . "\\n";
echo $item->name . "の税込価格: " . $item->taxIncluded() . "円\\n";
`,
      solution: `<?php
class Item
{
    // クラス定数: 大文字スネークケースで命名し、$は付けない
    public const TAX_RATE = 0.1;

    public function __construct(
        public readonly string $name,
        public readonly int $price,
    ) {
    }

    public function taxIncluded(): int
    {
        // クラスの中からはself::定数名で参照する
        return (int)round($this->price * (1 + self::TAX_RATE));
    }
}

$item = new Item("キーボード", 5000);
echo "税率: " . Item::TAX_RATE . "\\n";                          // 0.1
echo $item->name . "の税込価格: " . $item->taxIncluded() . "円\\n"; // 5500円
`,
      hints: [
        `定数の定義は public const TAX_RATE = 0.1; の1行。変数と違って$を付けない。`,
        `taxIncluded()の中は return (int)round($this->price * (1 + self::TAX_RATE)); とする。`,
      ],
      expectedOutput: "キーボードの税込価格: 5500円",
    },
    {
      id: 80,
      title: "総合演習：BankAccountクラス",
      explanation: `<p>第8章の総まとめとして、この章で学んだ要素を全部使う<code>BankAccount</code>（銀行口座）クラスを完成させます。部品と役割の対応表です。</p>
<table>
<tr><th>要素</th><th>この演習での使いどころ</th><th>学んだステップ</th></tr>
<tr><td>クラス定数</td><td>銀行名<code>BANK_NAME</code></td><td>79</td></tr>
<tr><td>静的プロパティ</td><td>開設された口座の総数<code>$accountCount</code></td><td>78</td></tr>
<tr><td>readonly＋プロモーション</td><td>口座名義<code>$owner</code>（後から変えられない）</td><td>75・77</td></tr>
<tr><td>privateプロパティ</td><td>残高<code>$balance</code>（直接書き換え禁止）</td><td>76</td></tr>
<tr><td>メソッド＋$this</td><td><code>deposit()</code>・<code>withdraw()</code>・ゲッター</td><td>73・76</td></tr>
</table>
<p>設計の要点は「<strong>残高が不正な状態になる経路を全部塞ぐ</strong>」ことです。残高はprivateなので、変更手段はdeposit（入金）とwithdraw（出金）だけ。depositは0以下の金額を拒否し、withdrawは残高を超える出金を拒否します。ガード節（第5章）を使い、不正なら早期にreturnする形が読みやすい書き方です。</p>
<pre><code>public function withdraw(int $amount): void
{
    if ($amount &gt; $this-&gt;balance) {
        echo "残高不足です\\n";
        return;               // ここで打ち切る（ガード節）
    }
    $this-&gt;balance -= $amount;
}</code></pre>
<p>また、コンストラクタの中で<code>self::$accountCount++;</code>とすることで「newされた回数＝口座の総数」を自動で数えられます。インスタンスごとの状態（残高）とクラス全体の状態（口座数）の違いを体感してください。ここまで書ければ、クラスの基本文法は卒業です。</p>`,
      task: `TODOの3か所を実装しよう。(1)コンストラクタで口座数<code>self::$accountCount</code>を1増やす、(2)<code>deposit()</code>で0以下なら「入金額が不正です」と出力して打ち切り、正常なら残高に加算、(3)<code>withdraw()</code>で残高を超えるなら「残高不足です」と出力して打ち切り、正常なら残高から減算する。`,
      code: `<?php
class BankAccount
{
    public const BANK_NAME = "PHP銀行";

    private static int $accountCount = 0;

    private int $balance = 0;

    public function __construct(
        public readonly string $owner,
    ) {
        // TODO: 口座が作られるたびに口座数を1増やす
    }

    public function deposit(int $amount): void
    {
        // TODO: $amountが0以下なら「入金額が不正です」と出力してreturn。
        // 正常なら残高に加算し、「(金額)円を入金しました」と出力する
    }

    public function withdraw(int $amount): void
    {
        // TODO: $amountが残高より大きければ「残高不足です」と出力してreturn。
        // 正常なら残高から減算し、「(金額)円を出金しました」と出力する
    }

    public function getBalance(): int
    {
        return $this->balance;
    }

    public static function getAccountCount(): int
    {
        return self::$accountCount;
    }
}

echo BankAccount::BANK_NAME . "へようこそ\\n";

$taro = new BankAccount("田中太郎");
$hana = new BankAccount("鈴木花子");

$taro->deposit(10000);
$taro->withdraw(3000);
$taro->withdraw(99999); // 残高不足になるはず
echo $taro->owner . "さんの残高: " . number_format($taro->getBalance()) . "円\\n";

$hana->deposit(5000);
echo $hana->owner . "さんの残高: " . number_format($hana->getBalance()) . "円\\n";

echo "口座数: " . BankAccount::getAccountCount() . "\\n";
`,
      solution: `<?php
class BankAccount
{
    // 銀行名は全口座で共通の変わらない値なのでクラス定数にする
    public const BANK_NAME = "PHP銀行";

    // 口座の総数はクラス全体で1つの値なので静的プロパティにする
    private static int $accountCount = 0;

    // 残高はメソッド経由でしか変更させない
    private int $balance = 0;

    public function __construct(
        // 名義は開設後に変わらないのでreadonly
        public readonly string $owner,
    ) {
        self::$accountCount++;
    }

    public function deposit(int $amount): void
    {
        // ガード節: 不正な入力は先に弾いて打ち切る
        if ($amount <= 0) {
            echo "入金額が不正です\\n";
            return;
        }
        $this->balance += $amount;
        echo $amount . "円を入金しました\\n";
    }

    public function withdraw(int $amount): void
    {
        if ($amount > $this->balance) {
            echo "残高不足です\\n";
            return;
        }
        $this->balance -= $amount;
        echo $amount . "円を出金しました\\n";
    }

    public function getBalance(): int
    {
        return $this->balance;
    }

    public static function getAccountCount(): int
    {
        return self::$accountCount;
    }
}

echo BankAccount::BANK_NAME . "へようこそ\\n";

$taro = new BankAccount("田中太郎");
$hana = new BankAccount("鈴木花子");

$taro->deposit(10000);
$taro->withdraw(3000);
$taro->withdraw(99999); // 残高不足です
echo $taro->owner . "さんの残高: " . number_format($taro->getBalance()) . "円\\n";

$hana->deposit(5000);
echo $hana->owner . "さんの残高: " . number_format($hana->getBalance()) . "円\\n";

echo "口座数: " . BankAccount::getAccountCount() . "\\n"; // 2
`,
      hints: [
        `コンストラクタには self::$accountCount++; の1行を入れる。静的プロパティなので$thisではなくself::。`,
        `deposit()は if ($amount <= 0) { echo "入金額が不正です\\n"; return; } のガード節から書き始める。`,
        `withdraw()の条件は $amount > $this->balance。田中太郎の最終残高は10000-3000=7000円になるはず。`,
      ],
      expectedOutput: "田中太郎さんの残高: 7,000円",
    },
  ],
});
