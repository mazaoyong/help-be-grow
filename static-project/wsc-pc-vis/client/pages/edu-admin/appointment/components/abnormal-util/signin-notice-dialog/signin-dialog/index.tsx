import React, { FC, useEffect, useState } from 'react';
import { Dialog, Notify } from 'zent';
import { ISigninDialogProps, TSigninValidateData } from '../types';
import DialogContent from './dialog-content';
import DialogFooter from './dialog-footer';
import { getBatchSignInTip, getSignInTip } from '../api';
import EventEmitter from 'wolfy87-eventemitter';
import { getTitle } from './sigin-tips';

const { openDialog, closeDialog } = Dialog;

const SigninNoticeDialog: FC<ISigninDialogProps & { event: any }> = (props) => {
  const { isbatch, data = {}, event } = props;
  const [validateData, setValidateData] = useState<TSigninValidateData | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    event.on('onConfirmClick', () => {
      setLoading(true);
    });

    return () => {
      event.off('onConfirmClick');
    };
  });

  useEffect(() => {
    const request = isbatch ? getBatchSignInTip : getSignInTip;
    if (loading) {
      request({ query: data }).then(resp => {
        setValidateData(resp);
        setLoading(false);
      }).catch(error => {
        Notify.error(error);
        setLoading(false);
      });
    }
  }, []);

  return <DialogContent {...props} loading={loading} validateData={validateData} />;
};

const openSigninNoticeDialog: (props: ISigninDialogProps) => void = (props) => {
  const { type, isbatch, onSigninConfirm } = props;
  const event = new EventEmitter();
  let dialogTitle: string = getTitle(type);

  openDialog({
    dialogId: 'signin__dialog',
    title: dialogTitle,
    footer: <DialogFooter event={event} type={type} isbatch={isbatch} onCancel={() => closeDialog('signin__dialog')} onConfirm={() => onSigninConfirm('signin__dialog')}/>,
    children: <SigninNoticeDialog {...props} event={event} />,
    onClose: () => {
      closeDialog('signin__dialog');
    },
  });
};

export default openSigninNoticeDialog;
