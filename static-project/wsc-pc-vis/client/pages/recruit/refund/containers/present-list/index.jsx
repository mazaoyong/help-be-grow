import React, { useState, useEffect, useMemo } from 'react';
import { Table } from '@zent/compat';
import Big from 'big.js';
import get from 'lodash/get';
import { isSingleStore, isRetailShop } from '@youzan/utils-shop';
import { findBuyGivePresentPageByCondition } from '../../api';
import { parseParams } from '../../util';

import './styles.scss';

const urlParams = parseParams();

const supportPresent = isSingleStore && !isRetailShop;

export default function PresentList(props) {
  const { refundItemAlias } = props;
  const [datasets, setDatasets] = useState([]);
  const [current, setCurrent] = useState(1);
  const [totalItem, setTotalItem] = useState(0);

  const columns = useMemo(() => {
    return [
      {
        title: '赠品',
        bodyRender({
          presentType,
          presentData: { url, couponUrl, title, couponTitle, score, skuDesc, appointmentLessonNum },
        }) {
          let _title = '';
          let _appendix = '';
          switch (presentType) {
            case 1:
            case 2:
              _title = (
                <a className="edu-refund-present-title" href={url} target="_blank" rel="noopener noreferrer">
                  {title || '-'}
                </a>
              );
              _appendix = (
                <div className="edu-refund-present-appendix">
                  {skuDesc}
                  {appointmentLessonNum ? '(' + appointmentLessonNum + ')' : ''}
                </div>
              );
              break;
            case 3:
              _title = (
                <a href={couponUrl} target="_blank" rel="noopener noreferrer">
                  {couponTitle || '-'}
                </a>
              );
              break;
            case 4:
              _title = score ? score + '积分' : '-';
              break;
            default:
              break;
          }
          return (
            <>
              {_title}
              {_appendix}
            </>
          );
        },
      },
      {
        title: '价格(元)',
        textAlign: 'right',
        bodyRender({ presentData: { price } }) {
          return price
            ? Big(Number(price || 0)).div(100).toFixed(2)
            : '-';
        },
      },
      {
        title: '数量',
        bodyRender({ presentData: { num, couponNum } }) {
          return num || couponNum || '-';
        },
      },
    ];
  }, []);

  useEffect(() => {
    const orderNo = urlParams.orderNo;
    if (orderNo) {
      findBuyGivePresentPageByCondition({
        query: {
          orderNo,
        },
        pageRequest: {
          pageNumber: current,
          pageSize: 5,
        },
      }).then(({ content, total }) => {
        setDatasets(content);
        setTotalItem(total);
      });
    }
  }, [current]);

  if (totalItem === 0 ||
    !supportPresent ||
    datasets.findIndex(present => get(present, 'presentData.alias') === refundItemAlias) !== -1) { // 所退课程为赠品
    return null;
  }

  return (
    <>
      <div className="edu-refund-present">
        <span>退款提示</span>
        <span>
          该笔订单有{totalItem}个赠品，若退回所有可用课时或全额退款则未使用的赠品将会收回（积分直接扣除，知识付费商品收回阅读权限），
          已使用的赠品无法收回；若部分退款则赠品不做收回，您可以根据以下赠品内容进行折价。
        </span>
      </div>
      <Table
        columns={columns}
        datasets={datasets}
        pageInfo={{
          pageSize: 5,
          current,
          totalItem,
        }}
        onChange={({ current }) => {
          setCurrent(current);
        }}
      />
    </>
  );
}
