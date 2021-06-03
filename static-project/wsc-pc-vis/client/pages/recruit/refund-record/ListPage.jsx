import { Pop } from '@zent/compat';
import React from 'react';
import { hashHistory } from 'react-router';
import VisList, { VisFilterTable } from 'components/vis-list';
import ValuntaryAsyncSelect from 'components/valuntary-async-select/ValuntaryAsyncSelect';
import { Button, Icon } from 'zent';
import api from './api';
import { get } from 'lodash';
import { isEduChainStore } from '@youzan/utils-shop';
import {
  getToday,
  getTomorrow,
  getCurrentWeek,
  getLastWeek,
  getUnitByType,
  getLocationSearch,
  formatTextWithZeroValue,
} from './utils';
import { format } from 'date-fns';
import { REFUNDTYPE } from './constants';

export default function ListPage() {
  const defaultFilterValue = {
    timeRange: ['', ''],
    courseName: '',
    student: '',
    sellerId: '',
    operatorId: '',
    assetNo: '',
    kdtId: '',
  };
  const renderBottomAction = filter => {
    const { submit, reset } = filter;
    return (
      <>
        <Button type="primary" onClick={submit}>
          筛选
        </Button>
        <span className="filter__actions__reset" onClick={reset}>
          重置筛选条件
        </span>
      </>
    );
  };
  const getStaffListOptions = (query, pageRequest) => {
    const getStaffList = isEduChainStore ? api.getChainShopStaffList : api.getSingleShopStaffList;
    return getStaffList({ keyword: query, pageNo: pageRequest.pageNumber }).then(data => {
      const items = get(data, 'items');
      if (items && Array.isArray(items)) {
        return items.map(item => ({ text: item.name, value: item.adminId }));
      }
      return [];
    });
  };
  const filterOption = [
    {
      type: 'DateRangeQuickPicker',
      name: 'timeRange',
      label: '退课时间：',
      props: {
        max: new Date(),
        valueType: 'date',
        format: 'YYYY-MM-DD HH:mm:ss',
        preset: [
          {
            text: '今',
            value: getToday(),
          },
          {
            text: '明',
            value: getTomorrow(),
          },
          {
            text: '本周',
            value: getCurrentWeek(),
          },
          {
            text: '上周',
            value: getLastWeek(),
          },
        ],
      },
    },
    {
      type: 'Input',
      label: '学员：',
      name: 'student',
      props: {
        width: 184,
        placeholder: '输入姓名/手机号',
      },
    },
    {
      type: 'Input',
      label: '线下课名称：',
      name: 'courseName',
      props: {
        width: 184,
      },
    },
    {
      type: 'Custom',
      label: '课程顾问：',
      name: 'sellerId',
      format: data => Promise.resolve(data.target),
      component: ValuntaryAsyncSelect,
      create: false,
      refresh: false,
      getOptions: getStaffListOptions,
      placeholder: '全部',
      width: '184px',
      hideClose: true,
    },
    {
      type: 'Custom',
      label: '经办人：',
      name: 'operatorId',
      format: data => Promise.resolve(data.target),
      component: ValuntaryAsyncSelect,
      create: false,
      refresh: false,
      getOptions: getStaffListOptions,
      placeholder: '全部',
      width: '184px',
      hideClose: true,
    },
  ];
  const fetchData = ({ filterConditions, pageConditions }) => {
    let params = {};
    params.courseName = filterConditions.courseName;
    params.studentNameOrPhoneNumber = filterConditions.student;
    params.sellerId = filterConditions.sellerId;
    params.operatorId = filterConditions.operatorId;
    params.startTime =
      filterConditions.timeRange && filterConditions.timeRange[0]
        ? format(filterConditions.timeRange[0], 'YYYY-MM-DD HH:mm:ss')
        : null;
    params.endTime =
      filterConditions.timeRange && filterConditions.timeRange[1]
        ? format(filterConditions.timeRange[1], 'YYYY-MM-DD HH:mm:ss')
        : null;
    // 查看是否有资产查询
    const queryValue = getLocationSearch();
    if (queryValue.assetNo) {
      params.assetNo = queryValue.assetNo;
    }
    if (queryValue.kdtId) {
      params.targetKdtId = queryValue.kdtId || window._global.kdtId;
    }

    return api
      .getRefundRecordList({
        pageNumber: pageConditions.pageNumber,
        pageSize: pageConditions.pageSize,
        sort: {
          orders: [
            {
              direction: 'DESC',
              property: 'createdAt',
            },
          ],
        },
        params,
        type: 1,
      })
      .then(res => {
        return {
          datasets: res.content,
          total: res.total,
          current: res.pageable.pageNumber,
        };
      });
  };
  const getColumns = () => {
    return [
      {
        title: '学员',
        name: 'studentName',
        width: 150,
      },
      {
        title: '手机号',
        name: 'phoneNumber',
        width: 200,
      },
      {
        title: '退课课程',
        name: 'name',
        width: 150,
      },
      {
        title: '退课内容',
        width: 150,
        bodyRender: data => {
          let value = 0;
          if (data.refundCourseValue != null) {
            if (data.refundCourseUnit === REFUNDTYPE.BY_COURSE) {
              value = data.refundCourseValue / 100;
            } else {
              value = data.refundCourseValue;
            }
          }
          return formatTextWithZeroValue(
            data.refundCourseValue,
            `退${value}${getUnitByType(data.refundCourseUnit)}`,
          );
        },
      },
      {
        title: '退回金额',
        width: 150,
        bodyRender: data => {
          const refundMoneyText = formatTextWithZeroValue(
            data.refundMoney,
            (data.refundMoney / 100).toFixed(2),
          );
          let refundFailElem = null;
          if (data.extMap && data.extMap.refundMoneyFail) {
            const fullText = data.extMap.refundMoneyFail;
            const refundFailText = fullText.slice(0, fullText.indexOf('|'));
            refundFailElem = (
              <div>
                <span className="fail-text">退课失败</span>
                <Pop
                  trigger="hover"
                  position="bottom-left"
                  className="fail-pop"
                  content={<span>{refundFailText}</span>}
                >
                  <Icon type="error-circle" style={{ color: '#999' }} />
                </Pop>
              </div>
            );
          }
          return (
            <div>
              <span>{refundMoneyText}</span>
              <br />
              {refundFailElem}
            </div>
          );
        },
      },
      {
        title: '退课状态',
        name: '',
        width: 150,
        bodyRender: data => {
          if (data.status === 7) {
            return '已退课';
          }
          return '-';
        },
      },
      {
        title: '退课方式',
        width: 150,
        bodyRender: data => {
          return data.refundFeeTypeList.map(item => item.payWayDesc).join('、');
        },
      },
      {
        title: '退课备注',
        width: 150,
        nowrap: true,
        bodyRender: data => {
          return (
            <Pop className="tooltip" trigger="hover" content={data.remark}>
              {data.remark}
            </Pop>
          );
        },
      },
      {
        title: '课程顾问',
        width: 150,
        bodyRender: data => {
          return data.sellerName ? data.sellerName : '-';
        },
      },
      {
        title: '经办人',
        width: 150,
        bodyRender: data => {
          return data.operatorName ? data.operatorName : '-';
        },
      },
      {
        title: '操作时间',
        width: 150,
        bodyRender: data => {
          return format(data.createdAt, 'YYYY-MM-DD HH:mm:ss');
        },
      },
      {
        title: '操作',
        textAlign: 'right',
        width: 150,
        fixed: 'right',
        bodyRender: data => {
          return (
            <a href="javascript:;" onClick={() => hashHistory.push(`/print/${data.refundNo}?kdtId=${data.kdtId}`)}>
              打印退课凭证
            </a>
          );
        },
      },
    ];
  };
  return (
    <div className="refund-record">
      <VisList>
        <VisFilterTable
          filterProps={{
            defaultValue: defaultFilterValue,
            options: filterOption,
            bottomActions: renderBottomAction,
          }}
          tableProps={{
            rowKey: 'id',
            columns: getColumns(),
            fetchData: fetchData,
            emptyLabel: '还没有退课记录',
            scroll: { x: 1700 },
            ellipsis: true,
          }}
        />
      </VisList>
    </div>
  );
}
