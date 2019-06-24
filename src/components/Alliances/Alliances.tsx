import React from 'react';
import alliances from 'dotaconstants/build/underlords_alliances.json';
import heroes from 'dotaconstants/build/underlords_heroes.json';
import styles from './Alliances.module.css';
import commonStyles from '../common.module.css';

export default class Alliances extends React.Component {

  state = {
    alliances: {},
    heroes: {},
    loading: true,
    error: false
  };

  componentDidMount() {
    this.setState({
      alliances: alliances,
      heroes: heroes
    })
  }

  render() {
    if ( this.state.error )
    {
      return <div>Error</div> ;
    }
    return <div>
          {Object.entries(this.state.alliances).map(([key, val]) => {
            return <div className={styles.AllianceCard}>
              <img src={`${process.env.PUBLIC_URL}/images/alliances/${key}.jpg`} />
              <div className={commonStyles.Title}>{key}</div>
              <div>{JSON.stringify(val)}</div>
            </div>
          })}
      </div>
  }
}
