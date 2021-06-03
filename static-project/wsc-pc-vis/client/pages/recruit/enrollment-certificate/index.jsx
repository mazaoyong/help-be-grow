import React, { Component } from 'react';
import { Button, Notify } from 'zent';
import { format } from 'date-fns';
import qs from 'qs';
import { get } from 'lodash';
import accDiv from '@youzan/utils/number/accDiv';
import { getQrcode, getReceiptV2 } from './api';

import './index.scss';

const compactStyle = {
  lineHeight: '20px',
  fontSize: '12px',
};

const looseStyle = {
  lineHeight: '55px',
  paddingBottom: '20px',
};

const enmuTimeUnit = ['天', '周', '个月', '年'];

const queryObj = qs.parse(window.location.search.slice(1));

// 获取校区名字
function getCampusName() {
  const { shopInfo, hqShopInfo } = _global;
  if (hqShopInfo) {
    return get(hqShopInfo, 'shopName');
  }
  return get(shopInfo, 'shopName');
}

// 设置打印分页
function setPageBreak() {
  const printTable = document.querySelector('#printTable');
  const fragement = document.createDocumentFragment();
  const lines = document.querySelectorAll('#printTable>tbody>tr');
  const footLines = document.querySelectorAll('#printTable>tfoot>tr');
  const printArea = document.getElementById('printArea');
  printArea.innerHTML = '';
  if (printTable.offsetHeight > 605) {
    // 需要进行分页
    const linesHeight = [];
    let page = 1;
    let maxHeight = 564;
    let footLinesHeight = 0;
    // 得到所有tbody行的高度
    lines.forEach(line => linesHeight.push(line.clientHeight));
    // 得到所有tfoot行的总高度
    footLines.forEach(line => (footLinesHeight += line.clientHeight));
    const breakPagesPoint = [];
    linesHeight.reduce((sumOfHeight, currentHeight, index) => {
      const nextSumOfHeight = sumOfHeight + currentHeight;
      // 如果加上当前的高度要大于一页展示表格的最大高度，说明这一页分页开始
      if (nextSumOfHeight >= maxHeight) {
        breakPagesPoint.push(index);
        page += 1;
        if (page > 1) {
          // 加上第一页顶部用户信息的高度
          maxHeight += 157;
        }
        return footLinesHeight;
      }
      return nextSumOfHeight;
    }, footLinesHeight);

    // 创建x个table节点
    const breakPageTables = [];
    const sumOfBreakPoint = breakPagesPoint.length;
    for (let i = 0; i < sumOfBreakPoint + 1; i++) {
      let classes = ' no-border-top';
      const tableEle = document.createElement('table');
      tableEle.innerHTML = `<colgroup>
        <col style="width: 150px" />
        <col style="width: 150px" />
        <col style="width: 195px" />
        <col></col>
        <col style="width: 150px" />
      </colgroup>`;
      if (i > 0) {
        classes += ' margin-preset';
      }
      tableEle.classList = classes;
      breakPageTables.push(tableEle);
    }

    let isFirst = true;
    let currentDivision = 0;
    let breakIndex = breakPagesPoint.shift();
    // 渲染表身内容
    lines.forEach((ele, index) => {
      if (isFirst) {
        ele.classList += 'no-border-top';
        isFirst = false;
      }
      // 将每一行内容相应的推入分页
      breakPageTables[currentDivision].appendChild(ele);
      if (index === breakIndex - 1) {
        isFirst = true;
        currentDivision += 1;
        breakIndex = breakPagesPoint.shift();
      }
    });
    // 渲染表格tfoot的内容
    footLines.forEach(ele => {
      if (isFirst) {
        ele.classList += 'no-border-top';
        isFirst = false;
      }
      breakPageTables[currentDivision].appendChild(ele);
    });

    const sumOfTables = breakPageTables.length;
    breakPageTables.forEach((ele, index) => {
      const division = document.createElement('div');
      if (index < sumOfTables - 1) {
        division.classList = 'break-page';
      }
      division.appendChild(ele);
      fragement.appendChild(division);
    });
    printArea.appendChild(fragement);
  } else {
    const tableEle = document.createElement('table');
    tableEle.innerHTML = `<colgroup>
      <col style="width: 150px" />
      <col style="width: 150px" />
      <col style="width: 195px" />
      <col></col>
      <col style="width: 150px" />
    </colgroup>`;
    tableEle.classList = 'no-border-top';
    lines.forEach(ele => fragement.appendChild(ele));
    footLines.forEach(ele => fragement.appendChild(ele));
    tableEle.appendChild(fragement);
    printArea.appendChild(tableEle);
  }
}

