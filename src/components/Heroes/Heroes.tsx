import React from 'react';
import heroes from 'dotaconstants/build/underlords_heroes.json';
import abilities from 'dotaconstants/build/underlords_abilities.json';
import styles from './Heroes.module.css';

// TODO: Is there a better way to define this?
type hero = Partial<typeof heroes[keyof typeof heroes]>;

export default class Heroes extends React.Component {

    state = {
        heroes: [],
        npc: [],
        sort: "Name",
    }

    public componentDidMount() {
        let realHeroes: hero[] = [];
        let npc: hero[] = [];
        Object.entries(heroes).map(([k, v]) => {
            // TODO - fix
            v.displayName = k;
            if (v.draftTier > 0) {
                realHeroes.push(v);
            } else {
                npc.push(v)
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
        let newSort: Partial<hero>[] = this.state.heroes
            .sort((x: any, y: any) => {
                if (x[by] === y[by]) {
                    return x.displayName > y.displayName ? 1 : -1;
                }
                return x[by] > y[by] ? 1 : -1;
            });

        this.setState({heroes: newSort});
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

const GetHeroImage = ( heroName: string ) => `https://api.opendota.com/apps/dota2/images/heroes/${heroName}_full.png?`;

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
            <img className={styles.HeroImage} src={GetHeroImage(hero.displayName)} />
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