import { React } from '@youzan/tany-react';
import { Button } from 'zent';

import Record from 'pages/supv/homework/components/audio-uploader/record';
import ConfirmButton from '../../components/confirm-button';
import { CorrectModelType } from '../../blocks/correct-field';

const CorrectBottomActions = (model: CorrectModelType, submit?: () => void) => {
  const {
    reviewNextAssignmentId,
    isAuthorized,
    handleLeave,
    submitLoading,
    workbookKdtId,
    studentName,
    recordRef,
  } = model;

  return (
    <>
      <Record
        ref={recordRef}
        anchor="audio"
        countTime={300}
        isAscendCount={true}
        formatName={(timestamp) => {
          return `作业点评-${studentName || ''}-${timestamp}`;
        }}
      />
      <div className="bottom-actions">
        <Button onClick={() => handleLeave()}>取消</Button>
        <ConfirmButton
          isAuthorized={isAuthorized}
          onClick={submit}
          rigName="编辑"
          loading={submitLoading}
          disabled={workbookKdtId !== _global.kdtId}
        >
          {`提交${reviewNextAssignmentId ? '并批阅下一个' : '批阅'}`}
        </ConfirmButton>
      </div>
    </>
  );
};

export default CorrectBottomActions;
