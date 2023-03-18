export function getLocale(strings: LocaleStrings, language: LocaleList, string: string, ...vars: string[]) {
    if(!(language in strings)) language = LocaleFlag.default;
    let locale = strings[language][string];
 
    let count = 0;
    locale = locale.replace(/%VAR%/g, () => vars[count] !== null ? vars[count++] : "%VAR%");
 
    return locale;
 }

enum LocaleFlag {
    Indonesian = "id",
    EnglishUS = "en-US",
    EnglishGB = "en-GB",
    Bulgarian = "bg",
    ChineseCN = "zh-CN",
    ChineseTW = "zh-TW",
    Croatian = "hr",
    Czech = "cs",
    Danish = "da",
    Dutch = "nl",
    Finnish = "fi",
    French = "fr",
    German = "de",
    Greek = "el",
    Hindi = "hi",
    Hungarian = "hu",
    Italian = "it",
    Japanese = "ja",
    Korean = "ko",
    Lithuanian = "lt",
    Norwegian = "no",
    Polish = "pl",
    PortugueseBR = "pt-BR",
    Romanian = "ro",
    Russian = "ru",
    SpanishES = "es-ES",
    Swedish = "sv-SE",
    Thai = "th",
    Turkish = "tr",
    Ukrainian = "uk",
    Vietnamese = "vi",
    default = "default"
}
type LocaleList = `${LocaleFlag}`;

type LocaleStrings = {
    [key in LocaleList]: {
      [key: string]: string;
    };
};