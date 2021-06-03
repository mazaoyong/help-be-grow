
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import { Button, Notify } from 'zent';

import { Dialog } from '@youzan/ebiz-components';
import { createSourceGroup } from '../../api/group';

const { createForm, FormInputField } = Form;
const { DialogBody,
  DialogFooter } = Dialog;
class AddGroup extends Component {
  state = {
    isSubmitting: false,
  };

  submit = command => {
    this.setState({ isSubmitting: true });
    // 提交新建分组数据
    createSourceGroup({ command })
      .then(() => {
        Notify.success('添加分组成功');
        this.props.dialogref.submit();
        this.props.dialogref.close();
      })
      .catch(err => {
        Notify.error(err);
      })
      .finally(() => {
        this.setState({ isSubmitting: false });
      });
  };

  handleClose = this.props.dialogref.close;

  render() {
    const { isSubmitting } = this.state;
    return (
      <div className="edu-clue-source-dialog-small">
        <DialogBody>
          <Form horizontal>
            <FormInputField
              required
              type="text"
              name="name"
              label="分组名称："
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

export default createForm()(AddGroup);
