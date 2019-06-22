import React from 'react';
import heroes from 'dotaconstants/build/underlords_heroes.json';
import abilities from 'dotaconstants/build/underlords_abilities.json';
import styles from './Heroes.module.css';

export class Heroes extends React.Component {
    public componentDidMount() {
        
    }
    public render() {
        return <div>
            <pre>{JSON.stringify( heroes['abaddon'], null, 2 )}</pre>
            <div style={{ display: 'flex', flexWrap: 'wrap', height: '100vh', overflow: 'scroll' }}>
                { Object.keys(heroes).map( key => <HeroCard key={key} heroName={key} ></HeroCard>)}
            </div>
        </div>
    }
}

const GetHeroImage = ( heroName: string ) => `https://api.opendota.com/apps/dota2/images/heroes/${heroName}_full.png?`;

const HeroCard = ( props: { heroName: string } ) => {
    const hero = heroes[props.heroName as keyof typeof heroes];
    return <div className={styles.HeroCard}>
        <div>
            <div className={styles.Title}>{props.heroName}</div>
            <div className={styles.Midtitle}>Tier {hero.draftTier}</div>
        </div>
        <div className={styles.HeroBackground}>
            <img className={styles.HeroImage} src={GetHeroImage(props.heroName)} />
        </div>
        <div className={styles.Subtitle}>Armor: {hero.armor}</div>
        <div className={styles.Subtitle}>Attack Range: {hero.attackRange}</div>
        <div className={styles.Subtitle}>Attack Rate: {hero.attackRate}</div>
        <div className={styles.Subtitle}>Health: {hero.health}</div>
        {hero.damageMin && <div>Damage Min: {hero.damageMin instanceof Array ? hero.damageMin.join(' / ') : hero.damageMin}</div>}
        {hero.damageMax && <div>Damage Max: {hero.damageMax instanceof Array ? hero.damageMax.join(' / ') : hero.damageMax}</div>}
        <div>{hero.abilities}</div>

    </div>
}