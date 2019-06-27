import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import AlliancesPage from '../AlliancesPage/AlliancesPage';
import HeroesPage from '../HeroesPage/HeroesPage';
import ItemsPage from '../ItemsPage/ItemsPage';
import { InitLocalization, heroes, alliances } from '../Localization/Localization';
import Header from '../Header';
import Footer from '../Footer';
import styles from './App.module.css';
import { Hero, Alliance } from '../../types';
import HeroCard from '../HeroCard/HeroCard';
import ReactTooltip from 'react-tooltip';
import commonStyles from '../../common.module.css';
import AllianceCard from '../AllianceCard/AllianceCard';

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
        <ReactTooltip id="hero" place="right" className={commonStyles.Tooltip} effect="solid" getContent={ (dataTip) => {
          const hero: Hero = heroes[dataTip as keyof typeof heroes];
          return hero ? <HeroCard hero={hero} /> : null;
        }} />
        <ReactTooltip id="alliance" place="right" className={commonStyles.Tooltip} effect="solid" getContent={ (dataTip) => {
          const alliance: Alliance = alliances[dataTip as keyof typeof alliances];
          return alliance ? <AllianceCard alliance={alliance} /> : null;
        }} />
        <Footer/>
      </div>;
  }
}