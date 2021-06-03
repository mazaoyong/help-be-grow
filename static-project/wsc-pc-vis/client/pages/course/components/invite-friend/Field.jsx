
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import AfterTextInputField from './AfterInputText';
import './field.scss';

const { Field } = Form;

class InviteFriendField extends Component {
  render() {
    return (
      <div className="invite-friend-wrap">
        <Field
          name="every_content_friend_count"
          value={this.props.every_content_friend_count}
          label="单篇内容可支持"
          afterText="位好友领取"
          width="40px"
          maxLength="3"
          component={AfterTextInputField}
          helpDesc="若可领取好友数为10，则订购用户分享某期内容后，仅前10名好友领取后可以免费看。"
          validations={{
            isPositiveInt(values, value) {
              return /^\d+$/.test(value) && value > 0;
            },
            required: true,
          }}
          validationErrors={{
            isPositiveInt: '请输入大于0的整数',
            required: '请填写单篇支持领取好友人数',
          }}
        />
        <Field
          name="every_friend_content_count"
          value={this.props.every_friend_content_count}
          label="同一好友可领取"
          afterText="篇内容"
          width="40px"
          maxLength="3"
          component={AfterTextInputField}
          helpDesc="若可领取内容数为6，则订购用户最多可将其中6期内容分享给同一个好友。"
          validations={{
            isPositiveInt(values, value) {
              return /^\d+$/.test(value) && value > 0;
            },
            required: true,
          }}
          validationErrors={{
            isPositiveInt: '请输入大于0的整数',
            required: '请填写同一好友可领取篇数',
          }}
        />
      </div>
    );
  }
}

export default InviteFriendField;
