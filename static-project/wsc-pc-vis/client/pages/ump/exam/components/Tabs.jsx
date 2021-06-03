import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import { Tabs } from 'zent';

import { TAB_DATA } from '../constants';

export default class Tab extends Component {
  onTabChange = id => {
    hashHistory.replace(`/list/${id}`);
  };

  render() {
    return (
      <div className="freebie-wrapper">
        <Tabs tabs={TAB_DATA} activeId={this.props.params.type} onChange={this.onTabChange} />
        {this.props.children}
      </div>
    );
  }
}
