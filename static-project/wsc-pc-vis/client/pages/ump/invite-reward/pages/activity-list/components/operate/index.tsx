import { Pop } from '@zent/compat';
import React, { FC, useMemo } from 'react';
import { Link as SamLink } from '@youzan/sam-components';
import CommonLink from 'components/common-link';
import { ActionButtonClickHandler } from 'zent/es/sweetalert/ActionButton';
import { Sweetalert, Notify } from 'zent';
import { Operations } from '@youzan/react-components';
import { invalid, deleteActivity } from '../../../../api';
import { ActivityStatus } from '../../../../types';
import { ActivityPromotion } from '../../../../components/activity-promotion';
import ActivityData from '../activity-data';

const EditOption: FC<{ id: number }> = ({ id }) => (
  <SamLink
    name="转介绍编辑"
    blank
    href={`${window._global.url.v4}/vis/ump/invite-reward#/edit/${id}`}
  >
    编辑
  </SamLink>
);

const DetailOption: FC<{
  id: number;
  isOldStruct: boolean;
  oldStudentRewardRuleDesc: string;
  status: number;
}> = ({ id, isOldStruct, oldStudentRewardRuleDesc, status }) => {
  let version = 2;
  if (oldStudentRewardRuleDesc && status === ActivityStatus.ongoing) {
    version = 0;
  } else if (isOldStruct) {
    version = 1;
  }
  return (
    <CommonLink
      style={{ verticalAlign: 'inherit' }}
      url={`${window._global.url.v4}/vis/ump/invite-reward#/detail/${id}?version=${version}`}
      target="_self"
    >
      查看
    </CommonLink>
  );
};

const InvalidOptionContent: FC<{}> = () => {
  return (
    <div>
      <p>活动失效后，老学员将无法参与转介绍活动，带来新的学员。</p>
      <br />
      <p>活动失效后曾承诺过的奖励将不再继续发放，建议商家主动与老学员建联说明情况。</p>
      <br />
      <p>确定仍要失效活动？</p>
    </div>
  );
};

const InvalidOption: FC<{ onConfirm: ActionButtonClickHandler }> = ({ onConfirm }) => (
  <SamLink
    name="转介绍编辑"
    onClick={() => {
      Sweetalert.confirm({
        closeBtn: true,
        className: 'activity-list-invalid-option',
        content: <InvalidOptionContent />,
        onConfirm,
        confirmText: '确定',
      });
    }}
  >
    失效
  </SamLink>
);

const DeleteOption: FC<{ onConfirm: () => any }> = ({ onConfirm }) => (
  <Pop trigger="click" content="确定删除此活动？" onConfirm={onConfirm} confirmText="确定">
    <SamLink name="转介绍编辑">删除</SamLink>
  </Pop>
);

const CopyOption: FC<{ id: number }> = ({ id }) => (
  <SamLink
    name="转介绍编辑"
    blank
    href={`${window._global.url.v4}/vis/ump/invite-reward#/add/${id}`}
  >
    复制
  </SamLink>
);

const Share = ({ title, alias }) => (
  <ActivityPromotion title={title} alias={alias} key="promotion">
    推广
  </ActivityPromotion>
);

const ViewData: FC<{ id: number; endAt: number; startAt: number; status: number; name: string; }> = ({
  id,
  endAt,
  startAt,
  status,
  name
}) => {
  return (
    <SamLink
      name="转介绍查看"
      onClick={() => {
        ActivityData({
          activityId: id,
          endAt,
          startAt,
          status,
          title: name
        });
      }}
    >
      数据
    </SamLink>
  );
};

const operateConfig = {
  [ActivityStatus.notStarted]: ['edit', 'share', 'disabled', 'copy'],
  [ActivityStatus.ongoing]: ['data', 'edit', 'share', 'disabled', 'copy'],
  [ActivityStatus.ended]: ['data', 'view', 'copy', 'delete'],
  [ActivityStatus.invalid]: ['data', 'view', 'copy', 'delete'],
};

const branchOperateConfig = {
  [ActivityStatus.notStarted]: ['view', 'share'],
  [ActivityStatus.ongoing]: ['view', 'share'],
  [ActivityStatus.ended]: ['view'],
  [ActivityStatus.invalid]: ['view'],
};

interface IOperate {
  status: ActivityStatus;
  id: number;
  name: string;
  alias: string;
  introductionDataView: boolean;
  isOldStruct: boolean;
  oldStudentRewardRuleDesc: string;
  refreshList: () => void;
  endAt: number;
  startAt: number;
}

const Operate: FC<IOperate> = ({
  status,
  id,
  name,
  alias,
  refreshList,
  introductionDataView,
  isOldStruct,
  oldStudentRewardRuleDesc,
  endAt,
  startAt,
}) => {
  operateConfig[ActivityStatus.ongoing][1] = isOldStruct ? 'view' : 'edit';
  const items = useMemo(() => {
    return (introductionDataView ? operateConfig[status] : branchOperateConfig[status]).map(
      item => {
        switch (item) {
          case 'edit':
            return <EditOption key="edit" id={id} />;
          case 'view':
            return (
              <DetailOption
                key="detail"
                id={id}
                isOldStruct={isOldStruct}
                status={status}
                oldStudentRewardRuleDesc={oldStudentRewardRuleDesc}
              />
            );
          case 'share':
            return <Share title={name} alias={alias} />;
          case 'disabled':
            return (
              <InvalidOption
                key="invalid"
                onConfirm={() => invalid({ command: { id } }).then(refreshList).catch(Notify.error)}
              />
            );
          case 'copy':
            return <CopyOption key="copy" id={id} />;
          case 'data':
            return <ViewData id={id} endAt={endAt} startAt={startAt} status={status} name={name} />;
          case 'delete':
            return (
              <DeleteOption
                key="delete"
                onConfirm={() =>
                  deleteActivity({ command: { id } }).then(refreshList).catch(Notify.error)
                }
              />
            );
          default:
            break;
        }
      },
    );
  }, [
    introductionDataView,
    status,
    id,
    isOldStruct,
    name,
    alias,
    refreshList,
    oldStudentRewardRuleDesc,
    endAt,
    startAt,
  ]);
  return <Operations items={items} />;
};

export default Operate;
