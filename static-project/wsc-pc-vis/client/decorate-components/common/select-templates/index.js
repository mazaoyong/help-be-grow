import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import './style/index.scss';

class SelectTemplates extends (PureComponent || Component) {
  static propTypes = {
    tempTypeMap: PropTypes.array.isRequired,
    selectTempIndex: PropTypes.number.isRequired,
    handleSelectTemp: PropTypes.func.isRequired,
    className: PropTypes.string,
  };

  static defaultProps = {
    className: '',
  };

  render() {
    const { tempTypeMap, selectTempIndex, className, handleSelectTemp } = this.props;

    return (
      <div>
        {tempTypeMap.map((item, index) => {
          return (
            <div
              className={cx('rc-design-select-templates', className, {
                active: selectTempIndex === index,
              })}
              onClick={() => handleSelectTemp(item, index)}
              key={index}
            >
              <div className="rc-design-select-templates__image-block">
                <img
                  src={`${window._global.url.imgqn}${item.image}`}
                  width="90px"
                  height="64px"
                  alt="temp"
                />
              </div>
              <div className="rc-design-select-templates__title">{item.title}</div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default SelectTemplates;
