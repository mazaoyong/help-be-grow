import React, { FC, useMemo, ReactNode } from 'react';
import { Alert, BlockLoading } from 'zent';
import { TSigninDialogContentProps } from '../types';
import { signinTips } from './sigin-tips';
import get from 'lodash/get';

const DialogContent: FC<TSigninDialogContentProps> = (props) => {
  const { type, isbatch, isFuture = false, validateData, data, loading = false } = props;
  const Tips = useMemo<ReactNode>(() => {
    if (!validateData) {
      return '';
    }
    const currentTip = signinTips.find((item) => item.code === validateData.signInTipType);
    return currentTip ? currentTip.bodyRender({ ...validateData, isbatch, type }) : '';
  }, [validateData, isbatch]);

  const studentName = useMemo<string>(() => {
    if (!validateData) {
      return '';
    }
    const name = !isbatch ? `"${get(validateData, 'studentName', '')}"` : `${get(data, 'studentLessonNos.length', 0)}名学员`;
    return name;
  }, [validateData, isbatch]);

  return <div>
    <BlockLoading loading={loading}>
      {isFuture && <Alert type="warning" className='signin_notice_alert'>上课日期未到，请谨慎操作</Alert>}
      {studentName && <p className='signin_notice_desc'>确定{studentName}{type === 2 ? '没来上课' : type === 1 ? '已请假' : '已来上课'}？</p> }
      { Tips }
    </BlockLoading>
  </div>;
};

export default DialogContent;
