
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import { Radio, Button, BlockLoading, Notify, Switch } from 'zent';
import AutoPopDialog from '../AutoPopDialog';
import { isEduBranchStore } from '@youzan/utils-shop';
import { ShowWrapper } from 'fns/chain';

import get from 'lodash/get';
import CoverField from 'components/field/cover';
import SignPreview from './SignPreview';
import { updatePunchPromotionAPI } from '../../api';

// 是否为服务号
const isMpAccount = get(window._global, 'mpAccount.serviceType') === 2;

const {
  createForm,
  Field,
  FormInputField,
  FormCheckboxField,
  FormRadioGroupField,
  getControlGroup,
} = Form;

class SwitchWrap extends React.Component {
  render() {
    const checked = this.props.value;

    return <Switch checked={checked} onChange={this.props.onSwitchChange} size="small" />;
  }
}
const SwitchField = getControlGroup(SwitchWrap);

class SignSetting extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.gciId === '') {
      if (nextProps.data.gciId !== '') {
        return { ...nextProps.data, loading: false };
      }

      return { ...nextProps.data };
    }
    return null;
  }

  state = {
    loading: true,
    gciId: '',
    popType: 0,
    daySignBgPicSetting: 1,
    daySignBgPicUrl: '',
    openDaySignQuotes: 0,
    daySignQuotes: '',
    daySignLinkSetting: 1,
    daySignCustomQr: '',
    focusQrBase64: '',
    dialogVisible: false,
  };

  onStateChange = (key, val) => {
    this.setState({
      [key]: val,
    });
  };

  onSwitchChange = val => {
    if (val) {
      if (this.state.popType === 2) {
        this.showConfirmDialog();
        return;
      } else {
        this.turnOnSwitch();
      }
    } else {
      this.turnDownSwitch();
    }
    this.closeConfirmDialog();
  };

  turnOnSwitch = () => {
    this.onStateChange('popType', 1);
    this.closeConfirmDialog();
  };

  turnDownSwitch = () => {
    this.onStateChange('popType', 0);
  };

  showConfirmDialog = () => {
    this.onStateChange('dialogVisible', true);
  };

  closeConfirmDialog = () => {
    this.onStateChange('dialogVisible', false);
  };

  onBgTypeChange = type => {
    this.setState({
      daySignBgPicSetting: type,
      daySignBgPicUrl: '',
    });
  };

  onDaySignQuotesChange = val => {
    this.setState({
      openDaySignQuotes: val,
      daySignQuotes: '',
    });
  };

  save = data => {
    this.setState({
      loading: true,
    });

    data.popType = data.popType ? 1 : 0;
    data.openDaySignQuotes = data.openDaySignQuotes ? 1 : 0;

    data.gciId = this.state.gciId;
    updatePunchPromotionAPI(data)
      .then(() => {
        Notify.success('更新成功！');
        this.props.onSubmit();
      })
      .catch(msg => {
        Notify.error(msg || '更新失败！');
      })
      .finally(() => {
        this.setState({
          loading: false,
        });
      });
  };

  render() {
    const {
      handleSubmit,
      data: {
        daySignBgPicSetting,
        daySignBgPicUrl,
        openDaySignQuotes,
        daySignQuotes,
        daySignLinkSetting,
        daySignCustomQr,
      },
    } = this.props;

    const { popType } = this.state;

    return (
      <BlockLoading loading={this.state.loading}>
        <div className="sign">
          <SignPreview data={this.state} />
          <Form horizontal className="split-form" onSubmit={handleSubmit(this.save)}>
            <Field
              className="sign-switch-field"
              name="popType"
              label="打卡后自动弹出日签"
              component={SwitchField}
              helpDesc="日签与长图不可同时配置为自动弹出。"
              value={popType === 1}
              onSwitchChange={this.onSwitchChange}
            />
            <h3 className="split-title">样式设置</h3>
            <FormRadioGroupField
              name="daySignBgPicSetting"
              label="背景设置："
              className="radio-field"
              value={daySignBgPicSetting}
              onChange={evt => this.onBgTypeChange(evt.target.value)}
              required
            >
              <Radio value={1}>系统图片</Radio>
              <p className="zent-form__help-desc radio-field__desc">系统将随机生成精美图片。</p>
              <Radio value={2}>自定义图片</Radio>
            </FormRadioGroupField>
            {this.state.daySignBgPicSetting === 2 && (
              <Field
                name="daySignBgPicUrl"
                label=""
                className="cover-field"
                component={CoverField}
                helpDesc="建议尺寸650*800，小于3M，支持jpg、png、jpeg格式。"
                onChange={val => this.onStateChange('daySignBgPicUrl', val)}
                value={daySignBgPicUrl}
                validations={{
                  required(_, value) {
                    return value !== '';
                  },
                }}
                validationErrors={{
                  required: '请上传图片',
                }}
              />
            )}
            <FormCheckboxField
              name="openDaySignQuotes"
              label="金句："
              value={openDaySignQuotes === 1}
              onChange={evt => this.onDaySignQuotesChange(evt.target.checked ? 1 : 0)}
            >
              开启
            </FormCheckboxField>
            {this.state.openDaySignQuotes === 1 && (
              <FormInputField
                name="daySignQuotes"
                type="textarea"
                className="textarea-field"
                placeholder="输入金句内容"
                maxLength={30}
                showCount
                autoSize
                width="248px"
                onChange={evt => this.onStateChange('daySignQuotes', evt.target.value)}
                value={daySignQuotes}
                validations={{
                  required(_, value) {
                    return value !== '';
                  },
                  maxLine: (_, value) => {
                    // 金句不支持换行
                    return !/\n/g.test(value);
                  },
                }}
                validationErrors={{
                  required: '请填写金句',
                  maxLine: '金句暂不支持换行',
                }}
              />
            )}
            <h3 className="split-title">二维码设置</h3>
            <FormRadioGroupField
              name="daySignLinkSetting"
              label="二维码设置："
              className="radio-field"
              value={daySignLinkSetting}
              onChange={evt => this.onStateChange('daySignLinkSetting', evt.target.value)}
              required
              validations={{
                required(values, value) {
                  return value !== '';
                },
              }}
              validationErrors={{
                required: '请选择二维码类型',
              }}
            >
              <Radio value={1}>群打卡推广码</Radio>
              <p className="zent-form__help-desc radio-field__desc">扫码访问群打卡</p>

              <ShowWrapper isInStoreCondition={!isEduBranchStore}>
                {isMpAccount && [
                  <Radio value={2} key="1">
                    公众号二维码
                  </Radio>,
                  <p className="zent-form__help-desc radio-field__desc" key="2">
                    扫码关注公众号后可收到打卡推送
                  </p>,
                ]}
              </ShowWrapper>

              <Radio value={3}>自定义二维码</Radio>
            </FormRadioGroupField>
            {this.state.daySignLinkSetting === 3 && (
              <Field
                name="daySignCustomQr"
                label=""
                className="cover-field"
                component={CoverField}
                value={daySignCustomQr}
                onChange={val => this.onStateChange('daySignCustomQr', val)}
                validations={{
                  required(_, value) {
                    return value !== '';
                  },
                }}
                validationErrors={{
                  required: '请上传自定义二维码',
                }}
              />
            )}
            <div className="app-design">
              <div className="app-actions no-left-right-consider">
                <div className="form-actions new-actions text-center">
                  <Button type="primary" htmlType="submit">
                    保存
                  </Button>
                </div>
              </div>
            </div>
          </Form>
          <AutoPopDialog
            visible={this.state.dialogVisible}
            popType={this.state.popType}
            onConfirm={this.turnOnSwitch}
            onClose={this.closeConfirmDialog}
          />
        </div>
      </BlockLoading>
    );
  }
}

export default createForm({ scrollToError: true })(SignSetting);
