import { Heroes, Alliances, AbilityStrings, GameStrings } from "../../types";
import { SUPPORTED_LANGUAGES } from '../../utils';

export let heroes: Heroes;
export let alliances: Alliances;
export let abilitiesLoc: AbilityStrings;
export let underlordsLoc: GameStrings;
export let strings: GameStrings;

const STRINGS_MAPPING: { [key: string]: string} = {
    "en": "enUS"
}

export async function InitLocalization(lang: string)
{
    // you can sub in a dynamic value that you read from localstorage in the import path, e.g. underlords_heroes_enUS.json
    heroes = await import(`underlordsconstants/build/underlords_heroes.json`) as any;
    alliances = await import(`underlordsconstants/build/underlords_alliances.json`) as any;
    abilitiesLoc = await import(`underlordsconstants/build/underlords_localization_abilities_${lang}.json`) as any;
    underlordsLoc = await import(`underlordsconstants/build/underlords_localization_${lang}.json`) as any;
    strings = await import(`../../lang/${STRINGS_MAPPING[lang] || "enUS"}.json`) as any;
}

export function getLanguage() {
    let lang = localStorage.getItem('lang');

    if (lang) {
        return lang;
    }
    
    // try to infer language from browser
    const languages = navigator.languages;
    const supportedValues = Object.values(SUPPORTED_LANGUAGES);
    for (let i = 0; i < languages.length; i++) {
        let testLang = languages[i];
        if (supportedValues.includes(testLang)) {
            lang = testLang;
        } else {
            testLang = testLang.split("-")[0];
            if (testLang in supportedValues) {
                lang = testLang;
            }
        }

        if (lang) {
            localStorage.setItem('lang', lang);
            return lang;
        }
    }

    // otherwise, try to use the url language
    let match = window.location.pathname.match(/[^/][^/]*/);
    if (match && supportedValues.includes(match[0])) {
        return match[0];
    }

    return 'en'; // default
}
