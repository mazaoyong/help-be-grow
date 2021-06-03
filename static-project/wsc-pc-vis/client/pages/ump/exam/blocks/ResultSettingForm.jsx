
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import { Radio } from 'zent';

import CoverField from 'components/field/cover';
import TextAreaField from 'components/field/text-area';
import { chainDisableForm } from 'fns/chain';
import { chainSupportHqAndSingle } from '../chain';

import get from 'lodash/get';

import { canShowFactoryHOC } from '../utils';

import ResultChargeConditionField from '../components/fields/ResultChargeConditionField';
import CouponSettingField from '../components/fields/CouponField';

const { Field, FormInputField, createForm, FormRadioGroupField } = Form;
const FieldCanShow = canShowFactoryHOC(Field);
const ChainForm = chainDisableForm(chainSupportHqAndSingle, Form);

class TitleSettingForm extends Component {
  state = {
    loading: /edit/.test(this.props.route.path),
  };

  $validateForm = cb => {
    const { zentForm } = this.props;
    zentForm.setFormDirty(true);
    zentForm.validateForm(true, ev => {
      cb && cb(zentForm.isValid());
    });
  };

  submit = (values, value) => {
    this.syncCouponField();
    this.props.handleSubmit(values => {
      if (this.checkCouponField(values)) {
        this.props.onSubmit(values);
      }
    })();
  };

  // 校验coupon field的值
  checkCouponField({ coupon }) {
    if (coupon.couponRequired) {
      return (coupon.couponId !== 0 && coupon.couponId !== -1) && (coupon.couponNum <= 30 && coupon.couponNum >= 0);
    }
    return true;
  }

  /**
   * 调用子组件syncCouponRequired方法同步coupon的值
   */
  syncCouponField = () => {
    const couponFieldInst = this.field.getWrappedComponent().getControlInstance();
    couponFieldInst.syncCouponRequired();
  };

  render() {
    const { formData = {}, onFieldChange, resultIndex,
      titleCount, formDataList = [], unchangable = false } = this.props;
    const resultIsImgStyle = +formData.style === 2;

    return (
      <ChainForm horizontal className="exam-basis-wrap__form">
        {/* 判断条件 (不采用 value 作为入口值，有 bug) */}
        <Field
          name="conditions"
          label="判断条件："
          required
          conditionsValue={(formDataList[resultIndex] || {}).conditions || ''}
          resultIndex={resultIndex}
          resultCount={formDataList.length}
          titleCount={titleCount}
          preValue={(formDataList[resultIndex - 1] || {}).conditions || ''}
          component={ResultChargeConditionField}
          onChange={ev => {
            onFieldChange('conditions', {
              data: ev.value,
              index: ev.resultIndex,
            });
          }}
          unchangable={unchangable}
        />

        {/* 结果格式 */}
        <FormRadioGroupField
          required
          label="结果格式："
          name="style"
          onChange={ev => {
            onFieldChange('style', {
              data: ev.target.value,
            });
          }}
          value={+formData.style}
        >
          <Radio value={1}>文本</Radio>
          <Radio value={2}>图片</Radio>
        </FormRadioGroupField>

        {/* 测试结果 */}
        <FormInputField
          name="title"
          label="测试结果："
          width={300}
          required={!resultIsImgStyle}
          value={formData.title}
          placeholder={`${resultIsImgStyle ? '(选填)' : ''}请填写测试结果，10个字以内`}
          validations={{
            required(values, value) {
              if (!resultIsImgStyle && !value) {
                return false;
              }
              return true;
            },
            maxSize(values, value) {
              return value.length <= 10;
            },
          }}
          validationErrors={{
            required: '请填写测试结果',
            maxSize: '结果文字不超过10个字',
          }}
          onChange={ev => {
            onFieldChange('title', {
              data: ev.target.value,
            });
          }}
        />

        {/* 图片 */}
        <FieldCanShow
          canShow={resultIsImgStyle}
          name="descPic"
          label="图片："
          required
          detail={true}
          value={get(formData, 'descPic')}
          component={CoverField}
          showRemove
          uploadCls="content-upload"
          helpDesc="建议尺寸590*590px，比例1:1，支持JPG、PNG格式，小于300KB"
          validations={{
            required(values, value) {
              return !!value.cover;
            },
            maxSize(values, value) {
              return get(value, 'picture.attachment_size', 0) < 300 * 1024;
            },
            requiredDimension(values, value) {
              const picture = value.picture || {};
              return +picture.width / +picture.height === 1 || value.width / value.height === 1;
            },
          }}
          validationErrors={{
            required: '请上传图片',
            maxSize: '图片大小请小于300kb',
            requiredDimension: '封面尺寸比例要求为1:1',
          }}
          onChange={ev => {
            onFieldChange('descPic', {
              data: ev,
            });
          }}
        />

        {/* 结果描述 */}
        <FieldCanShow
          canShow={!resultIsImgStyle}
          name="description"
          label="结果描述："
          required
          value={formData.description}
          maxLength={255}
          style={{
            width: '381px',
            height: '91px',
          }}
          showCount
          component={TextAreaField}
          placeholder="请填写结果描述，255个字以内"
          validations={{
            required(values, value) {
              return !!value;
            },
            maxSize(values, value) {
              return value.length <= 255;
            },
          }}
          validationErrors={{
            required: '请填写结果描述',
            maxSize: '描述文字不超过255个字',
          }}
          onChange={ev => {
            onFieldChange('description', {
              data: ev.target.value,
            });
          }}
        />

        {/* 送优惠券 */}
        <Field
          ref={ref => { this.field = ref; }}
          name="coupon"
          label="送优惠券："
          value={formData.coupon}
          component={CouponSettingField}
          validations={{
            outdata: (values, value) => {
              return !(value.couponRequired && value.couponId === -1);
            },
            requireCoupon: (values, value) => {
              return !(value.couponRequired && value.couponId === 0);
            },
            couponNum: (values, value) => {
              return !(value.couponRequired && (value.couponNum > 30 || value.couponNum <= 0));
            },
            score: (values, value) => {
              return !(value.scoreRequired && value.score <= 0);
            },
            scoreMax: (values, value) => {
              return !(value.scoreRequired && value.score > 9999999);
            },
          }}
          validationErrors={{
            outdata: '优惠已过期，请重新选择',
            requireCoupon: '你必须选择一个优惠',
            couponNum: '优惠张数必须是一个正整数且不能超过 30 张',
            score: '请填写积分，且是正整数',
            scoreMax: '积分不能大于七位数',
          }}
          onChange={ev => {
            onFieldChange('coupon', {
              data: ev,
            });
          }}
          unchangable={unchangable}
        />
      </ChainForm>
    );
  }
}

export default createForm({ scrollToError: true })(TitleSettingForm);
