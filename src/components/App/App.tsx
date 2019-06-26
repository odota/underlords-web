import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import AlliancesPage from '../AlliancesPage/AlliancesPage';
import Heroes from '../Heroes/Heroes';
import Items from '../Items/Items';
import { Hero, GameStrings, Alliance, Item } from '../../types';
import heroes from 'underlordsconstants/build/underlords_heroes.json';
import items from 'underlordsconstants/build/underlords_items.json';
import gameStrings from 'underlordsconstants/build/underlords_localization_en.json';
import { InitLocalization } from '../Localization/Localization';

export default class App extends React.Component {

  state = {
    initializing: true,
    heroes: [],
    npcs: [],
  }

  // TODO - move this logic to constants output
  public async componentDidMount() {
    await InitLocalization();

    let realHeroes: Hero[] = [];
    let npcs: Hero[] = [];

    Object.entries(heroes).forEach(([k, v]) => {
        // const strings: GameStrings = gameStrings;
        // if (v.displayName && v.displayName.includes("#")) {
        //     v.displayName = strings[v.displayName.replace('#', '')];
        // }
        if (v.draftTier > 0) {
            realHeroes.push(v as Hero);
        } else {
            npcs.push(v as Hero);
        }
    });

    // const organizedItems: Items[] = Object.keys(items).map((key: string) => {
    //   let item: Item = (items as Items)[key];
    //   item.displayName = (gameStrings as GameStrings)[`dac_synergy_${item.displayName}`];
    // });

    this.setState({
      initializing: false,
      heroes: realHeroes,
      npcs: npcs
    });
  }

  public render() {
    return this.state.initializing ? 
      <div>Initializing...</div>
      : <div>
        <div style={{ display: 'flex' }}>
          <Link to="/alliances">Alliances</Link>
          <Link to="/heroes">Heroes</Link>
          <Link to="/items">Items</Link>
        </div>
        <Switch>
          <Route path="/alliances" component={AlliancesPage}/>
          <Route path="/heroes" component={Heroes}/>
          <Route path="/Items" component={Items} />
        </Switch>
      </div>;
  }
}