import React from 'react';
import ReactTooltip from 'react-tooltip';
import abilities from 'underlordsconstants/build/underlords_abilities.json';
import abilityStrings from 'underlordsconstants/build/underlords_localization_abilities_en.json'
import styles from './HeroCard.module.css';
import commonStyles from '../../common.module.css';
import { ABILITY_NAME_MAPPING, ABILITY_REGEX, ABILITY_IMAGE_MAPPING } from '../../constants';
import { Hero, GameStrings, Ability, Abilities, Alliance } from '../../types';
import AllianceCard from '../AllianceCard/AllianceCard';

export default class HeroCard extends React.Component<{ hero: Hero, alliances?: Alliance[] }> {
    public render() {
        const { hero, alliances } = this.props;
        // const ability = abilities[hero.abilities[0] as keyof typeof abilities];
        return <div className={commonStyles.Card}>
                <div className={commonStyles.CardCap}>
                    <img className={styles.HeroImage} alt={hero.displayName} src={GetHeroImage(hero.dota_unit_name)} />
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
                        hero.keywords.split(' ').map( (keyword: string, i: number) => {
                            const alliance = alliances ? alliances.find((a) => a.name === keyword) : null;
                            return <div className={commonStyles.ImageInRow} key={i}>
                                <img
                                    data-tip
                                    data-for={`alliance_${hero.dota_unit_name}${keyword}`}
                                    className={styles.AllianceIcon}
                                    alt={keyword}
                                    src={`${process.env.PUBLIC_URL}/images/alliances/${keyword}.jpg`}
                                />
                                {
                                    alliance ?
                                    <ReactTooltip id={`alliance_${hero.dota_unit_name}${keyword}`} effect="solid" place="bottom">
                                        <AllianceCard alliance={alliance}/>
                                    </ReactTooltip>
                                    : <div/>
                                }
                            </div>;
                        }) 
                        : null}
                    {/* reverse abilities because multiple descriptions are merged into the main ability, 
                        so we show the 2nd one without a description first. */}
                    { hero.abilities.slice(0).reverse().map((abilityKey, i) => <AbilityCard abilityKey={abilityKey} key={i} /> )}
                </div>
        </div>
    }
}

const GetHeroImage = ( dotaName: string ) => `https://api.opendota.com/apps/dota2/images/heroes/${dotaName.replace('npc_dota_hero_', '')}_full.png?`;

const GetAbilityDescription = (abilityKey: string): string => {
    let desc: string = (abilityStrings as GameStrings)[`dac_ability_${abilityKey}_Description`] ||
    (abilityStrings as GameStrings)[`dac_ability_${abilityKey}_description`]; //lower case "d"...
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

const AbilityCard = ( props: { abilityKey: string} ) => {
    const { abilityKey } = props;
    const abilityName = (abilityStrings as GameStrings)[`dac_ability_${abilityKey}`] 
            || ABILITY_NAME_MAPPING[abilityKey as keyof typeof ABILITY_NAME_MAPPING]
            || abilityKey;
    return <div className={styles.AbilityCard}>
        { /* <div>{hero.abilities}</div> */ }
        <div style={{ display: 'flex' }} className={styles.Subtitle}>
            <div className={styles.AbilityImage}>
                <img alt={abilityName} src={GetAbilityImage(abilityKey)} />
            </div>
            <h3>{abilityName}</h3>
        </div>
        <p>{GetAbilityDescription(abilityKey)}</p>
    </div>;
}

const GetAbilityImage = (abilityKey: string): string => {
    return `https://api.opendota.com/apps/dota2/images/abilities/${ABILITY_IMAGE_MAPPING[abilityKey as keyof typeof ABILITY_IMAGE_MAPPING] || abilityKey}_md.png`
}