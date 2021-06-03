
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import { Radio, Button } from 'zent';
import promiseCallback from 'fns/promise-callback';
import { Dialog } from '@youzan/ebiz-components';

const { createForm, FormInputField, FormRadioGroupField } = Form;
const { DialogBody, DialogFooter } = Dialog;
class ModifyGroup extends Component {
  state = {
    isSubmitting: false,
  };

  submit = (values) => {
    this.setState({ isSubmitting: true });
    const groupId = this.props.data && this.props.data.groupId;
    const payload = { groupId };
    // 提交新建分组数据
    promiseCallback(
      this.props.data.updateTagGroup(Object.assign(payload, values)),
      ['success', '修改分组成功', () => {
        this.props.dialogref.submit();
        this.handleClose();
      }],
    ).finally(() => this.setState({ isSubmitting: false }));
  };

  handleClose = this.props.dialogref.close;

  render() {
    const { isSubmitting } = this.state;
    const { name = '', multiSelect = 0 } = this.props.data;
    return (
      <>
        <DialogBody>
          <Form
            horizontal
            className="modifygroup-form"
          >
            <FormInputField
              required
              type="text"
              name="name"
              label="分组名称："
              value={name}
              autocompelete="off"
              asyncValidation={(values, value) => {
                if (!value) {
                  return Promise.reject('请输入分组名称');
                }
                if (value.length > 15) {
                  return Promise.reject('分组名称不能超过15个字');
                }
                return Promise.resolve();
              }}
            />
            <FormRadioGroupField
              required
              value={multiSelect}
              name="multiSelect"
              label="本组标签是否可多选："
            >
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </FormRadioGroupField>
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
      </>
    );
  }
}

export default createForm()(ModifyGroup);
