import React from 'react';

export default class Alliances extends React.Component {

  state = {
    alliances: {},
    heroes: {},
    loading: true,
    error: false
  };

  componentDidMount() {
    this.setState({loading: true}, () => {
      Promise.all([
        fetch(
          `${process.env.REACT_APP_API_HOST}/api/alliances`,
          {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          })
          .then((res) => {
            if (res.ok) {
              return res.json();
            }

            throw Error(res.statusText);
          })
          .then(json => this.setState({alliances: json})),
        fetch(
          `${process.env.REACT_APP_API_HOST}/api/heroes`,
          {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          })
          .then((res) => {
            if (res.ok) {
              return res.json();
            }
            
            throw Error(res.statusText);
          })
          .then(json => this.setState({heroes: json}))
      ])
      .then(() => this.setState({loading: false}))
      .catch((err) => this.setState({error: err}))
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
