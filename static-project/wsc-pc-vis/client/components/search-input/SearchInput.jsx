// @flow
import React, { Component } from 'react';
import { Icon, Input } from 'zent';
import cx from 'classnames';
import omit from 'lodash/omit';

export default class SearchInput extends Component {
  render() {
    const props = this.props;
    const inputProps = omit(props, 'className');
    const className = props.className || '';

    return (
      <div className={cx('search-input', className)}>
        <Input {...inputProps} />
        <Icon type="search" />
      </div>
    );
  }
}
