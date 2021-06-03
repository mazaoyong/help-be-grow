import React from 'react';
import { Dialog } from '@youzan/ebiz-components';
import { Button, Form, FormInputField, FormStrategy } from 'zent';
import { IDialogChildrenProps } from '@youzan/ebiz-components/es/types/dialog';
import { CopyWrapper } from '../copy-wrapper';

import './style.scss';

const { openDialog, DialogBody, DialogFooter } = Dialog;

export interface IInviteGuestProps {
  name: string;
  inviteCode: string;
  url: string;
}

const InviteGuestDialog: React.FC<IDialogChildrenProps<void, IInviteGuestProps>> = (props) => {
  const form = Form.useForm(FormStrategy.View);
  const { name, inviteCode, url } = props.data;
  const inviteText = `${name}，您好！访问登录链接，输入您名字及登录密码，即可参与直播。\n您的登录密码为：${inviteCode}\n您的登录链接为：${url}`;

  const handleConfirm = () => {
    props.dialogref.close();
  };

  return (
    <>
      <DialogBody>
        <Form layout="horizontal" form={form}>
          <FormInputField
            defaultValue={url}
            name="guestLink"
            label="嘉宾链接："
            after={
              <CopyWrapper text={inviteText}>
                <span style={{ color: '#266ad5', fontSize: '14px' }}>复制邀请信息</span>
              </CopyWrapper>
            }
            props={{
              disabled: true
            }}
          />
        </Form>
      </DialogBody>
      <DialogFooter>
        <Button onClick={handleConfirm}>取消</Button>
        <Button type="primary" onClick={handleConfirm}>
          确定
        </Button>
      </DialogFooter>
    </>
  );
};

export const invitGuestDialog = (params: IInviteGuestProps) => openDialog(InviteGuestDialog, {
  title: '邀请嘉宾',
  data: params,
  maskClosable: false,
});
