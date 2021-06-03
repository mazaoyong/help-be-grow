import { Pop } from '@zent/compat';
import React, { Component, PureComponent } from 'react';
import { Icon } from 'zent';
import { formatUnitMap } from '../charts/common';
import './style.scss';

class StatisItem extends (PureComponent || Component) {
  render() {
    const { title, value, className = '', type = 'number', tooltip, hideValue, format } = this.props;
    const clsPrefix = 'statis-item';
    const formattedValue = format ? format(value) : value;
    return (
      <div className={`${clsPrefix} ${className}`}>
        <h4 className={`${clsPrefix}__title`}>
          {title}
          {tooltip && (
            <Pop
              centerArrow
              content={
                <span
                  className={`${clsPrefix}__pop-info`}
                  dangerouslySetInnerHTML={{ __html: tooltip }}
                />
              }
              trigger="hover"
              position="top-left"
            >
              <Icon type="help-circle" className="help-icon" />
            </Pop>
          )}
        </h4>
        {hideValue || (
          <p className={`${clsPrefix}__data`}>
            {formatUnitMap[type](formattedValue)}
          </p>
        )}
      </div>
    );
  }
}

export default StatisItem;
