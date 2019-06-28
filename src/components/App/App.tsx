import React from 'react';
import { Switch, Route, Link, RouteComponentProps, Redirect } from 'react-router-dom';
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
import { SUPPORTED_LANGUAGES } from '../../utils';
// @ts-ignore
import path from 'path-browserify';

type MatchParams = {
  [lang: string]: string
}

export default class App extends React.Component<RouteComponentProps> {

  state = {
    initializing: true
  }

  // Sometimes match.url has an ending '/'
  navbarPages = [
    {
      to: path.join(this.props.match.url, 'alliances'),
      name: "dac_ingame_tab_synergies"
    },
    {
      to: path.join(this.props.match.url, 'heroes'),
      name: "dac_ingame_tab_heroes"
    },
    {
      to: path.join(this.props.match.url, 'items'),
      name: "dac_ingame_tab_items"
    }
  ];

  public async componentDidMount() {
    let lang = 'en';
    if ( this.props.match && this.props.match.params ) {
      const params = this.props.match.params as MatchParams;
      if (params && params.lang) {
          lang = params.lang;
      }
    }
    await InitLocalization(lang);
    this.setState({initializing: false});
  }

  public render() {
    return this.state.initializing ?
      <div/>
      : <div className={styles.AppContainer}>
        <Helmet>
            <meta charSet="utf-8" />
            <title>{strings.app_name} | {strings.app_title}</title>
            <meta name="description" content={strings.app_description} />
            <meta property="og:description" content={strings.app_description}></meta>
            {
              Object.values(SUPPORTED_LANGUAGES).map((lang) => {
                // @ts-ignore
                return <link
                  rel="alternate"
                  hreflang={lang}
                  href={(new URL(window.location.pathname.replace(/[^\/][^\/]*/, lang), window.location.href)).href}/>
              })
            }
        </Helmet>
        <Header {...this.props.match} navbarPages={this.navbarPages.map((e: {to: string, name: string}, i: number) => {
          return <Link key={i} to={e.to}>{e.name.startsWith("dac") ? underlordsLoc[e.name] : e.name}</Link>
        })} />
          <Switch>
            <Route exact path={`${this.props.match.path}/`} component={HomePage}/>
            <div className={styles.MainContainer}>
              <Route path={`${this.props.match.path}/alliances`} component={AlliancesPage}/>
              <Route path={`${this.props.match.path}/heroes`} component={HeroesPage}/>
              <Route path={`${this.props.match.path}/items`} component={ItemsPage} />
            </div>
          </Switch>
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