import React from 'react';
import commonStyles from '../../common.module.css';
import AllianceCard from '../AllianceCard/AllianceCard';
import alliances from 'underlordsconstants/build/underlords_alliances.json';
import { Alliances } from '../../types';

export default class AlliancesPage extends React.Component {

  state = {
    order: Object.keys(alliances)
  };

  componentDidMount() {
    //sort
  }

  render() {
    return <div className={commonStyles.CardsContainer}>
      {this.state.order.map((key: string, i: number) => 
      <AllianceCard alliance={(alliances as Alliances)[key]} key={i} />)}
    </div>;
  }
}