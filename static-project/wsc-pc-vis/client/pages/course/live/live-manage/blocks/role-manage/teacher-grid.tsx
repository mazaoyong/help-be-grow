import React from 'react';
import { Grid, IGridColumn, Notify, Validators } from 'zent';
import { Operations } from '@youzan/react-components';
import { EasyList } from '@youzan/ebiz-components';

import { uploadTrackerInfo } from '../record-manage';
import {
  modifyRoleDialog,
  IModifyRoleProps,
  IModifyRoleResponse,
} from '../../components/modify-teacher-assistant-guest';
import { ITeacherInfoType, updateTeacher } from '../../../api/live-manage';

export interface IRoleManageTeacherGridProps {
  alias: string;
  loading: boolean;
  datasets: ITeacherInfoType[];
  handleModified(): void;
  /** 触发埋点方法 */
  dispatchUploadTrackInfo: typeof uploadTrackerInfo;
}

const { quickEditRender } = EasyList;

const TeacherGrid: React.FC<IRoleManageTeacherGridProps> = (props) => {
  const { datasets, loading, handleModified, alias, dispatchUploadTrackInfo } = props;

  const handleModifyAssistant = React.useCallback((params: IModifyRoleProps) => {
    return modifyRoleDialog(params)
      .afterClosed()
      .catch((err) => {
        err && Notify.error(err);
        return Promise.resolve();
      });
  }, []);

  const uploadEditTeacherTracker = React.useCallback<IPassiveMethods['editTeacher']>(
    (params) => {
      const { modifiedKey, name, title } = params;
      if (modifiedKey === 'name' || modifiedKey === 'both') {
        dispatchUploadTrackInfo({
          eventName: '修改名称',
          eventSign: 'modifyName',
          otherParams: { role: 'teacher', name },
        });
      }
      if (modifiedKey === 'title' || modifiedKey === 'both') {
        dispatchUploadTrackInfo({
          eventName: '修改头衔',
          eventSign: 'modifyTitle',
          otherParams: { role: 'teacher', title },
        });
      }
    },
    [dispatchUploadTrackInfo],
  );

  const handleFetchResult = React.useCallback(
    (success) => {
      if (success) {
        handleModified();
        Notify.success('编辑成功');
        return Promise.resolve();
      } else {
        Notify.error('保存失败，请重试');
        return Promise.reject();
      }
    },
    [handleModified],
  );

  const handleEditTeacher = React.useCallback<IPassiveMethods['editTeacher']>(
    (params) => {
      const fetchFunction = (teacherInfo: IModifyRoleResponse) =>
        updateTeacher({
          alias,
          name: teacherInfo.name,
          actor: teacherInfo.title,
        })
          .then((success) => {
            if (success) {
              const paramsWithTeacherInfo = Object.assign({}, params, teacherInfo);
              uploadEditTeacherTracker(paramsWithTeacherInfo);
            }
            return success;
          })
          .then(handleFetchResult);
      return handleModifyAssistant({ prefix: '讲师', type: 'edit', fetchFunction, ...params });
    },
    [alias, handleFetchResult, handleModifyAssistant, uploadEditTeacherTracker],
  );

  const handleQuickEdit = React.useCallback<IPassiveMethods['quickEditTeacher']>(
    (params) =>
      updateTeacher({
        alias,
        name: params.name,
        actor: params.title,
      })
        .then((success) => {
          if (success) {
            handleModified();
            uploadEditTeacherTracker(params);
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
    [alias, handleModified, uploadEditTeacherTracker],
  );

  return (
    <div className="live-manage__roleManage-teacherGrid">
      <Grid
        loading={loading}
        rowKey="channelId"
        columns={teacherListColumns({
          editTeacher: handleEditTeacher,
          quickEditTeacher: handleQuickEdit,
        })}
        datasets={datasets}
      />
    </div>
  );
};

export default TeacherGrid;

interface IEditParams {
  channelId: string;
  inviteCode: string;
  name: string;
  title: string;
  modifiedKey: 'title' | 'name' | 'both';
}
interface IPassiveMethods {
  editTeacher(params: IEditParams): void;
  quickEditTeacher(params: IEditParams): Promise<boolean>;
}
const teacherListColumns = (passiveMethods: IPassiveMethods): IGridColumn<ITeacherInfoType>[] => [
  {
    name: 'teacherName',
    title: '讲师名称',
    bodyRender: quickEditRender('teacherName', {
      type: 'text',
      required: '请输入讲师名称',
      validators: [Validators.maxLength(8, '最多可输入8个字')],
      onConfirm(value, rowData) {
        return passiveMethods.quickEditTeacher({
          name: value,
          title: rowData.actor,
          channelId: rowData.channelId,
          inviteCode: rowData.channelPassword,
          modifiedKey: 'name',
        });
      },
    }),
  },
  {
    name: 'actor',
    title: '讲师头衔',
    bodyRender: quickEditRender('actor', {
      type: 'text',
      required: '请输入讲师头衔',
      validators: [Validators.maxLength(8, '最多可输入8个字')],
      onConfirm(value, rowData) {
        return passiveMethods.quickEditTeacher({
          name: rowData.teacherName,
          title: value,
          channelId: rowData.channelId,
          inviteCode: rowData.channelPassword,
          modifiedKey: 'title',
        });
      },
    }),
  },
  {
    name: 'channelId',
    title: '频道号',
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
          target="__blank"
          onClick={() =>
            passiveMethods.editTeacher({
              name: rowData.teacherName,
              title: rowData.actor,
              channelId: rowData.channelId,
              inviteCode: rowData.channelPassword,
              modifiedKey: 'both',
            })
          }
        >
          编辑
        </a>,
      ];
      return <Operations items={ACTIONS} />;
    },
  },
];
