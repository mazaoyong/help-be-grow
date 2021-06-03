import React, { Component } from 'react';
import { Button } from 'zent';

export default class Actions extends Component {
  render() {
    return (
      <>
        <Button type="primary" onClick={this.props.submit}>
          筛选
        </Button>
        <span className="filter__actions__reset" onClick={this.props.resetQueries}>
          重置筛选条件
        </span>
      </>
    );
  }
}
