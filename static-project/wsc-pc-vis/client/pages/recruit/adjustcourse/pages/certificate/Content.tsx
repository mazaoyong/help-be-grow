import React from 'react';
import { Detail } from './type';
import cent2yuan from 'fns/currency/cent2yuan';
import { desensitivePhone } from 'fns/text/caculate';
import { div100 } from '../../util';

interface IProps {
  detail: Detail;
  prefixcls: string;
  qrcode: string;
}

const CertificateContent: React.FC<IProps> = ({ detail, prefixcls, qrcode }) => {
  const { orderNo, studentTransferDTO, transferTime, otherInfo, transferOut, transferIn } = detail;
  const unitLabel = transferOut.courseSellType === 1 ? '课时' : '天';
  return (
    <div className={`${prefixcls}-print`}>
      <div className={`${prefixcls}-print-container`}>
        <div className="print-title">{window._global.shopName}转课凭证</div>
        <div className="print-header">
          <span>
            订单编号：<em>{orderNo}</em>
          </span>
          <span>
            学员：<em>{studentTransferDTO.studentName}</em>
          </span>
          <span>
            手机：<em>{desensitivePhone(studentTransferDTO.mobile)}</em>
          </span>
          <span>
            转课时间：<em>{transferTime}</em>
          </span>
        </div>
        <div className="print-content">
          <table>
            <colgroup>
              <col />
            </colgroup>
            <thead>
              <tr>
                <th>转出课程</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={3}>
                  <div className="print-table-label">线下课：</div>
                  <div className="print-table-desc margin-right">{transferOut.courseName}</div>
                  <div className="print-table-label">课程：</div>
                  <div className="print-table-desc">{transferOut.eduCourseName}</div>
                </td>
              </tr>
            </tbody>
          </table>
          <table className='no-border-top'>
            <colgroup>
              <col />
              <col />
              <col />
              <col />
              <col />
            </colgroup>
            <thead>
              <tr>
                <th>原订单号</th>
                <th>单{unitLabel}价格</th>
                <th>转出购买{unitLabel === '天' ? unitLabel + '数' : unitLabel}</th>
                <th>转出赠送{unitLabel === '天' ? unitLabel + '数' : unitLabel}</th>
                <th>转出金额</th>
              </tr>
            </thead>
            <tbody>
              {transferOut.orders.map(item => {
                return (
                  <tr key={item.orderNo}>
                    <td>{item.orderNo}</td>
                    <td>￥ {cent2yuan(item.unitPrice)}</td>
                    <td>{transferOut.courseSellType === 1 ? div100(item.transferOutBuyAssert)
                      : item.transferOutBuyAssert}{unitLabel}</td>
                    <td>{item.transferOutReward ? (transferOut.courseSellType === 1 ? div100(item.transferOutReward) : item.transferOutReward) + unitLabel : '-'}</td>
                    <td>￥ {cent2yuan(item.transferOutAmt)}</td>
                  </tr>
                );
              })}
              <tr>
                <td colSpan={5} align='right'>
                  <div className="print-table-label">转出合计：</div>
                  <div className="print-table-desc">￥ {cent2yuan(transferOut.transferOutTotalAmt)}</div>
                </td>
              </tr>
            </tbody>
          </table>
          <table className='margin-top'>
            <colgroup>
              <col />
            </colgroup>
            <thead>
              <tr>
                <th>转入课程</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={3}>
                  <div className="print-table-label">课程：</div>
                  <div className="print-table-desc margin-right">{transferIn.eduCourseName}</div>
                  <div className="print-table-label">有效期：</div>
                  <div className="print-table-desc margin-right">{transferIn.validTime}</div>
                  <div className="print-table-label">分入班级：</div>
                  <div className="print-table-desc">{transferIn.className}</div>
                </td>
              </tr>
            </tbody>
          </table>
          <table className='no-border-top'>
            <colgroup>
              <col />
              <col />
              <col />
              <col />
            </colgroup>
            <thead>
              <tr>
                <th>转入购买{unitLabel === '天' ? unitLabel + '数' : unitLabel}</th>
                <th>转入赠送{unitLabel === '天' ? unitLabel + '数' : unitLabel}</th>
                <th>单{unitLabel}价格</th>
                <th>转入金额</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{(transferOut.courseSellType === 1 ? div100(transferIn.buy) : transferIn.buy) + unitLabel}</td>
                <td>{(transferOut.courseSellType === 1 ? div100(transferIn.reward)
                  : transferIn.reward) + unitLabel}</td>
                <td>￥ {cent2yuan(transferIn.unitPrice)}</td>
                <td>￥ {cent2yuan(transferIn.transferInAmt)}</td>
              </tr>
              <tr>
                <td colSpan={5} align='right'>
                  <div className="print-table-label">转入合计：</div>
                  <div className="print-table-desc">￥ {cent2yuan(transferIn.transferInAmt)}</div>
                </td>
              </tr>
            </tbody>
          </table>
          <table className='margin-top'>
            <tbody>
              <tr>
                <td align='right'>
                  <div className="print-table-label more-weight">应收金额：</div>
                  <div className="print-table-desc more-weight">￥ {cent2yuan(transferIn.transferInTotalAmt)}</div>
                </td>
              </tr>
            </tbody>
          </table>
          <table className='margin-top'>
            <tbody>
              <tr>
                <td>
                  <div className="print-table-label">转课备注：</div>
                  <div className="print-table-desc">{otherInfo.remark}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="print-footer">
          <span>
            收银员：<em>{otherInfo.cashierName}</em>
          </span>
          <span style={{ paddingRight: '70px' }}>
            课程顾问：<em>{otherInfo.courseConsultantName}</em>
          </span>
          <span style={{ paddingRight: '70px' }}>
            老师：<em>{otherInfo.teacherName}</em>
          </span>
          <span style={{ paddingRight: '70px' }}>
            客户签名：<em>{otherInfo.customerSignature}</em>
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
};

export default CertificateContent;
