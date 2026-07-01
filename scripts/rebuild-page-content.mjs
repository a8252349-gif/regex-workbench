import fs from "node:fs";
import path from "node:path";

const file = path.join(process.cwd(), "src/content/page-content.generated.json");
const data = JSON.parse(fs.readFileSync(file, "utf8"));
const pages = ["home","tester","replace","extract","file-filter","explainer","cheat-sheet","guides","resources","how-it-works","faq","about","contact","privacy","terms","cookies","accessibility","editorial-policy","security","methodology"];
const groups = {
  home:"reference", tester:"tool", replace:"tool", extract:"tool", "file-filter":"tool", explainer:"tool",
  "cheat-sheet":"reference", guides:"reference", resources:"reference", "how-it-works":"trust", faq:"reference",
  about:"trust", contact:"trust", privacy:"policy", terms:"policy", cookies:"policy", accessibility:"trust",
  "editorial-policy":"trust", security:"trust", methodology:"trust"
};

const termSets = {
  en: {
    home:["live regex testing","capture-group inspection","replacement preview","value extraction","local file filtering","pattern explanation","backtracking warning","private browser processing"],
    tester:["pattern source","browser-supported flags","highlighted match range","numbered capture","named capture","line and column","zero-width match","Worker timeout"],
    replace:["replacement template","whole-match token $&","numbered token $1","named token $<name>","literal dollar $$","first or global replacement","unchanged source text","downloadable result"],
    extract:["full match","selected capture group","named capture","matching line","non-matching line","unique-value filter","CSV or JSON output","original ordering"],
    "file-filter":["TXT and LOG input","CSV and JSONL text","25 MB standard limit","100 MB advanced limit","line-by-line result","cancelable Worker task","per-file status","ZIP export"],
    explainer:["tokenized pattern","anchor","character class","quantifier","lookaround assertion","backreference","accessible SVG flow","unexplained syntax notice"],
    "cheat-sheet":["literal and escape","character class","anchor and boundary","group syntax","quantifier behavior","lookaround form","JavaScript flags","replacement tokens"],
    guides:["fifteen guide topics","tested JavaScript example","negative case","comparison table","review checklist","topic-specific FAQ","related-guide links","last-reviewed date"],
    resources:["regex escape tool","flags explorer","match exporter","complexity inspector","pattern library","success sample","failure sample","known limitation"],
    "how-it-works":["URL locale","JavaScript RegExp","Web Worker","timeout termination","localStorage choice","share-link limit","static HTML metadata","exported static site"],
    faq:["engine scope","file privacy","flag support","capture behavior","timeout meaning","shared URL","local data deletion","cross-engine portability"],
    about:["project purpose","JavaScript focus","local-first design","tool boundaries","documentation updates","error correction","advertising separation","operator transparency"],
    contact:["report category","reproduction steps","browser version","page URL","expected behavior","observed behavior","sensitive-data removal","reply address"],
    privacy:["local regex execution","uploaded-file handling","localStorage entries","shared-link contents","analytics minimization","advertising cookies","browser extensions","data deletion"],
    terms:["permitted use","user-provided patterns","no account service","availability changes","intellectual property","third-party services","limitation of warranty","local-law rights"],
    cookies:["necessary storage","preference storage","analytics category","advertising category","Google CMP","consent choice","browser controls","settings withdrawal"],
    accessibility:["keyboard navigation","visible focus","44-pixel target","programmatic label","aria-live status","non-color match cue","reduced motion","text alternative"],
    "editorial-policy":["source verification","executable example","browser compatibility","translation review","revision date","correction process","advertising separation","unsupported-claim ban"],
    security:["Worker isolation","execution timeout","input cap","result cap","HTML escaping","object URL cleanup","filename sanitization","heuristic risk warning"],
    methodology:["RegExp compilation","flag normalization","matchAll condition","zero-width advancement","UTF-16 index","line-column calculation","parser coverage","risk-analysis limits"]
  },
  ko: {
    home:["실시간 정규식 테스트","캡처 그룹 확인","치환 결과 미리보기","값 추출","로컬 파일 필터","패턴 설명","백트래킹 경고","브라우저 로컬 처리"],
    tester:["패턴 원문","브라우저 지원 플래그","강조된 일치 범위","번호 캡처","이름 있는 캡처","줄과 열 위치","폭이 0인 일치","Worker 시간 제한"],
    replace:["치환 템플릿","전체 일치 토큰 $&","번호 토큰 $1","이름 토큰 $<name>","리터럴 달러 $$","첫 일치와 전체 치환","보존되는 원문","다운로드 결과"],
    extract:["전체 일치","선택 캡처 그룹","이름 있는 캡처","일치한 줄","일치하지 않은 줄","고유값 필터","CSV·JSON 출력","원래 순서"],
    "file-filter":["TXT·LOG 입력","CSV·JSONL 텍스트","기본 25MB 제한","고급 100MB 제한","줄 단위 결과","취소 가능한 Worker","파일별 상태","ZIP 내보내기"],
    explainer:["토큰화된 패턴","앵커","문자 클래스","수량자","전후방 탐색","역참조","접근 가능한 SVG 흐름","설명 불가 문법 안내"],
    "cheat-sheet":["리터럴과 이스케이프","문자 클래스","앵커와 경계","그룹 문법","수량자 동작","전후방 탐색 형식","JavaScript 플래그","치환 토큰"],
    guides:["15개 가이드 주제","검증된 JavaScript 예제","실패 사례","비교표","검토 체크리스트","주제별 FAQ","관련 글 링크","마지막 검토일"],
    resources:["정규식 이스케이프 도구","플래그 탐색기","일치 결과 내보내기","복잡도 검사기","패턴 라이브러리","성공 예제","실패 예제","알려진 한계"],
    "how-it-works":["URL 언어값","JavaScript RegExp","Web Worker","시간 초과 종료","localStorage 선택","공유 링크 제한","정적 HTML 메타데이터","정적 사이트 내보내기"],
    faq:["엔진 범위","파일 개인정보","플래그 지원","캡처 동작","시간 제한 의미","공유 URL","로컬 데이터 삭제","엔진 간 이식"],
    about:["프로젝트 목적","JavaScript 중심 설계","로컬 우선 처리","도구의 경계","문서 업데이트","오류 수정","광고와 편집 분리","운영 투명성"],
    contact:["제보 유형","재현 단계","브라우저 버전","문제가 있는 URL","기대 동작","실제 동작","민감정보 제거","회신 주소"],
    privacy:["로컬 정규식 실행","업로드 파일 처리","localStorage 항목","공유 링크 내용","분석 데이터 최소화","광고 쿠키","브라우저 확장 프로그램","데이터 삭제"],
    terms:["허용된 이용","사용자 입력 패턴","계정 없는 서비스","가용성 변경","지식재산권","제3자 서비스","보증 제한","지역 법률상 권리"],
    cookies:["필수 저장소","환경설정 저장","분석 범주","광고 범주","Google CMP","동의 선택","브라우저 제어","설정 철회"],
    accessibility:["키보드 탐색","보이는 포커스","44픽셀 터치 영역","프로그램 방식 라벨","aria-live 상태","색상 외 일치 표시","동작 감소","텍스트 대체 설명"],
    "editorial-policy":["출처 확인","실행 가능한 예제","브라우저 호환성","번역 검토","수정 날짜","오류 정정 절차","광고와 콘텐츠 분리","근거 없는 주장 금지"],
    security:["Worker 격리","실행 시간 제한","입력 길이 제한","결과 개수 제한","HTML 이스케이프","Object URL 정리","파일명 정제","휴리스틱 위험 경고"],
    methodology:["RegExp 컴파일","플래그 정규화","matchAll 사용 조건","폭이 0인 일치 이동","UTF-16 인덱스","줄·열 계산","설명 파서 범위","위험 분석 한계"]
  },
  ja: {
    home:["リアルタイム正規表現テスト","キャプチャグループ確認","置換結果プレビュー","値の抽出","ローカルファイルフィルター","パターン説明","バックトラック警告","ブラウザー内処理"],
    tester:["パターン本体","対応フラグ","強調された一致範囲","番号付きキャプチャ","名前付きキャプチャ","行と列","ゼロ幅一致","Worker タイムアウト"],
    replace:["置換テンプレート","全体一致トークン $&","番号トークン $1","名前トークン $<name>","リテラルドル $$","最初または全体の置換","保持される原文","ダウンロード結果"],
    extract:["全体一致","選択キャプチャ","名前付きキャプチャ","一致行","不一致行","重複除去","CSV・JSON 出力","元の順序"],
    "file-filter":["TXT・LOG 入力","CSV・JSONL テキスト","標準 25MB 上限","高度 100MB 上限","行単位の結果","中止可能な Worker","ファイル別状態","ZIP 出力"],
    explainer:["トークン化パターン","アンカー","文字クラス","量指定子","前後読みアサーション","後方参照","アクセス可能な SVG フロー","未解釈構文の通知"],
    "cheat-sheet":["リテラルとエスケープ","文字クラス","アンカーと境界","グループ構文","量指定子の動作","前後読み形式","JavaScript フラグ","置換トークン"],
    guides:["15のガイド主題","検証済み JavaScript 例","失敗ケース","比較表","確認リスト","主題別 FAQ","関連記事リンク","最終確認日"],
    resources:["正規表現エスケープツール","フラグ探索","一致結果エクスポート","複雑度検査","パターン集","成功例","失敗例","既知の制限"],
    "how-it-works":["URL ロケール","JavaScript RegExp","Web Worker","時間超過終了","localStorage の選択","共有リンク制限","静的 HTML メタデータ","静的サイト出力"],
    faq:["エンジン範囲","ファイルのプライバシー","フラグ対応","キャプチャ動作","タイムアウトの意味","共有 URL","ローカルデータ削除","エンジン間移植"],
    about:["プロジェクト目的","JavaScript への集中","ローカル優先設計","機能の境界","文書更新","誤りの訂正","広告と編集の分離","運営の透明性"],
    contact:["報告の種類","再現手順","ブラウザー版","対象 URL","期待動作","実際の動作","機密情報の除去","返信先"],
    privacy:["ローカル正規表現実行","アップロードファイル処理","localStorage 項目","共有リンク内容","分析データ最小化","広告 Cookie","ブラウザー拡張","データ削除"],
    terms:["許可された利用","利用者のパターン","アカウントなしの提供","可用性の変更","知的財産","第三者サービス","保証の制限","地域法上の権利"],
    cookies:["必須ストレージ","設定保存","分析カテゴリ","広告カテゴリ","Google CMP","同意の選択","ブラウザー制御","設定の撤回"],
    accessibility:["キーボード操作","可視フォーカス","44ピクセルの対象","プログラム上のラベル","aria-live 状態","色以外の一致表示","動きの軽減","テキスト代替"],
    "editorial-policy":["情報源の確認","実行可能な例","ブラウザー互換性","翻訳確認","改訂日","訂正手順","広告と記事の分離","根拠のない主張の禁止"],
    security:["Worker 分離","実行時間制限","入力上限","結果上限","HTML エスケープ","Object URL 解放","ファイル名の無害化","ヒューリスティック警告"],
    methodology:["RegExp コンパイル","フラグ正規化","matchAll 条件","ゼロ幅一致の前進","UTF-16 インデックス","行列計算","説明パーサー範囲","危険分析の限界"]
  },
  es: {
    home:["prueba regex en vivo","inspección de capturas","vista previa de reemplazo","extracción de valores","filtro de archivos locales","explicación del patrón","aviso de retroceso","proceso privado en el navegador"],
    tester:["fuente del patrón","banderas compatibles","rango resaltado","captura numerada","captura con nombre","línea y columna","coincidencia de ancho cero","timeout del Worker"],
    replace:["plantilla de reemplazo","token completo $&","token numerado $1","token con nombre $<name>","dólar literal $$","primera o todas las sustituciones","texto fuente intacto","resultado descargable"],
    extract:["coincidencia completa","grupo seleccionado","captura con nombre","línea coincidente","línea no coincidente","valores únicos","salida CSV o JSON","orden original"],
    "file-filter":["entrada TXT y LOG","texto CSV y JSONL","límite normal de 25 MB","límite avanzado de 100 MB","resultado por línea","Worker cancelable","estado por archivo","exportación ZIP"],
    explainer:["patrón tokenizado","ancla","clase de caracteres","cuantificador","aserción lookaround","referencia inversa","flujo SVG accesible","aviso de sintaxis no explicada"],
    "cheat-sheet":["literal y escape","clase de caracteres","ancla y límite","sintaxis de grupos","comportamiento de cuantificadores","forma lookaround","banderas JavaScript","tokens de reemplazo"],
    guides:["quince temas","ejemplo JavaScript probado","caso negativo","tabla comparativa","lista de revisión","FAQ por tema","enlaces relacionados","fecha de revisión"],
    resources:["herramienta de escape","explorador de banderas","exportador de coincidencias","inspector de complejidad","biblioteca de patrones","ejemplo válido","ejemplo inválido","limitación conocida"],
    "how-it-works":["idioma de la URL","JavaScript RegExp","Web Worker","terminación por tiempo","elección de localStorage","límite del enlace compartido","metadatos HTML estáticos","exportación estática"],
    faq:["alcance del motor","privacidad de archivos","compatibilidad de banderas","comportamiento de capturas","significado del timeout","URL compartida","borrado local","portabilidad entre motores"],
    about:["objetivo del proyecto","enfoque JavaScript","diseño local primero","límites de la herramienta","actualización documental","corrección de errores","separación publicitaria","transparencia operativa"],
    contact:["tipo de informe","pasos de reproducción","versión del navegador","URL afectada","comportamiento esperado","comportamiento observado","eliminación de datos sensibles","dirección de respuesta"],
    privacy:["ejecución regex local","tratamiento de archivos","elementos localStorage","contenido del enlace","analítica mínima","cookies publicitarias","extensiones del navegador","eliminación de datos"],
    terms:["uso permitido","patrones del usuario","servicio sin cuenta","cambios de disponibilidad","propiedad intelectual","servicios de terceros","límite de garantía","derechos legales locales"],
    cookies:["almacenamiento necesario","preferencias","categoría analítica","categoría publicitaria","Google CMP","elección de consentimiento","control del navegador","retirada de ajustes"],
    accessibility:["navegación por teclado","foco visible","objetivo de 44 píxeles","etiqueta programática","estado aria-live","señal no cromática","movimiento reducido","alternativa textual"],
    "editorial-policy":["verificación de fuentes","ejemplo ejecutable","compatibilidad del navegador","revisión de traducción","fecha de revisión","proceso de corrección","separación de anuncios","prohibición de afirmaciones sin apoyo"],
    security:["aislamiento en Worker","límite de ejecución","límite de entrada","límite de resultados","escape HTML","limpieza de Object URL","saneamiento del nombre","aviso heurístico"],
    methodology:["compilación RegExp","normalización de banderas","condición de matchAll","avance de ancho cero","índice UTF-16","cálculo de línea y columna","cobertura del parser","límites del análisis de riesgo"]
  },
  fr: {
    home:["test regex en direct","inspection des captures","aperçu du remplacement","extraction de valeurs","filtre de fichiers locaux","explication du motif","alerte de retour arrière","traitement privé dans le navigateur"],
    tester:["source du motif","indicateurs pris en charge","plage surlignée","capture numérotée","capture nommée","ligne et colonne","correspondance de largeur nulle","délai du Worker"],
    replace:["modèle de remplacement","jeton total $&","jeton numéroté $1","jeton nommé $<name>","dollar littéral $$","premier ou tous les remplacements","texte source intact","résultat téléchargeable"],
    extract:["correspondance complète","groupe choisi","capture nommée","ligne correspondante","ligne non correspondante","valeurs uniques","sortie CSV ou JSON","ordre initial"],
    "file-filter":["entrée TXT et LOG","texte CSV et JSONL","limite standard de 25 Mo","limite avancée de 100 Mo","résultat par ligne","Worker annulable","état par fichier","export ZIP"],
    explainer:["motif tokenisé","ancre","classe de caractères","quantificateur","assertion lookaround","référence arrière","flux SVG accessible","avis de syntaxe inexpliquée"],
    "cheat-sheet":["littéral et échappement","classe de caractères","ancre et frontière","syntaxe des groupes","comportement des quantificateurs","forme lookaround","indicateurs JavaScript","jetons de remplacement"],
    guides:["quinze sujets","exemple JavaScript testé","cas négatif","tableau comparatif","liste de contrôle","FAQ propre au sujet","liens associés","date de révision"],
    resources:["outil d’échappement","explorateur d’indicateurs","exportateur de résultats","inspecteur de complexité","bibliothèque de motifs","exemple valide","exemple invalide","limite connue"],
    "how-it-works":["langue de l’URL","JavaScript RegExp","Web Worker","arrêt sur délai","choix localStorage","limite du lien partagé","métadonnées HTML statiques","export de site statique"],
    faq:["portée du moteur","confidentialité des fichiers","prise en charge des indicateurs","comportement des captures","sens du délai","URL partagée","suppression locale","portabilité entre moteurs"],
    about:["objectif du projet","centrage JavaScript","conception locale d’abord","limites de l’outil","mise à jour documentaire","correction des erreurs","séparation publicitaire","transparence de l’exploitation"],
    contact:["type de signalement","étapes de reproduction","version du navigateur","URL concernée","résultat attendu","résultat observé","retrait des données sensibles","adresse de réponse"],
    privacy:["exécution regex locale","traitement des fichiers","éléments localStorage","contenu du lien partagé","analytique minimale","cookies publicitaires","extensions du navigateur","suppression des données"],
    terms:["usage autorisé","motifs fournis par l’utilisateur","service sans compte","modification de disponibilité","propriété intellectuelle","services tiers","limite de garantie","droits prévus par la loi locale"],
    cookies:["stockage nécessaire","préférences","catégorie analytique","catégorie publicitaire","Google CMP","choix du consentement","contrôle du navigateur","retrait des réglages"],
    accessibility:["navigation au clavier","focus visible","cible de 44 pixels","libellé programmatique","état aria-live","indice non colorimétrique","mouvement réduit","alternative textuelle"],
    "editorial-policy":["vérification des sources","exemple exécutable","compatibilité navigateur","révision des traductions","date de révision","processus de correction","séparation des annonces","interdiction des affirmations non étayées"],
    security:["isolation Worker","limite d’exécution","limite d’entrée","limite de résultats","échappement HTML","nettoyage Object URL","nettoyage du nom de fichier","alerte heuristique"],
    methodology:["compilation RegExp","normalisation des indicateurs","condition matchAll","avance de largeur nulle","indice UTF-16","calcul ligne-colonne","couverture de l’analyseur","limites de l’analyse de risque"]
  },
  de: {
    home:["Live-Regex-Test","Capture-Prüfung","Ersetzungsvorschau","Werteextraktion","lokaler Dateifilter","Mustererklärung","Backtracking-Warnung","private Browser-Verarbeitung"],
    tester:["Musterquelle","unterstützte Flags","markierter Trefferbereich","nummeriertes Capture","benanntes Capture","Zeile und Spalte","Nullbreiten-Treffer","Worker-Zeitlimit"],
    replace:["Ersetzungsvorlage","Gesamttreffer $&","nummeriertes Token $1","benanntes Token $<name>","literales Dollarzeichen $$","erste oder globale Ersetzung","unveränderter Quelltext","herunterladbares Ergebnis"],
    extract:["Gesamttreffer","gewählte Capture-Gruppe","benanntes Capture","passende Zeile","nicht passende Zeile","eindeutige Werte","CSV- oder JSON-Ausgabe","ursprüngliche Reihenfolge"],
    "file-filter":["TXT- und LOG-Eingabe","CSV- und JSONL-Text","25-MB-Standardgrenze","100-MB-Erweiterungsgrenze","zeilenweises Ergebnis","abbrechbarer Worker","Dateistatus","ZIP-Export"],
    explainer:["tokenisiertes Muster","Anker","Zeichenklasse","Quantifizierer","Lookaround-Assertion","Rückreferenz","zugänglicher SVG-Ablauf","Hinweis auf unerklärte Syntax"],
    "cheat-sheet":["Literal und Escape","Zeichenklasse","Anker und Grenze","Gruppensyntax","Quantifiziererverhalten","Lookaround-Form","JavaScript-Flags","Ersetzungs-Token"],
    guides:["fünfzehn Themen","geprüftes JavaScript-Beispiel","Negativfall","Vergleichstabelle","Prüfliste","themenspezifische FAQ","verwandte Links","Prüfdatum"],
    resources:["Regex-Escape-Werkzeug","Flag-Explorer","Trefferexport","Komplexitätsprüfung","Musterbibliothek","Erfolgsbeispiel","Fehlerbeispiel","bekannte Grenze"],
    "how-it-works":["URL-Sprache","JavaScript RegExp","Web Worker","Abbruch bei Zeitüberschreitung","localStorage-Wahl","Grenze geteilter Links","statische HTML-Metadaten","statischer Export"],
    faq:["Engine-Umfang","Dateiprivatsphäre","Flag-Unterstützung","Capture-Verhalten","Bedeutung des Zeitlimits","geteilte URL","lokale Löschung","Portierung zwischen Engines"],
    about:["Projektzweck","JavaScript-Schwerpunkt","lokaler Entwurf","Werkzeuggrenzen","Dokumentationspflege","Fehlerkorrektur","Trennung von Werbung","Betriebstransparenz"],
    contact:["Meldungstyp","Reproduktionsschritte","Browserversion","betroffene URL","erwartetes Verhalten","beobachtetes Verhalten","Entfernung sensibler Daten","Antwortadresse"],
    privacy:["lokale Regex-Ausführung","Dateiverarbeitung","localStorage-Einträge","Inhalt geteilter Links","minimierte Analytics","Werbe-Cookies","Browsererweiterungen","Datenlöschung"],
    terms:["erlaubte Nutzung","Nutzermuster","Dienst ohne Konto","Verfügbarkeitsänderung","geistiges Eigentum","Drittdienste","Gewährleistungsgrenze","Rechte nach lokalem Recht"],
    cookies:["notwendige Speicherung","Präferenzen","Analytics-Kategorie","Werbekategorie","Google CMP","Einwilligungswahl","Browsersteuerung","Widerruf von Einstellungen"],
    accessibility:["Tastaturnavigation","sichtbarer Fokus","44-Pixel-Ziel","programmatische Beschriftung","aria-live-Status","nichtfarblicher Trefferhinweis","reduzierte Bewegung","Textalternative"],
    "editorial-policy":["Quellenprüfung","ausführbares Beispiel","Browserkompatibilität","Übersetzungsprüfung","Revisionsdatum","Korrekturprozess","Trennung von Anzeigen","Verbot unbelegter Aussagen"],
    security:["Worker-Isolation","Ausführungszeitlimit","Eingabegrenze","Ergebnisgrenze","HTML-Escaping","Object-URL-Bereinigung","Dateinamenbereinigung","heuristische Warnung"],
    methodology:["RegExp-Kompilierung","Flag-Normalisierung","matchAll-Bedingung","Nullbreiten-Fortschritt","UTF-16-Index","Zeilen-Spalten-Berechnung","Parser-Abdeckung","Grenzen der Risikoanalyse"]
  }
};

