# SEO keyword map

Each search intent has one representative page. Flags, country-specific phone formats, and minor pattern variants are handled within guides or the pattern library instead of thin standalone pages.

## English

| URL | Primary intent | Supporting terms | Role |
|---|---|---|---|
| `/en/tester/` | regex tester online | JavaScript regex tester, capture group tester, multiline regex | Main execution page |
| `/en/replace/` | regex replace tester | replacement preview, named group replacement | Replacement intent |
| `/en/extract/` | regex match extractor | capture groups to CSV, matching lines | Extraction intent |
| `/en/file-filter/` | regex file filter | filter log lines, test regex against text file | Local-file intent |
| `/en/explainer/` | regex pattern explainer | regex debugger, token explanation | Explanation intent |
| `/en/cheat-sheet/` | regex cheat sheet | JavaScript regex syntax examples | Reference intent |
| `/en/guides/` | regex guides | learn regular expressions | Educational hub |

## 한국어

| URL | 주요 키워드 | 보조 키워드 | 역할 |
|---|---|---|---|
| `/ko/tester/` | 정규식 테스트 | 정규표현식 테스트, 정규식 검사기, 캡처 그룹 | 대표 실행 페이지 |
| `/ko/replace/` | 정규식 치환 | JavaScript 치환, 그룹 치환 미리보기 | 치환 의도 |
| `/ko/extract/` | 정규식 추출 | 일치 문자열 추출, CSV 내보내기 | 추출 의도 |
| `/ko/file-filter/` | 정규식 파일 필터 | 로그 줄 필터, TXT 정규식 검사 | 파일 의도 |
| `/ko/explainer/` | 정규식 문법 설명 | 정규식 해석, 패턴 구조 | 설명 의도 |

## 日本語

| URL | 主要キーワード | 補助キーワード | 役割 |
|---|---|---|---|
| `/ja/tester/` | 正規表現 テスト | 正規表現 チェッカー, JavaScript regex | 実行ページ |
| `/ja/replace/` | 正規表現 置換 | 名前付きグループ置換 | 置換意図 |
| `/ja/extract/` | 正規表現 抽出 | 一致行, CSV 出力 | 抽出意図 |
| `/ja/file-filter/` | 正規表現 ファイル | ログ行フィルター | ファイル意図 |
| `/ja/explainer/` | 正規表現 解説 | パターン構造 | 解説意図 |

## Español

| URL | Palabra principal | Secundarias | Función |
|---|---|---|---|
| `/es/tester/` | probador de expresiones regulares | probar regex online, JavaScript regex | Ejecución principal |
| `/es/replace/` | reemplazo con regex | vista previa de reemplazo | Reemplazo |
| `/es/extract/` | extraer texto con regex | grupos a CSV | Extracción |
| `/es/file-filter/` | filtrar archivos con regex | filtrar registros | Archivos locales |
| `/es/explainer/` | explicación de regex | analizar patrón | Explicación |

## Français

| URL | Mot-clé principal | Secondaires | Rôle |
|---|---|---|---|
| `/fr/tester/` | testeur regex | tester une regex en ligne, JavaScript regex | Exécution principale |
| `/fr/replace/` | remplacement regex | aperçu du remplacement | Remplacement |
| `/fr/extract/` | extraire du texte avec une regex | groupes vers CSV | Extraction |
| `/fr/file-filter/` | filtre de fichiers regex | filtrer des journaux | Fichiers locaux |
| `/fr/explainer/` | explication regex | structure du motif | Explication |

## Deutsch

| URL | Hauptkeyword | Ergänzende Begriffe | Rolle |
|---|---|---|---|
| `/de/tester/` | Regex online testen | Regex Tester, JavaScript Regex | Hauptwerkzeug |
| `/de/replace/` | Regex ersetzen | Ersetzungsvorschau | Ersetzung |
| `/de/extract/` | Text mit Regex extrahieren | Gruppen als CSV | Extraktion |
| `/de/file-filter/` | Regex Dateifilter | Logzeilen filtern | Lokale Dateien |
| `/de/explainer/` | Regex Erklärung | Muster analysieren | Erklärung |

Every guide links to its relevant workbench action and three related guides. Tool pages link to the educational hub. The canonical URL strips share-query parameters, preventing a shared pattern URL from becoming a competing indexable page.
