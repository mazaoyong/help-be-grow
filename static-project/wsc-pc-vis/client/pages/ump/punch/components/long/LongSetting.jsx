
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import { Radio, Button, BlockLoading, Notify, Switch } from 'zent';
import { isEduBranchStore } from '@youzan/utils-shop';
import { ShowWrapper } from 'fns/chain';

import AutoPopDialog from '../AutoPopDialog';

import get from 'lodash/get';
import CoverField from 'components/field/cover';
import LongPreview from './LongPreview';
import { updatePunchPromotionAPI } from '../../api';

// 是否为服务号
const isMpAccount = get(window._global, 'mpAccount.serviceType') === 2;

const {
  createForm,
  Field,
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

class LongSetting extends Component {
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
    dialogVisible: false,
    gciId: '',
    popType: 0,
    longFigureLinkSetting: 1,
    longFigureCustomQr: '',
    focusQrBase64: '',
  };

  onStateChange = (key, val) => {
    this.setState({
      [key]: val,
    });
  };

  onSwitchChange = val => {
    if (val) {
      if (this.state.popType === 1) {
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
    this.onStateChange('popType', 2);
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

  save = data => {
    this.setState({
      loading: true,
    });

    data.popType = data.popType ? 2 : 0;

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
    const { handleSubmit } = this.props;
    const { popType, longFigureLinkSetting, longFigureCustomQr } = this.state;

    return (
      <BlockLoading loading={this.state.loading}>
        <div className="long">
          <LongPreview data={this.state} />
          <Form horizontal className="split-form" onSubmit={handleSubmit(this.save)}>
            <Field
              className="long-switch-field"
              name="popType"
              label="打卡后自动弹出长图"
              component={SwitchField}
              helpDesc="日签与长图不可同时配置为自动弹出。"
              value={popType === 2}
              onSwitchChange={this.onSwitchChange}
            />
            <h3 className="split-title">二维码设置</h3>
            <FormRadioGroupField
              name="longFigureLinkSetting"
              label="二维码设置："
              className="radio-field"
              value={longFigureLinkSetting}
              onChange={evt => this.onStateChange('longFigureLinkSetting', evt.target.value)}
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
              <p className="zent-form__help-desc radio-field__desc">群打卡推广码</p>

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
            {this.state.longFigureLinkSetting === 3 && (
              <Field
                name="longFigureCustomQr"
                label=""
                className="cover-field"
                component={CoverField}
                value={longFigureCustomQr}
                onChange={val => this.onStateChange('longFigureCustomQr', val)}
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
              <div className="app-actions">
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

export default createForm({ scrollToError: true })(LongSetting);
