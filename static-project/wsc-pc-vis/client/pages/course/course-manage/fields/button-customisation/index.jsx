
import { Pop, Form } from '@zent/compat';
import React, { Component } from 'react';
import { Radio, Notify } from 'zent';
import openDemoImg from '../../../components/demo-image';
import { DEMO_IMG, DEMO_TEXT } from '../../constants';
import cx from 'classnames';
import get from 'lodash/get';
import { getbuttonCustomDescMap } from '../../common/utils';
import {
  findCourseSettings,
} from '../../../course-setting/api';
import './index.scss';

const { FormRadioGroupField, FormInputField } = Form;
const radioValues = ['默认名称', '自定义名称'];

export default class ButtonCustomisation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonFreeText: '免费报名',
      buttonNonFreeText: '立即报名',
    };
  }

  ifprice = () => {
    const { price, stocks, sellStocks, courseType } = this.props;
    let flag = false;
    if (courseType === 0) { // 体验课
      if (parseFloat(price)) {
        flag = true;
      }
    } else { // 正式课
      // 多sku时，某一sku价格为0时，product.price为0
      if (stocks && stocks.length !== 0) {
        stocks.forEach(sku => {
          if (sku.price && (parseFloat(sku.price) > 0)) {
            flag = true;
          }
        });
      }
      if (sellStocks && sellStocks.length !== 0) {
        // 有规格、自定义但初始未选择规格时
        if (sellStocks.length === 1 && sellStocks[0].courseSellType === 0 && price > 0) {
          flag = true;
        }
        sellStocks.forEach(sku => {
          if (sku.price && (parseFloat(sku.price) > 0)) {
            flag = true;
          }
        });
      }
    };
    return flag;
  }

  componentDidMount() {
    // 获取课程设置中的自定义按钮文案
    findCourseSettings()
      .then(courseSetting => {
        courseSetting.forEach(settingMap => {
          if (settingMap && get(settingMap, 'settingIdentity') === 'courseBuyButton') {
            switch (get(settingMap, 'courseBuyOperationSwitch.buyBtnConfig')) {
              case 0: {
                this.setState({
                  buttonFreeText: '免费报名',
                  buttonNonFreeText: '立即报名',
                });
                break;
              }
              case 1: {
                this.setState({
                  buttonFreeText: getbuttonCustomDescMap(get(settingMap, 'courseBuyOperationSwitch.customDescList'))['ZERO'],
                  buttonNonFreeText: getbuttonCustomDescMap(get(settingMap, 'courseBuyOperationSwitch.customDescList'))['NON_ZERO'],
                });
                break;
              }
              default:
                return;
            }
          };
        });
      })
      .catch(err => {
        Notify.error(err || '获取课程设置信息失败');
      });
  }
  render() {
    const { label, courseBuyButton } = this.props;
    const {
      buyBtnLabel = (this.ifprice() ? this.state.buttonNonFreeText : this.state.buttonFreeText),
    } = courseBuyButton;
    return (
      <>
        <FormRadioGroupField
          name="courseBuyButton.buyBtnConfig"
          label={label}
          value={courseBuyButton.buyBtnConfig}
          className="form-item-hide-mb"
        >
          {radioValues.map((radioValue, radioIndex) => {
            return (
              <Radio key={radioIndex} value={radioIndex}>
                {radioValue}
              </Radio>
            );
          })}
          <FormInputField
            name="courseBuyButton.buyBtnLabel"
            className={cx([
              'no-label',
              {
                hide: courseBuyButton.buyBtnConfig === 0,
              },
            ])}
            type="text"
            validateOnChange={false}
            validations={{
              required(values, value) {
                if (values.courseBuyButton.buyBtnConfig === 1) {
                  return value !== '';
                }
                return true;
              },
              maxLength: 6,
            }}
            validationErrors={{
              required: '请输入自定义名称',
              maxLength: '最多可输入6个字',
            }}
            value={buyBtnLabel}
          />
        </FormRadioGroupField>
        <div className="help-block button">
          <span>默认名称为<a href="https://www.youzan.com/v4/vis/edu/page/courseSettings" target="_blank" rel="noopener noreferrer">课程设置</a>中的{this.ifprice() ? this.state.buttonNonFreeText : this.state.buttonFreeText}，可自定义，如：立即预约，设置仅对当前线下课有效。</span>
          <Pop
            trigger="click"
            content={
              openDemoImg(DEMO_IMG.ORDER, DEMO_TEXT.ORDER)
            }
            position="left-center"
            className='course-example-pop'
          >
            <a href="javascript:;">查看示例</a>
          </Pop>
        </div>
      </>
    );
  }
}
