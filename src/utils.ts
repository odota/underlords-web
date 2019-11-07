// @ts-ignore
import path from 'path-browserify';
import { getLanguage } from './components/Localization/Localization';

export function StripHtml(html: string) {
    var doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
 }

 export function GetHeroImage( dotaName: string ) {
    return `${process.env.PUBLIC_URL}/images/portraits/${dotaName}_png.png`;
 }

 export const SUPPORTED_LANGUAGES = {
   "português do Brasil": "pt-BR",
   "български": "bg",
   "čeština": "cs",
   "dansk": "da",
   "Nederlands": "nl",
   "English": "en",
   "suomi": "fi",
   "Deutsch": "de",
   "magyar": "hu",
   "italiano": "it",
   "日本語": "ja",
   "한국어": "ko",
   "español (America latina)": "es-419",
   "norsk": "no",
   "polski": "pl",
   "português": "pt",
   "limba română": "ro",
   "Русский язык": "ru",
   "汉语": "zh-CN",
   "español": "es",
   "svenska": "sv",
   "漢語": "zh-TW",
   "ภาษาไทย": "th",
   "Türkçe": "tr",
   "Українська": "uk",
   "tiếng việt": "vn",
 };

 export function formatLanguages(){
  let nObj = {} as any;

  Object.entries(SUPPORTED_LANGUAGES).forEach(
    ([key, value]) => {
      nObj[key.charAt(0).toUpperCase() + key.slice(1)] = value;
    }
  );
  return nObj;
 }

 export const GITHUB_ISSUES_LINK = '//github.com/odota/underlords-web/issues';

 export function generateURL(p: string) {
   return path.join("/", getLanguage(), p);
 }