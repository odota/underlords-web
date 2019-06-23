import React from 'react';
import heroes from 'dotaconstants/build/underlords_heroes.json';
import abilities from 'dotaconstants/build/underlords_abilities.json';
import gameStrings from 'dotaconstants/build/underlords_localization_en.json';
import styles from './Heroes.module.css';

// TODO: Is there a better way to define this?
type hero = Partial<typeof heroes[keyof typeof heroes]>;

export default class Heroes extends React.Component {

    // TODO: Is there a better way to avoid this error?
    // ts(7053): "Element implicitly has an 'any' type because expression of type 'string' can't be used to index type"
    gameStrings: { [key: string]: string } = gameStrings;

    state = {
        heroes: [],
        npc: [],
        sort: "displayName",
        isAscending: false //so that it's ascending on componentMount
    }

    public componentDidMount() {
        let realHeroes: hero[] = [];
        let npc: hero[] = [];
        Object.entries(heroes).map(([k, v]) => {

            v.displayName = this.gameStrings[v.displayName.replace("#", "")];
            if (v.draftTier > 0) {
                realHeroes.push(v);
            } else {
                npc.push(v);
            }
        })

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
        let newSort: Partial<hero>[] = this.state.heroes
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
const HeroCard = ( props: { hero: hero } ) => {
    const hero: any = props.hero;
    return <div className={styles.HeroCard}>
        <div>
            <div className={styles.Title}>{hero.displayName}</div>
            <div className={styles.Midtitle}>Tier {hero.draftTier}</div>
            <div className={styles.Midtitle}>Cost {hero.goldCost}</div>
        </div>
        <div className={styles.HeroBackground}>
            <img className={styles.HeroImage} src={GetHeroImage(hero.dota_unit_name)} />
        </div>
        <div className={styles.Subtitle}>Armor: {hero.armor}</div>
        <div className={styles.Subtitle}>Attack Range: {hero.attackRange}</div>
        <div className={styles.Subtitle}>Attack Rate: {hero.attackRate}</div>
        { /* TODO get the top HP/damage value and show bar relative to max */ }
        <div className={styles.Subtitle}>Health: {hero.health instanceof Array ? hero.health.join( ' / ') : hero.health }</div>
        {hero.damageMin && <div>Damage Min: {hero.damageMin instanceof Array ? hero.damageMin.join(' / ') : hero.damageMin}</div>}
        {hero.damageMax && <div>Damage Max: {hero.damageMax instanceof Array ? hero.damageMax.join(' / ') : hero.damageMax}</div>}
        <div className={styles.Subtitle}>Alliances: {hero.keywords}</div>
        { hero.keywords ? 
            hero.keywords.split(' ').map( (keyword: string) => <img className={styles.AllianceIcon} src={`${process.env.PUBLIC_URL}/images/alliances/${keyword}.jpg`} />) 
            : null}
        <div>{hero.abilities}</div>
    </div>
}