import React from 'react';
import { Route } from 'react-router-dom';
import Alliances from '../Alliances/Alliances'

const App: React.FC = () => {
  return (
    <Route path="/alliances" component={Alliances}/>
  );
}

export default App;
