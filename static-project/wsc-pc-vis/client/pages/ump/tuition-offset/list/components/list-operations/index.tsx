import { Pop } from '@zent/compat';
import React, { FC, useMemo } from 'react';
import { Link } from 'zent';
import { ActionButtonClickHandler } from 'zent/es/sweetalert/ActionButton';
import { Operations } from '@youzan/react-components';

import { ITuitionListDTO } from 'definitions/api/owl/pc/TuitionPCFacade/findByPage';
import CommonLink from 'components/common-link';
import EventPromotion from '../../../components/event-promotion';
import { EventStatus } from '../../../types';

interface IListOperationsProps {
  data: ITuitionListDTO;
  handleInvalidate: (id: number) => void;
  handleDelete: (id: number) => void;
  showBdapp: boolean;
}

interface IEditOptionProps {
  id: number,
  status?: EventStatus,
}

const EditOption: FC<IEditOptionProps> = ({ id, status }) => (
  <CommonLink
    url={
      `${window._global.url.v4}/vis/ump/tuition-offset#/edit/${id}${status
        ? `?status=${status}` : ''}`
    }
    target="_blank"
  >
    编辑
  </CommonLink>
);

const DetailOption: FC<{ id: number }> = ({ id }) => (
  <CommonLink url={`${window._global.url.v4}/vis/ump/tuition-offset#/detail/${id}`} target="_blank">
    查看
  </CommonLink>
);

const StatsOption: FC<{ id: number }> = ({ id }) => (
  <CommonLink url={`${window._global.url.v4}/vis/ump/tuition-offset#/stats/${id}`} target="_blank">
    数据
  </CommonLink>
);

const InvalidOption: FC<{ onConfirm: ActionButtonClickHandler }> = ({ onConfirm }) => (
  <Pop
    trigger="click"
    className="tuition-offset-invalidate-pop"
    position="top-right"
    content={(
      <div className="content">
        活动失效后，已参与活动的用户无法再邀请好友助力攒学费以及使用已攒到的学费兑换课程。确认失效此活动？
      </div>
    )}
    onConfirm={onConfirm}
    confirmText="确定"
  >
    <Link className="common-link">失效</Link>
  </Pop>
);

const DeleteOption: FC<{ onConfirm: ActionButtonClickHandler }> = ({ onConfirm }) => (
  <Pop
    trigger="click"
    content="确定删除此活动？"
    onConfirm={onConfirm}
    confirmText="确定"
  >
    <Link className="common-link">删除</Link>
  </Pop>
);

const CopyOption: FC<{ id: number }> = ({ id }) => (
  <CommonLink
    url={`${window._global.url.v4}/vis/ump/tuition-offset#/add/${id}`}
    target="_blank"
  >
    复制
  </CommonLink>
);

const getOperationList = (status?: EventStatus) => {
  switch (status) {
    case EventStatus.notStarted:
      return ['edit', 'promotion', 'invalidate', 'copy'];
    case EventStatus.ongoing:
      return ['stats', 'editpart', 'promotion', 'invalidate', 'copy'];
    case EventStatus.invalid:
    case EventStatus.ended:
      return ['stats', 'detail', 'delete', 'copy'];
    default:
      return [];
  }
};

const ListOperations: FC<IListOperationsProps> = ({ data, handleInvalidate, handleDelete, showBdapp }) => {
  const operationMap: Record<string, any> = useMemo(() => ({
    edit: <EditOption key="edit" id={data.id} />,
    editpart: <EditOption key="editpart" id={data.id} status={data.status} />,
    promotion: <EventPromotion id={data.id} alias={data.alias} showBdapp={showBdapp} key="promotion">推广</EventPromotion>,
    invalidate: <InvalidOption
      key="invalid"
      onConfirm={() => handleInvalidate(data.id)}
    />,
    detail: <DetailOption key="detail" id={data.id} />,
    copy: <CopyOption key="copy" id={data.id} />,
    stats: <StatsOption key="stats" id={data.id} />,
    delete: <DeleteOption
      key="delete"
      onConfirm={() => handleDelete(data.id)}
    />,
  }), [data.alias, data.id, data.startAt, data.endAt, handleDelete, handleInvalidate, showBdapp]);

  const operationList = useMemo(() => getOperationList(data.status), [data.status]);

  return (
    <Operations items={operationList.map(operationName => operationMap[operationName])} />
  );
};

export default ListOperations;
