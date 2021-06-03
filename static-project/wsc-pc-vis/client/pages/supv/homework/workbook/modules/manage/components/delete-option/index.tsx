import { React, FC, useState, useCallback, useMemo } from '@youzan/tany-react';
import { Dialog, Button, Notify, Input, BlockLoading } from 'zent';
import { Link as SamLink, Button as SamButton } from '@youzan/sam-components';

import { HOMEWORK_DIALOG_ID } from '../../constants';

import './styles.scss';

const { openDialog, closeDialog } = Dialog;

interface IDeleteOptionProps {
  onConfirm: () => Promise<any>;
  submitNum: number;
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
          Notify.success('作业删除成功');
        }
      })
      .catch(e => {
        Notify.error(e || '作业删除失败，请稍后重试');
      })
      .finally(() => {
        toggleLoading(false);
        closeDialog(HOMEWORK_DIALOG_ID);
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
        <Button onClick={() => closeDialog(HOMEWORK_DIALOG_ID)}>我再想想</Button>
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
  const { onConfirm, submitNum, disabled } = props;

  const [loading, toggleLoading] = useState(false);

  const confirmText = useMemo(() =>
    submitNum
      ? `当前已有${submitNum}位同学完成了这份作业，删除后学员已提交的作业也将被删除。`
      : '删除后作业将无法恢复，请谨慎操作。'
  , [submitNum]);

  const openDeleteDialog = useCallback(() => {
    toggleLoading(true);
    openDialog({
      dialogId: HOMEWORK_DIALOG_ID,
      className: 'homework-delete-dialog',
      title: '永久删除',
      maskClosable: false,
      children: (
        <DeleteDialogContent
          confirmText={confirmText}
          onConfirm={onConfirm}
        />
      ),
    });
    toggleLoading(false);
  }, [confirmText, onConfirm]);

  return disabled ? (
    <span className="disabled">删除</span>
  ) : (
    <BlockLoading loading={loading} icon="circle" iconSize={12}>
      <SamLink name="编辑" loading={loading} onClick={openDeleteDialog}>
        删除
      </SamLink>
    </BlockLoading>
  );
};

export default DeleteOption;
