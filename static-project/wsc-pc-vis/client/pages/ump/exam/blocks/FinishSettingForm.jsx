
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import { Radio } from 'zent';
import get from 'lodash/get';
import { ShowWrapper, isInStoreCondition } from 'fns/chain';
import { chainSupportHqAndSingle } from '../chain';

import WrapFooter from '../components/wrap-footer';

const { createForm, FormRadioGroupField } = Form;
// const ChainForm = chainDisableForm(chainSupportHqAndSingle, Form);

const isMpAccount = get(window._global, 'mpAccount.serviceType') === 2;
class TitleSettingForm extends Component {
  state = {
    loading: /edit/.test(this.props.route.path),
  };

  submit = (values, value) => {
    this.props.onSubmit(values);
  };

  render() {
    const { handleSubmit, formData, onFieldChange, location } = this.props;

    return (
      <>
        <Form horizontal onSubmit={handleSubmit(this.submit)}>
          {/* 二维码分享方式 */}
          <FormRadioGroupField
            required
            label="二维码分享方式："
            name="shareType"
            onChange={ev => {
              onFieldChange('shareType', {
                data: ev.target.value,
              });
            }}
            disabled={!chainSupportHqAndSingle}
            value={+formData.shareType}
          >
            <Radio className="exam-finish-wrap__share-radio" value={2}>
              扫码直接进入测试页
            </Radio>
            <ShowWrapper
              isInStoreCondition={isInStoreCondition({
                supportSingleStore: true,
                supportRetailSingleShop: true,
              })}>
              <Radio disabled={!isMpAccount} value={1}>
                  扫码先关注公众号，获取测试活动入口
              </Radio>
            </ShowWrapper>
          </FormRadioGroupField>
          <WrapFooter step={+location.query.step} id={+location.query.id} isHtmlType />
        </Form>
      </>
    );
  }
}

export default createForm({ scrollToError: true })(TitleSettingForm);
