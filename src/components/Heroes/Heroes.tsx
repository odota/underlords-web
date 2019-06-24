import React from 'react';
import heroes from 'dotaconstants/build/underlords_heroes.json';
import abilities from 'dotaconstants/build/underlords_abilities.json';
import gameStrings from 'dotaconstants/build/underlords_localization_en.json';
import styles from './Heroes.module.css';
import commonStyles from '../common.module.css';

// TODO: Is there a better way to define this?
// howardc: Not sure why the typing fails if we use keyof typeof heroes, maybe too many different unions confuses TS?
type Hero = typeof heroes.abaddon;
type Ability = typeof abilities[keyof typeof abilities];
type GameStrings = { [key: string]: string };

export default class Heroes extends React.Component {
    state = {
        heroes: [],
        npc: [],
        sort: "displayName",
        isAscending: false //so that it's ascending on componentMount
    }

    public componentDidMount() {
        let realHeroes: Hero[] = [];
        let npc: Hero[] = [];
        Object.entries(heroes).forEach(([k, v]) => {
            const strings: GameStrings = gameStrings;
            v.displayName = strings[v.displayName.replace("#", "")];
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
            this.sortHeroes("displayName");
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
                <button onClick={(e) => this.sortHeroes("draftTier")}>Order by Tier/Cost</button>
                <button onClick={(e) => this.sortHeroes("displayName")}>Order by Name</button>
            </div>
            <pre>{JSON.stringify( heroes['abaddon'], null, 2 )}</pre>
            <div style={{ display: 'flex', flexWrap: 'wrap', height: '100vh', overflow: 'scroll' }}>
                { this.state.heroes.map( e => <HeroCard hero={e} ></HeroCard>)}
            </div>
        </div>
    }
}

const GetHeroImage = ( dotaName: string ) => `https://api.opendota.com/apps/dota2/images/heroes/${dotaName.replace("npc_dota_hero_", "")}_full.png?`;

// TODO get the hero names from https://github.com/SteamDatabase/GameTracking-Underlords/blob/master/game/dac/panorama/localization/dac_english.txt
// TODO ability descriptions are in https://github.com/SteamDatabase/GameTracking-Underlords/blob/master/game/dac/pak01_dir/resource/localization/dac_abilities_english.txt
const HeroCard = ( props: { hero: Hero } ) => {
    const hero = props.hero;
    const ability = abilities[hero.abilities[0] as keyof typeof abilities];
    return <div className={styles.HeroCard}>
            <div className={styles.CardCap}>
                <img className={styles.HeroImage} src={GetHeroImage(hero.dota_unit_name)} />
                <div className={styles.CardCapContent}>
                    <div className={styles.CardCapContentContainer}>
                        <div className={commonStyles.Title}>{hero.displayName}</div>
                        <div className={commonStyles.Midtitle}>Tier/Cost {hero.draftTier}</div>
                    </div>
                </div>
            </div>
            <div className={styles.CardBody}>
                <div className={commonStyles.Subtitle}>Armor: {hero.armor}</div>
                <div className={commonStyles.Subtitle}>Attack Range: {hero.attackRange}</div>
                <div className={commonStyles.Subtitle}>Attack Rate: {hero.attackRate}</div>
                { /* TODO get the top HP/damage value and show bar relative to max */ }
                <div className={commonStyles.Subtitle}>Health: {hero.health instanceof Array ? hero.health.join( ' / ') : hero.health }</div>
                {hero.damageMin && <div>Damage Min: {hero.damageMin instanceof Array ? hero.damageMin.join(' / ') : hero.damageMin}</div>}
                {hero.damageMax && <div>Damage Max: {hero.damageMax instanceof Array ? hero.damageMax.join(' / ') : hero.damageMax}</div>}
                <div className={commonStyles.Subtitle}>Alliances: {hero.keywords}</div>
                { hero.keywords ? 
                    hero.keywords.split(' ').map( (keyword: string) => {
                        return <img className={styles.AllianceIcon} alt={keyword} src={`${process.env.PUBLIC_URL}/images/alliances/${keyword}.jpg`} />;
                    }) 
                    : null}
                { hero.abilities.map( abilityKey => <AbilityCard abilityKey={abilityKey} /> )}
            </div>
    </div>
}

const AbilityCard = ( props: { abilityKey: string } ) => {
    const { abilityKey } = props;
    return <div className={styles.AbilityCard}>
        { /* <div>{hero.abilities}</div> */ }
        <div style={{ display: 'flex' }} className={styles.Subtitle}>
            <div className={styles.AbilityBackground}>
                {/*<img src />*/}
            </div>
            <div>{(gameStrings as GameStrings)[`dac_ability_${abilityKey}`] || abilityKey}</div>
        </div>
        <p>Description here.</p>
    </div>;
}