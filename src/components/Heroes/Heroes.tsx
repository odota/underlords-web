import React from 'react';
import heroes from 'dotaconstants/build/underlords_heroes.json';
import abilities from 'dotaconstants/build/underlords_abilities.json';

export class Heroes extends React.Component {
    public componentDidMount() {
        
    }
    public render() {
        return <div>
            <pre>{JSON.stringify( heroes['abaddon'], null, 2 )}</pre>
            { Object.keys(heroes).map( key => <HeroCard heroName={key} ></HeroCard>)}
        </div>
    }
}

const HeroCard = ( props: { heroName: string } ) => {
    const hero = (heroes as any)[props.heroName];
    return <div>
        <h1>{props.heroName}</h1>
        <div>Armor: {hero.armor}</div>
        <div>Attack Range: {hero.attackRange}</div>
        
    </div>
}