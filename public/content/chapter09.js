// 第9章：クラスの発展
registerChapter({
  number: 9,
  title: "クラスの発展",
  description: "継承・抽象クラス・インターフェース・traitなど、クラスを組み合わせて設計するための仕組みを学びます。",
  steps: [
    {
      id: 81,
      title: "継承（extends）",
      explanation: `<p><strong>継承</strong>とは、既存のクラス（親クラス）のプロパティとメソッドを引き継いで、新しいクラス（子クラス）を作る仕組みです。<code>class 子クラス extends 親クラス</code>と書きます。子クラスは親クラスの機能をそのまま使えるうえ、独自のメソッドを追加できます。共通の処理を親クラスにまとめることで、同じコードを何度も書かずに済みます。</p>
<pre><code>class Animal
{
    protected string $name; // protectedなら子クラスからも使える

    public function __construct(string $name)
    {
        $this-&gt;name = $name;
    }

    public function introduce(): void
    {
        echo $this-&gt;name . "です";
    }
}

class Dog extends Animal
{
    public function bark(): void
    {
        echo $this-&gt;name . "：ワンワン！"; // 親のプロパティを利用
    }
}</code></pre>
<p>継承で重要になるのがアクセス修飾子です。第8章で学んだ<code>private</code>は「そのクラスの中だけ」で、子クラスからも見えません。継承を前提にするときは<code>protected</code>（自分と子クラスから見える）を使います。</p>
<table>
<tr><th>修飾子</th><th>クラス内</th><th>子クラス</th><th>外部</th></tr>
<tr><td><code>public</code></td><td>○</td><td>○</td><td>○</td></tr>
<tr><td><code>protected</code></td><td>○</td><td>○</td><td>×</td></tr>
<tr><td><code>private</code></td><td>○</td><td>×</td><td>×</td></tr>
</table>
<p>なお、PHPの継承は<strong>単一継承</strong>で、親クラスは1つしか指定できません。複数の機能を組み合わせたい場合は、後のステップで学ぶインターフェースやtraitを使います。</p>`,
      task: `Dogクラスに<code>extends Animal</code>が抜けているため、<code>introduce()</code>が未定義エラーになります。DogクラスがAnimalクラスを継承するように修正してください。`,
      code: `<?php

class Animal
{
    protected string $name;

    public function __construct(string $name)
    {
        $this->name = $name;
    }

    public function introduce(): void
    {
        echo $this->name . "です" . PHP_EOL;
    }
}

// TODO: Animalクラスを継承するように修正する
class Dog
{
    public function bark(): void
    {
        echo $this->name . "：ワンワン！" . PHP_EOL;
    }
}

$dog = new Dog("ポチ");
$dog->introduce();
$dog->bark();
`,
      solution: `<?php

class Animal
{
    protected string $name;

    public function __construct(string $name)
    {
        $this->name = $name;
    }

    public function introduce(): void
    {
        echo $this->name . "です" . PHP_EOL;
    }
}

// AnimalクラスをextendsするとコンストラクタもintroduceもDogで使える
class Dog extends Animal
{
    public function bark(): void
    {
        echo $this->name . "：ワンワン！" . PHP_EOL;
    }
}

$dog = new Dog("ポチ");
$dog->introduce();
$dog->bark();
`,
      hints: [
        `継承は「class 子クラス名 extends 親クラス名」の形で宣言します。`,
        `class Dogの行をclass Dog extends Animalに書き換えるだけで、コンストラクタとintroduce()が引き継がれます。`
      ],
      expectedOutput: "ポチ：ワンワン！"
    },
    {
      id: 82,
      title: "メソッドのオーバーライドとparent::",
      explanation: `<p>子クラスで親クラスと<strong>同じ名前のメソッド</strong>を定義すると、子クラス側の定義が優先されます。これを<strong>オーバーライド</strong>（上書き）と呼びます。「基本の動きは親と同じだが、一部だけ変えたい」ときに使います。</p>
<p>オーバーライドしたメソッドの中から親クラスの元の処理を呼びたいときは、<code>parent::メソッド名()</code>と書きます。「親の処理＋追加の処理」という組み立てがよく使われます。</p>
<pre><code>class Animal
{
    public function cry(): void
    {
        echo "何かの鳴き声がする";
    }
}

class Cat extends Animal
{
    public function cry(): void // 親と同名＝オーバーライド
    {
        parent::cry();          // 親の元の処理を呼ぶ
        echo "ニャーと鳴いた";  // 追加の処理
    }
}</code></pre>
<p>オーバーライドにはルールがあります。引数の型・個数と戻り値の型は、親のメソッドと<strong>互換性がある</strong>必要があります（互換性がないと致命的エラーになります）。また、親より厳しいアクセス修飾子には変更できません（<code>public</code>のメソッドを<code>private</code>にはできない）。</p>
<p>ミドルエンジニア向けの補足として、PHP 8.3以降では<code>#[\\Override]</code>属性をメソッドに付けると「これはオーバーライドである」という意図を明示でき、メソッド名のタイプミスで実はオーバーライドになっていなかった、という事故をエンジン側が検出してくれます。</p>`,
      task: `Catクラスの<code>cry()</code>の先頭で<code>parent::cry()</code>を呼び、「何かの鳴き声がする」→「ニャーと鳴いた」の順に出力されるようにしてください。`,
      code: `<?php

class Animal
{
    public function cry(): void
    {
        echo "何かの鳴き声がする" . PHP_EOL;
    }
}

class Cat extends Animal
{
    public function cry(): void
    {
        // TODO: ここで親クラスのcry()を呼び出す
        echo "ニャーと鳴いた" . PHP_EOL;
    }
}

$cat = new Cat();
$cat->cry();
`,
      solution: `<?php

class Animal
{
    public function cry(): void
    {
        echo "何かの鳴き声がする" . PHP_EOL;
    }
}

class Cat extends Animal
{
    public function cry(): void
    {
        // parent::で親クラスの元の処理を呼んでから追加の処理を行う
        parent::cry();
        echo "ニャーと鳴いた" . PHP_EOL;
    }
}

$cat = new Cat();
$cat->cry();
`,
      hints: [
        `オーバーライドしたメソッドの中から親の元の処理を呼ぶには、parent::という特別な書き方を使います。`,
        `echoの前の行にparent::cry();を追加すると、親の出力→子の出力の順になります。`
      ],
      expectedOutput: "ニャーと鳴いた"
    },
    {
      id: 83,
      title: "抽象クラス（abstract）",
      explanation: `<p><strong>抽象クラス</strong>は「それ自体はnewできず、継承されることを前提としたクラス」です。クラス宣言に<code>abstract</code>を付けます。抽象クラスの中には、<strong>中身（処理）を持たない抽象メソッド</strong>を宣言できます。</p>
<pre><code>abstract class Notification
{
    // 抽象メソッド：シグネチャ（名前と引数と戻り値）だけを宣言する
    abstract public function send(string $message): void;

    // 通常のメソッドも持てる。抽象メソッドを呼び出す設計にできる
    public function sendAll(array $messages): void
    {
        foreach ($messages as $message) {
            $this-&gt;send($message);
        }
    }
}</code></pre>
<p>抽象クラスを継承した子クラスは、<strong>すべての抽象メソッドを必ず実装しなければなりません</strong>。実装し忘れると致命的エラーになるため、「この種類のクラスにはこのメソッドが必ずある」ことを言語レベルで保証できます。</p>
<ul>
<li><code>new Notification()</code>のように抽象クラスを直接インスタンス化するとエラーになる</li>
<li>共通処理（上の例では<code>sendAll()</code>）は抽象クラス側に書き、差分（<code>send()</code>）だけを子クラスに書かせる</li>
</ul>
<p>この「共通の流れは親に書き、変わる部分だけ子に任せる」パターンは<strong>テンプレートメソッドパターン</strong>と呼ばれ、実務のフレームワークでも頻出する設計です。</p>`,
      task: `MailNotificationクラスが抽象メソッド<code>send()</code>を実装していないためエラーになります。「メール送信：メッセージ」と出力する<code>send()</code>を実装してください。`,
      code: `<?php

abstract class Notification
{
    abstract public function send(string $message): void;

    public function sendAll(array $messages): void
    {
        foreach ($messages as $message) {
            $this->send($message);
        }
    }
}

class MailNotification extends Notification
{
    // TODO: 抽象メソッドsend()を実装する
    //       「メール送信：」に続けてメッセージを出力すること
}

$mail = new MailNotification();
$mail->sendAll(["こんにちは", "さようなら"]);
`,
      solution: `<?php

abstract class Notification
{
    abstract public function send(string $message): void;

    public function sendAll(array $messages): void
    {
        foreach ($messages as $message) {
            $this->send($message);
        }
    }
}

class MailNotification extends Notification
{
    // 抽象メソッドは子クラスで必ず実装する（シグネチャを一致させる）
    public function send(string $message): void
    {
        echo "メール送信：" . $message . PHP_EOL;
    }
}

$mail = new MailNotification();
$mail->sendAll(["こんにちは", "さようなら"]);
`,
      hints: [
        `抽象メソッドの実装は、abstractを外して同じシグネチャ（引数と戻り値の型）のメソッドを子クラスに書きます。`,
        `public function send(string $message): void の中で「メール送信：」とメッセージを連結してechoします。`
      ],
      expectedOutput: "メール送信：こんにちは"
    },
    {
      id: 84,
      title: "インターフェース（interface）",
      explanation: `<p><strong>インターフェース</strong>は「このメソッドを必ず持っています」という<strong>約束（契約）だけ</strong>を定義する仕組みです。<code>interface</code>で宣言し、クラスは<code>implements</code>でそれを実装します。インターフェース自体は処理を一切持たず、メソッドのシグネチャだけを並べます。</p>
<pre><code>interface Greeter
{
    public function greet(): string; // 中身は書かない
}

class JapaneseGreeter implements Greeter
{
    public function greet(): string
    {
        return "こんにちは";
    }
}

// 引数の型をインターフェースにすると、実装クラスなら何でも渡せる
function showGreeting(Greeter $greeter): void
{
    echo $greeter-&gt;greet();
}</code></pre>
<p>インターフェースの最大の価値は、<strong>型宣言に使えること</strong>です。上の<code>showGreeting()</code>は「Greeterを実装したクラスなら何でも受け取れる」ため、呼び出す側と実装の詳細を切り離せます。抽象クラスとの違いを整理しましょう。</p>
<table>
<tr><th>項目</th><th>抽象クラス</th><th>インターフェース</th></tr>
<tr><td>処理を持つメソッド</td><td>持てる</td><td>持てない</td></tr>
<tr><td>プロパティ</td><td>持てる</td><td>持てない（定数は可）</td></tr>
<tr><td>多重利用</td><td>継承は1つだけ</td><td>いくつでも実装できる</td></tr>
<tr><td>関係の意味</td><td>〜の一種である</td><td>〜ができる</td></tr>
</table>
<p>「共通の実装を配りたいなら抽象クラス、できることの約束だけ決めたいならインターフェース」と覚えておくと使い分けやすくなります。</p>`,
      task: `EnglishGreeterクラスがGreeterインターフェースの<code>greet()</code>を実装していません。「Hello」を返す<code>greet()</code>を実装してください。`,
      code: `<?php

interface Greeter
{
    public function greet(): string;
}

class JapaneseGreeter implements Greeter
{
    public function greet(): string
    {
        return "こんにちは";
    }
}

class EnglishGreeter implements Greeter
{
    // TODO: greet()を実装して"Hello"を返す
}

function showGreeting(Greeter $greeter): void
{
    echo $greeter->greet() . PHP_EOL;
}

showGreeting(new JapaneseGreeter());
showGreeting(new EnglishGreeter());
`,
      solution: `<?php

interface Greeter
{
    public function greet(): string;
}

class JapaneseGreeter implements Greeter
{
    public function greet(): string
    {
        return "こんにちは";
    }
}

class EnglishGreeter implements Greeter
{
    // インターフェースで約束したメソッドはすべて実装する必要がある
    public function greet(): string
    {
        return "Hello";
    }
}

// 型をGreeterにすることで、どちらの実装クラスも受け取れる
function showGreeting(Greeter $greeter): void
{
    echo $greeter->greet() . PHP_EOL;
}

showGreeting(new JapaneseGreeter());
showGreeting(new EnglishGreeter());
`,
      hints: [
        `implementsしたクラスは、インターフェースに宣言されたメソッドをすべて同じシグネチャで実装する義務があります。`,
        `JapaneseGreeterのgreet()を参考に、戻り値だけ"Hello"に変えたメソッドを書きましょう。`
      ],
      expectedOutput: "Hello"
    },
    {
      id: 85,
      title: "複数インターフェースの実装",
      explanation: `<p>継承（extends）は親クラスを1つしか指定できませんが、インターフェースは<strong>カンマ区切りでいくつでも実装できます</strong>。これがインターフェースの大きな強みです。</p>
<pre><code>interface Playable
{
    public function play(): void;
}

interface Stoppable
{
    public function stop(): void;
}

// 「再生できる」かつ「停止できる」クラス
class MusicPlayer implements Playable, Stoppable
{
    public function play(): void { /* 実装 */ }
    public function stop(): void { /* 実装 */ }
}</code></pre>
<p>複数実装した場合、<strong>すべてのインターフェースのすべてのメソッド</strong>を実装する必要があります。また、インターフェース同士も<code>interface AB extends A, B</code>のように継承でき、こちらは複数継承が許されています。</p>
<p>設計のコツは、<strong>インターフェースを小さく分けること</strong>です。「再生も停止も録音も全部入り」の巨大なインターフェースを1つ作るより、<code>Playable</code>と<code>Stoppable</code>のように機能単位で分けたほうが、「再生だけできるクラス」も無理なく作れます。これはSOLID原則の1つ「インターフェース分離の原則」として知られる考え方で、使わないメソッドの実装を強制されない設計につながります。</p>
<p>なお、あるクラスがどのインターフェースを実装しているかは、後のステップで学ぶ<code>instanceof</code>で確認できます。</p>`,
      task: `MusicPlayerクラスが<code>Playable</code>しか実装していません。<code>Stoppable</code>も実装対象に加え、「（曲名）を停止しました」と出力する<code>stop()</code>を実装してください。`,
      code: `<?php

interface Playable
{
    public function play(): void;
}

interface Stoppable
{
    public function stop(): void;
}

// TODO: Stoppableも実装するように修正する
class MusicPlayer implements Playable
{
    private string $song;

    public function __construct(string $song)
    {
        $this->song = $song;
    }

    public function play(): void
    {
        echo $this->song . "を再生します" . PHP_EOL;
    }

    // TODO: stop()を実装して「（曲名）を停止しました」と出力する
}

$player = new MusicPlayer("春の歌");
$player->play();
$player->stop();
`,
      solution: `<?php

interface Playable
{
    public function play(): void;
}

interface Stoppable
{
    public function stop(): void;
}

// インターフェースはカンマ区切りで複数実装できる
class MusicPlayer implements Playable, Stoppable
{
    private string $song;

    public function __construct(string $song)
    {
        $this->song = $song;
    }

    public function play(): void
    {
        echo $this->song . "を再生します" . PHP_EOL;
    }

    public function stop(): void
    {
        echo $this->song . "を停止しました" . PHP_EOL;
    }
}

$player = new MusicPlayer("春の歌");
$player->play();
$player->stop();
`,
      hints: [
        `複数のインターフェースはimplements Playable, Stoppableのようにカンマで並べます。`,
        `stop()の中身はplay()とほぼ同じ形で、メッセージを「を停止しました」に変えるだけです。`
      ],
      expectedOutput: "春の歌を停止しました"
    },
    {
      id: 86,
      title: "trait（トレイト）",
      explanation: `<p><strong>trait</strong>（トレイト）は、<strong>メソッドの実装をクラスの垣根を越えて再利用する</strong>仕組みです。PHPの継承は1つの親しか持てないため、「継承関係にない複数のクラスで同じ処理を使い回したい」場面で困ります。traitはこの問題を解決します。</p>
<pre><code>trait Logger
{
    public function log(string $message): void
    {
        echo "[LOG] " . $message;
    }
}

class UserService
{
    use Logger; // traitのメソッドを取り込む

    public function register(string $name): void
    {
        $this-&gt;log($name . "を登録しました"); // 自分のメソッドのように呼べる
    }
}</code></pre>
<p><code>use トレイト名;</code>と書くだけで、traitに定義したメソッドやプロパティがそのクラスに<strong>コピーされたかのように</strong>使えます。UserServiceとOrderServiceのように継承関係のないクラス同士でも、同じログ機能を共有できます。</p>
<table>
<tr><th>仕組み</th><th>役割</th></tr>
<tr><td>継承（extends）</td><td>親子関係を作り、性質と実装を引き継ぐ</td></tr>
<tr><td>インターフェース</td><td>できることの約束だけを決める（実装なし）</td></tr>
<tr><td>trait</td><td>実装の部品を水平に配る（関係性は作らない）</td></tr>
</table>
<p>traitは複数<code>use</code>でき、同名メソッドが衝突した場合は<code>insteadof</code>や<code>as</code>で解決できます。便利な反面、多用するとどこで定義されたメソッドか追いにくくなるため、「横断的に使う小さな機能」に絞って使うのが実務での定石です。</p>`,
      task: `Loggerトレイトが用意されていますが、OrderServiceクラスがまだ<code>use</code>していません。<code>use Logger;</code>を追加して、2つのサービスの両方でログが出力されるようにしてください。`,
      code: `<?php

trait Logger
{
    public function log(string $message): void
    {
        echo "[LOG] " . $message . PHP_EOL;
    }
}

class UserService
{
    use Logger;

    public function register(string $name): void
    {
        $this->log($name . "を登録しました");
    }
}

class OrderService
{
    // TODO: Loggerトレイトをuseする

    public function order(string $item): void
    {
        $this->log($item . "を注文しました");
    }
}

$userService = new UserService();
$userService->register("佐藤");

$orderService = new OrderService();
$orderService->order("りんご");
`,
      solution: `<?php

trait Logger
{
    public function log(string $message): void
    {
        echo "[LOG] " . $message . PHP_EOL;
    }
}

class UserService
{
    use Logger;

    public function register(string $name): void
    {
        $this->log($name . "を登録しました");
    }
}

class OrderService
{
    // 継承関係のないクラスでも、traitで同じ実装を共有できる
    use Logger;

    public function order(string $item): void
    {
        $this->log($item . "を注文しました");
    }
}

$userService = new UserService();
$userService->register("佐藤");

$orderService = new OrderService();
$orderService->order("りんご");
`,
      hints: [
        `traitを取り込むには、クラス定義の中（メソッドの外）にuse トレイト名;と書きます。`,
        `UserServiceの書き方をそのまま参考に、OrderServiceのクラス本体の先頭にuse Logger;を追加しましょう。`
      ],
      expectedOutput: "[LOG] りんごを注文しました"
    },
    {
      id: 87,
      title: "finalキーワード",
      explanation: `<p><code>final</code>は「これ以上の拡張を禁止する」キーワードです。使い方は2種類あります。</p>
<ul>
<li><strong>finalクラス</strong>：<code>final class A</code>と宣言すると、そのクラスを継承（extends）できなくなる</li>
<li><strong>finalメソッド</strong>：<code>final public function f()</code>と宣言すると、子クラスでオーバーライドできなくなる</li>
</ul>
<pre><code>class PaymentBase
{
    // 決済の中核処理。子クラスに書き換えさせない
    final public function pay(int $amount): void
    {
        echo $amount . "円を決済しました";
    }
}

final class CreditCardPayment extends PaymentBase
{
    // pay()をオーバーライドしようとすると致命的エラーになる
}</code></pre>
<p>禁止に違反すると「Cannot override final method」「Cannot extend final class」という致命的エラーになります。</p>
<p>なぜわざわざ禁止するのでしょうか。継承はどこからでもクラスの振る舞いを書き換えられる強力な仕組みですが、その分「子クラスが親の前提を壊してしまう」リスクがあります。決済金額の計算のように<strong>絶対に書き換えられては困る処理</strong>をfinalにしておけば、意図しない上書きをコンパイル段階で防げます。実務では「継承よりコンポジション（部品として持たせる）を優先し、継承させる予定のないクラスはfinalにしておく」という方針を採るチームも多く、後から継承を許すのは簡単でも、すでに継承されているクラスをfinalに変えるのは難しいためです。</p>`,
      task: `CreditCardPaymentクラスがfinalメソッド<code>pay()</code>をオーバーライドしようとして致命的エラーになっています。オーバーライドをやめて、割引処理は<code>payWithPoint()</code>という別メソッドとして親のpay()を呼ぶ形に修正してください。`,
      code: `<?php

class PaymentBase
{
    final public function pay(int $amount): void
    {
        echo $amount . "円を決済しました" . PHP_EOL;
    }
}

final class CreditCardPayment extends PaymentBase
{
    // TODO: finalメソッドはオーバーライドできない。
    //       このメソッドをpayWithPoint(int $amount, int $point)に変更し、
    //       中で$this->pay($amount - $point)を呼ぶ形に修正する
    public function pay(int $amount): void
    {
        echo ($amount - 300) . "円を決済しました" . PHP_EOL;
    }
}

$payment = new CreditCardPayment();
$payment->pay(1000);
$payment->payWithPoint(1000, 300);
`,
      solution: `<?php

class PaymentBase
{
    // finalを付けたメソッドは子クラスでオーバーライドできない
    final public function pay(int $amount): void
    {
        echo $amount . "円を決済しました" . PHP_EOL;
    }
}

final class CreditCardPayment extends PaymentBase
{
    // オーバーライドではなく、別名メソッドから親の処理を利用する
    public function payWithPoint(int $amount, int $point): void
    {
        $this->pay($amount - $point);
    }
}

$payment = new CreditCardPayment();
$payment->pay(1000);
$payment->payWithPoint(1000, 300);
`,
      hints: [
        `finalメソッドと同名のメソッドを子クラスに定義することはできません。別の名前のメソッドにする必要があります。`,
        `payWithPoint()の中では$this->pay($amount - $point);のように、親から引き継いだpay()を呼び出せます。`
      ],
      expectedOutput: "700円を決済しました"
    },
    {
      id: 88,
      title: "instanceofと型による分岐",
      explanation: `<p><code>instanceof</code>は、あるオブジェクトが<strong>特定のクラス（またはその子クラス、実装インターフェース）のインスタンスかどうか</strong>を判定する演算子です。結果はboolで返ります。</p>
<pre><code>$dog = new Dog();

var_dump($dog instanceof Dog);    // bool(true)
var_dump($dog instanceof Animal); // 親クラスでもtrue
var_dump($dog instanceof Cat);    // bool(false)</code></pre>
<p>ポイントは、<strong>継承関係と実装関係をたどって判定してくれる</strong>ことです。DogがAnimalを継承していれば<code>$dog instanceof Animal</code>もtrueになります。この性質のため、クラス名の文字列比較（<code>get_class($dog) === "Dog"</code>など）よりもinstanceofのほうが柔軟で安全です。</p>
<pre><code>function makeSound(object $animal): void
{
    if ($animal instanceof Dog) {
        echo "犬の鳴き声：" . $animal-&gt;bark();
    } elseif ($animal instanceof Cat) {
        echo "猫の鳴き声：" . $animal-&gt;meow();
    } else {
        echo "正体不明の動物です";
    }
}</code></pre>
<p>型で分岐すれば、それぞれのクラス固有のメソッドを安全に呼び分けられます。ただし設計の観点では、instanceofの分岐が増えすぎるのは「共通のインターフェースを定義してポリモーフィズム（各クラスに同名メソッドを実装させて呼び分けを不要にすること）で解決すべき」サインでもあります。外部から受け取ったobject型を検査する入口処理など、要所で使うのが実務でのバランスです。</p>`,
      task: `<code>makeSound()</code>のTODO部分を実装し、Dogなら<code>bark()</code>、Catなら<code>meow()</code>を呼び分けるようにしてください。どちらでもなければ「正体不明の動物です」と出力します。`,
      code: `<?php

class Dog
{
    public function bark(): string
    {
        return "ワン！";
    }
}

class Cat
{
    public function meow(): string
    {
        return "ニャー";
    }
}

function makeSound(object $animal): void
{
    // TODO: instanceofで型を判定して呼び分ける
    //       Dogなら「犬の鳴き声：」とbark()を、
    //       Catなら「猫の鳴き声：」とmeow()を出力する。
    //       どちらでもなければ「正体不明の動物です」と出力する
    echo "正体不明の動物です" . PHP_EOL;
}

$animals = [new Dog(), new Cat(), new Dog()];
foreach ($animals as $animal) {
    makeSound($animal);
}
`,
      solution: `<?php

class Dog
{
    public function bark(): string
    {
        return "ワン！";
    }
}

class Cat
{
    public function meow(): string
    {
        return "ニャー";
    }
}

function makeSound(object $animal): void
{
    // instanceofで型を確認してから固有メソッドを呼ぶと安全
    if ($animal instanceof Dog) {
        echo "犬の鳴き声：" . $animal->bark() . PHP_EOL;
    } elseif ($animal instanceof Cat) {
        echo "猫の鳴き声：" . $animal->meow() . PHP_EOL;
    } else {
        echo "正体不明の動物です" . PHP_EOL;
    }
}

$animals = [new Dog(), new Cat(), new Dog()];
foreach ($animals as $animal) {
    makeSound($animal);
}
`,
      hints: [
        `instanceofは「$オブジェクト instanceof クラス名」の形で書き、if文の条件にそのまま使えます。`,
        `if ($animal instanceof Dog) { ... } elseif ($animal instanceof Cat) { ... } else { ... }の3分岐を作りましょう。`
      ],
      expectedOutput: "猫の鳴き声：ニャー"
    },
    {
      id: 89,
      title: "__toStringマジックメソッド",
      explanation: `<p>オブジェクトを<code>echo</code>したり文字列と連結したりすると、通常は「Object of class ... could not be converted to string」というエラーになります。そこで使うのが<strong>__toString()</strong>です。これは「オブジェクトが文字列として扱われた瞬間に自動で呼ばれる」特別なメソッドで、このように2つのアンダースコアで始まるメソッドは<strong>マジックメソッド</strong>と呼ばれます（第8章の<code>__construct</code>も仲間です）。</p>
<pre><code>class Money
{
    private int $amount;

    public function __construct(int $amount)
    {
        $this-&gt;amount = $amount;
    }

    public function __toString(): string
    {
        return number_format($this-&gt;amount) . "円";
    }
}

$price = new Money(148000);
echo "価格：" . $price; // 価格：148,000円（自動で__toStringが呼ばれる）</code></pre>
<p>ポイントを整理します。</p>
<ul>
<li>戻り値は<strong>必ずstring</strong>を返す（他の型を返すとTypeErrorになる）</li>
<li>echo・文字列連結・sprintfの<code>%s</code>などで自動的に呼ばれる</li>
<li>PHP 8以降、__toStringを定義したクラスは<code>Stringable</code>インターフェースを自動的に実装したことになる（<code>string|Stringable</code>のような型宣言で受け取れる）</li>
</ul>
<p>金額・日付・座標のような「値を表すクラス」に__toStringを実装しておくと、デバッグ出力やログがぐっと読みやすくなります。ただし、複雑な整形はview側の責務にするなど、あくまで「そのオブジェクトの自然な文字列表現」にとどめるのが設計上のコツです。</p>`,
      task: `Moneyオブジェクトをechoしようとしてエラーになっています。「金額 通貨」形式（例：<code>148,000 円</code>）の文字列を返す<code>__toString()</code>をMoneyクラスに追加してください。金額は<code>number_format()</code>で3桁区切りにします。`,
      code: `<?php

class Money
{
    private int $amount;
    private string $currency;

    public function __construct(int $amount, string $currency)
    {
        $this->amount = $amount;
        $this->currency = $currency;
    }

    // TODO: __toString()を追加して
    //       「number_formatした金額 + 半角スペース + 通貨」の文字列を返す
}

$price = new Money(148000, "円");
echo "価格：" . $price . PHP_EOL;
`,
      solution: `<?php

class Money
{
    private int $amount;
    private string $currency;

    public function __construct(int $amount, string $currency)
    {
        $this->amount = $amount;
        $this->currency = $currency;
    }

    // 文字列として扱われたときに自動で呼ばれるマジックメソッド
    public function __toString(): string
    {
        return number_format($this->amount) . " " . $this->currency;
    }
}

$price = new Money(148000, "円");
echo "価格：" . $price . PHP_EOL;
`,
      hints: [
        `__toString()はpublicで宣言し、戻り値の型はstringにします。オブジェクトが文字列文脈に置かれると自動で呼ばれます。`,
        `return number_format($this->amount) . " " . $this->currency; のように連結して返しましょう。`
      ],
      expectedOutput: "価格：148,000 円"
    },
    {
      id: 90,
      title: "総合演習：図形クラス階層で面積計算",
      explanation: `<p>この章の総仕上げとして、<strong>図形の面積計算</strong>を題材にクラス階層を設計します。使う知識は次のとおりです。</p>
<ul>
<li><strong>抽象クラス</strong>：Shapeを抽象クラスにし、<code>name()</code>と<code>area()</code>を抽象メソッドとして宣言する</li>
<li><strong>継承と実装</strong>：Rectangle（長方形）とCircle（円）がShapeを継承し、それぞれの面積計算を実装する</li>
<li><strong>ポリモーフィズム</strong>：Shape型の配列としてまとめて扱い、同じ<code>area()</code>呼び出しで図形ごとに違う計算が動く</li>
</ul>
<pre><code>abstract class Shape
{
    abstract public function name(): string;
    abstract public function area(): float;
}

$shapes = [new Rectangle(4, 5), new Circle(3)];
foreach ($shapes as $shape) {
    // どの図形かを気にせず、同じ呼び方で面積が求まる
    printf("%sの面積：%.2f" . PHP_EOL, $shape-&gt;name(), $shape-&gt;area());
}</code></pre>
<p>面積の公式は、長方形が「幅×高さ」、円が「半径×半径×円周率」です。円周率はPHP組み込みの定数<code>M_PI</code>（約3.14159）が使えます。出力の整形には<code>printf()</code>の<code>%.2f</code>（小数点以下2桁の浮動小数点数）を使います。</p>
<p>注目してほしいのは、foreachのループが<strong>図形の種類を一切知らない</strong>ことです。新しくTriangleクラスを追加しても、ループ側のコードは1文字も変更する必要がありません。「変更に閉じて拡張に開いている」この形は開放閉鎖原則と呼ばれ、抽象クラスとポリモーフィズムがもたらす実務上の最大の恩恵です。</p>`,
      task: `Circleクラスの<code>name()</code>と<code>area()</code>を実装し、さらにforeachループで全図形の面積合計<code>$total</code>を計算して「合計面積：64.27」と出力されるように完成させてください。`,
      code: `<?php

abstract class Shape
{
    abstract public function name(): string;

    abstract public function area(): float;
}

class Rectangle extends Shape
{
    private float $width;
    private float $height;

    public function __construct(float $width, float $height)
    {
        $this->width = $width;
        $this->height = $height;
    }

    public function name(): string
    {
        return "長方形";
    }

    public function area(): float
    {
        return $this->width * $this->height;
    }
}

class Circle extends Shape
{
    private float $radius;

    public function __construct(float $radius)
    {
        $this->radius = $radius;
    }

    // TODO: name()を実装して"円"を返す

    // TODO: area()を実装する（半径×半径×M_PI）
}

$shapes = [
    new Rectangle(4, 5),
    new Circle(3),
    new Rectangle(2, 8),
];

$total = 0.0;
foreach ($shapes as $shape) {
    printf("%sの面積：%.2f" . PHP_EOL, $shape->name(), $shape->area());
    // TODO: $totalに面積を加算する
}
printf("合計面積：%.2f" . PHP_EOL, $total);
`,
      solution: `<?php

abstract class Shape
{
    abstract public function name(): string;

    abstract public function area(): float;
}

class Rectangle extends Shape
{
    private float $width;
    private float $height;

    public function __construct(float $width, float $height)
    {
        $this->width = $width;
        $this->height = $height;
    }

    public function name(): string
    {
        return "長方形";
    }

    public function area(): float
    {
        return $this->width * $this->height;
    }
}

class Circle extends Shape
{
    private float $radius;

    public function __construct(float $radius)
    {
        $this->radius = $radius;
    }

    public function name(): string
    {
        return "円";
    }

    public function area(): float
    {
        // M_PIは円周率の組み込み定数
        return $this->radius * $this->radius * M_PI;
    }
}

$shapes = [
    new Rectangle(4, 5),
    new Circle(3),
    new Rectangle(2, 8),
];

// Shape型としてまとめて扱えるので、図形の種類を意識せずに合計できる
$total = 0.0;
foreach ($shapes as $shape) {
    printf("%sの面積：%.2f" . PHP_EOL, $shape->name(), $shape->area());
    $total += $shape->area();
}
printf("合計面積：%.2f" . PHP_EOL, $total);
`,
      hints: [
        `Rectangleクラスの実装をお手本に、Circleでも同じシグネチャでname()とarea()を実装します。円の面積は半径×半径×M_PIです。`,
        `合計はforeachの中で$total += $shape->area();と加算します。`,
        `4×5=20、円は約28.27、2×8=16なので、合計は約64.27になれば正解です。`
      ],
      expectedOutput: "合計面積：64.27"
    }
  ]
});
