export function StripHtml(html: string) {
    var doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
 }

 export function GetHeroImage( dotaName: string ) {
    return `${process.env.PUBLIC_URL}/images/portraits/${dotaName}_png.png`;
 }

 export const SUPPORTED_LANGUAGES = {
   "brazilian": "pt-BR",
   "bulgarian": "bg",
   "czech": "cs",
   "danish": "da",
   "dutch": "nl",
   "English": "en",
   "finnish": "fi",
   "german": "de",
   "hungarian": "hu",
   "italian": "it",
   "japanese": "ja",
   "koreana": "ko",
   "latam": "es-419",
   "norwegian": "no",
   "polish": "pl",
   "portuguese": "pt",
   "romanian": "ro",
   "russian": "ru",
   "中文": "zh-CN",
   "Español": "es",
   "swedish": "sv",
   "tchinese": "zh-TW",
   "thai": "th",
   "turkish": "tr",
   "ukrainian": "uk",
   "vietnamese": "vn",
 };