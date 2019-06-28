import { Heroes, Alliances, AbilityStrings, GameStrings } from "../../types";
import { RouteComponentProps } from "react-router-dom";

export let heroes: Heroes;
export let alliances: Alliances;
export let abilitiesLoc: AbilityStrings;
export let underlordsLoc: GameStrings;
export let strings: GameStrings;

type MatchParams = {
    [lang: string]: string
}

const STRINGS_MAPPING: { [key: string]: string} = {
    "en": "enUS"
}

export async function InitLocalization(match: RouteComponentProps["match"])
{
    let lang = 'en';
    const params = match.params as MatchParams;
    if (params && params.lang) {
        lang = params.lang;
    }
    // you can sub in a dynamic value that you read from localstorage in the import path, e.g. underlords_heroes_enUS.json
    heroes = await import(`underlordsconstants/build/underlords_heroes.json`) as any;
    alliances = await import(`underlordsconstants/build/underlords_alliances.json`) as any;
    abilitiesLoc = await import(`underlordsconstants/build/underlords_localization_abilities_${lang}.json`) as any;
    underlordsLoc = await import(`underlordsconstants/build/underlords_localization_${lang}.json`) as any;
    strings = await import(`../../lang/${STRINGS_MAPPING[lang] || "enUS"}.json`) as any;
}