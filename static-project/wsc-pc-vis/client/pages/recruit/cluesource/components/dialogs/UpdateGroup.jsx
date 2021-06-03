
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import { Button } from 'zent';
import promiseCallback from 'fns/promise-callback';
import { Dialog } from '@youzan/ebiz-components';
import { updateSourceGroup } from '../../api/group';

const { createForm, FormInputField } = Form;
const { DialogBody, DialogFooter } = Dialog;
class UpdateGroup extends Component {
  state = {
    isSubmitting: false,
  };

  submit = (values) => {
    this.setState({ isSubmitting: true });
    const { groupId } = this.props.data || {};
    const command = { groupId, ...values };
    // 提交新建分组数据
    promiseCallback(
      updateSourceGroup({ command }),
      ['success', '修改分组成功', () => {
        this.props.dialogref.submit();
        this.handleClose();
      }],
    ).finally(() => this.setState({ isSubmitting: false }));
  };

  handleClose = this.props.dialogref.close;

  render() {
    const { isSubmitting } = this.state;
    const { name = '' } = this.props.data;
    return (
      <div className="edu-clue-source-dialog-small">
        <DialogBody>
          <Form
            horizontal
            className="update-group-form"
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
                if (value.length > 10) {
                  return Promise.reject('分组长度不能超过10个字');
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

export default createForm()(UpdateGroup);
