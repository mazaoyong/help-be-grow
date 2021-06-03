
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import { Button } from 'zent';
import promiseCallback from 'fns/promise-callback';
import { Dialog } from '@youzan/ebiz-components';

const { createForm, FormInputField, FormNumberInputField } = Form;
const { DialogBody, DialogFooter } = Dialog;
class UpdateSource extends Component {
  state = {
    isSubmitting: false,
  };

  submit = values => {
    this.setState({ isSubmitting: true });
    const groupId = this.props.data && this.props.data.groupId;
    const sourceId = this.props.data && this.props.data.sourceId;
    const command = { groupId, sourceId, ...values };
    if (!command.serialNo) {
      command.serialNo = 0;
    }
    // 提交新建分组数据
    promiseCallback(
      this.props.data.updateSource({ command }),
      ['success', '更新来源成功', () => {
        this.props.dialogref.submit();
        this.handleClose();
      }],
    ).finally(() => this.setState({ isSubmitting: false }));
  };

  handleClose = this.props.dialogref.close;

  render() {
    const { name = '', serialNo = 0 } = this.props.data || {};
    const { isSubmitting } = this.state;
    return (
      <div className="edu-clue-source-dialog-small">
        <DialogBody>
          <Form horizontal className="update-source-form">
            <FormInputField
              required
              type="text"
              name="name"
              label="来源名称："
              value={name}
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
              label="序号："
              value={serialNo}
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
            loading={isSubmitting}
            onClick={this.props.handleSubmit(this.submit)}
          >保存</Button>
        </DialogFooter>
      </div>
    );
  }
}

export default createForm()(UpdateSource);
