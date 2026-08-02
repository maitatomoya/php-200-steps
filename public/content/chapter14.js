// 第14章：ジェネレータとイテレータ
registerChapter({
  number: 14,
  title: "ジェネレータとイテレータ",
  description: "yieldで値を1つずつ生み出すジェネレータと、foreachで回せるオブジェクトを作るイテレータ関連インターフェースを学びます。",
  steps: [
    {
      id: 131,
      title: "ジェネレータとyieldの基本",
      explanation: `<p>ジェネレータは「値を1つずつ、必要になったときに生み出す」特別な関数です。関数の中に<code>yield</code>（イールド＝生み出す）というキーワードを1つでも書くと、その関数はジェネレータになります。</p>
<pre><code>function countUp(): Generator
{
    yield 1;
    yield 2;
    yield 3;
}</code></pre>
<p>普通の関数との最大の違いは実行のされ方です。</p>
<table>
<tr><th></th><th>普通の関数</th><th>ジェネレータ</th></tr>
<tr><td>呼び出した瞬間</td><td>中身が最後まで実行される</td><td><strong>中身はまだ実行されない</strong>。Generatorオブジェクトが返るだけ</td></tr>
<tr><td>値の返し方</td><td>returnで1回だけ</td><td>yieldで何回でも</td></tr>
<tr><td>yield/return後</td><td>関数は終了する</td><td><strong>一時停止</strong>し、次に求められたら続きから再開する</td></tr>
</table>
<p>ジェネレータは「実行を途中で止めて、続きから再開できる関数」と言えます。<code>current()</code>メソッドで現在の値を取得し、<code>next()</code>で次のyieldまで進められます。最初に<code>current()</code>を呼んだ時点で、関数の先頭から最初のyieldまでが実行されます。</p>
<p>戻り値の型宣言には組み込みクラス<code>Generator</code>を書きます。yieldを含む関数は自動的にこの型のオブジェクトを返すためです。</p>
<p>この「止まって再開する」動きを、echoを仕込んだコードで実際に観察してみましょう。どのタイミングでどの行が実行されるかが一目で分かります。</p>`,
      task: `コードをそのまま実行し、出力の順番から「呼び出しただけでは実行されない」「yieldで止まり、next()で再開する」ことを確認してください。その後、yield 3の前にもechoを追加して再実行してみましょう。`,
      code: `<?php
function countUp(): Generator
{
    echo '開始' . PHP_EOL;
    yield 1;
    echo '再開1' . PHP_EOL;
    yield 2;
    echo '再開2' . PHP_EOL;
    yield 3;
}

$gen = countUp();
echo '関数を呼んだ直後（まだ何も実行されていない）' . PHP_EOL;

echo $gen->current() . PHP_EOL;  // ここで初めて「開始」からyield 1まで動く
$gen->next();                    // yield 2まで進む
echo $gen->current() . PHP_EOL;`,
      solution: `<?php
function countUp(): Generator
{
    echo '開始' . PHP_EOL;
    yield 1;
    echo '再開1' . PHP_EOL;
    yield 2;
    echo '再開2' . PHP_EOL;
    yield 3;
}

$gen = countUp();
echo '関数を呼んだ直後（まだ何も実行されていない）' . PHP_EOL;

echo $gen->current() . PHP_EOL;  // ここで初めて「開始」からyield 1まで動く
$gen->next();                    // yield 2まで進む
echo $gen->current() . PHP_EOL;`,
      hints: [
        `出力の1行目が「開始」ではなく「関数を呼んだ直後…」になる点に注目してください。`,
        `current()が最初に呼ばれた瞬間に、関数の先頭から最初のyieldまでが実行されます。`
      ],
      expectedOutput: "再開1"
    },
    {
      id: 132,
      title: "ジェネレータとforeach",
      explanation: `<p>前のステップでは<code>current()</code>と<code>next()</code>を手動で呼びましたが、実際の開発でその書き方はほぼ使いません。ジェネレータは<strong>foreachでそのまま回せる</strong>からです。</p>
<pre><code>function countUp(): Generator
{
    yield 1;
    yield 2;
    yield 3;
}

foreach (countUp() as $n) {
    echo $n . PHP_EOL;  // 1 2 3
}</code></pre>
<p>foreachは内部で「値を取り出す→次へ進む→終わりかを確認する」を自動で繰り返してくれます。ジェネレータ関数が最後まで実行される（またはreturnする）とループも終わります。</p>
<p>yieldはループの中に書くこともできます。むしろこれがジェネレータの典型的な形です。</p>
<pre><code>function evenNumbers(int $limit): Generator
{
    for ($i = 0; $i &lt;= $limit; $i += 2) {
        yield $i;
    }
}</code></pre>
<p>「forループが1周するたびにyieldで値を1つ差し出し、受け取る側のforeachが1周する」という、2つのループがかみ合って進むイメージです。</p>
<p>注意点として、ジェネレータは<strong>一度しか回せません</strong>。foreachを2回書くと、2回目の開始時に「Cannot rewind a generator that was already run」という例外が発生します。もう一度回したいときは、ジェネレータ関数を呼び直して新しいGeneratorオブジェクトを作ります。</p>`,
      task: `0から$limitまでの偶数を順にyieldするジェネレータ<code>evenNumbers</code>を完成させ、foreachで回して各値と合計を出力してください。`,
      code: `<?php
function evenNumbers(int $limit): Generator
{
    // TODO: 0から$limitまで2ずつ増やしながらyieldする
}

$sum = 0;
foreach (evenNumbers(10) as $n) {
    echo $n . PHP_EOL;
    $sum += $n;
}
echo '偶数の合計: ' . $sum . PHP_EOL;`,
      solution: `<?php
function evenNumbers(int $limit): Generator
{
    // forの1周ごとに値を1つ差し出して一時停止する
    for ($i = 0; $i <= $limit; $i += 2) {
        yield $i;
    }
}

$sum = 0;
foreach (evenNumbers(10) as $n) {
    echo $n . PHP_EOL;
    $sum += $n;
}
echo '偶数の合計: ' . $sum . PHP_EOL;`,
      hints: [
        `forループで$iを0から$limitまで2ずつ増やし、ループ本体でyield $i;とします。`,
        `for ($i = 0; $i <= $limit; $i += 2) { yield $i; } の形です。`
      ],
      expectedOutput: "偶数の合計: 30"
    },
    {
      id: 133,
      title: "大量データでのメモリ効率",
      explanation: `<p>ジェネレータの最大の実用価値は<strong>メモリ効率</strong>です。<code>range(1, 1000000)</code>と、同じ範囲をyieldするジェネレータを比べてみましょう。</p>
<table>
<tr><th></th><th>range(1, 1000000)</th><th>ジェネレータ</th></tr>
<tr><td>作られるもの</td><td>100万要素の配列</td><td>Generatorオブジェクト1個</td></tr>
<tr><td>メモリ使用量</td><td>数十MB（全要素を一度に保持）</td><td>ほぼ一定（現在の1個分だけ）</td></tr>
<tr><td>使い方</td><td>配列関数が全部使える</td><td>基本はforeachで前から順に</td></tr>
</table>
<p><code>range()</code>は呼んだ瞬間に全要素をメモリ上に並べます。100万要素なら100万個分の領域が一度に必要です。一方ジェネレータは「次の値の作り方」だけを覚えていて、求められるたびに1個ずつ計算します。だから件数がどれだけ増えてもメモリ使用量はほぼ一定です。</p>
<p>この性質は「巨大なCSVを1行ずつ処理する」「DBから大量の行を順に読む」など、<strong>全件を同時にメモリへ載せる必要がない処理</strong>で威力を発揮します。逆に、ソートのように全件がそろわないとできない処理には向きません。</p>
<p>もう1つの利点は<strong>途中でやめれば残りは計算すらされない</strong>ことです。100万件のうち先頭100件だけ使ってbreakすれば、実際に生成されるのは100個だけ。「必要になるまで計算しない」この戦略を遅延評価（lazy evaluation）と呼びます。</p>`,
      task: `1から100万までを生み出すジェネレータ<code>bigRange</code>から先頭100件だけを取り出し、合計を出力してください。100件処理したらbreakでループを打ち切ります。`,
      code: `<?php
function bigRange(int $start, int $end): Generator
{
    for ($i = $start; $i <= $end; $i++) {
        yield $i;
    }
}

$sum = 0;
$count = 0;
foreach (bigRange(1, 1000000) as $n) {
    // TODO: $nを$sumに加算し、$countを1増やす

    // TODO: $countが100に達したらbreakでループを打ち切る
}

echo '先頭100件の合計: ' . $sum . PHP_EOL;
echo '生成された個数: ' . $count . PHP_EOL;`,
      solution: `<?php
function bigRange(int $start, int $end): Generator
{
    for ($i = $start; $i <= $end; $i++) {
        yield $i;
    }
}

$sum = 0;
$count = 0;
foreach (bigRange(1, 1000000) as $n) {
    $sum += $n;
    $count++;

    // 打ち切った後の残り99万9900個は計算すらされない（遅延評価）
    if ($count >= 100) {
        break;
    }
}

echo '先頭100件の合計: ' . $sum . PHP_EOL;
echo '生成された個数: ' . $count . PHP_EOL;`,
      hints: [
        `ループ本体で$sum += $n; $count++;としてから、打ち切り条件を判定します。`,
        `if ($count >= 100) { break; } でループを抜けます。1+2+…+100は5050になるはずです。`
      ],
      expectedOutput: "先頭100件の合計: 5050"
    },
    {
      id: 134,
      title: "キー付きyield",
      explanation: `<p>配列に<code>'キー' =&gt; 値</code>があるように、ジェネレータも<strong>キー付きで値を生み出す</strong>ことができます。書き方は<code>yield キー =&gt; 値;</code>です。</p>
<pre><code>function userAges(): Generator
{
    yield '佐藤' =&gt; 28;
    yield '鈴木' =&gt; 35;
}

foreach (userAges() as $name =&gt; $age) {
    echo $name . 'は' . $age . '歳' . PHP_EOL;
}</code></pre>
<p>foreach側は連想配列とまったく同じ<code>as $key =&gt; $value</code>の形で受け取れます。つまり<strong>使う側から見ると、キー付きジェネレータは連想配列とほぼ同じ顔をしている</strong>のです。違いは、全ペアが最初からメモリにあるか、1ペアずつ生み出されるかだけです。</p>
<p>キーを指定しない<code>yield 値;</code>の場合は、配列と同様に0から始まる連番キーが自動で振られます。</p>
<table>
<tr><th>書き方</th><th>foreachで受け取るキー</th></tr>
<tr><td><code>yield $v;</code></td><td>0, 1, 2, …の自動連番</td></tr>
<tr><td><code>yield $k =&gt; $v;</code></td><td>指定したキー（文字列・数値どちらも可）</td></tr>
</table>
<p>実務では「ファイル名 =&gt; 中身」「ID =&gt; レコード」のように、意味のあるキーを添えて1件ずつ供給する使い方が定番です。なお配列と違ってキーの重複チェックはされません。同じキーを2回yieldしてもエラーにはならず、そのまま2回届きます。</p>`,
      task: `名前をキー、年齢を値としてyieldするジェネレータ<code>userAges</code>を完成させ、foreachで「◯◯さんは◯歳」と出力してください。データは佐藤28歳・鈴木35歳・高橋22歳です。`,
      code: `<?php
function userAges(): Generator
{
    yield '佐藤' => 28;
    // TODO: 鈴木35歳、高橋22歳もキー付きでyieldする
}

foreach (userAges() as $name => $age) {
    echo $name . 'さんは' . $age . '歳' . PHP_EOL;
}`,
      solution: `<?php
function userAges(): Generator
{
    // 「キー => 値」の形で1ペアずつ生み出す
    yield '佐藤' => 28;
    yield '鈴木' => 35;
    yield '高橋' => 22;
}

foreach (userAges() as $name => $age) {
    echo $name . 'さんは' . $age . '歳' . PHP_EOL;
}`,
      hints: [
        `連想配列の1要素と同じ「キー => 値」の形を、yieldの後ろに書きます。`,
        `yield '鈴木' => 35; と yield '高橋' => 22; を追加します。`
      ],
      expectedOutput: "鈴木さんは35歳"
    },
    {
      id: 135,
      title: "yield fromで委譲",
      explanation: `<p>ジェネレータの中から「別のジェネレータや配列の中身をまるごと流す」には<code>yield from</code>を使います。これをジェネレータの<strong>委譲（delegation）</strong>と呼びます。</p>
<pre><code>function inner(): Generator
{
    yield 'A';
    yield 'B';
}

function outer(): Generator
{
    yield '開始';
    yield from inner();    // innerの値を全部順に流す
    yield from ['C', 'D']; // 配列もOK
    yield '終了';
}</code></pre>
<p>outerを回すと「開始 → A → B → C → D → 終了」の順に値が届きます。もし<code>yield from</code>ではなく<code>yield inner();</code>と書くと、中身ではなく<strong>Generatorオブジェクトそのもの</strong>が1個yieldされてしまうので注意してください。</p>
<table>
<tr><th>書き方</th><th>届くもの</th></tr>
<tr><td><code>yield inner();</code></td><td>Generatorオブジェクト1個（たいてい意図と違う）</td></tr>
<tr><td><code>yield from inner();</code></td><td>innerが生み出す値が順番に全部</td></tr>
</table>
<p><code>yield from</code>の対象にできるのは、配列・ジェネレータをはじめとするTraversable（foreachで回せるもの全般）です。複数のデータソースを1本のストリームに合流させる、再帰的にディレクトリツリーを辿る、といった処理がすっきり書けます。</p>
<p>1つ注意として、委譲元のキーはそのまま流れます。連番キーの配列を複数つなぐとキーが重複しますが、foreachで値だけを使う分には問題ありません。</p>`,
      task: `<code>outer</code>の中でinner()と配列['C', 'D']にyield fromで委譲し、「開始 A B C D 終了」の順に出力されるようにしてください。`,
      code: `<?php
function inner(): Generator
{
    yield 'A';
    yield 'B';
}

function outer(): Generator
{
    yield '開始';
    // TODO: inner()の中身をyield fromで流す
    // TODO: 配列 ['C', 'D'] もyield fromで流す
    yield '終了';
}

foreach (outer() as $value) {
    echo $value . PHP_EOL;
}`,
      solution: `<?php
function inner(): Generator
{
    yield 'A';
    yield 'B';
}

function outer(): Generator
{
    yield '開始';
    // yield from で別のジェネレータへ委譲する
    yield from inner();
    // 配列などforeachで回せるものなら何でも委譲できる
    yield from ['C', 'D'];
    yield '終了';
}

foreach (outer() as $value) {
    echo $value . PHP_EOL;
}`,
      hints: [
        `fromを付け忘れてyield inner();と書くと、値ではなくGeneratorオブジェクトが1個だけ届いてしまいます。`,
        `yield from inner(); と yield from ['C', 'D']; の2行を追加します。`
      ],
      expectedOutput: "終了"
    },
    {
      id: 136,
      title: "無限ジェネレータとbreakでの打ち切り",
      explanation: `<p>ジェネレータは「求められたときだけ次を計算する」ため、<strong>終わりのない無限ループ</strong>を安全に書けます。普通の関数で<code>while (true)</code>の中に配列追加を書いたら暴走しますが、ジェネレータなら受け取る側が止めるまで1個ずつしか動きません。</p>
<pre><code>function naturalNumbers(): Generator
{
    $n = 1;
    while (true) {
        yield $n;
        $n++;
    }
}</code></pre>
<p>無限ジェネレータを使うときの約束はただ1つ、<strong>受け取る側が必ず打ち切ること</strong>です。foreachの中で条件を判定し、<code>break</code>でループを抜けます。breakした時点でジェネレータは一時停止したまま放置され、残りが実行されることはありません。</p>
<p>この形の代表例がフィボナッチ数列です。「直前の2つの数を足すと次の数になる」数列で、<code>[$a, $b] = [$b, $a + $b];</code>という分割代入で2つの変数を同時に更新していくのが定石です。</p>
<pre><code>$a = 0;
$b = 1;
[$a, $b] = [$b, $a + $b];  // $a=1, $b=1
[$a, $b] = [$b, $a + $b];  // $a=1, $b=2</code></pre>
<p>「数列の定義（無限）」と「どこまで使うか（打ち切り条件）」を完全に分離できるのが、この設計の美しいところです。同じジェネレータを「100以下まで」「最初の20個だけ」など、使う側の都合で自由に切り取れます。</p>`,
      task: `フィボナッチ数列の無限ジェネレータから値を取り出し、100を超えたらbreakで打ち切って、100以下の数列をカンマ区切りで出力してください。`,
      code: `<?php
function fibonacci(): Generator
{
    $a = 0;
    $b = 1;
    while (true) {
        yield $a;
        [$a, $b] = [$b, $a + $b];
    }
}

$result = [];
foreach (fibonacci() as $n) {
    // TODO: $nが100を超えたらbreakする（この条件を書かないと無限ループ！）
    if (true) {
        break;
    }
    $result[] = $n;
}

echo implode(', ', $result) . PHP_EOL;`,
      solution: `<?php
function fibonacci(): Generator
{
    $a = 0;
    $b = 1;
    // 無限ループでも、求められた分しか実行されないので安全
    while (true) {
        yield $a;
        [$a, $b] = [$b, $a + $b];
    }
}

$result = [];
foreach (fibonacci() as $n) {
    // 打ち切りは受け取る側の責任
    if ($n > 100) {
        break;
    }
    $result[] = $n;
}

echo implode(', ', $result) . PHP_EOL;`,
      hints: [
        `初期コードのif (true)のままだと1周目で即breakしてしまい、何も集まりません。`,
        `条件を if ($n > 100) に書き換えると、100以下の値だけが$resultに集まります。`
      ],
      expectedOutput: "0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89"
    },
    {
      id: 137,
      title: "ジェネレータのsend（概要）",
      explanation: `<p>ここまでのジェネレータは値を「出す」一方通行でした。実は<code>send()</code>メソッドを使うと、逆に<strong>外からジェネレータへ値を送り込む</strong>ことができます。</p>
<p>ポイントは、yieldが「文」ではなく<strong>値を持つ式</strong>にもなれることです。<code>$x = yield;</code>と書くと、外から<code>send($v)</code>で送られた値が$xに入ります。</p>
<pre><code>function logger(): Generator
{
    while (true) {
        $message = yield;  // send()された値がここに入る
        echo '[LOG] ' . $message . PHP_EOL;
    }
}

$gen = logger();
$gen-&gt;current();          // 最初のyieldまで進めておく（重要）
$gen-&gt;send('起動しました');</code></pre>
<p>動きを順に追うと次のようになります。</p>
<ol>
<li><code>current()</code>で最初のyieldまで実行し、そこで停止させる（プライミングと呼ばれる準備操作）</li>
<li><code>send('起動しました')</code>で値を送ると、停止中のyield式がその値になって実行が再開される</li>
<li>次のyieldに到達したらまた停止し、次のsendを待つ</li>
</ol>
<p>最初のプライミングを忘れると、1回目のsendの値は最初のyieldに到達するまでの実行に消費され、意図どおりに受け取れません。ハマりやすいポイントです。</p>
<p>sendを駆使するとコルーチン（協調的に動くタスク）という高度な並行処理パターンが作れますが、実務での出番は多くありません。まずは「ジェネレータは双方向にもできる」という概要を押さえておけば十分です。</p>`,
      task: `コードをそのまま実行して、send()で送った3つのメッセージがジェネレータ側で受け取られ[LOG]付きで出力されることを確認してください。その後、current()の行をコメントアウトして挙動の違いを観察しましょう。`,
      code: `<?php
function logger(): Generator
{
    while (true) {
        $message = yield;  // 外からsend()された値がここに入る
        echo '[LOG] ' . $message . PHP_EOL;
    }
}

$gen = logger();
$gen->current();  // プライミング：最初のyieldまで進めて待機させる

$gen->send('起動しました');
$gen->send('処理中です');
$gen->send('完了しました');`,
      solution: `<?php
function logger(): Generator
{
    while (true) {
        $message = yield;  // 外からsend()された値がここに入る
        echo '[LOG] ' . $message . PHP_EOL;
    }
}

$gen = logger();
$gen->current();  // プライミング：最初のyieldまで進めて待機させる

$gen->send('起動しました');
$gen->send('処理中です');
$gen->send('完了しました');`,
      hints: [
        `yieldは「値を出す」だけでなく、$x = yield; の形で「値を受け取る」式にもなれます。`,
        `current()を消すと、1回目のsendの値が最初のyieldへの到達に使われてしまい、[LOG]が1行減ります。`
      ],
      expectedOutput: "[LOG] 処理中です"
    },
    {
      id: 138,
      title: "Iteratorインターフェースを実装する",
      explanation: `<p>ジェネレータ以外にも「foreachで回せるオブジェクト」を作る方法があります。それが<code>Iterator</code>インターフェースの実装です。次の5つのメソッドを実装すると、そのクラスのオブジェクトはforeachで回せるようになります。</p>
<table>
<tr><th>メソッド</th><th>役割</th></tr>
<tr><td><code>rewind(): void</code></td><td>先頭に巻き戻す（foreach開始時に呼ばれる）</td></tr>
<tr><td><code>valid(): bool</code></td><td>現在位置に要素があるか（falseでループ終了）</td></tr>
<tr><td><code>current(): mixed</code></td><td>現在の値を返す</td></tr>
<tr><td><code>key(): mixed</code></td><td>現在のキーを返す</td></tr>
<tr><td><code>next(): void</code></td><td>次の位置へ進む</td></tr>
</table>
<p>foreachはこれらを「rewind → valid → current/key → next → valid → …」の順で自動的に呼びます。つまりIteratorとは、<strong>foreachが内部で使う操作の取り決め</strong>そのものです。</p>
<p>実はジェネレータのGeneratorクラスもIteratorを実装しています。だからforeachで回せたのです。手書きのIteratorは記述量が多いぶん、「現在位置」以外の状態も持てる・何度でも巻き戻せる、といった細かい制御ができます。</p>
<pre><code>class NumberCollection implements Iterator
{
    private int $position = 0;

    public function __construct(private array $numbers)
    {
    }
    // …5つのメソッドを実装…
}</code></pre>
<p>迷ったらジェネレータ、クラスとして状態や振る舞いも持たせたいならIterator実装、という使い分けが目安です。</p>`,
      task: `実行すると「must contain the remaining methods」というエラーになります。足りていない<code>valid()</code>メソッドを実装して、foreachが正しく3件を出力するようにしてください。`,
      code: `<?php
class NumberCollection implements Iterator
{
    private int $position = 0;

    public function __construct(private array $numbers)
    {
    }

    public function rewind(): void
    {
        $this->position = 0;
    }

    public function current(): mixed
    {
        return $this->numbers[$this->position];
    }

    public function key(): mixed
    {
        return $this->position;
    }

    public function next(): void
    {
        $this->position++;
    }

    // TODO: valid(): bool を実装する
    // 現在位置に要素が存在するかをissetで返す
}

$col = new NumberCollection([10, 20, 30]);
foreach ($col as $i => $n) {
    echo $i . '番目: ' . $n . PHP_EOL;
}`,
      solution: `<?php
class NumberCollection implements Iterator
{
    private int $position = 0;

    public function __construct(private array $numbers)
    {
    }

    public function rewind(): void
    {
        $this->position = 0;
    }

    public function current(): mixed
    {
        return $this->numbers[$this->position];
    }

    public function key(): mixed
    {
        return $this->position;
    }

    public function next(): void
    {
        $this->position++;
    }

    public function valid(): bool
    {
        // falseを返すとforeachが終了する
        return isset($this->numbers[$this->position]);
    }
}

$col = new NumberCollection([10, 20, 30]);
foreach ($col as $i => $n) {
    echo $i . '番目: ' . $n . PHP_EOL;
}`,
      hints: [
        `インターフェースのメソッドを1つでも実装し忘れると、クラス定義の時点で致命的エラーになります。`,
        `public function valid(): bool { return isset($this->numbers[$this->position]); } を追加します。`
      ],
      expectedOutput: "1番目: 20"
    },
    {
      id: 139,
      title: "Countable・ArrayAccess（概要と最小実装）",
      explanation: `<p>Iteratorの仲間として、オブジェクトを「配列っぽく」扱えるようにするインターフェースがあと2つあります。</p>
<table>
<tr><th>インターフェース</th><th>できること</th><th>必要なメソッド</th></tr>
<tr><td><code>Countable</code></td><td><code>count($obj)</code>が使える</td><td><code>count(): int</code>の1つだけ</td></tr>
<tr><td><code>ArrayAccess</code></td><td><code>$obj[0]</code>や<code>$obj[] = 値</code>が使える</td><td>offset系4メソッド</td></tr>
</table>
<p>ArrayAccessの4メソッドと、対応する操作は次のとおりです。</p>
<ul>
<li><code>offsetGet($offset): mixed</code> — <code>$obj[$k]</code>で読むとき</li>
<li><code>offsetSet($offset, $value): void</code> — <code>$obj[$k] = $v</code>や<code>$obj[] = $v</code>で書くとき</li>
<li><code>offsetExists($offset): bool</code> — <code>isset($obj[$k])</code>のとき</li>
<li><code>offsetUnset($offset): void</code> — <code>unset($obj[$k])</code>のとき</li>
</ul>
<p>1つだけ罠があります。<code>$obj[] = $v</code>（末尾追加）のとき、offsetSetの<code>$offset</code>には<strong>nullが渡されます</strong>。そのためoffsetSetの中では「nullなら末尾追加、そうでなければ指定位置へ代入」と分岐するのが定番の実装です。</p>
<pre><code>public function offsetSet(mixed $offset, mixed $value): void
{
    if ($offset === null) {
        $this-&gt;tags[] = $value;   // $obj[] = 値 のとき
    } else {
        $this-&gt;tags[$offset] = $value;
    }
}</code></pre>
<p>複数のインターフェースは<code>implements Countable, ArrayAccess</code>のようにカンマ区切りで同時に実装できます。「中身は配列を1つ持つだけのクラス」でも、これらを実装すると使い勝手が組み込み配列に近づきます。バリデーション付きのコレクションクラスなどで使われるテクニックです。</p>`,
      task: `TagListクラスにCountableのcount()を実装し、offsetSetの「nullなら末尾追加」の分岐を完成させてください。完成するとcount($tags)と$tags[] = '値'が使えるようになります。`,
      code: `<?php
class TagList implements Countable, ArrayAccess
{
    private array $tags = [];

    // TODO: count(): int を実装する（$this->tagsの件数を返す）

    public function offsetExists(mixed $offset): bool
    {
        return isset($this->tags[$offset]);
    }

    public function offsetGet(mixed $offset): mixed
    {
        return $this->tags[$offset] ?? null;
    }

    public function offsetSet(mixed $offset, mixed $value): void
    {
        // TODO: $offsetがnullなら末尾追加、そうでなければ$offsetの位置へ代入する
    }

    public function offsetUnset(mixed $offset): void
    {
        unset($this->tags[$offset]);
    }
}

$tags = new TagList();
$tags[] = 'PHP';
$tags[] = 'Generator';
$tags[0] = 'PHP8';

echo 'タグ数: ' . count($tags) . PHP_EOL;
echo '先頭: ' . $tags[0] . PHP_EOL;
echo isset($tags[5]) ? 'あり' : 'なし';
echo PHP_EOL;`,
      solution: `<?php
class TagList implements Countable, ArrayAccess
{
    private array $tags = [];

    public function count(): int
    {
        // count($obj)と書いたときに呼ばれる
        return count($this->tags);
    }

    public function offsetExists(mixed $offset): bool
    {
        return isset($this->tags[$offset]);
    }

    public function offsetGet(mixed $offset): mixed
    {
        return $this->tags[$offset] ?? null;
    }

    public function offsetSet(mixed $offset, mixed $value): void
    {
        // $obj[] = 値 のときは$offsetにnullが渡される
        if ($offset === null) {
            $this->tags[] = $value;
        } else {
            $this->tags[$offset] = $value;
        }
    }

    public function offsetUnset(mixed $offset): void
    {
        unset($this->tags[$offset]);
    }
}

$tags = new TagList();
$tags[] = 'PHP';
$tags[] = 'Generator';
$tags[0] = 'PHP8';

echo 'タグ数: ' . count($tags) . PHP_EOL;
echo '先頭: ' . $tags[0] . PHP_EOL;
echo isset($tags[5]) ? 'あり' : 'なし';
echo PHP_EOL;`,
      hints: [
        `count()の中身は組み込みのcount関数に委ねて return count($this->tags); で十分です。`,
        `offsetSetは if ($offset === null) { $this->tags[] = $value; } else { $this->tags[$offset] = $value; } と分岐します。`
      ],
      expectedOutput: "タグ数: 2"
    },
    {
      id: 140,
      title: "総合演習：ページネーションジェネレータ",
      explanation: `<p>章の総仕上げとして、実務で頻出の<strong>ページネーション（ページ分割）</strong>をジェネレータで実装します。「7件の商品を3件ずつのページに分けて順に処理する」という、一覧画面やバッチ処理の土台になるロジックです。</p>
<p>設計はこの章で学んだことの組み合わせです。</p>
<ol>
<li>総ページ数を計算する。「総件数÷1ページの件数」の<strong>切り上げ</strong>なので、<code>intdiv($total + $perPage - 1, $perPage)</code>という切り上げ整数割り算のイディオムを使います（7件÷3件なら3ページ）</li>
<li>ページ番号1からページ数までループし、<code>array_slice()</code>でそのページ分の要素を切り出す</li>
<li><code>yield ページ番号 =&gt; 要素の配列;</code>のキー付きyieldで1ページずつ生み出す</li>
</ol>
<p><code>array_slice($items, $offset, $length)</code>は「$offset番目から$length個」を取り出す関数です。ページ番号との対応は次のようになります。</p>
<table>
<tr><th>ページ</th><th>$offsetの式</th><th>取り出す範囲（3件ずつ）</th></tr>
<tr><td>1</td><td>(1-1)*3 = 0</td><td>0〜2番目</td></tr>
<tr><td>2</td><td>(2-1)*3 = 3</td><td>3〜5番目</td></tr>
<tr><td>3</td><td>(3-1)*3 = 6</td><td>6番目（残り1件だけ）</td></tr>
</table>
<p>最終ページが3件に満たなくても、array_sliceは「あるだけ」を返してくれるので特別な処理は不要です。全ページ分の配列を先に作らず、要求されたページだけを1枚ずつ生み出すのがジェネレータらしい設計です。実務ではarray_sliceの部分が「DBからLIMIT/OFFSETで取得」に置き換わります。</p>`,
      task: `ジェネレータ<code>paginate</code>を完成させてください。総ページ数を切り上げ計算し、ページ番号をキー、そのページの要素配列を値としてyieldします。1ページは3件です。`,
      code: `<?php
function paginate(array $items, int $perPage): Generator
{
    $total = count($items);
    // TODO: 総ページ数をintdivの切り上げイディオムで計算する
    $pages = 0;

    for ($page = 1; $page <= $pages; $page++) {
        // TODO: このページの開始位置$offsetを計算する

        // TODO: array_sliceでこのページの要素を切り出し、
        //       「ページ番号 => 要素配列」の形でyieldする
    }
}

$items = ['りんご', 'みかん', 'ぶどう', 'もも', 'なし', 'かき', 'いちご'];

foreach (paginate($items, 3) as $page => $chunk) {
    echo '--- ' . $page . 'ページ目 ---' . PHP_EOL;
    foreach ($chunk as $item) {
        echo $item . PHP_EOL;
    }
}
echo '全' . count($items) . '件' . PHP_EOL;`,
      solution: `<?php
function paginate(array $items, int $perPage): Generator
{
    $total = count($items);
    // 切り上げの整数割り算：7件を3件ずつなら3ページ
    $pages = intdiv($total + $perPage - 1, $perPage);

    for ($page = 1; $page <= $pages; $page++) {
        $offset = ($page - 1) * $perPage;

        // 要求されたページだけを1枚ずつ生み出す（キー付きyield）
        yield $page => array_slice($items, $offset, $perPage);
    }
}

$items = ['りんご', 'みかん', 'ぶどう', 'もも', 'なし', 'かき', 'いちご'];

foreach (paginate($items, 3) as $page => $chunk) {
    echo '--- ' . $page . 'ページ目 ---' . PHP_EOL;
    foreach ($chunk as $item) {
        echo $item . PHP_EOL;
    }
}
echo '全' . count($items) . '件' . PHP_EOL;`,
      hints: [
        `切り上げのページ数は intdiv($total + $perPage - 1, $perPage) です。7件・3件ずつで3になることを確かめましょう。`,
        `開始位置は $offset = ($page - 1) * $perPage; です。`,
        `yield $page => array_slice($items, $offset, $perPage); でキー付きyieldにします。`
      ],
      expectedOutput: "--- 3ページ目 ---"
    }
  ]
});
