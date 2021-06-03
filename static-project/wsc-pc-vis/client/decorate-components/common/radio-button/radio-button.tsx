import { Pop } from '@zent/compat';
import * as React from 'react';
import cx from 'classnames';
import { Button } from 'zent';
import Icon from '../icon';
import Group from './group';

import './style/radio-button.scss';

const prefix = 'deco-radio-button';

interface IRadioButtonProps {
  icon?: string;
  tip?: React.ReactNode;
  active?: string;
  position?: string[];
  style?: React.CSSProperties;
  [x: string]: any;
}

class RadioButton extends React.Component<IRadioButtonProps> {
  static Group: typeof Group;

  render() {
    const { icon, tip, active, position = [], style, ...restProps } = this.props;
    const positionClass = position.map(item => `${prefix}--${item}`);
    const cls = cx(prefix, positionClass, {
      [`${prefix}--active`]: active,
    });
    let { children } = restProps;

    // 如果有 icon 属性，则子元素直接使用 Icon
    if (icon) {
      children = <Icon className="" type={icon} />;
    }

    if (tip) {
      return (
        <span className={cls} style={style}>
          <Pop
            className={`${prefix}__pop`}
            trigger="hover"
            position="bottom-center"
            content={tip}
            block
          >
            <Button type={active ? 'primary' : 'default'} outline {...restProps}>
              {children}
            </Button>
          </Pop>
        </span>
      );
    }

    return (
      <div className={cls} style={style}>
        <Button type={active ? 'primary' : 'default'} outline {...restProps}>
          {children}
        </Button>
      </div>
    );
  }
}

export default RadioButton;
