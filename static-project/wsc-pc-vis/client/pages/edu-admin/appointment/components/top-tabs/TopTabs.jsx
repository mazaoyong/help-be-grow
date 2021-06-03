import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { hashHistory } from 'react-router';

export default class TopTabs extends Component {
  state = {
    activeId: 1,
  };

  onTabChange = index => {
    const tab = this.props.tabs[index];
    if (this.state.activeId === tab.id) return;
    this.setState({ activeId: tab.id });
    // todo
    hashHistory.push(tab.route);
  };

  genTabsElement() {
    const tabsData = this.props.tabs;
    const activeId = this.state.activeId;
    return (
      <ul className="top-tabs__list">
        {tabsData.map((tab, index) => {
          let tabItem = null;
          if (activeId === tab.id) {
            tabItem = (
              <li
                key={tab.id}
                className="top-tabs__item top-tabs__item-active"
                onClick={() => this.onTabChange(index)}
              >
                {tab.title}
              </li>
            );
          } else {
            tabItem = (
              <li key={tab.id} className="top-tabs__item" onClick={() => this.onTabChange(index)}>
                {tab.title}
              </li>
            );
          }
          return tabItem;
        })}
      </ul>
    );
  }

  componentDidMount() {
    const hash = window.location.hash.substr(2);
    this.props.tabs.map(item => {
      if (hash === item.route) {
        this.setState({ activeId: item.id });
      }
    });
  }

  render() {
    return ReactDOM.createPortal(
      this.genTabsElement(),
      document.getElementById('app-third-sidebar')
    );
  }
}
