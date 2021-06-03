
import { Form } from '@zent/compat';
import React, { PureComponent } from 'react';
import { Button, Dialog } from 'zent';

import './styles.scss';
import { findPagePowerStaffs } from '../../api';

const { createForm, FormSelectField } = Form;
const { openDialog, closeDialog } = Dialog;
const dialogId = 'assign-dialog';

class AssignForm extends PureComponent {
  state = {
    options: [],
  };

  componentDidMount() {
    if (!window._components) {
      window._components = {};
    }
    if (window._components.options) {
      this.setState({ options: window._components.options });
    } else {
      findPagePowerStaffs().then(data => {
        const options = data.map(item => ({
          value: item.adminId,
          text: item.name,
        }));
        this.setState({ options });
        window._components.options = options;
      });
    }
  }
  render() {
    return (
      <Form className="assign-dialog" horizontal>
        <FormSelectField
          name="type"
          label="跟进人:"
          data={this.state.options}
          filter={(item, keyword) => item.text.indexOf(keyword) > -1}
          required
          validations={{ required: true }}
          validationErrors={{ required: '请选择类型' }}
        />
        <div className="assign-dialog-button-group">
          <Button type="primary" outline onClick={this.handleCancel}>取消</Button>
          <Button type="primary" htmlType="submit">保存</Button>
        </div>
      </Form>
    );
  }

  handleCancel = () => {
    closeDialog({ dialogId });
  }
}

export default function openAssignDialog() {
  const WrappedForm = createForm({ scrollToError: true })(AssignForm);
  openDialog({
    dialogId,
    title: '分配线索',
    children: <WrappedForm />,
  });
}
