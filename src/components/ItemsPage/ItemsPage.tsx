import React from 'react';
import items from 'underlordsconstants/build/underlords_items.json';
import { ErrorBoundary } from '../ErrorBoundary/ErrorBoundary';
import { underlordsLoc } from '../Localization/Localization';
import commonStyles from '../../common.module.css';
import ItemCard from '../ItemCard/ItemCard';
import { Item } from '../../types';


export default class ItemsPage extends React.Component {
    
    state = {
        order: Object.keys(items)
    }

    public componentDidMount() {

    }

    private sort(by: string) {

    }

    public render() {
        return <div>
            <div className={commonStyles.PageSectionHeader}>
                <h1>Items</h1>
                <div className={commonStyles.SortButtonsContainer}>
                    <h3>Sort</h3>
                    <button onClick={(e) => this.sort('draftTier')}>Tier/Cost</button>
                    <button onClick={(e) => this.sort('displayName')}>Name</button>
                </div>
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