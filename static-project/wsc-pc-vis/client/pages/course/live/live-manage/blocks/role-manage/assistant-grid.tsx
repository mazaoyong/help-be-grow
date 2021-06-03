import React from 'react';
import { Grid, IGridColumn, Notify, Validators } from 'zent';
import { Operations } from '@youzan/react-components';
import { EasyList } from '@youzan/ebiz-components';

import { uploadTrackerInfo } from '../record-manage';
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

export interface IRoleManageAssistantGridProps {
  alias: string;
  loading: boolean;
  datasets: IRoleType[];
  handleModified(): void;
  /** 触发埋点方法 */
  dispatchUploadTrackInfo: typeof uploadTrackerInfo;
}

const { quickEditRender } = EasyList;

const AssistantGrid: React.FC<IRoleManageAssistantGridProps> = (props) => {
  const { datasets, loading, alias, handleModified, dispatchUploadTrackInfo } = props;
  const [blockAdd, setBlockAdd] = React.useState(false);

  const handleModifyAssistant = React.useCallback((params: IModifyRoleProps) => {
    return modifyRoleDialog(params)
      .afterClosed()
      .catch((err) => {
        err && Notify.error(err);
      });
  }, []);

  const uploadEditAssistantTracker = React.useCallback<IPassiveMethods['editAssistant']>(
    (params) => {
      const { modifiedKey, name, title } = params;
      if (modifiedKey === 'name' || modifiedKey === 'both') {
        dispatchUploadTrackInfo({
          eventName: '修改名称',
          eventSign: 'modifyName',
          otherParams: { role: 'assistant', name },
        });
      }
      if (modifiedKey === 'title' || modifiedKey === 'both') {
        dispatchUploadTrackInfo({
          eventName: '修改头衔',
          eventSign: 'modifyTitle',
          otherParams: { role: 'assistant', title },
        });
      }
    },
    [dispatchUploadTrackInfo],
  );

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

  const handleAddAssistant = React.useCallback(() => {
    const randomNameIndex = Math.floor(5 * Math.random());
    const name = teacherRandomList[randomNameIndex];
    setBlockAdd(true);
    // 静默添加
    addRole({ alias, name, actor: '助教', actorType: ActorType.ASSISTANT })
      .then((resp) => {
        const { code } = resp;
        const success = (code === 0);
        handleFetchResult(success);
      })
      .then(() =>
        dispatchUploadTrackInfo({
          eventSign: 'addRole',
          eventName: '添加角色',
          otherParams: { role: 'assistant' },
        }),
      )
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
  }, [alias, dispatchUploadTrackInfo, handleFetchResult, handleModified]);

  const handleEditAssistant = React.useCallback<IPassiveMethods['editAssistant']>(
    (params) => {
      const fetchFunction = (assistantInfo: IModifyRoleResponse) =>
        updateRole({
          alias,
          name: assistantInfo.name,
          actor: assistantInfo.title,
          account: params.channelId,
        })
          .then((success) => {
            if (success) {
              const paramsWithAssistantInfo = Object.assign({}, params, assistantInfo);
              uploadEditAssistantTracker(paramsWithAssistantInfo);
            }
            return success;
          })
          .then(handleFetchResult);
      return handleModifyAssistant({ prefix: '助教', type: 'edit', fetchFunction, ...params });
    },
    [alias, handleFetchResult, handleModifyAssistant, uploadEditAssistantTracker],
  );

  const handleQuickEdit = React.useCallback<IPassiveMethods['quickEditAssistant']>(
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
            uploadEditAssistantTracker(params);
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
    [alias, handleModified, uploadEditAssistantTracker],
  );

  const handleDelete = React.useCallback<IPassiveMethods['deleteAssistant']>(
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
        columns={assistantListColumns({
          editAssistant: handleEditAssistant,
          quickEditAssistant: handleQuickEdit,
          deleteAssistant: handleDelete,
        })}
        datasets={datasets}
        emptyLabel={
          <AddAssistant
            loading={blockAdd}
            disabled={datasets.length >= 5}
            disabledContent="最多添加5名助教"
            onAdd={handleAddAssistant}
          />
        }
      />
      {datasets.length > 0 && (
        <div className="live-manage__roleManage-assistant empty-line">
          <AddAssistant
            loading={blockAdd}
            disabled={datasets.length >= 5}
            disabledContent="最多添加5名助教"
            onAdd={handleAddAssistant}
          />
        </div>
      )}
    </div>
  );
};

export default AssistantGrid;

const teacherRandomList = ['刘老师', '陈老师', '张老师', '王老师', '李老师'];

interface IEditParams {
  channelId: string;
  inviteCode: string;
  name: string;
  title: string;
  modifiedKey: 'title' | 'name' | 'both';
}
interface IPassiveMethods {
  editAssistant(params: IEditParams): void;
  quickEditAssistant(params: IEditParams): Promise<boolean>;
  deleteAssistant(params: Pick<IEditParams, 'channelId'>): void;
}
const assistantListColumns = (passiveMethods: IPassiveMethods): IGridColumn<IRoleType>[] => [
  {
    name: 'name',
    title: '助教名称',
    bodyRender: quickEditRender('name', {
      type: 'text',
      required: '请输入助教名称',
      validators: [Validators.maxLength(8, '最多可输入8个字')],
      onConfirm(value, rowData) {
        return passiveMethods.quickEditAssistant({
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
    title: '助教头衔',
    bodyRender: quickEditRender('actor', {
      type: 'text',
      required: '请输入助教头衔',
      validators: [Validators.maxLength(8, '最多可输入8个字')],
      onConfirm(value, rowData) {
        return passiveMethods.quickEditAssistant({
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
          key="edit"
          onClick={() =>
            passiveMethods.editAssistant({
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
          onClick={() => passiveMethods.deleteAssistant({ channelId: rowData.account })}
        >
          删除
        </a>,
      ];
      return <Operations items={ACTIONS} />;
    },
  },
];
