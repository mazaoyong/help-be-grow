import { Pop, Form } from '@zent/compat';
import React, { PureComponent } from 'react';
import { Radio, Icon, BlockLoading } from 'zent';

import { BtnGroup, LiveCodeSelectField, QrCodeUploadField } from '../../components';
import { isEduHqStore } from 'fns/chain';

const shopName = window._global.shopName;
const { FormRadioGroupField, FormInputField, FormCheckboxField, Field } = Form;

export default class EditForm extends PureComponent {
  state = {
    loading: false,
  };

  render() {
    const { handleSubmit, initialValue, value, activeTab } = this.props;
    const { loading } = this.state;
    const _initialValue = this.unformatData(initialValue);
    let { scanGuideCopy, organizationName, groupOpen } = _initialValue;
    let codeStyle = activeTab === 'weapp' ? 1 : value.codeStyle;
    if (codeStyle === 0) {
      // 兼容以前老数据，以前的不显示的codeStyle为0
      codeStyle = 2;
    }
    return (
      <BlockLoading>
        <Form horizontal onSubmit={handleSubmit(this.handleSubmit)}>
          <FormRadioGroupField name="codeStyle" label="二维码样式:" value={codeStyle}>
            <Radio value={1}>显示店铺LOGO</Radio>
            <Radio value={2} disabled={activeTab === 'weapp'}>
              不显示LOGO
            </Radio>
          </FormRadioGroupField>
          <FormInputField
            type="text"
            name="scanGuideCopy"
            value={scanGuideCopy}
            label="扫码引导文案:"
            placeholder="微信扫一扫，签到消课"
            spellCheck={false}
            validations={{
              max(values, value) {
                if (value && value.length > 15) {
                  return '最多输入15个字';
                }
                return true;
              },
            }}
          />
          <FormInputField
            type="text"
            name="organizationName"
            value={organizationName}
            label="机构名称:"
            placeholder={shopName}
            spellCheck={false}
            validations={{
              max(values, value) {
                if (value && value.length > 15) {
                  return '最多输入15个字';
                }
                return true;
              },
            }}
          />
          {!isEduHqStore ? (
            <>
              <FormCheckboxField name="groupOpen" value={groupOpen} label="签到后推荐:">
                加粉推广
              </FormCheckboxField>
              {value.groupOpen ? this.renderGroup(_initialValue, value) : null}
              <BtnGroup loading={loading} />
            </>
          ) : null}
        </Form>
      </BlockLoading>
    );
  }

  renderGroup = (initialValue, value) => {
    const { codeType, liveCode, qrCode, guideTitle, guideCopy, buttonCopy } = initialValue;
    return (
      <>
        <FormRadioGroupField name="codeType" label="推广码类型:" value={codeType} required>
          <Radio value={1}>
            <Pop
              trigger="hover"
              content={
                <>
                  <div>根据扫码人数自动轮换微信号及</div>
                  <div>提供相应数据统计分析功能</div>
                </>
              }
            >
              <span>
                活码
                <Icon type="help-circle" className="signin_icon-help" />
              </span>
            </Pop>
          </Radio>
          <Radio value={0}>固定二维码</Radio>
        </FormRadioGroupField>
        {this.renderLiveCode(value.codeType, liveCode, qrCode)}
        <FormInputField
          type="text"
          name="guideTitle"
          value={guideTitle}
          label="标题:"
          placeholder="添加老师微信"
          required
          validations={{
            validate(values, value) {
              if (!value) {
                return '请填写引导标题';
              }
              if (value.length > 6) {
                return '最多输入6个字';
              }
              return true;
            },
          }}
        />
        <FormInputField
          type="text"
          name="guideCopy"
          value={guideCopy}
          label="描述:"
          placeholder="及时了解课程动向"
          required
          validations={{
            validate(values, value) {
              if (!value) {
                return '请填写引导描述';
              }
              if (value.length > 20) {
                return '最多输入20个字';
              }
              return true;
            },
          }}
        />
        <FormInputField
          type="text"
          name="buttonCopy"
          value={buttonCopy}
          label="按钮名称:"
          placeholder="立即添加"
          required
          validations={{
            validate(values, value) {
              if (!value) {
                return '请填写按钮名称';
              }
              if (value.length > 4) {
                return '最多输入4个字';
              }
              return true;
            },
          }}
        />
      </>
    );
  };

  // warn: codeType is retrieved from value rather than initialValue, becaseu it can be
  // changed dynamically.
  renderLiveCode = (codeType, liveCode, qrCode) => {
    if (codeType === 1) {
      return (
        <Field
          name="liveCode"
          value={liveCode}
          label="活码:"
          component={LiveCodeSelectField}
          required
          asyncValidation={(values, value) => {
            if (!value || !value.codeId) {
              return Promise.reject('请选择活码');
            }
            return Promise.resolve();
          }}
        />
      );
    }
    return (
      <Field
        name="qrCode"
        value={qrCode}
        label="上传二维码:"
        component={QrCodeUploadField}
        required
        asyncValidation={(values, value) => {
          if (!value) {
            return Promise.reject('请上传二维码');
          }
          return Promise.resolve();
        }}
      />
    );
  };

  handleSubmit = (data) => {
    this.props.zentForm.asyncValidateForm(async () => {
      this.setState({ loading: true });
      const formattedData = this.formatData(data);
      await this.props.onInnerSubmit(formattedData);
      this.setState({ loading: false });
    });
  };

  formatData = (data) =>
    Object.keys(data)
      .map((key) => {
        switch (key) {
          case 'liveCode':
            return { ...data.liveCode };
          case 'qrCode':
            return { codePicture: data.qrCode };
          case 'groupOpen':
            return { groupOpen: data[key] ? 1 : 0 };
          default:
            return { [key]: data[key] };
        }
      })
      .reduce((obj, item) => Object.assign(obj, item), { scene: 1 });

  unformatData = (data = {}) =>
    Object.keys(data)
      .map((key) => {
        switch (key) {
          // filter
          case 'codeId':
          case 'codeName':
          case 'codePicture':
            return {};
          // dispatch by codeType
          case 'codeType':
            return !isEduHqStore && data.codeType === 1
              ? {
                codeType: 1,
                qrCode: '',
                liveCode: {
                  codeId: data.codeId,
                  codeName: data.codeName,
                  codePicture: data.codePicture,
                  codeKdtId: data.codeKdtId || window._global.kdtId,
                },
              }
              : {
                codeType: 0,
                qrCode: data.codePicture,
                liveCode: {},
              };
          case 'groupOpen':
            return { groupOpen: !!data[key] };
          default:
            return { [key]: data[key] };
        }
      })
      .reduce((obj, item) => Object.assign(obj, item), {});
}
