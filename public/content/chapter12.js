// 第12章：クロージャと関数型
registerChapter({
  number: 12,
  title: "クロージャと関数型",
  description: "関数を値として扱う無名関数（クロージャ）とアロー関数を学び、array_mapやusortなどと組み合わせた関数型スタイルのプログラミングを身につけます。",
  steps: [
    {
      id: 111,
      title: "無名関数（クロージャ）の基本",
      explanation: `<p>PHPでは関数を<strong>値として変数に代入</strong>できます。名前を付けずにその場で定義する関数を<strong>無名関数</strong>（またはクロージャ）と呼びます。</p>
<pre><code>&lt;?php
// 関数を変数$doubleに代入する。末尾のセミコロンを忘れずに
$double = function (int $x): int {
    return $x * 2;
};

echo $double(5); // 変数名(引数) で呼び出せる。結果は10</code></pre>
<p>通常の関数定義との違いを整理します。</p>
<table>
<tr><th>比較</th><th>通常の関数</th><th>無名関数</th></tr>
<tr><td>名前</td><td>必要</td><td>不要（変数に入れて使う）</td></tr>
<tr><td>定義の末尾</td><td>セミコロン不要</td><td>代入文なのでセミコロン必要</td></tr>
<tr><td>正体</td><td>関数</td><td>Closureクラスのオブジェクト</td></tr>
</table>
<p>無名関数の正体は<code>Closure</code>という組み込みクラスのオブジェクトです。つまり「関数がオブジェクトとして存在する」ため、変数に入れる・関数の引数として渡す・関数の戻り値にする、といった操作がすべて可能になります。この性質を使ったプログラミングスタイルをこの章で学んでいきます。</p>
<p>引数の型宣言や戻り値の型宣言は、通常の関数とまったく同じ書き方が使えます。まずは「定義して、変数経由で呼び出す」という基本の型に慣れましょう。</p>`,
      task: `コードを実行して無名関数の動作を観察してください。その後、新しい無名関数<code>$triple</code>（引数を3倍して返す）を追加し、<code>$triple(14)</code>の結果を表示してください。`,
      code: `<?php
// 無名関数を変数に代入する（末尾のセミコロンに注意）
$double = function (int $x): int {
    return $x * 2;
};

// 変数名(引数)で呼び出す
echo $double(5) . PHP_EOL;

// 無名関数の正体はClosureクラスのオブジェクト
var_dump($double instanceof Closure);

// TODO: 引数を3倍して返す無名関数$tripleを定義し、
// $triple(14)の結果を表示する（42になるはず）
`,
      solution: `<?php
// 無名関数を変数に代入する（末尾のセミコロンに注意）
$double = function (int $x): int {
    return $x * 2;
};

// 変数名(引数)で呼び出す
echo $double(5) . PHP_EOL;

// 無名関数の正体はClosureクラスのオブジェクト
var_dump($double instanceof Closure);

// 引数を3倍して返す無名関数
$triple = function (int $x): int {
    return $x * 3;
};
echo $triple(14) . PHP_EOL;`,
      hints: [
        `$doubleの定義をまねて、返す値を<code>$x * 3</code>に変えるだけです。`,
        `代入文なので、閉じ波括弧の後にセミコロンが必要です。`,
        `呼び出しは<code>echo $triple(14) . PHP_EOL;</code>です。`
      ],
      expectedOutput: "42"
    },
    {
      id: 112,
      title: "useで外の変数を取り込む",
      explanation: `<p>PHPの無名関数は、<strong>外側のスコープの変数を自動では参照できません</strong>。JavaScriptなど他言語の経験があると意外に感じるポイントです。外の変数を使いたいときは<code>use</code>で明示的に取り込みます。</p>
<pre><code>&lt;?php
$rate = 1.1;

// use ($rate) で外側の$rateを取り込む
$withTax = function (int $price) use ($rate): int {
    return (int) round($price * $rate);
};

echo $withTax(100); // 110</code></pre>
<p><code>use</code>を書き忘れると、関数の中では<code>$rate</code>が未定義変数となりWarningが発生します（PHP 8では「Warning: Undefined variable」）。</p>
<p>重要な性質は、<code>use</code>が<strong>定義した時点の値のコピー</strong>を取り込むことです。</p>
<pre><code>&lt;?php
$rate = 1.1;
$withTax = function (int $price) use ($rate): int {
    return (int) round($price * $rate);
};

$rate = 2.0;          // 後から外側を変更しても…
echo $withTax(100);   // 110のまま（定義時の1.1を記憶している）</code></pre>
<p>このように「定義時の環境（変数）を閉じ込めて持ち歩く」ことが、クロージャ（closure＝閉包）という名前の由来です。値のコピーではなく変数そのものを共有したい場合の書き方は、次のステップで学びます。</p>`,
      task: `無名関数<code>$withTax</code>の中で外側の変数<code>$rate</code>を使っていますが、<code>use</code>を書き忘れているためWarningが出て正しく計算できません。<code>use</code>を追加して修正してください。`,
      code: `<?php
$rate = 1.1;

// TODO: 外側の$rateを取り込むuseが抜けているため、
// 「Warning: Undefined variable $rate」が出てしまう。useを追加する
$withTax = function (int $price): int {
    return (int) round($price * $rate);
};

echo $withTax(100) . PHP_EOL;

// useは「定義時点の値のコピー」を取り込む。
// 後から$rateを変えても結果は変わらないことを確認する
$rate = 2.0;
echo $withTax(100) . PHP_EOL;`,
      solution: `<?php
$rate = 1.1;

// use ($rate) で外側の変数を取り込む（定義時点の値のコピー）
$withTax = function (int $price) use ($rate): int {
    return (int) round($price * $rate);
};

echo $withTax(100) . PHP_EOL;

// useは「定義時点の値のコピー」を取り込む。
// 後から$rateを変えても結果は変わらないことを確認する
$rate = 2.0;
echo $withTax(100) . PHP_EOL;`,
      hints: [
        `useは引数リストの後ろに書きます：<code>function (int $price) use ($rate): int</code>`,
        `useの位置は「引数の括弧」と「戻り値の型宣言」の間です。`,
        `修正後は2回とも110が表示されます。$rate = 2.0の変更が反映されない理由を考えてみましょう。`
      ],
      expectedOutput: "110"
    },
    {
      id: 113,
      title: "use (&$var)参照キャプチャとの違い",
      explanation: `<p>前ステップで学んだ<code>use ($var)</code>は値のコピーを取り込むため、クロージャの中で変更しても<strong>外側の変数には影響しません</strong>。外側の変数そのものを共有したいときは、変数名の前に<code>&amp;</code>を付けて<strong>参照キャプチャ</strong>にします。</p>
<pre><code>&lt;?php
$count = 0;

// &amp;$count で外側の変数そのものを共有する
$increment = function () use (&amp;$count) {
    $count++;
};

$increment();
$increment();
echo $count; // 2（外側の変数が実際に増えている）</code></pre>
<p>2つのキャプチャ方法の違いを整理します。</p>
<table>
<tr><th>比較</th><th><code>use ($var)</code>（値）</th><th><code>use (&amp;$var)</code>（参照）</th></tr>
<tr><td>取り込むもの</td><td>定義時点の値のコピー</td><td>変数そのもの</td></tr>
<tr><td>中での変更</td><td>外に影響しない</td><td>外に反映される</td></tr>
<tr><td>外での変更</td><td>中に反映されない</td><td>中に反映される</td></tr>
</table>
<p>参照キャプチャは「呼び出しのたびに外側の状態を更新する」カウンタや集計処理で便利ですが、<strong>多用は禁物</strong>です。どこで変数が書き換わるのか追いにくくなり、バグの温床になります。実務では値キャプチャを基本とし、参照キャプチャは合計・件数などの集計に限定して使うのが安全な方針です。</p>`,
      task: `クロージャ<code>$addToTotal</code>は値キャプチャのため、いくら呼んでも外側の<code>$total</code>が0のままです。参照キャプチャに修正して、合計が正しく集計されるようにしてください。`,
      code: `<?php
$total = 0;

// TODO: 値キャプチャでは$totalのコピーに加算されるだけで、
// 外側の$totalは変わらない。参照キャプチャに修正する
$addToTotal = function (int $n) use ($total) {
    $total += $n;
};

$addToTotal(10);
$addToTotal(5);
$addToTotal(3);

// 参照キャプチャに直すと18になる
echo '合計: ' . $total . PHP_EOL;`,
      solution: `<?php
$total = 0;

// use (&$total) で外側の変数そのものを共有する参照キャプチャ
$addToTotal = function (int $n) use (&$total) {
    $total += $n;
};

$addToTotal(10);
$addToTotal(5);
$addToTotal(3);

// 参照キャプチャなので外側の$totalが実際に更新されている
echo '合計: ' . $total . PHP_EOL;`,
      hints: [
        `値キャプチャ<code>use ($total)</code>はコピーなので、中で加算しても外側は変わりません。`,
        `変数名の前に<code>&amp;</code>を付けて<code>use (&amp;$total)</code>とすると、変数そのものを共有できます。`,
        `修正後の出力は「合計: 18」になります。`
      ],
      expectedOutput: "合計: 18"
    },
    {
      id: 114,
      title: "アロー関数fn（自動キャプチャ）",
      explanation: `<p>PHP 7.4で導入された<strong>アロー関数</strong>は、無名関数を短く書ける構文です。<code>fn (引数) =&gt; 式</code>の形で書き、式の結果が自動的に戻り値になります。</p>
<pre><code>&lt;?php
$rate = 1.1;

// useを書かなくても外側の$rateを自動で使える
$withTax = fn (int $price): int =&gt; (int) round($price * $rate);

echo $withTax(200); // 220</code></pre>
<p>従来の無名関数との違いは次のとおりです。</p>
<table>
<tr><th>比較</th><th><code>function</code></th><th><code>fn</code></th></tr>
<tr><td>本体</td><td>複数の文が書ける</td><td>単一の式のみ</td></tr>
<tr><td>return</td><td>明示的に書く</td><td>不要（式の値が戻り値）</td></tr>
<tr><td>外側の変数</td><td><code>use</code>で明示的に取り込む</td><td>自動で取り込む（値キャプチャ）</td></tr>
<tr><td>参照キャプチャ</td><td><code>use (&amp;$var)</code>で可能</td><td>できない</td></tr>
</table>
<p>最大の特徴は<strong>自動キャプチャ</strong>です。本体の式で使っている外側の変数を、<code>use</code>なしで自動的に取り込みます。取り込み方は常に<strong>値のコピー</strong>で、参照キャプチャはできません。</p>
<p>使い分けの目安はシンプルです。1つの式で完結する変換・判定はアロー関数、複数の文や参照キャプチャが必要なら従来の<code>function</code>を使います。後のステップで学ぶ<code>array_map</code>などのコールバックでは、アロー関数の短さが特に活きます。</p>`,
      task: `<code>function ... use ...</code>で書かれた2つの無名関数を、アロー関数<code>fn</code>を使った形に書き換えてください。動作は変えないこと。`,
      code: `<?php
$rate = 1.1;

// TODO: この無名関数をアロー関数fnに書き換える（useは不要になる）
$withTax = function (int $price) use ($rate): int {
    return (int) round($price * $rate);
};

// TODO: こちらもアロー関数に書き換える
$add = function (int $a, int $b): int {
    return $a + $b;
};

echo $withTax(200) . PHP_EOL;
echo $add(3, 4) . PHP_EOL;`,
      solution: `<?php
$rate = 1.1;

// アロー関数は外側の変数を自動で取り込む（値キャプチャ）
$withTax = fn (int $price): int => (int) round($price * $rate);

// 式の結果がそのまま戻り値になるのでreturnは書かない
$add = fn (int $a, int $b): int => $a + $b;

echo $withTax(200) . PHP_EOL;
echo $add(3, 4) . PHP_EOL;`,
      hints: [
        `形は<code>fn (引数): 戻り値型 =&gt; 式;</code>です。波括弧とreturnは書きません。`,
        `アロー関数は外側の変数を自動で取り込むので、<code>use ($rate)</code>を消せます。`,
        `<code>$withTax = fn (int $price): int =&gt; (int) round($price * $rate);</code>の形になります。`
      ],
      expectedOutput: "220"
    },
    {
      id: 115,
      title: "callableと関数を引数に渡す",
      explanation: `<p>関数を値として扱えるということは、<strong>関数を別の関数の引数として渡せる</strong>ということです。引数として渡される関数を<strong>コールバック関数</strong>と呼び、それを受け取る引数には<code>callable</code>型を宣言します。</p>
<pre><code>&lt;?php
// 「呼び出せるもの」なら何でも受け取れる
function applyTwice(callable $f, int $value): int
{
    return $f($f($value)); // 受け取った関数を2回適用する
}

$increment = fn (int $x): int =&gt; $x + 1;
echo applyTwice($increment, 10); // 12</code></pre>
<p><code>callable</code>として渡せるものは複数あります。</p>
<table>
<tr><th>渡せるもの</th><th>例</th></tr>
<tr><td>無名関数・アロー関数</td><td><code>fn ($x) =&gt; $x + 1</code></td></tr>
<tr><td>関数名の文字列</td><td><code>'abs'</code>、<code>'strtoupper'</code></td></tr>
<tr><td>メソッドの配列形式</td><td><code>[$obj, 'メソッド名']</code></td></tr>
</table>
<p>組み込み関数の<code>abs</code>も<code>'abs'</code>という文字列で渡せる点は覚えておくと便利です（より現代的な渡し方をステップ117で学びます）。</p>
<p>この「処理の一部を外から差し込む」パターンは、<strong>共通の枠組みと可変の処理を分離する</strong>強力な設計手法です。「2回適用する」という枠組みはapplyTwiceが持ち、「何をするか」は呼び出し側が決める——この役割分担が、後で学ぶarray_mapやusortの理解につながります。</p>`,
      task: `<code>callable</code>型の引数<code>$f</code>を受け取り、<code>$value</code>に2回適用した結果を返す関数<code>applyTwice</code>を完成させてください。`,
      code: `<?php
// TODO: 受け取った関数$fを$valueに2回適用して返す
// 例：$fが「+1する関数」なら、10 -> 11 -> 12
function applyTwice(callable $f, int $value): int
{
    return 0; // ここを実装する
}

$increment = fn (int $x): int => $x + 1;
echo 'increment x2: ' . applyTwice($increment, 10) . PHP_EOL;

// アロー関数を直接渡すこともできる
echo 'triple x2: ' . applyTwice(fn (int $x): int => $x * 3, 2) . PHP_EOL;

// 組み込み関数は名前の文字列でも渡せる
echo 'abs x2: ' . applyTwice('abs', -5) . PHP_EOL;`,
      solution: `<?php
// 受け取った関数$fを$valueに2回適用して返す
function applyTwice(callable $f, int $value): int
{
    return $f($f($value));
}

$increment = fn (int $x): int => $x + 1;
echo 'increment x2: ' . applyTwice($increment, 10) . PHP_EOL;

// アロー関数を直接渡すこともできる
echo 'triple x2: ' . applyTwice(fn (int $x): int => $x * 3, 2) . PHP_EOL;

// 組み込み関数は名前の文字列でも渡せる
echo 'abs x2: ' . applyTwice('abs', -5) . PHP_EOL;`,
      hints: [
        `callableで受け取った$fは、<code>$f($value)</code>のように普通の関数として呼び出せます。`,
        `「2回適用」は、1回目の結果をもう一度$fに渡すことです。`,
        `<code>return $f($f($value));</code>と入れ子で書けます。`
      ],
      expectedOutput: "triple x2: 18"
    },
    {
      id: 116,
      title: "関数を返す関数（カリー化入門）",
      explanation: `<p>関数は引数として渡せるだけでなく、<strong>戻り値として返す</strong>こともできます。「一部の設定だけ先に決めておき、残りの引数は後で受け取る」関数を作れるようになります。</p>
<pre><code>&lt;?php
// 「$nを足す関数」を作って返す関数
function makeAdder(int $n): Closure
{
    return function (int $x) use ($n): int {
        return $x + $n;
    };
}

$add5 = makeAdder(5);     // 「5を足す関数」ができる
$add100 = makeAdder(100); // 「100を足す関数」ができる
echo $add5(10);   // 15
echo $add100(10); // 110</code></pre>
<p>ポイントは、返されたクロージャが<code>use ($n)</code>で<strong>作られたときの$nを記憶し続ける</strong>ことです。makeAdderの実行が終わった後も、$add5は「n=5」、$add100は「n=100」をそれぞれ独立に保持しています。ステップ112で学んだ「定義時の環境を閉じ込める」性質がここで本領を発揮します。</p>
<p>このように「複数の引数を一度に受け取る代わりに、1つずつ受け取る関数の連なりに分解する」考え方を<strong>カリー化</strong>と呼びます。戻り値の関数をすぐ呼び出す2段階呼び出しも可能です。</p>
<pre><code>&lt;?php
echo makeAdder(3)(4); // 7（作った関数をその場で呼ぶ）</code></pre>
<p>実務では「設定を部分適用したバリデータやフォーマッタを量産する」ときに使う、関数型スタイルの核となるテクニックです（第12章の総合演習で実践します）。</p>`,
      task: `整数<code>$n</code>を受け取り、「引数に<code>$n</code>を掛けて返す関数」を返す関数<code>makeMultiplier</code>を完成させてください。`,
      code: `<?php
// TODO: 「$xに$nを掛けて返すクロージャ」を返すように実装する
// useで$nを取り込むのを忘れずに
function makeMultiplier(int $n): Closure
{
    return function (int $x): int {
        return $x; // ここを修正する
    };
}

$double = makeMultiplier(2);
$triple = makeMultiplier(3);

echo $double(10) . PHP_EOL;
echo $triple(10) . PHP_EOL;

// それぞれが自分の$nを独立に記憶していることを確認
echo $double(7) . PHP_EOL;

// 2段階呼び出し：作った関数をその場で呼ぶ
echo makeMultiplier(5)(8) . PHP_EOL;`,
      solution: `<?php
// 「$xに$nを掛けて返すクロージャ」を返す関数
function makeMultiplier(int $n): Closure
{
    // 返されるクロージャは、作られたときの$nを記憶し続ける
    return function (int $x) use ($n): int {
        return $x * $n;
    };
}

$double = makeMultiplier(2);
$triple = makeMultiplier(3);

echo $double(10) . PHP_EOL;
echo $triple(10) . PHP_EOL;

// それぞれが自分の$nを独立に記憶していることを確認
echo $double(7) . PHP_EOL;

// 2段階呼び出し：作った関数をその場で呼ぶ
echo makeMultiplier(5)(8) . PHP_EOL;`,
      hints: [
        `外側の引数$nをクロージャの中で使うには、<code>use ($n)</code>が必要です（ステップ112参照）。`,
        `返すクロージャの本体は<code>return $x * $n;</code>です。`,
        `出力は上から20、30、14、40になるはずです。`
      ],
      expectedOutput: "40"
    },
    {
      id: 117,
      title: "first-class callable構文（PHP 8.1：strlen(...)）",
      explanation: `<p>既存の関数をクロージャとして取り出したいとき、PHP 8.1からは<strong>first-class callable構文</strong>が使えます。関数名に<code>(...)</code>を付けるだけです。</p>
<pre><code>&lt;?php
$len = strlen(...);   // strlen関数をClosureとして取り出す
echo $len('hello');   // 5

$upper = strtoupper(...);
echo $upper('php');   // PHP</code></pre>
<p><code>(...)</code>は「引数をまだ渡していない」ことを表す専用の記法で、呼び出しではなく<strong>Closureオブジェクトの生成</strong>になります。メソッドにも使えます。</p>
<pre><code>&lt;?php
$calc = new Calculator();
$double = $calc-&gt;double(...); // メソッドもClosureにできる</code></pre>
<p>従来の書き方と比べてみましょう。</p>
<table>
<tr><th>書き方</th><th>例</th><th>弱点</th></tr>
<tr><td>関数名の文字列</td><td><code>'strlen'</code></td><td>タイプミスに実行時まで気づけない。エディタの補完・定義ジャンプが効かない</td></tr>
<tr><td>ラップする</td><td><code>fn ($s) =&gt; strlen($s)</code></td><td>冗長。引数の受け渡しを書き写すだけ</td></tr>
<tr><td>first-class callable</td><td><code>strlen(...)</code></td><td>PHP 8.1以降でのみ使える</td></tr>
</table>
<p>first-class callable構文なら、存在しない関数名は<strong>その場でエラーになり</strong>、静的解析やエディタのリネーム機能も正しく追跡できます。既存の関数をコールバックとして渡す場面（次ステップのarray_mapなど）では、この構文が現在の推奨スタイルです。</p>`,
      task: `文字列のコールバックとラップ用アロー関数で書かれた3か所を、first-class callable構文<code>関数名(...)</code>に書き換えてください。`,
      code: `<?php
class Calculator
{
    public function double(int $x): int
    {
        return $x * 2;
    }
}

// TODO: 文字列'strlen'をfirst-class callable構文に書き換える
$len = 'strlen';
echo $len('hello') . PHP_EOL;

// TODO: このラップ用アロー関数もfirst-class callable構文に書き換える
$upper = fn (string $s): string => strtoupper($s);
echo $upper('php') . PHP_EOL;

// TODO: メソッドの配列形式[$calc, 'double']も書き換える
$calc = new Calculator();
$double = [$calc, 'double'];
echo $double(21) . PHP_EOL;

// first-class callable構文で作ったものはClosureオブジェクトになる
var_dump($len instanceof Closure);`,
      solution: `<?php
class Calculator
{
    public function double(int $x): int
    {
        return $x * 2;
    }
}

// 関数名(...)でClosureとして取り出す
$len = strlen(...);
echo $len('hello') . PHP_EOL;

// ラップ用アロー関数は不要。直接取り出せる
$upper = strtoupper(...);
echo $upper('php') . PHP_EOL;

// メソッドも$obj->メソッド名(...)でClosureにできる
$calc = new Calculator();
$double = $calc->double(...);
echo $double(21) . PHP_EOL;

// first-class callable構文で作ったものはClosureオブジェクトになる
var_dump($len instanceof Closure);`,
      hints: [
        `関数は<code>strlen(...)</code>、メソッドは<code>$calc-&gt;double(...)</code>と書きます。`,
        `<code>(...)</code>のドットはちょうど3つです。引数は何も書きません。`,
        `書き換え後、最後のvar_dumpがbool(true)に変わることも確認しましょう。`
      ],
      expectedOutput: "42"
    },
    {
      id: 118,
      title: "array_map・array_filterとクロージャの実践",
      explanation: `<p>クロージャが最も活躍するのが、配列を一括処理する組み込み関数との組み合わせです。代表格が<code>array_map</code>（全要素を変換）と<code>array_filter</code>（条件に合う要素だけ残す）です。</p>
<pre><code>&lt;?php
$prices = [100, 250, 480];

// array_map：各要素にコールバックを適用した新しい配列を返す
$withTax = array_map(fn (int $p): int =&gt; (int) round($p * 1.1), $prices);
// [110, 275, 528]

// array_filter：コールバックがtrueを返した要素だけ残す
$expensive = array_filter($prices, fn (int $p): bool =&gt; $p &gt;= 300);
// [2 =&gt; 480]  ←キーに注意！</code></pre>
<p>2つの関数で<strong>引数の順序が逆</strong>である点に注意してください。</p>
<table>
<tr><th>関数</th><th>引数の順序</th><th>返す配列</th><th>キー</th></tr>
<tr><td><code>array_map</code></td><td>コールバック, 配列</td><td>全要素を変換した配列</td><td>元のまま</td></tr>
<tr><td><code>array_filter</code></td><td>配列, コールバック</td><td>条件を満たす要素のみ</td><td><strong>元のキーを保持</strong>（隙間ができる）</td></tr>
</table>
<p><code>array_filter</code>は元のキーを保持するため、結果は<code>[2 =&gt; 480]</code>のように添字が飛び飛びになります。連番に振り直したいときは<code>array_values()</code>を通します。この「filterの後はarray_values」は実務の頻出イディオムです。</p>
<p>foreachで書くよりも「何をしたいか（変換なのか絞り込みなのか）」が関数名から即座に読み取れるのが、このスタイルの利点です。</p>`,
      task: `(1)<code>array_map</code>とアロー関数で全価格を税込（1.1倍して<code>round</code>で四捨五入、int化）に変換 (2)<code>array_filter</code>で300円以上だけ抽出 (3)<code>array_values</code>でキーを連番に振り直してください。`,
      code: `<?php
$prices = [100, 250, 480, 1200];

// TODO: array_mapとアロー関数で税込価格（1.1倍を四捨五入してint化）の配列を作る
// ヒント：(int) round($p * 1.1)
$withTax = [];
echo '税込: ' . implode(', ', $withTax) . PHP_EOL;

// TODO: array_filterとアロー関数で300以上の価格だけ残す
$expensive = [];
echo '高額: ' . implode(', ', $expensive) . PHP_EOL;

// TODO: array_filterはキーを保持するので、array_valuesで連番に振り直す
$reindexed = $expensive;
var_dump(array_keys($reindexed));`,
      solution: `<?php
$prices = [100, 250, 480, 1200];

// array_mapで全要素を税込価格に変換する（第1引数がコールバック）
$withTax = array_map(fn (int $p): int => (int) round($p * 1.1), $prices);
echo '税込: ' . implode(', ', $withTax) . PHP_EOL;

// array_filterで300以上の価格だけ残す（第2引数がコールバック）
$expensive = array_filter($prices, fn (int $p): bool => $p >= 300);
echo '高額: ' . implode(', ', $expensive) . PHP_EOL;

// array_filterはキーを保持するので、array_valuesで連番に振り直す
$reindexed = array_values($expensive);
var_dump(array_keys($reindexed));`,
      hints: [
        `array_mapは<code>array_map(コールバック, 配列)</code>、array_filterは<code>array_filter(配列, コールバック)</code>と順序が逆です。`,
        `filterのコールバックは<code>fn (int $p): bool =&gt; $p &gt;= 300</code>のようにtrueかfalseを返します。`,
        `振り直しは<code>array_values($expensive)</code>です。array_keysの出力で0, 1の連番になったか確認できます。`
      ],
      expectedOutput: "税込: 110, 275, 528, 1320"
    },
    {
      id: 119,
      title: "usortとクロージャで複雑なソート",
      explanation: `<p><code>sort</code>や<code>asort</code>は単純な値の並べ替えしかできませんが、<code>usort</code>を使うと<strong>比較ルールをクロージャで自由に定義</strong>できます。連想配列の特定キーで並べ替えるような実務的なソートはusortの出番です。</p>
<pre><code>&lt;?php
$users = [
    ['name' =&gt; '太郎', 'age' =&gt; 30],
    ['name' =&gt; '花子', 'age' =&gt; 25],
];

// 第2引数の比較関数が並び順を決める
usort($users, fn (array $a, array $b): int =&gt; $a['age'] &lt;=&gt; $b['age']);</code></pre>
<p>比較関数の契約は「<code>$a</code>が前なら負、同じなら0、<code>$a</code>が後ろなら正のintを返す」です。これを手書きする代わりに、<strong>宇宙船演算子</strong><code>&lt;=&gt;</code>を使うのが定番です。<code>$a &lt;=&gt; $b</code>は、$aが小さければ負・等しければ0・大きければ正を返す、比較関数のために生まれたような演算子です。</p>
<table>
<tr><th>やりたいこと</th><th>比較関数の書き方</th></tr>
<tr><td>ageの昇順</td><td><code>fn ($a, $b) =&gt; $a['age'] &lt;=&gt; $b['age']</code></td></tr>
<tr><td>ageの降順</td><td><code>fn ($a, $b) =&gt; $b['age'] &lt;=&gt; $a['age']</code>（左右を入れ替える）</td></tr>
</table>
<p>注意点は2つ。<code>usort</code>は配列を<strong>直接並べ替える</strong>（参照渡しで破壊的に変更する）こと、そして元の添字キーは連番に振り直されることです。降順にしたいときは、比較の左右を入れ替えるだけで実現できるのも覚えておきましょう。</p>`,
      task: `<code>usort</code>と宇宙船演算子<code>&lt;=&gt;</code>を使って、<code>$users</code>を年齢の昇順に並べ替えてください。比較関数はアロー関数で書くこと。`,
      code: `<?php
$users = [
    ['name' => '太郎', 'age' => 30],
    ['name' => '花子', 'age' => 25],
    ['name' => '次郎', 'age' => 35],
];

// TODO: usortと<=>を使って、ageの昇順に並べ替える
// 比較関数はアロー関数fnで書く

foreach ($users as $user) {
    echo $user['name'] . '(' . $user['age'] . ')' . PHP_EOL;
}`,
      solution: `<?php
$users = [
    ['name' => '太郎', 'age' => 30],
    ['name' => '花子', 'age' => 25],
    ['name' => '次郎', 'age' => 35],
];

// 宇宙船演算子<=>は、左が小さければ負・等しければ0・大きければ正を返す
usort($users, fn (array $a, array $b): int => $a['age'] <=> $b['age']);

foreach ($users as $user) {
    echo $user['name'] . '(' . $user['age'] . ')' . PHP_EOL;
}`,
      hints: [
        `usortの形は<code>usort($users, 比較関数);</code>です。戻り値を受け取る必要はありません（配列が直接並べ替わります）。`,
        `比較関数は2つの要素（ここでは連想配列）を受け取るので、<code>$a['age']</code>同士を比較します。`,
        `昇順は<code>fn (array $a, array $b): int =&gt; $a['age'] &lt;=&gt; $b['age']</code>です。`
      ],
      expectedOutput: "花子(25)"
    },
    {
      id: 120,
      title: "総合演習（バリデータ関数の合成）",
      explanation: `<p>この章の総仕上げとして、実務でそのまま役立つ「バリデータ関数の合成」を作ります。使う知識はすべて学習済みです。</p>
<ul>
<li><strong>関数を返す関数</strong>（ステップ116）：設定値を記憶したバリデータを量産する</li>
<li><strong>useによるキャプチャ</strong>（ステップ112）：クロージャが設定値を記憶する仕組み</li>
<li><strong>callableと関数を渡す</strong>（ステップ115）：バリデータの配列をループで適用する</li>
<li><strong>nullable型</strong>（第11章）：「エラーなし」をnullで表現する</li>
</ul>
<p>設計はこうです。バリデータとは「文字列を受け取り、問題があればエラーメッセージ（string）、なければnullを返すクロージャ」と決めます。この<strong>共通の形</strong>に揃えることが合成の鍵です。</p>
<pre><code>&lt;?php
// 「3文字以上」バリデータを作る関数
function minLength(int $min): Closure
{
    return function (string $value) use ($min): ?string {
        if (mb_strlen($value) &lt; $min) {
            return $min . '文字以上で入力してください';
        }
        return null; // 問題なし
    };
}</code></pre>
<p>同じ形のバリデータなら、配列に入れてループで順に適用できます。これが<code>combine</code>（合成）です。個々の部品は単純でも、組み合わせ方は呼び出し側が自由に決められる——小さな関数を組み合わせて大きな機能を作る、関数型スタイルの醍醐味を体験してください。</p>
<p>実務のフォームバリデーションライブラリ（Laravelのバリデータなど）も、根底にはこの「共通の形のルールを合成する」考え方があります。</p>`,
      task: `(1)<code>maxLength</code>：<code>$max</code>文字以下でなければ「◯文字以下で入力してください」を返すバリデータ生成関数を完成させる (2)<code>combine</code>：バリデータの配列を順に適用し、エラーメッセージの配列を返す関数を完成させてください。`,
      code: `<?php
// バリデータ＝「文字列を受け取り、エラーメッセージ(string)かnullを返すクロージャ」

// $min文字以上かを検査するバリデータを作る（完成済みの見本）
function minLength(int $min): Closure
{
    return function (string $value) use ($min): ?string {
        if (mb_strlen($value) < $min) {
            return $min . '文字以上で入力してください';
        }
        return null;
    };
}

// TODO: $max文字以下かを検査するバリデータを作る
// 超えていたら「$max文字以下で入力してください」（連結で作る）を返す
function maxLength(int $max): Closure
{
    return function (string $value) use ($max): ?string {
        return null; // ここを実装する
    };
}

// 禁止文字列を含まないかを検査するバリデータを作る（完成済みの見本）
function notContains(string $ng): Closure
{
    return function (string $value) use ($ng): ?string {
        if (str_contains($value, $ng)) {
            return '「' . $ng . '」は使用できません';
        }
        return null;
    };
}

// TODO: バリデータの配列を受け取り、「文字列を受け取って
// 全バリデータを順に適用し、エラーメッセージの配列を返すクロージャ」を返す
function combine(array $validators): Closure
{
    return function (string $value) use ($validators): array {
        $errors = [];
        // ここを実装する：各バリデータを$valueに適用し、
        // 戻り値がnullでなければ$errorsに追加する
        return $errors;
    };
}

// 3つのルールを合成してユーザー名バリデータを作る
$validateUserName = combine([
    minLength(3),
    maxLength(10),
    notContains(' '),
]);

foreach (['ab', 'taro yamada', 'kometaro'] as $name) {
    $errors = $validateUserName($name);
    if (count($errors) === 0) {
        echo $name . ': OK' . PHP_EOL;
    } else {
        echo $name . ': ' . implode(' / ', $errors) . PHP_EOL;
    }
}`,
      solution: `<?php
// バリデータ＝「文字列を受け取り、エラーメッセージ(string)かnullを返すクロージャ」

// $min文字以上かを検査するバリデータを作る
function minLength(int $min): Closure
{
    return function (string $value) use ($min): ?string {
        if (mb_strlen($value) < $min) {
            return $min . '文字以上で入力してください';
        }
        return null;
    };
}

// $max文字以下かを検査するバリデータを作る
function maxLength(int $max): Closure
{
    return function (string $value) use ($max): ?string {
        if (mb_strlen($value) > $max) {
            return $max . '文字以下で入力してください';
        }
        return null;
    };
}

// 禁止文字列を含まないかを検査するバリデータを作る
function notContains(string $ng): Closure
{
    return function (string $value) use ($ng): ?string {
        if (str_contains($value, $ng)) {
            return '「' . $ng . '」は使用できません';
        }
        return null;
    };
}

// バリデータの配列を合成し、エラーメッセージの配列を返すクロージャを作る
function combine(array $validators): Closure
{
    return function (string $value) use ($validators): array {
        $errors = [];
        foreach ($validators as $validator) {
            $error = $validator($value);
            if ($error !== null) {
                $errors[] = $error;
            }
        }
        return $errors;
    };
}

// 3つのルールを合成してユーザー名バリデータを作る
$validateUserName = combine([
    minLength(3),
    maxLength(10),
    notContains(' '),
]);

foreach (['ab', 'taro yamada', 'kometaro'] as $name) {
    $errors = $validateUserName($name);
    if (count($errors) === 0) {
        echo $name . ': OK' . PHP_EOL;
    } else {
        echo $name . ': ' . implode(' / ', $errors) . PHP_EOL;
    }
}`,
      hints: [
        `maxLengthはminLengthの見本とほぼ同じ形です。比較の向きとメッセージだけ変えます。`,
        `combineの中では<code>foreach ($validators as $validator)</code>で回し、<code>$validator($value)</code>で適用します。`,
        `戻り値がnullでないときだけ<code>$errors[] = $error;</code>で追加します（null判定は===を使う。第11章参照）。`
      ],
      expectedOutput: "kometaro: OK"
    }
  ]
});
