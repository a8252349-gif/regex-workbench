import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const file = path.join(root, "src/content/guides.generated.json");
const data = JSON.parse(fs.readFileSync(file, "utf8"));

const slugs = [
  "javascript-regex-complete-guide",
  "character-classes-escaping",
  "capture-groups-named-groups",
  "lookahead-lookbehind",
  "greedy-vs-lazy",
  "multiline-dotall-anchors",
  "javascript-regex-replacement",
  "extract-structured-data-logs",
  "test-regex-multiple-strings",
  "unicode-regex-javascript",
  "regex-backtracking-redos",
  "javascript-vs-python-pcre-java",
  "reliable-regex-test-cases",
  "when-not-to-use-regex",
  "browser-regex-privacy"
];

const termSets = {
  en: {
    "javascript-regex-complete-guide": ["RegExp literal", "RegExp constructor", "source property", "flags property", "matchAll", "lastIndex", "positive case", "negative case"],
    "character-classes-escaping": ["dot metacharacter", "digit class", "word class", "whitespace class", "negated class", "hyphen placement", "regex literal", "string escaping"],
    "capture-groups-named-groups": ["numbered group", "named group", "non-capturing group", "optional capture", "undefined value", "empty capture", "indices flag", "replacement reference"],
    "lookahead-lookbehind": ["positive lookahead", "negative lookahead", "positive lookbehind", "negative lookbehind", "zero-width assertion", "consumed text", "compatibility check", "fallback pattern"],
    "greedy-vs-lazy": ["greedy quantifier", "lazy quantifier", "delimiter", "negated class", "dotAll", "backtracking path", "quoted field", "tempered boundary"],
    "multiline-dotall-anchors": ["start anchor", "end anchor", "multiline flag", "dotAll flag", "CRLF", "LF", "line terminator", "per-line scan"],
    "javascript-regex-replacement": ["whole-match token", "numbered replacement", "named replacement", "prefix token", "suffix token", "literal dollar", "replacement callback", "immutable source"],
    "extract-structured-data-logs": ["timestamp", "log level", "request ID", "optional field", "stack trace", "CSV column", "personal data", "malformed line"],
    "test-regex-multiple-strings": ["positive case", "negative case", "boundary case", "regression case", "false positive", "false negative", "case note", "JSON fixture"],
    "unicode-regex-javascript": ["Unicode mode", "property escape", "script property", "code point", "surrogate pair", "combining mark", "normalization", "grapheme cluster"],
    "regex-backtracking-redos": ["nested quantifier", "ambiguous alternation", "hostile suffix", "backtracking tree", "Worker timeout", "input cap", "static heuristic", "linear alternative"],
    "javascript-vs-python-pcre-java": ["named-group syntax", "flag scope", "Unicode default", "lookbehind rule", "atomic group", "possessive quantifier", "replacement token", "engine regression"],
    "reliable-regex-test-cases": ["plain-language contract", "positive matrix", "negative matrix", "boundary value", "Unicode sample", "long input", "expected capture", "versioned fixture"],
    "when-not-to-use-regex": ["nested grammar", "HTML parser", "JSON parser", "semantic validation", "international address", "balanced delimiter", "maintenance cost", "parser error"],
    "browser-regex-privacy": ["local execution", "network request", "localStorage", "shared URL", "browser extension", "downloaded export", "analytics redaction", "threat model"]
  },
  ko: {
    "javascript-regex-complete-guide": ["RegExp 리터럴", "RegExp 생성자", "source 속성", "flags 속성", "matchAll", "lastIndex", "성공 사례", "실패 사례"],
    "character-classes-escaping": ["점 메타문자", "숫자 클래스", "단어 클래스", "공백 클래스", "부정 문자 클래스", "하이픈 위치", "정규식 리터럴", "문자열 이스케이프"],
    "capture-groups-named-groups": ["번호 캡처 그룹", "이름 있는 그룹", "비캡처 그룹", "선택 캡처", "undefined 값", "빈 캡처", "인덱스 플래그", "치환 참조"],
    "lookahead-lookbehind": ["긍정형 전방 탐색", "부정형 전방 탐색", "긍정형 후방 탐색", "부정형 후방 탐색", "너비가 없는 단언", "소비되는 텍스트", "호환성 확인", "대체 패턴"],
    "greedy-vs-lazy": ["탐욕적 수량자", "게으른 수량자", "구분자", "부정 문자 클래스", "dotAll", "백트래킹 경로", "따옴표 필드", "제한된 경계"],
    "multiline-dotall-anchors": ["시작 앵커", "끝 앵커", "멀티라인 플래그", "dotAll 플래그", "CRLF", "LF", "줄 종결 문자", "줄 단위 검사"],
    "javascript-regex-replacement": ["전체 일치 토큰", "번호 치환 참조", "이름 치환 참조", "앞부분 토큰", "뒷부분 토큰", "리터럴 달러", "치환 콜백", "원본 불변성"],
    "extract-structured-data-logs": ["타임스탬프", "로그 레벨", "요청 ID", "선택 필드", "스택 트레이스", "CSV 열", "개인정보", "손상된 로그 줄"],
    "test-regex-multiple-strings": ["성공 사례", "실패 사례", "경계값 사례", "회귀 사례", "거짓 양성", "거짓 음성", "사례 메모", "JSON 픽스처"],
    "unicode-regex-javascript": ["Unicode 모드", "속성 이스케이프", "스크립트 속성", "코드 포인트", "서로게이트 쌍", "결합 문자", "정규화", "그래핌 클러스터"],
    "regex-backtracking-redos": ["중첩 수량자", "모호한 선택", "공격적 접미사", "백트래킹 트리", "Worker 시간 제한", "입력 길이 제한", "정적 휴리스틱", "선형 대안"],
    "javascript-vs-python-pcre-java": ["이름 그룹 문법", "플래그 범위", "Unicode 기본값", "후방 탐색 규칙", "원자 그룹", "소유형 수량자", "치환 토큰", "엔진 회귀 테스트"],
    "reliable-regex-test-cases": ["자연어 요구사항", "성공 사례 표", "실패 사례 표", "경계값", "Unicode 표본", "긴 입력", "기대 캡처", "버전이 있는 픽스처"],
    "when-not-to-use-regex": ["중첩 문법", "HTML 파서", "JSON 파서", "의미 검증", "국제 주소", "균형 구분자", "유지보수 비용", "파서 오류"],
    "browser-regex-privacy": ["로컬 실행", "네트워크 요청", "localStorage", "공유 URL", "브라우저 확장 프로그램", "다운로드 결과", "분석 데이터 비식별화", "위협 모델"]
  },
  ja: {
    "javascript-regex-complete-guide": ["RegExp リテラル", "RegExp コンストラクター", "source プロパティ", "flags プロパティ", "matchAll", "lastIndex", "成功ケース", "失敗ケース"],
    "character-classes-escaping": ["ドットメタ文字", "数字クラス", "単語クラス", "空白クラス", "否定文字クラス", "ハイフンの位置", "正規表現リテラル", "文字列エスケープ"],
    "capture-groups-named-groups": ["番号付きグループ", "名前付きグループ", "非キャプチャグループ", "任意キャプチャ", "undefined 値", "空のキャプチャ", "indices フラグ", "置換参照"],
    "lookahead-lookbehind": ["肯定先読み", "否定先読み", "肯定後読み", "否定後読み", "ゼロ幅アサーション", "消費される文字列", "互換性確認", "代替パターン"],
    "greedy-vs-lazy": ["貪欲量指定子", "遅延量指定子", "区切り文字", "否定文字クラス", "dotAll", "バックトラック経路", "引用フィールド", "制限付き境界"],
    "multiline-dotall-anchors": ["開始アンカー", "終了アンカー", "multiline フラグ", "dotAll フラグ", "CRLF", "LF", "行終端文字", "行単位の走査"],
    "javascript-regex-replacement": ["全体一致トークン", "番号付き置換", "名前付き置換", "前方トークン", "後方トークン", "リテラルドル", "置換コールバック", "元データの不変性"],
    "extract-structured-data-logs": ["タイムスタンプ", "ログレベル", "リクエスト ID", "任意フィールド", "スタックトレース", "CSV 列", "個人データ", "壊れたログ行"],
    "test-regex-multiple-strings": ["成功ケース", "失敗ケース", "境界ケース", "回帰ケース", "偽陽性", "偽陰性", "ケースメモ", "JSON フィクスチャ"],
    "unicode-regex-javascript": ["Unicode モード", "プロパティエスケープ", "スクリプト属性", "コードポイント", "サロゲートペア", "結合文字", "正規化", "書記素クラスタ"],
    "regex-backtracking-redos": ["ネスト量指定子", "曖昧な選択", "攻撃的な接尾辞", "バックトラック木", "Worker タイムアウト", "入力上限", "静的ヒューリスティック", "線形な代案"],
    "javascript-vs-python-pcre-java": ["名前付きグループ構文", "フラグの範囲", "Unicode の既定値", "後読み規則", "アトミックグループ", "所有量指定子", "置換トークン", "エンジン回帰"],
    "reliable-regex-test-cases": ["自然言語の契約", "成功マトリクス", "失敗マトリクス", "境界値", "Unicode サンプル", "長い入力", "期待キャプチャ", "版管理フィクスチャ"],
    "when-not-to-use-regex": ["ネスト文法", "HTML パーサー", "JSON パーサー", "意味検証", "国際住所", "対応する区切り", "保守コスト", "パーサーエラー"],
    "browser-regex-privacy": ["ローカル実行", "ネットワーク要求", "localStorage", "共有 URL", "ブラウザー拡張", "ダウンロード結果", "分析データの秘匿", "脅威モデル"]
  },
  es: {
    "javascript-regex-complete-guide": ["literal RegExp", "constructor RegExp", "propiedad source", "propiedad flags", "matchAll", "lastIndex", "caso positivo", "caso negativo"],
    "character-classes-escaping": ["metacarácter punto", "clase de dígitos", "clase de palabra", "clase de espacios", "clase negada", "posición del guion", "literal regex", "escape de cadena"],
    "capture-groups-named-groups": ["grupo numerado", "grupo con nombre", "grupo sin captura", "captura opcional", "valor undefined", "captura vacía", "bandera de índices", "referencia de reemplazo"],
    "lookahead-lookbehind": ["lookahead positivo", "lookahead negativo", "lookbehind positivo", "lookbehind negativo", "aserción de ancho cero", "texto consumido", "prueba de compatibilidad", "patrón alternativo"],
    "greedy-vs-lazy": ["cuantificador codicioso", "cuantificador perezoso", "delimitador", "clase negada", "dotAll", "ruta de retroceso", "campo entre comillas", "límite acotado"],
    "multiline-dotall-anchors": ["ancla inicial", "ancla final", "bandera multiline", "bandera dotAll", "CRLF", "LF", "terminador de línea", "búsqueda por línea"],
    "javascript-regex-replacement": ["token de coincidencia completa", "reemplazo numerado", "reemplazo con nombre", "token de prefijo", "token de sufijo", "dólar literal", "callback de reemplazo", "origen inmutable"],
    "extract-structured-data-logs": ["marca de tiempo", "nivel de log", "ID de solicitud", "campo opcional", "traza de pila", "columna CSV", "datos personales", "línea dañada"],
    "test-regex-multiple-strings": ["caso positivo", "caso negativo", "caso límite", "caso de regresión", "falso positivo", "falso negativo", "nota del caso", "fixture JSON"],
    "unicode-regex-javascript": ["modo Unicode", "escape de propiedad", "propiedad de escritura", "punto de código", "par sustituto", "marca combinante", "normalización", "clúster de grafemas"],
    "regex-backtracking-redos": ["cuantificador anidado", "alternancia ambigua", "sufijo hostil", "árbol de retroceso", "timeout del Worker", "límite de entrada", "heurística estática", "alternativa lineal"],
    "javascript-vs-python-pcre-java": ["sintaxis de grupos con nombre", "alcance de banderas", "valor Unicode predeterminado", "regla de lookbehind", "grupo atómico", "cuantificador posesivo", "token de reemplazo", "regresión entre motores"],
    "reliable-regex-test-cases": ["contrato en lenguaje natural", "matriz positiva", "matriz negativa", "valor límite", "muestra Unicode", "entrada larga", "captura esperada", "fixture versionado"],
    "when-not-to-use-regex": ["gramática anidada", "parser HTML", "parser JSON", "validación semántica", "dirección internacional", "delimitador equilibrado", "coste de mantenimiento", "error del parser"],
    "browser-regex-privacy": ["ejecución local", "solicitud de red", "localStorage", "URL compartida", "extensión del navegador", "exportación descargada", "redacción analítica", "modelo de amenazas"]
  },
  fr: {
    "javascript-regex-complete-guide": ["littéral RegExp", "constructeur RegExp", "propriété source", "propriété flags", "matchAll", "lastIndex", "cas positif", "cas négatif"],
    "character-classes-escaping": ["métacaractère point", "classe de chiffres", "classe de mot", "classe d’espaces", "classe négative", "position du tiret", "littéral regex", "échappement de chaîne"],
    "capture-groups-named-groups": ["groupe numéroté", "groupe nommé", "groupe non capturant", "capture facultative", "valeur undefined", "capture vide", "indicateur d’indices", "référence de remplacement"],
    "lookahead-lookbehind": ["anticipation positive", "anticipation négative", "retour positif", "retour négatif", "assertion de largeur nulle", "texte consommé", "test de compatibilité", "motif de repli"],
    "greedy-vs-lazy": ["quantificateur gourmand", "quantificateur paresseux", "délimiteur", "classe négative", "dotAll", "chemin de retour arrière", "champ entre guillemets", "limite tempérée"],
    "multiline-dotall-anchors": ["ancre de début", "ancre de fin", "indicateur multiline", "indicateur dotAll", "CRLF", "LF", "terminateur de ligne", "analyse ligne par ligne"],
    "javascript-regex-replacement": ["jeton de correspondance totale", "remplacement numéroté", "remplacement nommé", "jeton de préfixe", "jeton de suffixe", "dollar littéral", "fonction de remplacement", "source immuable"],
    "extract-structured-data-logs": ["horodatage", "niveau de journal", "ID de requête", "champ facultatif", "trace de pile", "colonne CSV", "données personnelles", "ligne mal formée"],
    "test-regex-multiple-strings": ["cas positif", "cas négatif", "cas limite", "cas de régression", "faux positif", "faux négatif", "note de cas", "fixture JSON"],
    "unicode-regex-javascript": ["mode Unicode", "échappement de propriété", "propriété de script", "point de code", "paire de substitution", "marque combinatoire", "normalisation", "grappe de graphèmes"],
    "regex-backtracking-redos": ["quantificateur imbriqué", "alternative ambiguë", "suffixe hostile", "arbre de retour arrière", "délai du Worker", "limite d’entrée", "heuristique statique", "solution linéaire"],
    "javascript-vs-python-pcre-java": ["syntaxe de groupe nommé", "portée des indicateurs", "valeur Unicode par défaut", "règle de lookbehind", "groupe atomique", "quantificateur possessif", "jeton de remplacement", "régression de moteur"],
    "reliable-regex-test-cases": ["contrat en langage naturel", "matrice positive", "matrice négative", "valeur limite", "échantillon Unicode", "entrée longue", "capture attendue", "fixture versionné"],
    "when-not-to-use-regex": ["grammaire imbriquée", "analyseur HTML", "analyseur JSON", "validation sémantique", "adresse internationale", "délimiteur équilibré", "coût de maintenance", "erreur d’analyse"],
    "browser-regex-privacy": ["exécution locale", "requête réseau", "localStorage", "URL partagée", "extension de navigateur", "export téléchargé", "masquage analytique", "modèle de menace"]
  },
  de: {
    "javascript-regex-complete-guide": ["RegExp-Literal", "RegExp-Konstruktor", "source-Eigenschaft", "flags-Eigenschaft", "matchAll", "lastIndex", "Positivfall", "Negativfall"],
    "character-classes-escaping": ["Punkt-Metazeichen", "Ziffernklasse", "Wortklasse", "Leerraumklasse", "negierte Klasse", "Bindestrichposition", "Regex-Literal", "String-Escaping"],
    "capture-groups-named-groups": ["nummerierte Gruppe", "benannte Gruppe", "nicht erfassende Gruppe", "optionale Erfassung", "undefined-Wert", "leere Erfassung", "Indices-Flag", "Ersetzungsreferenz"],
    "lookahead-lookbehind": ["positiver Lookahead", "negativer Lookahead", "positiver Lookbehind", "negativer Lookbehind", "Nullbreiten-Assertion", "verbrauchter Text", "Kompatibilitätsprüfung", "Ausweichmuster"],
    "greedy-vs-lazy": ["gieriger Quantifizierer", "fauler Quantifizierer", "Trennzeichen", "negierte Klasse", "dotAll", "Backtracking-Pfad", "zitiertes Feld", "begrenzte Grenze"],
    "multiline-dotall-anchors": ["Startanker", "Endanker", "Multiline-Flag", "dotAll-Flag", "CRLF", "LF", "Zeilenabschluss", "zeilenweise Prüfung"],
    "javascript-regex-replacement": ["Gesamttreffer-Token", "nummerierte Ersetzung", "benannte Ersetzung", "Präfix-Token", "Suffix-Token", "literales Dollarzeichen", "Ersetzungs-Callback", "unveränderte Quelle"],
    "extract-structured-data-logs": ["Zeitstempel", "Log-Level", "Request-ID", "optionales Feld", "Stacktrace", "CSV-Spalte", "personenbezogene Daten", "fehlerhafte Zeile"],
    "test-regex-multiple-strings": ["Positivfall", "Negativfall", "Grenzfall", "Regressionstest", "falsch positiver Treffer", "falsch negativer Treffer", "Fallnotiz", "JSON-Fixture"],
    "unicode-regex-javascript": ["Unicode-Modus", "Property-Escape", "Script-Eigenschaft", "Codepoint", "Surrogatpaar", "kombinierendes Zeichen", "Normalisierung", "Graphemcluster"],
    "regex-backtracking-redos": ["verschachtelter Quantifizierer", "mehrdeutige Alternative", "feindliches Suffix", "Backtracking-Baum", "Worker-Zeitlimit", "Eingabegrenze", "statische Heuristik", "lineare Alternative"],
    "javascript-vs-python-pcre-java": ["Syntax benannter Gruppen", "Flag-Gültigkeit", "Unicode-Standard", "Lookbehind-Regel", "atomare Gruppe", "possessiver Quantifizierer", "Ersetzungs-Token", "Engine-Regression"],
    "reliable-regex-test-cases": ["Anforderung in Alltagssprache", "Positivmatrix", "Negativmatrix", "Grenzwert", "Unicode-Beispiel", "lange Eingabe", "erwartete Erfassung", "versioniertes Fixture"],
    "when-not-to-use-regex": ["verschachtelte Grammatik", "HTML-Parser", "JSON-Parser", "semantische Validierung", "internationale Adresse", "ausgeglichener Begrenzer", "Wartungskosten", "Parserfehler"],
    "browser-regex-privacy": ["lokale Ausführung", "Netzwerkanfrage", "localStorage", "geteilte URL", "Browsererweiterung", "heruntergeladener Export", "Analytics-Redaktion", "Bedrohungsmodell"]
  }
};

