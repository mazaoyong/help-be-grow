import React from 'react';

import Header from '../../components/header';
import TopBar from '../../components/top-bar';
import CreateForm from './components/ab-create-form';
import UpgradeTab from '../../components/upgrade-tab';

export default class App extends React.Component {
  render() {
    const { defaultShopName = '' } = this.props.location.query || {};
    const content = '选择要创建有赞教育的方式';
    return (
      <div>
        <Header />
        <TopBar content={content} />
        <UpgradeTab />
        <CreateForm defaultShopName={defaultShopName} />
      </div>
    );
  }
}
