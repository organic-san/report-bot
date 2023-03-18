# 多語言json檔的格式與使用說明
## 檔案格式
檔案格式如下: 
```json
{
    "language-flag-name": {
        "foo": "bar",
        "foo2": "this is %VAR%"
    }, 
    "another-language-flag-name": {
        "foo": "霸",
        "foo2": "這是 %VAR%"
    }
    "default": {
        "foo": "bar",
        "foo2": "this is %VAR%"
    }
}
```
`language flags` 是該內文中語言的種類，指定的語言名稱如下:
```js
Indonesian = "id"
EnglishUS = "en-US"
EnglishGB = "en-GB"
Bulgarian = "bg"
ChineseCN = "zh-CN"
ChineseTW = "zh-TW"
Croatian = "hr"
Czech = "cs"
Danish = "da"
Dutch = "nl"
Finnish = "fi"
French = "fr"
German = "de"
Greek = "el"
Hindi = "hi"
Hungarian = "hu"
Italian = "it"
Japanese = "ja"
Korean = "ko"
Lithuanian = "lt"
Norwegian = "no"
Polish = "pl"
PortugueseBR = "pt-BR"
Romanian = "ro"
Russian = "ru"
SpanishES = "es-ES"
Swedish = "sv-SE"
Thai = "th"
Turkish = "tr"
Ukrainian = "uk"
Vietnamese = "vi"
default = "default
```
其中 `default` 是特殊flag，是在轉換目標語言不存在檔案中時會尋找的對象。

## getLocale()
調用資料時指定使用 `module/common.js` 的 `getLocale()` 函數。
使用方式如下:
```js
import { getLocale } from '../module/common.js';

let text = {
   en: {
      levelUp: "Congratulations on leveling up: %VAR%"
   },
   ru: {
      levelUp: "Поздравляем с новым уровнем: %VAR%"
   }
};

getLocale(text, "en", "levelUp", "10"); // Congratulations on leveling up: 10
getLocale(text, "ru", "levelUp", "10"); // Поздравляем с новым уровнем: 10
```

其中輸入項從頭開始分別為 `(多語言檔JSON來源, "目標格式", "調用對象", (帶入值1, 帶入值2...))`。

## %VAR%

如果有輸入帶入值，那麼getLocale()在執行的時候，就會以帶入值逐一取代調用對象中的 `%VAR%` 符號。具體事例可以查看上面的程式碼範例。
