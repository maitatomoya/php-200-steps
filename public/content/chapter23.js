// 第23章：よくあるエラー：配列と関数
registerChapter({
  number: 23,
  title: "よくあるエラー：配列と関数",
  description: "配列操作と関数まわりで実際によく起きるエラー・警告・論理バグを再現し、メッセージの読み方と修正パターンを身につけます。",
  steps: [
    {
      id: 221,
      title: "sort()の戻り値を代入する罠",
      explanation: `<p>今回のバグはエラーメッセージが<strong>出ない</strong>タイプです。実行するとこう表示されます。</p>
<pre><code>並べ替え後：1</code></pre>
<p>配列を表示したはずなのに<code>1</code>だけが出ています。これは<code>print_r(true)</code>の表示です。つまり変数<code>$scores</code>には配列ではなく<strong>true</strong>が入っています。</p>
<p>原因は<code>sort()</code>の仕様の勘違いです。<code>sort()</code>は「並べ替えた新しい配列を返す」関数ではなく、<strong>引数の配列そのものを直接並べ替える（参照で受け取って書き換える）</strong>関数で、戻り値は成功可否のbool（ほぼ常にtrue）です。そのため<code>$scores = sort($scores)</code>と書くと、並べ替え自体は行われた後、配列がtrueで上書きされてしまいます。</p>
<pre><code>sort($scores);          // 正：戻り値は受け取らない
$sorted = sort($scores); // 誤：$sortedにはtrueが入る</code></pre>
<p>この「配列を直接書き換える系」と「新しい配列を返す系」の区別は配列関数を使う上で最重要です。</p>
<table>
<tr><th>直接書き換える（戻り値bool等）</th><th>新しい配列を返す</th></tr>
<tr><td><code>sort</code>・<code>rsort</code>・<code>usort</code>・<code>ksort</code>・<code>asort</code>・<code>shuffle</code></td><td><code>array_merge</code>・<code>array_filter</code>・<code>array_map</code>・<code>array_reverse</code>・<code>array_slice</code></td></tr>
</table>
<p>迷ったらマニュアルのシグネチャを見ます。<code>sort(array &amp;$array, ...): bool</code>のように引数に<code>&amp;</code>が付いていれば「直接書き換える系」、戻り値が<code>array</code>なら「返す系」です。</p>`,
      task: `<code>sort()</code>の戻り値を代入している行を直し、並べ替え後の配列を<code>implode(', ', $scores)</code>で「並べ替え後：40, 62, 85」と表示されるように修正してください。`,
      code: `<?php
// テストの点数を低い順に並べ替えたい
$scores = [40, 85, 62];

// sort()の結果を受け取ったつもり
$scores = sort($scores);

echo '並べ替え後：';
print_r($scores);
echo "\\n";
`,
      solution: `<?php
// テストの点数を低い順に並べ替えたい
$scores = [40, 85, 62];

// sort()は配列そのものを直接並べ替える（戻り値は成功可否のbool）
sort($scores);

echo '並べ替え後：' . implode(', ', $scores) . "\\n";
`,
      hints: [
        `sort()は「並べ替えた配列を返す」のではなく「渡した配列そのものを並べ替える」関数です。戻り値はboolです。`,
        `sort($scores); のように戻り値を受け取らずに呼び、そのあと$scoresをimplodeで表示します。`
      ],
      expectedOutput: "並べ替え後：40, 62, 85"
    },
    {
      id: 222,
      title: "usortの比較関数がboolを返している",
      explanation: `<p>このコードを実行すると、並べ替え結果と一緒に次の警告が繰り返し表示されます。</p>
<pre><code>Deprecated: usort(): Returning bool from comparison function is deprecated,
return an integer less than, equal to, or greater than zero
in main.php on line 5</code></pre>
<p>読み方を分解しましょう。</p>
<ul>
<li><strong>Deprecated</strong>：「非推奨」。今は動くが将来のバージョンで壊れる書き方という警告です</li>
<li><strong>Returning bool from comparison function</strong>：比較関数（comparison function）がboolを返している、が原因</li>
<li><strong>return an integer less than, equal to, or greater than zero</strong>：修正方法まで書いてあります。「0より小さい・等しい・大きい整数を返せ」</li>
</ul>
<p><code>usort()</code>に渡す比較関数は「$aが前なら負の数、同じなら0、$aが後ろなら正の数」という<strong>3値の整数</strong>を返す約束です。<code>$a &gt; $b</code>はtrue（=1）かfalse（=0）の2値しか返せず、「$aのほうが小さい」を表す負の数を一度も返せないため、並び順が正しく決まらないことがあります。PHP 7までは黙って動いていたため古い記事に残っている書き方で、PHP 8.0からこのDeprecatedが出るようになりました。</p>
<p>修正の定番は宇宙船演算子<code>&lt;=&gt;</code>（左右を比較して-1・0・1を返す演算子）です。</p>
<pre><code>usort($nums, fn ($a, $b) =&gt; $a &lt;=&gt; $b);        // 昇順
usort($nums, fn ($a, $b) =&gt; $b &lt;=&gt; $a);        // 降順は左右を入れ替える</code></pre>`,
      task: `比較関数がboolを返しているのが原因です。宇宙船演算子<code>&lt;=&gt;</code>を使って昇順に並べ替え、Deprecated警告が出ないように修正してください。`,
      code: `<?php
$nums = [3, 10, 2, 8];

// 小さい順に並べ替えたい
usort($nums, function (int $a, int $b) {
    return $a > $b; // boolを返してしまっている
});

echo implode(', ', $nums) . "\\n";
`,
      solution: `<?php
$nums = [3, 10, 2, 8];

// 比較関数は「負・0・正の整数」を返す約束。宇宙船演算子が最適
usort($nums, function (int $a, int $b) {
    return $a <=> $b;
});

echo implode(', ', $nums) . "\\n";
`,
      hints: [
        `Deprecatedメッセージ自体に修正方法が書いてあります。「0より小さい・等しい・大きい整数を返せ」です。`,
        `2つの値から-1・0・1を作る専用の演算子が宇宙船演算子です。return $a <=> $b; と書きます。`
      ],
      expectedOutput: "2, 3, 8, 10"
    },
    {
      id: 223,
      title: "array_filter後の添字の歯抜け",
      explanation: `<p>実行すると次の警告が出て、肝心の値が表示されません。</p>
<pre><code>Warning: Undefined array key 0 in main.php on line 8
最初の偶数：</code></pre>
<p>「キー0が存在しない」と言われています。偶数は確かに2個あるのに、なぜ<code>$even[0]</code>が無いのでしょうか。<code>var_dump($even)</code>で中身を見ると理由が分かります。</p>
<pre><code>array(2) {
  [1]=&gt; int(2)
  [3]=&gt; int(4)
}</code></pre>
<p><code>array_filter()</code>は<strong>元の配列の添字（キー）をそのまま保持する</strong>仕様です。元の配列で2は添字1、4は添字3にあったので、絞り込み後もキーは1と3のまま。0から始まる連番ではなくなり「歯抜け」の状態になります。<code>$even[0]</code>や<code>foreach</code>以外の添字前提の処理（<code>$even[count($even) - 1]</code>など）がすべて狂う、非常によくあるバグです。</p>
<p>修正パターンは<code>array_values()</code>（値だけを取り出して添字を0から振り直す関数）で包むことです。</p>
<pre><code>$even = array_values(array_filter($nums, fn ($n) =&gt; $n % 2 === 0));</code></pre>
<p>「filterしたらvaluesで詰め直す」はワンセットの定型句として覚えてください。逆に、キーを保持してくれる仕様が役立つ場面（連想配列の絞り込み）もあるため、<strong>連番リストとして使うならarray_values、連想配列ならそのまま</strong>と使い分けます。</p>`,
      task: `<code>array_filter()</code>の結果の添字が歯抜けになっているのが原因です。<code>array_values()</code>で添字を振り直し、警告なしで最初の偶数が表示されるように修正してください。`,
      code: `<?php
$nums = [7, 2, 9, 4, 5];

// 偶数だけを取り出す
$even = array_filter($nums, fn (int $n) => $n % 2 === 0);

// 最初の偶数を表示したいのに…
echo '最初の偶数：' . $even[0] . "\\n";
`,
      solution: `<?php
$nums = [7, 2, 9, 4, 5];

// array_filterは元の添字を保つので、array_valuesで0から振り直す
$even = array_values(array_filter($nums, fn (int $n) => $n % 2 === 0));

echo '最初の偶数：' . $even[0] . "\\n";
echo '偶数一覧：' . implode(', ', $even) . "\\n";
`,
      hints: [
        `array_filterは絞り込んだ後も元の配列の添字を保持します。var_dumpで$evenの中身を見てみましょう。`,
        `array_valuesで包むと値だけが取り出され、添字が0からの連番に振り直されます。`
      ],
      expectedOutput: "最初の偶数：2"
    },
    {
      id: 224,
      title: "in_arrayの緩い比較による誤ヒット",
      explanation: `<p>このコードはエラーも警告も出ませんが、結果が間違っています。</p>
<pre><code>コード1は登録済みです</code></pre>
<p>一覧にあるのは<code>'01'</code>・<code>'02'</code>・<code>'10'</code>で、<code>'1'</code>は登録されていないはずです。原因は<code>in_array()</code>がデフォルトで<strong>緩い比較（==）</strong>を使うことです。==は両辺が数値っぽい文字列のとき<strong>数値に変換してから比較</strong>するため、<code>'1' == '01'</code>は1 == 1となりtrueになります。ゼロ埋めコード・電話番号・バージョン番号のような「数字だけど文字列として扱いたい」データで誤ヒットする典型パターンです。</p>
<table>
<tr><th>比較</th><th>結果（PHP 8）</th><th>理由</th></tr>
<tr><td><code>'1' == '01'</code></td><td>true</td><td>両方数値文字列なので数値比較</td></tr>
<tr><td><code>'1' === '01'</code></td><td>false</td><td>文字列として厳密比較</td></tr>
<tr><td><code>0 == 'abc'</code></td><td>false</td><td>PHP 7まではtrueだった（PHP 8で修正）</td></tr>
</table>
<p>修正は<code>in_array()</code>の<strong>第3引数にtrue</strong>を渡すことです。これで===と同じ厳密比較（型と値の両方が一致して初めて等しい）になります。</p>
<pre><code>in_array($input, $codes, true)   // 厳密比較で検索</code></pre>
<p>同じ罠は<code>array_search()</code>にもあり、こちらも第3引数trueで厳密比較になります。実務では「in_arrayとarray_searchは常に第3引数trueを付ける」を習慣にするのが安全です。</p>`,
      task: `未登録の<code>'1'</code>が登録済みと判定されてしまいます。<code>in_array()</code>を厳密比較にして「コード1は未登録です」と表示されるように修正してください。`,
      code: `<?php
// ゼロ埋めされた会員コードの一覧
$codes = ['01', '02', '10'];

// ユーザーが入力したコード（ゼロ埋めなし）
$input = '1';

if (in_array($input, $codes)) {
    echo 'コード' . $input . 'は登録済みです' . "\\n";
} else {
    echo 'コード' . $input . 'は未登録です' . "\\n";
}
`,
      solution: `<?php
// ゼロ埋めされた会員コードの一覧
$codes = ['01', '02', '10'];

// ユーザーが入力したコード（ゼロ埋めなし）
$input = '1';

// 第3引数trueで型まで一致する厳密な比較になる
if (in_array($input, $codes, true)) {
    echo 'コード' . $input . 'は登録済みです' . "\\n";
} else {
    echo 'コード' . $input . 'は未登録です' . "\\n";
}
`,
      hints: [
        `in_arrayはデフォルトで==（緩い比較）を使うため、'1'と'01'が数値として等しいと判定されます。`,
        `in_arrayの第3引数にtrueを渡すと===相当の厳密比較になります。`
      ],
      expectedOutput: "コード1は未登録です"
    },
    {
      id: 225,
      title: "参照渡しの&忘れで変更が反映されない",
      explanation: `<p>これもエラーが出ないバグです。10点加算したはずなのに実行結果は元のままです。</p>
<pre><code>佐藤：80点
鈴木：65点</code></pre>
<p>原因はPHPの引数の渡し方にあります。PHPの関数は、配列やスカラー値を<strong>値渡し（コピーを渡す）</strong>で受け取ります。関数の中の<code>$scores</code>は呼び出し元の配列の<strong>コピー</strong>なので、いくら書き換えても外側の配列は変わりません。関数が終わるとコピーは捨てられます。</p>
<p>呼び出し元の変数そのものを書き換えたい場合は、引数の宣言に<code>&amp;</code>を付けて<strong>参照渡し</strong>にします。ステップ221で見た<code>sort()</code>のシグネチャ<code>sort(array &amp;$array)</code>と同じ仕組みです。</p>
<pre><code>function addBonus(array &amp;$scores): void  // &amp;を付けると参照渡し
{
    // この中の$scoresは呼び出し元の配列そのもの
}</code></pre>
<p><code>&amp;</code>は呼び出し側ではなく<strong>関数定義側に付ける</strong>点に注意してください。呼び出しは今まで通り<code>addBonus($scores);</code>です。</p>
<p>なお実務では、参照渡しよりも<strong>新しい配列をreturnで返す</strong>設計（<code>$scores = addBonus($scores);</code>）のほうが、データの流れが追いやすく好まれる場面が多いです。今回は参照渡しの仕組みを学ぶため<code>&amp;</code>で修正しますが、「戻り値で返す」選択肢も覚えておきましょう。オブジェクトは最初から参照のように振る舞うため<code>&amp;</code>が不要、という違いも重要です。</p>`,
      task: `関数内での変更が呼び出し元に反映されていません。引数を参照渡しにして、佐藤90点・鈴木75点と表示されるように修正してください。`,
      code: `<?php
// 全員の点数に10点加算したい
function addBonus(array $scores): void
{
    foreach ($scores as $name => $score) {
        $scores[$name] = $score + 10;
    }
}

$scores = ['佐藤' => 80, '鈴木' => 65];
addBonus($scores);

echo '佐藤：' . $scores['佐藤'] . '点' . "\\n";
echo '鈴木：' . $scores['鈴木'] . '点' . "\\n";
`,
      solution: `<?php
// 全員の点数に10点加算したい（&を付けて参照渡しにする）
function addBonus(array &$scores): void
{
    foreach ($scores as $name => $score) {
        $scores[$name] = $score + 10;
    }
}

$scores = ['佐藤' => 80, '鈴木' => 65];
addBonus($scores);

echo '佐藤：' . $scores['佐藤'] . '点' . "\\n";
echo '鈴木：' . $scores['鈴木'] . '点' . "\\n";
`,
      hints: [
        `PHPの引数は値渡し（コピー）が基本です。関数内で書き換えているのはコピーのほうです。`,
        `関数定義の引数に&を付けると参照渡しになります。array &$scores のように書きます。`
      ],
      expectedOutput: "佐藤：90点"
    },
    {
      id: 226,
      title: "関数スコープ：外の変数は見えない",
      explanation: `<p>実行すると次の警告が出て、税込のはずが元の値のままです。</p>
<pre><code>Warning: Undefined variable $taxRate in main.php on line 7
税込：1000円</code></pre>
<p>「7行目で$taxRateが未定義」と言われていますが、1行目で確かに定義しています。ポイントは<strong>場所</strong>です。7行目は関数<code>withTax()</code>の中。PHPの関数は<strong>独立したスコープ（変数の有効範囲）</strong>を持ち、関数の外で定義したトップレベルの変数は、関数の中からは一切見えません。JavaScriptなど外側の変数が見える言語から来ると必ず一度はまる仕様です。</p>
<p>未定義変数はnull扱いになるため<code>1 + null</code>は1となり、税率0%として計算されてしまいました。警告を無視すると「エラーは出ないのに金額がおかしい」という発見しにくいバグになります。</p>
<p>修正パターンは3つあります。</p>
<table>
<tr><th>方法</th><th>書き方</th><th>評価</th></tr>
<tr><td>引数で受け取る</td><td><code>function withTax(int $price, float $taxRate)</code></td><td>推奨。関数が独立した部品になる</td></tr>
<tr><td>クロージャで取り込む</td><td><code>function () use ($taxRate) { ... }</code></td><td>無名関数ならこれ</td></tr>
<tr><td>globalキーワード</td><td><code>global $taxRate;</code></td><td>非推奨。依存が見えなくなる</td></tr>
</table>
<p><code>global</code>は動きますが、関数の入出力が引数と戻り値から読み取れなくなり、テストも書きにくくなるため実務では避けます。<strong>「関数が必要とする値はすべて引数で渡す」</strong>が原則です。</p>`,
      task: `関数の中から外の<code>$taxRate</code>が見えていません。税率を第2引数として受け取るように関数を修正し、<code>withTax(1000, 0.1)</code>で「税込：1100円」と表示されるようにしてください。`,
      code: `<?php
$taxRate = 0.1;

function withTax(int $price): float
{
    // 関数の中から外側の$taxRateは見えない
    return $price * (1 + $taxRate);
}

echo '税込：' . withTax(1000) . '円' . "\\n";
`,
      solution: `<?php
// 必要な値は引数で受け取る（関数を独立した部品にする）
function withTax(int $price, float $taxRate): float
{
    return $price * (1 + $taxRate);
}

echo '税込：' . withTax(1000, 0.1) . '円' . "\\n";
`,
      hints: [
        `PHPの関数の中からは、関数の外で定義した変数は見えません（関数スコープ）。`,
        `globalキーワードでも動きますが、税率を第2引数float $taxRateとして受け取り、呼び出し時に0.1を渡すのが良い設計です。`
      ],
      expectedOutput: "税込：1100円"
    },
    {
      id: 227,
      title: "array_mergeと+演算子の違い",
      explanation: `<p>2つのリストを連結したつもりが、実行結果は2件だけです。</p>
<pre><code>入荷：りんご、みかん
件数：2件</code></pre>
<p><code>ぶどう</code>と<code>もも</code>が消えました。原因は配列の<code>+</code>演算子の仕様です。<code>+</code>は連結ではなく<strong>「左の配列に無いキーだけを右から補う」</strong>結合です。数値添字のリスト同士では、両方ともキーが0と1なので全部衝突し、<strong>左が勝って右は全滅</strong>します。</p>
<table>
<tr><th></th><th><code>array_merge($a, $b)</code></th><th><code>$a + $b</code></th></tr>
<tr><td>数値キーが衝突</td><td>添字を振り直して全要素を連結</td><td>左を残し右を捨てる</td></tr>
<tr><td>文字列キーが衝突</td><td><strong>右</strong>（後）の値で上書き</td><td><strong>左</strong>（先）の値が残る</td></tr>
</table>
<p>使い分けの指針はこうです。</p>
<ul>
<li><strong>リスト（数値添字）の連結</strong>：<code>array_merge()</code>一択。スプレッド演算子<code>[...$a, ...$b]</code>でも同じ結果になります</li>
<li><strong>デフォルト設定の補完</strong>：<code>$userConfig + $defaults</code>のように「ユーザー設定に無い項目だけ既定値で埋める」用途なら<code>+</code>が便利です</li>
</ul>
<pre><code>$all = array_merge($morning, $evening);  // りんご、みかん、ぶどう、もも
$all = [...$morning, ...$evening];       // 同上（スプレッド演算子）</code></pre>
<p>「+で要素が消えた」「array_mergeで設定が上書きされた」はどちらも頻出バグです。文字列キーのときは勝敗が逆転する点まで覚えておくと、設定マージのバグにも気づけます。</p>`,
      task: `<code>+</code>演算子のせいで午後の入荷分が消えています。<code>array_merge()</code>を使って4件すべてが表示されるように修正してください。`,
      code: `<?php
$morning = ['りんご', 'みかん'];
$evening = ['ぶどう', 'もも'];

// 午前と午後の入荷リストを連結したつもり
$all = $morning + $evening;

echo '入荷：' . implode('、', $all) . "\\n";
echo '件数：' . count($all) . '件' . "\\n";
`,
      solution: `<?php
$morning = ['りんご', 'みかん'];
$evening = ['ぶどう', 'もも'];

// リストの連結はarray_merge（添字を0から振り直して全要素をつなぐ）
$all = array_merge($morning, $evening);

echo '入荷：' . implode('、', $all) . "\\n";
echo '件数：' . count($all) . '件' . "\\n";
`,
      hints: [
        `配列の+は連結ではなく「左に無いキーだけ右から補う」演算です。0と1のキーが衝突して右側が捨てられています。`,
        `数値添字リストの連結にはarray_merge($morning, $evening)を使います。`
      ],
      expectedOutput: "件数：4件"
    },
    {
      id: 228,
      title: "再帰の停止条件忘れ",
      explanation: `<p><strong>注意：このコードは実行すると数字を延々と出力し続け、最後にメモリを使い果たして落ちます。</strong>手元で試すときは覚悟して実行してください（このアプリ上では実行時間制限で止まります）。最終的に出るのはこんなメッセージです。</p>
<pre><code>Fatal error: Allowed memory size of 134217728 bytes exhausted
(tried to allocate 262144 bytes) in main.php on line 4
Stack trace:
#405856 main.php(5): countdown(1)
#405857 main.php(5): countdown(2)
#405858 main.php(8): countdown(3)</code></pre>
<p>読み方のポイントは2つです。1つ目は<strong>Allowed memory size ... exhausted</strong>（許可されたメモリを使い果たした）。2つ目はスタックトレースの<strong>異常な深さ</strong>で、#405856のような巨大な番号は「関数呼び出しが40万回積み重なった」ことを意味します。同じ関数名が延々と並ぶトレースを見たら、ほぼ確実に<strong>無限再帰</strong>です。環境によっては、無限再帰をスタックサイズの上限で検出して「Maximum call stack size ... reached. Infinite recursion?」というメッセージになることもあります。</p>
<p>再帰関数（自分自身を呼ぶ関数）には必ず<strong>基底ケース（base case）</strong>、つまり「これ以上自分を呼ばずに終わる条件」が必要です。今回のコードには終わる道がないため、$nが-1、-2、…と際限なく小さくなりながら呼び出しが積み上がります。</p>
<pre><code>function countdown(int $n): void
{
    if ($n === 0) {     // 基底ケース：ここで再帰が止まる
        return;
    }
    countdown($n - 1);  // 必ず基底ケースに近づいていること
}</code></pre>
<p>再帰を書くときのチェックリストは「1. 基底ケースがあるか」「2. 再帰呼び出しのたびに基底ケースへ<strong>確実に近づいているか</strong>」の2点です。</p>`,
      task: `再帰に停止条件がありません。<code>$n === 0</code>になったら「スタート！」と表示して再帰を止める基底ケースを追加してください。`,
      code: `<?php
function countdown(int $n): void
{
    echo $n . "\\n";
    countdown($n - 1); // 自分を呼び続けるだけで止まらない
}

countdown(3);
`,
      solution: `<?php
function countdown(int $n): void
{
    // 停止条件（基底ケース）：0になったら再帰を止める
    if ($n === 0) {
        echo 'スタート！' . "\\n";
        return;
    }
    echo $n . "\\n";
    countdown($n - 1);
}

countdown(3);
`,
      hints: [
        `再帰関数には「これ以上自分を呼ばずに終わる条件（基底ケース）」が必須です。`,
        `関数の先頭でif ($n === 0)を判定し、スタート！を出力してreturnします。再帰呼び出しより前に書くのがポイントです。`
      ],
      expectedOutput: "スタート！"
    },
    {
      id: 229,
      title: "可変長引数へ配列をそのまま渡す",
      explanation: `<p>実行すると次のTypeErrorで停止します。</p>
<pre><code>Fatal error: Uncaught TypeError: sum(): Argument #1 must be of type int,
array given, called in main.php on line 11
Stack trace:
#0 main.php(11): sum(Array)
#1 {main}</code></pre>
<p>注目すべきは2か所です。<strong>Argument #1 must be of type int, array given</strong>は「第1引数はintのはずなのに配列が来た」。そしてスタックトレースの<strong>sum(Array)</strong>で、配列を丸ごと1個の引数として渡してしまったことが確定します。</p>
<p><code>int ...$nums</code>という宣言は<strong>可変長引数</strong>（好きな個数の引数をまとめて配列として受け取る仕組み）です。期待されているのは<code>sum(100, 250, 300)</code>のような「バラバラの複数のint」であり、<code>sum([100, 250, 300])</code>は「配列1個」なので型が合いません。</p>
<p>手元にある配列をバラして渡すには、呼び出し側で<strong>スプレッド演算子（引数アンパック）</strong>の<code>...</code>を使います。</p>
<pre><code>sum(...$prices);       // sum(100, 250, 300) と同じ意味
sum(50, ...$prices);   // 通常の引数と混在も可能</code></pre>
<p>同じ<code>...</code>という記号が、<strong>定義側では「集める」、呼び出し側では「バラす」</strong>という逆方向の意味になるのが混乱ポイントです。定義側の<code>...</code>は複数の引数を1つの配列に集約し、呼び出し側の<code>...</code>は1つの配列を複数の引数に展開します。エラーメッセージに「must be of type X, array given」と出て、渡した覚えのある配列が見えたら、まず<code>...</code>の付け忘れを疑ってください。</p>`,
      task: `配列を丸ごと1個の引数として渡しているためTypeErrorになります。スプレッド演算子<code>...</code>で配列を展開して渡し、「合計：650円」と表示されるように修正してください。`,
      code: `<?php
// 可変長引数：好きな個数の数値を受け取れる
function sum(int ...$nums): int
{
    return array_sum($nums);
}

$prices = [100, 250, 300];

// 配列をそのまま渡してしまっている
echo '合計：' . sum($prices) . '円' . "\\n";
`,
      solution: `<?php
// 可変長引数：好きな個数の数値を受け取れる
function sum(int ...$nums): int
{
    return array_sum($nums);
}

$prices = [100, 250, 300];

// スプレッド演算子...で配列を個々の引数に展開して渡す
echo '合計：' . sum(...$prices) . '円' . "\\n";
`,
      hints: [
        `int ...$numsは「バラバラの複数のint」を期待しています。配列1個を渡すと型が合いません。`,
        `呼び出し側でsum(...$prices)と書くと、配列が個々の引数に展開されます。`
      ],
      expectedOutput: "合計：650円"
    },
    {
      id: 230,
      title: "総合演習：配列処理のバグを直す",
      explanation: `<p>この章の総仕上げです。「合格者（60点以上）の点数を高い順で表示する」プログラムに、この章で学んだバグが2つ仕込まれています。実行するとまず次のエラーが出ます。</p>
<pre><code>Fatal error: Uncaught TypeError: passedScores(): Return value must be of type array,
true returned in main.php:7
Stack trace:
#0 main.php(15): passedScores(Array)</code></pre>
<p><strong>Return value must be of type array, true returned</strong>は「戻り値はarrayと宣言されているのにtrueを返した」という意味です。関数がtrueを返してしまう場所を探すと、ステップ221で学んだ<code>$passed = rsort($passed)</code>が見つかります。<code>rsort()</code>（降順版のsort）も配列を直接並べ替えて<strong>boolを返す</strong>関数です。</p>
<p>これを直して実行すると、今度はエラーなしで結果が出ますが、88点の合格者が消えています。5人分のデータのはずが<code>count($all)</code>は3。ステップ227の<strong>+演算子</strong>が原因で、$class1と$class2の添字0・1が衝突し、$class2側が捨てられています。</p>
<p>このように実際のデバッグは「1つ直すと次の問題が見える」の繰り返しです。進め方の定石をまとめます。</p>
<ol>
<li>まず<strong>エラーメッセージが指す行</strong>を直す（型のエラーは宣言と実際の値のズレを見る）</li>
<li>エラーが消えたら<strong>出力を検算</strong>する（件数・順序・値が期待通りか）</li>
<li>途中の変数を<code>var_dump()</code>で覗いて、どの段階でデータが壊れたか特定する</li>
</ol>
<p>なお<code>rsort()</code>は並べ替えと同時に添字を0から振り直すため、この場合は<code>array_filter</code>後の<code>array_values()</code>は不要です。仕様を正確に知っていると余計なコードを書かずに済む、という例でもあります。</p>`,
      task: `2つのバグ（<code>rsort()</code>の戻り値の代入・<code>+</code>による連結）を修正し、「90, 88, 72」と表示されるようにしてください。`,
      code: `<?php
// 合格者（60点以上）の点数を高い順で表示したい
function passedScores(array $scores): array
{
    $passed = array_filter($scores, fn (int $s) => $s >= 60);
    $passed = rsort($passed); // バグ2：戻り値を代入している
    return $passed;
}

$class1 = [55, 90, 72];
$class2 = [88, 40];

$all = $class1 + $class2; // バグ1：+では連結できない

echo implode(', ', passedScores($all)) . "\\n";
`,
      solution: `<?php
// 合格者（60点以上）の点数を高い順で表示したい
function passedScores(array $scores): array
{
    $passed = array_filter($scores, fn (int $s) => $s >= 60);
    rsort($passed); // rsortは配列を直接並べ替える（添字も0から振り直される）
    return $passed;
}

$class1 = [55, 90, 72];
$class2 = [88, 40];

$all = array_merge($class1, $class2); // リストの連結はarray_merge

echo implode(', ', passedScores($all)) . "\\n";
`,
      hints: [
        `まずTypeErrorから。rsort()もsort()と同じく配列を直接並べ替えてboolを返します。戻り値を代入してはいけません。`,
        `エラーが消えたら件数を確認。$class1 + $class2では添字が衝突して$class2が消えます。array_mergeに置き換えましょう。`,
        `期待する結果は5人中60点以上の3人分を降順に並べた 90, 88, 72 です。`
      ],
      expectedOutput: "90, 88, 72"
    }
  ]
});
