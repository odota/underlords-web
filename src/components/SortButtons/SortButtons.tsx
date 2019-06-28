import React from 'react';
import { IconArrowUp, IconArrowDown } from '../Icons';
import commonStyles from '../../common.module.css';
import { underlordsLoc } from '../Localization/Localization';
import styles from './HomePage.module.css';

type Props = {
    sorts: {
      by: string,
      name: string  
    }[],
    sortFunction: (by: string) => void,
    currentSort: string,
    isAscending: boolean
}

export default class SortButtons extends React.Component<Props> {

    public render() {
        const { sorts, sortFunction, currentSort, isAscending } = this.props;
        return <div className={commonStyles.SortButtonsContainer}>
            {sorts.map((sort, i) => <button
                className={ currentSort === sort.by ? commonStyles.ActiveButton : "" }
                onClick={(e) => sortFunction(sort.by)}
                key={i}>
                <div className={commonStyles.InlineImageContainer}>
                    { currentSort === sort.by ? (
                        isAscending ? 
                        <IconArrowUp/> : <IconArrowDown/>
                    ) : null}
                    <span>{sort.name.startsWith("dac") ? underlordsLoc[sort.name] : sort.name}</span>
                </div>
                </button>
                )}
        </div>
    }
}