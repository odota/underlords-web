import { Heroes, Alliances, AbilityStrings, GameStrings } from "../../types";

export let heroes: Heroes;
export let alliances: Alliances;
export let abilitiesLoc: AbilityStrings;
export let underlordsLoc: GameStrings;
export let strings: GameStrings;

export async function InitLocalization()
{
    // you can sub in a dynamic value that you read from localstorage in the import path, e.g. underlords_heroes_enUS.json
    heroes = await import(`underlordsconstants/build/underlords_heroes.json`) as any;
    alliances = await import(`underlordsconstants/build/underlords_alliances.json`) as any;
    abilitiesLoc = await import(`underlordsconstants/build/underlords_localization_abilities_en.json`) as any;
    underlordsLoc = await import(`underlordsconstants/build/underlords_localization_en.json`) as any;
    strings = await import(`../../lang/enUS.json`) as any;
}