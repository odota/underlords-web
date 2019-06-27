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
import Header from '../Header';
import Footer from '../Footer';

export default class App extends React.Component {

  state = {
    initializing: true
  }

   navbarPages = [
    <Link key="header_alliances" to="/alliances">Alliances</Link>,
    <Link key="header_heroes" to="/heroes">Heroes</Link>,
    <Link key="header_items" to="/items">Items</Link>,
  ];

  public async componentDidMount() {
    await InitLocalization();
    this.setState({initializing: false});
  }

  public render() {
    return this.state.initializing ?
      <div/>
      : <div>
        <Header navbarPages={this.navbarPages} />
        <Switch>
          <Route path="/alliances" component={AlliancesPage}/>
          <Route path="/heroes" component={Heroes}/>
          <Route path="/items" component={Items} />
        </Switch>
        <Footer/>
      </div>;
  }
}