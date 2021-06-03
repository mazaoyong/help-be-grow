import React from 'react';
import format from 'date-fns/format';

// 筛选条件
export const filterList = [
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
  {
    type: 'AsyncSelect',
    key: 'featureItem',
    label: '来源',
    validations: {},
    placeholder: '请选择来源',
  },
  {
    type: 'DateRangePicker',
    key: 'createAt',
    label: '报名时间',
    validations: {},
  },
];

export function stateGenerator() {
  return {
    apptStatusValList: [], // 下拉框选项
    currentApptStatus: {}, // 当前选中的来源
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
      content: true, // 加载表格数据
      export: true, // 导出表格数据
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
        bodyRender: (data, pos) => {
          return (
            <div
              className="regis-record__stuName"
              onClick={() => {
                this.setState({
                  currentRegisInfo: data,
                }, () => this.triggerVisible('detail', true));
              }}
            >{data || data.stuName}</div>
          );
        },
      },
      {
        title: '手机号',
        name: 'stuTel',
      },
      {
        title: '创建时间',
        name: 'createAt',
        needSort: true,
        bodyRender: (data, pos) => {
          return (
            <div>{format(data.createdAt, 'YYYY-MM-DD HH:mm:ss')}</div>
          );
        },
      },
      {
        title: '来源',
        name: 'featureTitle',
        bodyRender: (data, pos) => {
          return (
            <a href={data.featureUrl} target="_blank" rel="noopener noreferrer">{data.featureTitle}</a>
          );
        },
      },
      {
        title: '预约状态',
        name: 'apptStatus',
        bodyRender: (data, pos) => {
          return (
            <div>{data.apptStatus === 1 ? '已预约' : '未预约'}</div>
          );
        },
      },
    ],
  };
}
