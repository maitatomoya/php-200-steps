// 第3章：制御フロー
registerChapter({
  number: 3,
  title: "制御フロー",
  description: "条件分岐（if・switch・match）と繰り返し（while・for）を学び、プログラムの流れを自在にコントロールできるようになります。",
  steps: [
    {
      id: 21,
      title: "ifの基本",
      explanation: `<p>プログラムは通常、上から下へ1行ずつ実行されます。<strong>if文</strong>を使うと「条件を満たしたときだけ処理を実行する」という分岐が作れます。制御フローの中で最も基本となる構文です。</p>
<pre><code>if (条件式) {
    // 条件式がtrueのときだけ実行される処理
}</code></pre>
<p>条件式には、第2章で学んだ比較演算子（<code>&lt;</code>、<code>&gt;</code>、<code>&lt;=</code>、<code>&gt;=</code>、<code>===</code>、<code>!==</code>）を使った式をよく書きます。条件式の結果が<code>true</code>なら波かっこ<code>{ }</code>の中（ブロックと呼びます）が実行され、<code>false</code>なら丸ごとスキップされます。</p>
<pre><code>$age = 20;
if ($age &gt;= 18) {
    echo "成人です";
}
echo "判定終了";  // ここはifと無関係に必ず実行される</code></pre>
<p>注意点が2つあります。1つ目は、条件式のあとに<strong>セミコロンを書かない</strong>こと。<code>if ($age &gt;= 18);</code>と書くと「何もしないif文」になり、ブロックが常に実行されるバグになります。2つ目は、条件式にbool以外の値を書くと自動的にtrue/falseへ変換されることです（<code>0</code>、<code>""</code>、<code>null</code>などはfalse扱い）。意図しない変換を避けるため、条件式は比較演算子で明示的に書くのが安全です。</p>`,
      task: `変数<code>$score</code>が80以上のときに「合格です」と表示されるように、if文の条件式を書き換えてください。`,
      code: `<?php
$score = 85;

// TODO: 条件式のfalseを「$scoreが80以上」という比較に書き換える
if (false) {
    echo "合格です\\n";
}
echo "判定を終了しました\\n";
`,
      solution: `<?php
$score = 85;

// $scoreが80以上のときだけブロック内が実行される
if ($score >= 80) {
    echo "合格です\\n";
}
echo "判定を終了しました\\n";
`,
      hints: [
        `「80以上」は「80より大きい、または80と等しい」という意味です。どの比較演算子が使えるでしょうか。`,
        `条件式は $score >= 80 のように、変数・演算子・値を組み合わせて書きます。`
      ],
      expectedOutput: "合格です"
    },
    {
      id: 22,
      title: "elseifとelse",
      explanation: `<p>ifだけでは「条件を満たさなかったとき」の処理が書けません。<strong>else</strong>と<strong>elseif</strong>を組み合わせると、複数の条件を順番に判定して枝分かれできます。</p>
<pre><code>if (条件1) {
    // 条件1がtrueのとき
} elseif (条件2) {
    // 条件1がfalseで、条件2がtrueのとき
} else {
    // どの条件もfalseのとき
}</code></pre>
<p>重要なのは、<strong>上から順に判定され、最初にtrueになったブロックだけが実行される</strong>ことです。1つ実行されたら残りの条件は見ません。そのため条件を書く順番が結果を左右します。</p>
<pre><code>$temperature = 32;
if ($temperature &gt;= 30) {
    echo "真夏日です";
} elseif ($temperature &gt;= 25) {
    echo "夏日です";      // 32は25以上でもあるが、ここは実行されない
} else {
    echo "過ごしやすい気温です";
}</code></pre>
<p>もし<code>$temperature &gt;= 25</code>を先に書くと、32度でも「夏日です」と表示されてしまいます。範囲で分岐するときは<strong>厳しい条件（狭い範囲）から先に</strong>書くのが基本です。なお、elseifは<code>else if</code>と2語で書いても動きますが、PHPでは<code>elseif</code>と1語で書くスタイルが一般的です。elseは省略でき、その場合はどの条件も満たさなければ何も実行されません。</p>`,
      task: `気温が25以上30未満のとき「夏日です」と表示されるように、elseifの分岐を追加してください。`,
      code: `<?php
$temperature = 28;

// TODO: ifとelseの間にelseifを追加して、25以上30未満なら「夏日です」と表示する
if ($temperature >= 30) {
    echo "真夏日です\\n";
} else {
    echo "過ごしやすい気温です\\n";
}
`,
      solution: `<?php
$temperature = 28;

// 厳しい条件（30以上）から順に判定する
if ($temperature >= 30) {
    echo "真夏日です\\n";
} elseif ($temperature >= 25) {
    echo "夏日です\\n";
} else {
    echo "過ごしやすい気温です\\n";
}
`,
      hints: [
        `30以上の判定が先に済んでいるので、elseifの時点で「30未満」は確定しています。追加する条件は25以上かどうかだけで十分です。`,
        `elseif ($temperature >= 25) { ... } をifブロックとelseブロックの間に挟みます。`
      ],
      expectedOutput: "夏日です"
    },
    {
      id: 23,
      title: "三項演算子とnull合体演算子??",
      explanation: `<p>単純な二択の分岐は、if文を使わず1行で書ける演算子があります。</p>
<h4>三項演算子（条件 ? A : B）</h4>
<p>条件がtrueならA、falseならBを返す演算子です。「値を選ぶ」場面で使うと簡潔に書けます。</p>
<pre><code>$stock = 3;
$label = $stock &gt; 0 ? "在庫あり" : "在庫なし";
echo $label;  // 在庫あり</code></pre>
<p>便利ですが、三項演算子の中に三項演算子を入れる（ネストする）と一気に読みにくくなるため、二択を超える分岐は素直にif文やmatch式（ステップ25）を使いましょう。</p>
<h4>null合体演算子（??）</h4>
<p><strong>null合体演算子</strong>（左側がnullまたは未定義のとき右側の値を返す<code>??</code>）は、「値がなければデフォルト値を使う」という頻出パターンを1行で書けます。</p>
<pre><code>$nickname = null;
$displayName = $nickname ?? "ゲスト";  // $nicknameがnullなので"ゲスト"</code></pre>
<table>
<tr><th>演算子</th><th>判定基準</th><th>用途</th></tr>
<tr><td><code>条件 ? A : B</code></td><td>条件式のtrue/false</td><td>二択の値選び</td></tr>
<tr><td><code>A ?? B</code></td><td>Aがnull・未定義かどうか</td><td>デフォルト値の設定</td></tr>
</table>
<p><code>??</code>は左側が未定義の変数や存在しない配列キーでもWarningを出さない特別な性質があり、実務で非常によく使われます（第4章で再登場します）。</p>`,
      task: `if文で書かれた在庫判定を三項演算子に書き換え、さらに<code>$nickname</code>がnullのとき「ゲスト」が使われるように<code>??</code>を使って<code>$displayName</code>を作ってください。`,
      code: `<?php
$stock = 3;

// TODO: このif文を三項演算子を使った1行に書き換えて$labelに代入する
if ($stock > 0) {
    $label = "在庫あり";
} else {
    $label = "在庫なし";
}
echo $label . "\\n";

$nickname = null;
// TODO: ??を使って、$nicknameがnullなら"ゲスト"を$displayNameに入れる
$displayName = "";
echo "ようこそ、" . $displayName . "さん\\n";
`,
      solution: `<?php
$stock = 3;

// 条件 ? trueのときの値 : falseのときの値
$label = $stock > 0 ? "在庫あり" : "在庫なし";
echo $label . "\\n";

$nickname = null;
// $nicknameがnullなので右側の"ゲスト"が使われる
$displayName = $nickname ?? "ゲスト";
echo "ようこそ、" . $displayName . "さん\\n";
`,
      hints: [
        `三項演算子は「条件 ? trueのときの値 : falseのときの値」の形です。条件は $stock > 0 です。`,
        `??は「左 ?? 右」と書き、左がnullなら右を返します。$nickname ?? "ゲスト" の結果を$displayNameに代入しましょう。`
      ],
      expectedOutput: "ようこそ、ゲストさん"
    },
    {
      id: 24,
      title: "switchの基本",
      explanation: `<p>1つの値を複数の候補と比べて分岐したいとき、elseifを並べる代わりに<strong>switch文</strong>が使えます。</p>
<pre><code>switch ($signal) {
    case "blue":
        echo "進め";
        break;
    case "yellow":
        echo "注意";
        break;
    default:
        echo "不明な信号";
}</code></pre>
<p>switchは<code>$signal</code>の値を上から各<code>case</code>と比較し、一致したcaseの処理を実行します。どのcaseにも一致しなければ<code>default</code>が実行されます。</p>
<h4>最重要：breakを忘れない</h4>
<p>caseの処理の最後には<strong>break</strong>（switchを抜ける命令）を書きます。breakを忘れると、一致したcase以降の処理が<strong>次のcaseに突き抜けて続けて実行されます</strong>。これを<strong>フォールスルー</strong>と呼び、switchのバグの定番です。</p>
<pre><code>case "yellow":
    echo "注意";
    // breakがないと、次のcase "red"の処理まで実行されてしまう
case "red":
    echo "止まれ";
    break;</code></pre>
<p>もう1つの注意点として、switchのcase比較は<strong>緩やかな比較（==相当）</strong>で行われます。<code>"1"</code>と<code>1</code>のように型が違っても一致と判定されることがあるため、厳密な比較が必要な場面では次のステップで学ぶmatch式が適しています。</p>`,
      task: `このコードを実行すると「注意」と「止まれ」が両方表示されてしまいます。原因（breakの書き忘れ）を修正して、「注意」だけが表示されるようにしてください。`,
      code: `<?php
$signal = "yellow";

// このswitchにはバグがあります。実行して出力を確認してから直しましょう
switch ($signal) {
    case "blue":
        echo "進め\\n";
        break;
    case "yellow":
        echo "注意\\n";
        // TODO: ここにbreakがないため、下のcaseまで実行されてしまう
    case "red":
        echo "止まれ\\n";
        break;
    default:
        echo "不明な信号\\n";
}
echo "判定完了\\n";
`,
      solution: `<?php
$signal = "yellow";

switch ($signal) {
    case "blue":
        echo "進め\\n";
        break;
    case "yellow":
        echo "注意\\n";
        break;
    case "red":
        echo "止まれ\\n";
        break;
    default:
        echo "不明な信号\\n";
}
echo "判定完了\\n";
`,
      hints: [
        `まず初期コードをそのまま実行して、「止まれ」まで表示される現象（フォールスルー）を観察しましょう。`,
        `case "yellow" の処理の最後に break; を追加すると、そこでswitchを抜けます。`
      ],
      expectedOutput: "注意"
    },
    {
      id: 25,
      title: "match式（PHP 8の新機能）",
      explanation: `<p>PHP 8で追加された<strong>match式</strong>は、switchの弱点を解消したモダンな分岐構文です。「文」ではなく「式」なので、<strong>結果を値として返し、そのまま変数に代入できます</strong>。</p>
<pre><code>$rank = "silver";
$discount = match ($rank) {
    "gold" =&gt; 20,
    "silver" =&gt; 10,
    "bronze" =&gt; 5,
    default =&gt; 0,
};
echo $discount;  // 10</code></pre>
<p>各分岐は「候補の値 <code>=&gt;</code> 返す値」の形で書き、カンマで区切ります。<code>"gold", "silver" =&gt; 20</code>のように複数の候補をまとめることもできます。</p>
<h4>switchとの違い</h4>
<table>
<tr><th>項目</th><th>switch</th><th>match</th></tr>
<tr><td>比較方法</td><td>緩やかな比較（==相当）</td><td><strong>厳密な比較（===相当）</strong></td></tr>
<tr><td>値を返す</td><td>返さない（文）</td><td><strong>返す（式）</strong></td></tr>
<tr><td>break</td><td>必要（忘れるとフォールスルー）</td><td><strong>不要（突き抜けない）</strong></td></tr>
<tr><td>一致なし＋defaultなし</td><td>何も起きない</td><td><strong>UnhandledMatchErrorが発生</strong></td></tr>
</table>
<p>「どのcaseにも当てはまらないのに気づかない」というswitchの静かなバグが、matchではエラーとして即座に表面化します。型まで含めて厳密に比較される点も安全です。値を選び分ける用途では、まずmatch式を検討するのが現代のPHPのスタイルです。</p>`,
      task: `switch文で書かれた割引率の判定を、match式を使った書き方に書き換えてください。出力が「割引率は10%です」になれば成功です。`,
      code: `<?php
$rank = "silver";

// TODO: このswitch文をmatch式に書き換えて$discountに代入する
switch ($rank) {
    case "gold":
        $discount = 20;
        break;
    case "silver":
        $discount = 10;
        break;
    case "bronze":
        $discount = 5;
        break;
    default:
        $discount = 0;
}
echo "割引率は" . $discount . "%です\\n";
`,
      solution: `<?php
$rank = "silver";

// match式は結果を値として返すので、そのまま代入できる
$discount = match ($rank) {
    "gold" => 20,
    "silver" => 10,
    "bronze" => 5,
    default => 0,
};
echo "割引率は" . $discount . "%です\\n";
`,
      hints: [
        `match式全体が1つの値になるので、$discount = match ($rank) { ... }; の形で書けます。`,
        `各分岐は "gold" => 20, のようにアロー（=>）とカンマで書きます。最後にdefault => 0, も忘れずに。閉じ波かっこの後のセミコロンが必要です。`
      ],
      expectedOutput: "割引率は10%です"
    },
    {
      id: 26,
      title: "whileループ",
      explanation: `<p>同じ処理を繰り返したいとき、コードをコピーして並べるのではなく<strong>ループ（繰り返し構文）</strong>を使います。<strong>while文</strong>は「条件がtrueである間、処理を繰り返す」最も基本的なループです。</p>
<pre><code>while (条件式) {
    // 条件式がtrueの間、繰り返し実行される処理
}</code></pre>
<p>whileは毎回、<strong>ブロックを実行する前に</strong>条件式を判定します。最初から条件がfalseなら、一度も実行されません。</p>
<pre><code>$count = 1;
while ($count &lt;= 3) {
    echo $count . "回目";
    $count++;  // $countを1増やす（$count = $count + 1 と同じ）
}</code></pre>
<p>このループの流れを追うと、(1) $countは1で条件true→「1回目」を表示し$countが2に、(2) 条件true→「2回目」、$countが3に、(3) 条件true→「3回目」、$countが4に、(4) 4 &lt;= 3はfalseなのでループ終了、となります。</p>
<h4>最重要：無限ループに注意</h4>
<p>ループ内で<code>$count++</code>のような<strong>条件を変化させる処理を忘れると、条件が永遠にtrueのままプログラムが止まらなくなります</strong>。これを無限ループと呼びます。whileを書くときは「何の変数が」「どう変化して」「いつ条件がfalseになるか」を必ず確認する習慣をつけましょう。</p>`,
      task: `条件式が間違っているため、ループが一度も実行されません。「1回目」から「5回目」まで表示されるように条件式を修正してください。`,
      code: `<?php
$count = 1;

// TODO: 条件式が間違っているのでループが1回も実行されない。5回繰り返すように直す
while ($count <= 0) {
    echo $count . "回目\\n";
    $count++;
}
echo "ループが終わりました\\n";
`,
      solution: `<?php
$count = 1;

// $countが5以下の間だけ繰り返す。$count++で毎回1ずつ増える
while ($count <= 5) {
    echo $count . "回目\\n";
    $count++;
}
echo "ループが終わりました\\n";
`,
      hints: [
        `$countは1から始まり、ループのたびに1ずつ増えます。「5回目」まで表示するには、$countがいくつ以下の間続ければよいでしょうか。`,
        `条件式を $count <= 5 に変えると、$countが6になった時点でループが終わります。`
      ],
      expectedOutput: "5回目"
    },
    {
      id: 27,
      title: "forループ",
      explanation: `<p>「回数が決まっている繰り返し」には<strong>for文</strong>が便利です。whileで別々の場所に書いていた「初期化」「条件」「更新」を1行にまとめて書けます。</p>
<pre><code>for (初期化; 条件式; 更新) {
    // 繰り返す処理
}</code></pre>
<table>
<tr><th>部分</th><th>実行タイミング</th><th>例</th></tr>
<tr><td>初期化</td><td>ループ開始前に1回だけ</td><td><code>$i = 1</code></td></tr>
<tr><td>条件式</td><td>毎回、処理の前に判定</td><td><code>$i &lt;= 10</code></td></tr>
<tr><td>更新</td><td>毎回、処理の後に実行</td><td><code>$i++</code></td></tr>
</table>
<pre><code>for ($i = 1; $i &lt;= 3; $i++) {
    echo $i . "番\\n";
}
// 1番 2番 3番 と表示される</code></pre>
<p>カウンタ変数には慣習的に<code>$i</code>（indexの頭文字）がよく使われます。whileと違い、カウンタの初期化と更新が1行に集まっているので<strong>更新忘れによる無限ループが起きにくい</strong>のが利点です。「N回繰り返す」「1からNまで処理する」ならfor、「回数が事前に分からない繰り返し」ならwhile、と使い分けるのが基本です。</p>
<p>forはカウンタを計算に使えるのも強力です。例えば1から10までの合計は、合計用の変数を用意してループ内で足し込むことで求められます。この「アキュムレータ（累積用変数）パターン」は集計処理の基本形として頻出します。</p>`,
      task: `forループの条件式を修正して、1から10までの整数の合計を求めてください。出力が「合計は55です」になれば成功です。`,
      code: `<?php
$sum = 0;

// TODO: 今は1回しか繰り返されない。条件式を直して1から10まで繰り返す
for ($i = 1; $i <= 1; $i++) {
    $sum = $sum + $i;
}
echo "合計は" . $sum . "です\\n";
`,
      solution: `<?php
$sum = 0;

// $iを1から10まで動かし、毎回$sumに足し込む
for ($i = 1; $i <= 10; $i++) {
    $sum = $sum + $i;
}
echo "合計は" . $sum . "です\\n";
`,
      hints: [
        `forの3つの部分のうち「条件式」が繰り返し回数を決めています。$iがいくつ以下の間続ければ10回繰り返せるでしょうか。`,
        `for ($i = 1; $i <= 10; $i++) { ... } の形になります。ループ内はそのままで動きます。`
      ],
      expectedOutput: "合計は55です"
    },
    {
      id: 28,
      title: "breakとcontinue",
      explanation: `<p>ループの流れを途中で変える命令が2つあります。switchで登場した<strong>break</strong>と、新しく学ぶ<strong>continue</strong>です。</p>
<table>
<tr><th>命令</th><th>動き</th><th>イメージ</th></tr>
<tr><td><code>break</code></td><td>ループ自体を<strong>即座に終了</strong>する</td><td>「もうやめる」</td></tr>
<tr><td><code>continue</code></td><td>今回の周回だけを打ち切り、<strong>次の周回へ進む</strong></td><td>「今回はスキップ」</td></tr>
</table>
<pre><code>for ($i = 1; $i &lt;= 5; $i++) {
    if ($i === 3) {
        continue;  // $iが3のときだけ、下のechoを飛ばして次の周回へ
    }
    if ($i === 5) {
        break;     // $iが5になったらループ自体を終了
    }
    echo $i . "\\n";
}
// 出力：1 2 4（3はスキップ、5で終了）</code></pre>
<p>典型的な使い方として、breakは「探していたものが見つかったら、それ以上探さない」、continueは「条件に合わないデータを読み飛ばす」場面で活躍します。無駄な周回を減らせるため、パフォーマンスの観点でも重要です。</p>
<p>注意点として、continueをforで使った場合も<strong>更新部（<code>$i++</code>）はきちんと実行されてから</strong>次の判定に進みます。一方whileでcontinueを使うと、continueより下に書いたカウンタ更新が飛ばされて無限ループになることがあるため、whileとcontinueの組み合わせは特に慎重に書きましょう。</p>`,
      task: `1から10のループで、(1)偶数のときは<code>continue</code>でスキップし、(2)<code>$i</code>が9になったら<code>break</code>で終了するようにTODOを埋めてください。「番号1」「番号3」「番号5」「番号7」だけが表示されれば成功です。`,
      code: `<?php
for ($i = 1; $i <= 10; $i++) {
    if ($i % 2 === 0) {
        // TODO: 偶数のときは表示せず次の周回へ進む命令を書く
    }
    if ($i === 9) {
        // TODO: 9になったらループを終了する命令を書く
    }
    echo "番号" . $i . "\\n";
}
echo "ループ終了\\n";
`,
      solution: `<?php
for ($i = 1; $i <= 10; $i++) {
    if ($i % 2 === 0) {
        // 偶数はスキップして次の周回へ
        continue;
    }
    if ($i === 9) {
        // 9に達したらループ自体を終了
        break;
    }
    echo "番号" . $i . "\\n";
}
echo "ループ終了\\n";
`,
      hints: [
        `「今回だけ飛ばす」のがcontinue、「ループごと終わらせる」のがbreakです。どちらをどこに書くか整理しましょう。`,
        `1つ目のTODOには continue; を、2つ目のTODOには break; を書きます。`
      ],
      expectedOutput: "番号7"
    },
    {
      id: 29,
      title: "ネストしたループとbreak 2",
      explanation: `<p>ループの中にループを書くことを<strong>ネスト（入れ子）</strong>と呼びます。表形式のデータ処理や総当たりの探索など、実務でも頻出のパターンです。</p>
<pre><code>for ($i = 1; $i &lt;= 3; $i++) {        // 外側ループ
    for ($j = 1; $j &lt;= 3; $j++) {    // 内側ループ
        echo $i . "-" . $j . " ";
    }
    echo "\\n";
}
// 1-1 1-2 1-3
// 2-1 2-2 2-3
// 3-1 3-2 3-3</code></pre>
<p>外側が1周する間に、内側は最後まで回りきります。3×3なら内側の処理は合計9回実行されます。</p>
<h4>break 2：外側のループまで一気に抜ける</h4>
<p>ネストの内側で<code>break</code>と書くと、抜けられるのは<strong>内側のループだけ</strong>です。外側のループまでまとめて抜けたいときは、PHPでは<strong>breakに数値を付けて<code>break 2;</code></strong>と書けます（2は「2階層分抜ける」の意味）。</p>
<pre><code>break 2;     // 内側と外側、2つのループを同時に抜ける
continue 2;  // 外側ループの次の周回まで一気にスキップ</code></pre>
<p>多くの言語ではフラグ変数を使って外側ループを止める必要がありますが、PHPはこの数値指定で簡潔に書けます。ただし3階層以上を一気に抜けるようなコードは追いづらくなるため、ネストが深くなりすぎたら設計を見直すサインと考えましょう。</p>`,
      task: `九九の表（1〜5の範囲）から、積がちょうど12になる最初の組み合わせを探します。見つかったら内側・外側の両方のループを一度に抜けるように、TODOの箇所を書き換えてください。`,
      code: `<?php
for ($i = 1; $i <= 5; $i++) {
    for ($j = 1; $j <= 5; $j++) {
        if ($i * $j === 12) {
            echo $i . "×" . $j . "=12を発見\\n";
            // TODO: 内側だけでなく外側のループも一緒に抜けるように書き換える
            break;
        }
    }
}
echo "探索終了\\n";
`,
      solution: `<?php
for ($i = 1; $i <= 5; $i++) {
    for ($j = 1; $j <= 5; $j++) {
        if ($i * $j === 12) {
            echo $i . "×" . $j . "=12を発見\\n";
            // 2階層分のループを一度に抜ける
            break 2;
        }
    }
}
echo "探索終了\\n";
`,
      hints: [
        `ただのbreakでは内側のループしか抜けられず、外側の$iが4、5のときにも探索が続いてしまいます（3×4と4×3の両方が見つかることを初期コードで確認してみましょう）。`,
        `breakのあとに抜けたい階層数を書きます。2階層なら break 2; です。`
      ],
      expectedOutput: "3×4=12を発見"
    },
    {
      id: 30,
      title: "総合演習：FizzBuzz",
      explanation: `<p>第3章の総仕上げとして、プログラミングの古典的な練習問題<strong>FizzBuzz</strong>に挑戦します。ルールは次の通りです。</p>
<ol>
<li>1から30までの整数を順に処理する</li>
<li>3の倍数のときは数の代わりに「Fizz」と表示する</li>
<li>5の倍数のときは「Buzz」と表示する</li>
<li>3と5両方の倍数（＝15の倍数）のときは「FizzBuzz」と表示する</li>
<li>どれでもなければ数をそのまま表示する</li>
</ol>
<p>使う道具はすべて学習済みです。倍数の判定には剰余演算子<code>%</code>（割り算の余りを求める）を使います。<code>$i % 3 === 0</code>なら3の倍数です。</p>
<h4>この問題の落とし穴：判定の順番</h4>
<p>if〜elseifは「最初にtrueになった分岐だけが実行される」ことを思い出してください。もし3の倍数の判定を最初に書くと、15はまず3の倍数として引っかかり、「Fizz」と表示されて終わってしまいます。</p>
<pre><code>// 誤った順番の例
if ($i % 3 === 0) {          // 15はここでtrueになってしまう
    echo "Fizz";
} elseif ($i % 15 === 0) {   // ここには永遠に到達しない
    echo "FizzBuzz";
}</code></pre>
<p><strong>最も条件が厳しい「15の倍数」を最初に判定する</strong>のが正解です。ステップ22で学んだ「厳しい条件から先に書く」原則の実践になります。小さな問題ですが、ループ・条件分岐・演算子・判定順序と、この章の学びが凝縮されています。</p>`,
      task: `1から30までのFizzBuzzを完成させてください。3の倍数は「Fizz」、5の倍数は「Buzz」、15の倍数は「FizzBuzz」、それ以外は数字を表示します。判定の順番に注意しましょう。`,
      code: `<?php
for ($i = 1; $i <= 30; $i++) {
    // TODO: ここにif〜elseif〜elseを書いてFizzBuzzを完成させる
    // 3の倍数→Fizz、5の倍数→Buzz、15の倍数→FizzBuzz、それ以外→数字
    echo $i . "\\n";
}
`,
      solution: `<?php
for ($i = 1; $i <= 30; $i++) {
    // 最も厳しい条件（15の倍数）から先に判定する
    if ($i % 15 === 0) {
        echo "FizzBuzz\\n";
    } elseif ($i % 3 === 0) {
        echo "Fizz\\n";
    } elseif ($i % 5 === 0) {
        echo "Buzz\\n";
    } else {
        echo $i . "\\n";
    }
}
`,
      hints: [
        `「3と5両方の倍数」は「15の倍数」と同じです。$i % 15 === 0 で判定できます。`,
        `if ($i % 15 === 0) を最初に書き、次にelseifで3の倍数、5の倍数、最後にelseで数字を表示します。`,
        `elseifの順番を入れ替えて実行し、15の行の出力がどう変わるか観察すると理解が深まります。`
      ],
      expectedOutput: "FizzBuzz"
    }
  ]
});
