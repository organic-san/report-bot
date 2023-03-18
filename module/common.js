export function getLocale(strings, language, string, ...vars) {
    if (!(language in strings))
        language = LocaleFlag.default;
    let locale = strings[language][string];
    let count = 0;
    locale = locale.replace(/%VAR%/g, () => vars[count] !== null ? vars[count++] : "%VAR%");
    return locale;
}
var LocaleFlag;
(function (LocaleFlag) {
    LocaleFlag["Indonesian"] = "id";
    LocaleFlag["EnglishUS"] = "en-US";
    LocaleFlag["EnglishGB"] = "en-GB";
    LocaleFlag["Bulgarian"] = "bg";
    LocaleFlag["ChineseCN"] = "zh-CN";
    LocaleFlag["ChineseTW"] = "zh-TW";
    LocaleFlag["Croatian"] = "hr";
    LocaleFlag["Czech"] = "cs";
    LocaleFlag["Danish"] = "da";
    LocaleFlag["Dutch"] = "nl";
    LocaleFlag["Finnish"] = "fi";
    LocaleFlag["French"] = "fr";
    LocaleFlag["German"] = "de";
    LocaleFlag["Greek"] = "el";
    LocaleFlag["Hindi"] = "hi";
    LocaleFlag["Hungarian"] = "hu";
    LocaleFlag["Italian"] = "it";
    LocaleFlag["Japanese"] = "ja";
    LocaleFlag["Korean"] = "ko";
    LocaleFlag["Lithuanian"] = "lt";
    LocaleFlag["Norwegian"] = "no";
    LocaleFlag["Polish"] = "pl";
    LocaleFlag["PortugueseBR"] = "pt-BR";
    LocaleFlag["Romanian"] = "ro";
    LocaleFlag["Russian"] = "ru";
    LocaleFlag["SpanishES"] = "es-ES";
    LocaleFlag["Swedish"] = "sv-SE";
    LocaleFlag["Thai"] = "th";
    LocaleFlag["Turkish"] = "tr";
    LocaleFlag["Ukrainian"] = "uk";
    LocaleFlag["Vietnamese"] = "vi";
    LocaleFlag["default"] = "default";
})(LocaleFlag || (LocaleFlag = {}));
