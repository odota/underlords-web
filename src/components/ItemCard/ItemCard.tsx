import React from 'react';
import { Item } from '../../types';
import { StripHtml } from '../../utils';
import { underlordsLoc, strings } from '../Localization/Localization';
import commonStyles from '../../common.module.css';

// https://api.opendota.com/apps/dota2/images/tooltips/gold.png
// https://api.opendota.com/apps/dota2/images/tooltips/mana.png
export default class ItemCard extends React.Component<{ item: Item}> {

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
                <div className={commonStyles.Midtitle}>{strings.general_tier} {item.tier} {underlordsLoc[`dac_dev_item_${item.type}`]}</div>
                { item.cooldown ? 
                    <div className={commonStyles.InlineImageContainer}>
                        <img alt="cooldown" src={"https://api.opendota.com/apps/dota2/images/tooltips/cooldown.png"}/>
                        <span>{item.cooldown}</span>
                    </div>
                    : <div/>
                }
                <div className={commonStyles.DescriptionCard}>
                    <p className={commonStyles.DescriptionText}>{description}</p>
                    <div className={commonStyles.LoreText}>{lore}</div>
                </div>
            </div>
        </div>
    }
}