import React from 'react';
import { Switch, Route, Link, RouteComponentProps } from 'react-router-dom';
import AlliancesPage from '../AlliancesPage/AlliancesPage';
import HeroesPage from '../HeroesPage/HeroesPage';
import ItemsPage from '../ItemsPage/ItemsPage';
import { InitLocalization, heroes, alliances, underlordsLoc, strings, getLanguage } from '../Localization/Localization';
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
import { generateURL, SUPPORTED_LANGUAGES } from '../../utils';
import FourOFourPage from '../FourOFourPage/FourOFourPage';
import TeamBuilderPage from '../TeamBuilderPage/TeamBuilderPage';
import { ServiceWorkerContext } from '../../context/ServiceWorkerContext';
import HeroesCrossTablePage from '../HeroesCrossTablePage/HeroesCrossTablePage';
type MatchParams = {
  [lang: string]: string
}

export default class App extends React.Component<RouteComponentProps> {

  static contextType = ServiceWorkerContext;

  state = {
    initializing: true,
    lang: 'en',
    deferredPrompt: null,
    doNotPromptInstall: localStorage.getItem('promptInstall'),
    showInstallPrompt: false,
  }

  /* If user goes to /ja/alliances but their language is
   * pt, we redirect to /pt/alliances by pushing to history (see componentDidMount).
   * However, this.props.match doesn't update and still returns /ja/heroes as the links
   * to other places of the site since /ja still matches to the parent <Route/> in index.tsx.
   * Instead, we just use the language as the root path.
   * 
   * It looks like this is only an issue for links in this component since it's the first
   * child of the parent route. HomePage, for example, matches against the updated value
   * which allows us to use match.url.
   */
  navbarPages = [
    {
      to: generateURL('alliances'),
      name: "dac_ingame_tab_synergies"
    },
    {
      to: generateURL('heroes'),
      name: "dac_ingame_tab_heroes"
    },
    {
      to: generateURL('items'),
      name: "dac_ingame_tab_items"
    },
    {
      to: generateURL('builder'),
      name: "app_team_builder"
    },
    {
      to: generateURL('cross'),
      name: "app_team_builder"
    }
  ];

  public async componentDidMount() {
    let lang = getLanguage();
    // If user langauage is different from URL lang, we redirect
    // so that URL is correct
    if ( this.props.match && this.props.match.params ) {
      const params = this.props.match.params as MatchParams;
      if (params && params.lang && lang !== params.lang) {
        this.props.history.push(window.location.pathname.replace(/[^/][^/]*/, lang))
      }
    }
    await InitLocalization(lang);
    this.setState({
      initializing: false,
      lang: lang
    });

    // only triggered if not installed already
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      this.setState({
        deferredPrompt: e, // Stash the event so it can be triggered later.
        showInstallPrompt: true
      });
    });
  }

  public render() {
    const { assetsUpdateReady, updateAssets } = this.context;

    return this.state.initializing ?
      <div/>
      : <div className={styles.AppContainer}>
        <Helmet>
            <html lang={this.state.lang} />
            <meta charSet="utf-8" />
            <title>{strings.app_name} | {strings.app_title}</title>
            <meta name="description" content={strings.app_description} />
            <meta property="og:description" content={strings.app_description}></meta>
            {
              Object.values(SUPPORTED_LANGUAGES).map((lang, i) => {
                // @ts-ignore - hreflang isn't supposed to be here accoding to ts
                return <link
                  key={i}
                  rel="alternate"
                  hreflang={lang}
                  href={(new URL(window.location.pathname.replace(/[^/][^/]*/, lang), window.location.href)).href}/>
              })
            }
        </Helmet>
        <Header {...this.props.match} navbarPages={this.navbarPages.map((e: {to: string, name: string}, i: number) => {
          return <Link key={i} to={e.to}>{e.name.startsWith("dac") ? underlordsLoc[e.name] : strings[e.name] || e.name}</Link>
        })} />
          <Switch>
            <Route exact path={`${this.props.match.path}/`} component={HomePage}/>
              <div className={styles.MainContainer}>
                <Switch>
                  <Route path={`${this.props.match.path}/alliances`} component={AlliancesPage}/>
                  <Route path={`${this.props.match.path}/heroes`} component={HeroesPage}/>
                  <Route path={`${this.props.match.path}/items`} component={ItemsPage} />
                  <Route path={`${this.props.match.path}/builder`} component={TeamBuilderPage} />
                  <Route path={`${this.props.match.path}/cross`} component={HeroesCrossTablePage} />
                  <Route component={FourOFourPage} />
                </Switch>
            </div>
          </Switch>
        {
          !assetsUpdateReady && !this.state.doNotPromptInstall && this.state.showInstallPrompt && 
          <div className={styles.UserPromptModule}>
            <div className={styles.UserPromptModuleContainer}>
              <div className={commonStyles.CardCapSmallImage}>
                <img alt="logo" src={`${process.env.PUBLIC_URL}/logo.svg`} />
                <h3>{strings.install_header}</h3>
              </div>
              <div className={commonStyles.CardBody}>
                <p>{strings.install_description}</p>
                <p>{strings.install_description2}</p>
                <button
                  className={`${commonStyles.Button} ${styles.Primary}`}
                  onClick={(e) => {
                    this.setState({
                      showInstallPrompt: false
                    }, () => {
                      // @ts-ignore
                      this.state.deferredPrompt.prompt();
                  })
                }}><div>{strings.install_yes}</div></button>
                <button
                  className={`${commonStyles.Button} ${styles.Secondary}`}
                  onClick={(e) => {
                    this.setState({showInstallPrompt: false});
                    localStorage.setItem('promptInstall', 'NO');
                  }}>
                  <div>{strings.install_no}</div>
                </button>
              </div>
            </div>
          </div>
        }
        {
          assetsUpdateReady &&
          <div className={styles.UserPromptModule}>
            <div className={styles.UserPromptModuleContainer}>
              <div className={commonStyles.CardCapSmallImage}>
                <h3>There's an update to the site!</h3>
              </div>
              <div className={commonStyles.CardBody}>
              <button
                className={`${commonStyles.Button} ${styles.Primary}`}
                onClick={(e) => {
                  updateAssets();
                }}>
                <div>Refresh</div>
              </button>
              </div>
            </div>
          </div>
        }
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