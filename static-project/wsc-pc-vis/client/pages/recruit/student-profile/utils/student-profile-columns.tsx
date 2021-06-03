import { Pop } from '@zent/compat';
import React from 'react';
import format from 'date-fns/format';
import { Icon, IGridColumn } from 'zent';
import { Link as SamLink } from '@youzan/sam-components';

import { IStudentProfileItem, convertDataType } from './pre-handle-data';

/**
 * @description 这里放着所有的操作列会用到的方法名
 */
export enum OPERATORS {
  EDIT = 'editRow',
  DELETE = 'deleteRow',
}
export const APPLICABLE_SCENE_LABEL = ['学员报名', '线索管理'];
const OPERATORS_LABEL: Record<OPERATORS, string> = {
  [OPERATORS.EDIT]: '编辑',
  [OPERATORS.DELETE]: '删除',
};

// 序号 title
const HelpEle = (
  <Pop trigger="hover" position="top-center" content="对资料项排序，序号越大越靠前">
    <Icon type="help-circle" />
  </Pop>
);

// 已添加的资料项
const StudentProfileColumns = (
  methods: { [K in OPERATORS]: (...args: any[]) => any },
): IGridColumn[] => {
  return [
    {
      title: <span>序号{HelpEle}</span>,
      name: 'serialNo',
      needSort: true,
      bodyRender(row: IStudentProfileItem) {
        const { serialNo, isReserved } = row;
        if (isReserved) {
          return <span className="profile-list__reserved">{serialNo}</span>;
        }
        return serialNo;
      },
    },
    {
      title: '资料项名称',
      name: 'attributeTitle',
    },
    {
      title: '资料项类型',
      bodyRender(row: IStudentProfileItem) {
        const { attributeKey } = row;
        return attributeKey !== undefined && attributeKey !== '' ? '标准字段' : '自定义字段';
      },
    },
    {
      title: '数据类型',
      name: 'dataType',
      bodyRender({ dataType }) {
        return convertDataType(dataType);
      },
    },
    {
      title: '适用场景',
      bodyRender({ applicableScenes }: IStudentProfileItem) {
        if (applicableScenes) {
          return applicableScenes
            .map(({ applicableScene }) => APPLICABLE_SCENE_LABEL[applicableScene - 1])
            .join('，');
        }
        return '-';
      },
    },
    {
      title: '创建时间',
      name: 'createdAt',
      needSort: true,
      bodyRender({ createdAt }: IStudentProfileItem) {
        if (!createdAt) {
          return '-';
        }
        return format(createdAt, 'YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: '操作',
      width: '160px',
      textAlign: 'right',
      bodyRender(data: IStudentProfileItem, { row }) {
        /** ACTION为string或者一个由方法名构成的数组，方法名见⏫的OPERATORS(line:11) */
        const ACTIONS = data.actions as IStudentProfileItem['actions'];
        if (Array.isArray(ACTIONS)) {
          return (
            <div className="operator-box">
              {ACTIONS.map((action) => {
                const label = OPERATORS_LABEL[action];
                const method = methods[action].bind(null, data, row);
                const KEY = action + row;
                if (action === OPERATORS.DELETE) {
                  return (
                    <Pop
                      key={KEY}
                      trigger="click"
                      content={<div>确认删除?</div>}
                      onConfirm={method}
                      className="profile-list__confirm"
                      position="left-center"
                    >
                      <SamLink name="编辑">{label}</SamLink>
                    </Pop>
                  );
                }
                return (
                  <SamLink name="编辑" key={KEY} onClick={method}>
                    {label}
                  </SamLink>
                );
              })}
            </div>
          );
        }
        return <div className="operator-invalid">{ACTIONS}</div>;
      },
    },
  ];
};

// 所有资料项
const allStudentProfileCols = [
  {
    title: '资料项名称',
    name: 'name',
  },
  {
    title: '数据类型',
    name: 'dataTypeName',
  },
];

export { allStudentProfileCols };
export default StudentProfileColumns;
