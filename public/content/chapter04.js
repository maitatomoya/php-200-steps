// 第4章：配列の基本
registerChapter({
  number: 4,
  title: "配列の基本",
  description: "複数の値をまとめて扱う配列を学びます。インデックス配列・連想配列の操作からforeachによる走査、多次元配列までを身につけます。",
  steps: [
    {
      id: 31,
      title: "インデックス配列の作成とアクセス",
      explanation: `<p>これまでの変数は1つの値しか入れられませんでした。<strong>配列</strong>を使うと、複数の値を1つの変数にまとめて格納できます。PHPでは角かっこ<code>[ ]</code>で配列を作ります。</p>
<pre><code>$fruits = ["りんご", "みかん", "ぶどう"];</code></pre>
<p>各値（<strong>要素</strong>と呼びます）には、自動的に<strong>0から始まる番号（インデックス）</strong>が振られます。ここが最初のつまずきポイントで、<strong>1番目の要素はインデックス0</strong>です。</p>
<table>
<tr><th>インデックス</th><th>0</th><th>1</th><th>2</th></tr>
<tr><td>値</td><td>りんご</td><td>みかん</td><td>ぶどう</td></tr>
</table>
<p>要素を取り出すには、変数名のあとに<code>[インデックス]</code>を付けます。</p>
<pre><code>echo $fruits[0];  // りんご
echo $fruits[2];  // ぶどう</code></pre>
<p>存在しないインデックス（この例では<code>$fruits[3]</code>など）にアクセスすると、Warning（警告）が出てnullが返ります。この挙動はステップ36で詳しく体験します。</p>
<p>配列の中身をまとめて確認したいときは、<code>var_dump($fruits);</code>や<code>print_r($fruits);</code>が使えます。print_rは人間が読みやすい形式で配列を表示してくれる組み込み関数で、デバッグの強い味方です。まずは「作る」「番号で取り出す」の2つに慣れましょう。</p>`,
      task: `配列<code>$fruits</code>から「りんご」を取り出して、「最初の果物はりんごです」と表示されるようにインデックスを修正してください。`,
      code: `<?php
$fruits = ["りんご", "みかん", "ぶどう"];

// TODO: 「りんご」を取り出したい。正しいインデックスに直す（今は「みかん」が表示される）
echo "最初の果物は" . $fruits[1] . "です\\n";
echo "3番目の果物は" . $fruits[2] . "です\\n";
`,
      solution: `<?php
$fruits = ["りんご", "みかん", "ぶどう"];

// インデックスは0から始まるので、最初の要素は[0]
echo "最初の果物は" . $fruits[0] . "です\\n";
echo "3番目の果物は" . $fruits[2] . "です\\n";
`,
      hints: [
        `インデックスは1からではなく0から始まります。「1番目の要素」のインデックスは何番でしょうか。`,
        `$fruits[0]が「りんご」、$fruits[1]が「みかん」、$fruits[2]が「ぶどう」です。`
      ],
      expectedOutput: "最初の果物はりんごです"
    },
    {
      id: 32,
      title: "要素の追加（[]）と変更",
      explanation: `<p>配列は作ったあとから自由に要素を追加・変更できます。</p>
<h4>末尾への追加：$array[] = 値</h4>
<p>インデックスを書かずに<code>[]</code>へ代入すると、<strong>配列の末尾に新しい要素が追加</strong>されます。インデックスは自動で採番されます。</p>
<pre><code>$colors = ["赤", "青"];
$colors[] = "緑";   // インデックス2として末尾に追加される
// ["赤", "青", "緑"]</code></pre>
<p>この<code>[]</code>記法はPHP特有の便利な書き方で、「いくつ入るか分からないデータをループで集める」場面などで多用します。</p>
<h4>既存要素の変更：$array[インデックス] = 値</h4>
<p>すでにあるインデックスを指定して代入すると、その位置の値が<strong>上書き</strong>されます。</p>
<pre><code>$colors[1] = "黄";  // インデックス1の「青」が「黄」に変わる
// ["赤", "黄", "緑"]</code></pre>
<table>
<tr><th>書き方</th><th>動き</th></tr>
<tr><td><code>$colors[] = "緑";</code></td><td>末尾に追加（自動採番）</td></tr>
<tr><td><code>$colors[1] = "黄";</code></td><td>インデックス1を上書き</td></tr>
</table>
<p>注意点として、飛び飛びのインデックス（例：要素が2個しかないのに<code>$colors[10] = ...</code>）に代入すること自体はエラーになりませんが、間の3〜9は存在しない「歯抜け」の配列になり、バグの温床になります。末尾追加は<code>[]</code>に任せるのが安全です。</p>`,
      task: `配列<code>$colors</code>に対して、(1)末尾に「緑」を追加し、(2)インデックス1の「青」を「黄」に上書きしてください。出力が「赤・黄・緑」になれば成功です。`,
      code: `<?php
$colors = ["赤", "青"];

// TODO: []を使って末尾に"緑"を追加する

// TODO: インデックス1の"青"を"黄"に上書きする

echo $colors[0] . "・" . $colors[1] . "・" . $colors[2] . "\\n";
`,
      solution: `<?php
$colors = ["赤", "青"];

// インデックスを書かない[]への代入は末尾追加になる
$colors[] = "緑";

// 既存のインデックスへの代入は上書きになる
$colors[1] = "黄";

echo $colors[0] . "・" . $colors[1] . "・" . $colors[2] . "\\n";
`,
      hints: [
        `末尾追加は $colors[] = "緑"; のようにインデックスを書かずに代入します。`,
        `上書きは $colors[1] = "黄"; のように、変更したい位置のインデックスを指定して代入します。`
      ],
      expectedOutput: "赤・黄・緑"
    },
    {
      id: 33,
      title: "countとarray_sum",
      explanation: `<p>配列を扱うとき「要素はいくつあるか」「合計はいくらか」は最頻出の集計です。PHPには便利な組み込み関数が用意されています。</p>
<h4>count：要素数を数える</h4>
<pre><code>$prices = [120, 250, 380];
echo count($prices);  // 3</code></pre>
<p><code>count()</code>は配列の要素数を整数で返します。「ループを何回回すか」「データが空かどうか」の判定など、あらゆる場面で使います。空の配列<code>[]</code>に対しては0を返します。</p>
<h4>array_sum：数値の合計を求める</h4>
<pre><code>echo array_sum($prices);  // 750</code></pre>
<p><code>array_sum()</code>は配列内の数値をすべて足した合計を返します。第3章のステップ27では、forループと累積用変数で合計を計算しました。<code>array_sum()</code>を使えばあの処理が1行で書けます。「自力でループを書けば実現できることでも、組み込み関数があるならそちらを使う」のがPHPらしい書き方です。</p>
<h4>組み合わせると平均も出せる</h4>
<pre><code>$average = array_sum($prices) / count($prices);  // 750 ÷ 3 = 250</code></pre>
<p>合計を要素数で割れば平均です。このように関数の戻り値は、変数に入れずそのまま計算式や文字列連結の中で使うこともできます。なお、PHPには他にも<code>max()</code>（最大値）、<code>min()</code>（最小値）など多くの配列向け関数があります。「やりたい処理には既に関数があるかも」と公式マニュアルを調べる習慣が上達の近道です。</p>`,
      task: `<code>count()</code>と<code>array_sum()</code>を使って、商品数と合計金額を表示してください。「商品数は4個です」「合計金額は900円です」と表示されれば成功です。`,
      code: `<?php
$prices = [120, 250, 380, 150];

// TODO: count()を使って商品数を表示する
echo "商品数は" . 0 . "個です\\n";

// TODO: array_sum()を使って合計金額を表示する
echo "合計金額は" . 0 . "円です\\n";
`,
      solution: `<?php
$prices = [120, 250, 380, 150];

// count()は要素数、array_sum()は数値の合計を返す
echo "商品数は" . count($prices) . "個です\\n";
echo "合計金額は" . array_sum($prices) . "円です\\n";
`,
      hints: [
        `関数の戻り値は変数に入れなくても、そのまま文字列連結の中で使えます。`,
        `0と書かれている部分をそれぞれ count($prices) と array_sum($prices) に置き換えましょう。`
      ],
      expectedOutput: "合計金額は900円です"
    },
    {
      id: 34,
      title: "連想配列の基本",
      explanation: `<p>ここまでの配列は0、1、2…という番号で要素を管理していました。PHPでは番号の代わりに<strong>好きな名前（キー）</strong>で要素を管理する配列も作れます。これを<strong>連想配列</strong>と呼びます。</p>
<pre><code>$user = [
    "name" =&gt; "佐藤",
    "age" =&gt; 28,
];</code></pre>
<p><code>キー =&gt; 値</code>という組をカンマで並べます。<code>=&gt;</code>は<strong>ダブルアロー</strong>と呼ばれる記号で、「このキーにこの値を対応させる」という意味です。要素の取り出しはインデックス配列と同じ角かっこで、番号の代わりにキーを書きます。</p>
<pre><code>echo $user["name"];  // 佐藤
echo $user["age"];   // 28</code></pre>
<table>
<tr><th></th><th>インデックス配列</th><th>連想配列</th></tr>
<tr><td>キー</td><td>0, 1, 2…（自動採番）</td><td>任意の文字列や数値</td></tr>
<tr><td>向いている用途</td><td>同種のデータの並び（商品リストなど）</td><td>1つのモノの属性のまとまり（ユーザー情報など）</td></tr>
<tr><td>取り出し方</td><td><code>$arr[0]</code></td><td><code>$arr["name"]</code></td></tr>
</table>
<p><code>$user["name"]</code>は<code>$userのnameという項目</code>と読めるため、<code>$user[0]</code>より意味が明確になります。なおPHPの連想配列は<strong>要素を入れた順番が保持される</strong>という特徴があり、後で学ぶforeachでも定義した順に取り出されます。実務のPHPコードでは、設定値・データベースの行・APIのデータなど、あらゆる場面で連想配列が登場します。</p>`,
      task: `連想配列<code>$user</code>からキーを指定して値を取り出し、「佐藤さんは28歳です」と表示してください。`,
      code: `<?php
$user = [
    "name" => "佐藤",
    "age" => 28,
];

// TODO: キーを指定して値を取り出し、「佐藤さんは28歳です」と表示する
echo "" . "さんは" . "" . "歳です\\n";
`,
      solution: `<?php
$user = [
    "name" => "佐藤",
    "age" => 28,
];

// 角かっこにキーを書いて値を取り出す
echo $user["name"] . "さんは" . $user["age"] . "歳です\\n";
`,
      hints: [
        `連想配列の値は $配列名["キー"] で取り出します。キーは文字列なので引用符で囲みます。`,
        `1つ目の空文字列を $user["name"] に、2つ目を $user["age"] に置き換えましょう。`
      ],
      expectedOutput: "佐藤さんは28歳です"
    },
    {
      id: 35,
      title: "連想配列の追加・上書き・削除unset",
      explanation: `<p>連想配列も作ったあとから自由に編集できます。追加と上書きは、実は<strong>同じ書き方</strong>です。</p>
<pre><code>$menu = ["coffee" =&gt; 400, "tea" =&gt; 350];

$menu["juice"] = 300;   // キーが存在しない → 新規追加
$menu["coffee"] = 450;  // キーが存在する   → 上書き</code></pre>
<p><code>$配列[キー] = 値;</code>と代入したとき、そのキーが<strong>なければ追加、あれば上書き</strong>になります。シンプルで便利な反面、「追加したつもりがキー名を間違えて別の要素を上書きしていた」という事故も起きうるので、キー名のタイプミスには注意しましょう。</p>
<h4>要素の削除：unset</h4>
<p>要素を削除するには<code>unset()</code>を使います。</p>
<pre><code>unset($menu["tea"]);  // キー"tea"の要素を削除
// ["coffee" =&gt; 450, "juice" =&gt; 300]</code></pre>
<p><code>unset()</code>は指定したキーと値の組を配列から取り除きます。削除後にそのキーへアクセスすると「存在しないキー」としてWarningが出ます（次のステップで体験します）。</p>
<table>
<tr><th>操作</th><th>書き方</th></tr>
<tr><td>追加</td><td><code>$menu["juice"] = 300;</code>（キーがない場合）</td></tr>
<tr><td>上書き</td><td><code>$menu["coffee"] = 450;</code>（キーがある場合）</td></tr>
<tr><td>削除</td><td><code>unset($menu["tea"]);</code></td></tr>
</table>
<p>なお、インデックス配列の要素をunsetするとインデックスが歯抜けのまま残る（詰め直されない）という落とし穴がありますが、まずは連想配列での基本操作を確実に押さえましょう。</p>`,
      task: `メニューの配列に対して、(1)「juice」を300円で追加、(2)「coffee」を450円に値上げ、(3)「tea」を販売終了として削除、の3つの操作を行ってください。`,
      code: `<?php
$menu = ["coffee" => 400, "tea" => 350];

// TODO: キー"juice"を値300で追加する

// TODO: キー"coffee"の値を450に上書きする

// TODO: unset()でキー"tea"を削除する

echo "coffeeは" . $menu["coffee"] . "円です\\n";
echo "メニュー数は" . count($menu) . "品です\\n";
`,
      solution: `<?php
$menu = ["coffee" => 400, "tea" => 350];

// キーが存在しないので新規追加になる
$menu["juice"] = 300;

// キーが存在するので上書きになる
$menu["coffee"] = 450;

// キーと値の組を配列から削除する
unset($menu["tea"]);

echo "coffeeは" . $menu["coffee"] . "円です\\n";
echo "メニュー数は" . count($menu) . "品です\\n";
`,
      hints: [
        `追加も上書きも $menu["キー"] = 値; の形です。キーがあるかないかで動きが変わります。`,
        `削除は unset($menu["tea"]); と書きます。正しく操作できていれば、最後のメニュー数は2品になります。`
      ],
      expectedOutput: "coffeeは450円です"
    },
    {
      id: 36,
      title: "存在チェック（isset・array_key_exists）とWarningの体験",
      explanation: `<p>存在しないキーにアクセスするとどうなるでしょうか。PHPは<strong>Warning: Undefined array key</strong>という警告を出し、値としてはnullを返して処理を続行します。プログラムは止まりませんが、警告が出るコードは意図しない動作やバグのサインです。初期コードを実行して、まずこのWarningを自分の目で確認してみましょう。</p>
<pre><code>$settings = ["theme" =&gt; "dark"];
echo $settings["font_size"];
// Warning: Undefined array key "font_size" in ...</code></pre>
<p>これを防ぐには、アクセスする前にキーの存在を確認します。方法は主に3つあります。</p>
<table>
<tr><th>方法</th><th>判定内容</th><th>値がnullのとき</th></tr>
<tr><td><code>isset($arr["key"])</code></td><td>キーが存在し、かつ値がnullでない</td><td>false</td></tr>
<tr><td><code>array_key_exists("key", $arr)</code></td><td>キーが存在するか（値は見ない）</td><td><strong>true</strong></td></tr>
<tr><td><code>$arr["key"] ?? デフォルト値</code></td><td>null・未定義ならデフォルト値を返す</td><td>デフォルト値</td></tr>
</table>
<p>2つの関数の違いは「<strong>値がnullの場合</strong>」に現れます。<code>isset()</code>は値がnullだとfalseを返しますが、<code>array_key_exists()</code>は「キー自体があるか」だけを見るのでtrueを返します。日常的にはissetで十分な場面が多いものの、「nullという値が意図的に入っているか」を区別したいときはarray_key_existsが必要です。</p>
<p>そしてステップ23で学んだ<strong>null合体演算子<code>??</code></strong>は、未定義キーでも<strong>Warningを出さずに</strong>デフォルト値を返してくれます。「なければデフォルト値」という典型パターンでは<code>??</code>が最も簡潔で安全な書き方です。</p>`,
      task: `まず初期コードをそのまま実行して、Undefined array keyのWarningを確認してください。その後、(1)Warningの出る行を<code>??</code>を使ってデフォルト値14が入るよう修正し、(2)<code>isset()</code>と<code>array_key_exists()</code>で「値がnullのキー」の判定結果の違いをvar_dumpで確認してください。`,
      code: `<?php
$settings = ["theme" => "dark", "lang" => null];

// まずこのまま実行して、Warning: Undefined array key が出ることを確認しよう
// TODO: 確認したら、??を使って「キーがなければ14」となるように修正する
$fontSize = $settings["font_size"];
echo "フォントサイズは" . $fontSize . "です\\n";

// TODO: キー"lang"（値はnull）について、isset()の結果をvar_dumpで表示する

// TODO: 同じく"lang"について、array_key_exists()の結果をvar_dumpで表示する
`,
      solution: `<?php
$settings = ["theme" => "dark", "lang" => null];

// ??は未定義キーでもWarningを出さずにデフォルト値を返す
$fontSize = $settings["font_size"] ?? 14;
echo "フォントサイズは" . $fontSize . "です\\n";

// issetは「キーが存在し、かつnullでない」判定なのでfalse
var_dump(isset($settings["lang"]));

// array_key_existsは「キーがあるか」だけを見るのでtrue
var_dump(array_key_exists("lang", $settings));
`,
      hints: [
        `??を使うと $settings["font_size"] ?? 14 のように書けます。未定義キーでもWarningが出ないのが??の強みです。`,
        `isset($settings["lang"]) と array_key_exists("lang", $settings) をそれぞれvar_dump()に渡しましょう。引数の順番が2つの関数で違う点に注意してください。`,
        `値がnullなので、issetはbool(false)、array_key_existsはbool(true)と表示されるはずです。`
      ],
      expectedOutput: "フォントサイズは14です"
    },
    {
      id: 37,
      title: "foreachでインデックス配列を走査",
      explanation: `<p>配列の全要素を順番に処理することを<strong>走査（そうさ）</strong>と呼びます。forループとcountでも書けますが、PHPには配列専用のループ<strong>foreach</strong>があり、こちらが標準的な書き方です。</p>
<pre><code>foreach (配列 as 変数) {
    // 要素の数だけ繰り返される。変数に各要素が順番に入る
}</code></pre>
<pre><code>$animals = ["犬", "猫", "うさぎ"];
foreach ($animals as $animal) {
    echo $animal . "\\n";
}
// 犬 猫 うさぎ（先頭から順に1つずつ$animalに入る）</code></pre>
<p>forで同じ処理を書くと<code>for ($i = 0; $i &lt; count($animals); $i++)</code>となり、インデックスの管理が必要です。foreachなら<strong>要素数を数える必要も、インデックスを進める必要もなく、範囲外アクセスの心配もありません</strong>。「全要素を処理する」場面では迷わずforeachを選びましょう。</p>
<table>
<tr><th></th><th>for</th><th>foreach</th></tr>
<tr><td>向いている場面</td><td>回数指定の繰り返し</td><td>配列の全要素の処理</td></tr>
<tr><td>インデックス管理</td><td>自分で行う</td><td>不要（自動）</td></tr>
<tr><td>範囲外アクセス</td><td>起こしうる</td><td>起きない</td></tr>
</table>
<p>ループ変数の名前は自由ですが、<code>$animals</code>の各要素なら<code>$animal</code>のように、<strong>配列名の単数形</strong>を使うと読みやすくなります。第3章で学んだbreakやcontinueもforeachの中でそのまま使えます。</p>`,
      task: `foreachを使って配列<code>$animals</code>の全要素を走査し、それぞれ「〇〇が好きです」と表示してください。`,
      code: `<?php
$animals = ["犬", "猫", "うさぎ"];

// TODO: foreachを使って、各要素について「〇〇が好きです」と表示する
// （〇〇には配列の要素が入る）
`,
      solution: `<?php
$animals = ["犬", "猫", "うさぎ"];

// 先頭から順に各要素が$animalに入り、要素の数だけ繰り返される
foreach ($animals as $animal) {
    echo $animal . "が好きです\\n";
}
`,
      hints: [
        `foreach ($animals as $animal) { ... } と書くと、$animalに要素が1つずつ入ります。`,
        `ループの中で echo $animal . "が好きです\\n"; と連結して表示しましょう。`
      ],
      expectedOutput: "うさぎが好きです"
    },
    {
      id: 38,
      title: "foreachで連想配列を走査（key => value）",
      explanation: `<p>foreachは連想配列でも使えます。値だけでなく<strong>キーも一緒に</strong>取り出したいときは、<code>as キー変数 =&gt; 値変数</code>という形を使います。</p>
<pre><code>foreach (配列 as $key =&gt; $value) {
    // $keyにキー、$valueに値が入る
}</code></pre>
<pre><code>$scores = ["国語" =&gt; 80, "数学" =&gt; 92, "英語" =&gt; 75];
foreach ($scores as $subject =&gt; $score) {
    echo $subject . "：" . $score . "点\\n";
}
// 国語：80点
// 数学：92点
// 英語：75点</code></pre>
<p>連想配列の定義で使った<code>=&gt;</code>（ダブルアロー）と同じ記号を、foreachでは「キーを左の変数へ、値を右の変数へ」という意味で使います。変数名は<code>$key</code>と<code>$value</code>でも動きますが、この例の<code>$subject</code>（教科）と<code>$score</code>（点数）のように<strong>中身を表す名前</strong>を付けると、ループ内のコードが格段に読みやすくなります。</p>
<p>ステップ34で触れた通り、PHPの連想配列は<strong>挿入した順番を保持する</strong>ので、foreachでも定義した順に取り出されます。この性質は他言語（例えば古いバージョンのPython辞書など）にはなかったPHPの特徴で、順序に意味のあるデータも連想配列で安心して扱えます。なお、キーが不要なら連想配列でも<code>foreach ($scores as $score)</code>と値だけを受け取る形が使えます。</p>`,
      task: `<code>キー =&gt; 値</code>の形のforeachを使って、各教科の点数を「〇〇の点数は△△点です」の形式で表示してください。`,
      code: `<?php
$scores = ["国語" => 80, "数学" => 92, "英語" => 75];

// TODO: foreachでキー（教科名）と値（点数）を同時に取り出し、
// 「〇〇の点数は△△点です」と表示する
foreach ($scores as $score) {
    echo $score . "\\n";
}
`,
      solution: `<?php
$scores = ["国語" => 80, "数学" => 92, "英語" => 75];

// キーが$subjectに、値が$scoreに入る
foreach ($scores as $subject => $score) {
    echo $subject . "の点数は" . $score . "点です\\n";
}
`,
      hints: [
        `キーも受け取るには foreach ($scores as $subject => $score) のように=>で2つの変数を書きます。`,
        `ループ内は $subject . "の点数は" . $score . "点です\\n" を連結してechoします。`
      ],
      expectedOutput: "数学の点数は92点です"
    },
    {
      id: 39,
      title: "多次元配列",
      explanation: `<p>配列の要素には、数値や文字列だけでなく<strong>配列そのもの</strong>も入れられます。配列の中に配列がある構造を<strong>多次元配列</strong>と呼びます。実務では「ユーザーの一覧」「注文の一覧」のような<strong>連想配列のリスト</strong>が最頻出パターンです。</p>
<pre><code>$students = [
    ["name" =&gt; "田中", "score" =&gt; 85],
    ["name" =&gt; "鈴木", "score" =&gt; 72],
];</code></pre>
<p>外側はインデックス配列（0番、1番…）、内側は連想配列という2階建ての構造です。取り出すときは角かっこを<strong>外側から順に2つ</strong>重ねます。</p>
<pre><code>echo $students[0]["name"];   // 田中（0番目の学生のname）
echo $students[1]["score"];  // 72（1番目の学生のscore）</code></pre>
<p><code>$students[0]</code>で内側の連想配列を取り出し、続けて<code>["name"]</code>でその中の値を取り出す、と左から順に読むのがコツです。</p>
<h4>foreachとの組み合わせ</h4>
<pre><code>foreach ($students as $student) {
    // $studentには内側の連想配列が丸ごと入る
    echo $student["name"] . "：" . $student["score"] . "点\\n";
}</code></pre>
<p>foreachで走査すると、ループ変数<code>$student</code>には<strong>内側の連想配列が丸ごと</strong>入ります。あとは<code>$student["name"]</code>のようにキーでアクセスするだけです。この形はデータベースから取得した複数行のデータ処理とまったく同じ構造なので、ここで慣れておくと実務に直結します。</p>`,
      task: `学生データの多次元配列をforeachで走査し、各学生を「〇〇さん:△△点」の形式で表示してください。`,
      code: `<?php
$students = [
    ["name" => "田中", "score" => 85],
    ["name" => "鈴木", "score" => 72],
];

// まず個別アクセスの確認：0番目の学生の名前を表示
echo "1人目は" . $students[0]["name"] . "さんです\\n";

// TODO: foreachで全学生を走査し、「〇〇さん:△△点」と表示する
`,
      solution: `<?php
$students = [
    ["name" => "田中", "score" => 85],
    ["name" => "鈴木", "score" => 72],
];

// まず個別アクセスの確認：0番目の学生の名前を表示
echo "1人目は" . $students[0]["name"] . "さんです\\n";

// $studentには内側の連想配列が丸ごと入る
foreach ($students as $student) {
    echo $student["name"] . "さん:" . $student["score"] . "点\\n";
}
`,
      hints: [
        `foreach ($students as $student) と書くと、$studentに1人分の連想配列が入ります。`,
        `ループ内では $student["name"] と $student["score"] でそれぞれの値にアクセスできます。`
      ],
      expectedOutput: "鈴木さん:72点"
    },
    {
      id: 40,
      title: "総合演習：成績表の集計",
      explanation: `<p>第4章の総仕上げとして、成績表の集計プログラムを作ります。使うのはすべてこの章と第3章で学んだ道具です。</p>
<ul>
<li>連想配列と多次元配列（キーが名前、値が点数の配列）</li>
<li><code>foreach ($配列 as $key =&gt; $value)</code>によるキー付き走査</li>
<li><code>array_sum()</code>と<code>count()</code>による合計・平均の計算</li>
<li>if文と比較による「最高記録の更新」判定</li>
</ul>
<p>今回のデータは「キーが生徒名、値が点数のインデックス配列」という形の多次元配列です。</p>
<pre><code>$grades = [
    "田中" =&gt; [80, 90, 70],
    "鈴木" =&gt; [60, 75, 90],
];</code></pre>
<h4>最大値を探す定番パターン</h4>
<p>「一番成績のよい生徒」を探すには、<strong>これまでの最高記録を変数に覚えておき、より大きい値が来たら更新する</strong>という定番パターンを使います。</p>
<pre><code>$topName = "";
$topTotal = 0;
foreach (...) {
    if ($total &gt; $topTotal) {
        $topTotal = $total;  // 記録を更新
        $topName = $name;    // 誰の記録かも更新
    }
}</code></pre>
<p>ループが終わったとき、<code>$topName</code>と<code>$topTotal</code>には最高記録の生徒と点数が残っています。この「ループの外に結果を残す変数を用意する」考え方は、ステップ27の合計計算と同じアキュムレータパターンの応用です。集計・検索・最大最小の判定は、実務のデータ処理の核となるスキルです。じっくり取り組みましょう。</p>`,
      task: `各生徒について「〇〇さん 合計:△△点 平均:□□点」と表示し、最後に合計点が最も高い生徒を「最高得点は〇〇さんの△△点です」と表示してください。合計は<code>array_sum()</code>、平均は合計を<code>count()</code>で割って求めます。`,
      code: `<?php
$grades = [
    "田中" => [80, 90, 70],
    "鈴木" => [60, 75, 90],
    "高橋" => [95, 85, 90],
];

$topName = "";
$topTotal = 0;

foreach ($grades as $name => $scores) {
    // TODO: array_sum()で$scoresの合計を、count()との割り算で平均を求める
    $total = 0;
    $average = 0;
    echo $name . "さん 合計:" . $total . "点 平均:" . $average . "点\\n";

    // TODO: $totalが$topTotalより大きければ、$topTotalと$topNameを更新する
}

echo "最高得点は" . $topName . "さんの" . $topTotal . "点です\\n";
`,
      solution: `<?php
$grades = [
    "田中" => [80, 90, 70],
    "鈴木" => [60, 75, 90],
    "高橋" => [95, 85, 90],
];

$topName = "";
$topTotal = 0;

foreach ($grades as $name => $scores) {
    // 合計はarray_sum、平均は合計÷科目数で求める
    $total = array_sum($scores);
    $average = $total / count($scores);
    echo $name . "さん 合計:" . $total . "点 平均:" . $average . "点\\n";

    // これまでの最高記録を上回ったら更新する
    if ($total > $topTotal) {
        $topTotal = $total;
        $topName = $name;
    }
}

echo "最高得点は" . $topName . "さんの" . $topTotal . "点です\\n";
`,
      hints: [
        `foreachの$nameには生徒名（キー）、$scoresには点数の配列（値）が入っています。合計は array_sum($scores) です。`,
        `平均は $total / count($scores) で求められます。今回のデータはすべて割り切れる値になっています。`,
        `最高記録の更新は if ($total > $topTotal) { $topTotal = $total; $topName = $name; } の形です。点数と名前の両方を更新するのを忘れずに。`
      ],
      expectedOutput: "最高得点は高橋さんの270点です"
    }
  ]
});
