import { Form } from '@zent/compat';
import React, { Component } from 'react';
import { Button, Radio, Sweetalert, Notify } from 'zent';
import isPlainObject from 'lodash/isPlainObject';
import ajax from 'zan-pc-ajax';
import RegionSelectField from '../region-select';
import ContactPhone from '../contact-phone';
import behaviorVerify from '@youzan/behavior-verify/web/react';

const { Field, FormInputField, FormRadioGroupField, createForm } = Form;

class ConsultForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      model: {
        phoneType: 1,
        province: '',
        city: '',
        county: '',
        areaCode: '',
        shopName: '',
        contact: '',
        mobile: '',
        yzUsage: 1,
        telAreaCode: '',
        telLandline: '',
      },
    };
  }

  showAlertInfo = () => {
    Sweetalert.alert({
      title: '提交成功',
      content: '我们已收到您的开店申请，之后会有专人与你联系',
      confirmText: '好的',
      onConfirm: () => (window.location.href = '//www.youzan.com'),
    });
  };

  submit = ({ area, shopName, contactGroup, contact, yzUsage }) => {
    if (this.state.loading) return;
    const { province, city, area: county, city_id: areaCode } = area;
    const { phoneType, mobile, telAreaCode, telLandline } = contactGroup;
    const data = {
      mobile: phoneType === 1 ? mobile : `${telAreaCode}-${telLandline}`,
      province,
      city,
      county,
      areaCode,
      shopName,
      contact,
      yzUsage,
    };
    this.setState({
      loading: true,
    });

    ajax({
      url: '/v4/vis/cy/consult.json',
      method: 'POST',
      data,
    })
      .then(this.showAlertInfo)
      .catch(err => Notify.error(err))
      .finally(() => {
        this.setState({
          loading: false,
        });
      });
  };

  toVerify = (params) => {
    behaviorVerify({
      bizType: 124,
      bizData: '',
      onSuccess: (ticket) => {
        ajax({
          url: '/v4/vis/cy/consult/sendBehaviorCaptchaJson.json',
          method: 'GET',
          data: { ticket },
        })
          .then(() => this.submit(params))
          .catch((err) => Notify.error(err));
      },
    });
  };

  handleRegionChange = ({ area, province, city, county }) => {
    this.handleModelChange({
      areaCode: area,
      province,
      city,
      county,
    });
  };

  handleModelChange = (name, val) => {
    if (isPlainObject(name)) {
      this.setState({
        model: {
          ...this.state.model,
          ...name,
        },
      });
      return;
    }
    this.setState({
      model: {
        ...this.state.model,
        [name]: val,
      },
    });
  };

  render() {
    const { handleSubmit } = this.props;
    const { model, loading } = this.state;
    return (
      <Form className="consult-form" horizontal onSubmit={handleSubmit(this.toVerify)}>
        <Field
          name="area"
          type="text"
          label="所在城市："
          placeholder="请选择省/市/区"
          component={RegionSelectField}
          validations={{
            required: true,
          }}
          validationErrors={{
            required: '请选择省市区',
          }}
        />
        <FormInputField
          name="shopName"
          className=""
          type="text"
          label="店铺名称："
          validations={{
            required: true,
          }}
          validationErrors={{
            required: '请填写店铺名称',
          }}
        />
        <Field
          name="contactGroup"
          value={{
            phoneType: model.phoneType,
            mobile: model.mobile,
            telAreaCode: model.telAreaCode,
            telLandline: model.telLandline,
          }}
          component={ContactPhone}
          validations={{
            validMobile(values, value) {
              if (value.phoneType === 1) {
                const mobile = +value.mobile;
                const mobileReg = /^1[3|4|5|7|8|9]\d{9}$/;
                return mobileReg.test(mobile);
              }
              return true;
            },
            validTelAreaCode(values, value) {
              if (value.phoneType === 2) {
                const telAreaCode = +value.telAreaCode;
                return /^\d{3,4}$/.test(telAreaCode);
              }
              return true;
            },
            validLandline(values, value) {
              if (value.phoneType === 2) {
                const mobile = +value.telLandline;
                const mobileReg = /^\d{7,11}$/;
                return mobileReg.test(mobile);
              }
              return true;
            },
          }}
          validationErrors={{
            validMobile: '请填写正确的手机号',
            validTelAreaCode: '区号长度为3到4位',
            validLandline: '座机号码长度为7到11位',
          }}
        />
        <FormInputField
          name="contact"
          type="text"
          label="联系人："
          validations={{
            required: true,
          }}
          validationErrors={{
            required: '请填写联系人',
          }}
        />
        <FormRadioGroupField name="yzUsage" label="使用情况：" value={model.yzUsage} required>
          <Radio value={1}>使用过有赞的产品</Radio>
          <Radio value={0}>没有用过</Radio>
        </FormRadioGroupField>
        <div className="zent-form__form-actions">
          <Button type="primary" htmlType="submit" loading={loading}>
            提交
          </Button>
        </div>
      </Form>
    );
  }
}

const ConsultFormWrap = createForm()(ConsultForm);

export default ConsultFormWrap;
