// 第18章：実践パターン
registerChapter({
  number: 18,
  title: "実践パターン",
  description: "早期return・データ変換パイプライン・ビルダー・ファクトリ・ストラテジーなど、実務で頻出する設計パターンをPHPで実装します。",
  steps: [
    {
      id: 171,
      title: "バリデーションパターン（早期return）",
      explanation: `<p>入力チェック（バリデーション）のコードは、書き方次第で読みやすさが大きく変わります。ありがちなのが、条件を満たす場合をifで包み続ける「ネスト地獄」です。</p>
<pre><code>// 読みにくい例：正常系がどんどん右にずれていく
if ($name !== '') {
    if (mb_strlen($name) &lt;= 10) {
        if (!str_contains($name, ' ')) {
            return ['ok' =&gt; true];
        }
    }
}</code></pre>
<p>これを解決するのが<strong>早期return（ガード節）</strong>です。「異常系を見つけたら即returnで抜ける」を繰り返し、最後まで生き残ったら正常、という構成にします。</p>
<pre><code>if ($name === '') {
    return ['ok' =&gt; false, 'error' =&gt; '名前が空です'];
}
if (mb_strlen($name) &gt; 10) {
    return ['ok' =&gt; false, 'error' =&gt; '10文字以内にしてください'];
}
// ここまで来たら正常
return ['ok' =&gt; true, 'error' =&gt; null];</code></pre>
<p>利点は次のとおりです。</p>
<ul>
<li>ネストが深くならず、条件を上から順に読める</li>
<li>チェックの追加・削除がif1個の増減で済む</li>
<li>「この行に到達した時点で何が保証されているか」が明確</li>
</ul>
<p><code>mb_strlen</code>はマルチバイト文字（日本語など）を1文字と数える文字数関数、<code>str_contains</code>は部分文字列を含むか判定する関数です。日本語の長さ判定に<code>strlen</code>（バイト数を返す）を使うと誤判定するので注意しましょう。</p>`,
      task: `ネストしたif文で書かれた<code>validateUserName</code>を、早期returnを使った形に書き換えてください。チェック内容と出力結果は変えずに、ネストを1段以内にします。`,
      code: `<?php
// TODO: ネストしたifを早期return（異常系を先にreturn）に書き換える
function validateUserName(string $name): array
{
    if ($name !== '') {
        if (mb_strlen($name) <= 10) {
            if (!str_contains($name, ' ')) {
                return ['ok' => true, 'error' => null];
            } else {
                return ['ok' => false, 'error' => '名前に空白は使えません'];
            }
        } else {
            return ['ok' => false, 'error' => '名前は10文字以内にしてください'];
        }
    } else {
        return ['ok' => false, 'error' => '名前が空です'];
    }
}

foreach (['田中太郎', '', 'とても長すぎる名前ですよこれは', '田中 太郎'] as $name) {
    $result = validateUserName($name);
    if ($result['ok']) {
        echo 'OK: ' . $name . PHP_EOL;
    } else {
        echo 'NG: ' . $result['error'] . PHP_EOL;
    }
}
`,
      solution: `<?php
function validateUserName(string $name): array
{
    // 早期return：異常系を先に弾き、正常系を最後に書く
    if ($name === '') {
        return ['ok' => false, 'error' => '名前が空です'];
    }
    if (mb_strlen($name) > 10) {
        return ['ok' => false, 'error' => '名前は10文字以内にしてください'];
    }
    if (str_contains($name, ' ')) {
        return ['ok' => false, 'error' => '名前に空白は使えません'];
    }
    return ['ok' => true, 'error' => null];
}

foreach (['田中太郎', '', 'とても長すぎる名前ですよこれは', '田中 太郎'] as $name) {
    $result = validateUserName($name);
    if ($result['ok']) {
        echo 'OK: ' . $name . PHP_EOL;
    } else {
        echo 'NG: ' . $result['error'] . PHP_EOL;
    }
}
`,
      hints: [
        `条件を反転させて「ダメな場合を先にreturn」します。空チェックなら if ($name === '') が最初に来ます。`,
        `3つの異常系をそれぞれ独立したifで書き、最後に正常のreturnを1つ置くと、elseが不要になります。`,
        `文字数の条件は「10文字以内ならOK」の反転なので mb_strlen($name) > 10 でNGを弾きます。`
      ],
      expectedOutput: "NG: 名前は10文字以内にしてください"
    },
    {
      id: 172,
      title: "データ変換パイプライン（array_map・filter・reduceの連鎖）",
      explanation: `<p>「配列を加工→絞り込み→集計」という一連の流れは、実務のデータ処理で最も頻出するパターンです。3つの関数を役割分担させると、各段階が独立して読みやすくなります。</p>
<table>
<tr><th>関数</th><th>役割</th><th>入力と出力</th></tr>
<tr><td><code>array_map</code></td><td>変換</td><td>各要素を別の値に変換した配列を返す</td></tr>
<tr><td><code>array_filter</code></td><td>絞り込み</td><td>条件を満たす要素だけの配列を返す</td></tr>
<tr><td><code>array_reduce</code></td><td>集計</td><td>配列を1つの値（合計など）に畳み込む</td></tr>
</table>
<pre><code>// 売上データ →「小計を計算」→「500円以上に絞る」→「合計」
$subtotals = array_map(
    fn(array $row): int =&gt; $row['price'] * $row['quantity'],
    $sales
);
$filtered = array_filter($subtotals, fn(int $s): bool =&gt; $s &gt;= 500);
$total = array_reduce($filtered, fn(int $carry, int $s): int =&gt; $carry + $s, 0);</code></pre>
<p><code>array_reduce</code>の第1引数の<code>$carry</code>は「ここまでの累積値」で、第3引数（ここでは<code>0</code>）が初期値です。各要素について「累積値＋要素」を計算し、次の要素へ引き継ぎます。</p>
<p>この書き方の利点は、foreachと一時変数で書くより<strong>各段階の意図が名前で分かる</strong>ことです。「小計」「絞り込み」「合計」がそれぞれ1文になり、途中結果に名前（<code>$subtotals</code>など）を付けられるためデバッグもしやすくなります。一方、巨大な配列を何度も変換するとメモリを使うため、パフォーマンスが厳しい場面ではforeach1回にまとめる判断もあります。</p>`,
      task: `売上データから「各行の小計」を<code>array_map</code>で計算し、<code>array_filter</code>で500円以上の小計だけ残し、<code>array_reduce</code>で合計を求めるパイプラインを完成させてください。`,
      code: `<?php
$sales = [
    ['product' => 'ノート', 'price' => 200, 'quantity' => 3],
    ['product' => 'ペン', 'price' => 150, 'quantity' => 10],
    ['product' => '消しゴム', 'price' => 100, 'quantity' => 2],
    ['product' => 'ファイル', 'price' => 300, 'quantity' => 5],
];

// TODO: array_mapで各行の price * quantity（小計）の配列を作る
$subtotals = [];

// TODO: array_filterで500以上の小計だけ残す
$filtered = [];

// TODO: array_reduceで$filteredの合計を求める（初期値0）
$total = 0;

echo '小計: ' . implode(', ', $subtotals) . PHP_EOL;
echo '500円以上の合計: ' . $total . PHP_EOL;
`,
      solution: `<?php
$sales = [
    ['product' => 'ノート', 'price' => 200, 'quantity' => 3],
    ['product' => 'ペン', 'price' => 150, 'quantity' => 10],
    ['product' => '消しゴム', 'price' => 100, 'quantity' => 2],
    ['product' => 'ファイル', 'price' => 300, 'quantity' => 5],
];

// 変換：各行の小計を計算する
$subtotals = array_map(
    fn(array $row): int => $row['price'] * $row['quantity'],
    $sales
);

// 絞り込み：500円以上の小計だけ残す
$filtered = array_filter($subtotals, fn(int $subtotal): bool => $subtotal >= 500);

// 集計：合計金額に畳み込む
$total = array_reduce($filtered, fn(int $carry, int $subtotal): int => $carry + $subtotal, 0);

echo '小計: ' . implode(', ', $subtotals) . PHP_EOL;
echo '500円以上の合計: ' . $total . PHP_EOL;
`,
      hints: [
        `array_mapにはアロー関数 fn(array $row): int => $row['price'] * $row['quantity'] を渡します。`,
        `array_filterの条件は fn(int $subtotal): bool => $subtotal >= 500 です。`,
        `array_reduceは array_reduce($filtered, fn(int $carry, int $s): int => $carry + $s, 0) の形で、最後の0が初期値です。`
      ],
      expectedOutput: "500円以上の合計: 3600"
    },
    {
      id: 173,
      title: "ビルダーパターン",
      explanation: `<p>コンストラクタの引数が多いクラスは、呼び出し側が「どの引数が何番目か」を覚えられず使いにくくなります。<strong>ビルダーパターン</strong>は、組み立て専用のクラス（ビルダー）を用意し、メソッドチェーンで設定を積み上げてから最後に<code>build()</code>で完成品を作る設計パターンです。</p>
<pre><code>$request = (new HttpRequestBuilder('https://example.com/api/users'))
    -&gt;method('POST')
    -&gt;header('Content-Type', 'application/json')
    -&gt;body('name=tanaka')
    -&gt;build();</code></pre>
<p>構造は前章のQueryBuilderとよく似ていますが、決定的な違いは<strong>最後にbuild()で「別のクラスの完成品」を返す</strong>ことです。</p>
<table>
<tr><th>登場人物</th><th>役割</th></tr>
<tr><td>ビルダー（HttpRequestBuilder）</td><td>可変。設定を貯める。各メソッドは$thisを返す</td></tr>
<tr><td>完成品（HttpRequest）</td><td>不変。readonlyプロパティで完成後は変更不可</td></tr>
</table>
<p>完成品側のプロパティに<code>readonly</code>（初期化後の再代入を禁止する修飾子）を付けるのがポイントです。「組み立て中は自由に変更できるが、完成したら二度と変わらない」という安心感が生まれます。</p>
<p>ビルダーが向くのは、設定項目が多く省略可能なものが混ざる場合（HTTPリクエスト、メール、検索条件など）です。逆に引数が2〜3個で必須なら、普通のコンストラクタか名前付き引数で十分です。手段が目的にならないよう、使いどころを見極めましょう。</p>`,
      task: `<code>HttpRequestBuilder</code>の<code>method</code>・<code>header</code>・<code>body</code>を、値を保存して<code>$this</code>を返すように実装し、<code>build()</code>で<code>HttpRequest</code>を組み立ててください。`,
      code: `<?php
class HttpRequest
{
    public function __construct(
        public readonly string $method,
        public readonly string $url,
        public readonly array $headers,
        public readonly ?string $body
    ) {
    }

    public function describe(): string
    {
        $parts = $this->method . ' ' . $this->url;
        if ($this->headers !== []) {
            $parts .= ' headers=' . count($this->headers);
        }
        if ($this->body !== null) {
            $parts .= ' body=' . $this->body;
        }
        return $parts;
    }
}

class HttpRequestBuilder
{
    private string $method = 'GET';
    private array $headers = [];
    private ?string $body = null;

    public function __construct(private string $url)
    {
    }

    public function method(string $method): static
    {
        // TODO: $this->methodに保存して$thisを返す
        return $this;
    }

    public function header(string $name, string $value): static
    {
        // TODO: $this->headers[$name]に$valueを保存して$thisを返す
        return $this;
    }

    public function body(string $body): static
    {
        // TODO: $this->bodyに保存して$thisを返す
        return $this;
    }

    public function build(): HttpRequest
    {
        // TODO: 貯めた設定からHttpRequestを生成して返す
        return new HttpRequest('GET', $this->url, [], null);
    }
}

$request = (new HttpRequestBuilder('https://example.com/api/users'))
    ->method('POST')
    ->header('Content-Type', 'application/json')
    ->body('name=tanaka')
    ->build();

echo $request->describe() . PHP_EOL;
`,
      solution: `<?php
class HttpRequest
{
    public function __construct(
        public readonly string $method,
        public readonly string $url,
        public readonly array $headers,
        public readonly ?string $body
    ) {
    }

    public function describe(): string
    {
        $parts = $this->method . ' ' . $this->url;
        if ($this->headers !== []) {
            $parts .= ' headers=' . count($this->headers);
        }
        if ($this->body !== null) {
            $parts .= ' body=' . $this->body;
        }
        return $parts;
    }
}

class HttpRequestBuilder
{
    private string $method = 'GET';
    private array $headers = [];
    private ?string $body = null;

    public function __construct(private string $url)
    {
    }

    public function method(string $method): static
    {
        $this->method = $method;
        return $this;
    }

    public function header(string $name, string $value): static
    {
        $this->headers[$name] = $value;
        return $this;
    }

    public function body(string $body): static
    {
        $this->body = $body;
        return $this;
    }

    public function build(): HttpRequest
    {
        return new HttpRequest($this->method, $this->url, $this->headers, $this->body);
    }
}

$request = (new HttpRequestBuilder('https://example.com/api/users'))
    ->method('POST')
    ->header('Content-Type', 'application/json')
    ->body('name=tanaka')
    ->build();

echo $request->describe() . PHP_EOL;
`,
      hints: [
        `各設定メソッドは「プロパティに保存→return $this;」の2行です。`,
        `headerは連想配列への追加なので $this->headers[$name] = $value; とします。`,
        `buildは new HttpRequest($this->method, $this->url, $this->headers, $this->body) を返します。`
      ],
      expectedOutput: "POST https://example.com/api/users headers=1 body=name=tanaka"
    },
    {
      id: 174,
      title: "ファクトリパターン",
      explanation: `<p><strong>ファクトリパターン</strong>は、「どのクラスのインスタンスを作るか」の判断を専用のクラス（ファクトリ＝工場）に集約する設計パターンです。呼び出し側は<code>new</code>を直接書かず、種類を表す文字列などを渡すだけで適切なオブジェクトを受け取れます。</p>
<pre><code>class NotifierFactory
{
    public static function create(string $type): Notifier
    {
        return match ($type) {
            'email' =&gt; new EmailNotifier(),
            'slack' =&gt; new SlackNotifier(),
            default =&gt; throw new InvalidArgumentException('未対応の種類: ' . $type),
        };
    }
}</code></pre>
<p>ポイントは3つあります。</p>
<ul>
<li><strong>戻り値の型はインターフェース</strong>（ここでは<code>Notifier</code>）にする。呼び出し側は具体的なクラス名を知らなくてよい</li>
<li><strong>match式</strong>（値に応じて式を返す分岐。一致は===で判定）が種類の振り分けと相性抜群。<code>default</code>で想定外の値を例外にできる</li>
<li>PHP 8ではmatchのアーム内に<code>throw</code>を式として書ける</li>
</ul>
<p>利点は、通知手段が増えたとき（LINE通知を追加など）に<strong>変更箇所がファクトリ1か所で済む</strong>ことです。newが呼び出し側のあちこちに散らばっていると、追加のたびに全箇所を修正する必要があります。</p>
<p>「設定ファイルの値によって実装を切り替える」「テスト時だけ偽物に差し替える」など、生成の判断が1か所に集まっていることが後々効いてきます。ファクトリは次のステップで学ぶストラテジーパターンとも組み合わせて使われる、実務頻出のパターンです。</p>`,
      task: `<code>NotifierFactory::create</code>のmatch式を完成させてください。<code>'email'</code>なら<code>EmailNotifier</code>、<code>'slack'</code>なら<code>SlackNotifier</code>を返し、それ以外は<code>InvalidArgumentException</code>を投げます。`,
      code: `<?php
interface Notifier
{
    public function send(string $message): string;
}

class EmailNotifier implements Notifier
{
    public function send(string $message): string
    {
        return 'メール送信: ' . $message;
    }
}

class SlackNotifier implements Notifier
{
    public function send(string $message): string
    {
        return 'Slack送信: ' . $message;
    }
}

class NotifierFactory
{
    public static function create(string $type): Notifier
    {
        // TODO: match式で 'email' => EmailNotifier、'slack' => SlackNotifier を返す
        // default では throw new InvalidArgumentException('未対応の種類: ' . $type)
        return new EmailNotifier();
    }
}

foreach (['email', 'slack'] as $type) {
    $notifier = NotifierFactory::create($type);
    echo $notifier->send('サーバーを再起動しました') . PHP_EOL;
}

try {
    NotifierFactory::create('fax');
} catch (InvalidArgumentException $e) {
    echo 'エラー: ' . $e->getMessage() . PHP_EOL;
}
`,
      solution: `<?php
interface Notifier
{
    public function send(string $message): string;
}

class EmailNotifier implements Notifier
{
    public function send(string $message): string
    {
        return 'メール送信: ' . $message;
    }
}

class SlackNotifier implements Notifier
{
    public function send(string $message): string
    {
        return 'Slack送信: ' . $message;
    }
}

class NotifierFactory
{
    public static function create(string $type): Notifier
    {
        return match ($type) {
            'email' => new EmailNotifier(),
            'slack' => new SlackNotifier(),
            default => throw new InvalidArgumentException('未対応の種類: ' . $type),
        };
    }
}

foreach (['email', 'slack'] as $type) {
    $notifier = NotifierFactory::create($type);
    echo $notifier->send('サーバーを再起動しました') . PHP_EOL;
}

try {
    NotifierFactory::create('fax');
} catch (InvalidArgumentException $e) {
    echo 'エラー: ' . $e->getMessage() . PHP_EOL;
}
`,
      hints: [
        `match ($type) { 'email' => new EmailNotifier(), ... } の形で、各アームに生成式を書きます。`,
        `PHP 8ではmatchのアームに throw を式として書けます。default => throw new InvalidArgumentException(...) が使えます。`
      ],
      expectedOutput: "Slack送信: サーバーを再起動しました"
    },
    {
      id: 175,
      title: "ストラテジーパターン（クロージャ版とクラス版）",
      explanation: `<p><strong>ストラテジーパターン</strong>は、「アルゴリズム（戦略）を交換可能な部品として外から渡す」設計パターンです。割引計算を例にすると、「会員割引」「セール割引」など計算方法だけが違う処理を、if分岐の増殖ではなく部品の差し替えで実現します。</p>
<p><strong>クラス版</strong>では、戦略のインターフェースを定義し、各戦略をクラスとして実装します。</p>
<pre><code>interface DiscountStrategy
{
    public function apply(int $price): int;
}

class MemberDiscount implements DiscountStrategy
{
    public function apply(int $price): int
    {
        return (int) ($price * 0.9); // 10%引き
    }
}

function checkout(int $price, DiscountStrategy $strategy): int
{
    return $strategy-&gt;apply($price); // 戦略の中身を知らなくてよい
}</code></pre>
<p><strong>クロージャ版</strong>では、小さな戦略をアロー関数で表現し、配列に登録して切り替えます。</p>
<pre><code>$strategies = [
    'sale' =&gt; fn(int $price): int =&gt; (int) ($price * 0.8),
    'coupon' =&gt; fn(int $price): int =&gt; max(0, $price - 300),
];
echo $strategies['sale'](1000); // 800</code></pre>
<table>
<tr><th>版</th><th>向く場面</th></tr>
<tr><td>クラス版</td><td>戦略が複雑・状態を持つ・テストを書きたい</td></tr>
<tr><td>クロージャ版</td><td>戦略が1〜2行で済む・組み合わせが動的</td></tr>
</table>
<p><code>max(0, $price - 300)</code>のように下限を設けると、クーポンで金額がマイナスになる事故を防げます。ifの分岐が3つ以上に育ちそうなら、ストラテジーへの置き換えを検討しましょう。</p>`,
      task: `クラス版の<code>MemberDiscount</code>は実装済みです。TODO部分にクロージャ版の戦略2つ（<code>'sale'</code>は20%引き、<code>'coupon'</code>は300円引きで下限0円）をアロー関数で定義してください。`,
      code: `<?php
interface DiscountStrategy
{
    public function apply(int $price): int;
}

class MemberDiscount implements DiscountStrategy
{
    public function apply(int $price): int
    {
        return (int) ($price * 0.9);
    }
}

class NoDiscount implements DiscountStrategy
{
    public function apply(int $price): int
    {
        return $price;
    }
}

function checkout(int $price, DiscountStrategy $strategy): int
{
    return $strategy->apply($price);
}

echo '会員: ' . checkout(1000, new MemberDiscount()) . '円' . PHP_EOL;
echo '一般: ' . checkout(1000, new NoDiscount()) . '円' . PHP_EOL;

// TODO: クロージャ版の戦略を定義する
// 'sale' => 20%引き（$price * 0.8 を (int) にキャスト）
// 'coupon' => 300円引き。ただしmax(0, ...)で0円未満にならないようにする
$strategies = [];

foreach ($strategies as $name => $strategy) {
    echo $name . ': ' . $strategy(1000) . '円' . PHP_EOL;
}
`,
      solution: `<?php
interface DiscountStrategy
{
    public function apply(int $price): int;
}

class MemberDiscount implements DiscountStrategy
{
    public function apply(int $price): int
    {
        return (int) ($price * 0.9);
    }
}

class NoDiscount implements DiscountStrategy
{
    public function apply(int $price): int
    {
        return $price;
    }
}

function checkout(int $price, DiscountStrategy $strategy): int
{
    return $strategy->apply($price);
}

echo '会員: ' . checkout(1000, new MemberDiscount()) . '円' . PHP_EOL;
echo '一般: ' . checkout(1000, new NoDiscount()) . '円' . PHP_EOL;

// クロージャ版：小さな戦略なら無名関数でも表現できる
$strategies = [
    'sale' => fn(int $price): int => (int) ($price * 0.8),
    'coupon' => fn(int $price): int => max(0, $price - 300),
];

foreach ($strategies as $name => $strategy) {
    echo $name . ': ' . $strategy(1000) . '円' . PHP_EOL;
}
`,
      hints: [
        `連想配列の値としてアロー関数を入れます。'sale' => fn(int $price): int => (int) ($price * 0.8) の形です。`,
        `couponは fn(int $price): int => max(0, $price - 300) とすると、300円未満の商品でも0円で止まります。`
      ],
      expectedOutput: "coupon: 700円"
    },
    {
      id: 176,
      title: "シングルトンパターンと注意点",
      explanation: `<p><strong>シングルトンパターン</strong>は、「あるクラスのインスタンスがプログラム全体で1つしか存在しない」ことを保証する設計パターンです。実装の要素は3つです。</p>
<ol>
<li>コンストラクタを<code>private</code>にして外部からの<code>new</code>を禁止する</li>
<li>唯一のインスタンスを保持する<code>private static</code>プロパティを持つ</li>
<li><code>getInstance()</code>という静的メソッドで、初回だけ生成し、2回目以降は同じものを返す</li>
</ol>
<pre><code>class AppConfig
{
    private static ?AppConfig $instance = null;

    private function __construct()
    {
    }

    public static function getInstance(): AppConfig
    {
        if (self::$instance === null) {
            self::$instance = new AppConfig();
        }
        return self::$instance;
    }
}

$a = AppConfig::getInstance();
$b = AppConfig::getInstance();
// $a === $b はtrue。何度呼んでも同じインスタンス</code></pre>
<p>設定情報や接続管理など「2つあると困るもの」に使われてきましたが、<strong>現代では乱用注意のパターン</strong>とされています。</p>
<ul>
<li>実質的なグローバル変数になり、どこからでも状態を書き換えられる</li>
<li>テストでインスタンスを差し替えられず、テスト間で状態が漏れる</li>
<li>依存関係がコードの見た目から分からなくなる</li>
</ul>
<p>次のステップで学ぶ依存性注入（DI）を使えば、「1つだけ作って使い回す」ことを呼び出し側の構成で実現でき、シングルトンの欠点を避けられます。仕組みと弱点をセットで理解しておきましょう。</p>`,
      task: `<code>getInstance</code>のTODOを実装してください。<code>self::$instance</code>がnullのときだけ生成し、常に同じインスタンスを返すようにします。`,
      code: `<?php
class AppConfig
{
    private static ?AppConfig $instance = null;
    private array $settings = [];

    private function __construct()
    {
        // privateなので外部からnew AppConfig()はできない
        $this->settings = ['env' => 'production'];
    }

    public static function getInstance(): AppConfig
    {
        // TODO: self::$instanceがnullなら new AppConfig() を代入し、
        // self::$instanceを返す
        return new AppConfig();
    }

    public function get(string $key): ?string
    {
        return $this->settings[$key] ?? null;
    }

    public function set(string $key, string $value): void
    {
        $this->settings[$key] = $value;
    }
}

$a = AppConfig::getInstance();
$b = AppConfig::getInstance();

echo ($a === $b) ? '同一インスタンス' : '別インスタンス';
echo PHP_EOL;

$a->set('debug', 'off');
echo 'bから見たdebug: ' . $b->get('debug') . PHP_EOL;
echo 'env: ' . $a->get('env') . PHP_EOL;
`,
      solution: `<?php
class AppConfig
{
    private static ?AppConfig $instance = null;
    private array $settings = [];

    private function __construct()
    {
        // privateなので外部からnew AppConfig()はできない
        $this->settings = ['env' => 'production'];
    }

    public static function getInstance(): AppConfig
    {
        if (self::$instance === null) {
            self::$instance = new AppConfig();
        }
        return self::$instance;
    }

    public function get(string $key): ?string
    {
        return $this->settings[$key] ?? null;
    }

    public function set(string $key, string $value): void
    {
        $this->settings[$key] = $value;
    }
}

$a = AppConfig::getInstance();
$b = AppConfig::getInstance();

echo ($a === $b) ? '同一インスタンス' : '別インスタンス';
echo PHP_EOL;

$a->set('debug', 'off');
echo 'bから見たdebug: ' . $b->get('debug') . PHP_EOL;
echo 'env: ' . $a->get('env') . PHP_EOL;
`,
      hints: [
        `静的プロパティには self::$instance でアクセスします。クラス自身の中ではprivateコンストラクタでもnewできます。`,
        `if (self::$instance === null) { self::$instance = new AppConfig(); } のあとで return self::$instance; とします。`
      ],
      expectedOutput: "同一インスタンス"
    },
    {
      id: 177,
      title: "依存性注入の基本（コンストラクタインジェクション）",
      explanation: `<p><strong>依存性注入（DI: Dependency Injection）</strong>とは、クラスが必要とする部品（依存）を、クラスの内部で<code>new</code>するのではなく<strong>外から渡してもらう</strong>設計手法です。もっとも基本的な渡し方が、コンストラクタの引数で受け取る<strong>コンストラクタインジェクション</strong>です。</p>
<pre><code>// 悪い例：内部で依存を生成している
class GreetingService
{
    public function greet(string $name): string
    {
        $clock = new SystemClock(); // 現在時刻に固定依存
        // → テストで「朝の挨拶」を確かめる方法がない
    }
}

// 良い例：依存を外から受け取る
class GreetingService
{
    public function __construct(private Clock $clock)
    {
    }
}</code></pre>
<p>重要なのは、受け取る型を具体的なクラスではなく<strong>インターフェース</strong>（ここでは<code>Clock</code>）にすることです。すると呼び出し側が実装を自由に選べます。</p>
<pre><code>$service = new GreetingService(new FixedClock('09:00')); // テスト用の固定時刻
$service = new GreetingService(new SystemClock());        // 本番用</code></pre>
<p>DIの利点をまとめます。</p>
<ul>
<li><strong>テストしやすい</strong>：時刻・乱数・外部通信などを偽物（テストダブル）に差し替えられる</li>
<li><strong>依存が明示される</strong>：コンストラクタを見れば必要な部品が全部分かる</li>
<li><strong>組み替えが自由</strong>：前ステップのシングルトンと違い、構成は呼び出し側が決める</li>
</ul>
<p>LaravelやSymfonyの「サービスコンテナ」は、このコンストラクタインジェクションを自動化する仕組みです。基礎を手で書いて理解しておくと、フレームワークの動きが見通せるようになります。</p>`,
      task: `<code>GreetingService</code>が内部で時刻を固定してしまっているのを、コンストラクタで<code>Clock</code>を受け取る形に修正してください。<code>greet</code>では注入された<code>$this-&gt;clock-&gt;now()</code>を使います。`,
      code: `<?php
interface Clock
{
    public function now(): string;
}

class FixedClock implements Clock
{
    public function __construct(private string $time)
    {
    }

    public function now(): string
    {
        return $this->time;
    }
}

class GreetingService
{
    // TODO: コンストラクタで Clock を受け取り、privateプロパティに保持する

    public function greet(string $name): string
    {
        // TODO: '12:00' の固定値をやめて $this->clock->now() を使う
        $hour = (int) substr('12:00', 0, 2);
        if ($hour < 12) {
            return 'おはよう、' . $name . 'さん';
        }
        return 'こんにちは、' . $name . 'さん';
    }
}

$morning = new GreetingService(new FixedClock('09:00'));
$afternoon = new GreetingService(new FixedClock('15:30'));

echo $morning->greet('田中') . PHP_EOL;
echo $afternoon->greet('佐藤') . PHP_EOL;
`,
      solution: `<?php
interface Clock
{
    public function now(): string;
}

class FixedClock implements Clock
{
    public function __construct(private string $time)
    {
    }

    public function now(): string
    {
        return $this->time;
    }
}

class GreetingService
{
    // 依存（Clock）を外から受け取る＝コンストラクタインジェクション
    public function __construct(private Clock $clock)
    {
    }

    public function greet(string $name): string
    {
        $hour = (int) substr($this->clock->now(), 0, 2);
        if ($hour < 12) {
            return 'おはよう、' . $name . 'さん';
        }
        return 'こんにちは、' . $name . 'さん';
    }
}

$morning = new GreetingService(new FixedClock('09:00'));
$afternoon = new GreetingService(new FixedClock('15:30'));

echo $morning->greet('田中') . PHP_EOL;
echo $afternoon->greet('佐藤') . PHP_EOL;
`,
      hints: [
        `コンストラクタプロモーション public function __construct(private Clock $clock) {} で受け取りと保持を1行で書けます。`,
        `greet内の固定値'12:00'を$this->clock->now()に置き換えると、注入した時刻で挨拶が変わります。`,
        `型宣言はFixedClockではなくインターフェースのClockにするのがDIのポイントです。`
      ],
      expectedOutput: "おはよう、田中さん"
    },
    {
      id: 178,
      title: "イミュータブルオブジェクトとwither（withXxxメソッド）",
      explanation: `<p><strong>イミュータブル（不変）オブジェクト</strong>とは、一度作ったら状態が変わらないオブジェクトです。全プロパティを<code>readonly</code>にすると、生成後の再代入がエラーになり不変性を強制できます。</p>
<p>では「ステータスだけ変えた記事が欲しい」ときはどうするか。ここで使うのが<strong>wither</strong>（<code>withXxx</code>という命名のメソッド）です。setterのように自分を書き換えるのではなく、<strong>変更後の値を持つ新しいインスタンスを返します</strong>。</p>
<pre><code>final class Article
{
    public function __construct(
        public readonly string $title,
        public readonly string $status
    ) {
    }

    public function withStatus(string $status): self
    {
        return new self($this-&gt;title, $status); // 新しいインスタンス
    }
}

$draft = new Article('PHP入門', 'draft');
$published = $draft-&gt;withStatus('published');
// $draftはdraftのまま。$publishedは別インスタンス</code></pre>
<p>注意点として、<code>clone $this</code>してからreadonlyプロパティに代入する書き方は<strong>エラーになります</strong>（readonlyは初期化後の再代入を禁止するため）。witherでは<code>new self(...)</code>で作り直すのが確実です。</p>
<table>
<tr><th>方式</th><th>呼び出し後の元オブジェクト</th><th>代表例</th></tr>
<tr><td>setter（<code>setStatus</code>）</td><td>書き換わる</td><td>可変オブジェクト</td></tr>
<tr><td>wither（<code>withStatus</code>）</td><td>変わらない。新品が返る</td><td>PSR-7のRequestなど</td></tr>
</table>
<p>不変オブジェクトは「いつの間にか誰かに書き換えられていた」というバグを構造的に防ぎます。日付・金額・設定値など、共有されやすい値ほどイミュータブルにする価値があります。</p>`,
      task: `初期コードの<code>withStatus</code>は<code>clone</code>後にreadonlyプロパティへ代入しているため、実行するとErrorになります。<code>new self(...)</code>で新しいインスタンスを返す形に修正し、<code>withTitle</code>も同様に実装してください。`,
      code: `<?php
final class Article
{
    public function __construct(
        public readonly string $title,
        public readonly string $status
    ) {
    }

    public function withStatus(string $status): self
    {
        // このままでは実行時にError：readonlyプロパティは再代入できない
        // TODO: new self($this->title, $status) を返す形に直す
        $copy = clone $this;
        $copy->status = $status;
        return $copy;
    }

    public function withTitle(string $title): self
    {
        // TODO: タイトルだけ差し替えた新しいインスタンスを返す
        return $this;
    }
}

$draft = new Article('PHP入門', 'draft');
$published = $draft->withStatus('published');

echo 'draft: ' . $draft->title . ' / ' . $draft->status . PHP_EOL;
echo 'published: ' . $published->title . ' / ' . $published->status . PHP_EOL;
echo ($draft === $published) ? '同一' : '別インスタンス';
echo PHP_EOL;
`,
      solution: `<?php
final class Article
{
    public function __construct(
        public readonly string $title,
        public readonly string $status
    ) {
    }

    // witherメソッド：自身は変更せず、変更後の新しいインスタンスを返す
    public function withStatus(string $status): self
    {
        return new self($this->title, $status);
    }

    public function withTitle(string $title): self
    {
        return new self($title, $this->status);
    }
}

$draft = new Article('PHP入門', 'draft');
$published = $draft->withStatus('published');

echo 'draft: ' . $draft->title . ' / ' . $draft->status . PHP_EOL;
echo 'published: ' . $published->title . ' / ' . $published->status . PHP_EOL;
echo ($draft === $published) ? '同一' : '別インスタンス';
echo PHP_EOL;
`,
      hints: [
        `readonlyプロパティはclone後でも再代入できません。コンストラクタ経由で作り直します。`,
        `withStatusは return new self($this->title, $status); の1行になります。`,
        `withTitleは変えたい引数の位置が違うだけで、return new self($title, $this->status); です。`
      ],
      expectedOutput: "published: PHP入門 / published"
    },
    {
      id: 179,
      title: "コレクションクラスを作る（first・map・filterをメソッドチェーンで）",
      explanation: `<p><code>array_map</code>や<code>array_filter</code>は便利ですが、連鎖させると関数呼び出しが入れ子になり読みにくくなります。そこで実務では、配列を包んだ<strong>コレクションクラス</strong>を作り、メソッドチェーンで処理を繋げるパターンがよく使われます。LaravelのCollectionが有名な例です。</p>
<pre><code>$passed = $scores
    -&gt;filter(fn(int $s): bool =&gt; $s &gt;= 60)
    -&gt;map(fn(int $s): string =&gt; $s . '点');</code></pre>
<p>実装のポイントは、<code>map</code>や<code>filter</code>が<strong>新しいCollectionを返す</strong>ことです。<code>$this</code>を返すQueryBuilder型のチェーンと違い、元のコレクションは変更されない（イミュータブル寄りの）設計になります。前ステップの考え方の応用です。</p>
<pre><code>public function map(callable $fn): self
{
    return new self(array_map($fn, $this-&gt;items));
}</code></pre>
<p>注意すべきは<code>array_filter</code>のキーの挙動です。<code>array_filter</code>は<strong>元のキーを保持する</strong>ため、絞り込み後の配列はキーが<code>[1 =&gt; 82, 2 =&gt; 90, 4 =&gt; 73]</code>のように歯抜けになります。そのまま<code>$items[0]</code>を見る<code>first()</code>を呼ぶと、キー0が存在せずnullになる事故が起きます。<code>array_values</code>（値だけ取り出してキーを0から振り直す関数）で詰め直すのが定石です。</p>
<pre><code>return new self(array_values(array_filter($this-&gt;items, $fn)));</code></pre>
<p><code>first()</code>では<code>$this-&gt;items[0] ?? null</code>とnull合体演算子を使い、空のコレクションでもWarningを出さずnullを返すようにします。</p>`,
      task: `<code>Collection</code>クラスの<code>filter</code>と<code>first</code>を実装してください。<code>filter</code>では<code>array_values</code>でキーを詰め直すこと、<code>first</code>では空でもWarningが出ないよう<code>??</code>を使うことがポイントです。`,
      code: `<?php
class Collection
{
    public function __construct(private array $items)
    {
    }

    public function map(callable $fn): self
    {
        return new self(array_map($fn, $this->items));
    }

    public function filter(callable $fn): self
    {
        // TODO: array_filterで絞り込み、array_valuesでキーを0から振り直して
        // 新しいCollectionを返す
        return new self($this->items);
    }

    public function first(): mixed
    {
        // TODO: 先頭要素を返す。空なら（Warningを出さずに）nullを返す
        return null;
    }

    public function count(): int
    {
        return count($this->items);
    }

    public function toArray(): array
    {
        return $this->items;
    }
}

$scores = new Collection([55, 82, 90, 47, 73]);

$passed = $scores
    ->filter(fn(int $score): bool => $score >= 60)
    ->map(fn(int $score): string => $score . '点');

echo '合格者数: ' . $passed->count() . PHP_EOL;
echo '一覧: ' . implode(', ', $passed->toArray()) . PHP_EOL;
echo '最初の合格点: ' . $passed->first() . PHP_EOL;
`,
      solution: `<?php
class Collection
{
    public function __construct(private array $items)
    {
    }

    public function map(callable $fn): self
    {
        return new self(array_map($fn, $this->items));
    }

    public function filter(callable $fn): self
    {
        // array_filterはキーを保持するため、array_valuesで0から振り直す
        return new self(array_values(array_filter($this->items, $fn)));
    }

    public function first(): mixed
    {
        return $this->items[0] ?? null;
    }

    public function count(): int
    {
        return count($this->items);
    }

    public function toArray(): array
    {
        return $this->items;
    }
}

$scores = new Collection([55, 82, 90, 47, 73]);

$passed = $scores
    ->filter(fn(int $score): bool => $score >= 60)
    ->map(fn(int $score): string => $score . '点');

echo '合格者数: ' . $passed->count() . PHP_EOL;
echo '一覧: ' . implode(', ', $passed->toArray()) . PHP_EOL;
echo '最初の合格点: ' . $passed->first() . PHP_EOL;
`,
      hints: [
        `filterは return new self(array_values(array_filter($this->items, $fn))); です。array_valuesを忘れるとキーが歯抜けになります。`,
        `firstは return $this->items[0] ?? null; とすれば、空配列でもWarningなしでnullが返ります。`
      ],
      expectedOutput: "一覧: 82点, 90点, 73点"
    },
    {
      id: 180,
      title: "総合演習：注文処理システムのミニ設計",
      explanation: `<p>この章の総まとめとして、これまでのパターンを組み合わせた小さな注文処理システムを設計します。登場人物と担当パターンは次のとおりです。</p>
<table>
<tr><th>クラス</th><th>役割</th><th>使うパターン</th></tr>
<tr><td><code>OrderItem</code></td><td>商品名・単価・数量を持つ明細</td><td>イミュータブル（readonly）</td></tr>
<tr><td><code>DiscountRule</code></td><td>割引計算のインターフェース</td><td>ストラテジー</td></tr>
<tr><td><code>BulkDiscount</code></td><td>5000円以上で10%引きの実装</td><td>ストラテジー＋早期return</td></tr>
<tr><td><code>Order</code></td><td>明細を集め、合計と概要を出す</td><td>DI＋メソッドチェーン＋バリデーション</td></tr>
</table>
<p>設計の流れを追ってみましょう。</p>
<ol>
<li><code>Order</code>はコンストラクタで<code>DiscountRule</code>を受け取る（コンストラクタインジェクション）。割引方法を変えたければ渡す実装を変えるだけ</li>
<li><code>add</code>は不正な数量を例外で弾き（バリデーション）、<code>$this</code>を返してチェーン可能にする</li>
<li><code>total</code>は<code>array_reduce</code>で小計を合計し、最後に戦略の<code>apply</code>を通す（パイプライン）</li>
<li><code>summary</code>は<code>array_map</code>で各明細を文字列化し、<code>implode</code>で連結する</li>
</ol>
<pre><code>$order = new Order(new BulkDiscount());
$order-&gt;add(new OrderItem('キーボード', 3000, 1))
    -&gt;add(new OrderItem('マウス', 1500, 2));
echo $order-&gt;total(); // 6000円の10%引きで5400</code></pre>
<p>1つ1つのパターンは既に学んだものばかりです。「パターンは暗記するものではなく、責務を分けるための語彙」だと実感できれば、この章の目標は達成です。完成後は、割引ルールを差し替えたり明細を増やしたりして、変更が局所で済むことを体感してください。</p>`,
      task: `<code>Order</code>クラスの<code>add</code>（数量0以下は<code>InvalidArgumentException</code>、正常なら追加して<code>$this</code>を返す）と<code>total</code>（<code>array_reduce</code>で小計を合計し、割引ルールを適用）を実装してください。`,
      code: `<?php
final class OrderItem
{
    public function __construct(
        public readonly string $name,
        public readonly int $price,
        public readonly int $quantity
    ) {
    }

    public function subtotal(): int
    {
        return $this->price * $this->quantity;
    }
}

interface DiscountRule
{
    public function apply(int $total): int;
}

final class BulkDiscount implements DiscountRule
{
    public function apply(int $total): int
    {
        // 5000円以上で10%引き
        if ($total >= 5000) {
            return (int) ($total * 0.9);
        }
        return $total;
    }
}

final class Order
{
    private array $items = [];

    public function __construct(private DiscountRule $rule)
    {
    }

    public function add(OrderItem $item): static
    {
        // TODO: $item->quantityが0以下なら
        // InvalidArgumentException('数量は1以上にしてください') を投げる
        // 正常なら$this->itemsに追加して$thisを返す
        return $this;
    }

    public function total(): int
    {
        // TODO: array_reduceで全明細のsubtotal()を合計し、
        // $this->rule->apply(合計) を返す
        return 0;
    }

    public function summary(): string
    {
        $lines = array_map(
            fn(OrderItem $item): string => $item->name . ' x' . $item->quantity . ' = ' . $item->subtotal() . '円',
            $this->items
        );
        return implode(PHP_EOL, $lines);
    }
}

$order = new Order(new BulkDiscount());
$order->add(new OrderItem('キーボード', 3000, 1))
    ->add(new OrderItem('マウス', 1500, 2));

echo $order->summary() . PHP_EOL;
echo '支払額: ' . $order->total() . '円' . PHP_EOL;

try {
    $order->add(new OrderItem('不正な商品', 100, 0));
} catch (InvalidArgumentException $e) {
    echo 'エラー: ' . $e->getMessage() . PHP_EOL;
}
`,
      solution: `<?php
final class OrderItem
{
    public function __construct(
        public readonly string $name,
        public readonly int $price,
        public readonly int $quantity
    ) {
    }

    public function subtotal(): int
    {
        return $this->price * $this->quantity;
    }
}

interface DiscountRule
{
    public function apply(int $total): int;
}

final class BulkDiscount implements DiscountRule
{
    public function apply(int $total): int
    {
        // 5000円以上で10%引き
        if ($total >= 5000) {
            return (int) ($total * 0.9);
        }
        return $total;
    }
}

final class Order
{
    private array $items = [];

    public function __construct(private DiscountRule $rule)
    {
    }

    public function add(OrderItem $item): static
    {
        if ($item->quantity <= 0) {
            throw new InvalidArgumentException('数量は1以上にしてください');
        }
        $this->items[] = $item;
        return $this;
    }

    public function total(): int
    {
        $sum = array_reduce(
            $this->items,
            fn(int $carry, OrderItem $item): int => $carry + $item->subtotal(),
            0
        );
        return $this->rule->apply($sum);
    }

    public function summary(): string
    {
        $lines = array_map(
            fn(OrderItem $item): string => $item->name . ' x' . $item->quantity . ' = ' . $item->subtotal() . '円',
            $this->items
        );
        return implode(PHP_EOL, $lines);
    }
}

$order = new Order(new BulkDiscount());
$order->add(new OrderItem('キーボード', 3000, 1))
    ->add(new OrderItem('マウス', 1500, 2));

echo $order->summary() . PHP_EOL;
echo '支払額: ' . $order->total() . '円' . PHP_EOL;

try {
    $order->add(new OrderItem('不正な商品', 100, 0));
} catch (InvalidArgumentException $e) {
    echo 'エラー: ' . $e->getMessage() . PHP_EOL;
}
`,
      hints: [
        `addは早期returnならぬ早期throwです。if ($item->quantity <= 0) { throw ...; } のあとに追加とreturn $this;を書きます。`,
        `totalの集計は array_reduce($this->items, fn(int $carry, OrderItem $item): int => $carry + $item->subtotal(), 0) です。`,
        `合計を出したら最後に $this->rule->apply($sum) を通すのを忘れずに。割引はOrder自身ではなく注入された戦略の仕事です。`
      ],
      expectedOutput: "支払額: 5400円"
    }
  ]
});
