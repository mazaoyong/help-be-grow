
import { Form } from '@zent/compat';
import behaviorVerify from '@youzan/behavior-verify/web/react';

/**
 * 验证码组件
 */
import React, { Component } from 'react';
import { Notify } from 'zent';
import PropTypes from 'prop-types';
import { CaptchaInput } from '@youzan/react-components';
import { sendBehaviorCaptchaJson } from '../../../../api';

import './style.scss';

class CaptchaField extends Component {
  static propTypes = {
    mobile: PropTypes.string,
    countryCode: PropTypes.string,
    handleChange: PropTypes.func,
  };

  catchaRequest = (cb) => {
    const { mobile } = this.props;
    behaviorVerify({
      bizType: 107,
      bizData: '店铺升级',
      onSuccess(ticket) {
        sendBehaviorCaptchaJson({ mobile, ticket })
          .then(ret => {
            Notify.success('发送成功');
            cb.success();
          })
          .catch(err => {
            Notify.error(err || '验证码发送失败');
            cb.fail();
          });
      },
      onFail(error) {
        Notify.error(error || '验证码发送失败');
        cb.fail();
      }
    });
  };

  render() {
    const { mobile, countryCode, handleChange } = this.props;
    return (
      <div className="captcha-input-field">
        <CaptchaInput
          mobile={mobile}
          contactCountryCode={countryCode}
          captchaTips={`验证短信将发送到你绑定的手机：${mobile}，请注意查收`}
          needGetToken={false}
          isCustomCaptchaRequest={true}
          customCaptchaRequest={this.catchaRequest}
          fetchCaptchaUrl=""
          biz="wsc_up_to_edu"
          onChange={handleChange}
        />
      </div>
    );
  }
}

export default Form.getControlGroup(CaptchaField);
