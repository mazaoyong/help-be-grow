import { Pop } from '@zent/compat';
import React from 'react';
import { FormInputField, Radio, FormRadioGroupField, Form, Validators, Button, Icon } from 'zent';
import { Button as SamButton } from '@youzan/sam-components';
import { Link } from 'react-router';
import { date } from '@youzan/utils';

import { CustomInfoCollectField } from '../../../../components/custom-info-collect-field';
import TimeField from '../time-field';
import OldStudentRewardField, { NodeType } from '../old-student-reward-field';
import { NewStudentRewardField } from '../new-student-reward-field';
import { NewStudentRewardDisplayField } from '../new-student-reward-display-field';
import AdvancedSettings from '../advanced-settings';

import {
  NewStudentRewardSettingType,
  OldStudentSettingType,
  NewStudentSettingType,
  NewStudentRewardDisplaySettingType,
} from '../../../../types';
import { hasWeappBinded } from '../../../../constants';
import { validAwardItem, validAwards } from '../../utils';
import { checkTimeRange } from '../../../../api';

interface CheckTimeRangeParams {
  command: {
    startAt: string;
    endAt: string;
    excludeId?: string;
  };
}

const config = ({
  getDisabled,
  editType,
  id,
  showApplySchool,
  changeHasRuleInput,
  handleClickSubmitBtn,
}) => {
  return [
    {
      component: ({ children }) => (
        <div className="form-block">
          <h2 className="form-block-header">基础信息</h2>
          {children}
        </div>
      ),
      keyName: 'base-settings',
      destroyOnUnmount: false,
      children: [
        {
          label: '活动名称：',
          name: 'name',
          required: '请输入活动名称',
          validators: [Validators.maxLength(20, '最多可输入20个字')],
          type: 'field',
          destroyOnUnmount: false,
          component: FormInputField,
          props: () => ({
            props: {
              width: 240,
              placeholder: '20个字以内，如：春季转介绍活动',
            },
            disabled: getDisabled('name'),
          }),
        },
        {
          label: '活动时间：',
          name: 'time',
          required: '请选择活动时间',
          destroyOnUnmount: false,
          component: TimeField,
          props: () => ({
            disabled: [getDisabled('startTime'), getDisabled('endTime')],
          }),
          defaultValue: [],
          getValidateOption() {
            return Form.ValidateOption.IncludeAsync;
          },
          validators: [
            Form.createAsyncValidator((val: number[]) => {
              if (!val[0] || !val[1]) {
                return Promise.resolve({
                  name: 'time',
                  message: '请选择活动时间',
                });
              }

              const params: CheckTimeRangeParams = {
                command: {
                  startAt: date.makeDateTimeStr(val[0]),
                  endAt: date.makeDateTimeStr(val[1]),
                },
              };

              if (editType === 'edit') params.command.excludeId = id;

              return checkTimeRange(params)
                .then(res => {
                  if (res) {
                    return {
                      name: 'time',
                      message: '该活动时间内已存在其他转介绍活动，请重新选择',
                    };
                  }
                })
                .catch(err => ({
                  name: 'time',
                  message: err,
                }));
            }),
          ],
        },
        {
          label: '适用校区：',
          name: 'applySchool',
          required: '请选择适用校区',
          destroyOnUnmount: false,
          show: {
            value: showApplySchool,
          },
          defaultValue: 0,
          component: ({ disabled }) => {
            return (
              <Radio disabled={disabled} checked>
                全部校区
              </Radio>
            );
          },
          props: () => ({
            disabled: getDisabled('applySchool'),
          }),
        },
      ],
    },
    {
      component: ({ children }) => (
        <div className="form-block">
          <h2 className="form-block-header">活动对象</h2>
          {children}
        </div>
      ),
      keyName: 'event-object',
      destroyOnUnmount: false,
      children: [
        {
          label: '老学员设置：',
          name: 'oldStudentRule',
          required: '请输入老学员规则',
          type: 'field',
          destroyOnUnmount: false,
          component: FormRadioGroupField,
          props: () => ({
            props: {
              width: 314,
              disabled: getDisabled('oldStudentRule'),
            },
          }),
          defaultValue: OldStudentSettingType.unlimit,
          children: [
            {
              component: () => (
                <div className="old-student-setting">
                  <div className="old-student-setting__option">
                    <Radio value={OldStudentSettingType.unlimit}>不限制</Radio>
                  </div>
                  <div className="old-student-setting__option">
                    <Radio value={OldStudentSettingType.potential}>
                      购买过课程的学员
                      <Pop trigger="hover" content="包括购买过线上课和线下课的全部学员">
                        <Icon className="tooltip" type="help-circle" />
                      </Pop>
                    </Radio>
                  </div>
                  <div>
                    <Radio value={OldStudentSettingType.official}>当前在读学员</Radio>
                  </div>
                </div>
              ),
            },
          ],
        },
        {
          label: '新学员设置：',
          name: 'newStudentRule',
          required: '请输入新学员规则',
          type: 'field',
          destroyOnUnmount: false,
          component: FormRadioGroupField,
          props: () => ({
            props: {
              width: 314,
              disabled: getDisabled('newStudentRule'),
            },
          }),
          defaultValue: NewStudentSettingType.notInCluepool,
          children: [
            {
              component: () => (
                <div className="old-student-setting">
                  <div className="new-student-setting__option">
                    <Radio value={NewStudentSettingType.notInCluepool}>线索池中不存在的线索</Radio>
                  </div>
                  <div className="new-student-setting__option">
                    <Radio value={NewStudentSettingType.notTrialed}>未到店试听过的线索</Radio>
                  </div>
                  <div>
                    <Radio value={NewStudentSettingType.notPurchased}>未购买正式课的线索</Radio>
                  </div>
                </div>
              ),
            },
          ],
        },
        {
          label: '新学员信息采集：',
          name: 'newStudentInfoCollectSetting',
          className: 'info-collect-field',
          required: true,
          destroyOnUnmount: false,
          helpDesc: (
            <>
              设置新学员在领取奖励前，需要填写的信息，设置过多会影响新学员线索录入率。
              <Pop
                trigger="hover"
                position="bottom-center"
                content={
                  <img
                    width="200px"
                    src="https://b.yzcdn.cn/public_files/77a3aadd4a058f854e98c192f4b09f64.png"
                  />
                }
              >
                <a>查看示例</a>
              </Pop>
            </>
          ),
          props: () => ({
            showDesc: false,
            disabled: getDisabled('newStudentInfoCollectSetting'),
          }),
          defaultValue: { infoCollect: { customizeItems: [] }, needVerifyCode: 0 },
          component: CustomInfoCollectField,
        },
      ],
    },
    {
      component: ({ children }) => (
        <div className="form-block">
          <h2 className="form-block-header">奖励设置</h2>
          {children}
        </div>
      ),
      keyName: 'reward-settings',
      destroyOnUnmount: false,
      children: [
        {
          label: '老学员奖励设置：',
          name: 'oldStudentAwards',
          required: '请设置老学员奖励',
          className: 'reward-input-field',
          component: OldStudentRewardField,
          destroyOnUnmount: false,
          defaultValue:
            editType === 'add'
              ? {
                [NodeType.SHARE]: {
                  name: '',
                  couponList: [],
                  presentList: [],
                  pointCount: undefined,
                },
              }
              : {},
          props: () => ({
            props: {
              width: 314,
            },
            disabled: getDisabled('oldStudentAwards'),
          }),
          validators: [
            val => {
              if (Object.keys(val).length === 0) {
                return {
                  name: 'oldStudentAwards',
                  message: '请至少选择一个阶段奖励',
                };
              }
              if (!validAwards(val)) {
                return {
                  name: 'oldStudentAwards',
                };
              }
            },
          ],
        },
        {
          label: '新学员奖励设置：',
          name: 'newStudentRewardSetting',
          required: true,
          destroyOnUnmount: false,
          helpDesc: (
            <>
              建议设置分享活动或获得好友能量后发放奖励，提高活动曝光度，带来更多线索；系统暂时不支持自动发放奖励。
              <span>
                <Pop
                  trigger="hover"
                  position="bottom-center"
                  content={
                    <img
                      width="182px"
                      height="393px"
                      src="https://b.yzcdn.cn/public_files/95ef66432bb6db074ced465832950c42.jpg"
                    />
                  }
                >
                  <a>查看示例</a>
                </Pop>
              </span>
            </>
          ),
          props: () => ({
            supportWeapp: hasWeappBinded,
            disabled: getDisabled('newStudentRewardSetting'),
          }),
          component: NewStudentRewardField,
          defaultValue: {
            newStudentRewardSettingType:
              editType !== 'add'
                ? -1
                : hasWeappBinded
                  ? NewStudentRewardSettingType.share
                  : NewStudentRewardSettingType.noRule,
            couponList: [],
            presentList: [],
            friendHelpTotalNum: 0,
          },
          validators: [
            val => {
              if (
                val.newStudentRewardSettingType === NewStudentRewardSettingType.friendHelp &&
                !val.friendHelpTotalNum
              ) {
                return {
                  name: 'newStudentRewardSetting',
                  message: '请设置好友人数',
                };
              }
              if (!validAwardItem(val)) {
                return {
                  name: 'newStudentRewardSetting',
                };
              }
            },
          ],
        },
        {
          label: '新学员奖励展示：',
          name: 'newStudentRewardDisplaySetting',
          required: true,
          destroyOnUnmount: false,
          component: NewStudentRewardDisplayField,
          defaultValue: {
            type: NewStudentRewardDisplaySettingType.priceAndTitle,
            price: 3000,
            priceLabel: '课程大礼包',
            title: '',
          },
          helpDesc: '展示活动的总奖励金额，有利于提升学员参与活动的意愿。',
          props: () => ({
            disabled: getDisabled('newStudentRewardDisplaySetting'),
          }),
          validators: [
            val => {
              const { price, priceLabel, title } = val;
              if (val.type === NewStudentRewardDisplaySettingType.priceAndTitle) {
                if (!price || price <= 0 || price > 999999 || !priceLabel || priceLabel.length > 10) {
                  return {
                    name: 'newStudentRewardDisplaySetting'
                  };
                }
              } else if (val.type === NewStudentRewardDisplaySettingType.onlyTitle) {
                if (!title || title.length > 20) {
                  return {
                    name: 'newStudentRewardDisplaySetting'
                  };
                }
              }
            }
          ],
        },
      ],
    },
    AdvancedSettings({ getDisabled, changeHasRuleInput }),
    {
      component: () => (
        <div className="edu-bottom_fixed">
          {editType !== 'detail' && (
            <SamButton
              name="转介绍编辑"
              type="primary"
              htmlType="submit"
              onClick={() => {
                handleClickSubmitBtn();
              }}
            >
              保存
            </SamButton>
          )}
          <Link to="list" style={{ marginLeft: 8 }}>
            <Button disabled={false}>{editType !== 'detail' ? '取消' : '返回'}</Button>
          </Link>
        </div>
      ),
    },
  ];
};

export default config;
