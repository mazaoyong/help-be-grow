
import { Pop, Form } from '@zent/compat';
import React, { PureComponent, Component } from 'react';
import { Radio } from 'zent';
import { EduImageUpload } from '@youzan/ebiz-components';
import LiveQRField from '../live-qr-field';
import cx from 'classnames';
import assign from 'lodash/assign';
import isArray from 'lodash/isArray';
import { DEMO_IMG, DEMO_TEXT } from '../../constants';
import './index.scss';
import helpPopupTips from '../../components/help-popup-tips';

const {
  Field,
  FormSection,
  FormCheckboxField,
  FormRadioGroupField,
  InputField,
  FormInputField
} = Form;
const { ImageUploadFieldWithControlGroup } = EduImageUpload;

export default class GroupQRCode extends (PureComponent || Component) {
  getClassName = isHide => {
    return cx({ hide: isHide });
  };

  getOpenDialog = (img, text) => {
    const imgs = isArray(img) ? img : [img];
    return (
      <div className="groupon-show-example">
        {imgs.map((item, index) => {
          return <img key={index} src={item} />;
        })}
      </div>
    );
  };

  getRequiredValidation = (errMessage, type) => {
    const { joinGroupSetting } = this.props;
    const validation = {};
    if (joinGroupSetting.groupOpen) {
      validation['required'] = (formValue, value) => {
        if (type === 'liveQR' && (!value || !value.codeId)) {
          return errMessage;
        } else if (!value && value !== 0) {
          return errMessage;
        }
        return true;
      };
    }
    return validation;
  };

  render() {
    const { label, joinGroupSetting } = this.props;
    const { buttonCopy = '立即添加', guideCopy = '及时了解课程动向', guideTitle = '添加老师微信', buttonName = '加群' } =
      joinGroupSetting || {};
    return (
      <FormSection name="joinGroupSetting">
        <FormCheckboxField
          name="groupOpen"
          label={label}
          value={joinGroupSetting.groupOpen}
          checked={joinGroupSetting.groupOpen}
        >
          <span>{`开启  `}</span>
        </FormCheckboxField>
        <FormRadioGroupField
          name="codeType"
          label="推广码类型："
          className={this.getClassName(!joinGroupSetting.groupOpen)}
          value={joinGroupSetting.codeType === '' ? 1 : joinGroupSetting.codeType}
          required
          validations={this.getRequiredValidation('请选择推广码类型')}
        >
          <Radio value={1}>
            <span>活码</span>
            {helpPopupTips('根据扫码人数自动轮换微信号及提供相应数据统计分析功能')}
          </Radio>
          <Radio value={0}>固定二维码</Radio>
        </FormRadioGroupField>

        <Field
          name="liveQRValue"
          label="活码："
          component={LiveQRField}
          className={this.getClassName(
            !joinGroupSetting.groupOpen || joinGroupSetting.codeType !== 1
          )}
          value={joinGroupSetting.liveQRValue}
          validations={
            joinGroupSetting.codeType !== 1
              ? {}
              : this.getRequiredValidation('必须选择一个活码', 'liveQR')
          }
          required
        />
        <Field
          name="normalQRValue"
          label="上传二维码："
          tip="图片尺寸150*150px，小于3M"
          component={ImageUploadFieldWithControlGroup}
          className={this.getClassName(
            !joinGroupSetting.groupOpen || joinGroupSetting.codeType !== 0
          )}
          needDetail
          uploadCls="column-upload"
          value={joinGroupSetting.normalQRValue}
          validations={
            joinGroupSetting.codeType !== 0 ? {} : this.getRequiredValidation('必须上传二维码图片')
          }
          required
        />
        <FormInputField
          name="qrCodeGuideCopy"
          label="二维码引导文案："
          placeholder="字数20个字以内，如输入群名称"
          autoComplete="off"
          className={this.getClassName(!joinGroupSetting.groupOpen)}
          width="240px"
          value={joinGroupSetting.qrCodeGuideCopy}
          validations={{
            ...this.getRequiredValidation('请输入二维码引导文案'),
            maxLength: 20
          }}
          validationErrors={{
            required: '请输入二维码引导文案',
            maxLength: '最多可输入20个字'
          }}
          required
        />
        <FormCheckboxField
          name="enrollmentSussessPageOpen"
          className={this.getClassName(!joinGroupSetting.groupOpen)}
          label="在报名成功页展示："
          value={joinGroupSetting.enrollmentSussessPageOpen}
          helpDesc={
            <>
              开启后，报名成功页将展示加粉推广弹窗。<Pop
                trigger="click"
                content={this.getOpenDialog(DEMO_IMG.GROUPON, DEMO_TEXT.GROUPON)}
                position="right-bottom"
                className="course-example-pop"
              >
                <a href="javascript:;">查看示例</a>
              </Pop>
            </>
          }
          checked={joinGroupSetting.enrollmentSussessPageOpen}
        >
          开启
        </FormCheckboxField>
        <div
          className={this.getClassName(
            !joinGroupSetting.groupOpen || !joinGroupSetting.enrollmentSussessPageOpen
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
            validations={assign({}, {
              validateDate(_, value) {
                if (!joinGroupSetting.groupOpen || !joinGroupSetting.enrollmentSussessPageOpen) {
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
            validations={assign({}, {
              validateDate(_, value) {
                if (!joinGroupSetting.groupOpen || !joinGroupSetting.enrollmentSussessPageOpen) {
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
            validations={assign({}, {
              validateDate(_, value) {
                if (!joinGroupSetting.groupOpen || !joinGroupSetting.enrollmentSussessPageOpen) {
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
          name="courseHomepageOpen"
          label="在我的课程主页展示："
          value={joinGroupSetting.courseHomepageOpen}
          className={this.getClassName(!joinGroupSetting.groupOpen)}
          helpDesc={
            <>
              开启后，学员需购买课程，才将在课程详情页展示该模块引导好友加群（你需要设置加粉推广的引导文案）
              <Pop
                trigger="click"
                content={this.getOpenDialog(DEMO_IMG.COURSE_PAGE, DEMO_TEXT.GROUPON)}
                position="right-bottom"
                className="course-example-pop"
              >
                <a href="javascript:;">查看示例</a>
              </Pop>
            </>
          }
          checked={joinGroupSetting.courseHomepageOpen}
        >
          开启
        </FormCheckboxField>
        <Field
          name="buttonName"
          label="按钮名称："
          placeholder="立即添加"
          className={this.getClassName(
            !joinGroupSetting.groupOpen || !joinGroupSetting.courseHomepageOpen
          )}
          required
          component={InputField}
          value={buttonName}
          width="200px"
          validations={assign({}, {
            validateDate(_, value) {
              if (!joinGroupSetting.courseHomepageOpen) {
                return true;
              }
              return Boolean(value);
            }
          },
          {
            maxLength: 4
          })}
          validationErrors={{
            validateDate: '请输入我的课程主页按钮名称',
            maxLength: '最多可输入4个字'
          }}
        />
      </FormSection>
    );
  }
}
