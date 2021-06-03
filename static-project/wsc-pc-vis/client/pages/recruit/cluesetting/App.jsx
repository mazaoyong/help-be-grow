
import { Pop, Form } from '@zent/compat';
import React, { PureComponent } from 'react';
import { Radio, Notify, Icon } from 'zent';
import { Button as SamButton } from '@youzan/sam-components';
import { isEduShop } from '@youzan/utils-shop';
import BootPage from '../clueplugin/App';

import { isInStoreCondition, ShowWrapper } from 'fns/chain';
import { createPluginWrapper } from '@ability-center/clue/plugin-framework';

import { menus } from '../common/clue-plugin-config';
import { getClueSettings, updateClueSetting, findPagePowerStaffs } from './api';

const { createForm, FormRadioGroupField, FormSelectField } = Form;

// 线索管理插件 微商城设置
const isEduChainMaster = isInStoreCondition({ supportEduHqStore: true });
const isEduSingle = isInStoreCondition({ supportEduSingleStore: true });
const isEduChainBranch = isInStoreCondition({ supportEduBranchStore: true });

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
      initialValue: { allowCampus, allowPhoneRepeat, distributeType, staffId },
      tempType,
      tempAllowCampus,
    } = this.state;
    return (
      <Form
        horizontal
        className="cluesetting"
        onSubmit={this.props.handleSubmit(this.handleSubmit)}
      >
        {/* 线索管理插件非教育店铺下的显示 */}
        <ShowWrapper isInStoreCondition={!isEduShop}>
          <FormRadioGroupField
            name="allowPhoneRepeat"
            label="允许手机号重复的线索"
            value={allowPhoneRepeat}
          >
            <Radio value={1}>允许</Radio>
            <Radio value={0}>不允许</Radio>
          </FormRadioGroupField>
        </ShowWrapper>
        <ShowWrapper isInStoreCondition={isEduChainMaster}>
          <FormRadioGroupField
            name="allowCampus"
            label="允许手机号重复的线索："
            value={allowCampus}
            onChange={this.handleAllowCampusChange}
          >
            <Radio value={1}>校区自主设置是否允许录入手机号重复的线索</Radio>
            <Radio value={0}>所有校区不允许录入手机号重复的线索</Radio>
          </FormRadioGroupField>
        </ShowWrapper>
        <ShowWrapper isInStoreCondition={isEduSingle || isEduChainBranch || tempAllowCampus}>
          <FormRadioGroupField
            name="allowPhoneRepeat"
            label={isEduChainMaster ? '' : '允许手机号重复的线索：'}
            value={allowPhoneRepeat}
            disabled={isEduChainBranch && !allowCampus}
          >
            <Radio value={1}>{isEduChainMaster ? '总部允许' : '允许'}</Radio>
            <Radio value={0}>
              {isEduChainMaster ? (
                '总部不允许'
              ) : (
                <span>
                    不允许
                  {isEduSingle ? null : (
                    <Pop
                      trigger="hover"
                      content="当总部设置所有校区均不可录入重复线索时，校区无修改权限"
                    >
                      <Icon type="help-circle-o" className="cluesetting-icon" />
                    </Pop>
                  )}
                </span>
              )}
            </Radio>
          </FormRadioGroupField>
        </ShowWrapper>
        <ShowWrapper isInStoreCondition={!isEduShop || isEduSingle || isEduChainBranch}>
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
                href="/v4/vis/edu/page/clue/source"
                style={{ marginLeft: '5px' }}
              >
                  查看系统默认来源
              </a>
            </p>
          </FormRadioGroupField>
        </ShowWrapper>
        <div className="footer">
          <SamButton name="编辑" type="primary" htmlType="submit" className="btn">
            保存
          </SamButton>
        </div>
      </Form>
    );
  }
}

export default createPluginWrapper({ title: '线索管理', BootPage, menus, enabled: !isEduShop })(createForm()(ClueSetting));
