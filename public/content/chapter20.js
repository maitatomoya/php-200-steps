// 第20章：総合演習
registerChapter({
  number: 20,
  title: "総合演習",
  description: "第1〜19章で学んだ知識を組み合わせて、実践的な10個のプログラムを完成させる卒業演習です。",
  steps: [
    {
      id: 191,
      title: "じゃんけん判定（enum＋match）",
      explanation: `<p>総合演習の最初の課題は、じゃんけんの勝敗判定です。<strong>enum（列挙型）の章</strong>と<strong>match式の章</strong>の知識を組み合わせます。</p>
<p>設計の考え方から整理しましょう。じゃんけんの手は「グー・チョキ・パーの3種類しかない」値です。このように取りうる値が有限個に決まっているものは、文字列や数値ではなく<strong>enumで表現する</strong>のが現代PHPの定石です。文字列<code>'グー'</code>で扱うとタイプミスがバグになりますが、<code>Hand::Rock</code>ならタイプミスは実行前にエラーとして検出できます。</p>
<pre><code>enum Hand: string
{
    case Rock = 'グー';
    case Scissors = 'チョキ';
    case Paper = 'パー';
}</code></pre>
<p>次に勝敗ロジックです。「自分の手と相手の手の組み合わせ」で結果が決まるので、条件の列挙には<code>match (true)</code>パターンが向いています。これは各アームに真偽値の条件式を書き、最初にtrueになったアームの値を返す書き方でした。</p>
<pre><code>return match (true) {
    $me === Hand::Rock &amp;&amp; $opponent === Hand::Scissors =&gt; '勝ち',
    // 勝ちパターンをカンマ区切りで列挙できる
    default =&gt; '負け',
};</code></pre>
<p>あいこ（同じ手同士）は3通りの組み合わせを列挙するより、<strong>最初に<code>$me === $opponent</code>で早期リターン</strong>するほうがシンプルです。enum同士は<code>===</code>で比較できることを思い出してください。「特殊なケースを先に片付けてから本命のロジックに入る」という設計は、あらゆる判定処理で使える考え方です。</p>`,
      task: `<code>judge()</code>関数のTODO部分を実装してください。あいこの早期リターンと、<code>match (true)</code>による勝ちパターンの列挙（勝ち3通り、それ以外はdefaultで負け）を書きます。`,
      code: `<?php
// じゃんけんの手を表すenum
enum Hand: string
{
    case Rock = 'グー';
    case Scissors = 'チョキ';
    case Paper = 'パー';
}

/**
 * 自分の手と相手の手から勝敗を判定する
 * 戻り値：'勝ち'・'負け'・'あいこ'のいずれか
 */
function judge(Hand $me, Hand $opponent): string
{
    // TODO: 同じ手ならあいこを返す（早期リターン）

    // TODO: match (true) で勝ちパターン3通りを列挙し、
    // 該当すれば'勝ち'、defaultで'負け'を返す
    // 勝ちパターン：グーvsチョキ、チョキvsパー、パーvsグー
    return '';
}

$matches = [
    [Hand::Rock, Hand::Scissors],
    [Hand::Paper, Hand::Paper],
    [Hand::Scissors, Hand::Rock],
];

foreach ($matches as [$me, $opponent]) {
    echo $me->value . ' vs ' . $opponent->value . ' → ' . judge($me, $opponent) . "\\n";
}
`,
      solution: `<?php
// じゃんけんの手を表すenum
enum Hand: string
{
    case Rock = 'グー';
    case Scissors = 'チョキ';
    case Paper = 'パー';
}

/**
 * 自分の手と相手の手から勝敗を判定する
 * 戻り値：'勝ち'・'負け'・'あいこ'のいずれか
 */
function judge(Hand $me, Hand $opponent): string
{
    // 特殊なケース（あいこ）を先に片付ける
    if ($me === $opponent) {
        return 'あいこ';
    }

    // 勝ちパターンだけを列挙し、それ以外は負け
    return match (true) {
        $me === Hand::Rock && $opponent === Hand::Scissors,
        $me === Hand::Scissors && $opponent === Hand::Paper,
        $me === Hand::Paper && $opponent === Hand::Rock => '勝ち',
        default => '負け',
    };
}

$matches = [
    [Hand::Rock, Hand::Scissors],
    [Hand::Paper, Hand::Paper],
    [Hand::Scissors, Hand::Rock],
];

foreach ($matches as [$me, $opponent]) {
    echo $me->value . ' vs ' . $opponent->value . ' → ' . judge($me, $opponent) . "\\n";
}
`,
      hints: [
        `enum同士の比較は$me === $opponentでできます。あいこ判定を関数の先頭に置きましょう。`,
        `match (true)の1つのアームには、条件をカンマで区切って複数並べられます。勝ち3条件をまとめて'勝ち'に対応させると簡潔です。`,
        `勝ち条件の1つは $me === Hand::Rock && $opponent === Hand::Scissors です。残り2つも同じ形で書けます。`
      ],
      expectedOutput: "グー vs チョキ → 勝ち"
    },
    {
      id: 192,
      title: "成績集計（配列関数）",
      explanation: `<p>この課題では<strong>配列の章</strong>で学んだ集計関数と、<strong>関数の章</strong>で学んだアロー関数を組み合わせて、テストの成績を多角的に集計します。素朴に書けばforeachとif の連続になる処理が、配列関数を使うと「何をしたいか」が読み取りやすい宣言的なコードになります。</p>
<p>今回使う道具を整理します。</p>
<table>
<tr><th>関数</th><th>役割</th></tr>
<tr><td><code>array_sum()</code></td><td>全要素の合計</td></tr>
<tr><td><code>count()</code></td><td>要素数</td></tr>
<tr><td><code>array_filter()</code></td><td>条件を満たす要素だけ残す</td></tr>
<tr><td><code>max()</code></td><td>最大値</td></tr>
<tr><td><code>array_search()</code></td><td>値からキーを逆引きする</td></tr>
</table>
<p>設計のポイントは2つあります。1つ目は「平均点」を<code>array_sum($scores) / count($scores)</code>と、既存の関数の組み合わせで表現することです。2つ目は「最高点の科目名」の求め方で、<code>max()</code>で最高点を出してから<code>array_search()</code>でその値を持つキー（科目名）を逆引きします。</p>
<pre><code>$best = array_search(max($scores), $scores, true);</code></pre>
<p><code>array_search()</code>の第3引数<code>true</code>は厳密な比較（型まで一致）を行う指定で、思わぬ型変換による誤検出を防ぐため常に付ける習慣にしましょう。</p>
<p><code>array_filter()</code>に渡す条件はアロー関数<code>fn (int $score): bool =&gt; $score &gt;= 60</code>で書きます。連想配列に<code>array_filter()</code>を適用しても<strong>キー（科目名）は保持される</strong>ため、あとから合格科目名と点数をセットで表示できる点も重要です。</p>`,
      task: `TODO部分を実装してください。<code>array_filter()</code>とアロー関数で60点以上の科目を<code>$passed</code>に抽出し、<code>max()</code>と<code>array_search()</code>で最高点の科目名を<code>$best</code>に求めます。`,
      code: `<?php
$scores = ['国語' => 78, '数学' => 92, '英語' => 65, '理科' => 48, '社会' => 80];

// 平均点（完成例）
$average = array_sum($scores) / count($scores);

// TODO: array_filterとアロー関数で60点以上の科目だけを$passedに抽出する
$passed = [];

// TODO: maxとarray_search（第3引数true）で最高点の科目名を$bestに求める
$best = '';

echo '平均点: ' . sprintf('%.1f', $average) . "\\n";
echo '合格科目数: ' . count($passed) . "\\n";
echo '最高点: ' . $best . '(' . max($scores) . '点)' . "\\n";
foreach ($passed as $subject => $score) {
    echo '合格: ' . $subject . ' ' . $score . '点' . "\\n";
}
`,
      solution: `<?php
$scores = ['国語' => 78, '数学' => 92, '英語' => 65, '理科' => 48, '社会' => 80];

// 平均点
$average = array_sum($scores) / count($scores);

// 60点以上の科目だけを抽出する（キー＝科目名は保持される）
$passed = array_filter($scores, fn (int $score): bool => $score >= 60);

// 最高点の値をmaxで求め、array_searchでキー（科目名）を逆引きする
$best = array_search(max($scores), $scores, true);

echo '平均点: ' . sprintf('%.1f', $average) . "\\n";
echo '合格科目数: ' . count($passed) . "\\n";
echo '最高点: ' . $best . '(' . max($scores) . '点)' . "\\n";
foreach ($passed as $subject => $score) {
    echo '合格: ' . $subject . ' ' . $score . '点' . "\\n";
}
`,
      hints: [
        `array_filter($scores, 条件のアロー関数)の形です。条件は「点数が60以上ならtrue」です。`,
        `アロー関数は fn (int $score): bool => $score >= 60 と書きます。`,
        `最高点の科目名は array_search(max($scores), $scores, true) で求められます。`
      ],
      expectedOutput: "平均点: 72.6"
    },
    {
      id: 193,
      title: "在庫管理（クラス＋連想配列）",
      explanation: `<p>この課題は<strong>クラスの章</strong>と<strong>連想配列の章</strong>の組み合わせです。「在庫データ（連想配列）」を「操作するルール（メソッド）」と一緒にクラスへ閉じ込める、<strong>カプセル化</strong>の実践です。</p>
<p>なぜクラスにするのでしょうか。在庫をただの連想配列として持つと、コードのどこからでも<code>$items['りんご'] = -100;</code>のような不正な書き換えができてしまいます。プロパティを<code>private</code>にしてメソッド経由でのみ操作させれば、「在庫はマイナスにならない」というルールをクラスが保証できます。</p>
<pre><code>class Inventory
{
    /** @var array&lt;string, int&gt; 商品名 =&gt; 在庫数 */
    private array $items = [];
}</code></pre>
<p>設計のポイントは<code>remove()</code>（出庫）メソッドです。在庫が足りない場合にどうするかは設計判断ですが、今回は<strong>boolを返して成否を呼び出し側に伝える</strong>方式にします。</p>
<ol>
<li>現在の在庫数を取得する（未登録の商品は<code>?? 0</code>で0扱い）</li>
<li>出庫数が在庫を超えていたら、何もせずfalseを返す</li>
<li>問題なければ在庫を減らしてtrueを返す</li>
</ol>
<p>「<strong>チェックしてから変更する</strong>」という順序が重要です。変更してからエラーに気づいても、データはすでに壊れています。この「不変条件（常に守られるべきルール）を先に検証してから状態を変更する」パターンは、銀行口座の残高、座席の予約数など、あらゆる業務システムに現れる基本形です。</p>`,
      task: `<code>Inventory</code>クラスの<code>remove()</code>メソッドを実装してください。在庫が足りなければ何もせずfalseを返し、足りていれば在庫を減らしてtrueを返します。`,
      code: `<?php
class Inventory
{
    /** @var array<string, int> 商品名 => 在庫数 */
    private array $items = [];

    /**
     * 入庫する。既存の商品なら数量を加算する
     */
    public function add(string $name, int $qty): void
    {
        $current = $this->items[$name] ?? 0;
        $this->items[$name] = $current + $qty;
    }

    /**
     * 出庫する。在庫が足りなければfalseを返し、在庫は変更しない
     */
    public function remove(string $name, int $qty): bool
    {
        // TODO: 現在の在庫数（未登録なら0）を取得し、
        // $qtyが在庫を超えていればfalseを返す
        // 問題なければ在庫を減らしてtrueを返す
        return false;
    }

    /**
     * 在庫の一覧を出力する
     */
    public function report(): void
    {
        foreach ($this->items as $name => $qty) {
            echo $name . ': ' . $qty . '個' . "\\n";
        }
    }
}

$inventory = new Inventory();
$inventory->add('りんご', 10);
$inventory->add('みかん', 5);
$inventory->remove('りんご', 3);

if (!$inventory->remove('みかん', 100)) {
    echo '出庫失敗: みかんの在庫が足りません' . "\\n";
}

$inventory->report();
`,
      solution: `<?php
class Inventory
{
    /** @var array<string, int> 商品名 => 在庫数 */
    private array $items = [];

    /**
     * 入庫する。既存の商品なら数量を加算する
     */
    public function add(string $name, int $qty): void
    {
        $current = $this->items[$name] ?? 0;
        $this->items[$name] = $current + $qty;
    }

    /**
     * 出庫する。在庫が足りなければfalseを返し、在庫は変更しない
     */
    public function remove(string $name, int $qty): bool
    {
        $current = $this->items[$name] ?? 0;
        // 先に検証してから状態を変更する
        if ($qty > $current) {
            return false;
        }
        $this->items[$name] = $current - $qty;
        return true;
    }

    /**
     * 在庫の一覧を出力する
     */
    public function report(): void
    {
        foreach ($this->items as $name => $qty) {
            echo $name . ': ' . $qty . '個' . "\\n";
        }
    }
}

$inventory = new Inventory();
$inventory->add('りんご', 10);
$inventory->add('みかん', 5);
$inventory->remove('りんご', 3);

if (!$inventory->remove('みかん', 100)) {
    echo '出庫失敗: みかんの在庫が足りません' . "\\n";
}

$inventory->report();
`,
      hints: [
        `add()と同じように $this->items[$name] ?? 0 で現在の在庫数を取り出すところから始めましょう。`,
        `「if ($qty > $current) { return false; }」で先に失敗ケースを弾き、そのあとで在庫を減らします。`
      ],
      expectedOutput: "りんご: 7個"
    },
    {
      id: 194,
      title: "テキスト統計（文字列関数＋配列）",
      explanation: `<p>この課題は<strong>文字列の章</strong>と<strong>配列の章</strong>の合わせ技です。英文テキストから「単語数」「文字数」「最長の単語」「特定の単語の出現回数」を求めます。テキスト解析は検索エンジンやログ集計の最小単位となる、実務頻出の処理です。</p>
<p>解き方の全体像は「<strong>文字列を配列に変換してから、配列の道具で集計する</strong>」ことです。文字列のままでは数えにくくても、<code>explode(' ', $text)</code>で単語の配列にしてしまえば、あとは配列関数の世界で戦えます。</p>
<table>
<tr><th>求めるもの</th><th>使う道具</th></tr>
<tr><td>単語数</td><td><code>explode()</code>＋<code>count()</code></td></tr>
<tr><td>文字数（スペース除く）</td><td><code>str_replace()</code>＋<code>strlen()</code></td></tr>
<tr><td>最長の単語</td><td>foreachで比較しながら更新</td></tr>
<tr><td>出現回数</td><td><code>array_map()</code>＋<code>array_count_values()</code></td></tr>
</table>
<p>「最長の単語」は、空文字を初期値にして<strong>より長い単語が見つかるたびに更新する</strong>という、最大値探索の定番パターンで求めます。</p>
<pre><code>$longest = '';
foreach ($words as $word) {
    if (strlen($word) &gt; strlen($longest)) {
        $longest = $word;
    }
}</code></pre>
<p>出現回数の集計では、大文字小文字の揺れ（TheとTheの区別）を<code>array_map('strtolower', $words)</code>で先に吸収してから、<code>array_count_values()</code>（値ごとの出現回数を連想配列で返す関数）に渡します。「<strong>正規化してから集計する</strong>」という順序も、データ処理全般に通じる考え方です。</p>`,
      task: `TODO部分を実装してください。foreachで最長の単語を<code>$longest</code>に求め、<code>array_map()</code>と<code>array_count_values()</code>で小文字化した単語の出現回数<code>$counts</code>を作ります。`,
      code: `<?php
$text = 'The quick brown fox jumps over the lazy dog';

// 単語の配列に分解する（完成例）
$words = explode(' ', $text);
$wordCount = count($words);

// スペースを除いた文字数（完成例）
$charCount = strlen(str_replace(' ', '', $text));

// TODO: foreachで$wordsを走査し、最長の単語を$longestに求める
$longest = '';

// TODO: array_mapで全単語を小文字化し、array_count_valuesで
// 単語 => 出現回数 の連想配列$countsを作る
$counts = [];

echo '単語数: ' . $wordCount . "\\n";
echo '文字数(スペース除く): ' . $charCount . "\\n";
echo '最長の単語: ' . $longest . "\\n";
echo 'theの出現回数: ' . $counts['the'] . "\\n";
`,
      solution: `<?php
$text = 'The quick brown fox jumps over the lazy dog';

// 単語の配列に分解する
$words = explode(' ', $text);
$wordCount = count($words);

// スペースを除いた文字数
$charCount = strlen(str_replace(' ', '', $text));

// 最長の単語：より長い単語が見つかるたびに更新する
$longest = '';
foreach ($words as $word) {
    if (strlen($word) > strlen($longest)) {
        $longest = $word;
    }
}

// 大文字小文字を正規化してから出現回数を数える
$counts = array_count_values(array_map('strtolower', $words));

echo '単語数: ' . $wordCount . "\\n";
echo '文字数(スペース除く): ' . $charCount . "\\n";
echo '最長の単語: ' . $longest . "\\n";
echo 'theの出現回数: ' . $counts['the'] . "\\n";
`,
      hints: [
        `最長単語の探索は「if (strlen($word) > strlen($longest))なら$longestを$wordで置き換える」の繰り返しです。`,
        `array_mapの第1引数には組み込み関数を文字列で渡せます：array_map('strtolower', $words)`,
        `その結果をそのままarray_count_values()に渡すと、単語 => 回数 の連想配列になります。`
      ],
      expectedOutput: "単語数: 9"
    },
    {
      id: 195,
      title: "例外処理付き計算パイプライン",
      explanation: `<p>この課題は<strong>例外処理の章</strong>の総仕上げです。「文字列を整数に変換 → 割り算 → 結果を出力」という多段階の処理（パイプライン）を作り、どの段階で失敗しても適切なエラーメッセージで回復できるようにします。</p>
<p>設計の考え方は「<strong>各関数は自分の仕事の失敗を例外で報告し、まとめ役が捕まえる</strong>」です。</p>
<table>
<tr><th>関数</th><th>役割</th><th>失敗時に投げる例外</th></tr>
<tr><td><code>parseNumber()</code></td><td>文字列を整数に変換</td><td><code>InvalidArgumentException</code></td></tr>
<tr><td><code>divide()</code></td><td>割り算</td><td><code>DivisionByZeroError</code></td></tr>
<tr><td><code>runPipeline()</code></td><td>全体を実行しtry-catchで捕捉</td><td>（捕まえる側）</td></tr>
</table>
<p>ポイントは<strong>例外の型で失敗の種類を区別する</strong>ことです。catchブロックは上から順に型が照合されるので、型ごとに違うメッセージを出せます。</p>
<pre><code>try {
    // 変換 → 計算 → 出力
} catch (InvalidArgumentException $e) {
    echo '入力エラー: ' . $e-&gt;getMessage();
} catch (DivisionByZeroError $e) {
    echo '計算エラー: ' . $e-&gt;getMessage();
} finally {
    echo '--- 処理終了 ---';
}</code></pre>
<p><code>finally</code>ブロックは成功しても失敗しても必ず実行されるため、「処理の終了ログ」のような後始末に使います。また、例外が便利なのは<strong>途中の関数が失敗した瞬間、残りの処理を飛ばしてcatchまで一気に抜ける</strong>ことです。ifとreturnでエラーを伝搬させる書き方と比べて、正常系のコードがまっすぐ読めるようになります。</p>`,
      task: `<code>runPipeline()</code>のTODO部分を実装してください。try内で変換・計算・出力を行い、<code>InvalidArgumentException</code>と<code>DivisionByZeroError</code>を別々のcatchで捕まえ、finallyで終了メッセージを出します。`,
      code: `<?php
/**
 * 文字列を整数に変換する。できなければInvalidArgumentExceptionを投げる
 */
function parseNumber(string $input): int
{
    $number = filter_var($input, FILTER_VALIDATE_INT);
    if ($number === false) {
        throw new InvalidArgumentException('整数として解釈できません: ' . $input);
    }
    return $number;
}

/**
 * 割り算をする。0で割ろうとしたらDivisionByZeroErrorを投げる
 */
function divide(int $a, int $b): float
{
    if ($b === 0) {
        throw new DivisionByZeroError('0では割れません');
    }
    return $a / $b;
}

/**
 * 変換 → 計算 → 出力のパイプラインを実行する
 */
function runPipeline(string $left, string $right): void
{
    // TODO: tryの中で parseNumber → divide の順に実行し、
    // 「100 / 4 = 25」の形式で結果を出力する
    // catch (InvalidArgumentException) → 「入力エラー: メッセージ」
    // catch (DivisionByZeroError) → 「計算エラー: メッセージ」
    // finally → 「--- 処理終了 ---」を必ず出力する
}

runPipeline('100', '4');
runPipeline('100', '0');
runPipeline('abc', '4');
`,
      solution: `<?php
/**
 * 文字列を整数に変換する。できなければInvalidArgumentExceptionを投げる
 */
function parseNumber(string $input): int
{
    $number = filter_var($input, FILTER_VALIDATE_INT);
    if ($number === false) {
        throw new InvalidArgumentException('整数として解釈できません: ' . $input);
    }
    return $number;
}

/**
 * 割り算をする。0で割ろうとしたらDivisionByZeroErrorを投げる
 */
function divide(int $a, int $b): float
{
    if ($b === 0) {
        throw new DivisionByZeroError('0では割れません');
    }
    return $a / $b;
}

/**
 * 変換 → 計算 → 出力のパイプラインを実行する
 */
function runPipeline(string $left, string $right): void
{
    try {
        $a = parseNumber($left);
        $b = parseNumber($right);
        $result = divide($a, $b);
        echo $left . ' / ' . $right . ' = ' . $result . "\\n";
    } catch (InvalidArgumentException $e) {
        echo '入力エラー: ' . $e->getMessage() . "\\n";
    } catch (DivisionByZeroError $e) {
        echo '計算エラー: ' . $e->getMessage() . "\\n";
    } finally {
        echo '--- 処理終了 ---' . "\\n";
    }
}

runPipeline('100', '4');
runPipeline('100', '0');
runPipeline('abc', '4');
`,
      hints: [
        `構造は try { 正常系 } catch (型1 $e) { ... } catch (型2 $e) { ... } finally { ... } です。`,
        `正常系は$aと$bをparseNumberで作り、divide($a, $b)の結果を出力するだけです。失敗時の分岐はcatchに任せます。`,
        `エラーメッセージは$e->getMessage()で取り出せます。`
      ],
      expectedOutput: "計算エラー: 0では割れません"
    },
    {
      id: 196,
      title: "図書館の貸出管理（クラス＋enum）",
      explanation: `<p>この課題は<strong>クラスの章</strong>と<strong>enumの章</strong>を組み合わせた、状態管理の演習です。本の状態（貸出可・貸出中）をenumで表し、Libraryクラスが貸出のルールを守らせます。</p>
<p>まず「状態」をenumにする理由です。もし<code>$isBorrowed</code>のようなbool型で持つと、将来「予約中」「修理中」など状態が増えたとき破綻します。enumなら状態の種類が型として明示され、増えた状態への対応漏れもmatch式などで検出しやすくなります。</p>
<pre><code>enum BookStatus: string
{
    case Available = '貸出可';
    case Borrowed = '貸出中';
}</code></pre>
<p>Bookクラスでは、コンストラクタプロモーション（コンストラクタ引数にアクセス修飾子を付けるとプロパティ宣言と代入が同時にできる記法）を使います。タイトルは変わらないので<code>readonly</code>、状態は変わるので通常のプロパティです。「<strong>変わらないものはreadonly、変わるものだけ可変にする</strong>」という使い分けが設計の質を上げます。</p>
<p>本題の<code>borrow()</code>メソッドは、貸出の業務ルールをそのまま条件分岐に写し取ります。</p>
<ol>
<li>本が存在しなければ「見つかりません」</li>
<li>すでに貸出中なら「貸出不可」</li>
<li>どちらでもなければ状態をBorrowedに変えて「貸出成功」</li>
</ol>
<p>失敗ケースを先に弾いていく<strong>ガード節</strong>のスタイルで書くと、最後に残るのが正常系だけになり読みやすくなります。在庫管理（ステップ193）と同じ「検証してから状態を変える」構造であることにも気づけると、設計パターンとして身についてきた証拠です。</p>`,
      task: `<code>Library</code>クラスの<code>borrow()</code>メソッドを実装してください。存在しない本・貸出中の本を先にガード節で弾き、最後に状態を<code>BookStatus::Borrowed</code>へ変更して成功メッセージを返します。`,
      code: `<?php
// 本の状態を表すenum
enum BookStatus: string
{
    case Available = '貸出可';
    case Borrowed = '貸出中';
}

class Book
{
    public function __construct(
        public readonly string $title,
        public BookStatus $status = BookStatus::Available,
    ) {
    }
}

class Library
{
    /** @var array<string, Book> タイトル => Book */
    private array $books = [];

    public function addBook(Book $book): void
    {
        $this->books[$book->title] = $book;
    }

    /**
     * 本を借りる。結果メッセージを返す
     */
    public function borrow(string $title): string
    {
        // TODO: 本が存在しなければ '見つかりません: ' . $title を返す
        // TODO: statusがBorrowedなら '貸出不可: ' . $title . 'は貸出中です' を返す
        // TODO: statusをBorrowedに変更し '貸出成功: ' . $title を返す
        return '';
    }

    public function report(): void
    {
        foreach ($this->books as $book) {
            echo $book->title . ' [' . $book->status->value . ']' . "\\n";
        }
    }
}

$library = new Library();
$library->addBook(new Book('PHP入門'));
$library->addBook(new Book('データベース設計'));

echo $library->borrow('PHP入門') . "\\n";
echo $library->borrow('PHP入門') . "\\n";
echo $library->borrow('存在しない本') . "\\n";
$library->report();
`,
      solution: `<?php
// 本の状態を表すenum
enum BookStatus: string
{
    case Available = '貸出可';
    case Borrowed = '貸出中';
}

class Book
{
    public function __construct(
        public readonly string $title,
        public BookStatus $status = BookStatus::Available,
    ) {
    }
}

class Library
{
    /** @var array<string, Book> タイトル => Book */
    private array $books = [];

    public function addBook(Book $book): void
    {
        $this->books[$book->title] = $book;
    }

    /**
     * 本を借りる。結果メッセージを返す
     */
    public function borrow(string $title): string
    {
        // ガード節：失敗ケースを先に弾く
        if (!isset($this->books[$title])) {
            return '見つかりません: ' . $title;
        }
        $book = $this->books[$title];
        if ($book->status === BookStatus::Borrowed) {
            return '貸出不可: ' . $title . 'は貸出中です';
        }
        // 正常系：状態を変更して成功を返す
        $book->status = BookStatus::Borrowed;
        return '貸出成功: ' . $title;
    }

    public function report(): void
    {
        foreach ($this->books as $book) {
            echo $book->title . ' [' . $book->status->value . ']' . "\\n";
        }
    }
}

$library = new Library();
$library->addBook(new Book('PHP入門'));
$library->addBook(new Book('データベース設計'));

echo $library->borrow('PHP入門') . "\\n";
echo $library->borrow('PHP入門') . "\\n";
echo $library->borrow('存在しない本') . "\\n";
$library->report();
`,
      hints: [
        `存在チェックはisset($this->books[$title])です。見つからなければ即returnします。`,
        `enumの比較は $book->status === BookStatus::Borrowed と===で書けます。`,
        `オブジェクトは参照のように振る舞うため、$book = $this->books[$title]で取り出して$book->statusを変更すれば配列内の本にも反映されます。`
      ],
      expectedOutput: "貸出成功: PHP入門"
    },
    {
      id: 197,
      title: "図形の面積（抽象クラス＋多態）",
      explanation: `<p>この課題は<strong>継承・抽象クラスの章</strong>の集大成で、オブジェクト指向の花形である<strong>ポリモーフィズム（多態性）</strong>を体験します。円・長方形・三角形という異なる図形を、同じ<code>area()</code>という呼び出し方で扱えるようにします。</p>
<p>設計の中心は抽象クラスです。抽象クラスとは「共通の骨格だけ定義し、具体的な実装は子クラスに強制する」クラスでした。</p>
<pre><code>abstract class Shape
{
    abstract public function area(): float;
}</code></pre>
<p><code>abstract</code>の付いたメソッドは中身を持たず、<strong>継承した子クラスは必ずarea()を実装しなければコンパイルエラー</strong>になります。これにより「Shapeである以上、必ず面積を計算できる」という保証が型レベルで得られます。</p>
<table>
<tr><th>クラス</th><th>面積の式</th></tr>
<tr><td>Circle</td><td>M_PI × 半径 × 半径</td></tr>
<tr><td>Rectangle</td><td>幅 × 高さ</td></tr>
<tr><td>Triangle</td><td>底辺 × 高さ ÷ 2</td></tr>
</table>
<p><code>M_PI</code>は円周率を表すPHPの組み込み定数です。そして多態性の威力が現れるのが集計ループです。</p>
<pre><code>foreach ($shapes as $shape) {
    $total += $shape-&gt;area(); // どの図形でも同じ呼び出し方
}</code></pre>
<p>ループ側は<code>$shape</code>が円か三角形かを一切気にしません。「<strong>呼び出し側は共通のインターフェイスだけを知り、違いは各クラスが隠し持つ</strong>」——これがポリモーフィズムです。将来Pentagon（五角形）クラスを追加しても、このループは1文字も変更不要です。面積表示には<code>sprintf('%.2f')</code>で小数点以下2桁に揃えます。</p>`,
      task: `<code>Rectangle</code>クラスと<code>Triangle</code>クラスを完成させてください。それぞれコンストラクタで受け取った値をもとに<code>area()</code>を実装します（Circleの実装を参考に）。`,
      code: `<?php
abstract class Shape
{
    public function __construct(public readonly string $name)
    {
    }

    // 子クラスに実装を強制する抽象メソッド
    abstract public function area(): float;
}

// 完成例：円
class Circle extends Shape
{
    public function __construct(private readonly float $radius)
    {
        parent::__construct('円');
    }

    public function area(): float
    {
        return M_PI * $this->radius * $this->radius;
    }
}

class Rectangle extends Shape
{
    // TODO: コンストラクタで幅$widthと高さ$heightを受け取り、
    // parent::__construct('長方形')を呼ぶ
    // area()では 幅 × 高さ を返す
}

class Triangle extends Shape
{
    // TODO: コンストラクタで底辺$baseと高さ$heightを受け取り、
    // parent::__construct('三角形')を呼ぶ
    // area()では 底辺 × 高さ ÷ 2 を返す
}

$shapes = [new Circle(5), new Rectangle(4, 6), new Triangle(3, 4)];

$total = 0.0;
foreach ($shapes as $shape) {
    echo sprintf('%sの面積: %.2f', $shape->name, $shape->area()) . "\\n";
    $total += $shape->area();
}
echo sprintf('合計面積: %.2f', $total) . "\\n";
`,
      solution: `<?php
abstract class Shape
{
    public function __construct(public readonly string $name)
    {
    }

    // 子クラスに実装を強制する抽象メソッド
    abstract public function area(): float;
}

// 円
class Circle extends Shape
{
    public function __construct(private readonly float $radius)
    {
        parent::__construct('円');
    }

    public function area(): float
    {
        return M_PI * $this->radius * $this->radius;
    }
}

// 長方形
class Rectangle extends Shape
{
    public function __construct(
        private readonly float $width,
        private readonly float $height,
    ) {
        parent::__construct('長方形');
    }

    public function area(): float
    {
        return $this->width * $this->height;
    }
}

// 三角形
class Triangle extends Shape
{
    public function __construct(
        private readonly float $base,
        private readonly float $height,
    ) {
        parent::__construct('三角形');
    }

    public function area(): float
    {
        return $this->base * $this->height / 2;
    }
}

$shapes = [new Circle(5), new Rectangle(4, 6), new Triangle(3, 4)];

$total = 0.0;
foreach ($shapes as $shape) {
    echo sprintf('%sの面積: %.2f', $shape->name, $shape->area()) . "\\n";
    $total += $shape->area();
}
echo sprintf('合計面積: %.2f', $total) . "\\n";
`,
      hints: [
        `Circleクラスの構造をそのまま真似ましょう。コンストラクタプロモーション（private readonly float $width）で受け取り、parent::__construct()で図形名を渡します。`,
        `Rectangleのarea()は return $this->width * $this->height; です。`,
        `Triangleのarea()は return $this->base * $this->height / 2; です。`
      ],
      expectedOutput: "円の面積: 78.54"
    },
    {
      id: 198,
      title: "簡易スタックマシン（match＋配列）",
      explanation: `<p>この課題では、<strong>match式の章</strong>と<strong>配列の章</strong>（スタック操作）を組み合わせて、小さな計算機を作ります。題材は<strong>逆ポーランド記法（RPN）</strong>——演算子を数値の後ろに書く記法です。<code>3 4 +</code>は<code>3 + 4</code>を意味します。括弧が不要で、コンピュータが処理しやすい形式として、電卓や言語処理系の内部で実際に使われてきました。</p>
<p>計算の仕組みは驚くほど単純で、<strong>スタック（後入れ先出しのデータ構造）</strong>を1本使うだけです。トークン（空白区切りの要素）を左から順に処理します。</p>
<ol>
<li>数値なら、スタックに積む</li>
<li>演算子なら、スタックから2つ取り出して計算し、結果を積み直す</li>
</ol>
<p>PHPでは配列をそのままスタックとして使えます。<code>$stack[] = $value</code>で積み（push）、<code>array_pop($stack)</code>で末尾から取り出します（pop）。</p>
<p>例として<code>3 4 + 2 *</code>の動きを追うと：</p>
<table>
<tr><th>トークン</th><th>処理</th><th>スタックの中身</th></tr>
<tr><td>3</td><td>積む</td><td>[3]</td></tr>
<tr><td>4</td><td>積む</td><td>[3, 4]</td></tr>
<tr><td>+</td><td>3+4=7を積む</td><td>[7]</td></tr>
<tr><td>2</td><td>積む</td><td>[7, 2]</td></tr>
<tr><td>*</td><td>7×2=14を積む</td><td>[14]</td></tr>
</table>
<p>演算子の分岐にはmatch式がぴったりです。注意点は<strong>popの順序</strong>：後に取り出した方が左辺です。引き算<code>10 2 -</code>で10-2=8になるよう、1回目のpopを<code>$right</code>、2回目を<code>$left</code>にします。</p>`,
      task: `<code>evaluate()</code>関数のTODO部分を実装してください。演算子なら<code>array_pop()</code>を2回（先にright、次にleft）行い、match式で計算した結果をスタックに積みます。数値ならintにキャストして積みます。`,
      code: `<?php
/**
 * 逆ポーランド記法（RPN）の式を計算する簡易スタックマシン
 * 例：'3 4 + 2 *' は (3 + 4) * 2 を意味する
 */
function evaluate(string $expression): int
{
    $stack = [];
    $tokens = explode(' ', $expression);

    foreach ($tokens as $token) {
        if (in_array($token, ['+', '-', '*'], true)) {
            // TODO: array_popで$right、$leftの順に取り出し、
            // match式で$tokenに応じた計算結果を$stackに積む
        } else {
            // TODO: 数値トークンをintにキャストして$stackに積む
        }
    }

    return array_pop($stack);
}

echo '3 4 + 2 * = ' . evaluate('3 4 + 2 *') . "\\n";
echo '10 2 - 3 * = ' . evaluate('10 2 - 3 *') . "\\n";
echo '5 1 4 + - = ' . evaluate('5 1 4 + -') . "\\n";
`,
      solution: `<?php
/**
 * 逆ポーランド記法（RPN）の式を計算する簡易スタックマシン
 * 例：'3 4 + 2 *' は (3 + 4) * 2 を意味する
 */
function evaluate(string $expression): int
{
    $stack = [];
    $tokens = explode(' ', $expression);

    foreach ($tokens as $token) {
        if (in_array($token, ['+', '-', '*'], true)) {
            // 後に積まれた方が右辺。popの順序に注意
            $right = array_pop($stack);
            $left = array_pop($stack);
            $stack[] = match ($token) {
                '+' => $left + $right,
                '-' => $left - $right,
                '*' => $left * $right,
            };
        } else {
            // 数値トークンはintに変換して積む
            $stack[] = (int)$token;
        }
    }

    return array_pop($stack);
}

echo '3 4 + 2 * = ' . evaluate('3 4 + 2 *') . "\\n";
echo '10 2 - 3 * = ' . evaluate('10 2 - 3 *') . "\\n";
echo '5 1 4 + - = ' . evaluate('5 1 4 + -') . "\\n";
`,
      hints: [
        `$right = array_pop($stack); $left = array_pop($stack); の順番が重要です。逆にすると引き算の結果が変わってしまいます。`,
        `match ($token) { '+' => $left + $right, ... } の形で3演算子を並べ、結果を$stack[] =で積みます。`,
        `数値の方は $stack[] = (int)$token; の1行です。`
      ],
      expectedOutput: "3 4 + 2 * = 14"
    },
    {
      id: 199,
      title: "CSV風データの集計レポート（explode＋array_map＋sprintf）",
      explanation: `<p>この課題は<strong>文字列の章</strong>（explode・sprintf）と<strong>配列の章</strong>（array_map・分割代入）の組み合わせで、実務で最も頻繁に出会う形の処理です。「カンマ区切りのデータ行を構造化し、集計して、整形されたレポートを出力する」——CSVファイルの取り込み処理の核心部分そのものです。</p>
<p>処理は3段階のパイプラインとして設計します。</p>
<ol>
<li><strong>パース</strong>：各行を<code>explode(',', $line)</code>で分解し、連想配列に変換する</li>
<li><strong>集計</strong>：単価×数量で小計を計算し、合計に加算する</li>
<li><strong>整形</strong>：<code>sprintf()</code>で桁や単位を揃えて出力する</li>
</ol>
<p>パース段階では<code>array_map()</code>に無名関数を渡し、「文字列の配列」を「連想配列の配列」へ一括変換します。行の分解には配列の分割代入が便利です。</p>
<pre><code>[$name, $price, $qty] = explode(',', $line);</code></pre>
<p>ここで重要なのが<strong>型の変換</strong>です。explodeの結果はすべて文字列なので、数値として扱う列は<code>(int)</code>でキャストして連想配列に格納します。「<strong>データは境界（読み込んだ直後）で正しい型に変換する</strong>」という原則を守ると、後続の計算処理で型を気にする必要がなくなります。</p>
<p>整形段階の<code>sprintf('%s: %d円 x %d個 = %d円', ...)</code>は、テンプレートと値が分離されているため、フォーマット変更に強いコードになります。パース・集計・整形を混ぜずに分けて書くこの構成は、どんなデータ処理にも応用できる基本形です。</p>`,
      task: `TODO部分を実装してください。<code>array_map()</code>内で行をexplodeと分割代入でパースし、(int)キャストした連想配列を返します。集計ループでは小計を計算して<code>sprintf()</code>で出力します。`,
      code: `<?php
// 商品名,単価,数量 の形式のデータ行
$csvLines = [
    'りんご,150,2',
    'みかん,80,5',
    'ばなな,100,3',
];

// TODO: array_mapで各行を連想配列に変換する
// explodeと分割代入 [$name, $price, $qty] を使い、
// priceとqtyは(int)にキャストして
// ['name' => ..., 'price' => ..., 'qty' => ...] を返す
$items = [];

echo '=== 購入レポート ===' . "\\n";
$total = 0;
foreach ($items as $item) {
    // TODO: 小計（price × qty）を計算して$totalに加算し、
    // sprintf('%s: %d円 x %d個 = %d円', ...) の形式で出力する
}
echo sprintf('合計: %d円', $total) . "\\n";
`,
      solution: `<?php
// 商品名,単価,数量 の形式のデータ行
$csvLines = [
    'りんご,150,2',
    'みかん,80,5',
    'ばなな,100,3',
];

// 各行をパースして連想配列に変換する（境界で型も変換する）
$items = array_map(function (string $line): array {
    [$name, $price, $qty] = explode(',', $line);
    return [
        'name' => $name,
        'price' => (int)$price,
        'qty' => (int)$qty,
    ];
}, $csvLines);

echo '=== 購入レポート ===' . "\\n";
$total = 0;
foreach ($items as $item) {
    $subtotal = $item['price'] * $item['qty'];
    $total += $subtotal;
    echo sprintf('%s: %d円 x %d個 = %d円', $item['name'], $item['price'], $item['qty'], $subtotal) . "\\n";
}
echo sprintf('合計: %d円', $total) . "\\n";
`,
      hints: [
        `array_map(function (string $line): array { ... }, $csvLines) の形で、無名関数の中で1行分を処理します。`,
        `[$name, $price, $qty] = explode(',', $line); で3つの変数に一度に分解できます。`,
        `集計ループでは$subtotal = $item['price'] * $item['qty'];を計算し、sprintfの4つの%に商品名・単価・数量・小計を順に渡します。`
      ],
      expectedOutput: "合計: 1000円"
    },
    {
      id: 200,
      title: "卒業課題：家計簿ミニアプリ",
      explanation: `<p>いよいよ最後のステップ、卒業課題です。「登録・カテゴリ集計・レポート整形出力」を備えた家計簿ミニアプリを完成させます。新しい知識は登場しません。これまでの200ステップで学んだ道具の総結集です。</p>
<table>
<tr><th>機能</th><th>使う知識</th></tr>
<tr><td>支出の登録</td><td>クラス、プロパティ、連想配列（第9〜13章）</td></tr>
<tr><td>カテゴリ別集計</td><td>foreach、null合体演算子、連想配列の集計（第5〜8章）</td></tr>
<tr><td>レポート出力</td><td>sprintf、arsort、array_sum（第4・8章）</td></tr>
</table>
<p>設計の考え方を整理します。1件の支出は「日付・カテゴリ・金額・メモ」を持つ連想配列とし、<code>Ledger</code>（台帳）クラスがその配列のリストを<code>private</code>プロパティで管理します。外部からは<code>add()</code>でしか追加できない、おなじみのカプセル化です。</p>
<p>核心となるのは<code>totalsByCategory()</code>メソッドです。全明細を走査し、「カテゴリ =&gt; 合計金額」の連想配列を組み立てます。これはステップ188のカート集計や194の単語カウントと同じ、<strong>グループ化集計</strong>のパターンです。</p>
<pre><code>$totals = [];
foreach ($this-&gt;entries as $entry) {
    $current = $totals[$entry['category']] ?? 0;
    $totals[$entry['category']] = $current + $entry['amount'];
}</code></pre>
<p>レポートでは<code>arsort()</code>（値の大きい順に並べ替え、キーとの対応は保持する関数）で金額の大きいカテゴリから表示し、<code>array_sum()</code>で支出合計を出します。完成したら、自分で明細を追加したりカテゴリを増やしたりして遊んでみてください。ここまで完走したあなたは、PHPの基礎文法を一通り使いこなせるようになっています。おめでとうございます！</p>`,
      task: `<code>Ledger</code>クラスの<code>totalsByCategory()</code>メソッド（カテゴリ別のグループ化集計）と、<code>report()</code>内のカテゴリ別集計出力（arsortで降順にしてから出力）を実装してください。`,
      code: `<?php
class Ledger
{
    /** @var array<int, array{date: string, category: string, amount: int, memo: string}> */
    private array $entries = [];

    /**
     * 支出を1件登録する
     */
    public function add(string $date, string $category, int $amount, string $memo): void
    {
        $this->entries[] = [
            'date' => $date,
            'category' => $category,
            'amount' => $amount,
            'memo' => $memo,
        ];
    }

    /**
     * カテゴリごとの合計金額を集計する
     * @return array<string, int> カテゴリ => 合計金額
     */
    public function totalsByCategory(): array
    {
        // TODO: 全$entriesを走査し、カテゴリをキーに金額を合算した
        // 連想配列を作って返す（?? 0 で初回を処理する）
        return [];
    }

    /**
     * 家計簿レポートを出力する
     */
    public function report(): void
    {
        echo '=== 家計簿レポート ===' . "\\n";
        foreach ($this->entries as $entry) {
            echo sprintf('%s [%s] %d円 %s', $entry['date'], $entry['category'], $entry['amount'], $entry['memo']) . "\\n";
        }

        echo '--- カテゴリ別集計 ---' . "\\n";
        // TODO: totalsByCategory()の結果をarsortで金額の大きい順に並べ、
        // sprintf('%s: %d円', カテゴリ, 合計) の形式で1行ずつ出力する

        // TODO: array_sumで支出合計を計算し、
        // sprintf('支出合計: %d円', 合計) を出力する
    }
}

$ledger = new Ledger();
$ledger->add('08-01', '食費', 1200, '昼食');
$ledger->add('08-01', '交通費', 500, '電車');
$ledger->add('08-02', '食費', 2000, '食材まとめ買い');
$ledger->add('08-02', '娯楽', 3000, '映画');

$ledger->report();
`,
      solution: `<?php
class Ledger
{
    /** @var array<int, array{date: string, category: string, amount: int, memo: string}> */
    private array $entries = [];

    /**
     * 支出を1件登録する
     */
    public function add(string $date, string $category, int $amount, string $memo): void
    {
        $this->entries[] = [
            'date' => $date,
            'category' => $category,
            'amount' => $amount,
            'memo' => $memo,
        ];
    }

    /**
     * カテゴリごとの合計金額を集計する
     * @return array<string, int> カテゴリ => 合計金額
     */
    public function totalsByCategory(): array
    {
        $totals = [];
        foreach ($this->entries as $entry) {
            // 初登場のカテゴリは0から始める（グループ化集計の定番）
            $current = $totals[$entry['category']] ?? 0;
            $totals[$entry['category']] = $current + $entry['amount'];
        }
        return $totals;
    }

    /**
     * 家計簿レポートを出力する
     */
    public function report(): void
    {
        echo '=== 家計簿レポート ===' . "\\n";
        foreach ($this->entries as $entry) {
            echo sprintf('%s [%s] %d円 %s', $entry['date'], $entry['category'], $entry['amount'], $entry['memo']) . "\\n";
        }

        echo '--- カテゴリ別集計 ---' . "\\n";
        // 金額の大きい順に並べ替えて出力する
        $totals = $this->totalsByCategory();
        arsort($totals);
        foreach ($totals as $category => $total) {
            echo sprintf('%s: %d円', $category, $total) . "\\n";
        }

        echo sprintf('支出合計: %d円', array_sum($totals)) . "\\n";
    }
}

$ledger = new Ledger();
$ledger->add('08-01', '食費', 1200, '昼食');
$ledger->add('08-01', '交通費', 500, '電車');
$ledger->add('08-02', '食費', 2000, '食材まとめ買い');
$ledger->add('08-02', '娯楽', 3000, '映画');

$ledger->report();
`,
      hints: [
        `totalsByCategory()はステップ188のカート集計と同じ形です。$totals[$entry['category']] ?? 0 で現在値を取り、加算して代入し直します。`,
        `report()側では$totals = $this->totalsByCategory(); arsort($totals); としてからforeachで出力します。arsortは元の配列を直接並べ替える点に注意してください。`,
        `支出合計はarray_sum($totals)で求められます。カテゴリ別合計の総和＝全支出の合計です。`
      ],
      expectedOutput: "支出合計: 6700円"
    }
  ]
});