const localeData = {
  en: {
    openers: ["Begin with", "Frame the review around", "Use as the first checkpoint", "Anchor the investigation in", "Make the decision from", "Read the example through", "Build the explanation from", "Document the behavior with"],
    bridges: ["rather than guessing from symbols", "before widening the sample", "while preserving the original text", "with engine behavior made explicit", "without hiding failed cases", "so a later edit can be compared", "under ordinary and hostile input", "at the exact match boundary"],
    actions: [
      "Translate the requirement into accepted text, rejected text, and values that must survive extraction.",
      "Run the supplied expression against the sample and compare the exact output instead of relying on visual similarity.",
      "Account for consumed characters, assertions, groups, and indexes token by token.",
      "Compare the weak expression with the narrow one and record the first false result each version creates.",
      "Inspect full matches, capture values, positions, empty strings, and undefined groups as different states.",
      "Record flags with the pattern because they can alter repetition, anchors, Unicode parsing, and index behavior.",
      "Add near-valid inputs at delimiters, length limits, newlines, Unicode boundaries, and trailing content.",
      "Increase input size gradually and terminate Worker execution when the defined time budget is exceeded.",
      "Keep source text out of URLs, analytics, errors, and storage unless the user deliberately includes it.",
      "Recompile and rerun the suite in a destination engine instead of assuming similar notation means identical behavior.",
      "Compare a narrow expression, a broad shortcut, and a dedicated parser against the same acceptance contract.",
      "Turn every discovered assumption into a named case with an expected match, capture, replacement, or rejection.",
      "Save pattern, flags, samples, engine, and rationale together so review can detect semantic drift."
    ],
    intro: (g,t) => `${g.description} This guide uses ${t[0]}, ${t[1]}, and the concrete expression ${g.pattern} to connect syntax with observable browser behavior. The sample ${g.input} and expected result ${g.output} remain visible throughout, so every recommendation can be repeated in the JavaScript RegExp engine rather than accepted as an unsupported claim.`,
    paragraph: ({g,t,opener,bridge,action,j}) => `${opener} ${t[j%8]}, ${t[(j+1)%8]}, ${t[(j+2)%8]}, and ${t[(j+3)%8]}. In “${g.title}”, the expression ${g.pattern} is checked against ${g.input} ${bridge}. ${action} The reference result is ${g.output}, while ${g.invalidPattern} is retained as a deliberate counterexample. Use ${t[(j+4)%8]} and ${t[(j+5)%8]} to explain why the observed match changes, then record ${t[(j+6)%8]} before moving to ${t[(j+7)%8]}. The objective is a reproducible decision in the current JavaScript browser engine, not memorization of punctuation.`,
    faq: (g,t) => [
      {question:`How does ${t[0]} change the result in ${g.title}?`,answer:`Test ${g.pattern} against ${g.input}, inspect ${t[0]} together with ${t[1]}, and compare the exact result ${g.output}. The answer depends on JavaScript RegExp semantics and the active flags, so keep both with the test case.`},
      {question:`Why is ${g.invalidPattern} kept as a counterexample?`,answer:`It makes the failure mode visible. Compare it with ${g.pattern} on a near-valid input, record the first false positive or false negative, and explain the difference using ${t[2]} and ${t[3]}.`},
      {question:`Which boundary case best tests ${t[4]}?`,answer:`Choose a value immediately outside the stated requirement, then add a newline, Unicode character, empty value, or extra delimiter where relevant. A useful boundary case has one clear reason to pass or fail.`},
      {question:`What should be measured before using ${t[5]} on long input?`,answer:`Measure elapsed time, match count, result truncation, memory pressure, and Worker timeout behavior. A fast short sample does not establish safe behavior for a larger or hostile string.`},
      {question:`When should this task move beyond a regular expression?`,answer:`Use a parser or domain library when nesting, escaping rules, semantic validation, or engine portability becomes more important than a compact textual match. Keep the regex only for the narrow layer it can test reliably.`}
    ],
    checklist: (g,t) => [`State the acceptance rule for ${t[0]}`,`Run ${g.pattern} with recorded flags`, `Add a rejection case around ${t[2]}`, `Inspect ${t[4]} and ${t[5]}`, `Retest ${t[7]} after every edit`]
  },
  ko: {
    openers: ["먼저", "검토의 출발점으로", "첫 확인 항목으로", "실제 입력을 기준으로", "판단 근거를 만들기 위해", "예제를 해석할 때", "설명을 구성할 때", "동작을 문서화할 때"],
    bridges: ["기호만 보고 추측하지 않고 확인합니다", "표본을 늘리기 전에 검증합니다", "원본 문자열을 유지한 채 비교합니다", "엔진 동작을 명시한 상태에서 살펴봅니다", "실패 사례를 숨기지 않고 대조합니다", "수정 전후 결과를 다시 비교할 수 있게 합니다", "일반 입력과 공격적 입력을 함께 사용합니다", "정확한 일치 경계를 기준으로 분석합니다"],
    actions: [
      "요구사항을 허용할 문자열, 거부할 문자열, 추출 후 보존할 값으로 나눕니다.",
      "제공된 정규식을 표본에 실행하고 비슷해 보인다는 인상 대신 정확한 출력값을 비교합니다.",
      "소비되는 문자, 너비가 없는 단언, 그룹, 인덱스를 토큰별로 설명합니다.",
      "약한 표현식과 좁은 표현식을 같은 입력에 적용해 처음 발생하는 잘못된 결과를 기록합니다.",
      "전체 일치, 캡처 값, 위치, 빈 문자열, undefined 그룹을 서로 다른 상태로 확인합니다.",
      "플래그는 반복, 앵커, Unicode 해석, 인덱스 동작을 바꾸므로 패턴과 함께 기록합니다.",
      "구분자, 길이 제한, 줄바꿈, Unicode 경계, 뒤따르는 문자에서 거의 유효한 입력을 추가합니다.",
      "입력 길이를 단계적으로 늘리고 정한 시간 예산을 넘으면 Worker 실행을 종료합니다.",
      "사용자가 명시적으로 포함하지 않는 한 원문을 URL, 분석 데이터, 오류 메시지, 저장소에 넣지 않습니다.",
      "비슷한 표기가 같은 의미라고 가정하지 말고 대상 엔진에서 다시 컴파일하고 전체 사례를 실행합니다.",
      "좁은 정규식, 넓은 지름길 패턴, 전용 파서를 같은 허용 기준으로 비교합니다.",
      "발견한 가정을 기대 일치, 캡처, 치환, 거부 결과가 있는 이름 있는 사례로 바꿉니다.",
      "패턴, 플래그, 표본, 엔진, 선택 이유를 함께 저장해 의미 변화가 검토 과정에서 드러나게 합니다."
    ],
    intro: (g,t) => `${g.description} 이 가이드는 ${t[0]}, ${t[1]}, 그리고 실제 표현식 ${g.pattern}을 중심으로 문법과 브라우저 동작을 연결합니다. 표본 ${g.input}과 기대 결과 ${g.output}을 계속 제시하므로, 모든 설명을 JavaScript RegExp 엔진에서 직접 재현할 수 있습니다.`,
    paragraph: ({g,t,opener,bridge,action,j}) => `${opener} 핵심 항목은 ${t[j%8]}, ${t[(j+1)%8]}, ${t[(j+2)%8]}, ${t[(j+3)%8]}입니다. 「${g.title}」에서는 표현식 ${g.pattern}을 입력 ${g.input}에 적용해 ${bridge}. ${action} 기준 결과는 ${g.output}이며, ${g.invalidPattern}은 의도적인 반례로 남겨 둡니다. ${t[(j+4)%8]}과 ${t[(j+5)%8]}을 사용해 일치 결과가 달라지는 이유를 설명하고, 다음 단계로 넘어가기 전에 ${t[(j+6)%8]}과 ${t[(j+7)%8]}도 기록합니다. 목표는 기호를 외우는 것이 아니라 현재 브라우저의 JavaScript 엔진에서 같은 결론을 다시 얻는 것입니다.`,
    faq: (g,t) => [
      {question:`${g.title}에서 ${t[0]}은 결과를 어떻게 바꾸나요?`,answer:`${g.pattern}을 ${g.input}에 실행한 뒤 ${t[0]}과 ${t[1]}을 함께 확인하고 정확한 결과 ${g.output}을 비교해야 합니다. 활성 플래그와 JavaScript RegExp 동작을 같은 사례에 기록해야 재현할 수 있습니다.`},
      {question:`${g.invalidPattern}을 반례로 남기는 이유는 무엇인가요?`,answer:`실패 방식이 실제로 보이기 때문입니다. ${g.pattern}과 거의 유효한 입력을 비교하고 첫 거짓 양성 또는 거짓 음성을 찾아 ${t[2]}과 ${t[3]}의 차이로 설명합니다.`},
      {question:`${t[4]}을 확인하기 좋은 경계값은 무엇인가요?`,answer:`요구 범위를 한 단계 벗어난 값에 줄바꿈, Unicode 문자, 빈 값, 추가 구분자 중 관련 항목을 결합합니다. 통과하거나 실패하는 이유가 하나로 명확한 사례가 좋습니다.`},
      {question:`긴 입력에서 ${t[5]}을 사용하기 전에 무엇을 측정해야 하나요?`,answer:`실행 시간, 일치 개수, 화면 결과 제한, 메모리 부담, Worker 시간 제한을 확인합니다. 짧은 입력이 빠르다는 사실만으로 긴 입력이나 공격 입력의 안전성을 판단할 수 없습니다.`},
      {question:`언제 정규식 대신 다른 도구를 선택해야 하나요?`,answer:`중첩 구조, 복잡한 이스케이프, 의미 검증, 엔진 간 이식성이 핵심이 되면 파서나 도메인 라이브러리를 사용합니다. 정규식은 신뢰할 수 있는 좁은 텍스트 계층에만 남기는 편이 좋습니다.`}
    ],
    checklist: (g,t) => [`${t[0]}의 허용 기준을 문장으로 작성하기`,`${g.pattern}과 사용 플래그를 함께 실행하기`,`${t[2]} 주변의 실패 사례 추가하기`,`${t[4]}과 ${t[5]} 결과 확인하기`, `수정할 때마다 ${t[7]} 회귀 검사하기`]
  },
  ja: {
    openers: ["まず", "検討の出発点として", "最初の確認項目として", "実際の入力を基準に", "判断根拠を作るため", "例を読み解く際は", "説明を組み立てる際は", "動作を記録する際は"],
    bridges: ["記号だけで推測せずに確認します", "サンプルを増やす前に検証します", "元の文字列を保ったまま比較します", "エンジンの動作を明示して調べます", "失敗ケースを隠さず対照します", "変更前後を再比較できる形にします", "通常入力と攻撃的入力の両方で試します", "正確な一致境界から分析します"],
    actions: [
      "要件を、受け入れる文字列、拒否する文字列、抽出後に残す値へ分けます。",
      "提示した正規表現をサンプルに実行し、見た目ではなく正確な出力を比較します。",
      "消費される文字、ゼロ幅の条件、グループ、インデックスをトークンごとに説明します。",
      "弱い式と限定した式を同じ入力に適用し、最初に現れる誤判定を記録します。",
      "全体一致、キャプチャ値、位置、空文字、undefined のグループを別の状態として確認します。",
      "フラグは反復、アンカー、Unicode 解釈、インデックスを変えるため、パターンと一緒に記録します。",
      "区切り、長さ、改行、Unicode 境界、末尾文字に近接した境界ケースを追加します。",
      "入力を段階的に長くし、定めた時間を超えたら Worker を終了します。",
      "利用者が明示的に含めない限り、原文を URL、分析、エラー、保存領域へ入れません。",
      "似た記法が同じ意味だと仮定せず、移植先のエンジンで再コンパイルして全ケースを実行します。",
      "限定した正規表現、広すぎる近道、専用パーサーを同じ受入条件で比較します。",
      "見つかった前提を、期待する一致、キャプチャ、置換、拒否を持つ名前付きケースへ変えます。",
      "パターン、フラグ、サンプル、エンジン、採用理由を一緒に保存し、意味のずれをレビューで発見できるようにします。"
    ],
    intro: (g,t) => `${g.description} このガイドでは、${t[0]}、${t[1]}、具体的な式 ${g.pattern} を使って構文とブラウザーの動作を結び付けます。サンプル ${g.input} と期待結果 ${g.output} を示し続けるため、説明を JavaScript RegExp エンジンで再現できます。`,
    paragraph: ({g,t,opener,bridge,action,j}) => `${opener}、中心となる項目は ${t[j%8]}、${t[(j+1)%8]}、${t[(j+2)%8]}、${t[(j+3)%8]} です。「${g.title}」では、式 ${g.pattern} を入力 ${g.input} に適用し、${bridge}。${action} 基準となる結果は ${g.output} で、${g.invalidPattern} は意図的な反例として残します。${t[(j+4)%8]} と ${t[(j+5)%8]} から一致が変わる理由を説明し、次へ進む前に ${t[(j+6)%8]} と ${t[(j+7)%8]} も記録します。目的は記号の暗記ではなく、現在の JavaScript ブラウザーエンジンで同じ判断を再現することです。`,
    faq: (g,t) => [
      {question:`${g.title} で ${t[0]} は結果をどう変えますか。`,answer:`${g.pattern} を ${g.input} に実行し、${t[0]} と ${t[1]} を同時に確認して結果 ${g.output} を比較します。フラグと JavaScript RegExp の意味も同じケースへ記録してください。`},
      {question:`なぜ ${g.invalidPattern} を反例として残すのですか。`,answer:`失敗の形を見えるようにするためです。${g.pattern} とほぼ正しい入力を比較し、最初の偽陽性または偽陰性を ${t[2]} と ${t[3]} の違いで説明します。`},
      {question:`${t[4]} を調べる有効な境界ケースは何ですか。`,answer:`要件の直外にある値へ、必要に応じて改行、Unicode 文字、空値、余分な区切りを加えます。合否の理由が一つに絞れるケースが有効です。`},
      {question:`長い入力で ${t[5]} を使う前に何を測るべきですか。`,answer:`実行時間、一致数、表示上限、メモリ負荷、Worker の時間制限を測ります。短いサンプルが速いだけでは、長い入力や攻撃入力に対する安全性は分かりません。`},
      {question:`どの時点で正規表現以外を選ぶべきですか。`,answer:`入れ子、複雑なエスケープ、意味検証、エンジン間の移植が中心なら、パーサーや専用ライブラリを選びます。正規表現は確実に扱える狭いテキスト層へ限定します。`}
    ],
    checklist: (g,t) => [`${t[0]} の受入条件を文章化する`,`${g.pattern} とフラグを一緒に実行する`,`${t[2]} 周辺の失敗ケースを加える`,`${t[4]} と ${t[5]} を確認する`, `変更ごとに ${t[7]} を回帰確認する`]
  },
  es: {
    openers: ["Empieza por", "Sitúa la revisión en", "Usa como primer control", "Apoya el análisis en", "Toma la decisión desde", "Lee el ejemplo mediante", "Construye la explicación con", "Documenta el comportamiento con"],
    bridges: ["sin adivinar por la forma de los símbolos", "antes de ampliar la muestra", "conservando el texto original", "haciendo explícito el motor", "sin ocultar los casos fallidos", "para comparar cambios posteriores", "con entradas normales y hostiles", "en el límite exacto de la coincidencia"],
    actions: [
      "Divide el requisito en textos aceptados, textos rechazados y valores que deben conservarse tras la extracción.",
      "Ejecuta la expresión sobre la muestra y compara la salida exacta en lugar de confiar en una semejanza visual.",
      "Explica token por token los caracteres consumidos, las aserciones, los grupos y los índices.",
      "Compara la expresión débil con la versión limitada y registra el primer resultado incorrecto de cada una.",
      "Distingue coincidencia completa, capturas, posiciones, cadenas vacías y grupos undefined.",
      "Guarda las banderas junto al patrón porque cambian repetición, anclas, Unicode e índices.",
      "Añade valores casi válidos en delimitadores, longitudes, saltos de línea, límites Unicode y contenido final.",
      "Aumenta gradualmente la entrada y termina el Worker cuando se agote el presupuesto de tiempo.",
      "No incluyas el texto fuente en URL, analítica, errores o almacenamiento salvo elección expresa del usuario.",
      "Vuelve a compilar y ejecutar la suite en el motor de destino; una notación parecida no garantiza igual semántica.",
      "Compara una expresión precisa, un atajo amplio y un parser dedicado contra el mismo contrato de aceptación.",
      "Convierte cada supuesto en un caso con nombre y una coincidencia, captura, sustitución o rechazo esperado.",
      "Guarda patrón, banderas, muestras, motor y motivo para detectar cambios semánticos durante la revisión."
    ],
    intro: (g,t) => `${g.description} La guía utiliza ${t[0]}, ${t[1]} y la expresión concreta ${g.pattern} para relacionar sintaxis y comportamiento observable. La muestra ${g.input} y el resultado ${g.output} permanecen visibles, de modo que cada afirmación puede repetirse con JavaScript RegExp.`,
    paragraph: ({g,t,opener,bridge,action,j}) => `${opener} ${t[j%8]}, ${t[(j+1)%8]}, ${t[(j+2)%8]} y ${t[(j+3)%8]}. En «${g.title}», la expresión ${g.pattern} se comprueba con ${g.input} ${bridge}. ${action} El resultado de referencia es ${g.output}, mientras ${g.invalidPattern} se conserva como contraejemplo deliberado. Usa ${t[(j+4)%8]} y ${t[(j+5)%8]} para explicar por qué cambia la coincidencia, y registra ${t[(j+6)%8]} antes de pasar a ${t[(j+7)%8]}. El objetivo es obtener una decisión reproducible en el motor JavaScript del navegador, no memorizar signos.`,
    faq: (g,t) => [
      {question:`¿Cómo cambia ${t[0]} el resultado en ${g.title}?`,answer:`Ejecuta ${g.pattern} sobre ${g.input}, revisa ${t[0]} junto con ${t[1]} y compara el resultado exacto ${g.output}. Conserva también las banderas y la semántica de JavaScript RegExp.`},
      {question:`¿Por qué se mantiene ${g.invalidPattern} como contraejemplo?`,answer:`Permite observar el modo de fallo. Compáralo con ${g.pattern} sobre una entrada casi válida, localiza el primer falso positivo o falso negativo y explica la diferencia con ${t[2]} y ${t[3]}.`},
      {question:`¿Qué caso límite pone a prueba ${t[4]}?`,answer:`Elige un valor inmediatamente fuera del requisito y añade, cuando proceda, un salto, un carácter Unicode, un valor vacío o un delimitador extra. Debe existir una única razón clara para aceptar o rechazar.`},
      {question:`¿Qué debe medirse antes de usar ${t[5]} con entradas largas?`,answer:`Mide tiempo, número de coincidencias, truncado de resultados, presión de memoria y timeout del Worker. Una muestra corta y rápida no demuestra seguridad ante una cadena larga o hostil.`},
      {question:`¿Cuándo conviene abandonar la expresión regular?`,answer:`Usa un parser o una biblioteca de dominio cuando el anidamiento, los escapes, la validación semántica o la portabilidad sean más importantes que una coincidencia textual compacta.`}
    ],
    checklist: (g,t) => [`Definir la regla de aceptación de ${t[0]}`,`Ejecutar ${g.pattern} con sus banderas`, `Añadir un rechazo cerca de ${t[2]}`, `Revisar ${t[4]} y ${t[5]}`, `Repetir ${t[7]} después de cada cambio`]
  },
  fr: {
    openers: ["Commencez par", "Cadrez la vérification autour de", "Utilisez comme premier contrôle", "Ancrez l’analyse dans", "Fondez la décision sur", "Lisez l’exemple avec", "Construisez l’explication à partir de", "Documentez le comportement avec"],
    bridges: ["sans deviner à partir des symboles", "avant d’élargir l’échantillon", "tout en conservant le texte d’origine", "en rendant le moteur explicite", "sans masquer les cas d’échec", "afin de comparer une modification ultérieure", "avec des entrées ordinaires et hostiles", "à la limite exacte de la correspondance"],
    actions: [
      "Séparez l’exigence en textes acceptés, textes rejetés et valeurs à conserver après extraction.",
      "Exécutez l’expression sur l’échantillon et comparez la sortie exacte plutôt qu’une simple ressemblance visuelle.",
      "Expliquez jeton par jeton les caractères consommés, les assertions, les groupes et les indices.",
      "Comparez l’expression faible à la version étroite et notez le premier résultat erroné produit par chacune.",
      "Distinguez correspondance complète, captures, positions, chaînes vides et groupes undefined.",
      "Conservez les indicateurs avec le motif, car ils modifient répétition, ancres, Unicode et indices.",
      "Ajoutez des valeurs presque valides aux délimiteurs, longueurs, retours à la ligne, limites Unicode et suffixes.",
      "Augmentez progressivement la taille et arrêtez le Worker lorsque le budget de temps est dépassé.",
      "N’insérez pas le texte source dans les URL, analyses, erreurs ou stockages sans choix explicite de l’utilisateur.",
      "Recompilez et rejouez la suite dans le moteur cible au lieu de supposer qu’une notation proche a le même sens.",
      "Comparez une expression étroite, un raccourci large et un analyseur dédié selon le même contrat d’acceptation.",
      "Transformez chaque hypothèse en cas nommé avec correspondance, capture, remplacement ou rejet attendu.",
      "Enregistrez motif, indicateurs, exemples, moteur et justification afin de repérer toute dérive sémantique."
    ],
    intro: (g,t) => `${g.description} Ce guide s’appuie sur ${t[0]}, ${t[1]} et l’expression ${g.pattern} pour relier la syntaxe au comportement observable. L’échantillon ${g.input} et le résultat ${g.output} restent visibles afin que chaque affirmation soit reproductible avec JavaScript RegExp.`,
    paragraph: ({g,t,opener,bridge,action,j}) => `${opener} ${t[j%8]}, ${t[(j+1)%8]}, ${t[(j+2)%8]} et ${t[(j+3)%8]}. Dans « ${g.title} », l’expression ${g.pattern} est testée sur ${g.input} ${bridge}. ${action} Le résultat de référence est ${g.output}, tandis que ${g.invalidPattern} reste un contre-exemple volontaire. Utilisez ${t[(j+4)%8]} et ${t[(j+5)%8]} pour expliquer le changement de correspondance, puis consignez ${t[(j+6)%8]} avant de passer à ${t[(j+7)%8]}. Le but est une décision reproductible dans le moteur JavaScript du navigateur, et non la mémorisation des signes.`,
    faq: (g,t) => [
      {question:`Comment ${t[0]} modifie-t-il le résultat dans ${g.title} ?`,answer:`Exécutez ${g.pattern} sur ${g.input}, examinez ${t[0]} avec ${t[1]} et comparez le résultat exact ${g.output}. Conservez les indicateurs et la sémantique JavaScript RegExp dans le même cas.`},
      {question:`Pourquoi conserver ${g.invalidPattern} comme contre-exemple ?`,answer:`Il rend le mode d’échec visible. Comparez-le à ${g.pattern} sur une entrée presque valide, repérez le premier faux positif ou faux négatif et expliquez l’écart avec ${t[2]} et ${t[3]}.`},
      {question:`Quel cas limite vérifie correctement ${t[4]} ?`,answer:`Choisissez une valeur juste hors de l’exigence, puis ajoutez si nécessaire un retour à la ligne, un caractère Unicode, une valeur vide ou un délimiteur supplémentaire. La raison du résultat doit être unique et claire.`},
      {question:`Que faut-il mesurer avant d’utiliser ${t[5]} sur une longue entrée ?`,answer:`Mesurez le temps, le nombre de résultats, la troncature, la mémoire et le délai du Worker. Un petit exemple rapide ne prouve rien pour une chaîne longue ou hostile.`},
      {question:`Quand faut-il préférer autre chose qu’une regex ?`,answer:`Choisissez un analyseur ou une bibliothèque métier lorsque l’imbrication, les échappements, la validation sémantique ou la portabilité dominent le besoin de correspondance textuelle.`}
    ],
    checklist: (g,t) => [`Définir la règle d’acceptation de ${t[0]}`,`Exécuter ${g.pattern} avec ses indicateurs`, `Ajouter un rejet près de ${t[2]}`, `Examiner ${t[4]} et ${t[5]}`, `Rejouer ${t[7]} après chaque modification`]
  },
  de: {
    openers: ["Beginnen Sie mit", "Richten Sie die Prüfung auf", "Nutzen Sie als ersten Kontrollpunkt", "Verankern Sie die Analyse in", "Leiten Sie die Entscheidung aus", "Lesen Sie das Beispiel über", "Bauen Sie die Erklärung aus", "Dokumentieren Sie das Verhalten mit"],
    bridges: ["statt nur aus Symbolen zu raten", "bevor die Stichprobe erweitert wird", "während der Ursprungstext erhalten bleibt", "mit ausdrücklich genanntem Engine-Verhalten", "ohne fehlgeschlagene Fälle zu verbergen", "damit spätere Änderungen vergleichbar bleiben", "unter normalen und feindlichen Eingaben", "an der exakten Treffergrenze"],
    actions: [
      "Teilen Sie die Anforderung in erlaubte Texte, abgelehnte Texte und nach der Extraktion benötigte Werte.",
      "Führen Sie den Ausdruck mit dem Beispiel aus und vergleichen Sie die exakte Ausgabe statt eines optischen Eindrucks.",
      "Erklären Sie verbrauchte Zeichen, Assertions, Gruppen und Indizes Token für Token.",
      "Vergleichen Sie den schwachen Ausdruck mit der engen Fassung und notieren Sie das erste falsche Ergebnis.",
      "Unterscheiden Sie Gesamttreffer, Erfassungen, Positionen, leere Strings und undefined-Gruppen.",
      "Speichern Sie Flags zusammen mit dem Muster, da sie Wiederholung, Anker, Unicode und Indizes verändern.",
      "Ergänzen Sie beinahe gültige Werte an Trennern, Längen, Zeilenumbrüchen, Unicode-Grenzen und Nachtext.",
      "Vergrößern Sie die Eingabe schrittweise und beenden Sie den Worker nach Überschreiten des Zeitbudgets.",
      "Übernehmen Sie Quelltext nur nach ausdrücklicher Wahl in URL, Analytics, Fehler oder Speicherung.",
      "Kompilieren und testen Sie in der Ziel-Engine erneut, statt ähnliche Schreibweise mit gleicher Semantik gleichzusetzen.",
      "Vergleichen Sie ein enges Muster, eine breite Abkürzung und einen Parser mit demselben Akzeptanzvertrag.",
      "Machen Sie aus jeder Annahme einen benannten Fall mit erwartetem Treffer, Capture, Ersatz oder Ablehnung.",
      "Speichern Sie Muster, Flags, Beispiele, Engine und Begründung gemeinsam, damit Reviews Bedeutungsdrift erkennen."
    ],
    intro: (g,t) => `${g.description} Dieser Leitfaden nutzt ${t[0]}, ${t[1]} und den konkreten Ausdruck ${g.pattern}, um Syntax und sichtbares Browserverhalten zu verbinden. Das Beispiel ${g.input} und das Ergebnis ${g.output} bleiben sichtbar, damit jede Aussage mit JavaScript RegExp wiederholt werden kann.`,
    paragraph: ({g,t,opener,bridge,action,j}) => `${opener} ${t[j%8]}, ${t[(j+1)%8]}, ${t[(j+2)%8]} und ${t[(j+3)%8]}. In „${g.title}“ wird ${g.pattern} mit ${g.input} geprüft, ${bridge}. ${action} Das Referenzergebnis lautet ${g.output}; ${g.invalidPattern} bleibt als bewusstes Gegenbeispiel erhalten. Erklären Sie die Änderung mit ${t[(j+4)%8]} und ${t[(j+5)%8]}, und dokumentieren Sie ${t[(j+6)%8]}, bevor Sie zu ${t[(j+7)%8]} übergehen. Ziel ist eine reproduzierbare Entscheidung in der aktuellen JavaScript-Browser-Engine, nicht das Auswendiglernen von Zeichen.`,
    faq: (g,t) => [
      {question:`Wie verändert ${t[0]} das Ergebnis in ${g.title}?`,answer:`Führen Sie ${g.pattern} mit ${g.input} aus, prüfen Sie ${t[0]} zusammen mit ${t[1]} und vergleichen Sie ${g.output}. Flags und JavaScript-RegExp-Semantik gehören in denselben Testfall.`},
      {question:`Warum bleibt ${g.invalidPattern} als Gegenbeispiel erhalten?`,answer:`So wird der Fehlermodus sichtbar. Vergleichen Sie es mit ${g.pattern} an einer fast gültigen Eingabe, finden Sie den ersten falsch positiven oder negativen Fall und erklären Sie ihn über ${t[2]} und ${t[3]}.`},
      {question:`Welcher Grenzfall prüft ${t[4]} besonders gut?`,answer:`Wählen Sie einen Wert knapp außerhalb der Anforderung und ergänzen Sie je nach Thema Zeilenumbruch, Unicode-Zeichen, Leerwert oder zusätzlichen Trenner. Der Grund für Annahme oder Ablehnung sollte eindeutig sein.`},
      {question:`Was ist vor dem Einsatz von ${t[5]} bei langen Eingaben zu messen?`,answer:`Messen Sie Laufzeit, Trefferzahl, Ergebnisbegrenzung, Speicherlast und Worker-Zeitlimit. Ein schnelles kurzes Beispiel beweist keine Sicherheit für lange oder feindliche Strings.`},
      {question:`Wann ist ein anderes Werkzeug als Regex sinnvoll?`,answer:`Nutzen Sie Parser oder Fachbibliotheken, wenn Verschachtelung, Escaping, semantische Prüfung oder Portabilität wichtiger werden als ein kompakter Texttreffer.`}
    ],
    checklist: (g,t) => [`Akzeptanzregel für ${t[0]} formulieren`,`${g.pattern} mit allen Flags ausführen`, `Ablehnungsfall bei ${t[2]} ergänzen`, `${t[4]} und ${t[5]} prüfen`, `${t[7]} nach jeder Änderung wiederholen`]
  }
};

