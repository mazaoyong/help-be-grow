
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import { Dialog } from 'zent';

import PanelServiceSelect from '../../panel-service-select';
import CardService from '../../panel-service-select/CardService';
import { SERVICE_DIALOG_NAME } from '../../../constants';

const { getControlGroup } = Form;
const { openDialog, closeDialog } = Dialog;

class InputService extends Component {
  state = {
    visible: false,
    course: {},
  };

  onServiceChange = course => {
    const { onChange } = this.props;
    onChange(course);
  };

  openDialog = () => {
    const { value } = this.props;
    openDialog({
      maskClosable: false,
      dialogId: SERVICE_DIALOG_NAME,
      title: '选择服务内容',
      children: (
        <PanelServiceSelect
          value={value}
          onChange={this.onServiceChange}
          closeDialog={() => closeDialog(SERVICE_DIALOG_NAME)}
        />
      ),
    });
  };

  render() {
    const { value } = this.props;
    return (
      <div className="input-service">
        {value.alias && <CardService service={value} />}
        <div className="input-service__action" onClick={this.openDialog}>
          {value.alias ? '重新选择' : '添加服务内容'}
        </div>
      </div>
    );
  }
}

const InputServiceField = getControlGroup(InputService);

export default InputServiceField;
