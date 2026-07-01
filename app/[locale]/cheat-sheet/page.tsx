import type { Metadata } from "next";
import { ContentArticle } from "@/src/components/content-article";
import { JsonLd } from "@/src/components/json-ld";
import { getPageContent } from "@/src/content/content";
import { getDictionary } from "@/src/i18n/get-dictionary";
import type { Locale } from "@/src/i18n/locales";
import { resolveLocale } from "@/src/lib/locale";
import { metadataForPage } from "@/src/lib/seo/page-metadata";
import { toolJsonLd } from "@/src/lib/seo/json-ld";

export function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return metadataForPage(params, "cheat-sheet", "cheat-sheet");
}

const tokens = [".", "\\d / \\D", "\\w / \\W", "\\s / \\S", "[abc] / [^abc]", "^ / $", "* + ? {n,m}", "*? +? ??", "(...) / (?:...)", "(?<name>...)", "(?=...) / (?!...)", "(?<=...) / (?<!...)", "\\1 / \\k<name>", "g i m s u y d v"];
const examples = ["a.c", "\\d{4}", "\\w+", "\\s+", "[A-F0-9]", "^ERROR:$", "[A-Z]{2,4}", ".*?", "(?:cat|dog)", "(?<year>\\d{4})", "\\d+(?= USD)", "(?<=USD )\\d+", "(?<q>['\"]).*?\\k<q>", "new RegExp(pattern, flags)"];
const meanings: Record<Locale, string[]> = {
  en: ["Any character except a line terminator unless s is enabled", "Decimal digit / not a decimal digit", "Word character / not a word character", "Whitespace / not whitespace", "Allowed set / negated set", "Start / end anchor", "Greedy quantifiers", "Lazy quantifiers", "Capturing / non-capturing group", "Named capture group", "Positive / negative lookahead", "Positive / negative lookbehind", "Numbered / named backreference", "JavaScript flags; v depends on browser support"],
  ko: ["s 플래그가 없으면 줄바꿈을 제외한 문자 하나", "십진 숫자 / 숫자가 아닌 문자", "단어 문자 / 단어 문자가 아닌 문자", "공백 / 공백이 아닌 문자", "허용 문자 집합 / 제외 집합", "입력 또는 줄의 시작 / 끝", "탐욕적 수량자", "게으른 수량자", "캡처 그룹 / 비캡처 그룹", "이름 있는 캡처 그룹", "긍정 / 부정 룩어헤드", "긍정 / 부정 룩비하인드", "번호 / 이름 역참조", "JavaScript 플래그이며 v는 브라우저 지원에 따라 달라짐"],
  ja: ["s フラグがなければ改行以外の任意の一文字", "10進数字 / 数字以外", "単語文字 / 単語文字以外", "空白 / 空白以外", "許可する集合 / 否定集合", "入力または行の先頭 / 末尾", "貪欲な量指定子", "最短の量指定子", "キャプチャ / 非キャプチャグループ", "名前付きキャプチャグループ", "肯定 / 否定の先読み", "肯定 / 否定の後読み", "番号 / 名前による後方参照", "JavaScript フラグ。v はブラウザー対応に依存"],
  es: ["Cualquier carácter salvo salto de línea, excepto con s", "Dígito decimal / carácter no decimal", "Carácter de palabra / no palabra", "Espacio / no espacio", "Conjunto permitido / conjunto negado", "Ancla de inicio / fin", "Cuantificadores codiciosos", "Cuantificadores perezosos", "Grupo con captura / sin captura", "Grupo de captura con nombre", "Lookahead positivo / negativo", "Lookbehind positivo / negativo", "Referencia numerada / con nombre", "Banderas JavaScript; v depende del navegador"],
  fr: ["Tout caractère sauf fin de ligne, sauf avec s", "Chiffre décimal / caractère non décimal", "Caractère de mot / autre caractère", "Espace / caractère non blanc", "Ensemble autorisé / ensemble nié", "Ancre de début / fin", "Quantificateurs gourmands", "Quantificateurs paresseux", "Groupe capturant / non capturant", "Groupe de capture nommé", "Lookahead positif / négatif", "Lookbehind positif / négatif", "Référence numérotée / nommée", "Drapeaux JavaScript ; v dépend du navigateur"],
  de: ["Beliebiges Zeichen außer Zeilenende, sofern s nicht aktiv ist", "Dezimalziffer / keine Dezimalziffer", "Wortzeichen / kein Wortzeichen", "Leerraum / kein Leerraum", "Erlaubte Menge / negierte Menge", "Start- / Endanker", "Gierige Quantifizierer", "Faule Quantifizierer", "Erfassende / nicht erfassende Gruppe", "Benannte Erfassungsgruppe", "Positiver / negativer Lookahead", "Positiver / negativer Lookbehind", "Nummerierte / benannte Rückreferenz", "JavaScript-Flags; v hängt vom Browser ab"]
};

export default async function CheatSheetPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const dictionary = getDictionary(locale);
  const content = getPageContent(locale, "cheat-sheet");
  const rows = tokens.map((token, index) => [token, meanings[locale][index], examples[index]]);
  return <><JsonLd data={toolJsonLd(locale, "cheat-sheet", content)} /><ContentArticle locale={locale} dictionary={dictionary} content={content}><div className="table-wrap"><table className="data-table"><thead><tr><th>{dictionary.explainer.token}</th><th>{dictionary.explainer.meaning}</th><th>JavaScript</th></tr></thead><tbody>{rows.map((row) => <tr key={row[0]}><td><code>{row[0]}</code></td><td>{row[1]}</td><td><code>{row[2]}</code></td></tr>)}</tbody></table></div></ContentArticle></>;
}
