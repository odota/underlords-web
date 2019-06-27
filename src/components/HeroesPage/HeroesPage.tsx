import React from 'react';
import heroes from 'underlordsconstants/build/underlords_heroes.json';
import commonStyles from '../../common.module.css';
import { Hero } from '../../types';
import HeroCard from '../HeroCard/HeroCard';
import ReactTooltip from 'react-tooltip';
import { underlordsLoc } from '../Localization/Localization';
import SortButtons from '../SortButtons/SortButtons';

export default class HeroesPage extends React.Component {

    state = {
        heroes: [],
        npcs: [],
        currentSort: 'displayName',
        isAscending: false //so that it's ascending on componentMount
    }

    sorts = [
        {
            by: 'displayName',
            name: "dac_heropedia_name"
        }, {
            by: 'draftTier',
            name: "dac_heropedia_tiers"
        }, {
            by: 'health',
            name: "dac_ingame_health"
        }, {
            by: 'armor',
            name: "dac_ingame_armor"
        }, {
            by: 'damageMax',
            name: "dac_ingame_damagemax"
        }, {
            by: 'attackRate',
            name: "dac_ingame_attackspeed"
        }, {
            by: 'movespeed',
            name: "dac_ingame_movespeed"
        }, {
            by: 'magicResist',
            name: "dac_ingame_magicresist"
        }
    ];

    constructor(props: any) {
        super(props);
        this.sortHeroes = this.sortHeroes.bind(this);
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

    private sortHeroes(by: keyof Hero) {
        const ascending: boolean = this.state.currentSort === by ? !this.state.isAscending : true;
        const order: number = ascending ? 1 : -1;
        let newSort: string[] = this.state.heroes
            .sort((x: string, y: string) => {
                let a: Hero = heroes[x as keyof typeof heroes];
                let b: Hero = heroes[y as keyof typeof heroes];
                let first = by === "displayName" ? underlordsLoc[a.displayName]: a[by] || 0;
                let second =  by === "displayName" ? underlordsLoc[b.displayName] : b[by] || 0;

                if (Array.isArray(first)) {
                    first = first[first.length - 1];
                }

                if (Array.isArray(second)) {
                    second = second[second.length - 1];
                }

                if (first === second) {
                    return underlordsLoc[a.displayName] > underlordsLoc[b.displayName] ? 1 : -1;
                }
                return order * (first > second ? 1 : -1);
            });

        this.setState({
            heroes: newSort,
            currentSort: by,
            isAscending: ascending
        }, () => {
            ReactTooltip.rebuild();
        });
    }

    public render() {
        return <div className={commonStyles.PageContainer}>
            <div className={commonStyles.PageSectionHeader}>
                <h1>Items</h1>
                <SortButtons sorts={this.sorts} 
                    sortFunction={this.sortHeroes}
                    currentSort={this.state.currentSort}
                    isAscending={this.state.isAscending}/>
            </div>
            <div className={commonStyles.CardsContainer}>
                { this.state.heroes.map( (e: keyof typeof heroes, i: number) => <HeroCard hero={heroes[e]} highlight={this.state.currentSort} />)}
                {ReactTooltip.rebuild() /*rebinds the tooltips so that they actually work*/}
            </div>
        </div>
    }
}