for (const [locale, guides] of Object.entries(data)) {
  const cfg = localeData[locale];
  if (!cfg) throw new Error(`No locale templates for ${locale}`);
  for (const [index, slug] of slugs.entries()) {
    const g = guides[slug];
    const terms = termSets[locale][slug];
    if (!g || !terms) throw new Error(`Missing guide or terms: ${locale}/${slug}`);
    g.intro = cfg.intro(g, terms);
    const original = [...g.sections];
    const middle = original.slice(4,10);
    const shift = index % middle.length;
    const reordered = [original[0],original[1],original[2],original[3],...middle.slice(shift),...middle.slice(0,shift),original[10],original[11],original[12]];
    g.sections = reordered.map((section,j) => ({
      heading: section.heading,
      paragraphs: [cfg.paragraph({
        g,
        t: terms,
        opener: cfg.openers[(index+j)%cfg.openers.length],
        bridge: cfg.bridges[(index*3+j)%cfg.bridges.length],
        action: cfg.actions[j],
        j
      })]
    }));
    g.faq = cfg.faq(g, terms, index);
    g.checklist = cfg.checklist(g, terms);
    g.table.rows = [
      [g.pattern, `${terms[0]} + ${terms[1]}`, `${terms[6]} / ${terms[7]}`],
      [g.invalidPattern, `${terms[2]} + ${terms[3]}`, `${terms[4]} / ${terms[5]}`],
      [locale === "ko" ? "전용 파서 또는 도메인 라이브러리" : locale === "ja" ? "専用パーサーまたはドメインライブラリ" : locale === "es" ? "Parser o biblioteca de dominio" : locale === "fr" ? "Analyseur ou bibliothèque métier" : locale === "de" ? "Parser oder Fachbibliothek" : "Dedicated parser or domain library", terms.slice(0,4).join(", "), terms.slice(4).join(", ")]
    ];
  }
}

fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
console.log(`Rebuilt ${slugs.length * Object.keys(data).length} localized guides with topic-specific sections and FAQs.`);
