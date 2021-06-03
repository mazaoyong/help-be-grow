import React from 'react';
import { Sweetalert } from 'zent';
import { Form } from '@zent/compat';
import DeliveryImgField from './delivery-img-field';
import { IDeliverySimpleProps } from 'definitions/local-delivery';

import './style.scss';

const { FormInputField, FormNumberInputField } = Form;

type IProps = IDeliverySimpleProps;

/**
 * 配送区域设置简易版
 */
export default class DeliverySimple extends React.PureComponent<IProps> {
  handleLookExample = () => {
    const link = `${window._global.url.imgqn}/public_files/2016/09/23/df4e0945b0eb32d6438202e43d4b7973.png`;
    // @ts-ignore
    Sweetalert.alert({
      title: '配送区域图文信息将会在买家下单时显示',
      content: <img style={{ width: '400px' }} src={link} alt="示例图片" />,
      confirmText: '我知道了',
    });
  };
  // 保证传入numberInpuit的值保留两位小数 避免触发循环渲染
  formatPrice = price => {
    if (price === '' || price === undefined) {
      return price;
    }
    return (+price).toFixed(2);
  };

  render() {
    const { id, regionName, intro, img, startPrice, deliveryPrice } = this.props;

    return (
      <div className="simple-version">
        <FormInputField name="id" value={id} className="local-delivery-form__id" />
        <FormInputField
          required
          type="text"
          className="local-delivery-form__name"
          label="配送范围名称："
          name="regionName"
          value={regionName}
          validations={{
            validatorRegionName(values, value) {
              if (values.mode === 3) {
                const valueLen = value.length;
                if (value === '' || valueLen < 1 || valueLen > 30) {
                  return false;
                }
                return true;
              }
            },
          }}
          validationErrors={{
            validatorRegionName: '配送范围名称必须输入1-30个字',
          }}
        />
        <FormInputField
          required
          type="textarea"
          className="local-delivery-form__intro"
          label="配送范围介绍："
          helpDesc={<span>配送区域图文信息将会在买家下单时显示。</span>}
          name="intro"
          value={intro}
          validations={{
            validatorIntro(values, value) {
              if (values.mode === 3 && value) {
                return true;
              }
            },
          }}
          validationErrors={{
            validatorIntro: '请填写配送范围介绍',
          }}
        />
        <DeliveryImgField
          required
          className="local-delivery-form__intro"
          label="配送范围图片："
          helpDesc="建议尺寸：640 x 640 像素"
          name="img"
          value={img}
          validations={{
            // @ts-ignore
            validatorImg(values, value) {
              if (values.mode === 3 && value) {
                return true;
              }
            },
          }}
          validationErrors={{
            validatorImg: '请选择配送范围图片',
          }}
        />
        <FormNumberInputField
          required
          className="local-delivery-form__start"
          label="起送金额："
          helpDesc="起送金额为商品促销后的实际售价，在优惠券抵扣、订单满减等订单优惠之前，不包括运费。"
          name="startPrice"
          value={this.formatPrice(startPrice)}
          decimal={2}
          clearErrorOnFocus
          validations={{
            validatorEmpty(values, value) {
              if (values.mode === 3 && value !== '') {
                return true;
              }
            },
            validatorRange(values, value) {
              if (values.mode === 3 && +value >= 0 && +value <= 9999) {
                return true;
              }
            },
          }}
          validationErrors={{
            validatorEmpty: '请填写起送金额',
            validatorRange: '只能输入0.00-9999元之间的起送金额',
          }}
        />
        <FormNumberInputField
          required
          className="local-delivery-form__delivery"
          label="配送费："
          name="deliveryPrice"
          value={this.formatPrice(deliveryPrice)}
          decimal={2}
          clearErrorOnFocus
          validations={{
            validatorEmpty(values, value) {
              if (values.mode === 3 && value !== '') {
                return true;
              }
            },
            validatorRange(values, value) {
              if (values.mode === 3 && +value >= 0 && +value <= 9999) {
                return true;
              }
            },
          }}
          validationErrors={{
            validatorEmpty: '请填写配送费',
            validatorRange: '只能输入0.00-9999元之间的配送费',
          }}
        />
      </div>
    );
  }
}
