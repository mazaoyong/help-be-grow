import { Pop } from '@zent/compat';
import React, { FC, useMemo } from 'react';
import { ActionButtonClickHandler } from 'zent/es/sweetalert/ActionButton';
import { Link as SamLink, checkAccess } from '@youzan/sam-components';
import { Operations } from '@youzan/react-components';
import CommonLink from 'components/common-link';
import WorkbookPromotion from '../promotion-dialog';
import DeleteOption from '../delete-option';

import { workbookStockOperationMap, WorkbookManageViewType } from '../../../../constants';
import type { IArthurModel } from '@youzan/arthur-scheduler-core';
import { workbookPublishStatus, IWorkbookListData, joinLimit } from 'domain/workbook-domain/types';

import './styles.scss';

const hasEditPrivilege = checkAccess('编辑');

interface IListOperationsProps {
  data: IWorkbookListData;
  handleSwitch: (id: number, type: workbookPublishStatus) => void;
  handleDelete: (id: number) => Promise<any>;
  hasAttendance: boolean;
  studentNum: number;
  arthurModel?: IArthurModel;
}

const EditOption: FC<{ id: number; blank: boolean }> = ({ id, blank }) => (
  /* 作业本编辑权限
    仅有作业本编辑权限的员工可以操作（包括总部看校区，总部可以点击编辑，但进去不能编辑任何内容）
   */
  <SamLink
    name="编辑"
    href={`${window._global.url.v4}/vis/supv/homework/workbook/edit/${id}`}
    target={blank ? '_blank' : '_self'}
  >
    编辑
  </SamLink>
);

const ManageOption: FC<{
  id: number;
  isAuthorized: boolean;
  chainDisabled?: boolean;
}> = ({ id, isAuthorized, chainDisabled }) => {
  /* 作业本管理权限
    1. 单店和连锁校区：拥有作业本编辑权限或作业本内的老师可以操作
    2. 连锁总部可以管理自己的作业本，不可管理校区的作业本
    arthur配置中，总部chainDisabled 为 true
  */
  if (chainDisabled) {
    // 总部 且 作业本为校区作业本或作业本没有kdtId
    return <span className="disabled">管理</span>;
  } else if (isAuthorized) {
    return (
      <CommonLink
        className="workbook-manage"
        url={`${window._global.url.v4}/vis/supv/homework/workbook/${id}/manage/${WorkbookManageViewType.HOMEWORKS}`}
      >
        管理
      </CommonLink>
    );
  }
  return (
    <SamLink
      name="编辑"
      href={`${window._global.url.v4}/vis/supv/homework/workbook/${id}/manage/${WorkbookManageViewType.HOMEWORKS}`}
    >
      管理
    </SamLink>
  );
};

const SwitchOption: FC<{
  type: workbookPublishStatus;
  onConfirm: ActionButtonClickHandler;
  disabled?: boolean;
}> = ({ type, onConfirm, disabled }) => {
  if (disabled) {
    return <span className="disabled">{workbookStockOperationMap[type]}</span>;
  } else if (hasEditPrivilege) {
    return (
      <Pop
        trigger="click"
        className="homework-invalidate-pop"
        position="top-right"
        content={
          <div className="content">
            <p>确定要{workbookStockOperationMap[type]}该作业本？</p>
          </div>
        }
        onConfirm={onConfirm}
        confirmText="确定"
      >
        <span className="operation">{workbookStockOperationMap[type]}</span>
      </Pop>
    );
  }
  return <span className="operation disabled">{workbookStockOperationMap[type]}</span>;
};

const getOperationList = (status: workbookPublishStatus, type?: joinLimit) => {
  switch (status) {
    case workbookPublishStatus.inStock:
      if (type === joinLimit.boundClass) {
        return ['manage', 'edit', 'promotion', 'delete'];
      }
      return ['manage', 'edit', 'promotion', 'switchoff', 'delete'];
    case workbookPublishStatus.offStock:
      return ['manage', 'edit', 'promotion', 'switchon', 'delete'];
    default:
      return [];
  }
};

const ListOperations: FC<IListOperationsProps> = (props) => {
  const { data, handleSwitch, handleDelete, hasAttendance, studentNum, arthurModel } = props;

  const isAuthorized = !!data?.teacherList
    ?.map((teacher) => teacher?.teacherId)
    ?.includes(_global.userId);

  const chainDisabled = useMemo(() => arthurModel?.disabled, [arthurModel]);
  const isHqCheckHq = useMemo(() => chainDisabled && data.kdtId === _global.kdtId, [
    chainDisabled,
    data.kdtId,
  ]);
  const isHqCheckBranch = useMemo(
    () => chainDisabled && !!data.kdtId && data.kdtId !== _global.kdtId,
    [chainDisabled, data.kdtId],
  );

  const operationMap: Record<string, any> = useMemo(
    () => ({
      manage: (
        <ManageOption
          key="manage"
          id={data?.id}
          isAuthorized={isAuthorized}
          chainDisabled={isHqCheckBranch}
        />
      ),
      edit: <EditOption key="edit" id={data?.id} blank={isHqCheckBranch} />,
      promotion: (
        /* 作业本推广权限
          总部不可推广自己的作业本（总部有作业本仅适用于单店升级连锁场景）
          总部推广校区的作业本要在链接带上校区的kdtId
        */
        <WorkbookPromotion
          id={data?.id}
          alias={data?.alias}
          kdtId={data?.kdtId}
          title={data?.title}
          text="长按识别二维码领取作业本"
          source="workbook"
          disabled={isHqCheckHq}
        />
      ),
      switchon: (
        <SwitchOption
          key="switchon"
          type={workbookPublishStatus.offStock}
          onConfirm={() => handleSwitch(data?.id, workbookPublishStatus.offStock)}
          disabled={isHqCheckBranch}
        />
      ),
      switchoff: (
        <SwitchOption
          key="switchoff"
          type={workbookPublishStatus.inStock}
          onConfirm={() => handleSwitch(data?.id, workbookPublishStatus.inStock)}
          disabled={isHqCheckBranch}
        />
      ),
      delete: (
        <DeleteOption
          key="delete"
          workbookId={data?.id}
          onConfirm={() => handleDelete(data?.id)}
          hasAttendance={hasAttendance}
          studentNum={studentNum}
          disabled={isHqCheckBranch}
        />
      ),
    }),
    [
      data,
      handleDelete,
      handleSwitch,
      hasAttendance,
      isAuthorized,
      isHqCheckBranch,
      isHqCheckHq,
      studentNum,
    ],
  );

  const operationList = useMemo(() => getOperationList(data.status, data.joinSetting?.joinType), [
    data.joinSetting,
    data.status,
  ]);

  return (
    <Operations
      className="workbook-operations"
      items={operationList.map((operationName) => operationMap[operationName])}
    />
  );
};

export default ListOperations;
