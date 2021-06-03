/* eslint-disable react/display-name */
import React from 'react';
import format from 'date-fns/format';
import { Notify } from 'zent';

// 筛选条件
export const filterList = [
  [
    {
      type: 'Input',
      key: 'stuName',
      label: '学员姓名',
      placeholder: '请输入学员姓名',
    },
    {
      type: 'Input',
      key: 'stuTel',
      label: '手机号码',
      placeholder: '请输入手机号码',
    },
    {
      type: 'Select',
      key: 'apptStatus',
      label: '预约状态',
      validations: {},
      placeholder: '请选择预约状态',
      data: [
        { value: 0, text: '全部' },
        { value: 1, text: '已预约' },
        { value: 2, text: '未预约' },
      ],
    },
  ],
  [
    {
      type: 'AsyncSelect',
      key: 'featureItem',
      label: '来源',
      validations: {},
      placeholder: '全部',
    },
    {
      type: 'DateRangePicker',
      key: 'createAt',
      label: '报名时间',
      validations: {},
    },
  ],
];

export function stateGenerator() {
  return {
    resetTimer: null,
    recordTotal: 0, // 是否有学员报名
    apptStatusValList: [], // 下拉框选项
    form: { // 筛选条件
      featureItem: {},
      stuName: '',
      stuTel: '',
      apptStatus: 0,
      createAt: [],
      direction: 'DESC',
    },
    content: [], // 表格数据
    pageable: { // 分页信息
      totalItem: 0,
      pageSize: 20,
      current: 1,
      maxPage: 0,
    },
    visible: { // 弹窗可见状态
      detail: false, // 报名详情
      export: false, // 导出报名信息
    },
    loading: { // 加载状态
      content: false, // 加载表格数据
      export: false, // 导出表格数据
      appointment: false, // 创建预约
    },
    currentRegisInfo: { // 报名信息记录详情
      stuName: '',
      stuTel: '',
      regInfo: [], // 用户在c端填写的报名信息
    },
    options: [], // 微页面来源列表
    columns: [
      {
        title: '学员姓名',
        name: 'stuName',
        nowrap: true,
        bodyRender: (data, pos) => {
          return (
            <span
              className="regis-record__stuName"
              onClick={() => {
                this.setState({
                  currentRegisInfo: data,
                }, () => this.triggerVisible('detail', true));
              }}
            >{data.stuName}</span>
          );
        },
      },
      {
        title: '手机号码',
        name: 'stuTel',
        nowrap: true,
      },
      {
        title: '报名时间',
        name: 'createAt',
        needSort: true,
        nowrap: true,
        bodyRender: (data, pos) => {
          return (
            <span>{format(data.createdAt, 'YYYY-MM-DD HH:mm:ss')}</span>
          );
        },
      },
      {
        title: '来源',
        name: 'featureTitle',
        nowrap: true,
        bodyRender: (data, pos) => {
          const { featureUrl, featureTitle } = data;
          return featureUrl
            ? <a href={featureUrl} target="_blank" rel="noopener noreferrer">{featureTitle}</a>
            : <a href="javascript:;" onClick={() => Notify.error('此微页面已被删除')}>{featureTitle}</a>;
        },
      },
      {
        title: '预约状态',
        name: 'apptStatus',
        nowrap: true,
        bodyRender: (data, pos) => {
          return (
            <span>{data.apptStatus === 1 ? '已预约' : '未预约'}</span>
          );
        },
      },
      {
        title: '操作',
        name: '_action',
        nowrap: true,
        bodyRender: (data, pos) => {
          return (
            <div className="regis-record__action">
              <span onClick={() => {
                this.setState({
                  currentRegisInfo: data,
                }, this.createPreAppointment);
              }}>创建预约</span>
              {data.apptStatus === 1 && <span onClick={() => this.viewAppointment(data.stuTel)}>查看预约</span>}
            </div>
          );
        },
      },
    ],
  };
}
