import React, { useState, useCallback } from 'react';
import { Button, Dialog, Notify, closeDialog } from 'zent';

import StudentLessonGrid from '@ability-center/common/student-lesson-grid';

import { StudentLesson } from '@ability-center/common/use-student-lesson-by-asset';

import { batchCancelV2 } from './api';

import './index.scss';

const { openDialog } = Dialog;

const dialogId = 'unlock-lesson-dialog';

const prefixcls = 'unlock-lesson-dialog';

export default function openUnlockDialog(props) {
  openDialog({
    dialogId,
    title: props.title,
    children: <UnlockDialog {...props} />,
  });
}

function UnlockDialog({ list, kdtId, successCbk }) {
  const [selectedRowData, setSelectedRowData] = useState<StudentLesson[]>([]);

  const toggleSelectedRows = useCallback((rowData) => {
    setSelectedRowData(rowData);
  }, []);

  const handleConfirm = useCallback(() => {
    batchCancelV2({
      studentLessonNos: selectedRowData.map(item => item.studentLessonNo),
    }).then(() => {
      successCbk(selectedRowData);
      Notify.success('移除成功');
      closeDialog(dialogId);
    }).catch(err => {
      Notify.error(err);
    });
  }, [list, selectedRowData]);

  return (
    <div>
      {list.map(item => {
        return (
          <div key={item.assetNo}>
            {item.tip}
            <StudentLessonGrid
              assetNo={item.assetNo}
              kdtId={kdtId}
              onSelectionChange={toggleSelectedRows}
            />
          </div>
        );
      })}
      <div className={`${prefixcls}-footer`}>
        <Button type="primary" disabled={!selectedRowData || selectedRowData.length === 0} onClick={handleConfirm}>确定移除</Button>
      </div>
    </div>
  );
}
