import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import Alliances from '../Alliances/Alliances'
import { Heroes } from '../Heroes/Heroes';
import { Items } from '../Items/Items';

const App: React.FC = () => {
  return (
    <div>
      <div style={{ display: 'flex' }}>
        <Link to="/alliances">Alliances</Link>
        <Link to="/heroes">Heroes</Link>
        <Link to="/items">Items</Link>
      </div>
      <Switch>
        <Route path="/alliances" component={Alliances}/>
        <Route path="/heroes" component={Heroes} />
        <Route path="/Items" component={Items} />
      </Switch>
    </div>
  );
}

export default App;
