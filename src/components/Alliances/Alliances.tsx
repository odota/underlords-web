import React from 'react';
import alliances from 'dotaconstants/build/underlords_alliances.json';
import heroes from 'dotaconstants/build/underlords_heroes.json';

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
    return this.state.error ?
        <div>Error</div> 
      : this.state.loading ?
        <div>Loading</div>
      : <div>
          {Object.entries(this.state.alliances).map(([key, val]) => {
            return <div>
              <div>{key}</div>
              <div>{JSON.stringify(val)}</div>
            </div>
          })}
      </div>
  }
}
