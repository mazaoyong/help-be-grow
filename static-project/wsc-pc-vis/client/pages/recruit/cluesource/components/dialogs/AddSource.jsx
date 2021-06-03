
import { Form } from '@zent/compat';
import React, { PureComponent } from 'react';
import { Button, Notify } from 'zent';
import { Dialog } from '@youzan/ebiz-components';

import { createSource } from '../../api/list';

const { createForm, FormInputField, FormNumberInputField } = Form;
const { DialogBody, DialogFooter } = Dialog;
class AddSource extends PureComponent {
  state = {
    loading: false,
  };

  submit = command => {
    this.setState({ loading: true });
    const { groupId } = this.props.data || {};
    if (!command.serialNo) {
      command.serialNo = 0;
    }
    // 提交新建分组数据
    createSource({
      command: Object.assign({}, command, { groupId }),
    })
      .then(() => {
        Notify.success('添加来源成功');
        this.props.dialogref.submit();
        this.props.dialogref.close();
      })
      .catch(err => {
        Notify.error(err);
      })
      .finally(() => this.setState({ loading: false }));
  };

  handleClose = this.props.dialogref.close;

  render() {
    const { loading } = this.state;
    return (
      <div className="edu-clue-source-dialog-small">
        <DialogBody>
          <Form
            horizontal
            className="AddSource-form"
          >
            <FormInputField
              required
              type="text"
              name="name"
              label="来源名称："
              autocompelete="off"
              placeholder="请输入来源名称"
              asyncValidation={(values, value) => {
                if (!value) {
                  return Promise.reject('请输入来源名称');
                }
                if (value.length > 10) {
                  return Promise.reject('来源长度不能超过10个字');
                }
                return Promise.resolve();
              }}
            />
            <FormNumberInputField
              min={0}
              required
              value={0}
              label="序号："
              name="serialNo"
              asyncValidation={(values, value) => {
                if (+value > 99999999) {
                  return Promise.reject('序号不能超过最大限制99999999');
                }
                return Promise.resolve();
              }}
            />
          </Form>
        </DialogBody>
        <DialogFooter>
          <Button onClick={this.handleClose}>取消</Button>
          <Button
            type="primary"
            loading={loading}
            onClick={this.props.handleSubmit(this.submit)}
          >保存</Button>
        </DialogFooter>
      </div>
    );
  }
}

export default createForm()(AddSource);
