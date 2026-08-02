// 第5章：関数
registerChapter({
  number: 5,
  title: "関数",
  description: "処理に名前を付けて再利用する「関数」を学びます。引数・戻り値・型宣言からスコープ・参照渡しまで、PHPの関数の基本を一通り身につけます。",
  steps: [
    {
      id: 41,
      title: "関数の定義と呼び出し",
      explanation: `<p>関数とは、一連の処理に名前を付けてまとめ、何度でも呼び出せるようにした仕組みです。同じ処理をコピーして何か所にも書くと、修正のたびに全部を直す必要がありますが、関数にまとめておけば1か所を直すだけで済みます。</p>
<p>PHPでは<code>function</code>キーワードで関数を定義します。</p>
<pre><code>&lt;?php
// 定義：この時点では中の処理はまだ実行されない
function sayHello()
{
    echo "こんにちは！\\n";
}

// 呼び出し：「関数名()」と書いた行で中の処理が実行される
sayHello();
sayHello(); // 何度でも呼べる</code></pre>
<p>押さえておきたいポイントは次の3つです。</p>
<ul>
<li><strong>定義しただけでは実行されない</strong>。呼び出されて初めて中身が動く</li>
<li>関数名には変数と違って<code>$</code>を付けない。英字かアンダースコアで始め、<code>sayHello</code>（キャメルケース）や<code>say_hello</code>（スネークケース）のように意味が伝わる名前を付ける</li>
<li>PHPの関数名は大文字小文字を区別しないが、混乱を避けるため定義と同じ表記で呼び出すのが鉄則</li>
</ul>
<p>なお、PHPでは関数の定義が呼び出しより後ろにあっても動作します（ファイルを読み込む時点で定義が先に登録されるため）。ただし読みやすさのために、定義を上・呼び出しを下にまとめる構成が一般的です。</p>`,
      task: `コードを実行して出力を確認したあと、<code>sayHello()</code>の呼び出しを2行追加して、挨拶が合計3回表示されるようにしてください。`,
      code: `<?php
// 関数の定義
function sayHello()
{
    echo "こんにちは！\\n";
}

// 関数の呼び出し
sayHello();
// TODO: sayHello()の呼び出しをあと2行追加して、合計3回表示する
`,
      solution: `<?php
// 関数の定義
function sayHello()
{
    echo "こんにちは！\\n";
}

// 関数の呼び出し
sayHello();
sayHello();
sayHello();
`,
      hints: [
        `関数は定義しただけでは動きません。「関数名()」と書いた行が実行されるたびに、中の処理が1回動きます。`,
        `sayHello();という行をあと2行追加すれば、合計3回呼び出されます。`
      ],
      expectedOutput: "こんにちは！"
    },
    {
      id: 42,
      title: "引数：関数に値を渡す",
      explanation: `<p>関数の外から値を受け取るための入口が<strong>引数（ひきすう）</strong>です。定義側の<code>( )</code>の中に書く変数を<strong>仮引数（パラメータ）</strong>、呼び出し側で実際に渡す値を<strong>実引数</strong>と呼びます。</p>
<pre><code>&lt;?php
// $nameが仮引数
function greet($name)
{
    echo "こんにちは、" . $name . "さん\\n";
}

greet("佐藤"); // "佐藤"が実引数 → こんにちは、佐藤さん
greet("鈴木"); // 渡す値を変えれば結果も変わる</code></pre>
<p>引数はカンマ区切りで複数受け取れます。呼び出し時の値は<strong>左から順に</strong>仮引数へ対応づけられます。</p>
<pre><code>&lt;?php
function showProfile($name, $age)
{
    echo $name . "（" . $age . "歳）\\n";
}

showProfile("田中", 28); // $name="田中"、$age=28</code></pre>
<p>注意点は次のとおりです。</p>
<ul>
<li>必要な引数を渡さずに呼び出すと<code>ArgumentCountError</code>という致命的エラーになる</li>
<li>仮引数はその関数の中だけで使えるローカル変数であり、関数の外の同名変数とは別物（詳しくはステップ48のスコープで学ぶ）</li>
<li>引数名は<code>$a</code>のような記号的な名前より、<code>$name</code>のように中身が伝わる名前にする</li>
</ul>`,
      task: `引数<code>$name</code>と<code>$age</code>を受け取り「田中さんは28歳です」の形式で表示する<code>introduce</code>関数を定義し、<code>introduce("田中", 28)</code>で呼び出してください。`,
      code: `<?php
// 引数を1つ受け取る関数の例
function greet($name)
{
    echo "こんにちは、" . $name . "さん\\n";
}

greet("佐藤");

// TODO: introduce関数を定義する
// （引数$nameと$ageを受け取り、「田中さんは28歳です」の形式で表示する）

// TODO: introduce("田中", 28) を呼び出す
`,
      solution: `<?php
// 引数を1つ受け取る関数の例
function greet($name)
{
    echo "こんにちは、" . $name . "さん\\n";
}

greet("佐藤");

// 引数を2つ受け取る関数
function introduce($name, $age)
{
    echo $name . "さんは" . $age . "歳です\\n";
}

introduce("田中", 28);
`,
      hints: [
        `複数の引数はfunction introduce($name, $age)のようにカンマ区切りで並べます。呼び出し時の値は左から順に対応します。`,
        `関数の中ではecho $name . "さんは" . $age . "歳です\\n";のように、文字列連結（.）で組み立てます。`
      ],
      expectedOutput: "田中さんは28歳です"
    },
    {
      id: 43,
      title: "戻り値：returnで結果を返す",
      explanation: `<p><code>echo</code>は結果を<strong>画面に表示する</strong>だけですが、<code>return</code>は結果を<strong>呼び出し元に値として返します</strong>。返された値は変数に代入したり、計算に使い回したりできるため、関数の部品としての価値が大きく上がります。</p>
<pre><code>&lt;?php
function add($a, $b)
{
    return $a + $b; // 呼び出し元に値を返す
}

$sum = add(10, 20);        // 戻り値を変数で受け取る
echo $sum . "\\n";          // 30
echo add(1, 2) + 100 . "\\n"; // 式の中でも使える → 103</code></pre>
<p><code>echo</code>と<code>return</code>の違いを整理します。</p>
<table>
<tr><th></th><th>echo</th><th>return</th></tr>
<tr><td>役割</td><td>画面に表示する</td><td>呼び出し元に値を渡す</td></tr>
<tr><td>結果の再利用</td><td>できない</td><td>変数に代入・計算に利用できる</td></tr>
<tr><td>関数の終了</td><td>しない（続きが実行される）</td><td>その場で関数が終了する</td></tr>
</table>
<p>もう1つ重要なのが、<strong><code>return</code>に到達した瞬間に関数の実行が終わる</strong>ことです。<code>return</code>より後ろの行は実行されません。また、<code>return</code>を書かなかった関数は自動的に<code>null</code>を返します。「表示されているのに変数が空」というバグは、<code>return</code>のつもりで<code>echo</code>を書いてしまったときの典型例です。</p>`,
      task: `<code>add</code>関数が<code>echo</code>で表示だけしているため、<code>$sum</code>には<code>null</code>が入ってしまいます。<code>return</code>で合計を返すように修正し、「合計は30です」「2倍は60です」と表示されるようにしてください。`,
      code: `<?php
function add($a, $b)
{
    // TODO: echoではなくreturnで合計を返すように修正する
    echo $a + $b;
}

$sum = add(10, 20);
echo "合計は" . $sum . "です\\n";       // 今は$sumがnullなので「合計はです」になる
echo "2倍は" . ($sum * 2) . "です\\n";
`,
      solution: `<?php
function add($a, $b)
{
    // returnで合計を呼び出し元に返す
    return $a + $b;
}

$sum = add(10, 20);
echo "合計は" . $sum . "です\\n";
echo "2倍は" . ($sum * 2) . "です\\n";
`,
      hints: [
        `echoは画面に表示するだけで、呼び出し元には何も渡りません。値を渡すにはreturnを使います。`,
        `関数の中身をreturn $a + $b;の1行にすると、add(10, 20)という式そのものが30という値になります。`
      ],
      expectedOutput: "合計は30です"
    },
    {
      id: 44,
      title: "型宣言：引数と戻り値の型を明示する",
      explanation: `<p>PHPでは引数と戻り値に<strong>型宣言</strong>を付けられます。引数は変数名の前に型を書き、戻り値は<code>)</code>の後ろに<code>: 型</code>と書きます。型が合わない値が渡ると<code>TypeError</code>が発生するため、バグを早い段階で発見できます。</p>
<pre><code>&lt;?php
declare(strict_types=1); // 厳密な型チェックを有効にする

function calcArea(int $width, int $height): int
{
    return $width * $height;
}

echo calcArea(10, 20); // 200</code></pre>
<p>よく使う型は次のとおりです。</p>
<table>
<tr><th>型</th><th>意味</th></tr>
<tr><td><code>int</code></td><td>整数</td></tr>
<tr><td><code>float</code></td><td>浮動小数点数</td></tr>
<tr><td><code>string</code></td><td>文字列</td></tr>
<tr><td><code>bool</code></td><td>真偽値</td></tr>
<tr><td><code>array</code></td><td>配列</td></tr>
<tr><td><code>void</code></td><td>戻り値なし（returnで値を返さない関数の戻り値型）</td></tr>
<tr><td><code>?int</code></td><td>intまたはnull（nullable型）</td></tr>
</table>
<p>ファイル先頭の<code>declare(strict_types=1);</code>は「厳密モード」の宣言です。これがないPHPは<code>"10"</code>のような数字の文字列を自動でintに変換してしまいます（緩やかモード）。厳密モードでは型が違えば即<code>TypeError</code>になるため、実務では厳密モードの利用が推奨されます。エラーメッセージには「どの引数が・何型を期待していて・実際は何型だったか」が書かれているので、落ち着いて読めば原因がすぐ分かります。</p>`,
      task: `このコードは<code>calcArea</code>に文字列<code>"10"</code>を渡しているため<code>TypeError</code>になります。まず実行してエラーメッセージを読み、引数を正しいint型に直して「面積は200です」と表示してください。`,
      code: `<?php
declare(strict_types=1);

function calcArea(int $width, int $height): int
{
    return $width * $height;
}

// このままだとTypeErrorになる（int型の引数に文字列を渡している）
echo "面積は" . calcArea("10", 20) . "です\\n";
// TODO: まず実行してエラーメッセージを確認し、引数をint型に修正する
`,
      solution: `<?php
declare(strict_types=1);

function calcArea(int $width, int $height): int
{
    return $width * $height;
}

// 引数をint型の値に修正した
echo "面積は" . calcArea(10, 20) . "です\\n";
`,
      hints: [
        `エラーメッセージのArgument #1 ($width) must be of type int, string givenは「第1引数$widthはint型のはずが文字列が渡された」という意味です。`,
        `"10"（文字列）ではなく10（整数）を渡せば型が一致します。`
      ],
      expectedOutput: "面積は200です"
    },
    {
      id: 45,
      title: "デフォルト引数：省略時の値を決めておく",
      explanation: `<p>仮引数に<code>= 値</code>を付けると、その引数を省略して呼び出したときに使われる<strong>デフォルト値</strong>を設定できます。「たいていは同じ値だが、たまに変えたい」という引数に便利です。</p>
<pre><code>&lt;?php
function drinkCoffee(string $size = "M"): void
{
    echo $size . "サイズのコーヒー\\n";
}

drinkCoffee();     // 省略 → Mサイズのコーヒー
drinkCoffee("L");  // 指定 → Lサイズのコーヒー</code></pre>
<p>重要なルールが1つあります。<strong>デフォルト値を持つ引数は、必須の引数より右側に置く</strong>ことです。左側に置くと、省略したいのに省略できない使いにくい関数になり、PHP 8.4ではDeprecated（非推奨）の警告も出ます。</p>
<pre><code>&lt;?php
// 良い例：必須（$name）が左、省略可能（$greeting）が右
function greet(string $name, string $greeting = "こんにちは"): void
{
    echo $greeting . "、" . $name . "さん\\n";
}

// 悪い例：デフォルト付きが左にあると省略できない
// function greet(string $greeting = "こんにちは", string $name) { ... }</code></pre>
<p>デフォルト値には数値・文字列・配列などのリテラルのほか、定数も使えます。一方で変数や関数呼び出しの結果は原則使えません。実務では「省略時の振る舞いが自然に想像できる値」をデフォルトにすることが、使いやすい関数設計のコツです。</p>`,
      task: `<code>greet</code>関数の<code>$greeting</code>にデフォルト値<code>"こんにちは"</code>を設定し、第2引数を省略した<code>greet("田中")</code>の呼び出しを追加して「こんにちは、田中さん」と表示してください。`,
      code: `<?php
// TODO: $greetingにデフォルト値"こんにちは"を設定する
function greet(string $name, string $greeting): void
{
    echo $greeting . "、" . $name . "さん\\n";
}

greet("佐藤", "おはよう");
// TODO: 第2引数を省略してgreet("田中")を呼び出す
`,
      solution: `<?php
// $greetingにデフォルト値を設定した
function greet(string $name, string $greeting = "こんにちは"): void
{
    echo $greeting . "、" . $name . "さん\\n";
}

greet("佐藤", "おはよう");
greet("田中"); // 第2引数を省略するとデフォルト値が使われる
`,
      hints: [
        `デフォルト値は仮引数の宣言にstring $greeting = "こんにちは"のように= 値を付けて設定します。`,
        `デフォルト値を設定すればgreet("田中")のように第2引数を省略でき、省略時は"こんにちは"が使われます。`
      ],
      expectedOutput: "こんにちは、田中さん"
    },
    {
      id: 46,
      title: "名前付き引数（PHP 8）",
      explanation: `<p>PHP 8.0からは、呼び出し時に<code>引数名: 値</code>の形式で引数を渡せる<strong>名前付き引数</strong>が使えます。引数の順序に縛られず、<strong>渡したい引数だけを名前で指定</strong>できるのが最大の利点です。</p>
<pre><code>&lt;?php
function makeCoffee(string $size = "M", int $sugar = 0, bool $ice = false): void
{
    // ...
}

// 位置引数：$iceだけ変えたいのに、手前の引数も全部書く必要がある
makeCoffee("M", 0, true);

// 名前付き引数：変えたい引数だけを指定できる
makeCoffee(ice: true);</code></pre>
<p>デフォルト引数が多い関数では、位置引数だと「途中の引数を飛ばせない」問題が起きます。名前付き引数なら間のデフォルト値をそのまま活かして、目的の引数だけ上書きできます。</p>
<p>また、<code>true</code>や<code>0</code>のような値を並べるだけの呼び出しは意味が読み取れませんが、名前付き引数なら呼び出し側のコードが仕様書のように読めます。</p>
<pre><code>&lt;?php
// 何のtrueか分からない
sendMail("hello", true);

// 意図が一目で分かる
sendMail(subject: "hello", isHtml: true);</code></pre>
<p>注意点として、名前付き引数を使うと<strong>引数名の変更が呼び出し側を壊す</strong>ようになります。つまり引数名も関数の公開仕様の一部になるため、ライブラリを作る側は引数名の変更に慎重になる必要があります。位置引数と併用する場合は「位置引数が先、名前付き引数が後」の順序で書きます。</p>`,
      task: `名前付き引数を使って「<code>$ice</code>だけ<code>true</code>にする」注文を追加し、「サイズM・砂糖0個・アイス」と表示してください。<code>$size</code>と<code>$sugar</code>はデフォルト値のままにします。`,
      code: `<?php
function makeCoffee(string $size = "M", int $sugar = 0, bool $ice = false): void
{
    $label = "サイズ" . $size . "・砂糖" . $sugar . "個";
    if ($ice) {
        $label = $label . "・アイス";
    }
    echo $label . "\\n";
}

makeCoffee("L", 2, true);
// TODO: 名前付き引数を使って「$iceだけtrue」のコーヒーを注文する
// （$sizeと$sugarはデフォルト値のまま）
`,
      solution: `<?php
function makeCoffee(string $size = "M", int $sugar = 0, bool $ice = false): void
{
    $label = "サイズ" . $size . "・砂糖" . $sugar . "個";
    if ($ice) {
        $label = $label . "・アイス";
    }
    echo $label . "\\n";
}

makeCoffee("L", 2, true);
makeCoffee(ice: true); // 名前付き引数なら$iceだけを指定できる
`,
      hints: [
        `位置引数だと3番目の$iceに届くまでに$sizeと$sugarも書く必要があります。名前付き引数なら目的の引数だけ指定できます。`,
        `呼び出しはmakeCoffee(ice: true);のように「引数名: 値」の形式で書きます。`
      ],
      expectedOutput: "サイズM・砂糖0個・アイス"
    },
    {
      id: 47,
      title: "可変長引数：...$argsで何個でも受け取る",
      explanation: `<p>仮引数の前に<code>...</code>（3つのドット）を付けると、<strong>いくつ渡されるか分からない引数をまとめて配列として受け取れます</strong>。これを可変長引数と呼びます。</p>
<pre><code>&lt;?php
function sum(int ...$numbers): int
{
    // $numbersの中身は配列： sum(1, 2, 3) なら [1, 2, 3]
    $total = 0;
    foreach ($numbers as $n) {
        $total += $n;
    }
    return $total;
}

echo sum(1, 2);          // 3
echo sum(1, 2, 3, 4, 5); // 15（何個でも渡せる）</code></pre>
<p>ポイントは次のとおりです。</p>
<ul>
<li><code>...$numbers</code>の中身は普通の配列なので、<code>foreach</code>でそのまま処理できる</li>
<li><code>int ...$numbers</code>のように型宣言も併用でき、全要素がその型かチェックされる</li>
<li>可変長引数は仮引数リストの<strong>最後に1つだけ</strong>置ける（<code>function f($first, ...$rest)</code>のように通常の引数との併用は可能）</li>
</ul>
<p>なお、PHPは引数を多めに渡してもエラーにしません。<code>function sum($a, $b)</code>に5個渡すと、余った3個は静かに無視されます。「渡したはずの値が反映されない」というバグの原因になるため、複数の値をまとめて受け取りたいときは可変長引数で明示するのが安全です。逆に呼び出し側で<code>sum(...$list)</code>と書くと、配列を展開して個々の引数として渡せます（スプレッド演算子）。</p>`,
      task: `<code>sum</code>関数を可変長引数<code>...$numbers</code>を使う形に書き換えて、渡した数値を何個でも合計できるようにし、「合計は15です」と表示してください。`,
      code: `<?php
// TODO: 引数を可変長引数 ...$numbers に書き換えて、
// 何個でも数値を受け取れるようにする（中はforeachで合計する）
function sum($a, $b)
{
    return $a + $b;
}

// 今は3個目以降が無視されて「合計は3です」になってしまう
echo "合計は" . sum(1, 2, 3, 4, 5) . "です\\n";
`,
      solution: `<?php
// 可変長引数：渡された値がすべて配列$numbersに入る
function sum(int ...$numbers): int
{
    $total = 0;
    foreach ($numbers as $n) {
        $total += $n;
    }
    return $total;
}

echo "合計は" . sum(1, 2, 3, 4, 5) . "です\\n";
`,
      hints: [
        `仮引数をfunction sum(int ...$numbers)とすると、渡された値がすべて配列$numbersにまとまります。`,
        `$total = 0;で初期化し、foreach ($numbers as $n)で1つずつ$totalに足してからreturnします。`
      ],
      expectedOutput: "合計は15です"
    },
    {
      id: 48,
      title: "スコープ：関数の中と外は別世界",
      explanation: `<p>変数が有効な範囲のことを<strong>スコープ</strong>と呼びます。PHPの関数は独立したスコープを持ち、<strong>関数の中から外側の変数は見えません</strong>。逆に、関数の中で作った変数も外からは見えません。</p>
<pre><code>&lt;?php
$rate = 0.1;

function calc(int $price)
{
    // ここから外側の$rateは見えない！
    // Warning: Undefined variable $rate が出て、null扱いで計算される
    return $price * $rate;
}</code></pre>
<p>これはバグではなく、意図された設計です。関数が外の変数に勝手にアクセスできてしまうと、「この関数の結果は引数だけでは決まらない」ことになり、動作の予測もテストも難しくなります。関数のスコープが独立しているおかげで、<strong>関数は引数と戻り値だけを見れば理解できる部品</strong>になれるのです。</p>
<p>外の値を関数で使いたいときの選択肢を整理します。</p>
<table>
<tr><th>方法</th><th>評価</th></tr>
<tr><td>引数として渡す</td><td><strong>推奨</strong>。データの流れが明確になる</td></tr>
<tr><td><code>global $rate;</code>と宣言する</td><td>非推奨。どこからでも書き換えられる変数はバグの温床になる</td></tr>
</table>
<p>PHP 8では未定義変数の使用は<code>Warning</code>（警告）として報告され、値は<code>null</code>として扱われます。処理は止まらずに進むため、「エラーは出ていないのに計算結果がおかしい」という形で現れがちです。Warningを見つけたら放置せず、必ず原因を直す習慣をつけましょう。</p>`,
      task: `実行すると<code>Warning: Undefined variable $taxRate</code>が出ます。<code>withTax</code>関数が<code>$taxRate</code>を引数として受け取るように修正し、Warningなしで「税込110円」と表示してください。`,
      code: `<?php
$taxRate = 0.1;

function withTax(int $price): float
{
    // 関数の中からは外側の$taxRateは見えない（Warningが出てnull扱いになる）
    return $price * (1 + $taxRate);
}

echo "税込" . withTax(100) . "円\\n";
// TODO: $taxRateを引数として受け取るように修正して、Warningを解消する
`,
      solution: `<?php
$taxRate = 0.1;

// 外の値は引数として明示的に受け取る
function withTax(int $price, float $taxRate): float
{
    return $price * (1 + $taxRate);
}

echo "税込" . withTax(100, $taxRate) . "円\\n";
`,
      hints: [
        `関数の中から外側の変数は見えません。使いたい値は引数として渡すのが基本です。`,
        `仮引数にfloat $taxRateを追加し、呼び出しをwithTax(100, $taxRate)に変えます。`
      ],
      expectedOutput: "税込110円"
    },
    {
      id: 49,
      title: "参照渡し：&$varで呼び出し元の変数を書き換える",
      explanation: `<p>PHPの引数は通常<strong>値渡し</strong>です。つまり関数には<strong>値のコピー</strong>が渡されるため、関数の中で引数をいくら書き換えても、呼び出し元の変数は変わりません。</p>
<pre><code>&lt;?php
function addPoint($score)
{
    $score = $score + 10; // コピーを書き換えているだけ
}

$myScore = 50;
addPoint($myScore);
echo $myScore; // 50のまま</code></pre>
<p>仮引数に<code>&amp;</code>を付けると<strong>参照渡し</strong>になり、コピーではなく<strong>呼び出し元の変数そのもの</strong>を受け取ります。関数内での変更が呼び出し元にも反映されます。</p>
<pre><code>&lt;?php
function addPoint(&amp;$score)
{
    $score = $score + 10; // 呼び出し元の変数そのものが変わる
}

$myScore = 50;
addPoint($myScore);
echo $myScore; // 60</code></pre>
<p>参照渡しの代表例が、次章で学ぶ<code>sort()</code>などの配列関数です。<code>sort($arr)</code>が戻り値ではなく<code>$arr</code>自体を並べ替えるのは、引数が参照渡しだからです。</p>
<p>ただし実務では参照渡しの乱用は避けましょう。「関数を呼んだら手元の変数が変わっていた」というコードは追いかけるのが大変です。原則は<strong>値渡し＋戻り値</strong>で書き、参照渡しは大きな配列の書き換えなど明確な理由があるときに限定するのが読みやすいコードのコツです。</p>`,
      task: `まず実行して<code>$myScore</code>が50のままであることを確認し、<code>addPoint</code>の仮引数を<code>&amp;$score</code>に変えて「得点は60点」と表示されるようにしてください。`,
      code: `<?php
function addPoint($score)
{
    $score = $score + 10;
}

$myScore = 50;
addPoint($myScore);
echo "得点は" . $myScore . "点\\n"; // 値渡しなので50のまま

// TODO: addPointの仮引数を &$score に変えて、
// 呼び出し元の$myScoreが60になることを確認する
`,
      solution: `<?php
// &を付けると参照渡しになり、呼び出し元の変数そのものを書き換えられる
function addPoint(&$score)
{
    $score = $score + 10;
}

$myScore = 50;
addPoint($myScore);
echo "得点は" . $myScore . "点\\n";
`,
      hints: [
        `値渡しでは関数にコピーが渡るため、中で書き換えても呼び出し元は変わりません。`,
        `仮引数をfunction addPoint(&$score)のように&付きにすると参照渡しになります。呼び出し側はaddPoint($myScore)のままで構いません。`
      ],
      expectedOutput: "得点は60点"
    },
    {
      id: 50,
      title: "総合演習：温度変換関数群を作る",
      explanation: `<p>第5章の総まとめとして、温度変換を行う小さな関数群を完成させます。使う知識は、関数定義・引数・<code>return</code>・型宣言・デフォルト引数です。</p>
<p>温度の換算式は次のとおりです。</p>
<table>
<tr><th>変換</th><th>式</th></tr>
<tr><td>摂氏→華氏</td><td>華氏 = 摂氏 × 1.8 + 32</td></tr>
<tr><td>華氏→摂氏</td><td>摂氏 = (華氏 - 32) ÷ 1.8</td></tr>
</table>
<p>今回のコードでは、書式を整えるために組み込み関数<code>sprintf</code>を使っています。<code>sprintf</code>は「書式指定文字列」に値を埋め込んだ文字列を返す関数で、<code>%s</code>は文字列、<code>%.1f</code>は「小数第1位までの数値」に置き換わります。</p>
<pre><code>&lt;?php
echo sprintf("%.1f%sです", 35.0, "度"); // 35.0度です</code></pre>
<p>設計面のポイントも確認しましょう。</p>
<ul>
<li><code>celsiusToFahrenheit</code>と<code>fahrenheitToCelsius</code>は<strong>計算してreturnするだけ</strong>の純粋な関数にする。表示（echo）を混ぜないことで、計算結果を他の処理でも再利用できる</li>
<li><code>describeTemperature</code>は判定と整形を担当し、単位はデフォルト引数<code>$unit = "度"</code>で省略可能にする</li>
<li>すべての関数に型宣言を付け、<code>declare(strict_types=1);</code>で厳密モードにしておく</li>
</ul>
<p>このように「1つの関数に1つの仕事」を徹底すると、小さい部品の組み合わせで機能を作れるようになります。</p>`,
      task: `2つの変換関数の<code>TODO</code>を換算式で実装し、最後に<code>describeTemperature(8.5, "℃")</code>の表示を追加してください。「摂氏25度は華氏77度」「華氏212度は摂氏100度」「35.0度は暑いです」「8.5℃は寒いです」の4行が表示されれば完成です。`,
      code: `<?php
declare(strict_types=1);

// 摂氏を華氏に変換する（華氏 = 摂氏 * 1.8 + 32）
function celsiusToFahrenheit(float $celsius): float
{
    return 0.0; // TODO: 正しい換算式に書き換える
}

// 華氏を摂氏に変換する（摂氏 = (華氏 - 32) / 1.8）
function fahrenheitToCelsius(float $fahrenheit): float
{
    return 0.0; // TODO: 正しい換算式に書き換える
}

// 摂氏温度の説明文を返す（30度以上:暑い / 15度以上:快適 / それ未満:寒い）
function describeTemperature(float $celsius, string $unit = "度"): string
{
    if ($celsius >= 30) {
        $label = "暑い";
    } elseif ($celsius >= 15) {
        $label = "快適";
    } else {
        $label = "寒い";
    }
    return sprintf("%.1f%sは%sです", $celsius, $unit, $label);
}

echo "摂氏25度は華氏" . celsiusToFahrenheit(25.0) . "度\\n";
echo "華氏212度は摂氏" . fahrenheitToCelsius(212.0) . "度\\n";
echo describeTemperature(35.0) . "\\n";
// TODO: 単位に"℃"を指定して describeTemperature(8.5, "℃") の結果を表示する
`,
      solution: `<?php
declare(strict_types=1);

// 摂氏を華氏に変換する（華氏 = 摂氏 * 1.8 + 32）
function celsiusToFahrenheit(float $celsius): float
{
    return $celsius * 1.8 + 32;
}

// 華氏を摂氏に変換する（摂氏 = (華氏 - 32) / 1.8）
function fahrenheitToCelsius(float $fahrenheit): float
{
    return ($fahrenheit - 32) / 1.8;
}

// 摂氏温度の説明文を返す（30度以上:暑い / 15度以上:快適 / それ未満:寒い）
function describeTemperature(float $celsius, string $unit = "度"): string
{
    if ($celsius >= 30) {
        $label = "暑い";
    } elseif ($celsius >= 15) {
        $label = "快適";
    } else {
        $label = "寒い";
    }
    return sprintf("%.1f%sは%sです", $celsius, $unit, $label);
}

echo "摂氏25度は華氏" . celsiusToFahrenheit(25.0) . "度\\n";
echo "華氏212度は摂氏" . fahrenheitToCelsius(212.0) . "度\\n";
echo describeTemperature(35.0) . "\\n";
echo describeTemperature(8.5, "℃") . "\\n"; // デフォルト引数を上書き
`,
      hints: [
        `変換関数はreturn 換算式;の1行だけで書けます。摂氏→華氏はreturn $celsius * 1.8 + 32;です。`,
        `華氏→摂氏は引き算を先に計算するため($fahrenheit - 32)のように括弧が必要です。`,
        `describeTemperature(8.5, "℃")は第2引数を渡してデフォルト値"度"を上書きしています。echoとの間は.で連結してください。`
      ],
      expectedOutput: "35.0度は暑いです"
    }
  ]
});
