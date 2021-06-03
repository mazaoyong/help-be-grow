import { React, FC, useState, useCallback, useMemo } from '@youzan/tany-react';
import { Dialog, Button, Notify, Input, BlockLoading } from 'zent';
import { Link as SamLink, Button as SamButton } from '@youzan/sam-components';
import WorkbookService from 'domain/workbook-domain/services';

import { WORKBOOK_DELETE_DIALOG_ID } from '../../constants';
import './styles.scss';

const { openDialog, closeDialog } = Dialog;

const { onGetWorkbookSummary } = WorkbookService;

interface IDeleteOptionProps {
  workbookId: number;
  onConfirm: () => Promise<any>;
  hasAttendance: boolean;
  studentNum: number;
  disabled?: boolean;
}

interface IDeleteDialogContentProps {
  confirmText: string;
  onConfirm: () => Promise<any>;
}

const DeleteDialogContent: FC<IDeleteDialogContentProps> = (props) => {
  const { confirmText, onConfirm } = props;

  const [text, setText] = useState('');
  const [loading, toggleLoading] = useState(false);

  const isTextMatch = text.trim() === '确认删除';

  const handleDelete = useCallback(() => {
    toggleLoading(true);
    onConfirm()
      .then(res => {
        if (res) {
          Notify.success('作业本删除成功');
        }
      })
      .catch(e => {
        Notify.error(e || '作业本删除失败，请稍后重试');
      })
      .finally(() => {
        toggleLoading(false);
        closeDialog(WORKBOOK_DELETE_DIALOG_ID);
      });
  }, [onConfirm]);

  return (
    <div className="delete-dialog-container">
      <div className="body">
        <p className="confirm-text">{confirmText}</p>
        <Input
          className="user-input"
          onChange={e => setText(e.target.value)}
          placeholder="请输入“确认删除”"
        />
      </div>
      <div className="bottom-actions">
        <Button onClick={() => closeDialog(WORKBOOK_DELETE_DIALOG_ID)}>我再想想</Button>
        <SamButton
          name="编辑"
          type="primary"
          loading={loading}
          disabled={!isTextMatch}
          onClick={handleDelete}
        >
          删除
        </SamButton>
      </div>
    </div>
  );
};

const DeleteOption: FC<IDeleteOptionProps> = (props) => {
  const { workbookId, onConfirm, hasAttendance, studentNum, disabled } = props;

  const [loading, toggleLoading] = useState(false);
  const [realtimeHasAttendance, setRealtimeHasAttdance] = useState(hasAttendance ?? false);
  const [stuNum, setStuNum] = useState(studentNum ?? 0);

  const confirmText = useMemo(() =>
    realtimeHasAttendance && stuNum
      ? `当前已有${studentNum}位同学加入了这个作业本，删除后学员已提交的作业也将被删除。`
      : '删除后作业本将无法恢复，请谨慎操作。'
  , [realtimeHasAttendance, stuNum, studentNum]);

  const openDeleteDialog = useCallback(() => {
    openDialog({
      dialogId: WORKBOOK_DELETE_DIALOG_ID,
      className: 'workbook-delete-dialog',
      title: '永久删除',
      maskClosable: false,
      children: (
        <DeleteDialogContent
          confirmText={confirmText}
          onConfirm={onConfirm}
        />
      ),
    });
  }, [confirmText, onConfirm]);

  const handleDelete = useCallback(() => {
    toggleLoading(true);
    onGetWorkbookSummary({ exerciseBookId: workbookId })
      .then(res => {
        const { studentNum = 0, subNum = 0 } = res || {};
        studentNum && setRealtimeHasAttdance(!!studentNum);
        subNum && setStuNum(subNum);
      })
      .then(() => openDeleteDialog())
      .finally(() => {
        toggleLoading(false);
      });
  }, [openDeleteDialog, workbookId]);

  return disabled ? (
    <span className="disabled">删除</span>
  ) : (
    <BlockLoading loading={loading} icon="circle" iconSize={12}>
      <SamLink name="编辑" onClick={handleDelete}>
        删除
      </SamLink>
    </BlockLoading>
  );
};

export default DeleteOption;
