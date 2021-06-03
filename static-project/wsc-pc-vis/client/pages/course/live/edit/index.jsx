import React, { Component } from 'react';
import { visitTracker } from 'components/logger';
import LiveForm from './components/form';
import './style.scss';

export default class Live extends Component {
  componentDidMount() {
    visitTracker({ pageType: 'liveEdit' });
  }

  render() {
    return (
      <div className="content-form">
        <LiveForm {...this.props} />
      </div>
    );
  }
}
