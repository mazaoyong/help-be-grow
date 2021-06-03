import React, { useCallback, useState } from 'react';
import { Dialog, Notify } from 'zent';
import { openModifyStudent } from '@ability-center/student/modify-student';

import { dialogIdMap, IMPORT_TYPE } from '../../constants';
import UpsertStudent from '../upsert-student';
import { saveRow } from '../../api/confirm';
import {
  formatStudentPatchValue,
  formatSubmitOptions,
  isErrorItem,
} from '../../utils/format-student-patch-value';
import commonStyles from '../../styles/style.m.scss';

const { openDialog, closeDialog } = Dialog;

export default function useOpenFormDialog({
  importType,
  branchKdtId,
  taskId,
  getPageValidateSummary,
  studentProfile,
  areaOptions,
}) {
  const [upsertDialogOpen, setUpsertDialogOpen] = useState<boolean>(false);

  const handleStudentUpsert = useCallback(() => {
    if (!taskId) {
      Notify.error('未选择导入任务');
      return;
    }
    getPageValidateSummary({ taskId });
  }, [taskId, getPageValidateSummary]);

  const openCourse = useCallback(
    (type: '添加' | '修改', taskId: number, rowIndex: number, _item: any) => {
      if (!taskId) {
        Notify.error('未选择导入任务');
        return;
      }

      if (upsertDialogOpen) {
        return;
      }
      setUpsertDialogOpen(true);
      const dialogId = dialogIdMap.upsertStudent;
      const onSave = () => {
        handleStudentUpsert();
        closeDialog(dialogId);
      };
      const onClose = () => {
        closeDialog(dialogId);
      };
      const openUpsertStudentDialog = () => {
        openDialog({
          dialogId,
          title: `${type}数据`,
          className: 'upsert-student-dialog-wrapper',
          children: (
            <UpsertStudent
              importType={importType}
              onSave={onSave}
              onClose={onClose}
              rowId={rowIndex}
              taskId={taskId}
              branchKdtId={branchKdtId}
            />
          ),
          maskClosable: false,
          onClose() {
            setUpsertDialogOpen(false);
          },
        });
      };
      // 打开dialog
      openUpsertStudentDialog();
    },
    [handleStudentUpsert, importType, upsertDialogOpen, branchKdtId],
  );

  const openStudentInfo = useCallback(
    (type: '添加' | '修改', taskId: number, rowIndex: number, item: any) => {
      if (!taskId) {
        Notify.error('未选择导入任务');
        return;
      }
      if (upsertDialogOpen) {
        return;
      }
      setUpsertDialogOpen(true);
      let updateInfo;
      if (type === '修改') {
        updateInfo = { studentNo: 1 };
      }
      const dialogId = dialogIdMap.upsertStudent;
      openModifyStudent({
        dialogId,
        title: type,
        data: {
          ...updateInfo,
          applicableScene: 0,
          validateSignal: isErrorItem(item),
          fetchProfileApi: async () => studentProfile,
          fetchStudentInfoApi: formatStudentPatchValue({ item, areaOptions, studentProfile }),
          showInfoTip: false,
          formatSubmitOptions,
        },
        className: commonStyles.studentDialog,
      })
        .afterClosed()
        .then(values => {
          const fieldValues = values.map(({ attributeKey, value }) => {
            return {
              name: attributeKey,
              value,
            };
          });

          return saveRow({
            rowFields: fieldValues,
            taskId,
            rowId: rowIndex,
          })
            .then(res => {
              if (res === true) {
                return new Promise(resolve =>
                  setTimeout(() => {
                    Notify.success('保存成功');
                    handleStudentUpsert();
                    resolve(true);
                  }, 1000),
                ); // 新建、修改的保存等待后端校验数据1秒
              }
              throw res;
            })
            .catch(e => {
              Notify.error(e || '网络错误，请稍后重试');
            });
        })
        .catch(() => {
          // do nothing
        })
        .finally(() => {
          setUpsertDialogOpen(false);
        });
    },
    [upsertDialogOpen, areaOptions, studentProfile, handleStudentUpsert],
  );

  const open = importType === IMPORT_TYPE.byStudentInfo ? openStudentInfo : openCourse;

  return { open, upsertDialogOpen, setUpsertDialogOpen };
}
