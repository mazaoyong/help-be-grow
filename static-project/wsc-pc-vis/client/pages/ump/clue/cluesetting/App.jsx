
import { Form } from '@zent/compat';
import React, { PureComponent } from 'react';
import { Radio, Notify } from 'zent';
import { Button as SamButton } from '@youzan/sam-components';
import BootPage from '../clueplugin/App';

import { createPluginWrapper } from '@ability-center/clue/plugin-framework';

import { menus } from '../common/clue-plugin-config';
import { getClueSettings, updateClueSetting, findPagePowerStaffs } from './api';

const { createForm, FormRadioGroupField, FormSelectField } = Form;

class ClueSetting extends PureComponent {
  // 回填选项
  state = {
    initialValue: {
      allowCampus: 0,
      allowPhoneRepeat: 1,
      distributeType: 0,
      auditionSetting: 0,
    },
    staff: [],
    tempType: 0,
    tempAllowCampus: 0,
    tempAuditionSetting: 0,
  };

  componentDidMount() {
    getClueSettings().then(data => {
      const { allowCampus = 0, allowPhoneRepeat = 0, autoAddClueSetting, auditionSetting = 0 } =
        data || {};
      const { distributeType = 1, staffId = 0 } = autoAddClueSetting || {};
      // 回填选项
      this.setState({
        initialValue: {
          allowCampus,
          allowPhoneRepeat,
          distributeType,
          staffId,
          auditionSetting,
        },
        tempType: distributeType,
        tempAllowCampus: allowCampus,
        tempAuditionSetting: auditionSetting,
      });
    });
    findPagePowerStaffs().then(data => {
      this.setState({
        staff: data.map(item => ({
          text: item.name,
          value: item.adminId,
        })),
      });
    });
  }

  // 提交修改
  handleSubmit = values => {
    const {
      distributeType,
      staffId = null,
      allowPhoneRepeat = 0,
      allowCampus,
      auditionSetting,
    } = values;
    const payload = {
      allowCampus,
      allowPhoneRepeat,
      auditionSetting,
      autoAddClueSetting: {
        distributeType,
      },
    };

    if (staffId) {
      const selectedStaff =
        (this.state.staff && this.state.staff.find(curStaff => curStaff.value === staffId)) || {};
      const staffName = selectedStaff.text;
      payload.autoAddClueSetting.staffName = staffName;
      payload.autoAddClueSetting.staffId = staffId;
    }

    updateClueSetting(payload)
      .then(() => {
        Notify.success('设置成功');
      })
      .catch(err => {
        Notify.error(err);
      });
  };

  handleAllowCampusChange = e => {
    this.setState({ tempAllowCampus: e.target.value });
  };

  handleAuditionSettingChange = e => {
    this.setState({ tempAuditionSetting: e.target.value });
  };

  render() {
    const {
      initialValue: { allowPhoneRepeat, distributeType, staffId },
      tempType,
    } = this.state;
    return (
      <Form
        horizontal
        className="cluesetting"
        onSubmit={this.props.handleSubmit(this.handleSubmit)}
      >
        <FormRadioGroupField
          name="allowPhoneRepeat"
          label="允许手机号重复的线索"
          value={allowPhoneRepeat}
        >
          <Radio value={1}>允许</Radio>
          <Radio value={0}>不允许</Radio>
        </FormRadioGroupField>
        <FormRadioGroupField
          name="distributeType"
          label="线索默认分配规则："
          value={distributeType}
          onChange={e => {
            this.setState({ tempType: e.target.value });
            setTimeout(this.props.zentForm.asyncValidateForm);
          }}
        >
          <Radio value={1}>进入公海池</Radio>
          <Radio value={2}>默认分配给</Radio>
          <FormSelectField
            name="staffId"
            className="no-required inline-ele"
            disabled={tempType !== 2}
            filter={(item, keyword) => {
              return item.text.includes(keyword);
            }}
            value={staffId}
            data={this.state.staff}
            asyncValidation={(values, value) => {
              if (values.distributeType === 2 && !value) {
                return Promise.reject('请选择员工');
              }
              return Promise.resolve();
            }}
          />
          <p className="description">
              通过系统默认来源收集的线索，均适用该分配规则
            <a
              target="_blank"
              href="/v4/vis/ump/clue/source"
              style={{ marginLeft: '5px' }}
            >
                  查看系统默认来源
            </a>
          </p>
        </FormRadioGroupField>
        <div className="footer">
          <SamButton name="编辑" type="primary" htmlType="submit" className="btn">
            保存
          </SamButton>
        </div>
      </Form>
    );
  }
}

export default createPluginWrapper({ title: '线索管理', BootPage, menus, enabled: true })(createForm()(ClueSetting));
