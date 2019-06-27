import React from 'react';
import heroes from 'underlordsconstants/build/underlords_heroes.json';
import commonStyles from '../../common.module.css';
import { Hero, GameStrings } from '../../types';
import HeroCard from '../HeroCard/HeroCard';

export default class Heroes extends React.Component {

    state = {
        heroes: [],
        npcs: [],
        sort: 'displayName',
        isAscending: false //so that it's ascending on componentMount
    }

    public componentDidMount() {
        const realHeroes: string[] = [];
        const npcs: string[] = [];

        Object.entries(heroes).forEach(([k, v]) => {
            if (v.draftTier > 0) {
                realHeroes.push(k);
            } else {
                npcs.push(k);
            }
        });

        this.setState({
            heroes: realHeroes,
            npcs: npcs
        }, () => {
            this.sortHeroes("displayName");
        })
    }

    private sortHeroes(by: any) {
        const ascending: boolean = this.state.sort === by ? !this.state.isAscending : true;
        const order: number = ascending ? 1 : -1;
        let newSort: string[] = this.state.heroes
            .sort((x: string, y: string) => {
                let a = heroes[x as keyof typeof heroes];
                let b = heroes[x as keyof typeof heroes];
                const first = a[by as keyof Hero] || 0;
                const second =  b[by as keyof Hero] || 0;
                return order * (first > second ? 1 : -1);
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
                { this.state.heroes.map( (e: keyof typeof heroes, i: number) => <HeroCard hero={heroes[e]} embedded={false}/>)}
            </div>
        </div>
    }
}