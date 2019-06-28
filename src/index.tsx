import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './components/App/App';
import GlobalStyle from './components/App/GlobalStyle';
import muiTheme from './components/App/muiTheme';
import * as serviceWorker from './serviceWorker';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import { createBrowserHistory } from 'history';
import ReactGA from 'react-ga';

ReactGA.initialize('UA-55757642-4');
ReactGA.pageview(window.location.pathname + window.location.search);
const history = createBrowserHistory();
history.listen((location) => {
  ReactGA.pageview(location.pathname);
});

ReactDOM.render(
    // @ts-ignore
    <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme, muiTheme)}>
        <GlobalStyle />
        <Router>
            <App/>
        </Router>
    </MuiThemeProvider>    
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
