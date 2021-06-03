import React, { useEffect, useState, useMemo } from 'react';
import { Button, Notify, BlockLoading } from 'zent';
import { getUnitByType, formatTextWithZeroValue, getLocationSearch } from './utils';
import { format } from 'date-fns';
import useKdtQrcode from '@ability-center/common/use-kdt-qrcode';
import api from './api';
import { REFUNDTYPE, MARK_PAY_ALL_TYPES } from './constants';

export default function PrintPage({ params }) {
  const refundNo = params.refundNo || '';
  const [qrcode] = useKdtQrcode();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState('');

  // 获取数据
  useEffect(() => {
    if (refundNo !== '') {
      const queryValue = getLocationSearch();
      let params = { refundNo };
      if (queryValue.kdtId) {
        params.targetKdtId = queryValue.kdtId || window._global.kdtId;
      }
      api.getRefundRecordByQuery(params)
        .then(res => {
          setData(res);
          if (res.length > 0) {
            setStudentId(res[0].studentId);
          }
        })
        .catch(err => {
          Notify.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [refundNo]);

  // 打印
  const handlePrint = () => {
    if (qrcode === '') {
      Notify.error('二维码还未生成');
      return;
    }
    if (window.print) {
      window.print();
      return;
    }
    Notify.error('您的浏览器不支持页面打印');
  };
  return (
    <div className="print-page">
      <div className="print-page-content">
        <BlockLoading loading={loading}>
          <PrintContent data={data} qrcode={qrcode} />
        </BlockLoading>
      </div>
      <div className="app-design noprint">
        <div className="app-actions">
          <div className="form-actions new-actions text-center">
            <Button onClick={() => (location.href = `/v4/vis/edu/page/refund-record#/list`)}>
              查看退课记录
            </Button>
            <Button
              disabled={loading || !studentId}
              onClick={() => (location.href = `/v4/vis/edu/page/student#/detail/${studentId}`)}
            >
              查看学员
            </Button>
            <Button disabled={loading} onClick={handlePrint} type="primary">
              打印退课凭证
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrintContent({ data, qrcode }) {
  const {
    studentName = '',
    phoneNumber = '',
    createdAt = Date.now(),
    remark = '',
    operatorName = '',
    sellerName = '',
    name = '',
    refundCourseUnit = -1
  } = data[0] || {};
  const refundFeeTypeListWithoutMark = useMemo(() => {
    let list = [];
    data.map(item => {
      list = list.concat(item.refundFeeTypeList.filter(
        feeType => {
          return MARK_PAY_ALL_TYPES.indexOf(feeType.payWay) < 0;
        }
      ));
    });
    return list;
  }, [data]);
  const totalRefundValue = useMemo(() => {
    let totalValue = data.reduce((sum, item) => {
      return sum + item.refundCourseValue;
    }, 0);
    if (refundCourseUnit === REFUNDTYPE.BY_COURSE) {
      return totalValue / 100;
    }
    return totalValue;
  }, [data]);
  const totalRefundAmt = useMemo(() => {
    return data.reduce((sum, item) => {
      return sum + item.refundMoney;
    }, 0);
  }, [data]);
  return (
    <div className="refund-print">
      <div className="refund-print-container">
        <div className="print-title">{window._global.shopName}退课凭证</div>
        <div className="print-header">
          <span>
            课程名称：<em>{name}</em>
          </span>
          <span>
            学员：<em>{studentName}</em>
          </span>
          <span>
            手机：<em>{phoneNumber}</em>
          </span>
          <span>
            退课时间：<em>{format(createdAt, 'YYYY年MM月DD日 HH:mm:ss')}</em>
          </span>
        </div>
        <div className="print-content">
          <table>
            <colgroup>
              <col style={{ width: '270px' }} />
              <col style={{ width: '480px' }} />
              <col style={{ width: '150px' }} />
            </colgroup>
            <thead>
              <tr>
                <th>退课订单</th>
                <th>退课内容</th>
                <th>退课金额</th>
              </tr>
            </thead>
            <tbody>
              {data.map(item => {
                let value = 0;
                if (item.refundCourseValue != null) {
                  if (item.refundCourseUnit === REFUNDTYPE.BY_COURSE) {
                    value = item.refundCourseValue / 100;
                  } else {
                    value = item.refundCourseValue;
                  }
                }
                return (
                  <tr key={item.orderNo}>
                    <td>{item.orderNo}</td>
                    <td>
                      {formatTextWithZeroValue(
                        item.refundCourseValue,
                        '' + value + getUnitByType(item.refundCourseUnit),
                      )}
                    </td>
                    <td>
                      {formatTextWithZeroValue(
                        item.refundMoney,
                        '¥' + (item.refundMoney / 100).toFixed(2),
                      )}
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td colSpan={3}>
                  <div className='total-statistics'>
                    <div className='print-table-label'>合计：</div>
                    <div className='print-table-value'>
                      <span>{totalRefundValue ? formatTextWithZeroValue(totalRefundValue, `${totalRefundValue}${getUnitByType(refundCourseUnit)}`) : ''}</span>&nbsp;&nbsp;&nbsp;
                      <span>{totalRefundAmt ? formatTextWithZeroValue(totalRefundAmt, `¥${(totalRefundAmt / 100).toFixed(2)}`) : ''}</span>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan={3}>
                  <div className="print-table-label">退课方式：</div>
                  <div className="print-table-desc">
                    {refundFeeTypeListWithoutMark.map(feeType => {
                      return (
                        <div key={feeType.payWay}>
                          ¥{(feeType.refundFee / 100).toFixed(2)}退回到{feeType.payWayDesc}
                          (退款订单
                          <a target="_blank"
                            rel="noopener noreferrer"
                            href={'//www.youzan.com/v4/trade/order/detail?orderNo=' + feeType.orderNo}
                          >{feeType.orderNo}</a>)
                        </div>
                      );
                    })}
                    {refundFeeTypeListWithoutMark.length > 0 && <br />}
                    <span style={{ color: '#969799' }}>实际退款金额，请以跟商家协商的为准</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan={3}>
                  <div className="print-table-label">退课备注：</div>
                  <div className="print-table-desc">{remark}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="print-footer">
          <span>
            经办人：<em>{operatorName}</em>
          </span>
          <span style={{ paddingRight: '70px' }}>
            课程顾问：<em>{sellerName}</em>
          </span>
          <span style={{ paddingRight: '70px' }}>
            客户签名：<em></em>
          </span>
        </div>
        <div className="print-code">
          <div className="print-code-img">
            <img src={qrcode} />
          </div>
          <div className="print-code-info">扫码访问店铺，随时购买课程</div>
        </div>
      </div>
    </div>
  );
}
