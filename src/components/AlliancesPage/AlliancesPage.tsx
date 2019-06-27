import React from 'react';
import commonStyles from '../../common.module.css';
import AllianceCard from '../AllianceCard/AllianceCard';
import HeroCard from '../HeroCard/HeroCard';
import { alliances, heroes } from '../Localization/Localization';
import { Hero } from '../../types';
import ReactTooltip from 'react-tooltip';

export default class AlliancesPage extends React.Component {

  state = {
    order: Object.keys(alliances)
  };

  componentDidMount() {
    //sort
  }

  render() {
    return <div className={commonStyles.CardsContainer}>
      {
        Object.keys(heroes).map((e, i) => {
            const hero: Hero = heroes[e as keyof typeof heroes];
            return <ReactTooltip id={`hero_${hero.dota_unit_name}`} effect="solid" place="bottom">
                <HeroCard hero={hero} />
            </ReactTooltip>
        })
      }
      {this.state.order.map((key: string, i: number) =>{
      return <AllianceCard alliance={alliances[key]} key={i} />})}
      {ReactTooltip.rebuild() /*rebinds the tooltips so that they actually work*/}
    </div>;
  }
}