const cfg = {
  en:{labels:["Scope","Primary workflow","Inputs and boundaries","Results and decisions","Common failure","Browser and engine limits","Local data handling","Performance controls","Accessible operation","Verification checklist","When to escalate","Review and updates"],openers:["Start with","Organize the page around","Treat as a concrete control","Document","Compare","Verify","Separate","Review"],group:{tool:"The interactive control keeps source, settings, and output close enough to inspect one decision at a time.",reference:"The reference material connects concise definitions with runnable examples and links to deeper guidance.",trust:"The trust page states what the site does, what it does not do, and how a visitor can verify those boundaries.",policy:"The policy distinguishes browser-local behavior, optional third-party services, user choices, and limits outside the operator’s control."}},
  ko:{labels:["적용 범위","주요 사용 흐름","입력과 경계값","결과와 판단","흔한 실패","브라우저·엔진 한계","로컬 데이터 처리","성능 제어","접근 가능한 사용","검증 체크리스트","다른 도구가 필요한 경우","검토와 업데이트"],openers:["먼저","이 페이지는","구체적인 확인 항목으로","문서화할 때","비교할 때","검증할 때","서로 구분할 때","마지막으로"],group:{tool:"대화형 도구는 원문·설정·결과를 가까이 배치해 한 번에 하나의 판단을 확인하도록 구성합니다.",reference:"참고 자료는 짧은 정의를 실행 가능한 예제와 연결하고 더 깊은 가이드로 이동할 수 있게 합니다.",trust:"신뢰 페이지는 사이트가 수행하는 일과 수행하지 않는 일을 구분하고 사용자가 그 경계를 확인하는 방법을 밝힙니다.",policy:"정책 페이지는 브라우저 로컬 동작, 선택적 제3자 서비스, 사용자 선택, 운영자가 통제할 수 없는 범위를 구분합니다."}},
  ja:{labels:["適用範囲","基本の流れ","入力と境界","結果と判断","よくある失敗","ブラウザーとエンジンの制限","ローカルデータ処理","性能制御","アクセシブルな操作","確認リスト","別の手段が必要な場合","見直しと更新"],openers:["まず","このページでは","具体的な確認項目として","記録するときは","比較するときは","検証するときは","区別するときは","最後に"],group:{tool:"対話型ツールは原文、設定、結果を近くに置き、一つずつ判断を確認できるようにします。",reference:"参考資料は短い定義を実行可能な例と結び付け、詳細なガイドへ移動できるようにします。",trust:"信頼情報ページはサイトが行うことと行わないことを分け、その境界を利用者が確認する方法を示します。",policy:"方針ページはブラウザー内の動作、任意の第三者サービス、利用者の選択、運営者が制御できない範囲を分けます。"}},
  es:{labels:["Alcance","Flujo principal","Entradas y límites","Resultados y decisiones","Fallo habitual","Límites del navegador y motor","Tratamiento local","Controles de rendimiento","Uso accesible","Lista de verificación","Cuándo escalar","Revisión y cambios"],openers:["Empieza por","Organiza la página alrededor de","Usa como control concreto","Documenta","Compara","Verifica","Separa","Revisa"],group:{tool:"El control interactivo mantiene fuente, ajustes y salida próximos para revisar una decisión cada vez.",reference:"El material de referencia une definiciones breves con ejemplos ejecutables y enlaces a guías más profundas.",trust:"La página de confianza indica qué hace el sitio, qué no hace y cómo puede verificarse ese límite.",policy:"La política distingue el comportamiento local, los servicios opcionales de terceros, las elecciones del usuario y los límites externos."}},
  fr:{labels:["Périmètre","Flux principal","Entrées et limites","Résultats et décisions","Erreur fréquente","Limites du navigateur et du moteur","Traitement local","Contrôles de performance","Utilisation accessible","Liste de vérification","Quand changer d’outil","Révision et mises à jour"],openers:["Commencez par","Organisez la page autour de","Utilisez comme contrôle concret","Documentez","Comparez","Vérifiez","Séparez","Réexaminez"],group:{tool:"Le contrôle interactif rapproche la source, les réglages et la sortie afin d’examiner une décision à la fois.",reference:"La documentation relie des définitions courtes à des exemples exécutables et à des guides plus approfondis.",trust:"La page de confiance indique ce que le site fait, ce qu’il ne fait pas et comment vérifier cette frontière.",policy:"La politique distingue le comportement local, les services tiers facultatifs, les choix de l’utilisateur et les limites externes."}},
  de:{labels:["Geltungsbereich","Hauptablauf","Eingaben und Grenzen","Ergebnisse und Entscheidungen","Häufiger Fehler","Browser- und Engine-Grenzen","Lokale Datenverarbeitung","Leistungskontrollen","Zugängliche Bedienung","Prüfliste","Wann ein anderes Werkzeug nötig ist","Prüfung und Aktualisierung"],openers:["Beginnen Sie mit","Ordnen Sie die Seite um","Nutzen Sie als konkrete Kontrolle","Dokumentieren Sie","Vergleichen Sie","Prüfen Sie","Trennen Sie","Überarbeiten Sie"],group:{tool:"Das interaktive Werkzeug hält Quelle, Einstellungen und Ausgabe zusammen, damit jeweils eine Entscheidung geprüft werden kann.",reference:"Das Referenzmaterial verbindet kurze Definitionen mit ausführbaren Beispielen und vertiefenden Leitfäden.",trust:"Die Vertrauensseite nennt, was die Website tut, was sie nicht tut und wie diese Grenzen geprüft werden können.",policy:"Die Richtlinie trennt lokale Browservorgänge, optionale Drittdienste, Nutzerentscheidungen und externe Grenzen."}}
};

