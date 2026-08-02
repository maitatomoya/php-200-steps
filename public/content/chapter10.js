// 第10章：例外処理
registerChapter({
  number: 10,
  title: "例外処理",
  description: "throw・try-catch・カスタム例外・組み込みエラークラスを使い、失敗に強いプログラムの書き方を学びます。",
  steps: [
    {
      id: 91,
      title: "エラーと例外の違い・throwの基本",
      explanation: `<p>プログラムの「失敗」には2種類あります。1つは<strong>構文エラー</strong>（Parse error）のようにコード自体が間違っているケース。もう1つは、コードは正しいのに<strong>実行時の状況が想定外</strong>（不正な入力値、存在しないデータなど）のケースです。後者をプログラム内で表現して通知する仕組みが<strong>例外（Exception）</strong>です。</p>
<p>例外は<code>throw</code>キーワードで「投げ」ます。投げるのはExceptionクラス（またはその子クラス）のオブジェクトです。</p>
<pre><code>function registerAge(int $age): string
{
    if ($age &lt; 0) {
        // 想定外の値が来たら、処理を中断して例外を投げる
        throw new Exception("年齢は0以上で指定してください");
    }
    return "年齢" . $age . "歳で登録しました";
}</code></pre>
<p>throwが実行されると、<strong>その場で関数の処理は中断</strong>され、returnには到達しません。投げられた例外を誰も受け止めないと「PHP Fatal error: Uncaught Exception: ...」と表示されてプログラム全体が停止します（受け止め方は次のステップで学びます）。</p>
<p>戻り値でfalseや-1を返してエラーを表現する方法と比べた例外の利点は次のとおりです。</p>
<ul>
<li>正常な戻り値とエラーが混ざらない（falseが正常値の場合と区別できる）</li>
<li>エラーの理由をメッセージとして持ち運べる</li>
<li>呼び出し側がエラー処理を書き忘れても、静かに壊れず明示的に停止する</li>
</ul>
<p>なおPHP 8以降、throwは文ではなく式になったため、<code>$name = $input ?? throw new Exception("必須です");</code>のような書き方もできます。</p>`,
      task: `まず例コードをそのまま実行して出力を確認してください。次に<code>registerAge(28)</code>の引数を<code>-5</code>に変えて実行し、「Uncaught Exception」というエラー表示を観察したら、引数を<code>28</code>に戻して提出してください。`,
      code: `<?php

function registerAge(int $age): string
{
    if ($age < 0) {
        // 想定外の値なら例外を投げて処理を中断する
        throw new Exception("年齢は0以上で指定してください");
    }
    return "年齢" . $age . "歳で登録しました";
}

// まずこのまま実行→次に引数を-5に変えてエラーを観察→28に戻す
echo registerAge(28) . PHP_EOL;
echo "処理が最後まで実行されました" . PHP_EOL;
`,
      solution: `<?php

function registerAge(int $age): string
{
    if ($age < 0) {
        // 想定外の値なら例外を投げて処理を中断する
        throw new Exception("年齢は0以上で指定してください");
    }
    return "年齢" . $age . "歳で登録しました";
}

echo registerAge(28) . PHP_EOL;
echo "処理が最後まで実行されました" . PHP_EOL;
`,
      hints: [
        `throw new Exception("メッセージ")で例外オブジェクトを作って投げます。ifの条件が成立したときだけ実行されます。`,
        `-5を渡すとthrow行が実行され、その後のechoは一切実行されないことを確認しましょう。観察が終わったら28に戻します。`
      ],
      expectedOutput: "年齢28歳で登録しました"
    },
    {
      id: 92,
      title: "try-catchで例外を受け止める",
      explanation: `<p>投げられた例外を受け止める（捕捉する）のが<strong>try-catch</strong>構文です。例外が起きるかもしれない処理を<code>try</code>ブロックに書き、例外が投げられたときの対応を<code>catch</code>ブロックに書きます。</p>
<pre><code>try {
    echo findUser($users, "u9"); // ここで例外が投げられると…
    echo "この行は実行されません";
} catch (Exception $e) {
    // …即座にここへ処理が移る。$eに例外オブジェクトが入る
    echo "エラーが発生したので回復しました";
}
echo "プログラムは続行できる";</code></pre>
<p>動きの流れを整理します。</p>
<ol>
<li>tryブロックを上から実行する</li>
<li>例外が投げられた瞬間、tryブロックの<strong>残りの行は飛ばして</strong>catchブロックへ移る</li>
<li>catchブロックの実行が終わると、try-catchの<strong>次の行から通常どおり続行</strong>する</li>
<li>tryブロック内で例外が起きなければ、catchブロックは実行されない</li>
</ol>
<p><code>catch (Exception $e)</code>の<code>Exception</code>は「どの種類の例外を受け止めるか」の型指定で、<code>$e</code>には投げられた例外オブジェクトが入ります（詳しい使い方はステップ94で学びます）。</p>
<p>重要なのは、tryで囲んだ関数の<strong>さらに奥で投げられた例外も</strong>受け止められることです。関数が何段深く呼ばれていても、例外は呼び出し元へ向かって伝わっていき、最初に出会ったcatchで捕捉されます。この性質のおかげで、エラー処理を一箇所に集約できます。</p>`,
      task: `<code>findUser($users, "u9")</code>の呼び出しで例外が発生し、プログラムが停止してしまいます。2つのecho行をtry-catchで囲み、catchブロックでは「エラーが発生したので回復しました」と出力してください。`,
      code: `<?php

function findUser(array $users, string $id): string
{
    if (!isset($users[$id])) {
        throw new Exception("ユーザーが見つかりません");
    }
    return $users[$id];
}

$users = ["u1" => "佐藤", "u2" => "鈴木"];

// TODO: 下の2行をtryブロックで囲み、
//       catch (Exception $e) で「エラーが発生したので回復しました」と出力する
echo findUser($users, "u1") . PHP_EOL;
echo findUser($users, "u9") . PHP_EOL;

echo "プログラムは正常に終了しました" . PHP_EOL;
`,
      solution: `<?php

function findUser(array $users, string $id): string
{
    if (!isset($users[$id])) {
        throw new Exception("ユーザーが見つかりません");
    }
    return $users[$id];
}

$users = ["u1" => "佐藤", "u2" => "鈴木"];

try {
    echo findUser($users, "u1") . PHP_EOL;
    // 次の行で例外が投げられ、catchブロックへ処理が移る
    echo findUser($users, "u9") . PHP_EOL;
} catch (Exception $e) {
    echo "エラーが発生したので回復しました" . PHP_EOL;
}

echo "プログラムは正常に終了しました" . PHP_EOL;
`,
      hints: [
        `try { 例外が起きるかもしれない処理 } catch (Exception $e) { 例外時の対応 } という形で囲みます。`,
        `catchブロックの中でecho "エラーが発生したので回復しました" . PHP_EOL;を実行します。最後のechoがtry-catchの後で必ず実行されることも確認しましょう。`
      ],
      expectedOutput: "エラーが発生したので回復しました"
    },
    {
      id: 93,
      title: "finallyブロック",
      explanation: `<p>try-catchには3つ目のブロック<strong>finally</strong>を追加できます。finallyブロックは、<strong>例外が起きても起きなくても必ず実行されます</strong>。</p>
<pre><code>try {
    // 例外が起きるかもしれない処理
} catch (Exception $e) {
    // 例外時の対応
} finally {
    // どちらの場合でも必ず実行される
}</code></pre>
<p>実行パターンを整理すると次のようになります。</p>
<table>
<tr><th>状況</th><th>try</th><th>catch</th><th>finally</th></tr>
<tr><td>例外なし</td><td>最後まで実行</td><td>実行されない</td><td>実行される</td></tr>
<tr><td>例外あり（捕捉できた）</td><td>途中まで</td><td>実行される</td><td>実行される</td></tr>
<tr><td>例外あり（捕捉できない型）</td><td>途中まで</td><td>実行されない</td><td>実行されてから例外が外へ伝わる</td></tr>
</table>
<p>さらに強力なことに、tryやcatchの中で<code>return</code>しても、<strong>関数から戻る直前にfinallyが実行されます</strong>。つまりfinallyは「この後始末だけは何があっても実行してほしい」という処理の置き場所です。</p>
<p>典型的な用途は<strong>リソースの後片付け</strong>です。データベース接続を閉じる、一時データを破棄する、ロックを解除する、といった処理をfinallyに書いておけば、正常終了でもエラー発生でも確実に実行され、「エラーのときだけ接続が閉じられずに残る」というやっかいなバグを防げます。catchだけに後片付けを書くと正常時に実行されず、tryの最後に書くと例外時に実行されない。両方をカバーするのがfinallyです。</p>`,
      task: `<code>processOrder()</code>のtry-catchに<code>finally</code>ブロックを追加し、注文の成否にかかわらず「接続を後片付けしました」と出力されるようにしてください。`,
      code: `<?php

function processOrder(int $quantity): void
{
    echo "注文処理を開始します" . PHP_EOL;
    try {
        if ($quantity <= 0) {
            throw new Exception("数量が不正です");
        }
        echo $quantity . "個の注文を受け付けました" . PHP_EOL;
    } catch (Exception $e) {
        echo "注文をキャンセルしました" . PHP_EOL;
    }
    // TODO: finallyブロックを追加して「接続を後片付けしました」と出力する
}

processOrder(3);
processOrder(0);
`,
      solution: `<?php

function processOrder(int $quantity): void
{
    echo "注文処理を開始します" . PHP_EOL;
    try {
        if ($quantity <= 0) {
            throw new Exception("数量が不正です");
        }
        echo $quantity . "個の注文を受け付けました" . PHP_EOL;
    } catch (Exception $e) {
        echo "注文をキャンセルしました" . PHP_EOL;
    } finally {
        // 成功でも失敗でも必ず実行される後片付け処理
        echo "接続を後片付けしました" . PHP_EOL;
    }
}

processOrder(3);
processOrder(0);
`,
      hints: [
        `finallyブロックはcatchブロックの閉じ波かっこの直後に finally { ... } と続けて書きます。`,
        `processOrder(3)は成功、processOrder(0)は例外発生ですが、どちらの出力にも「接続を後片付けしました」が現れれば正解です。`
      ],
      expectedOutput: "接続を後片付けしました"
    },
    {
      id: 94,
      title: "例外オブジェクト（getMessage・getCode）",
      explanation: `<p><code>catch (Exception $e)</code>で受け取る<code>$e</code>は、ただの目印ではなく<strong>エラーの詳細情報を持ったオブジェクト</strong>です。Exceptionクラスには情報を取り出すためのメソッドが用意されています。</p>
<table>
<tr><th>メソッド</th><th>返すもの</th></tr>
<tr><td><code>getMessage()</code></td><td>エラーメッセージ（コンストラクタの第1引数）</td></tr>
<tr><td><code>getCode()</code></td><td>エラーコード（コンストラクタの第2引数、既定値は0）</td></tr>
<tr><td><code>getFile()</code>／<code>getLine()</code></td><td>例外が投げられたファイル名／行番号</td></tr>
<tr><td><code>getTraceAsString()</code></td><td>そこに至る関数呼び出しの経路（スタックトレース）</td></tr>
</table>
<p>メッセージとコードは、例外を投げる側がコンストラクタで設定します。</p>
<pre><code>// 第1引数がメッセージ、第2引数がコード
throw new Exception("残高不足です", 100);

// 受け止める側
catch (Exception $e) {
    echo "メッセージ：" . $e-&gt;getMessage();
    echo "コード：" . $e-&gt;getCode();
}</code></pre>
<p>エラーコードは「同じ種類の例外の中でさらに原因を区別したい」ときに使える整数値です。たとえば入金エラーの中で「残高不足は100、金額不正は200」のように割り振れば、catch側でコードを見て対応を変えられます（ただし実務では、コードの数値で分岐するより、次のステップ以降で学ぶ例外クラス自体を分ける設計のほうが主流です）。</p>
<p>なお、getFile()・getLine()・getTraceAsString()はログ出力やデバッグで活躍します。ユーザー向け画面にそのまま表示すると内部構造が漏れてしまうため、表示するのはgetMessage()程度にとどめ、詳細はログに記録するのが定石です。</p>`,
      task: `catchブロックを完成させ、例外オブジェクトから「メッセージ：残高不足です」と「コード：100」の2行を出力してください。`,
      code: `<?php

function withdraw(int $balance, int $amount): int
{
    if ($amount > $balance) {
        throw new Exception("残高不足です", 100);
    }
    if ($amount <= 0) {
        throw new Exception("金額が不正です", 200);
    }
    return $balance - $amount;
}

try {
    withdraw(5000, 8000);
} catch (Exception $e) {
    // TODO: 「メッセージ：」に続けてgetMessage()の内容を、
    //       「コード：」に続けてgetCode()の内容を出力する
}
`,
      solution: `<?php

function withdraw(int $balance, int $amount): int
{
    if ($amount > $balance) {
        throw new Exception("残高不足です", 100);
    }
    if ($amount <= 0) {
        throw new Exception("金額が不正です", 200);
    }
    return $balance - $amount;
}

try {
    withdraw(5000, 8000);
} catch (Exception $e) {
    // 例外オブジェクトからメッセージとコードを取り出す
    echo "メッセージ：" . $e->getMessage() . PHP_EOL;
    echo "コード：" . $e->getCode() . PHP_EOL;
}
`,
      hints: [
        `$eは例外オブジェクトなので、->でメソッドを呼び出せます。`,
        `echo "メッセージ：" . $e->getMessage() . PHP_EOL; と echo "コード：" . $e->getCode() . PHP_EOL; の2行を書きます。`
      ],
      expectedOutput: "コード：100"
    },
    {
      id: 95,
      title: "複数のcatchと例外の階層",
      explanation: `<p>catchブロックは複数並べることができ、投げられた例外の型に<strong>上から順に</strong>マッチした最初のブロックが実行されます。PHPには標準で用途別の例外クラスが継承階層として用意されています（SPL例外と呼ばれます）。</p>
<table>
<tr><th>クラス</th><th>親</th><th>意味</th></tr>
<tr><td><code>LogicException</code></td><td>Exception</td><td>コードの書き方に起因する誤り</td></tr>
<tr><td><code>InvalidArgumentException</code></td><td>LogicException</td><td>引数が不正</td></tr>
<tr><td><code>RuntimeException</code></td><td>Exception</td><td>実行時にしか分からない失敗</td></tr>
<tr><td><code>OutOfRangeException</code></td><td>LogicException</td><td>範囲外の要求</td></tr>
</table>
<pre><code>try {
    $value = loadConfig($key);
} catch (InvalidArgumentException $e) {
    // 引数不正のときだけここに来る
    echo "引数エラー：" . $e-&gt;getMessage();
} catch (Exception $e) {
    // それ以外のExceptionはすべてここに来る
    echo "その他のエラー：" . $e-&gt;getMessage();
}</code></pre>
<p>重要なルールは<strong>「子クラスのcatchを先に書く」</strong>ことです。catchは継承関係を考慮してマッチするため、もし<code>catch (Exception $e)</code>を先に書くと、InvalidArgumentExceptionもExceptionの子として最初のブロックに吸い込まれ、後ろのcatchには永遠に到達しません。「具体的な例外から順に、最後に大きな網」と覚えてください。</p>
<p>補足として、同じ処理でよい複数の型は<code>catch (TypeA | TypeB $e)</code>とパイプ記号でまとめられます。また、PHP 8以降は変数が不要なら<code>catch (Exception)</code>と変数名を省略できます。</p>`,
      task: `catchブロックが<code>Exception</code>の1つしかありません。その<strong>前に</strong><code>InvalidArgumentException</code>用のcatchを追加し、「引数エラー：」に続けてメッセージを出力するようにしてください。`,
      code: `<?php

function loadConfig(string $key): string
{
    if ($key === "") {
        throw new InvalidArgumentException("キーが空です");
    }
    $config = ["mode" => "production"];
    if (!isset($config[$key])) {
        throw new RuntimeException("設定" . $key . "が見つかりません");
    }
    return $config[$key];
}

$keys = ["mode", "", "timeout"];
foreach ($keys as $key) {
    try {
        echo "値：" . loadConfig($key) . PHP_EOL;
    // TODO: この位置にInvalidArgumentException用のcatchを追加して
    //       「引数エラー：」+ メッセージを出力する
    } catch (Exception $e) {
        echo "その他のエラー：" . $e->getMessage() . PHP_EOL;
    }
}
`,
      solution: `<?php

function loadConfig(string $key): string
{
    if ($key === "") {
        throw new InvalidArgumentException("キーが空です");
    }
    $config = ["mode" => "production"];
    if (!isset($config[$key])) {
        throw new RuntimeException("設定" . $key . "が見つかりません");
    }
    return $config[$key];
}

$keys = ["mode", "", "timeout"];
foreach ($keys as $key) {
    try {
        echo "値：" . loadConfig($key) . PHP_EOL;
    } catch (InvalidArgumentException $e) {
        // 子クラスのcatchを親クラス（Exception）より先に書くのが鉄則
        echo "引数エラー：" . $e->getMessage() . PHP_EOL;
    } catch (Exception $e) {
        // InvalidArgumentException以外のExceptionはこちらで捕捉される
        echo "その他のエラー：" . $e->getMessage() . PHP_EOL;
    }
}
`,
      hints: [
        `catchブロックは複数並べられ、上から順に型がチェックされます。具体的な（子クラスの）例外を先に書きます。`,
        `catch (InvalidArgumentException $e) { echo "引数エラー：" . $e->getMessage() . PHP_EOL; } をcatch (Exception $e)の前に追加します。`,
        `空文字キーは「引数エラー」、存在しないキーtimeoutは「その他のエラー」と出れば正解です。`
      ],
      expectedOutput: "引数エラー：キーが空です"
    },
    {
      id: 96,
      title: "カスタム例外クラスを作る",
      explanation: `<p>Exceptionを継承すれば、<strong>自分のアプリケーション専用の例外クラス</strong>を作れます。これには2つの大きな利点があります。</p>
<ul>
<li><strong>catchで種類を選別できる</strong>：「在庫不足のときだけこの処理」という分岐が、例外クラス名だけで表現できる</li>
<li><strong>エラー固有の情報を持たせられる</strong>：メッセージ文字列だけでなく、不足数などのデータをプロパティとして運べる</li>
</ul>
<pre><code>class InsufficientStockException extends Exception
{
    private int $shortage;

    public function __construct(string $message, int $shortage)
    {
        parent::__construct($message); // 親のコンストラクタは必ず呼ぶ
        $this-&gt;shortage = $shortage;
    }

    public function getShortage(): int
    {
        return $this-&gt;shortage;
    }
}</code></pre>
<p>ポイントは、コンストラクタを拡張したら<strong>parent::__construct($message)を必ず呼ぶ</strong>ことです。これを忘れるとgetMessage()が空文字を返すようになってしまいます。第9章で学んだ「オーバーライドとparent::」がここで活きてきます。</p>
<p>命名は「〜Exception」で終えるのが慣例です。実務では、アプリ共通の基底例外（例：AppException extends Exception）を1つ作り、個別の例外はそれを継承させる設計がよく使われます。こうすると<code>catch (AppException $e)</code>で「このアプリが意図的に投げた例外だけ」をまとめて捕捉でき、想定外のバグ由来の例外と区別できます。中身が空でも<code>class OrderException extends Exception {}</code>のように定義するだけで、型として選別できる価値があります。</p>`,
      task: `InsufficientStockExceptionクラスを完成させてください。コンストラクタで<code>parent::__construct($message)</code>を呼んでから<code>$shortage</code>を保存し、<code>getShortage()</code>で取り出せるようにします。`,
      code: `<?php

class InsufficientStockException extends Exception
{
    private int $shortage;

    public function __construct(string $message, int $shortage)
    {
        // TODO: 親クラスのコンストラクタにメッセージを渡す
        // TODO: $shortageをプロパティに保存する
    }

    public function getShortage(): int
    {
        return $this->shortage;
    }
}

function ship(int $stock, int $quantity): void
{
    if ($quantity > $stock) {
        throw new InsufficientStockException("在庫が足りません", $quantity - $stock);
    }
    echo $quantity . "個を出荷しました" . PHP_EOL;
}

try {
    ship(10, 3);
    ship(7, 12);
} catch (InsufficientStockException $e) {
    echo $e->getMessage() . "（不足数：" . $e->getShortage() . "）" . PHP_EOL;
}
`,
      solution: `<?php

class InsufficientStockException extends Exception
{
    private int $shortage;

    public function __construct(string $message, int $shortage)
    {
        // 親のコンストラクタを呼ばないとgetMessage()が空になる
        parent::__construct($message);
        $this->shortage = $shortage;
    }

    public function getShortage(): int
    {
        return $this->shortage;
    }
}

function ship(int $stock, int $quantity): void
{
    if ($quantity > $stock) {
        throw new InsufficientStockException("在庫が足りません", $quantity - $stock);
    }
    echo $quantity . "個を出荷しました" . PHP_EOL;
}

try {
    ship(10, 3);
    ship(7, 12);
} catch (InsufficientStockException $e) {
    // カスタム例外なら独自メソッドで追加情報を取り出せる
    echo $e->getMessage() . "（不足数：" . $e->getShortage() . "）" . PHP_EOL;
}
`,
      hints: [
        `第9章で学んだparent::を使います。親（Exception）のコンストラクタの第1引数はメッセージです。`,
        `parent::__construct($message); のあとに $this->shortage = $shortage; と書きます。`
      ],
      expectedOutput: "在庫が足りません（不足数：5）"
    },
    {
      id: 97,
      title: "例外の再スローとラップ",
      explanation: `<p>catchした例外を、そのまま（あるいは別の例外に包んで）もう一度投げることを<strong>再スロー</strong>と言います。よく使うのは<strong>ラップ（包み直し）</strong>です。下位層の技術的な例外を、上位層にふさわしい抽象度の例外に変換します。</p>
<pre><code>try {
    chargeCard($amount); // 通信エラーでRuntimeExceptionが飛ぶかもしれない
} catch (RuntimeException $e) {
    // 第3引数に元の例外を渡してラップする
    throw new OrderException("注文処理に失敗しました", 0, $e);
}</code></pre>
<p>Exceptionのコンストラクタは<code>(メッセージ, コード, 前の例外)</code>の3引数を取れます。第3引数に元の例外を渡しておくと、受け取った側は<code>getPrevious()</code>で<strong>元の原因をたどれます</strong>。</p>
<pre><code>catch (OrderException $e) {
    echo $e-&gt;getMessage();                    // 注文処理に失敗しました
    $previous = $e-&gt;getPrevious();            // 元のRuntimeException
    if ($previous !== null) {
        echo "原因：" . $previous-&gt;getMessage(); // カード会社との通信に失敗しました
    }
}</code></pre>
<p>なぜラップするのでしょうか。注文画面のコードに「カード会社との通信」という下位層の詳細が漏れると、層の役割分担が崩れてしまいます。上位層には「注文が失敗した」という抽象度で伝えつつ、デバッグ用に元の原因を鎖のようにつないで保存する。これが例外チェーンと呼ばれる実務の定番パターンです。<strong>注意点</strong>として、ラップ時に第3引数を渡し忘れると原因情報が失われ、障害調査が困難になります。「包み直すときは必ず元の例外を第3引数に」と覚えてください。</p>`,
      task: `<code>placeOrder()</code>のcatchブロックで、捕捉したRuntimeExceptionを<code>OrderException("注文処理に失敗しました")</code>にラップして再スローしてください。元の例外を第3引数に渡すこと（コードは0で構いません）。`,
      code: `<?php

class OrderException extends Exception
{
}

function chargeCard(int $amount): void
{
    if ($amount > 100000) {
        throw new RuntimeException("カード会社との通信に失敗しました");
    }
    echo $amount . "円の決済に成功しました" . PHP_EOL;
}

function placeOrder(int $amount): void
{
    try {
        chargeCard($amount);
    } catch (RuntimeException $e) {
        // TODO: OrderExceptionにラップして再スローする
        //       メッセージは「注文処理に失敗しました」、コードは0、
        //       第3引数に元の例外$eを渡す
    }
}

try {
    placeOrder(3000);
    placeOrder(500000);
} catch (OrderException $e) {
    echo "エラー：" . $e->getMessage() . PHP_EOL;
    $previous = $e->getPrevious();
    if ($previous !== null) {
        echo "原因：" . $previous->getMessage() . PHP_EOL;
    }
}
`,
      solution: `<?php

class OrderException extends Exception
{
}

function chargeCard(int $amount): void
{
    if ($amount > 100000) {
        throw new RuntimeException("カード会社との通信に失敗しました");
    }
    echo $amount . "円の決済に成功しました" . PHP_EOL;
}

function placeOrder(int $amount): void
{
    try {
        chargeCard($amount);
    } catch (RuntimeException $e) {
        // 下位層の例外を業務例外にラップして再スロー。
        // 第3引数に元の例外を渡すと原因の連鎖が保存される
        throw new OrderException("注文処理に失敗しました", 0, $e);
    }
}

try {
    placeOrder(3000);
    placeOrder(500000);
} catch (OrderException $e) {
    echo "エラー：" . $e->getMessage() . PHP_EOL;
    // getPrevious()でラップ前の元の例外をたどれる
    $previous = $e->getPrevious();
    if ($previous !== null) {
        echo "原因：" . $previous->getMessage() . PHP_EOL;
    }
}
`,
      hints: [
        `catchブロックの中でthrowすると、新しい例外がさらに外側へ投げられます（再スロー）。`,
        `throw new OrderException("注文処理に失敗しました", 0, $e); の1行です。第3引数が「前の例外」になります。`,
        `正しくラップできていれば、外側のcatchで「エラー：」と「原因：」の2行が出力されます。`
      ],
      expectedOutput: "原因：カード会社との通信に失敗しました"
    },
    {
      id: 98,
      title: "TypeErrorとValueError（PHP 8の組み込み例外）",
      explanation: `<p>PHP 7以降、致命的エラーの多くも例外と同じ仕組みで捕捉できるようになりました。頂点にあるのが<strong>Throwableインターフェース</strong>で、その下に2つの系統があります。</p>
<table>
<tr><th>系統</th><th>代表クラス</th><th>意味</th></tr>
<tr><td>Exception系</td><td>Exception、RuntimeExceptionなど</td><td>アプリが意図的に投げる想定内の失敗</td></tr>
<tr><td>Error系</td><td>TypeError、ValueError、DivisionByZeroErrorなど</td><td>PHPエンジンが検出するプログラムの誤り</td></tr>
</table>
<p>PHP 8でよく出会う2つを押さえましょう。</p>
<ul>
<li><strong>TypeError</strong>：引数や戻り値の<strong>型</strong>が宣言と合わないときに投げられる。<code>declare(strict_types=1)</code>（厳密な型チェックを有効にする宣言）の下で、int宣言の引数に文字列を渡した場合など</li>
<li><strong>ValueError</strong>：型は合っているが<strong>値</strong>が不正なときに投げられる（PHP 8で新設）。例：<code>array_chunk($arr, 0)</code>のように「分割サイズは1以上」という条件に反する値を渡した場合</li>
</ul>
<pre><code>declare(strict_types=1);

function double(int $value): int
{
    return $value * 2;
}

try {
    echo double("abc"); // 文字列を渡すとTypeError
} catch (TypeError $e) {
    echo "型が違います";
}</code></pre>
<p>Error系はcatchできるとはいえ、本来は<strong>コードのバグを示すシグナル</strong>です。実務では「TypeErrorをcatchして握りつぶす」のではなく、テストや静的解析で原因自体を直すのが原則です。catchするのは、外部入力の検証やフレームワークの境界処理など、エラーを記録して安全に停止させたい場面に限られます。なお<code>catch (Throwable $e)</code>と書けば両系統をまとめて捕捉できます。</p>`,
      task: `2つのTODOを埋めてください。1つ目は<code>TypeError</code>を捕捉して「TypeErrorを捕捉：型が違います」と出力、2つ目は<code>ValueError</code>を捕捉して「ValueErrorを捕捉：」に続けてメッセージを出力します。`,
      code: `<?php
declare(strict_types=1);

function double(int $value): int
{
    return $value * 2;
}

try {
    echo double("abc") . PHP_EOL;
} catch (Exception $e) {
    // TODO: 捕捉する型をTypeErrorに直し、
    //       「TypeErrorを捕捉：型が違います」と出力する
    //       （TypeErrorはException系ではないのでこのままでは捕捉できない）
    echo "ここには到達しない" . PHP_EOL;
}

try {
    $chunks = array_chunk([1, 2, 3], 0);
} catch (Exception $e) {
    // TODO: 捕捉する型をValueErrorに直し、
    //       「ValueErrorを捕捉：」+ getMessage()を出力する
    echo "ここには到達しない" . PHP_EOL;
}

echo "プログラムは継続しています" . PHP_EOL;
`,
      solution: `<?php
declare(strict_types=1);

function double(int $value): int
{
    return $value * 2;
}

try {
    echo double("abc") . PHP_EOL;
} catch (TypeError $e) {
    // strict_typesの下でint引数に文字列を渡すとTypeError
    echo "TypeErrorを捕捉：型が違います" . PHP_EOL;
}

try {
    // 分割サイズ0は「型は正しいが値が不正」なのでValueError
    $chunks = array_chunk([1, 2, 3], 0);
} catch (ValueError $e) {
    echo "ValueErrorを捕捉：" . $e->getMessage() . PHP_EOL;
}

echo "プログラムは継続しています" . PHP_EOL;
`,
      hints: [
        `TypeErrorとValueErrorはError系なので、catch (Exception $e)では捕捉できません。catchの型名をそれぞれに書き換えます。`,
        `1つ目はcatch (TypeError $e)、2つ目はcatch (ValueError $e)にして、指定のメッセージをechoします。`
      ],
      expectedOutput: "TypeErrorを捕捉：型が違います"
    },
    {
      id: 99,
      title: "intdivとDivisionByZeroErrorの実践",
      explanation: `<p>整数同士の割り算には<code>intdiv(被除数, 除数)</code>関数を使います。<code>/</code>演算子は割り切れないとfloatを返しますが、intdivは<strong>商の整数部分</strong>を返します。余りは<code>%</code>演算子で求めます。</p>
<pre><code>echo 10 / 3;        // 3.3333333333333（float）
echo intdiv(10, 3); // 3（int）
echo 10 % 3;        // 1（余り）</code></pre>
<p>問題は<strong>0で割ったとき</strong>です。PHP 8では、<code>/</code>も<code>intdiv()</code>も<code>%</code>も、除数が0だと<strong>DivisionByZeroError</strong>を投げます（PHP 7以前の<code>/</code>はWarningを出してfalseを返す仕様だったため、PHP 8で挙動が大きく変わった点として有名です）。</p>
<p>DivisionByZeroErrorの継承関係は次のとおりで、前ステップで学んだError系に属します。</p>
<table>
<tr><th>クラス</th><th>親クラス</th></tr>
<tr><td><code>DivisionByZeroError</code></td><td>ArithmeticError</td></tr>
<tr><td><code>ArithmeticError</code></td><td>Error</td></tr>
</table>
<p>除数が外部データ由来で0になり得る場合は、try-catchで捕捉するか、事前にif文で0チェックをします。どちらでも構いませんが、「0除算が正常フローで起こり得る」ならif文で先に弾き、「起きたら異常」ならcatchして記録する、と使い分けると意図が明確になります。</p>
<p>補足として、float用の<code>fdiv()</code>関数だけは例外を投げず、数学の拡張実数にならってINF（無限大）やNAN（非数）を返します。統計計算などで0除算を許容したい場合に選択肢になります。</p>`,
      task: `foreachの中の<code>intdiv(100, $divisor)</code>をtry-catchで囲み、<code>DivisionByZeroError</code>を捕捉して「0では割れません：」に続けて<code>getMessage()</code>を出力してください。捕捉後もループが継続することを確認しましょう。`,
      code: `<?php

echo "10÷3の商：" . intdiv(10, 3) . PHP_EOL;
echo "10÷3の余り：" . (10 % 3) . PHP_EOL;

$divisors = [5, 0, 2];
foreach ($divisors as $divisor) {
    // TODO: try-catchで囲み、DivisionByZeroErrorを捕捉して
    //       「0では割れません：」+ getMessage()を出力する
    echo "100を割った商：" . intdiv(100, $divisor) . PHP_EOL;
}
`,
      solution: `<?php

echo "10÷3の商：" . intdiv(10, 3) . PHP_EOL;
echo "10÷3の余り：" . (10 % 3) . PHP_EOL;

$divisors = [5, 0, 2];
foreach ($divisors as $divisor) {
    try {
        echo "100を割った商：" . intdiv(100, $divisor) . PHP_EOL;
    } catch (DivisionByZeroError $e) {
        // 捕捉すればループは止まらず次の除数に進める
        echo "0では割れません：" . $e->getMessage() . PHP_EOL;
    }
}
`,
      hints: [
        `try-catchをforeachの中に置けば、1回の失敗でループ全体が止まるのを防げます。`,
        `catch (DivisionByZeroError $e) { echo "0では割れません：" . $e->getMessage() . PHP_EOL; } を追加します。`,
        `除数5と2の商（20と50）が出力され、0のときだけエラーメッセージになれば正解です。`
      ],
      expectedOutput: "0では割れません：Division by zero"
    },
    {
      id: 100,
      title: "総合演習：安全な除算計算機",
      explanation: `<p>最終ステップです。この章で学んだ要素をすべて組み合わせ、<strong>失敗しても止まらない除算計算機</strong>を作ります。登場する部品を確認しましょう。</p>
<ul>
<li><strong>カスタム例外</strong>（ステップ96）：CalculationExceptionを定義し、アプリの言葉でエラーを表現する</li>
<li><strong>ラップと再スロー</strong>（ステップ97）：intdivが投げるDivisionByZeroErrorを捕捉し、CalculationExceptionに包み直す。第3引数で原因も保存する</li>
<li><strong>try-catch-finally</strong>（ステップ92・93）：計算1件ごとに例外を処理し、成否にかかわらず終了メッセージを出す</li>
<li><strong>intdivと%</strong>（ステップ99）：商と余りを求める</li>
</ul>
<p>処理の流れは次のとおりです。</p>
<ol>
<li><code>safeDivide()</code>は商と余りを計算して結果文字列を返す。0除算のときはDivisionByZeroErrorをCalculationExceptionにラップして投げ直す</li>
<li>呼び出し側は計算のリストをforeachで回し、1件ずつtry-catch-finallyで処理する</li>
<li>成功件数と失敗件数を数えて、最後に集計を表示する</li>
</ol>
<p>結果文字列の整形には<code>sprintf()</code>を使います。</p>
<pre><code>sprintf("%d ÷ %d = %d 余り %d", 10, 3, 3, 1);
// "10 ÷ 3 = 3 余り 1"</code></pre>
<p>この構成の見どころは<strong>例外の変換地点</strong>です。低レベルのDivisionByZeroErrorをsafeDivide()の内側で業務例外に変換しているため、呼び出し側はCalculationExceptionだけを気にすればよく、エラー処理の窓口が一本化されています。小さな例ですが、実務のサービス層設計と同じ骨格です。</p>`,
      task: `2つのTODOを実装してください。（1）<code>safeDivide()</code>内でDivisionByZeroErrorを捕捉し、「（被除数）を0で割ることはできません」というCalculationExceptionにラップして再スローする。（2）foreach内をtry-catch-finallyで組み、成功と失敗を数えて処理する。`,
      code: `<?php

class CalculationException extends Exception
{
}

function safeDivide(int $dividend, int $divisor): string
{
    // TODO: try-catchでDivisionByZeroErrorを捕捉し、
    //       「（被除数）を0で割ることはできません」というメッセージの
    //       CalculationExceptionにラップして再スローする（第3引数に元の例外）
    $quotient = intdiv($dividend, $divisor);
    $remainder = $dividend % $divisor;
    return sprintf("%d ÷ %d = %d 余り %d", $dividend, $divisor, $quotient, $remainder);
}

$inputs = [
    [10, 3],
    [7, 0],
    [100, 4],
];

$successCount = 0;
$failureCount = 0;

foreach ($inputs as $input) {
    // TODO: try-catch-finallyを使って
    //       成功時：safeDivideの結果を出力して$successCountを増やす
    //       失敗時：「エラー：」+ getMessage()を出力して$failureCountを増やす
    //       finally：「--- 計算終了 ---」を出力する
    echo safeDivide($input[0], $input[1]) . PHP_EOL;
}

echo "成功" . $successCount . "件／失敗" . $failureCount . "件" . PHP_EOL;
`,
      solution: `<?php

class CalculationException extends Exception
{
}

function safeDivide(int $dividend, int $divisor): string
{
    try {
        $quotient = intdiv($dividend, $divisor);
        $remainder = $dividend % $divisor;
        return sprintf("%d ÷ %d = %d 余り %d", $dividend, $divisor, $quotient, $remainder);
    } catch (DivisionByZeroError $e) {
        // 低レベルのErrorを業務例外にラップし、原因も保存して再スロー
        throw new CalculationException($dividend . "を0で割ることはできません", 0, $e);
    }
}

$inputs = [
    [10, 3],
    [7, 0],
    [100, 4],
];

$successCount = 0;
$failureCount = 0;

foreach ($inputs as $input) {
    try {
        echo safeDivide($input[0], $input[1]) . PHP_EOL;
        $successCount++;
    } catch (CalculationException $e) {
        echo "エラー：" . $e->getMessage() . PHP_EOL;
        $failureCount++;
    } finally {
        // 成否にかかわらず1件ごとに必ず実行される
        echo "--- 計算終了 ---" . PHP_EOL;
    }
}

echo "成功" . $successCount . "件／失敗" . $failureCount . "件" . PHP_EOL;
`,
      hints: [
        `safeDivide()では計算部分全体をtryで囲み、catch (DivisionByZeroError $e)の中でthrow new CalculationException($dividend . "を0で割ることはできません", 0, $e);と再スローします。`,
        `foreach側はcatch (CalculationException $e)で受け、echoとカウンタ加算を行います。finallyには区切り線の出力を置きます。`,
        `最終行が「成功2件／失敗1件」になれば完成です。`
      ],
      expectedOutput: "成功2件／失敗1件"
    }
  ]
});
