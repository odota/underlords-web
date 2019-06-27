import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import AlliancesPage from '../AlliancesPage/AlliancesPage';
import HeroesPage from '../HeroesPage/HeroesPage';
import ItemsPage from '../ItemsPage/ItemsPage';
import { InitLocalization } from '../Localization/Localization';
import Header from '../Header';
import Footer from '../Footer';
import styles from './App.module.css';

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
        <div className={styles.MainContainer}>
          <Switch>
            <Route path="/alliances" component={AlliancesPage}/>
            <Route path="/heroes" component={HeroesPage}/>
            <Route path="/items" component={ItemsPage} />
          </Switch>
        </div>
        <Footer/>
      </div>;
  }
}