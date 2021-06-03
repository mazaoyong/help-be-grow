import React, { Component } from 'react';
import { Dialog, Notify, BlockLoading } from 'zent';
import { getLiveInviteAdminCode } from '../../../live/api';
import './style.scss';

const { openDialog } = Dialog;

class TeacherCode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      qrcode: props.qrcode || '',
    };
  }
  componentDidMount() {
    const { qrcode, params } = this.props;
    if (!qrcode) {
      this.getQrcode(params)
        .then(data => {
          this.setState({
            qrcode: data,
          });
        })
        .catch(msg => {
          Notify.error(msg || '获取二维码失败');
        });
    }
  }
  getQrcode(params) {
    return getLiveInviteAdminCode(params);
  }
  render() {
    const { qrcode } = this.state;
    if (!qrcode) {
      return <BlockLoading loading />;
    }
    return (
      <div className="teacher-dialog">
        <img className="teacher-dialog__qrcode" alt="" src={qrcode} />
        <p className="teacher-dialog__tip">微信扫描二维码</p>
        <p className="teacher-dialog__tip">成为直播间管理员</p>
      </div>
    );
  }
}

export default function showTeacherDialog(qrcode) {
  let props = {
    qrcode,
  };
  if (typeof qrcode !== 'string') {
    props = {
      params: qrcode,
    };
  }
  openDialog({
    dialogId: 'teacher',
    title: '直播创建成功，请设置直播间管理员',
    children: <TeacherCode {...props} />,
  });
}
