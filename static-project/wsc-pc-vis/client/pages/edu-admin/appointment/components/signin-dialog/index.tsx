import { Dialog, Notify } from 'zent';
import { openAbnormalCodeDialog as openSingleDialog, openSigninNoticeDialog } from '@ability-center/appointment/abnormal-util';
import { openBatchSigninDialog as openBatchCodeDialog } from '@ability-center/appointment/signin-util';

import './styles.scss';
import { singleSignIn, batchSignIn } from './api';
import { IOpenSignInParams, SignInType } from './types';

const operatorId = window._global && window._global.userId;

const { closeDialog } = Dialog;

/**
 * 打开签到弹窗
 *
 * @param { Object } params 参数
 * @param {SignInType} params.signInType 类型 0 签到 1 请假 2 未到
 * @param {number} params.consumeNum 消耗课时
 * @param {number[]} params.studentLessonNos 学号列表
 * @param {string} params.studentName 学员姓名
 * @param {string} params.startTime 日程开始时间
 * @param {Function} params.afterSignIn 签到
 */
export function openSignInDialog(params: IOpenSignInParams) {
  const { afterSignIn, signInType, studentLessonNos, kdtId, isbatch = false } = params;

  const _afterSignIn = (data: any = {}, isbatch: boolean) => {
    if (isbatch) {
      openBatchCodeDialog({
        type: signInType,
        data,
        onConfirm: afterSignIn,
      });
    } else {
      openSingleDialog({
        type: signInType,
        data,
        onConfirm: afterSignIn,
        kdtId,
      });
    }
  };

  const tomorrow = new Date().setHours(24, 0, 0, 0);
  const requestParams: any = formatParams(signInType, studentLessonNos, kdtId, isbatch);
  openSigninNoticeDialog({
    isFuture: params.startTime >= tomorrow,
    isbatch,
    type: signInType,
    onSigninConfirm: (id) => {
      handleConfirm(requestParams, id, isbatch, _afterSignIn);
    },
    data: requestParams,
  });
}

export function getTitle(type: SignInType) {
  switch (type) {
    case SignInType.Attendance:
      return '签到';
    case SignInType.Leave:
      return '标记请假';
    case SignInType.Truancy:
      return '标记未到';
    case SignInType.SignInAttendance:
      return '签到';
    case SignInType.SignInLeave:
      return '标记请假';
    case SignInType.SignInTruancy:
      return '标记未到';
    default:
      return '';
  }
}

function handleConfirm(params: any, id: string, isbatch: boolean, afterSignIn: Function) {
  let signIn: (body: any) => Promise<any>;
  if (isbatch) {
    signIn = batchSignIn;
  } else {
    signIn = singleSignIn;
  }
  signIn(params)
    .then(data => {
      closeDialog(id, { triggerOnClose: false });
      afterSignIn(data, isbatch);
    })
    .catch(err => {
      closeDialog(id, { triggerOnClose: false });
      Notify.error(err);
    });
}

function formatParams(signInType: SignInType, studentLessonNos: number[], kdtId: number, isbatch: boolean) {
  const params = { operatorId, signInType, kdtId: kdtId || _global.kdtId };
  return isbatch
    ? { ...params, ...{ studentLessonNos } } : { ...params, ...{ studentLessonNo: studentLessonNos[0] } };
};
