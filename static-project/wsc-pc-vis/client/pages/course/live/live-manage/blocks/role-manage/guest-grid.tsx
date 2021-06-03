import React from 'react';
import { Grid, IGridColumn, Notify, Validators } from 'zent';
import { Operations } from '@youzan/react-components';
import { EasyList } from '@youzan/ebiz-components';

import AddAssistant from './add-assistant';
import {
  modifyRoleDialog,
  IModifyRoleProps,
  IModifyRoleResponse,
} from '../../components/modify-teacher-assistant-guest';
import {
  IRoleType,
  addRole,
  updateRole,
  deleteRole,
  ActorType,
} from '../../../api/live-manage';
import { invitGuestDialog } from '../../components/invite-guest-dialog';

export interface IRoleManageGuestGridProps {
  alias: string;
  loading: boolean;
  datasets: IRoleType[];
  connectionNumber: number;
  handleModified(): void;
}

const { quickEditRender } = EasyList;

const GuestGrid: React.FC<IRoleManageGuestGridProps> = (props) => {
  const { datasets, loading, alias, handleModified, connectionNumber } = props;
  const [blockAdd, setBlockAdd] = React.useState(false);

  const handleModifyGuest = React.useCallback((params: IModifyRoleProps) => {
    return modifyRoleDialog(params)
      .afterClosed()
      .catch((err) => {
        err && Notify.error(err);
      });
  }, []);

  const handleFetchResult = React.useCallback(
    (success) => {
      if (success) {
        handleModified();
        Notify.success('保存成功');
        return Promise.resolve();
      } else {
        Notify.error('保存失败，请重试');
        return Promise.reject();
      }
    },
    [handleModified],
  );

  const handleAddGuest = React.useCallback(() => {
    setBlockAdd(true);
    // 静默添加
    addRole({ alias, name: '嘉宾', actor: '嘉宾', actorType: ActorType.GUEST })
      .then((resp) => {
        const { code } = resp;
        const success = (code === 0);
        handleFetchResult(success);
      })
      .catch((resp) => {
        const { code, msg } = resp;
        Notify.error(msg);

        switch (code) {
          // 添加超出上限
          // 刷新页面数据
          case 321100007:
            handleModified();
        }
      })
      .finally(() => setBlockAdd(false));
  }, [alias, handleFetchResult, handleModified]);

  const handleEditGuest = React.useCallback<IPassiveMethods['editGuest']>(
    (params) => {
      const fetchFunction = (assistantInfo: IModifyRoleResponse) =>
        updateRole({
          alias,
          name: assistantInfo.name,
          actor: assistantInfo.title,
          account: params.channelId,
        })
          .then(handleFetchResult);
      return handleModifyGuest({ prefix: '嘉宾', type: 'edit', fetchFunction, ...params });
    },
    [alias, handleFetchResult, handleModifyGuest],
  );

  const handleInviteGuest = React.useCallback<IPassiveMethods['inviteGuest']>(
    (params) => {
      invitGuestDialog({
        name: params.name,
        inviteCode: params.inviteCode,
        url: params.url
      });
    },
    []
  );

  const handleQuickEdit = React.useCallback<IPassiveMethods['quickEditGuest']>(
    (params) =>
      updateRole({
        alias,
        name: params.name,
        actor: params.title,
        account: params.channelId,
      })
        .then((success) => {
          if (success) {
            handleModified();
            Notify.success('保存成功');
            return Promise.resolve(true);
          } else {
            Notify.error('保存失败，请重试');
            return Promise.reject(false);
          }
        })
        .catch((err) => {
          err && Notify.error(err);
          return false;
        }),
    [alias, handleModified],
  );

  const handleDelete = React.useCallback<IPassiveMethods['deleteGuest']>(
    (params) =>
      deleteRole({
        alias,
        account: params.channelId,
      })
        .then((success) => {
          if (success) {
            handleModified();
            Notify.success('删除成功');
          } else {
            return Promise.reject();
          }
        })
        .catch((err) => err && Notify.error(err)),
    [alias, handleModified],
  );

  return (
    <div className="live-manage__roleManage-assistant">
      <Grid
        rowKey="account"
        loading={loading}
        columns={guestListColumns({
          editGuest: handleEditGuest,
          quickEditGuest: handleQuickEdit,
          deleteGuest: handleDelete,
          inviteGuest: handleInviteGuest
        })}
        datasets={datasets}
        emptyLabel={
          <AddAssistant
            loading={blockAdd}
            disabled={datasets.length >= connectionNumber}
            disabledContent={`嘉宾数不得超过连线人数，当前连线人数为：${connectionNumber} 人`}
            onAdd={handleAddGuest}
            actionName="嘉宾"
          />
        }
      />
      {datasets.length > 0 && (
        <div className="live-manage__roleManage-assistant empty-line">
          <AddAssistant
            loading={blockAdd}
            disabled={datasets.length >= connectionNumber}
            disabledContent={`嘉宾数不得超过连线人数，当前连线人数为：${connectionNumber} 人`}
            onAdd={handleAddGuest}
            actionName="嘉宾"
          />
        </div>
      )}
    </div>
  );
};

