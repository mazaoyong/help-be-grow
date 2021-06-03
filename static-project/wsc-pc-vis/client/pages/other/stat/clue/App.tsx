import React from 'react';
import { isEduHqStore } from '@youzan/utils-shop';
import Overview from './components/overview';
import Source from './components/source';
import Conversion from './components/conversion';
import CampusFilter from '../components/campus-filter';
import StatProgressAlert from '../components/stat-progress-alert';
import { ContextProvider } from '../reducers/campus';

import './app.scss';

function App() {
  return (
    <ContextProvider>
      <div className="stat-clue-container">
        <StatProgressAlert />
        { isEduHqStore && <CampusFilter showHqStore /> }
        <Overview />
        <Source />
        <Conversion />
      </div>
    </ContextProvider>
  );
}

export default App;
