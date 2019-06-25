import React from 'react';
import heroes from 'dotaconstants/build/underlords_heroes.json';
import abilities from 'dotaconstants/build/underlords_abilities.json';
import abilityStrings from 'dotaconstants/build/underlords_localization_abilities_en.json'
import styles from './Heroes.module.css';
import commonStyles from '../common.module.css';

// TODO: Is there a better way to define this?
// howardc: Not sure why the typing fails if we use keyof typeof heroes, maybe too many different unions confuses TS?
type HeroType = typeof heroes.abaddon;
type Ability = typeof abilities[keyof typeof abilities];
type Abilities = { [key: string]: Ability };
type GameStrings = { [key: string]: string };
const ABILITY_REGEX = /({s:[^}]*})/g;

const ABILITY_IMAGE_MAPPING = {
    "bloodseeker_blood_rage": "bloodseeker_bloodrage",
    "clockwerk_battery_assault":  "rattletrap_battery_assault",
    "drow_ranger_trueshot_aura": "drow_ranger_trueshot",
    "lone_druid_summon_bear": "lone_druid_spirit_link",
    "lycan_wolf_spawn_shift": "lycan_shapeshift",
    "natures_prophet_summon_tree": "furion_force_of_nature",
    "necrophos_death_pulse": "necrolyte_death_pulse",
    "pudge_meathook": "pudge_meat_hook",
    "shadow_fiend_requiem": "nevermore_requiem",
    "techies_bomb": "techies_remote_mines",
    "terrorblade_metamorph": "terrorblade_metamorphosis",
    "timbersaw_whirling_death": "shredder_whirling_death"
};

const ABILITY_NAME_MAPPING = {
    "medusa_split_shot": "Split Shot",
    "sandking_caustic_finale": "Caustic Finale"
};

export default class Hero extends React.Component {
    constructor(props: { hero: HeroType}) {
        super(props);
    }

    public render() {
        const { hero } = this.props;
        // const ability = abilities[hero.abilities[0] as keyof typeof abilities];
        return <div className={commonStyles.Card}>
                <div className={commonStyles.CardCap}>
                    <img className={styles.HeroImage} src={GetHeroImage(hero.dota_unit_name)} />
                    <div className={commonStyles.CardCapContent}>
                        <div className={commonStyles.CardCapContentContainer}>
                            <div className={commonStyles.Title}>{hero.displayName}</div>
                            <div className={commonStyles.Midtitle}>Tier/Cost {hero.draftTier}</div>
                        </div>
                    </div>
                </div>
                <div className={commonStyles.CardBody}>
                    <div className={commonStyles.Subtitle}>Armor: {hero.armor}</div>
                    <div className={commonStyles.Subtitle}>Attack Range: {hero.attackRange}</div>
                    <div className={commonStyles.Subtitle}>Attack Rate: {hero.attackRate}</div>
                    { /* TODO get the top HP/damage value and show bar relative to max */ }
                    <div className={commonStyles.Subtitle}>Health: {hero.health instanceof Array ? hero.health.join( ' / ') : hero.health }</div>
                    {hero.damageMin && <div className={commonStyles.Subtitle}>Damage Min: {hero.damageMin instanceof Array ? hero.damageMin.join(' / ') : hero.damageMin}</div>}
                    {hero.damageMax && <div className={commonStyles.Subtitle}>Damage Max: {hero.damageMax instanceof Array ? hero.damageMax.join(' / ') : hero.damageMax}</div>}
                    <div className={commonStyles.Subtitle}>Alliances: {hero.keywords}</div>
                    { hero.keywords ? 
                        hero.keywords.split(' ').map( (keyword: string) => {
                            return <img className={styles.AllianceIcon} alt={keyword} src={`${process.env.PUBLIC_URL}/images/alliances/${keyword}.jpg`} />;
                        }) 
                        : null}
                    {/* reverse abilities because multiple descriptions are merged into the main ability, 
                        so we show the 2nd one without a description first. */}
                    { hero.abilities.slice(0).reverse().map( abilityKey => <AbilityCard abilityKey={abilityKey}/> )}
                </div>
        </div>
    }
}

const GetHeroImage = ( dotaName: string ) => `https://api.opendota.com/apps/dota2/images/heroes/${dotaName.replace('npc_dota_hero_', '')}_full.png?`;

const GetAbilityDescription = (abilityKey: string): string => {
    let desc: string = (abilityStrings.tokens as GameStrings)[`dac_ability_${abilityKey}_Description`] ||
    (abilityStrings.tokens as GameStrings)[`dac_ability_${abilityKey}_description`]; //lower case "d"...
    const ability: Ability = (abilities as Abilities)[abilityKey];
    if (desc) {
        const matches = desc.match(ABILITY_REGEX);
        if (matches) {
            matches.forEach((s: string) => {
                let replace = '';
                const key = s.replace('{s:', '').replace('}', '') as keyof Ability;
                if (key in ability) {
                    const val: any = ability[key];
                    replace = Array.isArray(val) ? `[${val.join('/')}]` : val;
                }

                desc = desc.replace(s, replace);
            })
        }
        return desc.replace(/<br>/g, '\n');
    } else {
        return '';
    }

}
// TODO - fix medusa_split_shot - 2nd skill
// sandking_caustic_finale - 2nd skill
// slark_dark_pact - isn't in abilities array for slark... 
const AbilityCard = ( props: { abilityKey: string} ) => {
    const { abilityKey } = props;
    return <div className={styles.AbilityCard}>
        { /* <div>{hero.abilities}</div> */ }
        <div style={{ display: 'flex' }} className={styles.Subtitle}>
            <div className={styles.AbilityImage}>
                <img src={GetAbilityImage(abilityKey)} />
            </div>
            <h3>{(abilityStrings.tokens as GameStrings)[`dac_ability_${abilityKey}`] 
                || ABILITY_NAME_MAPPING[abilityKey as keyof typeof ABILITY_NAME_MAPPING]
                || abilityKey
            }</h3>
        </div>
        <p>{GetAbilityDescription(abilityKey)}</p>
    </div>;
}

const GetAbilityImage = (abilityKey: string): string => {
    return `https://api.opendota.com/apps/dota2/images/abilities/${ABILITY_IMAGE_MAPPING[abilityKey as keyof typeof ABILITY_IMAGE_MAPPING] || abilityKey}_md.png`
}