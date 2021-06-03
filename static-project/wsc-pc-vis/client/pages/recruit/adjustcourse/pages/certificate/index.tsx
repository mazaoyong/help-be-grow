import React, { useState, useEffect, useCallback } from 'react';
import { Button, Notify, BlockLoading } from 'zent';
import useKdtQrcode from '@ability-center/common/use-kdt-qrcode';

import { getTransferCourseCertificate } from '../../api';

import { Detail } from './type';
import Content from './Content';

import './index.scss';

const prefixcls = 'adjustcourse-certificate';

interface IProps {
  params: {
    orderNo: string;
    targetKdtId?: string;
  }
}

const defaultDetail: Detail = {
  orderNo: '',
  studentTransferDTO: {
    studentId: 0,
    studentName: '',
    mobile: ''
  },
  transferTime: '',
  otherInfo: {
    cashierName: '',
    courseConsultantName: '',
    teacherName: '',
    customerSignature: '',
    remark: ''
  },
  transferOut: {
    courseName: '',
    eduCourseName: '',
    courseSellType: 1,
    transferOutTotalAmt: 0,
    orders: []
  },
  transferIn: {
    buy: 0,
    className: '',
    eduCourseName: '',
    reward: 0,
    transferInAmt: 0,
    transferInTotalAmt: 0,
    validTime: '',
    unitPrice: 0
  }
};

const Certificate: React.FC<IProps> = ({ params }) => {
  const { orderNo, targetKdtId = _global.kdtId } = params;
  const [loading, setLoading] = useState(true);
  const [qrcode] = useKdtQrcode({
    deleteWhite: true
  });
  const [detail, setDetail] = useState(defaultDetail);
  useEffect(() => {
    setTimeout(() => {
      getTransferCourseCertificate({
        orderNo,
        targetKdtId
      }).then((res: Detail) => {
        setDetail(res);
        setLoading(false);
      }).catch(msg => {
        Notify.error(msg || '凭证获取失败');
      });
    }, 1000);
  }, [orderNo]);
  // 打印
  const handlePrint = useCallback(() => {
    if (qrcode === '') {
      Notify.error('二维码还未生成');
      return;
    }
    if (window.print) {
      window.print();
      return;
    }
    Notify.error('您的浏览器不支持页面打印');
  }, [qrcode]);
  return (
    <div className={prefixcls}>
      <div className={`${prefixcls}-content`}>
        <BlockLoading loading={loading}>
          <Content detail={detail} prefixcls={prefixcls} qrcode={qrcode} />
        </BlockLoading>
      </div>
      <div className={`${prefixcls}-footer noprint app-design`}>
        <div className={`${prefixcls}-footer-action app-actions`}>
          <div className="form-actions new-actions text-center">
            <Button onClick={() => (location.href = `/v4/trade/order/detail?orderNo=${orderNo}`)}>
              查看转课订单
            </Button>
            <Button
              disabled={loading || !detail.studentTransferDTO.studentId}
              onClick={() => (location.href = `/v4/vis/edu/page/student#/detail/${detail.studentTransferDTO.studentId}`)}
            >
              查看学员
            </Button>
            <Button disabled={loading} onClick={handlePrint} type="primary">
              打印转课凭证
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
