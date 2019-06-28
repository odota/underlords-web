import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import AlliancesPage from '../AlliancesPage/AlliancesPage';
import HeroesPage from '../HeroesPage/HeroesPage';
import ItemsPage from '../ItemsPage/ItemsPage';
import { InitLocalization, heroes, alliances, underlordsLoc, strings } from '../Localization/Localization';
import Header from '../Header';
import Footer from '../Footer';
import styles from './App.module.css';
import { Hero, Alliance } from '../../types';
import HeroCard from '../HeroCard/HeroCard';
import ReactTooltip from 'react-tooltip';
import commonStyles from '../../common.module.css';
import AllianceCard from '../AllianceCard/AllianceCard';
import HomePage from '../HomePage/HomePage';
import { Helmet } from 'react-helmet';

export default class App extends React.Component {

  state = {
    initializing: true
  }

  navbarPages = [
    {
      to: "/alliances",
      name: "dac_ingame_tab_synergies"
    },
    {
      to: "/heroes",
      name: "dac_ingame_tab_heroes"
    },
    {
      to: "/items",
      name: "dac_ingame_tab_items"
    }
  ];

  public async componentDidMount() {
    await InitLocalization();
    this.setState({initializing: false});
  }

  public render() {
    return this.state.initializing ?
      <div/>
      : <div>
        <Helmet>
            <meta charSet="utf-8" />
            <title>{strings.app_name} | {strings.app_title}</title>
            <meta name="description" content={strings.app_description} />
            <meta property="og:description" content={strings.app_description}></meta>
        </Helmet>
        <Header navbarPages={this.navbarPages.map((e: {to: string, name: string}, i: number) => {
          return <Link key={i} to={e.to}>{e.name.startsWith("dac") ? underlordsLoc[e.name] : e.name}</Link>
        })} />
        <div className={styles.MainContainer}>
          <Switch>
            <Route exact path="/" component={HomePage}/>
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