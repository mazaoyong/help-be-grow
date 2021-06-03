import React from 'react';

import Header from '../../components/header';
import TopBar from '../../components/top-bar';
import UpgradeForm from './components/upgrade-form';
import UpgradeTab from '../../components/upgrade-tab';

export default class App extends React.Component {
  render() {
    const content = '选择要创建有赞教育的方式';
    return (
      <div>
        <Header />
        <TopBar content={content} />
        <UpgradeTab />
        <UpgradeForm />
      </div>
    );
  }
}
