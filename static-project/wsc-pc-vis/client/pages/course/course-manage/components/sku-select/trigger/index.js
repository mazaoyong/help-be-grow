import PropTypes from 'prop-types';
import React, { Component } from 'react';

class Trigger extends Component {
  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);
  }

  render() {
    const Node = this.props.trigger;

    return <Node {...this.props} onKeyDown={this.props.onKeyDown} />;
  }
}

Trigger.propTypes = {
  trigger: PropTypes.any,
};

export default Trigger;
