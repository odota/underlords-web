import React from 'react';
import { underlordsLoc, abilitiesLoc } from '../Localization/Localization';
import abilities from 'underlordsconstants/build/underlords_abilities.json';
import styles from './HeroCard.module.css';
import commonStyles from '../../common.module.css';
import { StripHtml } from '../../utils';
import { Hero, Ability, Abilities } from '../../types';

export default class HeroCard extends React.Component<{ hero: Hero, highlight?: string }> {

    offensiveStats = [
        {
            stat: "damageMin",
            name: "dac_ingame_damagemin"
        },
        {
            stat: "damageMax",
            name: "dac_ingame_damagemax"
        },
        {
            stat: "attackRange",
            name: "dac_ingame_attackrange"
        },
        {
            stat: "attackRate",
            name: "dac_ingame_attackspeed"
        },
        {
            stat: "maxmana",
            name: "dac_ingame_mana"
        },
        {
            stat: "movespeed",
            name: "dac_ingame_movespeed"
        }
    ]
    
    defensiveStats = [
        {
            stat: "health",
            name: "dac_ingame_health"
        },
        {
            stat: "healthRegen",
            name: "dac_ingame_healthregen"
        },
        {
            stat: "armor",
            name: "dac_ingame_armor"
        },
        {
            stat: "magicResist",
            name: "dac_ingame_magicresist"
        },
        
    ]
    public render() {
        const { hero, highlight } = this.props;
        const name = underlordsLoc[`${hero.displayName}`];
        if (!hero.dota_unit_name) {
            return null;
        }
        return <div className={commonStyles.Card}>
                <div className={commonStyles.CardCap}>
                    <img className={styles.HeroImage} alt={name} src={GetHeroImage(hero.dota_unit_name)} />
                    <div className={commonStyles.CardCapContent}>
                        <div className={commonStyles.CardCapContentContainer}>
                            <div className={commonStyles.Title}>{name}</div>
                            <div className={commonStyles.Midtitle}>
                                {underlordsLoc["dac_hero_unit_cost"] ?
                                    underlordsLoc["dac_hero_unit_cost"].replace("{i:UnitCost}", hero.draftTier)
                                    : `Tier ${hero.draftTier}`}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={commonStyles.CardBody}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        { hero.keywords ? 
                        hero.keywords.split(' ').map( (keyword: string, i: number) => {
                            return <div className={commonStyles.ImageInRow} key={i}>
                                <img
                                    data-tip={keyword}
                                    data-for="alliance"
                                    className={styles.AllianceIcon}
                                    alt={keyword}
                                    src={`${process.env.PUBLIC_URL}/images/alliances/${keyword}.jpg`}
                                />
                            </div>;
                        }) 
                        : null }
                    </div>
                    { /* TODO get the top HP/damage value and show bar relative to max */ }
                    <h4 className={commonStyles.Midtitle}>{underlordsLoc["dac_dev_item_offensive"]}</h4>
                    {
                        this.offensiveStats.map((e, i) => <StatBlock key={i} hero={hero} stat={e} highlight={highlight} />)
                    }
                    <h4 className={`${commonStyles.Midtitle} ${commonStyles.Blue}`}>{underlordsLoc["dac_dev_item_defensive"]}</h4>
                    {
                        this.defensiveStats.map((e, i) => <StatBlock key={i} hero={hero} stat={e} highlight={highlight} />)
                    }
                    {/* reverse abilities because multiple descriptions are merged into the main ability, 
                        so we show the 2nd one without a description first. */}
                    { hero.abilities ? 
                        hero.abilities.slice(0).reverse().map((abilityKey: string, i: number) => <AbilityCard abilityKey={abilityKey} key={i} /> )
                        : <div/>
                    }
                </div>
        </div>
    }
}

const StatBlock = ( props: { 
    hero: Hero,
    stat: {
        stat: string,
        name: string
    },
    highlight?: string
}) => {
    const {hero, stat, highlight } = props;

    return <div className={`${commonStyles.Subtitle} ${highlight && highlight === stat.stat ? commonStyles.HighlightStat : ''}`}>
        {underlordsLoc[stat.name]}: {FormatStat(hero[stat.stat])}
    </div>
}
const FormatStat = (stat: number[]|string) => stat instanceof Array ? stat.join(' / ') : stat;

const GetHeroImage = ( dotaName: string ) => `https://api.opendota.com/apps/dota2/images/heroes/${dotaName.replace('npc_dota_hero_', '')}_full.png?`;


const AbilityCard = ( props: { abilityKey: string} ) => {
    const { abilityKey } = props;
    const ability: Ability = (abilities as Abilities)[abilityKey];
    const name = abilitiesLoc[`dac_ability_${abilityKey}`];
    const description = StripHtml(abilitiesLoc[`dac_ability_${abilityKey}_description`]);
    const lore = StripHtml(abilitiesLoc[`dac_ability_${abilityKey}_lore`]);
    return <div className={commonStyles.DescriptionCard}>
        <div style={{ display: 'flex' }} className={styles.Subtitle}>
            <div className={styles.AbilityImage}>
                <img alt={name} src={`https://api.opendota.com/apps/dota2/images/abilities/${ability.iconName}_md.png`} />
            </div>
            <h3>{name}</h3>
        </div>
        <p>{description}</p>
        <small className={commonStyles.LoreText}>{lore}</small>
    </div>;
}