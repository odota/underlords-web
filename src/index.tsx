import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import './index.module.scss';
import App from './components/App/App';
import muiTheme from './components/App/muiTheme';
import * as serviceWorker from './serviceWorker';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import { createBrowserHistory } from 'history';
import ReactGA from 'react-ga';
import { SUPPORTED_LANGUAGES } from './utils';
import { getLanguage } from './components/Localization/Localization';
import { ServiceWorkerProvider } from './context/ServiceWorkerContext';

ReactGA.initialize('UA-55757642-4');
ReactGA.pageview(window.location.pathname + window.location.search);
const history = createBrowserHistory();
history.listen((location) => {
  ReactGA.pageview(location.pathname);
});

ReactDOM.render(
    // @ts-ignore
    <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme, muiTheme)}>
      <ServiceWorkerProvider>
        <Router>
          <Switch>
              <Route path={`/:lang(${Object.values(SUPPORTED_LANGUAGES).join("|")})`} component={App}/>
              <Redirect to={`/${getLanguage()}/`}/>
          </Switch>
        </Router>
      </ServiceWorkerProvider>
    </MuiThemeProvider>    
, document.getElementById('root'));