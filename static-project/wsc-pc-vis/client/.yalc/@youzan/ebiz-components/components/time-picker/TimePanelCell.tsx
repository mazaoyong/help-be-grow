import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { ITimePickerPanelCellProps } from './types';
import { formatOptions } from './utils';

export default class TimePickerPanelCell extends Component<
  ITimePickerPanelCellProps,
  {}
> {
  ref: HTMLUListElement | null = null;

  componentDidMount() {
    const $ul = findDOMNode(this.ref) as HTMLElement;
    const $active = $ul.getElementsByClassName('active')[0];
    if ($active) {
      $ul.scrollTop = ($active as any).offsetTop;
    }
    // $active && $ul.scrollTo({ top: ($active as any).offsetTop });
  }

  isDisabled = (val: number) => {
    const { disabledTime, disabledAllTime } = this.props;

    if (disabledAllTime(val)) {
      return true;
    }

    if (disabledTime) {
      if (Array.isArray(disabledTime)) {
        return disabledTime.includes(val);
      } else {
        return disabledTime(val);
      }
    }

    return false;
  };

  isHide = (val: number) => {
    const { hideTime, hideAllTime } = this.props;

    if (hideAllTime(val)) {
      return true;
    }

    if (hideTime) {
      if (Array.isArray(hideTime)) {
        return hideTime.includes(val);
      } else {
        return hideTime(val);
      }
    }

    return false;
  };

  render() {
    const { options, value, onChange } = this.props;

    return (
      <ul
        className="ebiz-time-picker__panel__cell"
        ref={ref => (this.ref = ref)}
      >
        {options.map(val => {
          const hide = this.isHide(val);

          if (hide) {
            return;
          }

          const disabled = this.isDisabled(val);

          let className = '';
          if (disabled) {
            className += 'disabled ';
          }

          if (value === val) {
            className += 'active';
          }

          return (
            <li
              className={className}
              key={val}
              onClick={() => {
                !disabled && onChange(val);
              }}
            >
              {formatOptions(val)}
            </li>
          );
        })}
      </ul>
    );
  }
}
