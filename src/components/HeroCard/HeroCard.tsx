import React from 'react';
import ReactTooltip from 'react-tooltip';
import { heroes, alliances, underlordsLoc, abilitiesLoc } from '../Localization/Localization';
import abilities from 'underlordsconstants/build/underlords_abilities.json';
import styles from './HeroCard.module.css';
import commonStyles from '../../common.module.css';
import { ABILITY_REGEX, StripHtml } from '../../utils';
import { Hero, Heroes, GameStrings, Ability, Abilities, Alliance } from '../../types';
import AllianceCard from '../AllianceCard/AllianceCard';

export default class HeroCard extends React.Component<{ hero: Hero, embedded: boolean }> {

    public render() {
        const { hero, embedded } = this.props;
        const name = underlordsLoc[`${hero.displayName.substring(1)}`];
        return <div className={commonStyles.Card}>
                <div className={commonStyles.CardCap}>
                    <img className={styles.HeroImage} alt={name} src={GetHeroImage(hero.dota_unit_name)} />
                    <div className={commonStyles.CardCapContent}>
                        <div className={commonStyles.CardCapContentContainer}>
                            <div className={commonStyles.Title}>{name}</div>
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
                            return <div className={commonStyles.ImageInRow} key={i}>
                                <img
                                    data-tip
                                    data-for={`alliance_${hero.dota_unit_name}${keyword}`}
                                    className={styles.AllianceIcon}
                                    alt={keyword}
                                    src={`${process.env.PUBLIC_URL}/images/alliances/${keyword}.jpg`}
                                />
                                {   embedded ?
                                    <div />
                                    : <ReactTooltip id={`alliance_${hero.dota_unit_name}${keyword}`} effect="solid" place="bottom">
                                        <AllianceCard alliance={alliances[keyword as keyof typeof alliances]}/>
                                    </ReactTooltip>
                                }
                            </div>;
                        }) 
                        : null}
                    {/* reverse abilities because multiple descriptions are merged into the main ability, 
                        so we show the 2nd one without a description first. */}
                    { hero.abilities ? 
                        hero.abilities.slice(0).reverse().map((abilityKey, i) => <AbilityCard abilityKey={abilityKey} key={i} /> )
                        : <div/>
                    }
                </div>
        </div>
    }
}

const GetHeroImage = ( dotaName: string ) => `https://api.opendota.com/apps/dota2/images/heroes/${dotaName.replace('npc_dota_hero_', '')}_full.png?`;


const AbilityCard = ( props: { abilityKey: string} ) => {
    const { abilityKey } = props;
    const ability: Ability = (abilities as Abilities)[abilityKey];
    const name = abilitiesLoc[`dac_ability_${abilityKey}`];
    const description = StripHtml(abilitiesLoc[`dac_ability_${abilityKey}_Description`]);
    const lore = StripHtml(abilitiesLoc[`dac_ability_${abilityKey}_Lore`]);
    return <div className={styles.AbilityCard}>
        <div style={{ display: 'flex' }} className={styles.Subtitle}>
            <div className={styles.AbilityImage}>
                <img alt={name} src={`https://api.opendota.com/apps/dota2/images/abilities/${ability.iconName}_md.png`} />
            </div>
            <h3>{name}</h3>
        </div>
        <p>{description}</p>
        <small>{lore}</small>
    </div>;
}