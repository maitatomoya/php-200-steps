// 第11章：null安全とenum
registerChapter({
  number: 11,
  title: "null安全とenum",
  description: "nullを安全に扱うための構文（nullable型・null合体演算子・nullsafe演算子）と、限られた選択肢を型として表現できるenumを学びます。",
  steps: [
    {
      id: 101,
      title: "nullの扱いとnullable型（?int）",
      explanation: `<p><code>null</code>は「値が存在しない」ことを表す特別な値です。「検索したが見つからなかった」「まだ設定されていない」といった状況を表現するためによく使われます。</p>
<p>しかし、型宣言に<code>int</code>と書いた引数や戻り値に<code>null</code>を渡すと、<strong>TypeError</strong>が発生します。「intまたはnull」を許可したいときは、型名の前に<code>?</code>を付けた<strong>nullable型</strong>（例：<code>?int</code>）を使います。</p>
<pre><code>&lt;?php
// 戻り値が「intまたはnull」であることを型で宣言する
function findStock(string $item): ?int
{
    $stocks = ['apple' =&gt; 3, 'banana' =&gt; 0];
    if (array_key_exists($item, $stocks)) {
        return $stocks[$item];
    }
    return null; // 見つからなければnullを返す
}</code></pre>
<p>nullかどうかの判定には<strong>厳密比較の<code>===</code></strong>を使います。<code>== null</code>は<code>0</code>や<code>''</code>（空文字）や<code>false</code>もtrueと判定してしまうため、バグの温床になります。</p>
<table>
<tr><th>式</th><th>結果</th><th>備考</th></tr>
<tr><td><code>null == 0</code></td><td>true</td><td>緩い比較は危険</td></tr>
<tr><td><code>null === 0</code></td><td>false</td><td>型まで比較する</td></tr>
<tr><td><code>null === null</code></td><td>true</td><td>null判定はこれを使う</td></tr>
</table>
<p>nullable型を使うと「この関数はnullを返す可能性がある」ことが型宣言から一目で分かり、呼び出し側にnullチェックを促せます。これが<strong>null安全</strong>への第一歩です。</p>`,
      task: `関数<code>findAge</code>は見つからないとき<code>null</code>を返したいのに、戻り値の型が<code>int</code>のためTypeErrorが発生します。戻り値の型をnullable型に修正して、エラーなく実行できるようにしてください。`,
      code: `<?php
// 名前から年齢を探す関数。見つからないときはnullを返したい
// TODO: 戻り値の型を「intまたはnull」を許可する型に修正する
function findAge(string $name): int
{
    $ages = ['太郎' => 20, '花子' => 25];
    if (array_key_exists($name, $ages)) {
        return $ages[$name];
    }
    return null;
}

$age = findAge('太郎');
if ($age === null) {
    echo '太郎の年齢は不明です' . PHP_EOL;
} else {
    echo '太郎の年齢は' . $age . '歳です' . PHP_EOL;
}

$age2 = findAge('次郎');
if ($age2 === null) {
    echo '次郎の年齢は不明です' . PHP_EOL;
}`,
      solution: `<?php
// 名前から年齢を探す関数。見つからないときはnullを返したい
function findAge(string $name): ?int
{
    $ages = ['太郎' => 20, '花子' => 25];
    if (array_key_exists($name, $ages)) {
        return $ages[$name];
    }
    return null;
}

$age = findAge('太郎');
if ($age === null) {
    echo '太郎の年齢は不明です' . PHP_EOL;
} else {
    echo '太郎の年齢は' . $age . '歳です' . PHP_EOL;
}

$age2 = findAge('次郎');
if ($age2 === null) {
    echo '次郎の年齢は不明です' . PHP_EOL;
}`,
      hints: [
        `「intまたはnull」を表す型は、intの前に1文字追加するだけで書けます。`,
        `戻り値の型宣言を<code>?int</code>に変えると、returnでnullを返してもTypeErrorになりません。`
      ],
      expectedOutput: "次郎の年齢は不明です"
    },
    {
      id: 102,
      title: "null合体演算子??と??=",
      explanation: `<p><strong>null合体演算子</strong><code>??</code>は「左側がnullまたは未定義なら右側を返す」演算子です。設定値のデフォルト値を用意するときに非常によく使います。</p>
<pre><code>&lt;?php
$config = ['name' =&gt; 'MyApp'];
// キーが存在しなくてもWarningが出ず、デフォルト値30が使われる
$timeout = $config['timeout'] ?? 30;</code></pre>
<p>似た演算子に<code>?:</code>（エルビス演算子）がありますが、判定条件が異なります。</p>
<table>
<tr><th>式</th><th>右側が使われる条件</th><th>未定義キーへのアクセス</th></tr>
<tr><td><code>$a ?? $b</code></td><td>$aがnullまたは未定義のとき</td><td>Warningが出ない</td></tr>
<tr><td><code>$a ?: $b</code></td><td>$aがfalsy（0・''・false・null・空配列）のとき</td><td>Warningが出る</td></tr>
</table>
<p><code>0</code>や空文字が正当な値になり得る場面で<code>?:</code>を使うと、意図せずデフォルト値に置き換わるバグになります。「nullのときだけデフォルトにしたい」なら<code>??</code>を選びましょう。</p>
<p>さらに<strong>null合体代入演算子</strong><code>??=</code>を使うと、「変数（またはキー）がnullか未定義のときだけ代入する」処理を1行で書けます。</p>
<pre><code>&lt;?php
$config['debug'] ??= false;   // 未定義なのでfalseが代入される
$config['name'] ??= 'Default'; // 既に値があるので何も起きない</code></pre>
<p>初期化済みかどうかをifで確認してから代入するコードを、簡潔かつWarningなしに書ける便利な演算子です。</p>`,
      task: `<code>isset</code>と三項演算子で書かれたデフォルト値の処理を<code>??</code>で書き換え、さらに<code>$config['debug']</code>の初期化を<code>??=</code>で行ってください。`,
      code: `<?php
$config = ['name' => 'MyApp'];

// TODO: 以下2行をnull合体演算子??を使った形に書き換える
$name = isset($config['name']) ? $config['name'] : 'NoName';
$timeout = isset($config['timeout']) ? $config['timeout'] : 30;

echo 'name: ' . $name . PHP_EOL;
echo 'timeout: ' . $timeout . PHP_EOL;

// TODO: ??=を使って、$config['debug']が未定義のときだけfalseを代入する

var_dump($config['debug']);
// 既に値があるキーに??=しても上書きされないことを確認
$config['name'] ??= 'Default';
echo 'name is still ' . $config['name'] . PHP_EOL;`,
      solution: `<?php
$config = ['name' => 'MyApp'];

// null合体演算子??で書き換えた形
$name = $config['name'] ?? 'NoName';
$timeout = $config['timeout'] ?? 30;

echo 'name: ' . $name . PHP_EOL;
echo 'timeout: ' . $timeout . PHP_EOL;

// ??=で、$config['debug']が未定義のときだけfalseを代入する
$config['debug'] ??= false;

var_dump($config['debug']);
// 既に値があるキーに??=しても上書きされないことを確認
$config['name'] ??= 'Default';
echo 'name is still ' . $config['name'] . PHP_EOL;`,
      hints: [
        `<code>isset($x) ? $x : デフォルト</code>というパターンは、<code>$x ?? デフォルト</code>と同じ意味です。`,
        `初期化は<code>$config['debug'] ??= false;</code>の1行で書けます。`,
        `??は未定義キーにアクセスしてもWarningが出ない点が重要です。`
      ],
      expectedOutput: "timeout: 30"
    },
    {
      id: 103,
      title: "nullsafe演算子?->（PHP 8）",
      explanation: `<p>オブジェクトのプロパティやメソッドにアクセスするとき、その変数が<code>null</code>だと「Call to a member function ... on null」という致命的なエラーになります。PHP 8で導入された<strong>nullsafe演算子</strong><code>?-&gt;</code>を使うと、「左側がnullなら、それ以降を実行せずに式全体をnullにする」という安全なアクセスができます。</p>
<pre><code>&lt;?php
// $user-&gt;profileがnullでもエラーにならず、$cityはnullになる
$city = $user-&gt;profile?-&gt;city;</code></pre>
<p>従来はifで段階的にnullチェックを書く必要がありましたが、<code>?-&gt;</code>なら1行で書けます。チェーン（連続アクセス）の途中にnullが現れた時点で評価が打ち切られる（短絡評価）ため、深い階層のアクセスに特に有効です。</p>
<table>
<tr><th>書き方</th><th>$profileがnullのときの動作</th></tr>
<tr><td><code>$user-&gt;profile-&gt;city</code></td><td>致命的エラー（Error例外）</td></tr>
<tr><td><code>$user-&gt;profile?-&gt;city</code></td><td>式全体がnullになる</td></tr>
</table>
<p>さらに前ステップの<code>??</code>と組み合わせると、「nullなら代わりの値を使う」まで含めて1行で表現できます。</p>
<pre><code>&lt;?php
echo $user-&gt;profile?-&gt;city ?? '未登録';</code></pre>
<p>注意点として、<code>?-&gt;</code>は「nullかもしれないのが正常な設計」の場所にだけ使いましょう。本来nullになるはずのない場所に付けると、バグの発見が遅れる原因になります。</p>`,
      task: `<code>$jiro->profile</code>は<code>null</code>のため、実行するとエラーになります。nullsafe演算子<code>?-></code>と<code>??</code>を使って、プロフィール未登録の場合は「未登録」と表示されるように修正してください。`,
      code: `<?php
class Profile
{
    public string $city;

    public function __construct(string $city)
    {
        $this->city = $city;
    }
}

class User
{
    public string $name;
    public ?Profile $profile;

    public function __construct(string $name, ?Profile $profile)
    {
        $this->name = $name;
        $this->profile = $profile;
    }
}

$taro = new User('太郎', new Profile('東京'));
$jiro = new User('次郎', null);

// TODO: nullsafe演算子?->と??を使い、profileがnullなら「未登録」と表示する
echo $taro->name . 'の住まい: ' . $taro->profile->city . PHP_EOL;
echo $jiro->name . 'の住まい: ' . $jiro->profile->city . PHP_EOL;`,
      solution: `<?php
class Profile
{
    public string $city;

    public function __construct(string $city)
    {
        $this->city = $city;
    }
}

class User
{
    public string $name;
    public ?Profile $profile;

    public function __construct(string $name, ?Profile $profile)
    {
        $this->name = $name;
        $this->profile = $profile;
    }
}

$taro = new User('太郎', new Profile('東京'));
$jiro = new User('次郎', null);

// nullsafe演算子?->はprofileがnullのとき式全体をnullにする
echo $taro->name . 'の住まい: ' . ($taro->profile?->city ?? '未登録') . PHP_EOL;
echo $jiro->name . 'の住まい: ' . ($jiro->profile?->city ?? '未登録') . PHP_EOL;`,
      hints: [
        `<code>-></code>を<code>?-></code>に変えると、左側がnullのときエラーではなくnullになります。`,
        `<code>$jiro->profile?->city</code>はnullになるので、<code>?? '未登録'</code>でデフォルト表示に置き換えられます。`,
        `文字列連結の中で??を使うときは、<code>($a ?? 'デフォルト')</code>のように括弧で囲むと安全です。`
      ],
      expectedOutput: "次郎の住まい: 未登録"
    },
    {
      id: 104,
      title: "enumの基本（PHP 8.1）",
      explanation: `<p><strong>enum（列挙型）</strong>は、「取り得る値が有限個に決まっている」ことを型として表現する仕組みです。PHP 8.1で導入されました。たとえば季節は春・夏・秋・冬の4つしかありません。これを文字列<code>'spring'</code>などで表すとタイプミスに気づけませんが、enumなら存在しないケースを書いた時点でエラーになります。</p>
<pre><code>&lt;?php
enum Season
{
    case Spring;
    case Summer;
    case Autumn;
    case Winter;
}

$season = Season::Spring;      // ケースは「クラス名::ケース名」で取得
echo $season-&gt;name;            // ケース名の文字列 'Spring' が得られる
var_dump($season === Season::Spring); // bool(true)</code></pre>
<p>enumの各ケースは<strong>それぞれ唯一のオブジェクト</strong>（シングルトン）なので、<code>===</code>で安全に比較できます。関数の引数型に<code>Season</code>と書けば、4つのケース以外は絶対に渡せなくなります。</p>
<table>
<tr><th>表現方法</th><th>タイプミス</th><th>取り得る値の限定</th></tr>
<tr><td>文字列 <code>'spring'</code></td><td>実行するまで気づけない</td><td>できない</td></tr>
<tr><td>定数 <code>SEASON_SPRING</code></td><td>気づける</td><td>できない（ただのintなど）</td></tr>
<tr><td>enum <code>Season::Spring</code></td><td>即座にエラー</td><td>できる</td></tr>
</table>
<p>このステップで扱うのは値を持たない<strong>Pure Enum</strong>です。次のステップで、各ケースに値を持たせるBacked Enumを学びます。</p>`,
      task: `コードを実行して、enumのケースの取得・<code>name</code>プロパティ・<code>===</code>比較の動作を観察してください。その後、<code>$season</code>を<code>Season::Winter</code>に変更して、出力の変化を確認してください。`,
      code: `<?php
// 季節を表すenum。取り得る値はこの4つだけ
enum Season
{
    case Spring;
    case Summer;
    case Autumn;
    case Winter;
}

// TODO: まずこのまま実行して出力を観察し、
// 次にSeason::Winterに変更して再実行する
$season = Season::Spring;

echo 'ケース名: ' . $season->name . PHP_EOL;
var_dump($season === Season::Spring);
var_dump($season === Season::Winter);

// enumを引数型にすると、Season以外の値は渡せない
function isCold(Season $season): bool
{
    return $season === Season::Winter;
}
var_dump(isCold($season));`,
      solution: `<?php
// 季節を表すenum。取り得る値はこの4つだけ
enum Season
{
    case Spring;
    case Summer;
    case Autumn;
    case Winter;
}

// Season::Winterに変更して動作を確認する
$season = Season::Winter;

echo 'ケース名: ' . $season->name . PHP_EOL;
var_dump($season === Season::Spring);
var_dump($season === Season::Winter);

// enumを引数型にすると、Season以外の値は渡せない
function isCold(Season $season): bool
{
    return $season === Season::Winter;
}
var_dump(isCold($season));`,
      hints: [
        `enumのケースは<code>Season::Winter</code>のように「enum名::ケース名」で参照します。`,
        `<code>->name</code>はケース名そのままの文字列（例：'Winter'）を返します。`,
        `変更後は===の比較結果とisCold()の結果がどう変わるか予想してから実行しましょう。`
      ],
      expectedOutput: "ケース名: Winter"
    },
    {
      id: 105,
      title: "Backed Enum（値付きenum）",
      explanation: `<p>前ステップのPure Enumは値を持ちませんでしたが、実務ではenumをデータベースの値やAPIのパラメータ（文字列や数値）と対応させたい場面が多くあります。そこで使うのが<strong>Backed Enum（値に裏付けられたenum）</strong>です。</p>
<pre><code>&lt;?php
// enum名の後ろに「: string」で値の型を宣言する
enum Status: string
{
    case Draft = 'draft';
    case Published = 'published';
    case Archived = 'archived';
}

$status = Status::Published;
echo $status-&gt;name;  // 'Published'（ケース名）
echo $status-&gt;value; // 'published'（裏付けの値）</code></pre>
<p>ポイントは次のとおりです。</p>
<ul>
<li>値の型は<code>string</code>か<code>int</code>のどちらかを指定する（混在は不可）</li>
<li>すべてのケースに一意な値を割り当てる必要がある（重複はエラー）</li>
<li><code>-&gt;value</code>で裏付けの値を、<code>-&gt;name</code>でケース名を取得できる</li>
</ul>
<table>
<tr><th>プロパティ</th><th>返すもの</th><th>Status::Publishedの場合</th></tr>
<tr><td><code>-&gt;name</code></td><td>ケース名（Pure/Backed共通）</td><td>'Published'</td></tr>
<tr><td><code>-&gt;value</code></td><td>裏付けの値（Backedのみ）</td><td>'published'</td></tr>
</table>
<p>データベースに保存するときは<code>-&gt;value</code>を書き込み、読み出した値からenumに戻す——という往復が実務の定番パターンです（値からenumへ戻す方法はステップ108で学びます）。</p>`,
      task: `enum <code>Status</code>をBacked Enumに書き換えてください。値の型は<code>string</code>とし、<code>Draft</code>に<code>'draft'</code>、<code>Published</code>に<code>'published'</code>、<code>Archived</code>に<code>'archived'</code>を割り当てます。`,
      code: `<?php
// TODO: このPure EnumをBacked Enumに書き換える
// 1. enum名の後ろに「: string」を付ける
// 2. 各ケースに = で値を割り当てる（'draft'など小文字の文字列）
enum Status
{
    case Draft;
    case Published;
    case Archived;
}

$status = Status::Published;
echo 'name: ' . $status->name . PHP_EOL;
// Backed Enumにすると->valueが使えるようになる
echo 'value: ' . $status->value . PHP_EOL;

// データベース保存用の値として使える
echo "UPDATE posts SET status = '" . $status->value . "'" . PHP_EOL;`,
      solution: `<?php
// Backed Enum：enum名の後ろに値の型を宣言し、各ケースに一意な値を割り当てる
enum Status: string
{
    case Draft = 'draft';
    case Published = 'published';
    case Archived = 'archived';
}

$status = Status::Published;
echo 'name: ' . $status->name . PHP_EOL;
// Backed Enumでは->valueで裏付けの値を取得できる
echo 'value: ' . $status->value . PHP_EOL;

// データベース保存用の値として使える
echo "UPDATE posts SET status = '" . $status->value . "'" . PHP_EOL;`,
      hints: [
        `宣言は<code>enum Status: string</code>のように、enum名の後ろにコロンと型を書きます。`,
        `各ケースは<code>case Draft = 'draft';</code>のように=で値を割り当てます。`,
        `値を割り当て忘れたケースが1つでもあると構文エラーになります。`
      ],
      expectedOutput: "value: published"
    },
    {
      id: 106,
      title: "enumのメソッド",
      explanation: `<p>enumはクラスと同じように<strong>メソッドを持つことができます</strong>。これがenumを単なる定数の集まりと分ける大きな特徴です。「そのケースに応じた表示名」「そのケースに応じた判定」といったロジックをenum自身に持たせられます。</p>
<pre><code>&lt;?php
enum Status: string
{
    case Draft = 'draft';
    case Published = 'published';

    // メソッド内では$thisが「現在のケース」を指す
    public function isEditable(): bool
    {
        return $this === Status::Draft;
    }
}

echo Status::Draft-&gt;isEditable() ? '編集可' : '編集不可';</code></pre>
<p>メソッド内の<code>$this</code>は、呼び出し元のケースそのものです。<code>Status::Draft-&gt;isEditable()</code>と呼べば<code>$this</code>は<code>Status::Draft</code>になります。</p>
<p>enumがクラスと違う点にも注意しましょう。</p>
<ul>
<li>インスタンス化できない（<code>new Status()</code>はエラー）</li>
<li>状態を持つプロパティは定義できない（<code>name</code>と<code>value</code>は自動で提供される読み取り専用）</li>
<li>定数・staticメソッド・インターフェイスの実装は可能</li>
</ul>
<p>「ステータスごとの日本語ラベルをどこに書くか」という問題は実務で頻出です。表示側のあちこちにif文を書く代わりにenumのメソッドに集約すれば、ケース追加時の修正漏れを防げます。</p>`,
      task: `enum <code>Status</code>に、ケースに応じた日本語名を返すメソッド<code>label(): string</code>を追加してください。<code>Draft</code>は「下書き」、<code>Published</code>は「公開済み」、<code>Archived</code>は「アーカイブ」を返します。`,
      code: `<?php
enum Status: string
{
    case Draft = 'draft';
    case Published = 'published';
    case Archived = 'archived';

    // TODO: 日本語名を返すメソッドlabel()を追加する
    // $thisと===で比較し、Draftなら'下書き'、Publishedなら'公開済み'、
    // Archivedなら'アーカイブ'を返す

    public function isEditable(): bool
    {
        // 下書きだけ編集できる
        return $this === Status::Draft;
    }
}

echo Status::Draft->label() . PHP_EOL;
echo Status::Published->label() . PHP_EOL;
var_dump(Status::Published->isEditable());`,
      solution: `<?php
enum Status: string
{
    case Draft = 'draft';
    case Published = 'published';
    case Archived = 'archived';

    // ケースに応じた日本語名を返すメソッド
    public function label(): string
    {
        if ($this === Status::Draft) {
            return '下書き';
        }
        if ($this === Status::Published) {
            return '公開済み';
        }
        return 'アーカイブ';
    }

    public function isEditable(): bool
    {
        // 下書きだけ編集できる
        return $this === Status::Draft;
    }
}

echo Status::Draft->label() . PHP_EOL;
echo Status::Published->label() . PHP_EOL;
var_dump(Status::Published->isEditable());`,
      hints: [
        `メソッドの書き方はクラスと同じで、<code>public function label(): string { ... }</code>です。`,
        `メソッド内では<code>$this === Status::Draft</code>のように、$thisとケースを===で比較できます。`,
        `if文の連続で書いてかまいません（次のステップでもっとスマートな書き方を学びます）。`
      ],
      expectedOutput: "公開済み"
    },
    {
      id: 107,
      title: "enumとmatch式の組み合わせ",
      explanation: `<p>前ステップではif文の連続でケースを判定しましたが、enumには<strong>match式</strong>との組み合わせが最適です。matchは厳密比較（===）で分岐するため、ケースがオブジェクトであるenumと相性が抜群です。</p>
<pre><code>&lt;?php
enum Level
{
    case Low;
    case Middle;
    case High;

    public function color(): string
    {
        return match ($this) {
            Level::Low =&gt; 'green',
            Level::Middle =&gt; 'yellow',
            Level::High =&gt; 'red',
        };
    }
}</code></pre>
<p>enumとmatchの組み合わせには、if文にはない大きな利点があります。それは<strong>網羅性のチェック</strong>です。matchはどの分岐にも一致しないと<code>UnhandledMatchError</code>を投げるため、後からenumにケースを追加してmatchの修正を忘れると、実行時に即座に気づけます。if文の書き忘れは黙って素通りするのと対照的です。</p>
<table>
<tr><th>比較</th><th>if文の連続</th><th>match式</th></tr>
<tr><td>比較方法</td><td>自分で===を書く</td><td>常に===</td></tr>
<tr><td>ケースの書き忘れ</td><td>気づけない</td><td>UnhandledMatchErrorで検出</td></tr>
<tr><td>戻り値</td><td>各分岐でreturn</td><td>式なので値を直接返せる</td></tr>
</table>
<p>matchは文ではなく<strong>式</strong>なので、<code>return match (...) { ... };</code>と1つのreturnにまとめられ、コードが宣言的で読みやすくなります。enumのメソッド＋matchは現代PHPの定番イディオムとして覚えておきましょう。</p>`,
      task: `if文の連続で書かれたメソッド<code>stars()</code>を、match式を使った形に書き換えてください。動作は変えないこと。`,
      code: `<?php
enum Level
{
    case Low;
    case Middle;
    case High;

    // TODO: このif文の連続をmatch式1つに書き換える
    // return match ($this) { ... }; の形にする
    public function stars(): string
    {
        if ($this === Level::Low) {
            return '*';
        }
        if ($this === Level::Middle) {
            return '**';
        }
        return '***';
    }
}

echo 'Low: ' . Level::Low->stars() . PHP_EOL;
echo 'Middle: ' . Level::Middle->stars() . PHP_EOL;
echo 'High: ' . Level::High->stars() . PHP_EOL;`,
      solution: `<?php
enum Level
{
    case Low;
    case Middle;
    case High;

    // match式は$thisと各ケースを===で比較し、一致した腕の値を返す
    public function stars(): string
    {
        return match ($this) {
            Level::Low => '*',
            Level::Middle => '**',
            Level::High => '***',
        };
    }
}

echo 'Low: ' . Level::Low->stars() . PHP_EOL;
echo 'Middle: ' . Level::Middle->stars() . PHP_EOL;
echo 'High: ' . Level::High->stars() . PHP_EOL;`,
      hints: [
        `match式の形は<code>match ($this) { Level::Low => '*', ... }</code>です。各腕はカンマで区切ります。`,
        `matchは式なので、<code>return match ($this) { ... };</code>と直接returnできます。`,
        `3つのケースすべてに腕を書けば、defaultは不要です（網羅性チェックが働きます）。`
      ],
      expectedOutput: "High: ***"
    },
    {
      id: 108,
      title: "tryFromとfrom",
      explanation: `<p>Backed Enumの実務での使いどころは、データベースやフォーム入力などの「外部から来た文字列・数値」をenumに変換する場面です。そのための静的メソッドが<code>from()</code>と<code>tryFrom()</code>で、Backed Enumに自動的に備わっています。</p>
<pre><code>&lt;?php
enum Status: string
{
    case Draft = 'draft';
    case Published = 'published';
}

$a = Status::from('draft');      // Status::Draft
$b = Status::tryFrom('invalid'); // null（例外は投げない）
$c = Status::from('invalid');    // ValueErrorが投げられる！</code></pre>
<p>2つの違いは「変換できない値が来たときの挙動」だけです。</p>
<table>
<tr><th>メソッド</th><th>変換成功時</th><th>変換失敗時</th><th>使いどころ</th></tr>
<tr><td><code>from()</code></td><td>enumケースを返す</td><td>ValueErrorを投げる</td><td>不正値が来たらバグとして即座に止めたい場面</td></tr>
<tr><td><code>tryFrom()</code></td><td>enumケースを返す</td><td>nullを返す</td><td>不正値をデフォルト値などで穏当に処理したい場面</td></tr>
</table>
<p><code>tryFrom()</code>はnullを返すので、この章で学んだ<code>??</code>と組み合わせるときれいに書けます。</p>
<pre><code>&lt;?php
// 不正な入力ならDraft扱いにする
$status = Status::tryFrom($input) ?? Status::Draft;</code></pre>
<p>「信頼できる内部データにはfrom、信頼できない外部入力にはtryFrom＋??」という使い分けが基本方針です。なお、これらは値（value）からの変換であり、ケース名（name）からの変換ではない点に注意してください。</p>`,
      task: `このコードは不正な値<code>'unknown'</code>を<code>from()</code>に渡しているため、ValueErrorで停止します。<code>tryFrom()</code>と<code>??</code>を使って、変換できないときは<code>Status::Draft</code>にフォールバックするよう修正してください。`,
      code: `<?php
enum Status: string
{
    case Draft = 'draft';
    case Published = 'published';
    case Archived = 'archived';
}

// 正常な値の変換：これは成功する
$s = Status::from('published');
echo '変換成功: ' . $s->name . PHP_EOL;

// TODO: 'unknown'は変換できずValueErrorになる。
// tryFrom()と??を使い、失敗時はStatus::Draftになるよう修正する
$input = 'unknown';
$t = Status::from($input);
echo 'fallback: ' . $t->name . PHP_EOL;`,
      solution: `<?php
enum Status: string
{
    case Draft = 'draft';
    case Published = 'published';
    case Archived = 'archived';
}

// 正常な値の変換：これは成功する
$s = Status::from('published');
echo '変換成功: ' . $s->name . PHP_EOL;

// tryFrom()は変換できないときnullを返すので、??でデフォルトを指定できる
$input = 'unknown';
$t = Status::tryFrom($input) ?? Status::Draft;
echo 'fallback: ' . $t->name . PHP_EOL;`,
      hints: [
        `<code>from()</code>は失敗すると例外、<code>tryFrom()</code>は失敗するとnullを返します。`,
        `nullが返る可能性があるなら、ステップ102で学んだ??でデフォルト値を用意できます。`,
        `<code>Status::tryFrom($input) ?? Status::Draft</code>の形になります。`
      ],
      expectedOutput: "fallback: Draft"
    },
    {
      id: 109,
      title: "enum casesで全ケース列挙",
      explanation: `<p>すべてのenumには静的メソッド<code>cases()</code>が自動的に備わっていて、<strong>全ケースを定義順に並べた配列</strong>を返します。「選択肢の一覧を画面に表示する」「全ケースをループで処理する」といった場面の必須メソッドです。</p>
<pre><code>&lt;?php
enum Size: string
{
    case S = 'small';
    case M = 'medium';
    case L = 'large';
}

foreach (Size::cases() as $size) {
    echo $size-&gt;name . ' =&gt; ' . $size-&gt;value . PHP_EOL;
}
// S =&gt; small
// M =&gt; medium
// L =&gt; large</code></pre>
<p><code>cases()</code>はPure EnumでもBacked Enumでも使えます。返るのはenumケースのオブジェクトの配列なので、各要素に対して<code>-&gt;name</code>や<code>-&gt;value</code>、そのenumに定義したメソッドも呼べます。</p>
<p>実務でよくある応用が「セレクトボックスの選択肢生成」です。ケースを追加すれば一覧にも自動で反映されるため、選択肢の定義がenumの1か所に集約されます。</p>
<pre><code>&lt;?php
// value =&gt; 表示名 の連想配列を組み立てる定番パターン
$options = [];
foreach (Size::cases() as $size) {
    $options[$size-&gt;value] = $size-&gt;name;
}</code></pre>
<p>また<code>count(Size::cases())</code>でケース数も取得できます。「全ケースを網羅するテストを書く」ときにも活躍する、地味ながら重要なメソッドです。</p>`,
      task: `<code>cases()</code>を使って全ケースを<code>foreach</code>でループし、「ケース名 => 値」の形式で1行ずつ表示してください。最後にケース数を「全部で3種類」と表示してください。`,
      code: `<?php
enum Size: string
{
    case S = 'small';
    case M = 'medium';
    case L = 'large';
}

// TODO: Size::cases()をforeachでループし、
// 「S => small」の形式で1行ずつ表示する

// TODO: count()とcases()を使って「全部で3種類」と表示する
`,
      solution: `<?php
enum Size: string
{
    case S = 'small';
    case M = 'medium';
    case L = 'large';
}

// cases()は全ケースを定義順に並べた配列を返す
foreach (Size::cases() as $size) {
    echo $size->name . ' => ' . $size->value . PHP_EOL;
}

// ケース数はcount()で数えられる
echo '全部で' . count(Size::cases()) . '種類' . PHP_EOL;`,
      hints: [
        `<code>Size::cases()</code>はenumケースの配列を返すので、そのままforeachに渡せます。`,
        `ループ変数はenumケースなので、<code>->name</code>と<code>->value</code>が使えます。`,
        `ケース数は<code>count(Size::cases())</code>で取得できます。`
      ],
      expectedOutput: "全部で3種類"
    },
    {
      id: 110,
      title: "総合演習（信号機enum）",
      explanation: `<p>この章の総仕上げとして、信号機をenumでモデリングします。使う知識はすべて学習済みです。</p>
<ul>
<li><strong>Backed Enum</strong>（ステップ105）：外部入力の文字列と対応させる</li>
<li><strong>メソッド＋match式</strong>（ステップ106〜107）：ケースごとのラベルと動作</li>
<li><strong>tryFromと??</strong>（ステップ102、108）：不正入力への安全なフォールバック</li>
<li><strong>cases()</strong>（ステップ109）：全信号の一覧表示</li>
</ul>
<p>今回の設計ポイントは、<strong>enumが自分自身の型を返すメソッドを持てる</strong>ことです。信号は「青→黄→赤→青…」と決まった順で切り替わるので、この遷移ルールを<code>next(): Signal</code>というメソッドでenum自身に持たせます。</p>
<pre><code>&lt;?php
public function next(): Signal
{
    return match ($this) {
        Signal::Green =&gt; Signal::Yellow,
        Signal::Yellow =&gt; Signal::Red,
        Signal::Red =&gt; Signal::Green,
    };
}</code></pre>
<p>状態遷移をmatchで書くと「どの状態からどの状態へ移るか」が一覧表のように読め、遷移ルールの追加・変更にも強くなります。ステートマシン（状態遷移機械）の最小構成であり、注文ステータスや承認フローなど実務の多くの場面に応用できる型です。</p>
<p>もう1つのポイントは外部入力の扱いです。ユーザー入力のような信頼できない文字列は<code>tryFrom() ?? デフォルト</code>で受け止め、以降の処理ではenumだけを信頼して扱う——境界で変換を済ませる設計を意識しましょう。</p>`,
      task: `enum <code>Signal</code>を完成させてください。(1)<code>label()</code>：赤・黄・青を返す (2)<code>action()</code>：止まれ・注意・進めを返す (3)<code>next()</code>：青→黄→赤→青の順で次の信号を返す。さらに(4)<code>cases()</code>で全信号を「◯信号: ◯◯」形式で表示し、(5)<code>tryFrom</code>で入力<code>'yellow'</code>を安全に変換してください。`,
      code: `<?php
enum Signal: string
{
    case Red = 'red';
    case Yellow = 'yellow';
    case Green = 'green';

    // TODO: label() 赤・黄・青を返すメソッドをmatch式で作る

    // TODO: action() 止まれ・注意・進めを返すメソッドをmatch式で作る

    // TODO: next() 次の信号を返すメソッドをmatch式で作る
    // 遷移順：Green -> Yellow -> Red -> Green
}

// TODO: cases()で全信号を「赤信号: 止まれ」の形式で表示する

// 青から始めて3回切り替える
$current = Signal::Green;
for ($i = 0; $i < 3; $i++) {
    $next = $current->next();
    echo $current->label() . ' -> ' . $next->label() . PHP_EOL;
    $current = $next;
}

// TODO: 入力文字列'yellow'をtryFromと??で安全に変換する（失敗時はRed）
$input = 'yellow';
$signal = null;
echo '入力 ' . $input . ' は' . $signal->label() . '信号です' . PHP_EOL;`,
      solution: `<?php
enum Signal: string
{
    case Red = 'red';
    case Yellow = 'yellow';
    case Green = 'green';

    // 信号の色名を返す
    public function label(): string
    {
        return match ($this) {
            Signal::Red => '赤',
            Signal::Yellow => '黄',
            Signal::Green => '青',
        };
    }

    // 信号が指示する行動を返す
    public function action(): string
    {
        return match ($this) {
            Signal::Red => '止まれ',
            Signal::Yellow => '注意',
            Signal::Green => '進め',
        };
    }

    // 次の信号を返す（状態遷移をenum自身が知っている）
    public function next(): Signal
    {
        return match ($this) {
            Signal::Green => Signal::Yellow,
            Signal::Yellow => Signal::Red,
            Signal::Red => Signal::Green,
        };
    }
}

// 全信号の一覧を表示する
foreach (Signal::cases() as $signal) {
    echo $signal->label() . '信号: ' . $signal->action() . PHP_EOL;
}

// 青から始めて3回切り替える
$current = Signal::Green;
for ($i = 0; $i < 3; $i++) {
    $next = $current->next();
    echo $current->label() . ' -> ' . $next->label() . PHP_EOL;
    $current = $next;
}

// 外部入力はtryFromと??で安全に変換する（失敗時はRed）
$input = 'yellow';
$signal = Signal::tryFrom($input) ?? Signal::Red;
echo '入力 ' . $input . ' は' . $signal->label() . '信号です' . PHP_EOL;`,
      hints: [
        `3つのメソッドはすべて<code>return match ($this) { ... };</code>の形で書けます（ステップ107参照）。`,
        `一覧表示は<code>foreach (Signal::cases() as $signal)</code>で全ケースを回します（ステップ109参照）。`,
        `入力の変換は<code>Signal::tryFrom($input) ?? Signal::Red</code>です（ステップ108参照）。`
      ],
      expectedOutput: "青 -> 黄"
    }
  ]
});
