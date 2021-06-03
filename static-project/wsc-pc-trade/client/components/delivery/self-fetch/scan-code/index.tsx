import React, { PureComponent } from 'react';
import { Dialog } from 'zent';
import ScanCodeModalContent from './modal-content';
import './styles.scss';
const { openDialog } = Dialog;

/**
 * 扫一扫提货按钮
 */
class ScanCode extends PureComponent<{}, {}> {
  handleClick = () => {
    const id = '__scan-code-dialog__';
    openDialog({
      dialogId: id,
      title: '扫一扫提货',
      children: <ScanCodeModalContent />,
      className: 'scan-code-dialog',
    });
  };
  render() {
    return (
      <a className="scan-code" onClick={this.handleClick}>
        扫一扫提货
      </a>
    );
  }
}

export default ScanCode;
