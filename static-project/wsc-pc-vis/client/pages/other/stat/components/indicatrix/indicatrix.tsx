import cn from 'classnames';
import React from 'react';
import { Checkbox, IRadioGroupProps, Radio } from 'zent';
import { IIndicatrixConfig, IIndicatrixType } from './types';

import './style.scss';

interface IProps<V, Type extends IIndicatrixType = IIndicatrixType> {
  className?: string;
  type: Type;
  value: Type extends 'radio' ? V : V[];
  onChange: Type extends 'radio'
    ? NonNullable<IRadioGroupProps<V>['onChange']>
    : (values: V[]) => void;
  config: Array<IIndicatrixConfig<V, Type>>;
  groupClassName?: string;

  // checkbox 专用props
  max?: number;
  allowEmpty?: boolean;
  tipLeft?: React.CSSProperties['marginLeft'];
  disallowAnimation?: boolean;
}

interface IState {
  animate: boolean;
}

const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const prefix = 'indicatrix';

export default class Indicatrix<V, Type extends IIndicatrixType> extends React.PureComponent<
IProps<V, Type>,
IState
> {
  static defaultProps = {
    disallowAnimation: true,
    allowEmpty: false,
    tipLeft: 70,
  };

  state: IState = {
    animate: false,
  };

  private get Group(): React.ComponentType<any> {
    const { type } = this.props;
    return type === 'checkbox' ? CheckboxGroup : RadioGroup;
  }

  private get Item(): React.ComponentType<any> {
    const { type } = this.props;
    return type === 'checkbox' ? Checkbox : Radio;
  }

  private get groupProps() {
    const { type } = this.props;
    return type === 'checkbox'
      ? {
        onChange: this.onCheckboxChange,
        value: this.props.value,
      }
      : {
        onChange: this.props.onChange,
        value: this.props.value,
      };
  }

  /**
   * 处理 checkbox 值变化
   */
  private onCheckboxChange = (val: V[]) => {
    const { max, disallowAnimation = true, allowEmpty = false } = this.props;

    if (max && val.length > max && disallowAnimation) {
      this.showAnimate();
      return;
    }

    if (!allowEmpty && val.length < 1) {
      return;
    }

    this.props.onChange(val as any);
  };

  /**
   * 指标过多时的动画
   */
  showAnimate() {
    this.setState({ animate: true }, () => {
      setTimeout(() => {
        this.setState({
          animate: false,
        });
      }, 400);
    });
  }

  private renderGroup = (
    config: IIndicatrixConfig<V, Type>,
    index: number,
  ) => {
    const { label, data } = config;
    const { Group, Item, groupProps } = this;
    const { groupClassName } = this.props;
    const groupPrefix = `${prefix}-group`;
    const groupCls = cn(`${groupPrefix}`, groupClassName);

    return (
      <div className={groupCls} key={`indicatrix-config-${index}`}>
        {label && (
          <div className={`${groupPrefix}__label`}>
            {label}
          </div>
        )}
        <Group className={`${groupPrefix}__content`} {...groupProps}>
          {data.map(item => {
            const { text, className, ...indicatrixItemProps } = item;
            return (
              <Item
                key={String(item.value)}
                {...indicatrixItemProps}
                className={cn(`${prefix}-item`, className)}
              >
                {text}
              </Item>
            );
          })}
        </Group>
      </div>
    );
  };

  private renderTips() {
    const { animate } = this.state;
    const { value = [], type, max, tipLeft } = this.props;

    // 单选或没有设置最大选择数量上限时，不渲染提示信息
    if (type === 'radio' || !max) {
      return;
    }

    const tipPrefix = `${prefix}-tip`;

    return (
      <div className={tipPrefix} style={{ marginLeft: tipLeft }}>
        <span
          className={cn(`${tipPrefix}__text`, {
            [`${tipPrefix}__text-animate`]: animate,
          })}
        >
          已选择 <span className={`${tipPrefix}__text-choosed`}>{(value as V[]).length}</span>/{max}{' '}
          个指标
        </span>
      </div>
    );
  }

  render() {
    const { config, className } = this.props;
    const cls = cn(prefix, className);

    return (
      <div className={cls}>
        {config.map((item, index) =>
          this.renderGroup(item, index),
        )}
        {this.renderTips()}
      </div>
    );
  }
}
