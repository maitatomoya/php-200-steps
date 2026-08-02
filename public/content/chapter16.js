// 第16章：名前空間と構造化
registerChapter({
  number: 16,
  title: "名前空間と構造化",
  description: "namespaceによる名前の整理から、オートローディングの概念、値オブジェクトやサービスクラスを使ったコードの構造化までを学びます。",
  steps: [
    {
      id: 151,
      title: "namespaceの基本",
      explanation: `<p>名前空間（namespace）は、クラスや関数の名前が衝突しないように「所属」を付ける仕組みです。たとえばライブラリAとライブラリBの両方が<code>User</code>クラスを持っていても、<code>LibA\\User</code>と<code>LibB\\User</code>という別の完全修飾名（フルネーム）になるため共存できます。</p>
<p>名前空間の区切り文字はバックスラッシュ<code>\\</code>です。通常は1ファイル1名前空間で<code>namespace App;</code>と1行書くだけですが、文法の理解のために、このステップでは波かっこ構文で1ファイルに複数の名前空間を書いてみます。</p>
<pre><code>namespace App {
    function hello(): string
    {
        return __NAMESPACE__ . "のhello";
    }
}

namespace Lib {
    function hello(): string
    {
        return __NAMESPACE__ . "のhello";
    }
}

namespace {
    // グローバルコードは名前なしのnamespaceブロックに書く
    echo \\App\\hello(); // Appのhello
    echo \\Lib\\hello(); // Libのhello
}
</code></pre>
<p>ポイントを整理します。</p>
<ul>
<li><code>__NAMESPACE__</code>は現在の名前空間名が入るマジック定数（グローバル空間では空文字）</li>
<li>波かっこ構文を使う場合、名前空間の外にコードは書けない。グローバルコードは<code>namespace { }</code>（名前なしブロック）に入れる</li>
<li>別の名前空間のものを呼ぶには<code>\\App\\hello()</code>のように先頭に<code>\\</code>を付けた完全修飾名を使う</li>
</ul>
<p>実務で1ファイルに複数のnamespaceを書くことはほぼありませんが、「同じ関数名が共存できる」ことを一度自分の手で確かめておくと、名前空間の役割が腑に落ちます。</p>`,
      task: `<code>Lib</code>という名前空間を追加して同名の<code>hello()</code>関数を定義し、グローバルブロックから<code>\\Lib\\hello()</code>も呼び出してください。同じ関数名が共存できることを確認します。`,
      code: `<?php

namespace App {
    function hello(): string
    {
        // __NAMESPACE__には現在の名前空間名が入る
        return __NAMESPACE__ . "のhello";
    }
}

// TODO: Libという名前空間ブロックを追加し、
// 同じ名前のhello()関数を定義しよう

namespace {
    echo \\App\\hello() . "\\n";
    // TODO: \\Lib\\hello()も呼び出そう
    echo "現在の空間: グローバル" . "\\n";
}
`,
      solution: `<?php

namespace App {
    function hello(): string
    {
        // __NAMESPACE__には現在の名前空間名が入る
        return __NAMESPACE__ . "のhello";
    }
}

namespace Lib {
    // 名前空間が違えば同じ関数名を定義できる
    function hello(): string
    {
        return __NAMESPACE__ . "のhello";
    }
}

namespace {
    // グローバルコードは名前なしのnamespaceブロックに書く
    echo \\App\\hello() . "\\n";
    echo \\Lib\\hello() . "\\n";
    echo "現在の空間: グローバル" . "\\n";
}
`,
      hints: [
        `namespace Lib { ... } というブロックをAppブロックの後に追加します。中身はAppのhello()とほぼ同じで構いません。`,
        `呼び出しは echo \\Lib\\hello() . "\\n"; です。先頭の\\を忘れると「現在の名前空間からの相対名」と解釈されてしまいます。`,
      ],
      expectedOutput: "Appのhello"
    },
    {
      id: 152,
      title: "useとエイリアス",
      explanation: `<p>別の名前空間のクラスを使うたびに<code>\\App\\Models\\User</code>と完全修飾名を書くのは冗長です。<code>use</code>文でインポートすると、短い名前で参照できるようになります。</p>
<pre><code>namespace Main;

use App\\Models\\User;                    // 以後Userだけで使える
use App\\Models\\UserRepository as Repo;  // Repoという別名を付ける

$repo = new Repo();
$user = $repo-&gt;find(); // 戻り値はUser型
</code></pre>
<p>ポイントを整理します。</p>
<table>
<tr><th>書き方</th><th>意味</th></tr>
<tr><td><code>use App\\Models\\User;</code></td><td>Userという短い名前でインポート</td></tr>
<tr><td><code>use App\\Models\\User as Member;</code></td><td>Memberという別名（エイリアス）でインポート</td></tr>
<tr><td><code>use App\\Models\\{User, Post};</code></td><td>グループuse構文でまとめてインポート</td></tr>
</table>
<p><code>as</code>によるエイリアスは、次のような場面で活躍します。</p>
<ul>
<li><strong>名前の衝突を避ける</strong>：2つの名前空間から同名クラスをインポートしたいとき（<code>use LibA\\User; use LibB\\User as VendorUser;</code>）</li>
<li><strong>長いクラス名を短くする</strong>：深い階層のクラスを読みやすい名前にする</li>
</ul>
<p>注意点として、<code>use</code>は「そのファイル（またはnamespaceブロック）の中だけ」で有効です。インポートしたからといってクラスが読み込まれるわけではなく、あくまで「名前の付け替え表」を作るだけです。また、use文は名前空間宣言の直後、コードより前にまとめて書くのが慣例です。<code>instanceof</code>演算子でもインポートした短い名前がそのまま使えます。</p>`,
      task: `<code>use</code>で<code>App\\Models\\User</code>をインポートし、<code>App\\Models\\UserRepository</code>には<code>Repo</code>という別名を付けてください。<code>new Repo()</code>と<code>instanceof User</code>が短い名前で書けるようにします。`,
      code: `<?php

namespace App\\Models {
    class User
    {
        public function __construct(
            public readonly string $name,
        ) {
        }
    }

    class UserRepository
    {
        public function find(): User
        {
            return new User("佐藤");
        }
    }
}

namespace Main {
    // TODO: useでApp\\Models\\Userをインポートしよう
    // TODO: App\\Models\\UserRepositoryをRepoという別名でインポートしよう

    // TODO: 完全修飾名をやめて new Repo() に書き換えよう
    $repo = new \\App\\Models\\UserRepository();
    $user = $repo->find();
    echo $user->name . "さんを取得" . "\\n";

    // TODO: $userがUser型か instanceof で確認し、
    // 「User型です」と出力しよう（短い名前Userを使う）
}
`,
      solution: `<?php

namespace App\\Models {
    class User
    {
        public function __construct(
            public readonly string $name,
        ) {
        }
    }

    class UserRepository
    {
        public function find(): User
        {
            return new User("佐藤");
        }
    }
}

namespace Main {
    // useでインポートすると短い名前で使える
    use App\\Models\\User;
    // asで別名（エイリアス）を付けられる
    use App\\Models\\UserRepository as Repo;

    $repo = new Repo();
    $user = $repo->find();
    echo $user->name . "さんを取得" . "\\n";

    if ($user instanceof User) {
        echo "User型です" . "\\n";
    }
}
`,
      hints: [
        `use文はnamespaceブロックの先頭（他のコードより前）に書きます。use側の名前には先頭の\\は不要です。`,
        `別名は use App\\Models\\UserRepository as Repo; のようにasで付けます。`,
        `インポート後は new Repo() や $user instanceof User と短い名前で書けます。`,
      ],
      expectedOutput: "佐藤さんを取得"
    },
    {
      id: 153,
      title: "グローバル関数・クラスへのアクセス",
      explanation: `<p>名前空間の中から<code>count()</code>や<code>ArrayObject</code>などのグローバル（組み込み）の関数・クラスを使うとき、名前の解決ルールを知らないと思わぬエラーに出会います。関数とクラスでルールが違うのが最大のポイントです。</p>
<table>
<tr><th>種類</th><th>名前空間内で<code>count(...)</code>のように書いたら</th></tr>
<tr><td>関数・定数</td><td>まず現在の名前空間を探し、<strong>なければグローバルにフォールバック</strong>する</td></tr>
<tr><td>クラス</td><td>フォールバックは<strong>ない</strong>。現在の名前空間のクラスと解釈されて「Class App\\ArrayObject not found」になる</td></tr>
</table>
<pre><code>namespace App;

echo count([1, 2, 3]);        // OK: グローバルのcountにフォールバック
$obj = new ArrayObject([]);   // Error! App\\ArrayObjectを探してしまう
$obj = new \\ArrayObject([]);  // OK: 先頭の\\でグローバルを明示
</code></pre>
<p>先頭にバックスラッシュを付けた<code>\\strlen()</code>や<code>\\ArrayObject</code>は「グローバル空間のもの」を明示する書き方です。クラスは<code>use ArrayObject;</code>とインポートする方法もあります。</p>
<p>関数のフォールバックには落とし穴もあります。現在の名前空間に同名関数を定義すると、そちらが優先されて呼ばれるのです。</p>
<pre><code>namespace App;

function strlen(string $s): int  // グローバルのstrlenを覆い隠す
{
    return \\strlen($s) + 2;
}

echo strlen("abc");   // 5（App\\strlenが呼ばれる）
echo \\strlen("abc");  // 3（グローバルを明示）
</code></pre>
<p>実務ではグローバル関数に<code>\\</code>を付けるスタイルのプロジェクトもあります。これは可読性だけでなく、名前解決を省いてわずかに高速化する効果もあるためです。</p>`,
      task: `<code>new ArrayObject(...)</code>が「Class "App\\ArrayObject" not found」で落ちるのを、先頭に<code>\\</code>を付けて修正してください。実行して、関数のフォールバックと名前空間内関数の優先順位も観察しましょう。`,
      code: `<?php

namespace App;

$words = ["php", "namespace", "global"];

// 関数は名前空間内に同名関数がなければグローバルへフォールバックする
echo count($words) . "個の単語" . "\\n";

// \\を付けると常にグローバルの関数を明示的に指す
echo \\strtoupper($words[0]) . "\\n";

// TODO: このままだと「Class "App\\ArrayObject" not found」になる。
// グローバルのクラスを指すように\\を付けて修正しよう
$list = new ArrayObject($words);
echo "ArrayObjectの要素数: " . \\count($list) . "\\n";

// 名前空間内に同名関数を定義すると、そちらが優先される
function strlen(string $s): int
{
    // グローバルの\\strlen()に2を足すいたずらな実装
    return \\strlen($s) + 2;
}

echo strlen("abc") . "\\n";  // App\\strlenが呼ばれる
echo \\strlen("abc") . "\\n"; // グローバルのstrlen
`,
      solution: `<?php

namespace App;

$words = ["php", "namespace", "global"];

// 関数は名前空間内に同名関数がなければグローバルへフォールバックする
echo count($words) . "個の単語" . "\\n";

// \\を付けると常にグローバルの関数を明示的に指す
echo \\strtoupper($words[0]) . "\\n";

// クラスにはフォールバックがないので、グローバルクラスには\\が必須
$list = new \\ArrayObject($words);
echo "ArrayObjectの要素数: " . \\count($list) . "\\n";

// 名前空間内に同名関数を定義すると、そちらが優先される
function strlen(string $s): int
{
    // グローバルの\\strlen()に2を足すいたずらな実装
    return \\strlen($s) + 2;
}

echo strlen("abc") . "\\n";  // App\\strlenが呼ばれる（5）
echo \\strlen("abc") . "\\n"; // グローバルのstrlen（3）
`,
      hints: [
        `関数はグローバルへのフォールバックがありますが、クラスにはありません。`,
        `new \\ArrayObject($words) のように、クラス名の先頭に\\を付けるとグローバル空間のクラスを明示できます。`,
      ],
      expectedOutput: "ArrayObjectの要素数: 3"
    },
    {
      id: 154,
      title: "定数とnamespace",
      explanation: `<p>定数にも名前空間が適用されます。ただし定数の定義方法によって扱いが変わる点に注意が必要です。</p>
<table>
<tr><th>定義方法</th><th>名前空間の影響</th><th>特徴</th></tr>
<tr><td><code>const NAME = 値;</code></td><td>現在の名前空間に属する</td><td>コンパイル時に定義。トップレベルとクラス内で使える</td></tr>
<tr><td><code>define("NAME", 値)</code></td><td>常にグローバル定数になる</td><td>実行時に定義。条件分岐の中でも定義できる</td></tr>
</table>
<pre><code>namespace App\\Config;

const VERSION = "1.4.0";   // 完全修飾名は App\\Config\\VERSION
define("BUILD_NO", 42);    // どこに書いてもグローバルのBUILD_NO
</code></pre>
<p>別の名前空間の定数を使うには、完全修飾名で<code>\\App\\Config\\VERSION</code>と書くか、<code>use const</code>でインポートします。</p>
<pre><code>use const App\\Config\\VERSION;   // 定数のインポート
use function App\\Config\\helper; // 関数もuse functionでインポートできる

echo VERSION; // 1.4.0
</code></pre>
<p>クラスのuseと違い、定数は<code>use const</code>、関数は<code>use function</code>とキーワードが変わることを覚えておきましょう。</p>
<p>実務での使い分けの指針です。</p>
<ul>
<li>アプリの設定値のような定数は<code>const</code>で名前空間に属させるのが基本（どこ由来の定数か明確になる）</li>
<li><code>define()</code>は「実行時にしか値が決まらない」「条件付きで定義したい」場合の限られた用途に</li>
<li>関連する定数が増えてきたら、次のステップで学ぶクラス定数やenumへの集約を検討する</li>
</ul>
<p>なお、定数も関数と同様にグローバルへのフォールバックがあるため、名前空間内から<code>PHP_EOL</code>などの組み込み定数はそのまま使えます。</p>`,
      task: `<code>use const</code>で<code>APP_NAME</code>と<code>VERSION</code>をインポートして短い名前で出力してください。さらに<code>define("BUILD_NO", 42)</code>でグローバル定数を作り、「ビルド番号: 42」と出力してください。`,
      code: `<?php

namespace App\\Config {
    const APP_NAME = "PHP 200 Steps";
    const VERSION = "1.4.0";
    const DEBUG = true;
}

namespace Main {
    // TODO: use constでApp\\Config\\APP_NAMEとApp\\Config\\VERSIONをインポートしよう

    // TODO: インポートしたら短い名前（APP_NAME . " v" . VERSION）に書き換えよう
    echo \\App\\Config\\APP_NAME . " v" . \\App\\Config\\VERSION . "\\n";

    if (\\App\\Config\\DEBUG) {
        echo "デバッグモード" . "\\n";
    }

    // TODO: define("BUILD_NO", 42)でグローバル定数を作り、
    // 「ビルド番号: 42」と出力しよう
}
`,
      solution: `<?php

namespace App\\Config {
    const APP_NAME = "PHP 200 Steps";
    const VERSION = "1.4.0";
    const DEBUG = true;
}

namespace Main {
    // use constで定数もインポートできる
    use const App\\Config\\APP_NAME;
    use const App\\Config\\VERSION;

    echo APP_NAME . " v" . VERSION . "\\n";

    // 完全修飾名でもアクセスできる
    if (\\App\\Config\\DEBUG) {
        echo "デバッグモード" . "\\n";
    }

    // define()はどこに書いてもグローバル定数を作る
    define("BUILD_NO", 42);
    echo "ビルド番号: " . BUILD_NO . "\\n";
}
`,
      hints: [
        `定数のインポートはクラスと違い、use const App\\Config\\APP_NAME; のようにconstキーワードが必要です。`,
        `define("BUILD_NO", 42); は名前空間の中に書いてもグローバル定数になるため、そのままBUILD_NOで参照できます。`,
      ],
      expectedOutput: "PHP 200 Steps v1.4.0"
    },
    {
      id: 155,
      title: "オートローディングの概念",
      explanation: `<p>ここまでは1ファイルにすべてを書いてきましたが、実際のプロジェクトでは1クラス1ファイルに分割します。では、使うクラスのファイルを全部<code>require</code>で読み込むのかというと、現代のPHPでは書きません。<strong>オートローディング</strong>という仕組みが「クラスが必要になった瞬間に自動でファイルを読み込む」からです。</p>
<p>中心となるのが<code>spl_autoload_register()</code>です。未定義のクラスが使われたときに呼ばれる関数（オートローダー）を登録します。</p>
<pre><code>spl_autoload_register(function (string $class): void {
    // App\\Models\\Post -&gt; src/App/Models/Post.php
    $path = "src/" . str_replace("\\\\", "/", $class) . ".php";
    require $path;
});

$post = new App\\Models\\Post(); // この瞬間にオートローダーが動く
</code></pre>
<p>「名前空間の区切り<code>\\</code>をディレクトリ区切り<code>/</code>に置き換えてファイルパスにする」という対応関係の標準規約が<strong>PSR-4</strong>です。Composer（PHPのパッケージ管理ツール）を使うプロジェクトでは、<code>composer.json</code>に対応関係を書くだけでオートローダーが自動生成され、<code>spl_autoload_register</code>を自分で書くことはほぼありません。しかし裏側では今日学ぶこの仕組みが動いています。</p>
<p>このステップは実行環境の制約でファイル読み込みができないため、オートローダーが「いつ・どんな引数で呼ばれるか」を観察する疑似体験をします。<code>class_exists()</code>は第2引数がデフォルトtrueで、クラスが未定義ならオートローダーを起動します。ファイルを読み込まないオートローダーなのでクラスは見つからず、最終的に<code>false</code>が返ります。</p>
<ul>
<li>オートローダーには<strong>完全修飾名</strong>（先頭の<code>\\</code>なし）が渡される</li>
<li>一度も使われないクラスのファイルは読み込まれない＝起動が速い</li>
</ul>`,
      task: `まず実行して、オートローダーに渡されるクラス名と組み立てられるパスを観察してください。その後、探すクラス名を<code>'Shop\\Cart\\Item'</code>に変えて再実行し、パスの変化を確認してください（判定用の出力は元のクラス名に戻してから提出）。`,
      code: `<?php

// クラスが見つからないときに呼ばれる関数（オートローダー）を登録する
spl_autoload_register(function (string $class): void {
    // 本来はここでrequireするが、この教材では観察だけ行う
    $path = "src/" . str_replace("\\\\", "/", $class) . ".php";
    echo "オートロード要求: " . $class . "\\n";
    echo "読み込み予定のファイル: " . $path . "\\n";
});

// TODO: まず実行して出力を観察しよう。
// その後、クラス名を'Shop\\Cart\\Item'に変えて再実行し、
// パスがどう変わるか確認しよう（確認後は元に戻す）
$exists = class_exists('App\\Models\\Post');
echo "クラスは存在する? " . var_export($exists, true) . "\\n";
`,
      solution: `<?php

// クラスが見つからないときに呼ばれる関数（オートローダー）を登録する
spl_autoload_register(function (string $class): void {
    // 本来はここでクラス名からファイルパスを組み立ててrequireする
    // PSR-4の考え方: App\\Models\\Post -> src/App/Models/Post.php
    $path = "src/" . str_replace("\\\\", "/", $class) . ".php";
    echo "オートロード要求: " . $class . "\\n";
    echo "読み込み予定のファイル: " . $path . "\\n";
});

// class_existsは未定義クラスに対してオートローダーを起動する
// （このオートローダーはクラスを定義しないので結果はfalse）
$exists = class_exists('App\\Models\\Post');
echo "クラスは存在する? " . var_export($exists, true) . "\\n";
`,
      hints: [
        `このステップは観察が中心です。オートローダーに渡ってくる$classの中身（先頭に\\が付かない完全修飾名）に注目しましょう。`,
        `str_replace("\\\\", "/", $class)は「名前空間区切りをディレクトリ区切りに変換する」PSR-4の核となる発想です。`,
      ],
      expectedOutput: "読み込み予定のファイル: src/App/Models/Post.php"
    },
    {
      id: 156,
      title: "クラス定数とenumによる設定管理",
      explanation: `<p>設定値をバラバラの定数や文字列リテラルで管理すると、タイプミスや不正な値の混入に気づけません。クラス定数とenumに集約すると、型と名前空間の保護を受けられます。</p>
<p>まず、関連する設定値はクラス定数にまとめます。PHP 8.3からはクラス定数に型宣言も書けるようになりました。</p>
<pre><code>class AppConfig
{
    public const string NAME = "MiniBlog";
    public const int TIMEOUT_SEC = 30;
}

echo AppConfig::NAME; // クラス名::定数名でアクセス
</code></pre>
<p>次に、「決まった選択肢の中から1つ」という設定はenumが最適です。文字列定数と違い、存在しない値はそもそも作れません。</p>
<pre><code>enum Environment: string
{
    case Dev = "development";
    case Prod = "production";

    public function isDebug(): bool
    {
        return match ($this) {
            self::Dev =&gt; true,
            self::Prod =&gt; false,
        };
    }
}

$env = Environment::from("development"); // 不正な文字列ならValueError
</code></pre>
<p>ここで前章のmatch式の網羅性が活きてきます。<code>match ($this)</code>にdefaultを書かずに全caseを列挙しておけば、将来<code>case Staging</code>を追加したときに、対応を忘れた箇所がUnhandledMatchErrorで即座に発覚します。</p>
<table>
<tr><th>手段</th><th>向いている設定</th></tr>
<tr><td>クラス定数</td><td>アプリ名・タイムアウト値など「単一の固定値」</td></tr>
<tr><td>enum</td><td>環境・ステータスなど「決まった選択肢から1つ」</td></tr>
<tr><td>enum＋メソッド</td><td>選択肢ごとに振る舞いが変わる設定ロジック</td></tr>
</table>
<p>「設定値の意味と振る舞いを1か所に集約する」のがこのパターンの本質です。</p>`,
      task: `<code>AppConfig</code>に型付きクラス定数<code>NAME</code>（string型・"MiniBlog"）と<code>TIMEOUT_SEC</code>（int型・30）を定義し、<code>Environment::isDebug()</code>をmatch式で完成させてください。`,
      code: `<?php

namespace App\\Config;

enum Environment: string
{
    case Dev = "development";
    case Prod = "production";

    // TODO: match ($this) を使って完成させよう
    // Devならtrue、Prodならfalseを返す（defaultは書かない）
    public function isDebug(): bool
    {
        return true;
    }
}

class AppConfig
{
    // TODO: 型付きクラス定数を定義しよう
    // public const string NAME = "MiniBlog";
    // public const int TIMEOUT_SEC = 30;
}

$env = Environment::from("development");
echo AppConfig::NAME . " (" . $env->value . ")" . "\\n";
echo "デバッグ: " . ($env->isDebug() ? "有効" : "無効") . "\\n";
echo "タイムアウト: " . AppConfig::TIMEOUT_SEC . "秒" . "\\n";
`,
      solution: `<?php

namespace App\\Config;

enum Environment: string
{
    case Dev = "development";
    case Prod = "production";

    // enumにメソッドを持たせて設定ロジックを集約する
    // defaultなしのmatchで、caseの追加漏れを検出できる
    public function isDebug(): bool
    {
        return match ($this) {
            self::Dev => true,
            self::Prod => false,
        };
    }
}

class AppConfig
{
    // PHP 8.3からクラス定数に型宣言を書ける
    public const string NAME = "MiniBlog";
    public const int TIMEOUT_SEC = 30;
}

$env = Environment::from("development");
echo AppConfig::NAME . " (" . $env->value . ")" . "\\n";
echo "デバッグ: " . ($env->isDebug() ? "有効" : "無効") . "\\n";
echo "タイムアウト: " . AppConfig::TIMEOUT_SEC . "秒" . "\\n";
`,
      hints: [
        `クラス定数は public const string NAME = "MiniBlog"; のように「public const 型 名前 = 値;」の順で書きます。`,
        `enum内のmatchでは match ($this) { self::Dev => true, self::Prod => false } と自分自身のcaseで分岐します。`,
      ],
      expectedOutput: "MiniBlog (development)"
    },
    {
      id: 157,
      title: "静的ファクトリメソッドパターン",
      explanation: `<p>オブジェクトの生成方法が複数あるとき、コンストラクタ1つでは表現しきれません。そこで使うのが<strong>静的ファクトリメソッド</strong>（static factory method）です。「newの代わりにオブジェクトを作って返すstaticメソッド」を用意するパターンです。</p>
<pre><code>final class Temperature
{
    private function __construct(          // newを外から使えなくする
        public readonly float $celsius,
    ) {
    }

    public static function fromCelsius(float $c): self
    {
        return new self($c);
    }

    public static function fromFahrenheit(float $f): self
    {
        return new self(($f - 32) * 5 / 9); // 変換してから生成
    }
}

$t = Temperature::fromFahrenheit(212.0); // 摂氏100度
</code></pre>
<p>ポイントは2つあります。</p>
<ul>
<li><strong>コンストラクタをprivateにする</strong>ことで、生成経路をファクトリメソッドに限定できる。<code>new Temperature(212.0)</code>のような「華氏のつもりで摂氏に入れてしまう」事故を型レベルで防げる</li>
<li><code>new self(...)</code>はクラス内から自分自身のコンストラクタを呼ぶ書き方。privateでもクラス内からは呼べる</li>
</ul>
<p>このパターンの利点を整理します。</p>
<table>
<tr><th>利点</th><th>説明</th></tr>
<tr><td>名前で意図を表せる</td><td><code>fromCelsius</code>と<code>fromFahrenheit</code>で単位が明確</td></tr>
<tr><td>生成前の変換・検証を集約</td><td>変換式や入力チェックをメソッド内に閉じ込められる</td></tr>
<tr><td>生成経路を制限できる</td><td>privateコンストラクタで「正しい作り方」を強制</td></tr>
</table>
<p>実務では<code>DateTimeImmutable::createFromFormat()</code>など標準ライブラリにも登場する、非常によく使われるパターンです。</p>`,
      task: `コンストラクタを<code>private</code>にして直接の<code>new</code>を禁止し、華氏から生成する静的ファクトリメソッド<code>fromFahrenheit(float $f)</code>を追加してください（変換式は<code>($f - 32) * 5 / 9</code>）。`,
      code: `<?php

namespace App\\Model;

final class Temperature
{
    // TODO: コンストラクタをprivateにして、newを直接使えなくしよう
    public function __construct(
        public readonly float $celsius,
    ) {
    }

    public static function fromCelsius(float $c): self
    {
        return new self($c);
    }

    // TODO: 華氏から生成する静的ファクトリメソッド
    // fromFahrenheit(float $f): self を追加しよう
    // 摂氏への変換式は ($f - 32) * 5 / 9
}

$t1 = Temperature::fromCelsius(25.0);
$t2 = Temperature::fromFahrenheit(212.0);

echo "t1: " . $t1->celsius . "度" . "\\n";
echo "t2: " . $t2->celsius . "度" . "\\n";
`,
      solution: `<?php

namespace App\\Model;

final class Temperature
{
    // newを直接使わせないためコンストラクタをprivateにする
    private function __construct(
        public readonly float $celsius,
    ) {
    }

    public static function fromCelsius(float $c): self
    {
        return new self($c);
    }

    // 名前で「華氏から作る」という意図が伝わる
    public static function fromFahrenheit(float $f): self
    {
        return new self(($f - 32) * 5 / 9);
    }
}

$t1 = Temperature::fromCelsius(25.0);
$t2 = Temperature::fromFahrenheit(212.0);

echo "t1: " . $t1->celsius . "度" . "\\n";
echo "t2: " . $t2->celsius . "度" . "\\n";
`,
      hints: [
        `コンストラクタのpublicをprivateに変えるだけで、クラスの外からのnewが禁止されます。クラス内のnew self(...)は引き続き使えます。`,
        `fromFahrenheitはfromCelsiusとほぼ同じ形で、new self(($f - 32) * 5 / 9) と変換してから渡します。`,
      ],
      expectedOutput: "t2: 100度"
    },
    {
      id: 158,
      title: "値オブジェクト（イミュータブル設計）",
      explanation: `<p>金額・温度・メールアドレスのような「値そのもの」を表す小さなクラスを<strong>値オブジェクト</strong>（Value Object）と呼びます。intやstringをそのまま使う代わりに専用クラスにすることで、次の効果が得られます。</p>
<ul>
<li><strong>不正な値の存在を許さない</strong>：コンストラクタで検証するので、生成できた時点で正しい値だと保証される</li>
<li><strong>単位や通貨の混同を防ぐ</strong>：「JPYの1200」と「USDの1200」を型レベルで区別できる</li>
<li><strong>関連ロジックが1か所に集まる</strong>：加算・フォーマットなどが値と一緒に定義される</li>
</ul>
<pre><code>final class Money
{
    public function __construct(
        public readonly int $amount,
        public readonly string $currency,
    ) {
        if ($amount &lt; 0) {
            throw new \\InvalidArgumentException("金額は0以上");
        }
    }

    public function add(Money $other): Money
    {
        if ($this-&gt;currency !== $other-&gt;currency) {
            throw new \\InvalidArgumentException("通貨が違います");
        }
        return new Money($this-&gt;amount + $other-&gt;amount, $this-&gt;currency);
    }
}
</code></pre>
<p>値オブジェクトの鉄則は<strong>イミュータブル（不変）にする</strong>ことです。<code>add()</code>が自分自身を書き換えるのではなく新しい<code>Money</code>を返している点に注目してください。前章のreadonlyプロパティがここで活躍します。</p>
<p>なぜ不変にするのでしょうか。値オブジェクトは複数の場所から共有されがちです。もし<code>$price-&gt;amount = 0</code>のような書き換えができると、同じインスタンスを参照している別の場所の金額まで変わってしまいます。不変であれば、この「遠くで起きる予期しない変化」が原理的に起きません。</p>
<p><code>final</code>を付けて継承を禁止するのも定石です。値の意味を継承で上書きされると、検証の保証が崩れるためです。</p>`,
      task: `<code>add()</code>メソッドを完成させてください。通貨が異なる場合は<code>\\InvalidArgumentException("通貨が違います")</code>を投げ、同じなら合計金額の<strong>新しいMoney</strong>を返します（自分自身は変更しません）。`,
      code: `<?php

namespace App\\Model;

final class Money
{
    public function __construct(
        public readonly int $amount,
        public readonly string $currency,
    ) {
        // 生成時に検証するので、存在するMoneyは常に正しい
        if ($amount < 0) {
            throw new \\InvalidArgumentException("金額は0以上にしてください");
        }
    }

    // TODO: addメソッドを完成させよう
    // 1. 通貨（currency）が違えば\\InvalidArgumentException("通貨が違います")を投げる
    // 2. 同じなら合計金額の新しいMoneyを返す（$thisは変更しない）
    public function add(Money $other): Money
    {
        return $this;
    }

    public function format(): string
    {
        return number_format($this->amount) . " " . $this->currency;
    }
}

$a = new Money(1200, "JPY");
$b = new Money(800, "JPY");
$c = $a->add($b);

echo "a: " . $a->format() . "\\n";
echo "c: " . $c->format() . "\\n";

try {
    $a->add(new Money(10, "USD"));
} catch (\\InvalidArgumentException $e) {
    echo "エラー: " . $e->getMessage() . "\\n";
}
`,
      solution: `<?php

namespace App\\Model;

final class Money
{
    public function __construct(
        public readonly int $amount,
        public readonly string $currency,
    ) {
        // 生成時に検証するので、存在するMoneyは常に正しい
        if ($amount < 0) {
            throw new \\InvalidArgumentException("金額は0以上にしてください");
        }
    }

    // 自分自身は変更せず、新しいインスタンスを返す（イミュータブル）
    public function add(Money $other): Money
    {
        if ($this->currency !== $other->currency) {
            throw new \\InvalidArgumentException("通貨が違います");
        }
        return new Money($this->amount + $other->amount, $this->currency);
    }

    public function format(): string
    {
        return number_format($this->amount) . " " . $this->currency;
    }
}

$a = new Money(1200, "JPY");
$b = new Money(800, "JPY");
$c = $a->add($b);

echo "a: " . $a->format() . "\\n";
echo "c: " . $c->format() . "\\n";

try {
    $a->add(new Money(10, "USD"));
} catch (\\InvalidArgumentException $e) {
    echo "エラー: " . $e->getMessage() . "\\n";
}
`,
      hints: [
        `通貨の比較は $this->currency !== $other->currency で行います。厳密比較を使いましょう。`,
        `readonlyプロパティは書き換えられないので、return new Money($this->amount + $other->amount, $this->currency); と新しいインスタンスを返します。`,
      ],
      expectedOutput: "c: 2,000 JPY"
    },
    {
      id: 159,
      title: "シンプルなサービスクラス分割",
      explanation: `<p>処理をすべて1つのクラスに詰め込むと、テストも変更も難しくなります。責務ごとにクラスを分け、必要な依存をコンストラクタで受け取る形にするのが<strong>サービスクラス分割</strong>の基本です。</p>
<pre><code>class TaxCalculator
{
    public function __construct(
        private readonly float $rate,  // 税率は外から与える
    ) {
    }

    public function addTax(int $price): int
    {
        return (int) round($price * (1 + $this-&gt;rate));
    }
}

class OrderService
{
    public function __construct(
        private readonly TaxCalculator $tax,  // 依存を注入する
    ) {
    }
}
</code></pre>
<p><code>OrderService</code>が<code>TaxCalculator</code>を内部で<code>new</code>するのではなく、<strong>外から受け取っている</strong>点が最重要です。これを依存性の注入（DI：Dependency Injection）と呼びます。</p>
<table>
<tr><th>書き方</th><th>問題点／利点</th></tr>
<tr><td>内部でnew TaxCalculator(0.10)</td><td>税率を変えたテストができない。結合が固い</td></tr>
<tr><td>コンストラクタで受け取る（DI）</td><td>テスト時に別の税率や偽物（モック）に差し替えられる</td></tr>
</table>
<p>分割の目安は「そのクラスを一言で説明できるか」です。<code>TaxCalculator</code>は「税込金額を計算する」、<code>OrderService</code>は「注文の合計を求める」。説明に「と」が入り始めたら（「計算して、さらに保存して、メールも送る」）分割のサインです。</p>
<p>依存はすべて<code>private readonly</code>プロパティで持ちます。サービスクラスは状態を持たない（または不変の設定だけ持つ）ようにすると、何度呼んでも同じ入力には同じ結果が返る、テストしやすいクラスになります。名前空間<code>App\\Service</code>にまとめると、コードベース全体の見通しも良くなります。</p>`,
      task: `<code>OrderService</code>にコンストラクタを追加して<code>TaxCalculator</code>を注入し、<code>private readonly</code>プロパティ<code>$tax</code>に保存してください。<code>total()</code>では各価格に<code>addTax()</code>を適用して合計します。`,
      code: `<?php

namespace App\\Service {
    class TaxCalculator
    {
        public function __construct(
            private readonly float $rate,
        ) {
        }

        public function addTax(int $price): int
        {
            return (int) round($price * (1 + $this->rate));
        }
    }

    class OrderService
    {
        // TODO: コンストラクタでTaxCalculatorを受け取り、
        // private readonlyプロパティ$taxに保存しよう（DI）

        public function total(array $prices): int
        {
            $sum = 0;
            foreach ($prices as $price) {
                // TODO: $this->tax->addTax($price)を合計しよう
                $sum += $price;
            }
            return $sum;
        }
    }
}

namespace {
    use App\\Service\\OrderService;
    use App\\Service\\TaxCalculator;

    $service = new OrderService(new TaxCalculator(0.10));
    echo "合計金額: " . $service->total([100, 250]) . "円" . "\\n";
}
`,
      solution: `<?php

namespace App\\Service {
    class TaxCalculator
    {
        public function __construct(
            private readonly float $rate,
        ) {
        }

        public function addTax(int $price): int
        {
            return (int) round($price * (1 + $this->rate));
        }
    }

    class OrderService
    {
        // 依存はコンストラクタで注入する（DI）
        public function __construct(
            private readonly TaxCalculator $tax,
        ) {
        }

        public function total(array $prices): int
        {
            $sum = 0;
            foreach ($prices as $price) {
                $sum += $this->tax->addTax($price);
            }
            return $sum;
        }
    }
}

namespace {
    use App\\Service\\OrderService;
    use App\\Service\\TaxCalculator;

    // 税率10%のTaxCalculatorを注入して組み立てる
    $service = new OrderService(new TaxCalculator(0.10));
    echo "合計金額: " . $service->total([100, 250]) . "円" . "\\n";
}
`,
      hints: [
        `コンストラクタプロモーションを使うと public function __construct(private readonly TaxCalculator $tax) {} の1行で受け取りと保存が完了します。`,
        `total()の中は $sum += $this->tax->addTax($price); に書き換えます。110 + 275 = 385になれば正解です。`,
      ],
      expectedOutput: "合計金額: 385円"
    },
    {
      id: 160,
      title: "総合演習：名前空間で整理したミニライブラリ",
      explanation: `<p>第16章の総合演習です。この章で学んだ要素を組み合わせて、本棚を管理するミニライブラリを1ファイルに構築します。実際のプロジェクトなら1クラス1ファイルに分けてオートローダーで読み込む構成を、波かっこ構文で疑似的に再現します。</p>
<table>
<tr><th>名前空間</th><th>役割</th><th>登場する道具</th></tr>
<tr><td><code>MiniLib\\Model</code></td><td>値オブジェクト<code>Book</code></td><td>readonly・privateコンストラクタ・静的ファクトリ</td></tr>
<tr><td><code>MiniLib\\Service</code></td><td>サービスクラス<code>Shelf</code></td><td>use・グローバル関数への\\アクセス</td></tr>
<tr><td>グローバル</td><td>組み立てと実行</td><td>use・例外処理</td></tr>
</table>
<p>設計の見どころを確認しましょう。</p>
<ul>
<li><code>Book</code>は<strong>生成時に検証する値オブジェクト</strong>。<code>create()</code>ファクトリだけが生成経路で、タイトルが空のBookは存在できない</li>
<li><code>Shelf</code>は<code>use MiniLib\\Model\\Book;</code>でモデルをインポートして使う。名前空間をまたぐ依存が<code>use</code>文に一覧される</li>
<li><code>Shelf</code>の<code>count()</code>メソッド内では、グローバル関数と名前が重なるため<code>\\count()</code>と明示する（ステップ153の知識）</li>
</ul>
<pre><code>public function count(): int
{
    return \\count($this-&gt;books); // \\がないと自分自身と紛らわしい
}
</code></pre>
<p>タイトル一覧の生成には既習のアロー関数と<code>array_map</code>を使います。</p>
<pre><code>return implode(", ", array_map(
    fn (Book $b): string =&gt; $b-&gt;title,
    $this-&gt;books
));
</code></pre>
<p>完成したら、冊数・合計金額・一覧・エラーの4行が出力されることを確認してください。「名前空間で層を分け、値オブジェクトを守り、サービスで操作する」——この小さな構造が、そのまま実務のアプリケーション設計の縮図になっています。</p>`,
      task: `<code>Book::create()</code>静的ファクトリ（空タイトルなら<code>\\InvalidArgumentException("タイトルは必須です")</code>）と、<code>Shelf</code>の<code>count()</code>・<code>totalPrice()</code>メソッドを実装して、ミニライブラリを完成させてください。`,
      code: `<?php

// 総合演習：名前空間で整理したミニライブラリを完成させよう

namespace MiniLib\\Model {
    final class Book
    {
        private function __construct(
            public readonly string $title,
            public readonly int $price,
        ) {
        }

        // TODO: 静的ファクトリメソッドcreate(string $title, int $price): selfを作ろう
        // タイトルが空文字なら\\InvalidArgumentException("タイトルは必須です")を投げる
    }
}

namespace MiniLib\\Service {
    use MiniLib\\Model\\Book;

    class Shelf
    {
        /** @var list<Book> */
        private array $books = [];

        public function add(Book $book): void
        {
            $this->books[] = $book;
        }

        // TODO: 冊数を返すcount(): intメソッドを作ろう
        // （グローバル関数と区別するため\\count()を使う）

        // TODO: 合計金額を返すtotalPrice(): intメソッドを作ろう

        public function titles(): string
        {
            return implode(", ", array_map(
                fn (Book $b): string => $b->title,
                $this->books
            ));
        }
    }
}

namespace {
    use MiniLib\\Model\\Book;
    use MiniLib\\Service\\Shelf;

    $shelf = new Shelf();
    $shelf->add(Book::create("リーダブルコード", 2640));
    $shelf->add(Book::create("PHP実践入門", 3300));

    echo "冊数: " . $shelf->count() . "\\n";
    echo "合計: " . $shelf->totalPrice() . "円" . "\\n";
    echo "一覧: " . $shelf->titles() . "\\n";

    try {
        Book::create("", 100);
    } catch (\\InvalidArgumentException $e) {
        echo "エラー: " . $e->getMessage() . "\\n";
    }
}
`,
      solution: `<?php

// 総合演習：名前空間で整理したミニライブラリ

namespace MiniLib\\Model {
    // 値オブジェクト：生成経路はcreate()のみ
    final class Book
    {
        private function __construct(
            public readonly string $title,
            public readonly int $price,
        ) {
        }

        public static function create(string $title, int $price): self
        {
            if ($title === "") {
                throw new \\InvalidArgumentException("タイトルは必須です");
            }
            return new self($title, $price);
        }
    }
}

namespace MiniLib\\Service {
    use MiniLib\\Model\\Book;

    // サービスクラス：本棚の操作を担当
    class Shelf
    {
        /** @var list<Book> */
        private array $books = [];

        public function add(Book $book): void
        {
            $this->books[] = $book;
        }

        public function count(): int
        {
            // グローバル関数を\\で明示する
            return \\count($this->books);
        }

        public function totalPrice(): int
        {
            $sum = 0;
            foreach ($this->books as $book) {
                $sum += $book->price;
            }
            return $sum;
        }

        public function titles(): string
        {
            return implode(", ", array_map(
                fn (Book $b): string => $b->title,
                $this->books
            ));
        }
    }
}

namespace {
    use MiniLib\\Model\\Book;
    use MiniLib\\Service\\Shelf;

    $shelf = new Shelf();
    $shelf->add(Book::create("リーダブルコード", 2640));
    $shelf->add(Book::create("PHP実践入門", 3300));

    echo "冊数: " . $shelf->count() . "\\n";
    echo "合計: " . $shelf->totalPrice() . "円" . "\\n";
    echo "一覧: " . $shelf->titles() . "\\n";

    try {
        Book::create("", 100);
    } catch (\\InvalidArgumentException $e) {
        echo "エラー: " . $e->getMessage() . "\\n";
    }
}
`,
      hints: [
        `create()はステップ157と同じ形です。public static function create(...): self の中で検証し、new self($title, $price)を返します。`,
        `count()メソッドの中でグローバルのcount関数を呼ぶには \\count($this->books) と書きます。`,
        `totalPrice()はforeachで$book->priceを足し合わせるだけです。2640 + 3300 = 5940になります。`,
      ],
      expectedOutput: "合計: 5940円"
    }
  ]
});
