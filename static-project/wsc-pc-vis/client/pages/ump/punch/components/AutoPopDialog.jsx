import React, { Component } from 'react';
import { Dialog, Button } from 'zent';

const POP_NAME = [
  '',
  '日签',
  '长图',
];

export default class AutoPopDialog extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    return { ...nextProps };
  }

  state = {
    visible: false,
    popType: 0,
  };

  render() {
    const { popType = '' } = this.state;
    const { onClose, onConfirm } = this.props;
    const targetPopName = POP_NAME[popType === 1 ? 2 : 1];
    const currentPopName = POP_NAME[popType];
    const title = `已设置自动弹出${currentPopName}`;
    const desc = `已开启自动弹出${currentPopName}，若开启自动弹出${targetPopName}，则${currentPopName}将不做自动弹出，确定开启吗？`;

    return (
      <Dialog
        visible={this.state.visible}
        onClose={onClose}
        title={title}
        footer={
          <div>
            <Button type="primary" onClick={onConfirm}>
              继续开启
            </Button>
            <Button onClick={onClose}>关闭</Button>
          </div>
        }
      >
        <p>{desc}</p>
      </Dialog>
    );
  }
}
