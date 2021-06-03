import React, { Component } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

import './style.scss';

class ChangeTrend extends Component {
  render() {
    let { growth, className = '' } = this.props;

    let type = 'none';

    if (growth > 0) {
      type = 'ascend';
    } else if (growth < 0) {
      type = 'decline';
    }

    const cls = cx({
      'change-trend': true,
      'change-trend--ascend': type === 'ascend',
      'change-trend--decline': type === 'decline',
      'change-trend--none': type === 'none',
    });

    return <span className={`${cls} ${className}`} />;
  }
}

ChangeTrend.propTypes = {
  growth: PropTypes.number,
  className: PropTypes.string,
};

ChangeTrend.defaultProps = {
  className: '',
  growth: 0,
};

export default ChangeTrend;
