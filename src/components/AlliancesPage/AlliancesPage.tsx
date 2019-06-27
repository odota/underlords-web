import React from 'react';
import commonStyles from '../../common.module.css';
import AllianceCard from '../AllianceCard/AllianceCard';
import { alliances } from '../Localization/Localization';

export default class AlliancesPage extends React.Component {

  state = {
    order: Object.keys(alliances)
  };

  componentDidMount() {
    //sort
  }

  render() {
    return <div className={commonStyles.CardsContainer}>
      {this.state.order.map((key: string, i: number) =>{
      return <AllianceCard alliance={alliances[key]} embedded={false} key={i} />})}
    </div>;
  }
}