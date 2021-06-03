import { Pop } from '@zent/compat';
import React, { useCallback, useEffect, useState } from 'react';
import { Dialog } from '@youzan/ebiz-components';
import { Button, Grid, Icon } from 'zent';
import cent2yuan from 'fns/currency/cent2yuan';

import { getTransferCourseRecord } from './api';

import './index.scss';

const { openDialog, DialogBody, DialogFooter } = Dialog;

const columns = [
  {
    title: '订单号',
    width: 140,
    bodyRender: ({ orderNo }) => {
      return (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`${window._global.url.v4}/trade/order/detail?orderNo=${orderNo}`}
        >
          {orderNo}
        </a>
      );
    },
  },
  {
    title: (
      <div className="edu-refund-course-list-title">
        转出数量
        <Pop
          trigger="hover"
          content="转课时如果额外增购课时或有效期，转出数量会少于订单中的订购数量"
        >
          <Icon type="help-circle" />
        </Pop>
      </div>
    ),
    bodyRender: ({ transferOutCnt, sellType }) => {
      return `${sellType === 1 ? transferOutCnt / 100 : transferOutCnt}${sellType === 1 ? '课时' : '天'}`;
    }
  },
  {
    title: (
      <div className="edu-refund-course-list-title">
        转出金额
        <Pop
          trigger="hover"
          content="转出金额不等于转课订单金额"
        >
          <Icon type="help-circle" />
        </Pop>
      </div>
    ),
    bodyRender: ({ transferOutAmt }) => {
      return `￥ ${cent2yuan(transferOutAmt)}`;
    }
  }
];

const DialogContent = ({ dialogref, data }) => {
  const { assetNo, orderNo, targetKdtId } = data;
  const [loading, setLoading] = useState(false);
  const [dataList, setDataList] = useState([]);
  const getList = useCallback(() => {
    setLoading(true);
    getTransferCourseRecord({
      assetNo,
      orderNo,
      targetKdtId
    }).then((data = []) => {
      setDataList(data);
    }).finally(() => {
      setLoading(false);
    });
  }, [assetNo, orderNo]);
  useEffect(() => {
    getList();
  }, [assetNo, orderNo]);
  const onClose = useCallback(() => {
    dialogref.close();
  }, []);

  return (
    <>
      <DialogBody>
        <div className='adjust-record-content'>
          <Grid
            rowKey="orderNo"
            columns={columns}
            datasets={dataList}
            loading={loading}
          />
        </div>
      </DialogBody>
      <DialogFooter>
        <Button onClick={onClose}>取消</Button>
        <Button type="primary" onClick={onClose}>
          确定
        </Button>
      </DialogFooter>
    </>
  );
};

const RecordDialog = ({ assetNo, orderNo, targetKdtId }) => {
  openDialog(DialogContent, {
    data: {
      assetNo,
      orderNo,
      targetKdtId: targetKdtId || _global.kdtId
    },
    title: '查看转课记录',
    mask: true,
    className: 'adjust-record'
  });
};

export default RecordDialog;
