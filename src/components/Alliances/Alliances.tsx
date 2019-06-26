import React from 'react';
import commonStyles from '../../common.module.css';
import { Alliance, } from '../../types';
import AllianceCard from '../AllianceCard/AllianceCard';

export default class Alliances extends React.Component<{ alliances: Alliance[]}> {

  state = {
    alliances: this.props.alliances
  };

  componentDidMount() {
    //sort
  }

  render() {
    return <div className={commonStyles.CardsContainer}>
      {this.state.alliances.map((alliance: Alliance, i: number) => <AllianceCard alliance={alliance} key={i} />)}
    </div>;
  }
}