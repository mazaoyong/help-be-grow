import * as React from 'react';
import cx from 'classnames';

import './style/group.scss';

const prefix = 'deco-radio-button-group';

interface IRadioButtonGroupProps {
  value: any;
  onChange: (...args) => void;
  block: boolean;
  round: boolean;
  perLine: number;
  children: any;
}

export default class RadioButtonGroup extends React.Component<IRadioButtonGroupProps> {
  static defaultProps = {
    block: false,
    round: false,
    perLine: Infinity,
  };

  handleClick(target) {
    const { onChange } = this.props;

    if (onChange) {
      onChange({ target });
    }
  }

  // 获取新的子组件
  getNewChildren() {
    const { value: groupValue, round, children } = this.props;
    const childrenArr = React.Children.toArray(children).filter(
      (child: any) => child && child.props && child.props.value !== undefined,
    );

    return childrenArr.map((child: any, index) => {
      const newChildProps: any = {
        active: groupValue === child.props.value,
        onClick: this.handleClick.bind(this, { ...child.props }),
      };
      // 如果不是圆形 button，则计算 button 的样式和位置
      if (!round) {
        newChildProps.style = {
          ...(child.props.style || {}),
          ...this.getRadioButtonStyle(index),
        };
        newChildProps.position = this.getRadioButtonPosition(index, childrenArr.length);
      }
      return React.cloneElement(child, newChildProps);
    });
  }

  // 获取 button 的样式。主要是调整偏移
  getRadioButtonStyle(index) {
    const { perLine } = this.props;
    const res: Record<string, string> = {};

    if (perLine === Infinity) {
      // 如果非首位 button，则向左偏移
      if (index > 0) {
        res.marginLeft = '-1px';
      }
      return res;
    }

    // 每一行的非首位 button，向左偏移
    if (index % perLine !== 0) {
      res.marginLeft = '-1px';
    }

    // 非首行的 button，向上偏移
    if (index >= perLine) {
      res.marginTop = '-1px';
    }

    res.flex = `0 0 ${100 / perLine}%`;

    return res;
  }

  // 获取 button 的位置。用于调整不同位置按钮的圆角
  getRadioButtonPosition(index, length) {
    const { perLine } = this.props;
    let res: string[] = [];

    if (perLine === Infinity) {
      if (index === 0) {
        res = res.concat(['top-left', 'bottom-left']);
      }

      if (index === length - 1) {
        res = res.concat(['top-right', 'bottom-right']);
      }

      return res;
    }

    // 首位，则左上圆角
    if (index === 0) {
      res.push('top-left');
    }

    // 第一行末位，则右上圆角
    if (index === perLine - 1) {
      res.push('top-right');
    }

    // 最后一行首位，左下圆角
    if (index === Math.floor((length - 1) / perLine) * perLine) {
      res.push('bottom-left');
    }

    // 最后一个，右下圆角
    if (index === length - 1) {
      res.push('bottom-right');
    }

    return res;
  }

  render() {
    const { block, round, perLine } = this.props;
    const cls = cx(prefix, `${prefix}--${round ? 'round' : 'rect'}`, {
      [`${prefix}--block`]: block || perLine !== Infinity,
    });

    return <div className={cls}>{this.getNewChildren()}</div>;
  }
}
