
import { Pop, Form } from '@zent/compat';
import React, { PureComponent } from 'react';
import { Radio, Icon } from 'zent';
import { EduImageUpload } from '@youzan/ebiz-components';
import { CODE_TYPE } from '../../constants/map';
import LiveCodeSelectField from '../pct-delete-dialog/live-code-select-field';

import './style.scss';

const { Field, FormRadioGroupField } = Form;
const { ImageUploadFieldWithControlGroup } = EduImageUpload;

export default class extends PureComponent {
  renderCodeSetting() {
    const { joinGroupSetting } = this.props;
    const isFixed = joinGroupSetting.codeType === CODE_TYPE.FIXED_CODE;
    return (
      <>
        <Field
          name="groupPicture"
          label="上传二维码："
          tip="图片尺寸150*150px，小于3M"
          component={ImageUploadFieldWithControlGroup}
          uploadCls="column-upload"
          className={isFixed ? '' : 'hide-item'}
          needDetail
          value={joinGroupSetting.groupPicture}
          validations={{
            validData(values, value) {
              if (!isFixed) {
                return true;
              }
              if (value && value.cover) {
                return true;
              }
            }
          }}
          validationErrors={{
            validData: '必须上传二维码图片'
          }}
          required
        />
        <Field
          name="liveCode"
          className={isFixed ? 'live-code-form-row hide-item' : 'live-code-form-row'}
          value={joinGroupSetting.liveCode}
          label="活码："
          onChange={this.props.handleSetLiveCode}
          component={LiveCodeSelectField}
          codeId
          required
          validations={{ validData(values, value) {
            if (isFixed) {
              return true;
            }
            if (value && value.codeId) {
              return true;
            }
          } }}
          validationErrors={{
            validData: '请选择活码'
          }}
        />
      </>
    );
  }

  render() {
    const { joinGroupSetting } = this.props;
    return (
      <>
        <FormRadioGroupField
          name="codeType"
          label="推广码类型："
          value={joinGroupSetting.codeType}
          onChange={this.props.handleCodeTypeChange}
          required
        >
          <Radio value={CODE_TYPE.LIVE_CODE}>
            <span className="signin_text">
                活码
            </span>
            <Pop
              trigger="hover"
              content={
                <>
                  <div>根据扫码人数自动轮换微信号及</div>
                  <div>提供相应数据统计分析功能</div>
                </>
              }
            >
              <Icon className="signin_icon-help" type="help-circle-o" />
            </Pop>
          </Radio>
          <Radio value={CODE_TYPE.FIXED_CODE}>固定二维码</Radio>
        </FormRadioGroupField>
        {this.renderCodeSetting()}
      </>
    );
  }
}