const actions = {
  en:["Define the page’s purpose before choosing a control or accepting a result.","Follow a repeatable order and preserve enough context to reproduce the outcome.","Use explicit limits and near-boundary examples rather than relying on a pleasant sample.","Read outputs as evidence, including absence, truncation, optional values, and error states.","Keep a counterexample nearby because it exposes broad assumptions faster than another success.","Treat browser support and JavaScript semantics as part of the documented behavior.","Identify what remains on the device, what may be stored, and what a third party could receive.","Set time, size, and result limits that fail visibly instead of silently dropping work.","Provide labels, keyboard access, status announcements, and non-color cues for the same task.","Convert every important claim into a check that can be repeated after a change.","Choose a parser, domain library, support channel, or policy review when the page’s scope is exceeded.","Record the review date, correction path, and reason for material changes."],
  ko:["도구나 결과를 선택하기 전에 이 페이지가 해결해야 할 목적을 먼저 정의합니다.","같은 결과를 재현할 수 있도록 일정한 순서와 필요한 맥락을 남깁니다.","보기 좋은 한 사례에 의존하지 말고 명시적인 제한과 경계값 인접 사례를 사용합니다.","값의 부재, 잘림, 선택값, 오류 상태까지 결과의 근거로 읽습니다.","성공 사례를 하나 더 추가하기보다 반례를 가까이 두어 넓은 가정을 빠르게 드러냅니다.","브라우저 지원과 JavaScript 의미를 문서화된 동작의 일부로 취급합니다.","기기에 남는 정보, 저장될 수 있는 정보, 제3자에게 전달될 수 있는 정보를 구분합니다.","시간·크기·결과 제한을 정하고 작업이 조용히 사라지지 않도록 명확한 상태를 표시합니다.","같은 작업에 라벨, 키보드 접근, 상태 알림, 색상 외 단서를 제공합니다.","중요한 주장을 변경 후에도 반복할 수 있는 검사 항목으로 바꿉니다.","범위를 넘으면 파서, 도메인 라이브러리, 문의 채널, 정책 검토를 선택합니다.","검토 날짜, 정정 경로, 중요한 변경 이유를 기록합니다."],
  ja:["操作や結果を選ぶ前に、このページが解決する目的を定義します。","同じ結果を再現できる順序と文脈を残します。","都合のよい一例ではなく、明示した上限と境界付近の例を使います。","値の欠如、切り詰め、任意値、エラー状態も結果の根拠として読みます。","成功例を増やすだけでなく反例を置き、広すぎる前提を早く見つけます。","ブラウザー対応と JavaScript の意味を文書化した動作の一部として扱います。","端末に残る情報、保存される情報、第三者へ渡り得る情報を分けます。","時間、サイズ、結果数の上限を設け、静かに失敗させず状態を示します。","同じ作業にラベル、キーボード操作、状態通知、色以外の手掛かりを用意します。","重要な主張を変更後にも繰り返せる確認項目へ変えます。","範囲を超えたらパーサー、専門ライブラリ、連絡窓口、方針確認を選びます。","確認日、訂正経路、重要な変更理由を記録します。"],
  es:["Define el propósito de la página antes de elegir un control o aceptar un resultado.","Sigue un orden repetible y conserva contexto suficiente para reproducir el resultado.","Usa límites explícitos y casos cercanos al borde, no solo una muestra cómoda.","Lee como evidencia la ausencia, el truncado, los valores opcionales y los errores.","Mantén un contraejemplo cerca para revelar supuestos amplios con rapidez.","Incluye la compatibilidad del navegador y la semántica JavaScript en el comportamiento documentado.","Distingue qué queda en el dispositivo, qué puede guardarse y qué podría recibir un tercero.","Fija límites de tiempo, tamaño y resultados que fallen de forma visible.","Ofrece etiquetas, teclado, anuncios de estado e indicios no basados solo en color.","Convierte cada afirmación importante en una comprobación repetible.","Elige parser, biblioteca, canal de soporte o revisión de política al superar el alcance.","Registra fecha de revisión, vía de corrección y motivo de los cambios importantes."],
  fr:["Définissez le but de la page avant de choisir une commande ou d’accepter un résultat.","Suivez un ordre reproductible et gardez assez de contexte pour répéter le résultat.","Utilisez des limites explicites et des cas proches des frontières plutôt qu’un exemple favorable.","Lisez l’absence, la troncature, les valeurs facultatives et les erreurs comme des éléments de preuve.","Gardez un contre-exemple pour révéler rapidement une hypothèse trop large.","Intégrez la compatibilité du navigateur et la sémantique JavaScript au comportement documenté.","Distinguez ce qui reste sur l’appareil, ce qui peut être stocké et ce qu’un tiers peut recevoir.","Fixez des limites de temps, de taille et de résultats qui échouent de manière visible.","Fournissez libellés, clavier, annonces d’état et indices autres que la couleur.","Transformez chaque affirmation importante en vérification reproductible.","Choisissez un analyseur, une bibliothèque, un canal de contact ou une révision de politique hors périmètre.","Consignez la date de révision, la voie de correction et la raison des changements importants."],
  de:["Definieren Sie den Zweck der Seite, bevor eine Steuerung oder ein Ergebnis gewählt wird.","Folgen Sie einer wiederholbaren Reihenfolge und bewahren Sie genügend Kontext zur Reproduktion.","Nutzen Sie klare Grenzen und grenznahe Fälle statt nur eines angenehmen Beispiels.","Lesen Sie Fehlen, Kürzung, optionale Werte und Fehlerzustände als Belege.","Halten Sie ein Gegenbeispiel bereit, um zu breite Annahmen schneller aufzudecken.","Behandeln Sie Browserunterstützung und JavaScript-Semantik als dokumentiertes Verhalten.","Trennen Sie Daten auf dem Gerät, mögliche Speicherung und mögliche Übermittlung an Dritte.","Setzen Sie sichtbare Zeit-, Größen- und Ergebnisgrenzen statt stiller Verluste.","Bieten Sie Beschriftungen, Tastaturzugang, Statusmeldungen und nichtfarbliche Hinweise.","Machen Sie aus jeder wichtigen Aussage eine wiederholbare Prüfung.","Wählen Sie Parser, Fachbibliothek, Kontaktkanal oder Richtlinienprüfung außerhalb des Umfangs.","Dokumentieren Sie Prüfdatum, Korrekturweg und Grund wesentlicher Änderungen."]
};

