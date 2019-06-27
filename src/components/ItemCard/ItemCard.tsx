import React from 'react';
import { Item } from '../../types';
import { StripHtml } from '../../utils';
import { underlordsLoc } from '../Localization/Localization';
import commonStyles from '../../common.module.css';
import { isBigIntLiteral } from '@babel/types';

// https://api.opendota.com/apps/dota2/images/tooltips/gold.png
// https://api.opendota.com/apps/dota2/images/tooltips/mana.png
export default class ItemmCard extends React.Component<{ item: Item}> {

    public render() {
        const { item } = this.props;
        const description = StripHtml(underlordsLoc[item.description]);
        const lore = StripHtml(underlordsLoc[`${item.displayName}_lore`]);
        const displayName = underlordsLoc[item.displayName];
        return <div className={commonStyles.Card}>
            <div className={commonStyles.CardCapSmallImage}>
                <img alt={item.icon} src={`${process.env.PUBLIC_URL}/images/items/${item.icon}_psd.png`} />
                <h1 className={commonStyles.Title} style={{fontSize: '18px'}}>{displayName}</h1>
            </div>
            <div className={commonStyles.CardBody}>
                <div className={commonStyles.Subtitle}>Tier: {item.tier}</div>
                <div className={commonStyles.Subtitle}>Type: {underlordsLoc[`dac_dev_item_${item.type}`]}</div>
                { item.cooldown ? 
                    <div className={commonStyles.InlineImageContainer}>
                        <img alt="cooldown" src={"https://api.opendota.com/apps/dota2/images/tooltips/cooldown.png"}/>
                        <span>{item.cooldown}</span>
                    </div>
                    : <div/>
                }
                <div className={commonStyles.DescriptionCard}>
                    <p>{description}</p>
                    <small>{lore}</small>
                </div>
            </div>
        </div>
    }
}

                // <tr key={item}>
                //     <td>{item}</td>
                //     <td>{items[item as keyof typeof items].tier}</td>
                //     <td>{underlordsLoc[items[item as keyof typeof items].displayName]}</td>
                //     <td>{items[item as keyof typeof items].icon}</td>
                //     <td>{items[item as keyof typeof items].type}</td>
                //     <td>{items[item as keyof typeof items].cooldown}</td>
                // </tr> 