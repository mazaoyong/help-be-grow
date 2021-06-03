import cx from 'classnames';
import { Location } from 'history';
import React, { Component } from 'react';
import { Icon, Input, IInputProps } from 'zent';
import { IVisSearchProps } from '../ultis/type';
import omit from 'lodash/omit';
import get from 'lodash/get';

export default class extends Component<IVisSearchProps, any> {
  static displayName = 'VisSearch';
  state = {
    value: undefined,
  };

  handleChange: IInputProps['onChange'] = (e): void => {
    const { value } = e.target;
    const { onChange, name, addonQuery } = this.props;
    this.setState({ value });
    if (onChange) {
      onChange({ [name]: value, ...addonQuery } as any, e as any);
    }
  };

  handleSubmit = (): void => {
    const { value = '' } = this.state;
    const { push, location, name, onSubmit, addonQuery } = this.props;
    if (onSubmit) {
      onSubmit({ [name]: value, ...addonQuery });
    }
    if (push) {
      const { query } = location as Location;
      push({
        ...query,
        ...addonQuery,
        [name]: value,
        pageNumber: 1,
      });
    }
  };

  render() {
    const {
      className = '',
      position = 'left',
      name,
      location,
      ...resProps
    } = this.props;
    const { value } = this.state;
    let defaultValue: any = '';
    if (location) {
      const { query } = location;
      const val = get(query, name);
      // @ts-ignore
      defaultValue = val;
    }
    return (
      <div className={cx('search-input', className, `flex-${position}`)}>
        <span onClick={this.handleSubmit}>
          <Icon type="search" className="vis-search__icon" />
        </span>
        <Input
          {...omit(resProps, ['onSubmit', 'push']) as any}
          value={value !== undefined ? value : defaultValue}
          onPressEnter={this.handleSubmit}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}
