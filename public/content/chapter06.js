// 第6章：配列関数の活用
registerChapter({
  number: 6,
  title: "配列関数の活用",
  description: "PHPに組み込まれた豊富な配列関数を学びます。追加・削除・検索・ソートから、map・filter・reduceによるデータ加工まで、実務で毎日使う道具を揃えます。",
  steps: [
    {
      id: 51,
      title: "array_push・array_pop・array_shift・array_unshift",
      explanation: `<p>配列の先頭・末尾に対する追加と取り出しは、4つの組み込み関数で行えます。名前が似ていて混同しやすいので、表で整理して覚えましょう。</p>
<table>
<tr><th>関数</th><th>位置</th><th>動き</th><th>戻り値</th></tr>
<tr><td><code>array_push($arr, 値)</code></td><td>末尾</td><td>追加</td><td>追加後の要素数</td></tr>
<tr><td><code>array_pop($arr)</code></td><td>末尾</td><td>取り出して削除</td><td>取り出した値</td></tr>
<tr><td><code>array_unshift($arr, 値)</code></td><td>先頭</td><td>追加</td><td>追加後の要素数</td></tr>
<tr><td><code>array_shift($arr)</code></td><td>先頭</td><td>取り出して削除</td><td>取り出した値</td></tr>
</table>
<pre><code>&lt;?php
$queue = ["田中"];
array_push($queue, "佐藤");    // ["田中", "佐藤"]
array_unshift($queue, "高橋"); // ["高橋", "田中", "佐藤"]
$first = array_shift($queue);  // $first = "高橋"、残り ["田中", "佐藤"]</code></pre>
<p>いずれも第5章で学んだ<strong>参照渡し</strong>で配列を受け取り、<strong>元の配列を直接書き換える</strong>のが特徴です。補足を3つ挙げます。</p>
<ul>
<li>末尾への1件追加は<code>$arr[] = 値;</code>とも書け、こちらの方が短く高速なのでPHPでは主流</li>
<li><code>array_shift</code>と<code>array_unshift</code>は残りの数値キーを0から振り直すため、大きな配列では末尾操作より遅い</li>
<li>「末尾で追加・先頭で取り出し」を組み合わせると行列（キュー）、「末尾で追加・末尾で取り出し」だと積み重ね（スタック）になる</li>
</ul>
<p>なお、配列の中身の確認には<code>print_r($arr);</code>が便利です。キーと値の一覧を見やすく表示してくれます。</p>`,
      task: `<code>array_unshift</code>で先頭に<code>"高橋"</code>を追加し、<code>array_shift</code>で先頭の要素を<code>$first</code>に取り出して「先頭は高橋」と表示してください。最後に<code>print_r($queue);</code>で残りを確認します。`,
      code: `<?php
$queue = ["田中", "佐藤"];

array_push($queue, "鈴木"); // 末尾に追加
print_r($queue);

// TODO: array_unshiftで先頭に"高橋"を追加する
// TODO: array_shiftで先頭の要素を取り出して$firstに代入する
// TODO: echo "先頭は" . $first . "\\n"; で表示する

print_r($queue);
`,
      solution: `<?php
$queue = ["田中", "佐藤"];

array_push($queue, "鈴木"); // 末尾に追加
print_r($queue);

array_unshift($queue, "高橋"); // 先頭に追加
$first = array_shift($queue);  // 先頭から取り出す（戻り値が取り出した値）
echo "先頭は" . $first . "\\n";

print_r($queue);
`,
      hints: [
        `追加系（push・unshift）は第2引数に値を渡します。取り出し系（pop・shift）は配列だけを渡し、戻り値が取り出した値です。`,
        `array_unshift($queue, "高橋");のあと$first = array_shift($queue);と書くと、直前に追加した"高橋"が取り出されます。`
      ],
      expectedOutput: "先頭は高橋"
    },
    {
      id: 52,
      title: "in_array・array_search：配列の中を探す",
      explanation: `<p>「配列にこの値はあるか？」を調べる関数が2つあります。目的に応じて使い分けます。</p>
<table>
<tr><th>関数</th><th>戻り値</th><th>用途</th></tr>
<tr><td><code>in_array($needle, $arr, true)</code></td><td><code>true</code> / <code>false</code></td><td>あるかどうかだけ知りたい</td></tr>
<tr><td><code>array_search($needle, $arr, true)</code></td><td>見つかったキー / <code>false</code></td><td>どこにあるかも知りたい</td></tr>
</table>
<p>どちらも第3引数に<code>true</code>を渡すと<strong>厳密な比較（型まで一致）</strong>になります。省略すると緩い比較（==）になり、<code>"5"</code>と<code>5</code>が同じ扱いになるなど思わぬ一致が起きるため、<strong>第3引数のtrueは常に付ける</strong>のが実務の定石です。</p>
<p>そして<code>array_search</code>には有名な落とし穴があります。先頭要素が見つかると<strong>キーの<code>0</code></strong>が返りますが、<code>0</code>は<code>if</code>文の条件では<code>false</code>扱い（falsy）です。</p>
<pre><code>&lt;?php
$fruits = ["りんご", "みかん"];
$pos = array_search("りんご", $fruits, true); // 0が返る

if ($pos) { ... }           // 0はfalse扱い → 「見つかった」のに通らない！
if ($pos !== false) { ... } // 正しい：型まで比較して「falseでない」を確認</code></pre>
<p>「見つからなかった」の<code>false</code>と「キー0で見つかった」の<code>0</code>を区別するには、<strong><code>!==</code>（厳密な不一致）で<code>false</code>と比較する</strong>必要があります。これは<code>strpos</code>など「失敗時にfalseを返す」PHP関数すべてに共通する重要パターンです。</p>`,
      task: `<code>if ($pos)</code>を<code>if ($pos !== false)</code>に修正して「位置は0です」と表示されるようにしてください。さらに<code>in_array</code>で<code>"バナナ"</code>を探し、含まれなければ「バナナはありません」と表示してください。`,
      code: `<?php
$fruits = ["りんご", "みかん", "ぶどう"];

// バグ：先頭の"りんご"を探しているのに「見つかりません」になってしまう
$pos = array_search("りんご", $fruits, true);
if ($pos) {
    echo "位置は" . $pos . "です\\n";
} else {
    echo "見つかりません\\n";
}
// TODO: 条件を $pos !== false に修正して、正しく判定できるようにする

// TODO: in_arrayを使って"バナナ"が含まれるか調べ、
//       含まれていれば「バナナがあります」、なければ「バナナはありません」と表示する
`,
      solution: `<?php
$fruits = ["りんご", "みかん", "ぶどう"];

// キー0が返ってもfalseと区別できるように!==で比較する
$pos = array_search("りんご", $fruits, true);
if ($pos !== false) {
    echo "位置は" . $pos . "です\\n";
} else {
    echo "見つかりません\\n";
}

if (in_array("バナナ", $fruits, true)) {
    echo "バナナがあります\\n";
} else {
    echo "バナナはありません\\n";
}
`,
      hints: [
        `array_searchは先頭で見つかると0を返しますが、0はif文でfalse扱いです。「falseそのものかどうか」を型まで含めて比較しましょう。`,
        `if ($pos !== false)なら、0は「falseではない」のでthen側に進みます。`,
        `in_arrayは真偽値を返すので、そのままif (in_array("バナナ", $fruits, true))と書けます。`
      ],
      expectedOutput: "位置は0です"
    },
    {
      id: 53,
      title: "array_keys・array_values・array_flip",
      explanation: `<p>連想配列から「キーだけ」「値だけ」を取り出したり、キーと値を入れ替えたりする3つの関数を学びます。いずれも<strong>元の配列は変更せず、新しい配列を返します</strong>。</p>
<table>
<tr><th>関数</th><th>働き</th></tr>
<tr><td><code>array_keys($arr)</code></td><td>キーの一覧を配列で返す</td></tr>
<tr><td><code>array_values($arr)</code></td><td>値の一覧を返す（キーは0から振り直し）</td></tr>
<tr><td><code>array_flip($arr)</code></td><td>キーと値を入れ替えた配列を返す</td></tr>
</table>
<pre><code>&lt;?php
$stock = ["apple" =&gt; 3, "banana" =&gt; 0];

print_r(array_keys($stock));   // ["apple", "banana"]
print_r(array_values($stock)); // [3, 0]
print_r(array_flip($stock));   // [3 =&gt; "apple", 0 =&gt; "banana"]</code></pre>
<p>それぞれの実務での出番と注意点です。</p>
<ul>
<li><code>array_keys</code>は第2引数に値を渡すと「その値を持つキーの一覧」に絞れる（<code>array_keys($stock, 0, true)</code>で在庫0の商品名だけ取れる。第3引数trueは厳密比較）</li>
<li><code>array_values</code>は「キーが飛び飛びになった配列を0から並べ直す」用途で頻出（次のarray_filterのステップで活躍する）</li>
<li><code>array_flip</code>は「値からキーを逆引きしたい」ときの定番。ただし<strong>値が重複していると後の要素で上書き</strong>され、値がintでもstringでもない要素は警告付きでスキップされるので、値がユニークな配列にだけ使う</li>
</ul>
<p>この3つは「連想配列の形を変える」基本部品として、この後のステップでも繰り返し登場します。</p>`,
      task: `<code>array_values</code>で在庫数の一覧<code>$counts</code>を、<code>array_flip</code>でキーと値を入れ替えた配列<code>$flipped</code>を作り、それぞれ<code>print_r</code>で表示してください。`,
      code: `<?php
$stock = ["apple" => 3, "banana" => 0, "cherry" => 5];

// キー（商品名）の一覧
$names = array_keys($stock);
print_r($names);

// TODO: array_valuesで在庫数の一覧を$countsに取り出してprint_rで表示する

// TODO: array_flipでキーと値を入れ替えた配列を$flippedに作ってprint_rで表示する
`,
      solution: `<?php
$stock = ["apple" => 3, "banana" => 0, "cherry" => 5];

// キー（商品名）の一覧
$names = array_keys($stock);
print_r($names);

// 値（在庫数）の一覧。キーは0から振り直される
$counts = array_values($stock);
print_r($counts);

// キーと値を入れ替える（値がユニークなので安全に使える）
$flipped = array_flip($stock);
print_r($flipped);
`,
      hints: [
        `3つの関数はいずれも配列を1つ渡すと新しい配列を返します。元の$stockは変わりません。`,
        `$counts = array_values($stock);、$flipped = array_flip($stock);のように戻り値を変数で受けてからprint_rします。`
      ],
      expectedOutput: "[3] => apple"
    },
    {
      id: 54,
      title: "sort・rsort・usort：並べ替えの基本",
      explanation: `<p>配列の並べ替えの基本は<code>sort</code>（昇順）と<code>rsort</code>（降順）です。シグネチャは<code>sort(array &amp;$array): true</code>で、第5章で学んだ<strong>参照渡し</strong>そのもの。つまり<strong>戻り値ではなく、渡した配列自体が並べ替わります</strong>。</p>
<pre><code>&lt;?php
$scores = [70, 95, 60];
sort($scores);            // 正しい使い方：$scores自体が[60, 70, 95]になる
$sorted = sort($scores);  // よくある間違い：$sortedにはtrueが入るだけ！</code></pre>
<p>もう1つの注意は、<code>sort</code>系は<strong>キーを破棄して0から振り直す</strong>ことです（連想配列のキーを保ちたい場合は次のステップのasortを使います）。</p>
<p>独自のルールで並べ替えたいときは<code>usort</code>を使います。第2引数に「2つの要素を受け取り、順序を数値で答える比較関数」を渡します。</p>
<table>
<tr><th>比較関数の戻り値</th><th>意味</th></tr>
<tr><td>負の数</td><td>$aを$bより前に置く</td></tr>
<tr><td>0</td><td>同順</td></tr>
<tr><td>正の数</td><td>$aを$bより後ろに置く</td></tr>
</table>
<p>比較関数はその場限りで使うことが多いため、名前を付けずにその場で書く<strong>無名関数</strong>で渡すのが定番です（無名関数の詳細は後の章で扱います。ここでは「その場で書く小さな関数」と捉えれば十分です）。</p>
<pre><code>&lt;?php
$names = ["Watanabe", "Ito"];
// strlen（文字列のバイト数を返す関数）が小さい順に並べる
usort($names, function ($a, $b) {
    return strlen($a) - strlen($b);
});</code></pre>
<p>なお、2値の比較には宇宙船演算子<code>&lt;=&gt;</code>（左が小さければ負・等しければ0・大きければ正を返す）も使え、<code>return strlen($a) &lt;=&gt; strlen($b);</code>と書けます。</p>`,
      task: `<code>rsort</code>で<code>$scores</code>を降順に並べ替えて表示してください。さらに<code>usort</code>と比較関数で<code>$names</code>を「名前が短い順」に並べ替えて表示してください。`,
      code: `<?php
$scores = [70, 95, 60, 85];

sort($scores); // 昇順に並べ替え（元の配列が直接書き換わる）
print_r($scores);

// TODO: rsortで$scoresを降順に並べ替えてprint_rで表示する

$names = ["Watanabe", "Ito", "Takahashi"];
// TODO: usortと比較関数を使って、$namesを「文字数が短い順」に並べ替える
//       比較関数の中身は return strlen($a) - strlen($b); が使える
print_r($names);
`,
      solution: `<?php
$scores = [70, 95, 60, 85];

sort($scores); // 昇順に並べ替え（元の配列が直接書き換わる）
print_r($scores);

rsort($scores); // 降順に並べ替え
print_r($scores);

$names = ["Watanabe", "Ito", "Takahashi"];
// 比較関数：負なら$aが前、正なら$aが後ろ
usort($names, function ($a, $b) {
    return strlen($a) - strlen($b);
});
print_r($names);
`,
      hints: [
        `sort・rsort・usortはどれも参照渡しで、渡した配列そのものを並べ替えます。戻り値を代入する必要はありません。`,
        `usortの第2引数はusort($names, function ($a, $b) { ... });の形で、その場で書いた関数を渡します。`,
        `比較関数がstrlen($a) - strlen($b)を返すと、文字数が少ない要素ほど前に並びます。`
      ],
      expectedOutput: "[0] => Ito"
    },
    {
      id: 55,
      title: "asort・ksort：連想配列のソート",
      explanation: `<p>連想配列に<code>sort</code>を使うと大事故になります。<code>sort</code>はキーを破棄して0から振り直すため、<strong>「商品名 =&gt; 在庫数」のような対応関係が消えてしまう</strong>のです。</p>
<pre><code>&lt;?php
$stock = ["banana" =&gt; 2, "apple" =&gt; 5];
sort($stock);
print_r($stock); // [0 =&gt; 2, 1 =&gt; 5] 商品名が消えた！</code></pre>
<p>連想配列にはキーを保持するソート関数を使います。</p>
<table>
<tr><th>関数</th><th>並べ替えの基準</th><th>キー</th></tr>
<tr><td><code>sort</code> / <code>rsort</code></td><td>値の昇順／降順</td><td><strong>破棄して振り直す</strong></td></tr>
<tr><td><code>asort</code> / <code>arsort</code></td><td>値の昇順／降順</td><td>保持する</td></tr>
<tr><td><code>ksort</code> / <code>krsort</code></td><td>キーの昇順／降順</td><td>保持する</td></tr>
</table>
<p>覚え方は、<code>a</code>はassociative（連想）の<code>a</code>で「値でソートしつつ連想を保つ」、<code>k</code>はkey（キー）の<code>k</code>で「キーでソート」、<code>r</code>が入るとreverse（逆順）です。</p>
<pre><code>&lt;?php
$stock = ["banana" =&gt; 2, "apple" =&gt; 5, "cherry" =&gt; 1];

ksort($stock); // キー順: apple =&gt; 5, banana =&gt; 2, cherry =&gt; 1
asort($stock); // 値の小さい順: cherry =&gt; 1, banana =&gt; 2, apple =&gt; 5</code></pre>
<p>これらもすべて参照渡しで元の配列を書き換えます。PHPの連想配列は「挿入された順序」を保持しており、ソート関数はその並び順自体を組み替える、という点も押さえておきましょう。foreachで回したときの順番がそのまま変わります。</p>`,
      task: `<code>ksort</code>で<code>$stock</code>をキー（商品名）のアルファベット順に並べ替えて表示し、続けて<code>asort</code>で在庫数の少ない順に並べ替えて表示してください。`,
      code: `<?php
$stock = ["banana" => 2, "apple" => 5, "cherry" => 1];

// sortを使うとキー（商品名）が失われてしまう
$broken = $stock;
sort($broken);
print_r($broken);

// TODO: ksortで$stockをキー（商品名）のアルファベット順に並べ替えてprint_rで表示する

// TODO: asortで$stockを在庫数の少ない順に並べ替えてprint_rで表示する
`,
      solution: `<?php
$stock = ["banana" => 2, "apple" => 5, "cherry" => 1];

// sortを使うとキー（商品名）が失われてしまう
$broken = $stock;
sort($broken);
print_r($broken);

// キー順に並べ替え（キーは保持される）
ksort($stock);
print_r($stock);

// 値の小さい順に並べ替え（キーは保持される）
asort($stock);
print_r($stock);
`,
      hints: [
        `ksortとasortはsortと同じく引数の配列そのものを並べ替えます。ksort($stock);のように呼ぶだけです。`,
        `ksortはキー（商品名）のアルファベット順、asortは値（在庫数）の昇順です。どちらもキーと値の対応は崩れません。`
      ],
      expectedOutput: "[cherry] => 1"
    },
    {
      id: 56,
      title: "array_map：全要素をまとめて変換する",
      explanation: `<p><code>array_map</code>は「各要素に同じ変換を適用した<strong>新しい配列</strong>」を返す関数です。foreachで空配列に詰め直すコードを1行で書けます。sort系と違って<strong>元の配列は変わりません</strong>（非破壊）。</p>
<pre><code>&lt;?php
$prices = [100, 250];

// foreachで書くと4行
$doubled = [];
foreach ($prices as $p) {
    $doubled[] = $p * 2;
}

// array_mapなら1行
$doubled = array_map(fn($p) =&gt; $p * 2, $prices);</code></pre>
<p>第1引数の<code>fn($p) =&gt; $p * 2</code>は<strong>アロー関数</strong>という無名関数の短縮記法（PHP 7.4以降）です。<code>fn(引数) =&gt; 式</code>の形で、<code>=&gt;</code>の右の式が自動的に戻り値になります（<code>return</code>は書きません）。前ステップの<code>function ($p) { return $p * 2; }</code>と同じ意味で、1つの式だけで書ける変換に向いています。詳しい仕組みは後の章に譲り、ここでは「その場で書く小さな変換ルール」として使いましょう。</p>
<p>引数の順序には注意してください。<strong><code>array_map(コールバック, 配列)</code>の順</strong>です（次のステップのarray_filterは逆順なので混同しやすい）。</p>
<p>実務では「DBから取った行の配列を表示用の文字列に整形する」「価格の配列を税込に変換する」など、<strong>元データを保ったまま加工後のデータを作る</strong>場面で毎日のように使います。キーは基本的に保持されますが、リスト（0始まりの連番）を変換する用途が中心です。</p>`,
      task: `<code>array_map</code>を使って税込価格（1.1倍して<code>(int)round(...)</code>で整数化）の配列<code>$withTax</code>を作り、<code>print_r</code>で表示してください。roundは四捨五入する組み込み関数です。`,
      code: `<?php
$prices = [100, 250, 380];

// 各要素を2倍にした新しい配列を作る（元の$pricesは変わらない）
$doubled = array_map(fn($p) => $p * 2, $prices);
print_r($doubled);

// TODO: array_mapで税込価格の配列$withTaxを作ってprint_rで表示する
//       税込価格は (int)round($p * 1.1) で計算する

print_r($prices); // 元の配列が変わっていないことを確認
`,
      solution: `<?php
$prices = [100, 250, 380];

// 各要素を2倍にした新しい配列を作る（元の$pricesは変わらない）
$doubled = array_map(fn($p) => $p * 2, $prices);
print_r($doubled);

// 税込価格：1.1倍して四捨五入し、intに変換する
$withTax = array_map(fn($p) => (int)round($p * 1.1), $prices);
print_r($withTax);

print_r($prices); // 元の配列が変わっていないことを確認
`,
      hints: [
        `$doubledの行をまねて、変換ルールの式だけを税込計算に変えれば書けます。`,
        `$withTax = array_map(fn($p) => (int)round($p * 1.1), $prices);のように、fnの右側の式が各要素の変換結果になります。`
      ],
      expectedOutput: "[2] => 418"
    },
    {
      id: 57,
      title: "array_filter：条件に合う要素だけ残す",
      explanation: `<p><code>array_filter</code>は「条件判定の関数が<code>true</code>を返した要素だけを残した<strong>新しい配列</strong>」を返します。array_mapが「全要素を変換」なのに対し、array_filterは「要素を選別」です。</p>
<pre><code>&lt;?php
$scores = [82, 45, 90];
$passed = array_filter($scores, fn($s) =&gt; $s &gt;= 60);
// [0 =&gt; 82, 2 =&gt; 90]</code></pre>
<p>引数の順序は<code>array_filter(配列, コールバック)</code>で、<strong>array_mapとは逆</strong>です。間違えるとTypeErrorになるので、エラーが出たらまず順序を疑いましょう。</p>
<p>最大の注意点は、<strong>元のキーがそのまま保持される</strong>ことです。上の例では45（キー1）が除かれた結果、キーが0, 2と飛び飛びになります。このままjson_encodeすると配列ではなくオブジェクト扱いになるなど、後続処理で事故のもとになるため、連番に戻したいときは前に学んだ<code>array_values</code>を重ねるのが定番パターンです。</p>
<pre><code>&lt;?php
$passed = array_values(array_filter($scores, fn($s) =&gt; $s &gt;= 60));
// [0 =&gt; 82, 1 =&gt; 90] キーが詰め直された</code></pre>
<p>また、コールバックを省略して<code>array_filter($arr)</code>と呼ぶと、<code>false</code>・<code>0</code>・<code>""</code>・<code>null</code>・空配列などのfalsyな値を取り除きます。手軽ですが「0を消すつもりがなかった」という事故も定番なので、条件は明示的に書くほうが安全です。</p>`,
      task: `<code>array_values</code>で<code>$passed</code>のキーを0から振り直した配列を表示してください。さらに<code>array_filter</code>で「偶数だけ」（<code>$s % 2 === 0</code>）を残した配列を作り、同様にキーを振り直して表示してください。`,
      code: `<?php
$scores = [82, 45, 90, 61, 33];

// 60点以上だけを残す
$passed = array_filter($scores, fn($s) => $s >= 60);
print_r($passed); // キーが0, 2, 3と飛び飛びになっている点に注目

// TODO: array_valuesで$passedのキーを0から振り直した配列をprint_rで表示する

// TODO: array_filterで「偶数だけ」を残した配列を作り、
//       array_valuesでキーを振り直してからprint_rで表示する
`,
      solution: `<?php
$scores = [82, 45, 90, 61, 33];

// 60点以上だけを残す
$passed = array_filter($scores, fn($s) => $s >= 60);
print_r($passed); // キーが0, 2, 3と飛び飛びになっている点に注目

// array_valuesでキーを0から詰め直す
print_r(array_values($passed));

// 偶数だけを残してキーを振り直す
$evens = array_values(array_filter($scores, fn($s) => $s % 2 === 0));
print_r($evens);
`,
      hints: [
        `array_filterは合格した要素の「元のキー」を保つため、キーが飛び飛びになります。連番に戻すのがarray_valuesの役割です。`,
        `偶数の条件はfn($s) => $s % 2 === 0です。array_values(array_filter(...))と重ねて書けます。`
      ],
      expectedOutput: "[3] => 61"
    },
    {
      id: 58,
      title: "array_reduce：配列を1つの値にまとめる",
      explanation: `<p><code>array_reduce</code>は、配列の全要素を順に処理して<strong>1つの値に畳み込む</strong>関数です。合計・最大値・連結文字列など、「配列全体から1つの答えを出す」計算に使います。</p>
<pre><code>&lt;?php
$prices = [120, 340, 560];
$total = array_reduce($prices, fn($carry, $item) =&gt; $carry + $item, 0);
// 1020</code></pre>
<p>引数は<code>array_reduce(配列, コールバック, 初期値)</code>の3つです。コールバックは2つの引数を取ります。</p>
<table>
<tr><th>引数</th><th>意味</th></tr>
<tr><td><code>$carry</code></td><td>前回までの計算結果（初回は初期値）</td></tr>
<tr><td><code>$item</code></td><td>現在処理中の要素</td></tr>
</table>
<p>上の合計の例では、<code>$carry</code>が0 → 120 → 460と成長し、最後に1020になります。foreachで書いた「<code>$total = 0;</code>で初期化してループ内で<code>$total += $n;</code>」と同じ流れを、初期値とコールバックで表現していると考えると分かりやすいでしょう。</p>
<p>合計以外の例です。コールバックが「新しい$carry」を返す、という点は常に同じです。</p>
<pre><code>&lt;?php
// 最大値：大きい方を残していく
$max = array_reduce($nums, fn($carry, $item) =&gt; $item &gt; $carry ? $item : $carry, 0);

// 文字列の連結
$csv = array_reduce($words, fn($carry, $item) =&gt; $carry . $item . ",", "");</code></pre>
<p>これで変換のmap・選別のfilter・集約のreduceが揃いました。この3点セットは多くのプログラミング言語に共通する、データ加工の基本語彙です。</p>`,
      task: `<code>array_reduce</code>を使って<code>$prices</code>の最大値を求め、「最大は560円」と表示してください。コールバックは「<code>$item</code>と<code>$carry</code>の大きい方を返す」形にします。`,
      code: `<?php
$prices = [120, 340, 560];

// 合計を求める（$carryは前回までの結果、$itemは現在の要素、第3引数0が初期値）
$total = array_reduce($prices, fn($carry, $item) => $carry + $item, 0);
echo "合計は" . $total . "円\\n";

// TODO: array_reduceで最大値を求めて「最大は560円」と表示する
//       コールバックは fn($carry, $item) => $item > $carry ? $item : $carry
//       初期値は0とする
`,
      solution: `<?php
$prices = [120, 340, 560];

// 合計を求める（$carryは前回までの結果、$itemは現在の要素、第3引数0が初期値）
$total = array_reduce($prices, fn($carry, $item) => $carry + $item, 0);
echo "合計は" . $total . "円\\n";

// 最大値：これまでの最大($carry)と現在の要素($item)の大きい方を残していく
$max = array_reduce($prices, fn($carry, $item) => $item > $carry ? $item : $carry, 0);
echo "最大は" . $max . "円\\n";
`,
      hints: [
        `合計の例と同じ形で、コールバックの式だけを「大きい方を返す」に変えます。$carryには「これまでの最大値」が入り続けます。`,
        `$max = array_reduce($prices, fn($carry, $item) => $item > $carry ? $item : $carry, 0);と書き、echoで「最大は」. $max . "円"を連結します。`
      ],
      expectedOutput: "合計は1020円"
    },
    {
      id: 59,
      title: "array_slice・array_splice・array_merge",
      explanation: `<p>配列の一部を取り出す・削除する・結合する3つの関数です。名前が似ている<code>slice</code>と<code>splice</code>は、<strong>元の配列を変えるかどうか</strong>が決定的に違います。</p>
<table>
<tr><th>関数</th><th>働き</th><th>元の配列</th></tr>
<tr><td><code>array_slice($arr, 位置, 個数)</code></td><td>一部を取り出した新しい配列を返す</td><td>変わらない（非破壊）</td></tr>
<tr><td><code>array_splice($arr, 位置, 個数)</code></td><td>一部を削除（置換も可）し、削除分を返す</td><td><strong>書き換わる（破壊的）</strong></td></tr>
<tr><td><code>array_merge($a, $b, ...)</code></td><td>結合した新しい配列を返す</td><td>変わらない（非破壊）</td></tr>
</table>
<pre><code>&lt;?php
$members = ["A", "B", "C", "D"];

$top2 = array_slice($members, 0, 2);   // ["A", "B"]、$membersは4人のまま
array_splice($members, 1, 2);          // $membersが["A", "D"]に変わる
$all = array_merge($top2, ["E"]);      // ["A", "B", "E"]</code></pre>
<p>補足ポイントです。</p>
<ul>
<li><code>array_slice($arr, -2)</code>のように負の位置を渡すと「末尾から2件」を取り出せる。個数を省略すると最後まで</li>
<li><code>array_splice</code>は第4引数に置換用の配列も渡せる（削除と挿入を同時に行える）。参照渡しで元の配列を直接書き換える点に注意</li>
<li><code>array_merge</code>は数値キーを0から振り直す。文字列キーが重複した場合は<strong>後の配列の値で上書き</strong>される（設定のデフォルト値を上書きする用途で定番）</li>
</ul>
<p>「ランキングの上位N件」はslice、「リストから途中の要素を抜く」はsplice、「複数のリストを合体」はmerge、と用途で覚えましょう。</p>`,
      task: `<code>array_splice</code>で<code>$members</code>のインデックス1から2人を取り除いて表示してください。さらに<code>array_merge</code>で<code>$top3</code>と<code>["渡辺", "山本"]</code>を結合した配列を表示してください。`,
      code: `<?php
$members = ["田中", "佐藤", "鈴木", "高橋", "伊藤"];

// 先頭から3人を取り出す（元の配列は変わらない）
$top3 = array_slice($members, 0, 3);
print_r($top3);

// TODO: array_spliceで$membersのインデックス1から2人を取り除き、
//       print_r($members); で残りを表示する

// TODO: array_mergeで$top3と["渡辺", "山本"]を結合した配列を$allに作り、
//       print_rで表示する
`,
      solution: `<?php
$members = ["田中", "佐藤", "鈴木", "高橋", "伊藤"];

// 先頭から3人を取り出す（元の配列は変わらない）
$top3 = array_slice($members, 0, 3);
print_r($top3);

// インデックス1から2人（佐藤・鈴木）を取り除く。$members自体が書き換わる
array_splice($members, 1, 2);
print_r($members);

// 2つの配列を結合した新しい配列を作る
$all = array_merge($top3, ["渡辺", "山本"]);
print_r($all);
`,
      hints: [
        `array_spliceは戻り値を使わなくても、渡した配列そのものから要素が取り除かれます。array_splice($members, 1, 2);と呼ぶだけです。`,
        `array_mergeは非破壊なので、$all = array_merge($top3, ["渡辺", "山本"]);のように戻り値を受け取ります。`
      ],
      expectedOutput: "[3] => 渡辺"
    },
    {
      id: 60,
      title: "総合演習：商品リストの加工パイプライン",
      explanation: `<p>第6章の総まとめです。実務のデータ加工は多くの場合、<strong>「絞り込む → 並べ替える → 整形する → 集計する」</strong>という一連の流れ（パイプライン）になります。ECサイトの商品一覧を例に、この章で学んだ関数をつなげてみましょう。</p>
<table>
<tr><th>工程</th><th>使う関数</th><th>今回の処理</th></tr>
<tr><td>絞り込み</td><td><code>array_filter</code> + <code>array_values</code></td><td>在庫がある商品だけ残す</td></tr>
<tr><td>並べ替え</td><td><code>usort</code></td><td>価格の安い順にする</td></tr>
<tr><td>整形</td><td><code>array_map</code></td><td>表示用の文字列に変換する</td></tr>
<tr><td>集計</td><td><code>array_reduce</code></td><td>在庫金額の合計を出す</td></tr>
</table>
<p>今回のデータは「連想配列を要素に持つ配列」です。コールバックの引数<code>$p</code>には商品1件分の連想配列が入るので、<code>$p["price"]</code>のようにキーでアクセスします。</p>
<pre><code>&lt;?php
$products = [
    ["name" =&gt; "コーヒー", "price" =&gt; 480, "stock" =&gt; 12],
    ["name" =&gt; "紅茶", "price" =&gt; 380, "stock" =&gt; 0],
];

// 在庫あり商品だけを残し、キーを詰め直す
$inStock = array_values(array_filter($products, fn($p) =&gt; $p["stock"] &gt; 0));

// 価格の安い順（連想配列のprice同士を比較する）
usort($inStock, fn($a, $b) =&gt; $a["price"] &lt;=&gt; $b["price"]);</code></pre>
<p><code>usort</code>の比較関数では前に学んだ宇宙船演算子<code>&lt;=&gt;</code>が活躍します。<code>$a["price"] &lt;=&gt; $b["price"]</code>だけで昇順の比較関数が完成します。</p>
<p>各工程の出力が次の工程の入力になる、という流れを意識しながら完成させてください。この形はフレームワークのコレクション操作やSQLのWHERE・ORDER BY・SELECT・SUMにもそのまま対応する、一生モノの考え方です。</p>`,
      task: `TODOのステップ2〜5を実装してください。在庫のある商品を安い順に「商品名(税込価格円)」の形式で1行ずつ表示し、最後に「在庫金額合計:10470円」と表示されれば完成です。`,
      code: `<?php
$products = [
    ["name" => "コーヒー", "price" => 480, "stock" => 12],
    ["name" => "紅茶", "price" => 380, "stock" => 0],
    ["name" => "抹茶ラテ", "price" => 520, "stock" => 3],
    ["name" => "ジュース", "price" => 300, "stock" => 0],
    ["name" => "ココア", "price" => 450, "stock" => 7],
];

// ステップ1: 在庫がある商品だけに絞り込む（キーも詰め直す）
$inStock = array_values(array_filter($products, fn($p) => $p["stock"] > 0));

// TODO ステップ2: usortで$inStockを価格の安い順に並べ替える
//   比較関数は fn($a, $b) => $a["price"] <=> $b["price"] が使える

// TODO ステップ3: array_mapで「商品名(税込価格円)」の文字列配列$labelsを作る
//   税込価格は (int)round($p["price"] * 1.1)
//   例: "コーヒー(税込528円)"

// TODO ステップ4: foreachで$labelsを1行ずつechoで表示する

// TODO ステップ5: array_reduceで在庫金額の合計（price × stock）を求め、
//   "在庫金額合計:" . $total . "円" の形式で表示する（初期値は0）
`,
      solution: `<?php
$products = [
    ["name" => "コーヒー", "price" => 480, "stock" => 12],
    ["name" => "紅茶", "price" => 380, "stock" => 0],
    ["name" => "抹茶ラテ", "price" => 520, "stock" => 3],
    ["name" => "ジュース", "price" => 300, "stock" => 0],
    ["name" => "ココア", "price" => 450, "stock" => 7],
];

// ステップ1: 在庫がある商品だけに絞り込む（キーも詰め直す）
$inStock = array_values(array_filter($products, fn($p) => $p["stock"] > 0));

// ステップ2: 価格の安い順に並べ替える
usort($inStock, fn($a, $b) => $a["price"] <=> $b["price"]);

// ステップ3: 表示用の文字列に整形する
$labels = array_map(
    fn($p) => $p["name"] . "(税込" . (int)round($p["price"] * 1.1) . "円)",
    $inStock
);

// ステップ4: 1行ずつ表示する
foreach ($labels as $label) {
    echo $label . "\\n";
}

// ステップ5: 在庫金額（price × stock）の合計を求める
$total = array_reduce(
    $inStock,
    fn($carry, $p) => $carry + $p["price"] * $p["stock"],
    0
);
echo "在庫金額合計:" . $total . "円\\n";
`,
      hints: [
        `各ステップの入力は直前のステップの結果です。ステップ2はusort($inStock, fn($a, $b) => $a["price"] <=> $b["price"]);で$inStock自体が並べ替わります。`,
        `ステップ3のコールバックはfn($p) => $p["name"] . "(税込" . (int)round($p["price"] * 1.1) . "円)"のように連結で文字列を組み立てます。`,
        `ステップ5は合計の応用で、足し込む値を$p["price"] * $p["stock"]にするだけです。初期値0を忘れずに。`
      ],
      expectedOutput: "在庫金額合計:10470円"
    }
  ]
});
