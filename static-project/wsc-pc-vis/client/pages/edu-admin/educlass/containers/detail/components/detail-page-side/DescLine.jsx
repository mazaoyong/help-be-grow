import React, { Component } from 'react';

export default class DescLine extends Component {
  render() {
    const { label, value } = this.props;

    return (
      <div className="desc-line">
        <div className="desc-line__label">{label || '-'}</div>
        <div className="desc-line__value">{value === 0 ? 0 : value || '-'}</div>
      </div>
    );
  }
}
