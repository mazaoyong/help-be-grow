import { Pop } from '@zent/compat';
import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import { Icon } from 'zent';
import { connect } from 'react-redux';

import './index.scss';

const globalHelpUrl = window._global.url.help || '';

class Sidebar extends Component {
  constructor(props) {
    super(props);

    // const isDecorate = /edit|create/.test(props.route.path);
    this.state = {
      isDecorate: true,
    };
  }

  clickDecorate() {
    if (!this.state.isDecorate) {
      hashHistory.push('/');
    }
  }

  render() {
    const { isDecorate } = this.state;

    const content = (
      <a className="help-center" href={globalHelpUrl} target="_blank" rel="noopener noreferrer">
        查看帮助中心
      </a>
    );

    return (
      <div className="side-bar">
        <div
          className={
            isDecorate ? 'side-bar-decorate-active side-bar-decorate' : 'side-bar-decorate'
          }
        >
          <div className="side-bar-decorate-text" onClick={this.clickDecorate.bind(this)}>
            <i className="side-bar-decorate-icon" />
            <div>装修</div>
          </div>
        </div>
        <div className={!isDecorate ? 'side-bar-help-template side-bar-help' : 'side-bar-help'}>
          <Pop trigger="hover" position="right-center" content={content} centerArrow>
            <Icon className="side-bar-help-icon" type="help-circle" />
          </Pop>
        </div>
      </div>
    );
  }
}

export default connect(state => {
  const { editorsState } = state;
  return {
    hasModified: editorsState.hasModified,
  };
})(Sidebar);
