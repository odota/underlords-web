import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import Alliances from '../Alliances/Alliances';
import Heroes from '../Heroes/Heroes';
import Items from '../Items/Items';
import { Hero, GameStrings, Alliance, Item, Items } from '../../types';
import heroes from 'underlordsconstants/build/underlords_heroes.json';
import alliances from 'underlordsconstants/build/underlords_alliances.json';
import items from 'underlordsconstants/build/underlords_items.json';
import gameStrings from 'underlordsconstants/build/underlords_localization_en.json';

export default class App extends React.Component {

  state = {
    initializing: true,
    heroes: [],
    npcs: [],
    alliances: []
  }

  // TODO - move this logic to constants output
  public componentDidMount() {
    let realHeroes: Hero[] = [];
    let npcs: Hero[] = [];

    Object.entries(heroes).forEach(([k, v]) => {
        const strings: GameStrings = gameStrings;
        if (v.displayName && v.displayName.includes("#")) {
            v.displayName = strings[v.displayName.replace('#', '')];
        }
        if (v.draftTier > 0) {
            realHeroes.push(v as Hero);
        } else {
            npcs.push(v as Hero);
        }
    });

    const organizedAlliances: Alliance[] = Object.keys(alliances).map((key) => {
      let a: Partial<Alliance> = alliances[key as keyof typeof alliances];
      a.name = key.toLowerCase();
      a.displayName = (gameStrings as GameStrings)[`dac_synergy_${a.name}`];
      let allianceHeroes: Hero[] = [];
      Object.entries(realHeroes).forEach(([k, v]) => {
        if (v.keywords.includes(a.name as string)) {
          allianceHeroes.push(v as Hero);
        }
      })

      // sort by tier
      a.heroes = allianceHeroes.sort((x: any, y: any) => {
        if (x.draftTier === y.draftTier) {
          return x.displayName > y.displayName ? 1 : -1;
        }
        return x.draftTier > y.draftTier ? 1: -1;
      })
      return a;
    }) as Alliance[];

    // const organizedItems: Items[] = Object.keys(items).map((key: string) => {
    //   let item: Item = (items as Items)[key];
    //   item.displayName = (gameStrings as GameStrings)[`dac_synergy_${item.displayName}`];
    // });

    this.setState({
      initializing: false,
      heroes: realHeroes,
      npcs: npcs,
      alliances: organizedAlliances
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
          <Route path="/alliances"
            render={(props) => <Alliances {...props} alliances={this.state.alliances} />}
          />
          <Route path="/heroes"
            render={(props) => <Heroes {...props} heroes={this.state.heroes} npcs={this.state.npcs} alliances={this.state.alliances} />}
          />
          <Route path="/Items" component={Items} />
        </Switch>
      </div>;
  }
}