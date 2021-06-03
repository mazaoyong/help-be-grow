import { Pop } from '@zent/compat';
import React from 'react';
import { isEduHqStore } from '@youzan/utils-shop';
import { arrayColumnWrapper } from 'fns/chain/index';
import { REWARD_USAGE_STATUS, COURSE_URL } from '../constants.js';
import { Icon } from 'zent';
import { hashHistory } from 'react-router';
import { format } from 'date-fns';

function recordOptions(rewardNodeType) {
  const { pathname } = hashHistory.getCurrentLocation();
  const isProcessing = /processing/.test(pathname);
  return arrayColumnWrapper(+rewardNodeType === 1 ? [
    {
      type: 'Input',
      name: 'studentName',
      label: '学员姓名：',
    },
    {
      type: 'Select',
      name: 'awardType',
      label: '奖励类型：',
      data: [
        {
          value: 0,
          text: '全部',
        },
        {
          value: 1,
          text: '优惠券',
        },
        {
          value: 4,
          text: '积分',
        },
        {
          value: 2,
          text: '正式课',
        },
        {
          value: 3,
          text: '体验课',
        },
      ],
      props: {
        placeholder: '全部',
      },
    },
    {
      type: 'Input',
      name: 'orderNo',
      label: '订单编号：',
    },
    {
      type: 'Input',
      name: 'courseProductName',
      label: '线下课：',
    },
    {
      type: 'Select',
      name: 'campusKdtId',
      chainState: isEduHqStore,
      label: '所属校区：',
      data: this.state.campusList,
    },
  ] : [
    {
      type: 'Input',
      name: 'studentName',
      label: '学员姓名：',
      props: {
        placeholder: '名称或者手机号'
      }
    },
    {
      type: 'Input',
      name: 'orderNo',
      label: '订单号：',
      chainState: !isProcessing,
    },
    {
      type: 'DateRangePicker',
      name: 'createdAt',
      label: '发放时间：',
      props: {
        showTime: { format: 'HH:mm', defaultTime: ['00:00', '23:59'] },
        format: 'YYYY-MM-DD HH:mm:ss',
      }
    },
    {
      type: 'DateRangePicker',
      name: 'redeemAt',
      label: '领取时间：',
      props: {
        showTime: { format: 'HH:mm', defaultTime: ['00:00', '23:59'] },
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      chainState: !isProcessing,
    },
    {
      type: 'Select',
      name: 'campusKdtId',
      chainState: isEduHqStore,
      label: '所属校区：',
      data: this.state.campusList,
    },
  ]);
}

function recordsColumns(rewardNodeType) {
  const { pathname } = hashHistory.getCurrentLocation();
  const isProcessing = /processing/.test(pathname);
  return arrayColumnWrapper([
    {
      title: '学员姓名',
      name: 'studentName',
      fixed: 'left',
      bodyRender: ({ rewardCharacterDTO = {} }) => {
        return (
          <div style={{ wordWrap: 'break-word', maxWidth: '90px' }}>
            <a href={`${_global.url.v4}/vis/edu/page/student#/detail/${rewardCharacterDTO.studentId}`}>{rewardCharacterDTO.studentName || ''}</a>
            <p>{rewardCharacterDTO.studentPhone || ''}</p>
          </div>
        );
      },
    },
    {
      title: '发放时间',
      name: 'rewardAt',
      bodyRender: ({ rewardAt }) => {
        return <span>{rewardAt}</span>;
      },
    },
    {
      title: '订单号',
      name: 'orderNo',
      bodyRender: ({ orderNo }) => {
        return <div style={{ wordWrap: 'break-word' }}>{orderNo || '-'}</div>;
      },
      chainState: !isProcessing || +rewardNodeType === 1,
    },
    {
      title: '线下课',
      name: 'courseProductName',
      chainState: +rewardNodeType === 1,
      bodyRender: ({ rewardActivityDTO }) => {
        return (
          <a
            onClick={() =>
              window.open(
                `${COURSE_URL}?alias=${rewardActivityDTO.courseProductDTO.alias}&kdt_id=${
                  rewardActivityDTO.courseProductDTO.kdtId
                }`,
              )
            }
          >
            {rewardActivityDTO.courseProductDTO.title}
          </a>
        );
      },
    },
    {
      title: '奖励',
      name: 'award',
      chainState: +rewardNodeType === 1,
      bodyRender: ({ awardDTO, rewardActivityDTO }) => {
        switch (awardDTO.awardType) {
          case 1:
            return (
              <span>{`${
                awardDTO.voucherCouponAwardDetailDTO
                  ? awardDTO.voucherCouponAwardDetailDTO.title
                  : '优惠券'
              }`}</span>
            );
          case 4:
            return <span>{`${awardDTO.awardValue}积分`}</span>;
          case 2:
          case 3:
            let awardValue = '';
            if (rewardActivityDTO.courseProductDTO.alias === awardDTO.awardId) {
              if (rewardActivityDTO.courseProductDTO.courseSellType === 1) {
                awardValue = `赠送${awardDTO.awardValue / 100}课时`;
              } else {
                awardValue = `赠送${awardDTO.awardValue}天`;
              }
            } else {
              awardValue = '体验课';
            }
            return <span>{awardValue}</span>;
        }
        return null;
      },
    },
    {
      title: '发放条件',
      name: 'rewardCondition',
      chainState: +rewardNodeType === 1,
      bodyRender: ({ rewardActivityDTO }) => {
        const { rewardConditionDTO } = rewardActivityDTO;
        if (rewardConditionDTO && rewardConditionDTO.rewardNodeType) {
          switch (rewardConditionDTO.rewardNodeType) {
            case 1:
              switch (rewardConditionDTO.conditionType) {
                case 1:
                  return (
                    <span className="rewardcondition-value-cell">{`消课课时达${rewardConditionDTO.conditionValue /
                      100}课时`}</span>
                  );
                case 2:
                  return (
                    <span className="rewardcondition-value-cell">{`课程生效${
                      rewardConditionDTO.conditionValue
                    }天后`}</span>
                  );
                case 3:
                case 0:
                  return (
                    <span className="rewardcondition-value-cell">{`开课时间${
                      rewardConditionDTO.conditionValue
                    }天后`}</span>
                  );
              }
              break;
            case 2:
              return <span className="rewardcondition-value-cell">{'入学奖励'}</span>;
            case 3:
              return <span className="rewardcondition-value-cell">{'毕业奖励'}</span>;
          }
        }
        return null;
      },
    },
    {
      title: '积分数',
      name: 'awardDTO',
      bodyRender: ({ awardDTO }) => {
        const { awardValue } = awardDTO;
        return <div style={{ wordWrap: 'break-word' }}>{awardValue || '-'}</div>;
      },
      chainState: isProcessing && +rewardNodeType !== 1,
    },
    {
      title: '所属校区',
      chainState: isEduHqStore && (this.state.campusKdtId === _global.kdtId),
      bodyRender: ({ ebizSimpleShopDTO }) => {
        ebizSimpleShopDTO = ebizSimpleShopDTO || {};
        return ebizSimpleShopDTO.shopName;
      },
    },
    {
      title: '领取时间',
      name: 'redeemAt',
      bodyRender: ({ redeemAt, rewardStatus }) => {
        return <span>{rewardStatus === 3 ? format(redeemAt, 'YYYY-MM-DD HH:mm:ss') : '未领取'}</span>;
      },
      chainState: !isProcessing || +rewardNodeType === 1,
    },
    {
      title: (
        <span style={{ display: 'inline-block', marginTop: '6px' }}>
          <span>奖励使用情况</span>
          <Pop trigger="hover" content="无法获取到积分的使用情况">
            <Icon style={{ marginLeft: '5px', color: '#C8C9CC', fontSize: '14px' }} type="help-circle" />
          </Pop>
        </span>
      ),
      fixed: 'right',
      width: '200px',
      name: 'rewardStatus',
      chainState: !isProcessing || +rewardNodeType === 1,
      bodyRender: ({ awardDTO }) => {
        let useStatus = 0;
        switch (awardDTO.awardType) {
          case 1:
            useStatus = awardDTO.voucherCouponAwardDetailDTO
              ? awardDTO.voucherCouponAwardDetailDTO.useStatus
              : 0;
            break;
          case 2:
            useStatus = awardDTO.normalCourseTimeAwardDetailDTO
              ? awardDTO.normalCourseTimeAwardDetailDTO.useStatus
              : 0;
            break;
          case 3:
            useStatus = awardDTO.trialCourseProductAwardDetailDTO
              ? awardDTO.trialCourseProductAwardDetailDTO.useStatus
              : 0;
            break;
        }
        return <span style={{ display: 'inline-block', marginTop: '6px' }}>{REWARD_USAGE_STATUS[useStatus]}</span>;
      },
    },
  ]);
}

export { recordOptions, recordsColumns };
