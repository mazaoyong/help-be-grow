
import { Form, Table } from '@zent/compat';
import React, { useMemo, useCallback } from 'react';
import { CouponSelector } from '@youzan/react-components';

import { getCouponList } from '../../api';

const { getControlGroup } = Form;

function CouponField({ value, onChange, disabled }) {
  const handleSelect = useCallback(() => {
    const amountMap = {};
    if (value && value.length > 0) {
      value.forEach(item => {
        amountMap[item.id] = item.amount;
      });
    }
    CouponSelector.open({
      selected: value,
      amountMap,
      fetchApi: getCouponList,
      btnLink: window._global.isSuperStore ? '/ump/coupon' : '/v2/ump/tradeincard',
      onChange,
      isSingleSelection: true,
      searchPlaceholder: '搜索优惠券名称'
    });
  }, [value, onChange]);

  const handleRemove = useCallback(({ id }) => () => {
    onChange(value.filter(item => item.id !== id));
  }, [onChange, value]);

  const columns = useMemo(() => [
    {
      title: '优惠券',
      name: 'title',
      width: '278px ',
      bodyRender: row => {
        return (
          <a href={row.fetchUrl} target="_blank" rel="noopener noreferrer">{row.title}</a>
        );
      },
    },
    {
      title: '优惠内容',
      name: 'preferentialDesc',
      width: '160px',
    },
    {
      title: '数量',
      name: 'amount',
      width: '160px',
    },
    {
      title: '操作',
      width: '80px',
      bodyRender: row => {
        if (disabled) {
          return '-';
        }
        return <a onClick={handleRemove(row)}>删除</a>;
      },
    },
  ], [disabled, handleRemove]);

  return (
    <>
      {disabled ? null : (
        <div className="pct-freebie-link">
          <a href="javascript:void(0)" onClick={handleSelect}>选择优惠券</a>
        </div>
      )}
      {
        (value && value.length > 0) ? (
          <Table
            className="pct-freebie-gift-table"
            columns={columns}
            datasets={value}
            rowKey="id"
          />
        ) : null
      }
    </>
  );
}

export default getControlGroup(CouponField);
