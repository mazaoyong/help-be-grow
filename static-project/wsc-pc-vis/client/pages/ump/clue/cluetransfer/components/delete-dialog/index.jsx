import React, { useCallback } from 'react';
import { Dialog, Button } from 'zent';

import './styles.scss';

const { openDialog, closeDialog } = Dialog;

const dialogId = 'deleteDialog';

function DeleteDialog({ afterDelete }) {
  const handleSubmit = useCallback(() => {
    afterDelete().then(() => {
      closeDialog(dialogId);
    });
  }, [afterDelete]);

  const handleCancel = useCallback(() => {
    closeDialog(dialogId);
  }, []);

  return (
    <div>
      <div>确定删除流转原因吗？</div>
      <div className="edu-clue-transfer-delete-button">
        <Button onClick={handleCancel}>取消</Button>
        <Button type="primary" onClick={handleSubmit}>确定</Button>
      </div>
    </div>
  );
}

export default function openDeleteDialog({ afterDelete }) {
  openDialog({
    dialogId,
    title: '删除流转原因',
    children: <DeleteDialog afterDelete={afterDelete} />,
  });
}
