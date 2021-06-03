
import { Form } from '@zent/compat';
import React, { PureComponent } from 'react';
import QRCodeSetting from '../qr-code-setting';
import QRCodeSettingText from '../qr-code-setting-text';

const { FormSection, FormCheckboxField } = Form;

export default class JoinGroupSetting extends PureComponent {
  state = {};

  handleCodeTypeChange = evt =>
    this.props.handleSetJoinGroup({
      ...this.props.joinGroupSetting,
      codeType: evt.target.value,
    });

  handleGroupStatusChange = evt =>
    this.props.handleSetJoinGroup({
      ...this.props.joinGroupSetting,
      groupOpen: evt.target.checked ? 1 : 0,
    });

  handleGroupModalChange = evt =>
    this.props.handleSetJoinGroup({
      ...this.props.joinGroupSetting,
      popupAfterPurchasingOpen: evt.target.checked ? 1 : 0,
    });

  handleCourseDetialChange = evt =>
    this.props.handleSetJoinGroup({
      ...this.props.joinGroupSetting,
      courseDetailPageOpen: evt.target.checked ? 1 : 0,
    });

  handleSetLiveCode = liveCode => {
    this.props.handleSetJoinGroup({
      ...this.props.joinGroupSetting,
      liveCode: liveCode,
    });
  };

  handleSussessPageChange = evt => {
    this.props.handleSetJoinGroup({
      ...this.props.joinGroupSetting,
      popupAfterPurchasingOpen: evt.target.checked ? 1 : 0,
    });
  };

  renderQRCode() {
    const { joinGroupSetting } = this.props;
    if (joinGroupSetting.groupOpen === 1) {
      return (
        <>
          <QRCodeSetting
            joinGroupSetting={joinGroupSetting}
            handleCodeTypeChange={this.handleCodeTypeChange}
            handleSetLiveCode={this.handleSetLiveCode}
          />
          <QRCodeSettingText
            joinGroupSetting={joinGroupSetting}
            handleCourseDetialChange={this.handleCourseDetialChange}
            handleGroupModalChange={this.handleGroupModalChange}
            handleSussessPageChange={this.handleSussessPageChange}
          />
        </>
      );
    }
    return null;
  }

  render() {
    const { joinGroupSetting } = this.props;
    return (
      <>
        <FormSection name="joinGroupSetting">
          <FormCheckboxField
            name="groupOpen"
            label="加粉推广："
            checked={joinGroupSetting.groupOpen === 1}
            onChange={this.handleGroupStatusChange}
          >
            开启
          </FormCheckboxField>
          {this.renderQRCode()}
        </FormSection>
      </>
    );
  }
}
