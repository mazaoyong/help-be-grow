
import { Form } from '@zent/compat';
// 开启请好友看
import React, { Component } from 'react';
import { Button } from 'zent';
import Field from './Field';
import './style.scss';

class InvietFriendForm extends Component {
  submit = values => {
    const { submitForm, closeClick } = this.props;
    submitForm(values);
    closeClick();
  };

  render() {
    const { handleSubmit } = this.props;
    return (
      <Form horizontal onSubmit={handleSubmit(this.submit)} className="invite-friend-form">
        <p>开启后，订购用户可分享内容给好友免费看，吸引好友购买专栏</p>
        <Field />
        <div className="zent-dialog-r-footer">
          <Button type="primary" htmlType="submit">
            确定
          </Button>
          <Button type="primary" outline onClick={this.props.closeClick}>
            关闭
          </Button>
        </div>
      </Form>
    );
  }
}

export default InvietFriendForm;
