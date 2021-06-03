
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import { Button } from 'zent';
import promiseCallback from 'fns/promise-callback';
import { Dialog } from '@youzan/ebiz-components';

const { createForm, FormInputField, FormNumberInputField } = Form;
const { DialogBody, DialogFooter } = Dialog;
class AddGroup extends Component {
  state = {
    isSubmitting: false,
  };

  submit = (values) => {
    const { currentGroup } = this.props.data;
    const _values = Object.assign({}, values, { groupId: currentGroup && currentGroup.groupId });
    if (!_values.serialNo) {
      _values.serialNo = 0;
    }
    this.setState({ isSubmitting: true });
    // 提交新建分组数据
    promiseCallback(
      this.props.data.createTag(_values),
      ['success', '添加标签成功', () => {
        this.props.dialogref.submit();
        this.handleClose();
      }],
    ).finally(() => this.setState({ isSubmitting: false }));
  };

  handleClose = this.props.dialogref.close;

  render() {
    const { isSubmitting } = this.state;
    return (
      <div className="edu-clue-tags-dialog-small">
        <DialogBody>
          <Form
            horizontal
            className="addgroup-form"
          >
            <FormInputField
              required
              type="text"
              name="name"
              label="标签名称："
              autocompelete="off"
              placeholder="请输入标签名称"
              asyncValidation={(values, value) => {
                if (!value) {
                  return Promise.reject('请输入标签名称');
                }
                if (value.length > 15) {
                  return Promise.reject('标签名称不能超过15个字');
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
            loading={isSubmitting}
            onClick={this.props.handleSubmit(this.submit)}
          >保存</Button>
        </DialogFooter>
      </div>
    );
  }
}

export default createForm()(AddGroup);
