import React from 'react';
import { isEduHqStore } from '@youzan/utils-shop';
import Overview from './components/overview';
import Course from './components/course';
import Student from './components/student';
import Sales from './components/sales';
import CampusFilter from '../components/campus-filter';
import StatProgressAlert from '../components/stat-progress-alert';
import { ContextProvider } from '../reducers/campus';
import LinkNav from '@youzan/wsc-pc-third-nav';

import './app.scss';

function App() {
  return (
    <ContextProvider>
      <div className="stat-course-container">
        <LinkNav hideOnlyCurNav={true}/>
        <StatProgressAlert />
        { isEduHqStore && <CampusFilter /> }
        <Overview />
        <Course />
        <Student />
        <Sales />
      </div>
    </ContextProvider>
  );
}

export default App;
