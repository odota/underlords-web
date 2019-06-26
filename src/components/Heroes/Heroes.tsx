import React from 'react';
import heroes from 'underlordsconstants/build/underlords_heroes.json';
import commonStyles from '../../common.module.css';
import { Hero, Alliance } from '../../types';
import HeroCard from '../HeroCard/HeroCard';

export default class Heroes extends React.Component<{ heroes: Hero[], npcs: Hero[], alliances: Alliance[] }> {

    state = {
        heroes: this.props.heroes,
        sort: 'displayName',
        isAscending: false //so that it's ascending on componentMount
    }

    public componentDidMount() {
        this.sortHeroes('displayName');
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
                { this.state.heroes.map( (e, i) => <HeroCard hero={e} alliances={this.props.alliances} key={i} />)}
            </div>
        </div>
    }
}