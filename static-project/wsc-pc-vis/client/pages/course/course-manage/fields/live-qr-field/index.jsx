
import { Form } from '@zent/compat';
import React, { PureComponent, Component } from 'react';
import { Tag } from 'zent';
import './index.scss';
import ChooseLiveQrcode from '@youzan/react-components/es/components/choose-dialog/dialogs/live-qrcode';
import '@youzan/react-components/es/components/choose-dialog/style';

const { getControlGroup } = Form;

class LiveQRField extends (PureComponent || Component) {
  onDialogHandler = () => {
    let _this = this;
    ChooseLiveQrcode({
      config: window._global,
      multiple: false,
      onChoose(data) {
        _this.props.onChange({
          codeId: data[0].id,
          codeName: data[0].name,
          codePicture: data[0].url,
          codeKdtId: data[0].sourceKdtId,
        });
      },
    });
  };

  onClose = () => {
    this.props.onChange({
      codeId: null,
      codeName: '',
      codePicture: '',
      codeKdtId: null,
    });
  };

  attachQRLayout = () => {
    const { value } = this.props;
    return (
      <Tag theme="grey" outline closable onClose={this.onClose}>
        {value.codeName}
      </Tag>
    );
  };

  getQRListLayout = () => {
    return (
      <a href="javascript:;" onClick={this.onDialogHandler.bind(this)}>
        选择活码
      </a>
    );
  };

  render() {
    const { value } = this.props;
    return (
      <div className="liveqrwrap">
        {value.codeName && value.codeId ? this.attachQRLayout() : this.getQRListLayout()}
      </div>
    );
  }
}

export default getControlGroup(LiveQRField);
