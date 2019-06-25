import React from 'react';
import heroes from 'underlordsconstants/build/underlords_heroes.json';
import abilities from 'underlordsconstants/build/underlords_abilities.json';
import gameStrings from 'underlordsconstants/build/underlords_localization_en.json';
import abilityStrings from 'underlordsconstants/build/underlords_localization_abilities_en.json'
import styles from './Heroes.module.css';
import commonStyles from '../../common.module.css';
import { ABILITY_REGEX, ABILITY_NAME_MAPPING, ABILITY_IMAGE_MAPPING } from '../../constants';
import { Hero, GameStrings, Ability, Abilities } from '../../types';

export default class Heroes extends React.Component {
    state = {
        heroes: [],
        npc: [],
        sort: 'displayName',
        isAscending: false //so that it's ascending on componentMount
    }

    public componentDidMount() {
        let realHeroes: Hero[] = [];
        let npc: Hero[] = [];
        Object.entries(heroes).forEach(([k, v]) => {
            const strings: GameStrings = gameStrings;
            if (v.displayName) {
                v.displayName = strings[v.displayName.replace('#', '')];
            }
            if (v.draftTier > 0) {
                realHeroes.push(v as Hero);
            } else {
                npc.push(v as Hero);
            }
        });

        this.setState({
            heroes: realHeroes,
            npc: npc,
        }, () => {
            this.sortHeroes('displayName');
        });
    }

    private sortHeroes(by: any) {
        const ascending: boolean = this.state.sort === by ? !this.state.isAscending : true;
        const order: number = ascending ? 1 : -1;
        let newSort: Hero[] = this.state.heroes
            .sort((x: any, y: any) => {
                if (x[by] === y[by]) {
                    return order * (x.displayName > y.displayName ? 1 : -1);
                }
                return order * (x[by] > y[by] ? 1 : -1);
            });

        this.setState({
            heroes: newSort,
            sort: by,
            isAscending: ascending
        });
    }

    public render() {
        return <div>
            <div>
                <button onClick={(e) => this.sortHeroes('draftTier')}>Order by Tier/Cost</button>
                <button onClick={(e) => this.sortHeroes('displayName')}>Order by Name</button>
            </div>
            <pre>{JSON.stringify( heroes['abaddon'], null, 2 )}</pre>
            <div className={commonStyles.CardsContainer}>
                { this.state.heroes.map( e => <HeroCard hero={e} ></HeroCard>)}
            </div>
        </div>
    }
}

const GetHeroImage = ( dotaName: string ) => `https://api.opendota.com/apps/dota2/images/heroes/${dotaName.replace('npc_dota_hero_', '')}_full.png?`;

// TODO get the hero names from https://github.com/SteamDatabase/GameTracking-Underlords/blob/master/game/dac/panorama/localization/dac_english.txt
// TODO ability descriptions are in https://github.com/SteamDatabase/GameTracking-Underlords/blob/master/game/dac/pak01_dir/resource/localization/dac_abilities_english.txt
const HeroCard = ( props: { hero: Hero } ) => {
    const hero = props.hero;
    // const ability = abilities[hero.abilities[0] as keyof typeof abilities];
    return <div className={commonStyles.Card}>
            <div className={commonStyles.CardCap}>
                <img className={styles.HeroImage} alt={hero.dota_unit_name} src={GetHeroImage(hero.dota_unit_name)} />
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
                { hero.abilities.slice(0).reverse().map( abilityKey => <AbilityCard abilityKey={abilityKey} /> )}
            </div>
    </div>
}

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
            <h3>{(abilityStrings as GameStrings)[`dac_ability_${abilityKey}`] 
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