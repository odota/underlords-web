import React from 'react';
import items from 'underlordsconstants/build/underlords_items.json';
import { ErrorBoundary } from '../ErrorBoundary/ErrorBoundary';
import { underlordsLoc } from '../Localization/Localization';
import commonStyles from '../../common.module.css';
import ItemCard from '../ItemCard/ItemCard';
import { Item, Items } from '../../types';
import SortButtons from '../SortButtons/SortButtons';

export default class ItemsPage extends React.Component {
    
    state = {
        order: Object.keys(items),
        currentSort: 'displayName',
        isAscending: true
    }

    sorts = [
        {
            by: 'displayName',
            name: "dac_heropedia_name"
        },
        {
            by: 'tier',
            name: "dac_heropedia_tiers"
        },
        {
            by: 'type',
            name: "dac_dev_item_type"
        }
    ];

    constructor(props: any) {
        super(props);
        this.sort = this.sort.bind(this);
    }

    private sort(by: string) {
        const ascending: boolean = this.state.currentSort === by ? !this.state.isAscending : true;
        const order: number = ascending ? 1 : -1;
        let newSort: string[] = this.state.order
            .sort((x: string, y: string) => {
                let a: Item = items[x as keyof typeof items];
                let b: Item = items[y as keyof typeof items];
                const first = by === "displayName" ? underlordsLoc[a.displayName]: a[by as keyof Item] || 0;
                const second =  by === "displayName" ? underlordsLoc[b.displayName] : b[by as keyof Item] || 0;
                if (first === second) {
                    return underlordsLoc[a.displayName] > underlordsLoc[b.displayName] ? 1 : -1;
                }
                return order * (first > second ? 1 : -1);
            });

        this.setState({
            order: newSort,
            currentSort: by,
            isAscending: ascending
        });
    }

    public render() {
        return <div className={commonStyles.PageContainer}>
            <div className={commonStyles.PageSectionHeader}>
                <h1>{underlordsLoc["dac_ingame_tab_items"]}</h1>
                <SortButtons sorts={this.sorts} 
                    sortFunction={this.sort}
                    currentSort={this.state.currentSort}
                    isAscending={this.state.isAscending}/>
            </div>
            <ErrorBoundary>
                <div className={commonStyles.CardsContainer}>
                    { this.state.order.map((key) => {
                        const item: Item = items[key as keyof typeof items];
                        return <ItemCard item={item} />
                    })}
                </div>
            </ErrorBoundary>
        </div>;
    }
}