class PrintCertificate extends Component {
  state = {
    orderNo: get(queryObj, 'orderNo'),
    signUpBtnVisiable: get(queryObj, 'from') === 'signUp',
    orderInfo: undefined,
    qrcode: '',
    campusName: getCampusName(),
    fillHeight: '0px',
  };

  componentDidMount() {
    const breadcurmb = document.querySelector('.zent-breadcrumb');
    if (breadcurmb) {
      breadcurmb.innerHTML = '<span>打印凭证</span>';
    }

    const kdtId = get(window, '_global.kdtId');
    const fromSignUp = this.state.signUpBtnVisiable;
    if (fromSignUp) {
      Notify.success('报名完成');
    }

    // 生成二维码
    getQrcode({
      url: `https://h5.youzan.com/wscvis/knowledge/index?p=mypay&kdt_id=${kdtId}&from=invoice`,
      errorCorrectionLevel: 2,
    }).then(data => this.setState({ qrcode: data })).catch(err => Notify.error(err));

    const { orderNo } = this.state;
    if (orderNo) {
      this.tryGetReceipt(orderNo).then(data => {
        this.setState({ orderInfo: data }, setPageBreak);
      });
    }

    // 填充空白背景为白色，这么做的原因是，页面主体是需要被打印的，高度应该让它自适应，我们不能控制页面主体的高度
    // 未来有机会重构的话，可以不要直接打印页面元素，转而把待打印内容放到 iframe 里，代码可维护性会好的多
    this.computeFillHeight();
    window.addEventListener('resize', this.computeFillHeight);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.computeFillHeight);
  }

  computeFillHeight = () => {
    const { top, height } = this.dom.getBoundingClientRect();
    const restHeight = document.documentElement.clientHeight - top - height - 100;
    this.setState({
      fillHeight: restHeight > 0 ? `${restHeight}px` : '0px',
    });
  };

  tryGetReceipt = orderNo =>
    new Promise((resolve, reject) => {
      const startTime = Date.now();

      const timer = setInterval(() => {
        const currentTime = Date.now();

        if (currentTime - startTime > 60 * 1000) {
          clearInterval(timer);
          return reject('没有找到相关订单');
        }

        getReceiptV2(orderNo)
          .then(data => {
            clearInterval(timer);
            resolve(data);
          })
          .catch(_err => {
            // do nothing
          });
      }, 2000);
    });

  handlePrintInvoice = () => {
    if (this.state.qrcode === '') {
      Notify.error('二维码还未生成');
      return void 0;
    }
    if (window.print) {
      window.print();
      return void 0;
    }
    Notify.error('您的浏览器不支持页面打印');
  };

  openOrderDetail = () => {
    const { orderNo } = this.state;
    if (orderNo) {
      window.open(`/v4/trade/order/detail?orderNo=${orderNo}`);
    }
  };

  openStudentDetail = () => {
    const studentId = get(this.state.orderInfo, 'studentDTO.id');
    if (studentId) {
      window.open(`/v4/vis/edu/page/student#/detail/${studentId}`);
    } else {
      Notify.error('请确认凭证中学员是否存在');
    }
  };

  handleSignUp = () => (window.location = '/v4/vis/edu/page/enrollment');

  notReadyToPrint = () => {
    const { orderNo, orderInfo } = this.state;

    return orderNo === undefined || orderInfo === undefined;
  };

  renderTbody = () => {
    const products = (this.state.orderInfo && this.state.orderInfo.items) || [];

    if (products && products.length === 0) {
      return (
        <tr>
          <td colSpan="5">正在获取订单数据...</td>
        </tr>
      );
    }

    const getTime = time => {
      if (time) {
        return format(time, 'YYYY-MM-DD');
      }
      return '-';
    };

    const showEffectivePeriod = product => {
      if (!Object.keys(product).length) {
        return <td>-</td>;
      }
      const { giveawayDaysPeriod } = product;
      const courseType = get(product, 'courseSimpleDTO.courseType');
      const { courseEffectiveType, validityPeriodType, courseEffectiveDelayDays, courseSellType } =
        get(product, 'courseSimpleDTO.formalCourseInfo') || {};
      const { startTime, endTime, timeUnit, timeQuantity } = get(product, 'studentAssetInfo') || {};
      // 赠送的时间
      const CHAR = startTime ? '含' : '另';
      const giveaway = giveawayDaysPeriod > 0 ? `(${CHAR}赠送${giveawayDaysPeriod}天)` : null;
      const UNIT = enmuTimeUnit[timeUnit - 1];
      // 如果取不到有效期通过后端返回天数和单位进行拼装
      let courseTime =
        startTime && endTime
          ? `${getTime(startTime)} 至 ${getTime(endTime)}`
          : `${timeQuantity}${UNIT}`;
      let desc = null;
      // 体验课或者自定义正式课
      if (courseType === 0 || courseSellType === 0) {
        return <td>-</td>;
      }
      if (courseSellType === 1 || courseSellType === 2) {
        if (validityPeriodType === 1) {
          // 永久有效
          desc = '永久有效';
          courseTime = null;
        } else if (validityPeriodType === 2) {
          // 拼接生效方式描述
          // 不是按期售卖
          switch (courseEffectiveType) {
            case 0:
              throw new Error('无效的生效类型');
            case 1:
              desc = '首次签到后生效';
              break;
            case 2:
              if (courseEffectiveDelayDays === 0) {
                break;
              }
              desc = `付款完成${courseEffectiveDelayDays}天后生效`;
              break;
            case 3:
              desc = '付款后立即生效';
              break;
            default:
              desc = null;
              break;
          }
        }
      }
      if (courseTime && desc !== null) {
        desc = [<br key="br" />, desc];
      }
      // 是否展示生效文案
      const descVisiable = !(startTime && endTime) || validityPeriodType === 1;
      return (
        <td>
          {courseTime}
          {/* 当有有效期的时候，赠送时长位置 */}
          {descVisiable ? null : <br />}
          {courseTime && giveaway}
          {/* 有有效期不显示生效文案 */}
          {descVisiable ? desc : null}
        </td>
      );
    };

    return products.map(product => {
      const { assetNo, title, skuDesc, giveawayHour, studentAssetInfo } = product;
      const sellByCourseTime =
        get(product, 'courseSimpleDTO.formalCourseInfo.courseSellType') === 1;
      const classHour = accDiv(get(studentAssetInfo, 'assetValue'), 100).toFixed(2);
      return (
        <tr key={assetNo}>
          <td>{title || '-'}</td>
          <td>{skuDesc || '-'}</td>
          <td>
            {sellByCourseTime ? (
              <span>
                {classHour ? `共${classHour}课时` : '-'}
                {!Number.isNaN(giveawayHour) && Number(giveawayHour) > 0 && (
                  <>
                    <br />
                    （含赠送{Number((giveawayHour / 100).toFixed(2))}课时）
                  </>
                )}
              </span>
            ) : (
              '-'
            )}
          </td>
          {showEffectivePeriod(product)}
          <td>¥{Number(get(product, 'realPay') / 100).toFixed(2)}</td>
        </tr>
      );
    });
  };

  render() {
    const { orderNo, signUpBtnVisiable, qrcode, orderInfo, campusName, fillHeight } = this.state;
    const paidTime = get(orderInfo, 'payTime');
    const shopName = get(orderInfo, 'shopName') || campusName;
    return (
      <div className="enrollment-certi">
        {/* 打印部分 */}
        <section
          className="print-part"
          ref={dom => {
            this.dom = dom;
          }}
        >
          <span className="title">{shopName}缴费凭证</span>
          <div className="right">
            <div className="qrcode">
              <img src={qrcode} alt="二维码" width="80" height="80" />
              <span className="desc">扫码随时查询上课表、上课记录</span>
            </div>
          </div>
          <p className="invoice-title">
            <span>
              订单编号：<span className="hightlight">{orderNo}</span>
            </span>
            <span>
              学员：
              <span className="hightlight">{get(orderInfo, 'studentDTO.studentName', '-')}</span>
            </span>
            <span>
              手机：<span className="hightlight">{get(orderInfo, 'studentDTO.mobile', '-')}</span>
            </span>
            <span>
              报名时间：
              <span className="hightlight">
                {paidTime ? format(paidTime, 'YYYY年MM月DD日') : '-'}
              </span>
            </span>
          </p>
          {/* 隐藏真正的table */}
          <table id="printTable">
            <colgroup>
              <col style={{ width: '150px' }} />
              <col style={{ width: '150px' }} />
              <col style={{ width: '195px' }} />
              <col />
              <col style={{ width: '150px' }} />
            </colgroup>
            <thead>
              <tr>
                <th>服务内容</th>
                <th>课程规格</th>
                <th>课时</th>
                <th>有效期</th>
                <th>价格</th>
              </tr>
            </thead>
            <tbody style={{ visibility: 'hidden' }}>{this.renderTbody()}</tbody>
            <tfoot style={{ visibility: 'hidden' }}>
              <tr className="nobottom" style={compactStyle}>
                <td colSpan={5}>&nbsp;</td>
              </tr>
              <tr className="nobottom" style={compactStyle}>
                <td colSpan={4}>课程总价：</td>
                <td>￥{Number(get(orderInfo, 'originPay', 0) / 100).toFixed(2)}</td>
              </tr>
              <tr className="nobottom" style={compactStyle}>
                <td colSpan={4}>优惠金额：</td>
                <td>-￥{Number(get(orderInfo, 'discount', 0) / 100).toFixed(2)}</td>
              </tr>
              <tr className="nobottom" style={looseStyle}>
                <td colSpan={4}>实付金额：</td>
                <td>
                  <strong style={{ fontSize: '18px' }}>
                    ￥{Number(get(orderInfo, 'realPay', 0) / 100).toFixed(2)}
                  </strong>
                </td>
              </tr>
            </tfoot>
          </table>
          <div id="printArea">正在获取订单信息...</div>
          <div className="tail">
            <span>
              付款方式：<span className="hightlight">{get(orderInfo, 'payTool')}</span>
            </span>
            <span>
              收银员：<span className="hightlight">{get(orderInfo, 'cashierName')}</span>
            </span>
            <span>
              课程顾问：<span className="hightlight">{get(orderInfo, 'sellerName')}</span>
            </span>
          </div>
        </section>
        <section className="noprint" style={{ height: fillHeight }}></section>
        {/* 按钮部分 */}
        <section className="noprint app-design">
          <div className="app-action">
            <Button
              disabled={this.notReadyToPrint()}
              outline
              type="primary"
              onClick={this.handlePrintInvoice}
            >
              打印缴费凭证
            </Button>
            <Button outline type="primary" onClick={this.openOrderDetail}>
              查看订单
            </Button>
            <Button outline type="primary" onClick={this.openStudentDetail}>
              查看学员
            </Button>
            {signUpBtnVisiable && (
              <Button type="primary" onClick={this.handleSignUp}>
                继续报名
              </Button>
            )}
          </div>
        </section>
      </div>
    );
  }
}

export default PrintCertificate;
