import React, { Component } from 'react';
import { Tabs } from 'zent';
import { hashHistory } from 'react-router';

export default class App extends Component {
  constructor(props) {
    super(props);

    // 0 未开始， 1 进行中， 2 已结束， 3 全部活动
    this.state = {
      activeId: props.initActiveId,
      tabs: [
        {
          title: '全部活动',
          key: '3',
        },
        {
          title: '未开始',
          key: '0',
        },
        {
          title: '进行中',
          key: '1',
        },
        {
          title: '已结束',
          key: '2',
        },
        {
          title: '推广效果',
          key: '4',
        },
      ],
    };
  }

  onTabChange = id => {
    this.setState({ activeId: id }, () => {
      if (id === '4') {
        hashHistory.push('/history');
      } else {
        hashHistory.push(`/list/${id}`);
      }
    });
  };

  render() {
    const { activeId, tabs } = this.state;
    return (
      <div>
        <Tabs activeId={activeId} onChange={this.onTabChange} tabs={tabs} />
      </div>
    );
  }
}
