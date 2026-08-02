// 第17章：マジックメソッドとオブジェクト操作
registerChapter({
  number: 17,
  title: "マジックメソッドとオブジェクト操作",
  description: "__toStringや__getなどのマジックメソッドと、clone・オブジェクト比較・同一性の判定を学び、オブジェクトを自在に操作できるようになります。",
  steps: [
    {
      id: 161,
      title: "__toStringの実践",
      explanation: `<p>マジックメソッドとは、PHPが特定の場面で自動的に呼び出す特別なメソッドのことです。名前がすべてアンダースコア2つ（__）で始まるのが特徴です。この章では代表的なマジックメソッドを順番に学びます。</p>
<p>最初は<code>__toString</code>です。オブジェクトを<code>echo</code>や文字列連結など「文字列として扱おうとした瞬間」に自動で呼ばれ、戻り値の文字列が使われます。定義していないオブジェクトを<code>echo</code>すると<code>Error: Object of class ... could not be converted to string</code>という致命的エラーになります。</p>
<pre><code>class Money
{
    public function __construct(private int $amount)
    {
    }

    public function __toString(): string
    {
        return number_format($this-&gt;amount) . '円';
    }
}

$price = new Money(1500);
echo $price;            // 1,500円
echo '合計: ' . $price; // 連結でも自動で呼ばれる</code></pre>
<p>ポイントは次の3つです。</p>
<ul>
<li>戻り値の型は必ず<code>string</code>にする（他の型を返すとTypeError）</li>
<li>ログ出力やデバッグ表示など「人が読む表現」を返す用途に向く</li>
<li>金額や日付のように「表示形式が決まっているデータ」と相性がよい</li>
</ul>
<p><code>number_format</code>は数値を3桁区切りの文字列にする組み込み関数です。表示用の整形を<code>__toString</code>に集約すると、呼び出し側のコードがすっきりします。</p>`,
      task: `初期コードは<code>__toString</code>がないため実行するとErrorになります。<code>Money</code>クラスに<code>__toString</code>メソッドを追加し、<code>number_format</code>で3桁区切りにした金額に「円」を付けて返してください。`,
      code: `<?php
// このままではecho時にErrorになる。__toStringを追加して直す
class Money
{
    public function __construct(private int $amount)
    {
    }

    // TODO: ここに__toStringメソッドを追加する
    // 戻り値はnumber_format($this->amount) . '円' とする
}

$price = new Money(1500);
echo $price . PHP_EOL;
echo '合計: ' . $price . PHP_EOL;
`,
      solution: `<?php
class Money
{
    public function __construct(private int $amount)
    {
    }

    public function __toString(): string
    {
        return number_format($this->amount) . '円';
    }
}

$price = new Money(1500);
echo $price . PHP_EOL;
echo '合計: ' . $price . PHP_EOL;
`,
      hints: [
        `オブジェクトをechoしたときに呼ばれるのが__toStringです。戻り値の型はstringと宣言しましょう。`,
        `public function __toString(): string { return number_format($this->amount) . '円'; } の形になります。`
      ],
      expectedOutput: "合計: 1,500円"
    },
    {
      id: 162,
      title: "__getと__set（動的プロパティの制御）",
      explanation: `<p><code>__get</code>と<code>__set</code>は、存在しない（またはアクセスできない）プロパティを読み書きしたときに呼ばれるマジックメソッドです。PHP 8.2以降、クラスに宣言していないプロパティへの代入（動的プロパティ）は非推奨になったため、柔軟なプロパティ操作が必要な場合はこの2つで明示的に制御します。</p>
<table>
<tr><th>メソッド</th><th>呼ばれるタイミング</th><th>シグネチャ</th></tr>
<tr><td><code>__get</code></td><td>未定義プロパティの読み取り</td><td><code>__get(string $name): mixed</code></td></tr>
<tr><td><code>__set</code></td><td>未定義プロパティへの代入</td><td><code>__set(string $name, mixed $value): void</code></td></tr>
<tr><td><code>__isset</code></td><td><code>isset()</code>や<code>empty()</code>の判定時</td><td><code>__isset(string $name): bool</code></td></tr>
</table>
<p>よくある実装は、内部の配列にまとめて保存する方式です。</p>
<pre><code>class Config
{
    private array $data = [];

    public function __set(string $name, mixed $value): void
    {
        $this-&gt;data[$name] = $value;
    }

    public function __get(string $name): mixed
    {
        return $this-&gt;data[$name] ?? null;
    }
}

$config = new Config();
$config-&gt;siteName = 'PHP道場'; // __setが呼ばれる
echo $config-&gt;siteName;        // __getが呼ばれる</code></pre>
<p>注意点として、<code>isset($config-&gt;timeout)</code>のような判定には<code>__isset</code>も実装しないと常にfalseになります。3つセットで実装するのが定石です。null合体演算子（左がnullのとき右を返す<code>??</code>）を使うと、未設定キーへのWarningを避けられます。</p>`,
      task: `<code>Config</code>クラスの<code>__get</code>・<code>__set</code>・<code>__isset</code>のTODO部分を実装し、内部配列<code>$data</code>への保存・取得・存在判定ができるようにしてください。`,
      code: `<?php
class Config
{
    private array $data = [];

    public function __set(string $name, mixed $value): void
    {
        // TODO: $this->data に $name をキーとして $value を保存する
    }

    public function __get(string $name): mixed
    {
        // TODO: $this->data から $name の値を返す（無ければnull）
        return null;
    }

    public function __isset(string $name): bool
    {
        // TODO: $this->data に $name が設定されているか返す
        return false;
    }
}

$config = new Config();
$config->siteName = 'PHP道場';
$config->debug = true;

echo 'siteName: ' . $config->siteName . PHP_EOL;
echo 'debugは' . ($config->debug ? '有効' : '無効') . PHP_EOL;
echo 'timeoutの設定: ' . (isset($config->timeout) ? 'あり' : 'なし') . PHP_EOL;
`,
      solution: `<?php
class Config
{
    private array $data = [];

    public function __set(string $name, mixed $value): void
    {
        $this->data[$name] = $value;
    }

    public function __get(string $name): mixed
    {
        return $this->data[$name] ?? null;
    }

    public function __isset(string $name): bool
    {
        return isset($this->data[$name]);
    }
}

$config = new Config();
$config->siteName = 'PHP道場';
$config->debug = true;

echo 'siteName: ' . $config->siteName . PHP_EOL;
echo 'debugは' . ($config->debug ? '有効' : '無効') . PHP_EOL;
echo 'timeoutの設定: ' . (isset($config->timeout) ? 'あり' : 'なし') . PHP_EOL;
`,
      hints: [
        `__setでは連想配列への代入、__getでは??を使った取り出しを書きます。`,
        `__getは return $this->data[$name] ?? null; とすると未定義キーでもWarningが出ません。`,
        `__issetは return isset($this->data[$name]); の1行で書けます。`
      ],
      expectedOutput: "siteName: PHP道場"
    },
    {
      id: 163,
      title: "__callと__callStatic",
      explanation: `<p><code>__call</code>は「存在しないインスタンスメソッド」を呼んだとき、<code>__callStatic</code>は「存在しない静的メソッド」を呼んだときに実行されるマジックメソッドです。どちらも第1引数にメソッド名、第2引数に渡された引数の配列を受け取ります。</p>
<pre><code>class Logger
{
    public function __call(string $name, array $args): void
    {
        echo '[' . strtoupper($name) . '] ' . $args[0] . PHP_EOL;
    }

    public static function __callStatic(string $name, array $args): void
    {
        echo '静的呼び出し ' . $name . PHP_EOL;
    }
}

$logger = new Logger();
$logger-&gt;info('起動');   // __callが呼ばれる
Logger::channel('mail');  // __callStaticが呼ばれる</code></pre>
<p>この仕組みは、<code>info</code>・<code>warning</code>・<code>error</code>のように「名前だけ違う同型のメソッド」を1か所で捌きたいときに便利です。Laravelのファサードもこのマジックメソッドでメソッド呼び出しを転送しています。</p>
<p>ただし注意点もあります。</p>
<ul>
<li>実在しないメソッド名でもエラーにならないため、タイポに気づきにくい</li>
<li>IDEの補完や静的解析が効きにくい</li>
<li>許可するメソッド名を<code>in_array</code>（配列に値が含まれるか調べる関数。第3引数trueで型も比較）で検査するなど、受け付ける名前を絞る実装が安全</li>
</ul>
<p>「何でも受け付ける」のではなく「想定した名前だけ処理し、それ以外は明示的に知らせる」設計を心がけましょう。</p>`,
      task: `<code>__call</code>のTODOを実装してください。メソッド名が<code>$levels</code>に含まれる場合は<code>[大文字レベル] メッセージ</code>の形式で出力し、含まれない場合は「未対応のメソッド: 名前」と出力します。`,
      code: `<?php
class Logger
{
    private array $levels = ['info', 'warning', 'error'];

    public function __call(string $name, array $args): void
    {
        // TODO: $nameが$this->levelsに含まれるなら
        //   '[' . strtoupper($name) . '] ' . $args[0] を出力してreturn
        // 含まれないなら '未対応のメソッド: ' . $name を出力
    }

    public static function __callStatic(string $name, array $args): void
    {
        echo '静的呼び出し ' . $name . ': ' . $args[0] . PHP_EOL;
    }
}

$logger = new Logger();
$logger->info('起動しました');
$logger->error('接続に失敗');
$logger->debug('詳細ログ');
Logger::channel('mail');
`,
      solution: `<?php
class Logger
{
    private array $levels = ['info', 'warning', 'error'];

    public function __call(string $name, array $args): void
    {
        if (in_array($name, $this->levels, true)) {
            echo '[' . strtoupper($name) . '] ' . $args[0] . PHP_EOL;
            return;
        }
        echo '未対応のメソッド: ' . $name . PHP_EOL;
    }

    public static function __callStatic(string $name, array $args): void
    {
        echo '静的呼び出し ' . $name . ': ' . $args[0] . PHP_EOL;
    }
}

$logger = new Logger();
$logger->info('起動しました');
$logger->error('接続に失敗');
$logger->debug('詳細ログ');
Logger::channel('mail');
`,
      hints: [
        `メソッド名の許可リスト判定にはin_array($name, $this->levels, true)を使います。`,
        `許可された場合はechoしたあとreturnで抜けると、else不要の読みやすいコードになります。`,
        `大文字化はstrtoupper($name)です。`
      ],
      expectedOutput: "[ERROR] 接続に失敗"
    },
    {
      id: 164,
      title: "__invoke（呼び出し可能オブジェクト）",
      explanation: `<p><code>__invoke</code>を定義すると、オブジェクトを関数のように<code>$obj(引数)</code>の形で呼び出せるようになります。このようなオブジェクトを「呼び出し可能（callable）オブジェクト」と呼びます。</p>
<pre><code>class Multiplier
{
    public function __construct(private int $factor)
    {
    }

    public function __invoke(int $value): int
    {
        return $value * $this-&gt;factor;
    }
}

$double = new Multiplier(2);
echo $double(10); // 20 と表示される</code></pre>
<p>クロージャ（無名関数）と似ていますが、次の違いがあります。</p>
<table>
<tr><th>観点</th><th>クロージャ</th><th>__invokeを持つクラス</th></tr>
<tr><td>状態の保持</td><td><code>use</code>で捕捉</td><td>プロパティとして明示的に保持</td></tr>
<tr><td>型宣言</td><td><code>Closure</code>型</td><td>クラス名で型指定できる</td></tr>
<tr><td>向く場面</td><td>短い一時的な処理</td><td>設定を持つ再利用可能な処理</td></tr>
</table>
<p><code>__invoke</code>を持つオブジェクトは<code>callable</code>として扱えるため、<code>array_map</code>のような高階関数（関数を引数に取る関数）にそのまま渡せます。<code>is_callable($obj)</code>で呼び出し可能かどうかを確認できます。</p>
<pre><code>$result = array_map($double, [1, 2, 3]); // [2, 4, 6]</code></pre>
<p>「倍率」のような設定値をコンストラクタで受け取り、呼び出し時のロジックを<code>__invoke</code>に書く、という分担が典型的な使い方です。</p>`,
      task: `<code>Multiplier</code>クラスの<code>calculate</code>メソッドを<code>__invoke</code>に書き換え、オブジェクトを<code>$double(10)</code>のように関数として呼び出せるようにしてください。`,
      code: `<?php
class Multiplier
{
    public function __construct(private int $factor)
    {
    }

    // TODO: このメソッド名を__invokeに変更して、
    // $double(10) のように呼び出せるようにする
    public function calculate(int $value): int
    {
        return $value * $this->factor;
    }
}

$double = new Multiplier(2);
$triple = new Multiplier(3);

echo $double(10) . PHP_EOL;
echo $triple(10) . PHP_EOL;

$numbers = [1, 2, 3];
$result = array_map($double, $numbers);
echo implode(', ', $result) . PHP_EOL;
echo is_callable($double) ? 'callableです' : 'callableではありません';
echo PHP_EOL;
`,
      solution: `<?php
class Multiplier
{
    public function __construct(private int $factor)
    {
    }

    public function __invoke(int $value): int
    {
        return $value * $this->factor;
    }
}

$double = new Multiplier(2);
$triple = new Multiplier(3);

echo $double(10) . PHP_EOL;
echo $triple(10) . PHP_EOL;

$numbers = [1, 2, 3];
$result = array_map($double, $numbers);
echo implode(', ', $result) . PHP_EOL;
echo is_callable($double) ? 'callableです' : 'callableではありません';
echo PHP_EOL;
`,
      hints: [
        `オブジェクトを関数のように呼ぶには、メソッド名をちょうど__invokeにします。`,
        `メソッド名を変えるだけで、引数や中身はそのままで動きます。`
      ],
      expectedOutput: "2, 4, 6"
    },
    {
      id: 165,
      title: "cloneと__clone（浅いコピーの罠）",
      explanation: `<p>オブジェクトの変数を別の変数に代入しても、コピーは作られません。両方の変数が同じオブジェクトを指すだけです。複製を作るには<code>clone</code>キーワードを使います。</p>
<pre><code>$copy = clone $original; // プロパティをコピーした新しいオブジェクト</code></pre>
<p>ただし<code>clone</code>が行うのは「浅いコピー（shallow copy）」です。プロパティが数値や文字列ならそのまま複製されますが、プロパティがオブジェクトの場合は<strong>参照だけがコピー</strong>され、中身のオブジェクトは元と共有されたままになります。</p>
<pre><code>$copy = clone $original;
$copy-&gt;profile-&gt;name = '佐藤';
// __cloneが無いと$original-&gt;profile-&gt;nameも'佐藤'になってしまう！</code></pre>
<p>これが「浅いコピーの罠」です。対策として、<code>clone</code>実行時に自動で呼ばれるマジックメソッド<code>__clone</code>の中で、内部のオブジェクトも複製します（深いコピー）。</p>
<pre><code>public function __clone(): void
{
    $this-&gt;profile = clone $this-&gt;profile;
}</code></pre>
<table>
<tr><th>用語</th><th>意味</th></tr>
<tr><td>浅いコピー</td><td>プロパティを1段だけコピー。内部オブジェクトは共有</td></tr>
<tr><td>深いコピー</td><td>内部オブジェクトまで再帰的に複製。共有されない</td></tr>
</table>
<p>複製後に片方だけ変更したいオブジェクトを内包しているクラスでは、<code>__clone</code>の実装を忘れないようにしましょう。</p>`,
      task: `初期コードを実行すると、コピー側を変更したのに元の<code>$original</code>の名前まで「佐藤」に変わってしまいます。<code>User</code>クラスに<code>__clone</code>を実装して、<code>profile</code>も複製されるように修正してください。`,
      code: `<?php
class Profile
{
    public function __construct(public string $name)
    {
    }
}

class User
{
    public function __construct(public string $id, public Profile $profile)
    {
    }

    // TODO: __cloneメソッドを追加して、
    // $this->profile も clone するようにする（深いコピー）
}

$original = new User('u1', new Profile('田中'));
$copy = clone $original;
$copy->profile->name = '佐藤';

// 期待：originalは田中のまま、copyだけ佐藤
echo 'original: ' . $original->profile->name . PHP_EOL;
echo 'copy: ' . $copy->profile->name . PHP_EOL;
`,
      solution: `<?php
class Profile
{
    public function __construct(public string $name)
    {
    }
}

class User
{
    public function __construct(public string $id, public Profile $profile)
    {
    }

    public function __clone(): void
    {
        // 参照の共有を断ち切るため、内部オブジェクトも複製する
        $this->profile = clone $this->profile;
    }
}

$original = new User('u1', new Profile('田中'));
$copy = clone $original;
$copy->profile->name = '佐藤';

echo 'original: ' . $original->profile->name . PHP_EOL;
echo 'copy: ' . $copy->profile->name . PHP_EOL;
`,
      hints: [
        `cloneしたときに自動で呼ばれる__cloneの中で、内部オブジェクトを複製し直します。`,
        `public function __clone(): void { $this->profile = clone $this->profile; } を追加します。`
      ],
      expectedOutput: "original: 田中"
    },
    {
      id: 166,
      title: "オブジェクトの比較（==と===）",
      explanation: `<p>オブジェクト同士の比較では、<code>==</code>と<code>===</code>の意味が大きく異なります。</p>
<table>
<tr><th>演算子</th><th>trueになる条件</th></tr>
<tr><td><code>==</code>（等価）</td><td>同じクラスで、すべてのプロパティの値が等しい</td></tr>
<tr><td><code>===</code>（同一）</td><td>まったく同じインスタンス（同じオブジェクト）を指している</td></tr>
</table>
<pre><code>$a = new Point(1, 2);
$b = new Point(1, 2); // 別のインスタンスだが値は同じ
$c = $a;              // 同じインスタンスを指す

var_dump($a == $b);  // bool(true)  値が同じ
var_dump($a === $b); // bool(false) 別インスタンス
var_dump($a === $c); // bool(true)  同一インスタンス</code></pre>
<p>「値が同じなら等しいとみなしたい」金額や座標のような値オブジェクトでは<code>==</code>が役立ちます。一方、「同じ実体かどうか」を確かめたいときは<code>===</code>を使います。前のステップで学んだとおり、代入（<code>$c = $a</code>）はコピーを作らないため、<code>$a === $c</code>はtrueになります。</p>
<p>注意点として、<code>==</code>はプロパティ同士も<code>==</code>で再帰的に比較します。プロパティにオブジェクトが入っていればそのプロパティ同士も比較されます。また、クラスが異なれば値がどれだけ似ていても<code>==</code>はfalseです。</p>
<p>実務では「うっかり<code>==</code>で同一性を判定してしまい、別インスタンスなのにtrueになる」バグが起こりがちです。どちらの意味で比較したいのかを常に意識しましょう。</p>`,
      task: `初期コードを実行して<code>==</code>と<code>===</code>の結果の違いを観察してください。その後、TODOの三項演算子2か所を完成させ、比較結果を日本語で出力してください。`,
      code: `<?php
class Point
{
    public function __construct(public int $x, public int $y)
    {
    }
}

$a = new Point(1, 2);
$b = new Point(1, 2); // 値は同じだが別インスタンス
$c = $a;              // 同じインスタンス

var_dump($a == $b);
var_dump($a === $b);
var_dump($a === $c);

// TODO: ($a == $b) がtrueなら '==は等しい'、falseなら '==は等しくない' を出力
echo '';
echo PHP_EOL;
// TODO: ($a === $b) がtrueなら '===は等しい'、falseなら '===は等しくない' を出力
echo '';
echo PHP_EOL;
`,
      solution: `<?php
class Point
{
    public function __construct(public int $x, public int $y)
    {
    }
}

$a = new Point(1, 2);
$b = new Point(1, 2); // 値は同じだが別インスタンス
$c = $a;              // 同じインスタンス

var_dump($a == $b);
var_dump($a === $b);
var_dump($a === $c);

echo ($a == $b) ? '==は等しい' : '==は等しくない';
echo PHP_EOL;
echo ($a === $b) ? '===は等しい' : '===は等しくない';
echo PHP_EOL;
`,
      hints: [
        `==は「クラスとプロパティ値が同じ」、===は「同じインスタンス」です。$aと$bは値が同じ別インスタンスです。`,
        `echo ($a == $b) ? '==は等しい' : '==は等しくない'; のように三項演算子で書けます。`
      ],
      expectedOutput: "===は等しくない"
    },
    {
      id: 167,
      title: "spl_object_idとオブジェクトの同一性",
      explanation: `<p><code>spl_object_id($obj)</code>は、オブジェクトごとに割り当てられた整数のID（識別番号）を返す組み込み関数です。同じインスタンスなら必ず同じIDになり、生存中の別インスタンスとは決して重複しません。前ステップの<code>===</code>による同一性判定を「番号で見える化」できる道具です。</p>
<pre><code>$a = new Session();
$b = new Session();
$c = $a;

spl_object_id($a) === spl_object_id($b); // false 別のオブジェクト
spl_object_id($a) === spl_object_id($c); // true  同じオブジェクト</code></pre>
<p>知っておくべき性質が2つあります。</p>
<ul>
<li>IDが一意なのは<strong>そのオブジェクトが生きている間だけ</strong>。オブジェクトが破棄される（どの変数からも参照されなくなる）と、そのIDは後から作られた別のオブジェクトに再利用されることがある</li>
<li>したがってIDを配列のキーなどに長期保存して「あのオブジェクトだ」と判定するのは危険</li>
</ul>
<p>似た関数に<code>spl_object_hash($obj)</code>（文字列のハッシュを返す）もありますが、現在は整数を返す<code>spl_object_id</code>が軽量で推奨されます。デバッグ時に「この2つの変数は同じ実体を指しているのか？」を確かめたいときや、オブジェクトをキーのように扱う仕組みを自作するときに役立ちます。実務ではまず<code>===</code>で判定し、IDが必要な場面でのみ使う、と覚えておきましょう。</p>`,
      task: `TODOの2か所で<code>spl_object_id</code>を使った比較式を完成させ、変数同士が同一のオブジェクトを指しているかを「同一」「別物」で出力してください。`,
      code: `<?php
class Session
{
}

$a = new Session();
$b = new Session();
$c = $a;

// TODO: spl_object_id($a)とspl_object_id($b)を===で比較し、
// trueなら'同一'、falseなら'別物'にする
echo 'aとbは' . '' . PHP_EOL;

// TODO: 同様に$aと$cを比較する
echo 'aとcは' . '' . PHP_EOL;

unset($b);
$d = new Session();
echo 'aとdは' . (spl_object_id($a) === spl_object_id($d) ? '同一' : '別物') . PHP_EOL;
`,
      solution: `<?php
class Session
{
}

$a = new Session();
$b = new Session();
$c = $a;

echo 'aとbは' . (spl_object_id($a) === spl_object_id($b) ? '同一' : '別物') . PHP_EOL;
echo 'aとcは' . (spl_object_id($a) === spl_object_id($c) ? '同一' : '別物') . PHP_EOL;

unset($b);
$d = new Session();
echo 'aとdは' . (spl_object_id($a) === spl_object_id($d) ? '同一' : '別物') . PHP_EOL;
`,
      hints: [
        `spl_object_idは同じインスタンスに対して必ず同じ整数を返します。$c = $a は代入なので同じ実体です。`,
        `(spl_object_id($a) === spl_object_id($b) ? '同一' : '別物') の形で3行目のコードを参考にしましょう。`
      ],
      expectedOutput: "aとcは同一"
    },
    {
      id: 168,
      title: "Stringableインターフェース",
      explanation: `<p><code>Stringable</code>は「<code>__toString</code>を持つ」ことを表す組み込みインターフェースです。PHP 8.0以降、<code>__toString</code>を定義したクラスは自動的に<code>Stringable</code>を実装した扱いになりますが、<code>implements Stringable</code>と明示的に書くことで意図がコードに残り、可読性が上がります。</p>
<pre><code>class Temperature implements Stringable
{
    public function __construct(private float $celsius)
    {
    }

    public function __toString(): string
    {
        return sprintf('%.1f度', $this-&gt;celsius);
    }
}</code></pre>
<p><code>sprintf</code>は書式指定で文字列を組み立てる関数で、<code>%.1f</code>は「小数点以下1桁の浮動小数点数」を意味します。</p>
<p><code>Stringable</code>の真価は型宣言との組み合わせにあります。ユニオン型（複数の型のどれかを受け取れる<code>|</code>区切りの型宣言）で<code>string|Stringable</code>と書くと、「普通の文字列」と「文字列化できるオブジェクト」の両方を安全に受け取れます。</p>
<pre><code>function printLabel(string|Stringable $value): void
{
    echo 'ラベル: ' . $value . PHP_EOL;
}

printLabel('通常の文字列');          // OK
printLabel(new Temperature(36.5));   // OK __toStringが使われる</code></pre>
<p>ログ関数やメッセージ整形関数など「最終的に文字列になれば何でもよい」APIを設計するとき、この型宣言はとても実用的です。<code>instanceof Stringable</code>で判定もできます。</p>`,
      task: `<code>Temperature</code>クラスを<code>Stringable</code>を実装するクラスとして完成させてください。<code>__toString</code>では<code>sprintf('%.1f度', ...)</code>の形式で摂氏温度を返します。`,
      code: `<?php
// TODO: implements Stringable を付ける
class Temperature
{
    public function __construct(private float $celsius)
    {
    }

    // TODO: __toStringを実装する
    // sprintf('%.1f度', $this->celsius) を返す
}

function printLabel(string|Stringable $value): void
{
    echo 'ラベル: ' . $value . PHP_EOL;
}

printLabel('通常の文字列');
printLabel(new Temperature(36.5));
echo (new Temperature(100.0) instanceof Stringable) ? 'Stringableです' : '違います';
echo PHP_EOL;
`,
      solution: `<?php
class Temperature implements Stringable
{
    public function __construct(private float $celsius)
    {
    }

    public function __toString(): string
    {
        return sprintf('%.1f度', $this->celsius);
    }
}

function printLabel(string|Stringable $value): void
{
    echo 'ラベル: ' . $value . PHP_EOL;
}

printLabel('通常の文字列');
printLabel(new Temperature(36.5));
echo (new Temperature(100.0) instanceof Stringable) ? 'Stringableです' : '違います';
echo PHP_EOL;
`,
      hints: [
        `クラス宣言を class Temperature implements Stringable に変更します。`,
        `__toStringの中身は return sprintf('%.1f度', $this->celsius); です。%.1fは小数1桁の書式です。`
      ],
      expectedOutput: "ラベル: 36.5度"
    },
    {
      id: 169,
      title: "マジックメソッドの使いどころと乱用の危険性",
      explanation: `<p>ここまで学んだマジックメソッドは強力ですが、乱用するとコードの品質を下げます。代表的な問題は次のとおりです。</p>
<ul>
<li><strong>タイポを検出できない</strong>：<code>__get</code>で何でも受けると、存在しないプロパティ名を書いてもエラーにならずnullが返り、バグが潜伏する</li>
<li><strong>IDE・静的解析が無力化する</strong>：補完も型チェックも効かなくなる</li>
<li><strong>処理の流れが追いにくい</strong>：どのコードが実際に動くのか、定義を探しても見つからない</li>
</ul>
<pre><code>class LooseUser
{
    private array $attrs = ['name' =&gt; '田中'];

    public function __get(string $name): mixed
    {
        return $this-&gt;attrs[$name] ?? null;
    }
}

$loose = new LooseUser();
var_dump($loose-&gt;nmae); // タイポなのにNULLが返るだけ！</code></pre>
<p>対照的に、明示的なプロパティとメソッドを使えば、タイポは即座にエラーとして検出されます。使い分けの目安を表にまとめます。</p>
<table>
<tr><th>マジックメソッド</th><th>適した場面</th><th>避けたい場面</th></tr>
<tr><td><code>__toString</code></td><td>表示形式が決まった値オブジェクト</td><td>特になし（安全度が高い）</td></tr>
<tr><td><code>__get / __set</code></td><td>ORMやフレームワークの基盤部分</td><td>普通のドメインクラス</td></tr>
<tr><td><code>__call</code></td><td>プロキシ・ファサードなどの転送</td><td>通常のメソッドで書ける処理</td></tr>
</table>
<p>原則は「普通のプロパティ・メソッドで書けるならそちらを使う」。マジックメソッドは、フレームワークの基盤のような「柔軟性がどうしても必要な少数の場所」に限定するのが良い設計です。</p>`,
      task: `初期コードを実行し、タイポ<code>nmae</code>がエラーにならずNULLになることを観察してください。その後、TODO部分で<code>StrictUser</code>の<code>getName</code>メソッドを完成させ、明示的なメソッドの安全さを確認してください。`,
      code: `<?php
// 乱用例：__getで何でも受けると、タイポも検出できない
class LooseUser
{
    private array $attrs = ['name' => '田中'];

    public function __get(string $name): mixed
    {
        return $this->attrs[$name] ?? null;
    }
}

// 改善例：明示的なプロパティとメソッド
class StrictUser
{
    public function __construct(private string $name)
    {
    }

    public function getName(): string
    {
        // TODO: $this->name を返す
        return '';
    }
}

$loose = new LooseUser();
var_dump($loose->nmae); // 'name'のタイポ。エラーにならずNULLが返ってしまう

$strict = new StrictUser('田中');
echo '名前: ' . $strict->getName() . PHP_EOL;
// $strict->getNmae() のようなタイポは即Errorになるので気づける
`,
      solution: `<?php
// 乱用例：__getで何でも受けると、タイポも検出できない
class LooseUser
{
    private array $attrs = ['name' => '田中'];

    public function __get(string $name): mixed
    {
        return $this->attrs[$name] ?? null;
    }
}

// 改善例：明示的なプロパティとメソッド
class StrictUser
{
    public function __construct(private string $name)
    {
    }

    public function getName(): string
    {
        return $this->name;
    }
}

$loose = new LooseUser();
var_dump($loose->nmae); // 'name'のタイポ。エラーにならずNULLが返ってしまう

$strict = new StrictUser('田中');
echo '名前: ' . $strict->getName() . PHP_EOL;
// $strict->getNmae() のようなタイポは即Errorになるので気づける
`,
      hints: [
        `getNameはコンストラクタで受け取った$this->nameをそのまま返すだけです。`,
        `__get経由のタイポはNULL、明示メソッドのタイポは即Error。この違いが「乱用の危険性」の核心です。`
      ],
      expectedOutput: "名前: 田中"
    },
    {
      id: 170,
      title: "総合演習：流れるようなインターフェースのQueryBuilder風クラス",
      explanation: `<p>この章の総まとめとして、メソッドチェーンでSQL風の文字列を組み立てる<code>QueryBuilder</code>クラスを作ります。ポイントは2つです。</p>
<p><strong>1. 流れるようなインターフェース（fluent interface）</strong>：各メソッドが<code>$this</code>を返すことで、<code>-&gt;where(...)-&gt;orderBy(...)-&gt;limit(...)</code>と連続して呼び出せます。戻り値の型は<code>static</code>（呼び出したクラス自身を表す型）と宣言します。</p>
<pre><code>public function limit(int $count): static
{
    $this-&gt;limit = $count;
    return $this; // これがチェーンの鍵
}</code></pre>
<p><strong>2. __toStringによる最終出力</strong>：組み立てた条件は配列に貯めておき、<code>__toString</code>で1本のSQL文字列に合成します。<code>implode</code>（配列を区切り文字で連結する関数）が活躍します。</p>
<pre><code>$sql = 'SELECT * FROM ' . $this-&gt;table;
if ($this-&gt;wheres !== []) {
    $sql .= ' WHERE ' . implode(' AND ', $this-&gt;wheres);
}</code></pre>
<p>WHERE句の値は、整数ならそのまま、文字列ならシングルクォートで囲む必要があります。<code>is_int</code>で型を判定して整形しましょう。</p>
<p>なお、これは学習用の文字列組み立てです。実際のデータベース操作では、SQLインジェクション（悪意ある入力でSQLを改ざんされる攻撃）を防ぐためにプリペアドステートメントを必ず使います。ここでは「マジックメソッド＋メソッドチェーン」という設計パターンの習得に集中してください。</p>`,
      task: `<code>where</code>・<code>orderBy</code>・<code>limit</code>の各メソッドが<code>$this</code>を返すように実装し、<code>__toString</code>でSQL文字列を組み立ててください。実行結果が<code>SELECT * FROM users WHERE age &gt;= 20 AND city = 'Tokyo' ORDER BY name ASC LIMIT 10</code>になれば完成です。`,
      code: `<?php
class QueryBuilder implements Stringable
{
    private array $wheres = [];
    private array $orders = [];
    private ?int $limit = null;

    public function __construct(private string $table)
    {
    }

    public function where(string $column, string $op, string|int $value): static
    {
        // TODO: $valueが整数なら文字列化、文字列なら "'" . $value . "'" で囲む
        // 'カラム 演算子 値' の形で$this->wheresに追加し、$thisを返す
        return $this;
    }

    public function orderBy(string $column, string $direction = 'ASC'): static
    {
        // TODO: 'カラム 方向' を$this->ordersに追加し、$thisを返す
        return $this;
    }

    public function limit(int $count): static
    {
        // TODO: $this->limitに保存し、$thisを返す
        return $this;
    }

    public function __toString(): string
    {
        $sql = 'SELECT * FROM ' . $this->table;
        // TODO: $this->wheresが空でなければ ' WHERE ' . implode(' AND ', ...) を連結
        // TODO: $this->ordersが空でなければ ' ORDER BY ' . implode(', ', ...) を連結
        // TODO: $this->limitがnullでなければ ' LIMIT ' . $this->limit を連結
        return $sql;
    }
}

$query = new QueryBuilder('users');
echo $query->where('age', '>=', 20)->where('city', '=', 'Tokyo')->orderBy('name')->limit(10) . PHP_EOL;
`,
      solution: `<?php
class QueryBuilder implements Stringable
{
    private array $wheres = [];
    private array $orders = [];
    private ?int $limit = null;

    public function __construct(private string $table)
    {
    }

    public function where(string $column, string $op, string|int $value): static
    {
        if (is_int($value)) {
            $formatted = (string) $value;
        } else {
            $formatted = "'" . $value . "'";
        }
        $this->wheres[] = $column . ' ' . $op . ' ' . $formatted;
        return $this;
    }

    public function orderBy(string $column, string $direction = 'ASC'): static
    {
        $this->orders[] = $column . ' ' . $direction;
        return $this;
    }

    public function limit(int $count): static
    {
        $this->limit = $count;
        return $this;
    }

    public function __toString(): string
    {
        $sql = 'SELECT * FROM ' . $this->table;
        if ($this->wheres !== []) {
            $sql .= ' WHERE ' . implode(' AND ', $this->wheres);
        }
        if ($this->orders !== []) {
            $sql .= ' ORDER BY ' . implode(', ', $this->orders);
        }
        if ($this->limit !== null) {
            $sql .= ' LIMIT ' . $this->limit;
        }
        return $sql;
    }
}

$query = new QueryBuilder('users');
echo $query->where('age', '>=', 20)->where('city', '=', 'Tokyo')->orderBy('name')->limit(10) . PHP_EOL;
`,
      hints: [
        `メソッドチェーンの鍵は各メソッドの最後のreturn $this;です。条件は配列に貯めて__toStringで合成します。`,
        `whereの値はis_int($value)で分岐し、文字列なら "'" . $value . "'" とクォートで囲みます。`,
        `__toStringでは if ($this->wheres !== []) { $sql .= ' WHERE ' . implode(' AND ', $this->wheres); } のように空チェックしてから連結します。`
      ],
      expectedOutput: "SELECT * FROM users WHERE age >= 20 AND city = 'Tokyo' ORDER BY name ASC LIMIT 10"
    }
  ]
});
