import React, { Component } from 'react';

export default class FakeField extends Component {
  render() {
    const { label, component } = this.props;
    return (
      <div className="fake-field-wrap">
        <label className="fake-field-label">{label}</label>
        <div className="fake-field-component">{component}</div>
      </div>
    );
  }
}
