
import { Pop, Form } from '@zent/compat';
import React, { PureComponent } from 'react';
import cx from 'classnames';
import isArray from 'lodash/isArray';
import './style.scss';

const { FormInputField, FormCheckboxField, Field, InputField } = Form;

const DEMO_IMG = {
  GROUPON: [
    'https://b.yzcdn.cn/public_files/6711d8c643810996a5ad267f5a2862a7.png',
    'https://b.yzcdn.cn/public_files/1013baf82cbe5ee6236a6c5b2dc74bcc.png'
  ],
  QR_CODE: 'https://b.yzcdn.cn/public_files/2019/10/09/b95f9ed1848ba1453b5aa0733d78088a.png',
  HOME_PAGE: 'https://b.yzcdn.cn/public_files/830614c766ad3a01f13c36d57614d375.png'
};

const DEMO_TEXT = {
  GROUPON: '加粉推广在页面中的示例'
};

export default class QRCodeSettingText extends PureComponent {
  getClassName = isHide => {
    return cx({ hide: isHide });
  };

  getOpenDialog = (img, text) => {
    const imgs = isArray(img) ? img : [img];
    return (
      <div className="groupon-show-example">
        {imgs.map((item, index) => (<img key={index} src={item}/>))}
      </div>
    );
  };

  render() {
    const { joinGroupSetting } = this.props;
    const {
      buttonCopy = '立即添加',
      guideCopy = '及时了解课程动向',
      guideTitle = '添加老师微信',
      groupText,
    } = joinGroupSetting || {};

    return (
      <>
        <FormInputField
          name="qrCodeGuideText"
          label="二维码引导文案："
          placeholder="字数20个字以内，如输入群名称"
          autoComplete="off"
          className="field-size-320"
          value={joinGroupSetting.qrCodeGuideText}
          validations={{
            required: true,
            maxLength: 20
          }}
          validationErrors={{
            required: '请输入二维码引导文案',
            maxLength: '最多可输入20个字'
          }}
          required
        />
        <FormCheckboxField
          name="popupAfterPurchasingOpen"
          className={this.getClassName(!joinGroupSetting.groupOpen)}
          label="在支付成功页展示："
          value={joinGroupSetting.popupAfterPurchasingOpen}
          helpDesc={
            <>
              开启后，支付成功页将展示加粉推广弹窗。<Pop
                trigger="click"
                content={this.getOpenDialog(DEMO_IMG.GROUPON, DEMO_TEXT.GROUPON)}
                position="right-bottom"
                className="course-example-pop"
              >
                <a href="javascript:;">查看示例</a>
              </Pop>
            </>
          }
          checked={joinGroupSetting.popupAfterPurchasingOpen}
          onChange={this.props.handleSussessPageChange}
        >
          开启
        </FormCheckboxField>
        <div
          className={this.getClassName(
            !joinGroupSetting.groupOpen || !joinGroupSetting.popupAfterPurchasingOpen
          )}
        >
          <Field
            name="guideTitle"
            label="标题："
            placeholder="添加老师微信"
            component={InputField}
            value={guideTitle}
            width="200px"
            required
            validations={Object.assign({}, {
              validateDate(_, value) {
                if (!joinGroupSetting.groupOpen || !joinGroupSetting.popupAfterPurchasingOpen) {
                  return true;
                }
                return Boolean(value);
              }
            },
            {
              maxLength: 6
            })}
            validationErrors={{
              validateDate: '请输入报名成功页标题',
              maxLength: '最多可输入6个字'
            }}
          />
          <Field
            name="guideCopy"
            label="描述："
            placeholder="及时了解课程动向"
            component={InputField}
            value={guideCopy}
            width="200px"
            required
            validations={Object.assign({}, {
              validateDate(_, value) {
                if (!joinGroupSetting.groupOpen || !joinGroupSetting.popupAfterPurchasingOpen) {
                  return true;
                }
                return Boolean(value);
              }
            }, {
              maxLength: 20
            })}
            validationErrors={{
              validateDate: '请输入报名成功页描述',
              maxLength: '最多可输入20个字'
            }}
          />
          <Field
            name="buttonCopy"
            label="按钮名称："
            placeholder="立即添加"
            component={InputField}
            value={buttonCopy}
            width="200px"
            required
            validations={Object.assign({}, {
              validateDate(_, value) {
                if (!joinGroupSetting.groupOpen || !joinGroupSetting.popupAfterPurchasingOpen) {
                  return true;
                }
                return Boolean(value);
              }
            }, {
              maxLength: 4
            })}
            validationErrors={{
              validateDate: '请输入报名成功页按钮名称',
              maxLength: '最多可输入4个字'
            }}
          />
        </div>
        <FormCheckboxField
          name="courseDetailPageOpen"
          label="在课程详情页展示："
          helpDesc={
            <>
              开启后，学员需购买课程，才将在课程详情页展示该模块引导好友加群（你需要设置加粉推广的引导文案）
              <Pop
                trigger="click"
                content={this.getOpenDialog(DEMO_IMG.HOME_PAGE)}
                position="right-bottom"
                className="course-example-pop"
              >
                <a href="javascript:;">查看示例</a>
              </Pop>
            </>
          }
          checked={joinGroupSetting.courseDetailPageOpen === 1}
          onChange={this.props.handleCourseDetialChange}
        >
          开启
        </FormCheckboxField>
        {
          joinGroupSetting.courseDetailPageOpen
            ? <FormInputField
              name="groupText"
              label="课程详情页引导文案："
              placeholder="20个字以内，如加入课程交流群"
              autoComplete="off"
              className="field-size-320"
              value={groupText}
              required
              validations={{
                required: true,
                maxLength: 20
              }}
              validationErrors={{
                required: '请输入课程详情页引导文案',
                maxLength: '最多可输入20个字'
              }}
            />
            : null
        }

      </>
    );
  }
}
