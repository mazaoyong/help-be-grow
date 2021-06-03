import React, { FC, useState } from 'react';
import { Dialog, Button } from 'zent';
import { INoticeDialogProps } from './types';
import YZLocalStorage from 'zan-utils/local_storage';

const NOTICE_URL = 'https://b.yzcdn.cn/public_files/2020/03/12/signin-notice.png';

const NoticeDialog: FC<INoticeDialogProps> = props => {
  const { isFirstVisit } = props;
  const [visible, setVisible] = useState<boolean>(isFirstVisit);
  return (
    <Dialog
      visible={visible}
      closeBtn={false}
      maskClosable={false}
    >
      <div className="notice__dialog__wrapper">
        <div className='notice__dialog__imagewrapper' >
          <img src={NOTICE_URL} />
        </div>
        <div className='notice__dialog__footer'>
          <Button type='primary' onClick={() => {
            YZLocalStorage.setItem(`student_first-visit_${_global.kdtId}`, 'false');
            setVisible(false);
          }}>知道了</Button>
        </div>
      </div>
      {/* <div className='notice__dialog__description'>
        <p>原课时=可用课时，已更新显示为“剩余课时”</p>
        <p>剩余课时=可用课时+预约日程冻结的课时</p>
      </div>
      <div className='notice__dialog__text'>
        不影响学员的真实课时，仅显示逻辑的变动
      </div> */}
    </Dialog>
  );
};

export default NoticeDialog;
