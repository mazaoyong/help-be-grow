import React, { Component } from 'react';
import { Button } from 'zent';
// @ts-ignore
import { Button as SamButton } from '@youzan/sam-components';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { IActionFooterProps } from './types';

import './style.scss';

class ActionFooter extends Component<IActionFooterProps> {

  static propTypes = {
    mainText: PropTypes.string,
    mainSamName: PropTypes.string,
    subText: PropTypes.string,
    mainDisabled: PropTypes.bool,
    subDisabled: PropTypes.bool,
    onMainClick: PropTypes.func,
    onSubClick: PropTypes.func,
    className: PropTypes.string,
    mainOptions: PropTypes.object,
    subOptions: PropTypes.object,
  };

  static defaultProps = {
    mainText: '保存',
    subText: '取消',
    mainDisabled: false,
    subDisabled: false,
    onMainClick: () => {},
    onSubClick: () => {},
    className: '',
    mainOptions: {},
    subOptions: {},
  };

  componentDidMount() {
    // hack： 支持指定form class，这边尝试转换为id，然后支持submit btn写在任意位置
    try {
      const { mainOptions } = this.props;
      const selector = document.querySelector(`form.${mainOptions.form}`);
      if (mainOptions && mainOptions.form && selector) {
        selector.setAttribute('id', mainOptions.form);
      }
    } catch (e) { console.error(e); }
  }

  render() {
    const {
      mainText, mainSamName, subText, mainDisabled, subDisabled,
      onMainClick, onSubClick, className, mainOptions, subOptions,
    } = this.props;
    const MainButton = mainSamName ? SamButton : Button;
    return (
      <div className={cx('action-footer', className)}>
        {this.props.children ? this.props.children : (
          <>
          <MainButton
            type="primary"
            name={mainSamName}
            className="action-footer__main"
            disabled={mainDisabled}
            onClick={onMainClick}
            {...mainOptions}
          >
            {mainText}
          </MainButton>

          <Button
            className="action-footer__sub"
            disabled={subDisabled}
            onClick={onSubClick}
            {...subOptions}
          >
            {subText}
          </Button>
        </>
        )}
      </div>
    );
  }
}

export default ActionFooter;