function list(locale, values) {
  if (locale === "en") return values.slice(0,-1).join(", ") + ", and " + values.at(-1);
  if (locale === "ko") return values.join("·");
  if (locale === "ja") return values.join("、");
  if (locale === "es") return values.slice(0,-1).join(", ") + " y " + values.at(-1);
  if (locale === "fr") return values.slice(0,-1).join(", ") + " et " + values.at(-1);
  return values.slice(0,-1).join(", ") + " und " + values.at(-1);
}

function paragraph(locale, content, terms, page, sectionIndex) {
  const c=cfg[locale], a=actions[locale], opener=c.openers[(pages.indexOf(page)+sectionIndex)%c.openers.length];
  const chosen=[terms[sectionIndex%8],terms[(sectionIndex+1)%8],terms[(sectionIndex+3)%8]];
  const later=[terms[(sectionIndex+4)%8],terms[(sectionIndex+6)%8],terms[(sectionIndex+7)%8]];
  const groupLine=c.group[groups[page]];
  if(locale==="ko") return `${opener} ${list(locale,chosen)}을 중심으로 확인합니다. ${content.title}에서 이 요소들은 ${terms[(sectionIndex+2)%8]}과 연결되어 페이지의 실제 역할을 구체화합니다. ${a[sectionIndex]} ${groupLine} ${list(locale,later)}도 같은 기준으로 함께 살펴야 한 항목의 편리함이 다른 항목의 한계나 개인정보 선택을 가리지 않습니다. 이 설명은 화면에 존재하는 기능과 공개된 운영 방식만을 다루며, 구현되지 않은 서버 처리나 지원 범위를 약속하지 않습니다.`;
  if(locale==="ja") return `${opener}、${list(locale,chosen)}を中心に確認します。${content.title} では、これらが ${terms[(sectionIndex+2)%8]} と結び付き、ページの実際の役割を具体化します。${a[sectionIndex]} ${groupLine} ${list(locale,later)}も同じ基準で確認し、一つの利便性が別の制限やプライバシー上の選択を隠さないようにします。ここでは画面に存在する機能と公開済みの運用だけを扱い、未実装のサーバー処理や対応範囲を約束しません。`;
  if(locale==="es") return `${opener} ${list(locale,chosen)}. En ${content.title}, estos elementos se relacionan con ${terms[(sectionIndex+2)%8]} y concretan la función real de la página. ${a[sectionIndex]} ${groupLine} Revisa también ${list(locale,later)} con el mismo criterio para que la comodidad de una opción no oculte límites ni decisiones de privacidad. La explicación se limita a funciones visibles y prácticas publicadas; no promete procesos de servidor ni compatibilidades que no existen.`;
  if(locale==="fr") return `${opener} ${list(locale,chosen)}. Dans ${content.title}, ces éléments se rattachent à ${terms[(sectionIndex+2)%8]} et précisent le rôle réel de la page. ${a[sectionIndex]} ${groupLine} Examinez aussi ${list(locale,later)} selon le même critère afin qu’un avantage ne masque ni une limite ni un choix de confidentialité. Le texte se limite aux fonctions visibles et aux pratiques publiées, sans promettre de traitement serveur ou de compatibilité inexistante.`;
  if(locale==="de") return `${opener} ${list(locale,chosen)}. Auf ${content.title} werden diese Elemente mit ${terms[(sectionIndex+2)%8]} verbunden und beschreiben die tatsächliche Aufgabe der Seite. ${a[sectionIndex]} ${groupLine} Prüfen Sie auch ${list(locale,later)} nach demselben Maßstab, damit ein Vorteil keine Grenze oder Datenschutzentscheidung verdeckt. Die Erläuterung beschränkt sich auf sichtbare Funktionen und veröffentlichte Abläufe; nicht vorhandene Serverprozesse oder Unterstützung werden nicht versprochen.`;
  return `${opener} ${list(locale,chosen)}. On ${content.title}, these elements connect with ${terms[(sectionIndex+2)%8]} and define the page’s actual role. ${a[sectionIndex]} ${groupLine} Review ${list(locale,later)} by the same standard so that one convenience does not conceal another limit or privacy choice. This explanation is restricted to visible functions and published operating practices; it does not promise server processing or compatibility that the product does not provide.`;
}

