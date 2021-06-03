import React from 'react';
import PropTypes from 'prop-types';
import ConfigPreview from 'components/design/config/ConfigPreview';

export default class PunchConfigPreview extends ConfigPreview {
  static propTypes = {
    value: PropTypes.object,
    // 用来和 Design 交互
    design: PropTypes.object,
  };

  render() {
    return (
      <div>
        <div className="punch-details-block">
          <h4>{this.props.value.value}</h4>
        </div>
      </div>
    );
  }
}
