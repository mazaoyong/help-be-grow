import React from 'react';
import cn from 'classnames';
import { NumberInput } from 'zent';

export function getColumns() {
  return [
    {
      title: '优惠券',
      width: '100px',
      name: 'title',
    },
    {
      title: '优惠内容',
      width: '100px',
      name: 'preferentialDesc',
    },
    {
      title: '赠券数',
      width: '150px',
      bodyRender: ({ remainQty, id, amount }) => {
        return (
          <NumberInput
            width={'80px'}
            showStepper
            onChange={e => this.handleNumberChange(e, id)}
            value={amount}
            min={1}
            max={Math.min(10, remainQty)}
            disabled={this.props.disabled}
          />
        );
      },
    },
    {
      title: '操作',
      width: '100px',
      bodyRender: ({ id }) => {
        return (
          <span
            className={cn('coupon-item-delete', {
              disabled: this.props.disabled,
            })}
            onClick={() => this.handleCouponRemove(id)}
          >
            删除
          </span>
        );
      },
    },
  ];
};