function intro(locale, content, terms) {
  const core=list(locale,terms.slice(0,4)), rest=list(locale,terms.slice(4));
  if(locale==="ko") return `${content.description} 이 페이지는 ${core}을 핵심 범위로 삼고, ${rest}을 별도의 검토 항목으로 구분합니다. 사용자는 화면에 표시되는 기능과 한계를 같은 자리에서 확인할 수 있으며, 중요한 선택은 브라우저에서 직접 재현할 수 있습니다.`;
  if(locale==="ja") return `${content.description} このページは ${core} を中心範囲とし、${rest} を別の確認項目として扱います。画面にある機能と制限を同じ場所で確認でき、重要な選択をブラウザーで再現できます。`;
  if(locale==="es") return `${content.description} La página sitúa ${core} en el alcance principal y trata ${rest} como controles separados. Las funciones y sus límites aparecen juntos para que las decisiones importantes puedan reproducirse en el navegador.`;
  if(locale==="fr") return `${content.description} La page place ${core} au cœur de son périmètre et traite ${rest} comme des contrôles distincts. Les fonctions et leurs limites sont présentées ensemble afin que les décisions importantes soient reproductibles dans le navigateur.`;
  if(locale==="de") return `${content.description} Die Seite stellt ${core} in den Mittelpunkt und behandelt ${rest} als eigene Prüfpunkte. Funktionen und Grenzen stehen zusammen, damit wichtige Entscheidungen im Browser wiederholt werden können.`;
  return `${content.description} The page places ${core} in its primary scope and treats ${rest} as separate review points. Visible functions and their limits are presented together so that important decisions can be reproduced in the browser.`;
}

