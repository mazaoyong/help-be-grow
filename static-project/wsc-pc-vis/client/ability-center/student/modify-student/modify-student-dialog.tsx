import React, { FC, useCallback, useState } from 'react';
import { Dialog } from '@youzan/ebiz-components';
import { Button } from 'zent';
import { IDialogChildrenProps, IopenDialogOptions } from '@youzan/ebiz-components/es/types/dialog';
import InfoTip from '@ability-center/student/info-tip';

import ModifyStudentForm, {
  getAge,
  formatSubmitValues,
} from '../../../pages/student/student-detail/components/modify-student';
import { IPartialCustomProfile } from './types';
import styles from './styles.m.scss';

const { openDialog, DialogBody, DialogFooter } = Dialog;

const ModifyStudentDialogContent: FC<
IDialogChildrenProps<Record<string, any>[], IPartialCustomProfile>
> = props => {
  const { data, dialogref } = props;
  const passiveModifyStudentProps = data;
  const [refreshSignal, setRefreshSignal] = useState(0);
  const [submitSignal, setSubmitSignal] = useState(0);
  const [submitting, setSubmitStatus] = useState(false);
  const { showInfoTip = true } = data || {};

  const handleSubmit = useCallback(
    (values: Record<string, any>[]) => {
      setSubmitStatus(true);
      dialogref.submit(values);
    },
    [dialogref],
  );

  return (
    <div className={styles.modifyStudent}>
      <DialogBody>
        <ModifyStudentForm
          {...passiveModifyStudentProps}
          refreshSignal={refreshSignal}
          submitSignal={submitSignal}
          onSubmit={handleSubmit}
        />
        {showInfoTip && (
          <InfoTip
            onRefresh={() => {
              setRefreshSignal(refreshSignal + 1);
            }}
          />
        )}
      </DialogBody>
      <DialogFooter>
        <Button type="primary" outline onClick={dialogref.close}>
          取消
        </Button>
        <Button
          type="primary"
          loading={submitting}
          onClick={() => setSubmitSignal(submitSignal + 1)}
        >
          确定
        </Button>
      </DialogFooter>
    </div>
  );
};

const openModifyStudent = (dialogOpts: IopenDialogOptions<IPartialCustomProfile>) =>
  openDialog<Record<string, any>[], IPartialCustomProfile>(ModifyStudentDialogContent, dialogOpts);

export { ModifyStudentForm, openModifyStudent, getAge, formatSubmitValues };
