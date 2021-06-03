import React from 'react';
import { isEduHqStore } from '@youzan/utils-shop';
import StatProgressAlert from '../components/stat-progress-alert';
import Overview from './components/overview';
import List from './components/list';
import CampusFilter from '../components/campus-filter';
import { ContextProvider } from '../reducers/campus';

import './app.scss';

function App() {
  return (
    <ContextProvider>
      <div className="stat-course-container">
        <StatProgressAlert />
        { isEduHqStore && <CampusFilter showFilter /> }
        <Overview />
        <List />
      </div>
    </ContextProvider>
  );
}

export default App;