function faqs(locale, content, terms) {
  if(locale==="ko") return [
    {question:`${content.title}에서 ${terms[0]}은 어떤 역할을 하나요?`,answer:`${terms[0]}은 ${terms[1]}과 함께 페이지의 핵심 목적을 구성합니다. 화면에 표시되는 결과와 제한을 함께 확인하고, 변경 후에는 동일한 입력이나 절차로 다시 검증해야 합니다.`},
    {question:`${terms[2]}과 ${terms[3]}은 어떻게 구분해야 하나요?`,answer:`두 항목을 같은 것으로 취급하지 말고 각각의 입력, 출력, 저장 여부, 실패 상태를 따로 확인합니다. 이 구분은 과장된 기능 주장과 잘못된 개인정보 가정을 줄입니다.`},
    {question:`${terms[4]}을 신뢰하기 전에 무엇을 확인해야 하나요?`,answer:`현재 브라우저, 페이지에 표시된 제한, 실제 표본, 오류 상태를 확인합니다. 한 번의 성공이나 짧은 입력만으로 모든 상황을 보장하지 않습니다.`},
    {question:`${terms[5]}과 관련된 데이터는 어디에서 처리되나요?`,answer:`페이지 설명과 개인정보처리방침에 공개된 범위가 기준입니다. 정규식 원문과 지원 파일은 기본적으로 브라우저에서 처리되며, 선택적 저장·공유·광고 서비스는 별도로 구분됩니다.`},
    {question:`${terms[6]} 또는 ${terms[7]}에 변경이 생기면 어떻게 알 수 있나요?`,answer:`관련 문서의 검토 날짜와 변경 설명을 확인합니다. 동작 오류나 번역 문제는 연락처 페이지의 재현 정보 기준에 맞춰 제보할 수 있습니다.`}
  ];
  if(locale==="ja") return [
    {question:`${content.title} で ${terms[0]} は何をしますか。`,answer:`${terms[0]} は ${terms[1]} と共にページの中心目的を構成します。表示された結果と制限を一緒に確認し、変更後は同じ入力または手順で再検証します。`},
    {question:`${terms[2]} と ${terms[3]} はどう区別しますか。`,answer:`入力、出力、保存、失敗状態を別々に確認します。この区別により、機能の誇張や誤ったプライバシー前提を避けられます。`},
    {question:`${terms[4]} を信頼する前に何を確認しますか。`,answer:`現在のブラウザー、表示された上限、実際のサンプル、エラー状態を確認します。一回の成功や短い入力だけで全状況を保証しません。`},
    {question:`${terms[5]} に関するデータはどこで処理されますか。`,answer:`ページ説明とプライバシーポリシーに公開された範囲が基準です。正規表現と対応ファイルは基本的にブラウザーで処理し、任意の保存、共有、広告サービスは分けて説明します。`},
    {question:`${terms[6]} または ${terms[7]} の変更はどう確認できますか。`,answer:`関連文書の確認日と変更説明を見ます。動作や翻訳の問題は、連絡ページの再現情報に従って報告できます。`}
  ];
  const q = locale==="es" ? ["¿Qué función cumple","¿Cómo deben distinguirse","¿Qué hay que comprobar antes de confiar en","¿Dónde se tratan los datos relacionados con","¿Cómo se anuncian los cambios en"] : locale==="fr" ? ["Quel est le rôle de","Comment distinguer","Que vérifier avant de se fier à","Où sont traitées les données liées à","Comment les changements de"] : locale==="de" ? ["Welche Aufgabe hat","Wie sind","Was ist vor dem Vertrauen in","Wo werden Daten zu","Wie werden Änderungen an"] : ["What role does","How should","What should be checked before relying on","Where is data related to","How are changes to"];
  const answers = locale==="es" ? [
    `${terms[0]} forma el propósito principal junto con ${terms[1]}. Comprueba resultados y límites y repite la misma entrada o procedimiento después de un cambio.`,
    `No trates ${terms[2]} y ${terms[3]} como equivalentes. Revisa por separado entradas, salidas, almacenamiento y errores para evitar afirmaciones exageradas y supuestos de privacidad incorrectos.`,
    `Comprueba el navegador actual, los límites visibles, una muestra real y los errores. Un único éxito o una entrada corta no garantiza todos los escenarios.`,
    `Se aplica lo publicado en esta página y en la política de privacidad. Los patrones y archivos compatibles se procesan localmente; almacenamiento, enlaces y publicidad opcionales se explican por separado.`,
    `Consulta la fecha de revisión y la descripción del cambio. Los errores funcionales o de traducción pueden informarse siguiendo los datos de reproducción de la página de contacto.`
  ] : locale==="fr" ? [
    `${terms[0]} participe à l’objectif principal avec ${terms[1]}. Vérifiez résultat et limites, puis rejouez la même entrée ou procédure après une modification.`,
    `Ne confondez pas ${terms[2]} et ${terms[3]}. Contrôlez séparément entrées, sorties, stockage et erreurs afin d’éviter les promesses excessives et les mauvaises hypothèses de confidentialité.`,
    `Vérifiez le navigateur, les limites affichées, un exemple réel et les erreurs. Un succès unique ou une courte entrée ne couvre pas tous les cas.`,
    `La page et la politique de confidentialité définissent le périmètre. Motifs et fichiers compatibles sont traités localement; stockage, partage et publicité facultatifs sont décrits séparément.`,
    `Consultez la date de révision et la description du changement. Les problèmes de fonction ou de traduction peuvent être signalés selon les informations demandées sur la page de contact.`
  ] : locale==="de" ? [
    `${terms[0]} bildet zusammen mit ${terms[1]} den Hauptzweck. Prüfen Sie Ergebnis und Grenzen und wiederholen Sie nach Änderungen dieselbe Eingabe oder Vorgehensweise.`,
    `Setzen Sie ${terms[2]} und ${terms[3]} nicht gleich. Prüfen Sie Eingaben, Ausgaben, Speicherung und Fehler getrennt, um übertriebene Aussagen und falsche Datenschutzannahmen zu vermeiden.`,
    `Prüfen Sie Browser, sichtbare Grenzen, reale Beispiele und Fehlerzustände. Ein einzelner Erfolg oder eine kurze Eingabe deckt nicht alle Fälle ab.`,
    `Maßgeblich sind Seite und Datenschutzerklärung. Muster und unterstützte Dateien werden lokal verarbeitet; optionale Speicherung, Freigabe und Werbung werden getrennt beschrieben.`,
    `Lesen Sie Prüfdatum und Änderungsbeschreibung. Funktions- oder Übersetzungsfehler können mit den Reproduktionsangaben der Kontaktseite gemeldet werden.`
  ] : [
    `${terms[0]} forms the primary purpose together with ${terms[1]}. Check visible results and limits, then repeat the same input or procedure after a change.`,
    `Do not treat ${terms[2]} and ${terms[3]} as interchangeable. Review their inputs, outputs, storage, and failure states separately to avoid exaggerated claims or incorrect privacy assumptions.`,
    `Check the current browser, displayed limits, a real sample, and error states. One successful run or one short input does not establish behavior for every case.`,
    `The published page and privacy policy define the boundary. Patterns and supported files are processed locally; optional storage, sharing, analytics, and advertising are described separately.`,
    `Review the stated date and change explanation. Functional or translation issues can be reported with the reproduction details requested on the contact page.`
  ];
  return [
    {question:`${q[0]} ${terms[0]} ${locale==="en"?`on ${content.title}?`:locale==="es"?`en ${content.title}?`:locale==="fr"?`dans ${content.title} ?`:locale==="de"?`auf ${content.title}?`:""}`,answer:answers[0]},
    {question:`${q[1]} ${terms[2]} ${locale==="en"?"and":locale==="es"?"y":locale==="fr"?"et":"und"} ${terms[3]}${locale==="fr"?" ?":"?"}`,answer:answers[1]},
    {question:`${q[2]} ${terms[4]}?`,answer:answers[2]},
    {question:`${q[3]} ${terms[5]}?`,answer:answers[3]},
    {question:`${q[4]} ${terms[6]} ${locale==="en"?"or":locale==="es"?"o":locale==="fr"?"ou":"oder"} ${terms[7]}${locale==="fr"?" ?":"?"}`,answer:answers[4]}
  ];
}

for(const [locale,localePages] of Object.entries(data)) {
  const localeTerms=termSets[locale];
  for(const [index,page] of pages.entries()) {
    const content=localePages[page], terms=localeTerms[page];
    if(!content||!terms) throw new Error(`Missing page data ${locale}/${page}`);
    content.intro=intro(locale,content,terms);
    content.sections=Array.from({length:12},(_,j)=>({
      heading:`${cfg[locale].labels[j]} — ${terms[(j+index)%8]}`,
      paragraphs:[paragraph(locale,content,terms,page,j)]
    }));
    content.faq=faqs(locale,content,terms);
  }
}

fs.writeFileSync(file,`${JSON.stringify(data,null,2)}\n`);
console.log(`Rebuilt ${pages.length * Object.keys(data).length} localized core pages with page-specific content.`);