export default GuestGrid;

interface IEditParams {
  channelId: string;
  inviteCode: string;
  name: string;
  title: string;
  modifiedKey: 'title' | 'name' | 'both';
}

interface IInviteParams {
  name: string;
  inviteCode: string;
  url: string;
}

interface IPassiveMethods {
  editGuest(params: IEditParams): void;
  quickEditGuest(params: IEditParams): Promise<boolean>;
  deleteGuest(params: Pick<IEditParams, 'channelId'>): void;
  inviteGuest(params: IInviteParams): void;
}
const guestListColumns = (passiveMethods: IPassiveMethods): IGridColumn<IRoleType>[] => [
  {
    name: 'name',
    title: '嘉宾名称',
    bodyRender: quickEditRender('name', {
      type: 'text',
      required: '请输入嘉宾名称',
      validators: [Validators.maxLength(8, '最多可输入8个字')],
      onConfirm(value, rowData) {
        return passiveMethods.quickEditGuest({
          name: value,
          channelId: rowData.account,
          inviteCode: rowData.channelPassword,
          title: rowData.actor,
          modifiedKey: 'name',
        });
      },
    }),
  },
  {
    name: 'actor',
    title: '嘉宾头衔',
    bodyRender: quickEditRender('actor', {
      type: 'text',
      required: '请输入嘉宾头衔',
      validators: [Validators.maxLength(8, '最多可输入8个字')],
      onConfirm(value, rowData) {
        return passiveMethods.quickEditGuest({
          title: value,
          channelId: rowData.account,
          name: rowData.name,
          inviteCode: rowData.channelPassword,
          modifiedKey: 'title',
        });
      },
    }),
  },
  {
    name: 'account',
    title: '子频道号',
  },
  {
    name: 'channelPassword',
    title: '密码',
  },
  {
    title: '操作',
    textAlign: 'right',
    bodyRender(rowData) {
      const ACTIONS = [
        <a
          key="invite"
          onClick={() =>
            passiveMethods.inviteGuest({
              inviteCode: rowData.channelPassword,
              name: rowData.name,
              url: rowData.url || '#'
            })
          }
        >
          邀请
        </a>,
        <a
          key="edit"
          onClick={() =>
            passiveMethods.editGuest({
              channelId: rowData.account,
              inviteCode: rowData.channelPassword,
              name: rowData.name,
              title: rowData.actor,
              modifiedKey: 'both',
            })
          }
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => passiveMethods.deleteGuest({ channelId: rowData.account })}
        >
          删除
        </a>,
      ];
      return <Operations items={ACTIONS} />;
    },
  },
];
