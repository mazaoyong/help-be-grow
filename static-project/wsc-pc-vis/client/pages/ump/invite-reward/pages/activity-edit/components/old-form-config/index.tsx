import { Pop, Form } from '@zent/compat';
// import { FormDateRangePickerField } from '@zent/compat/formulr/form-components';
import React from 'react';
import { FormInputField, FormRadioGroupField, Radio, Icon, Button } from 'zent';
import { Link } from 'react-router';
import { Img } from '@youzan/ebiz-components';
import OldStudentRewardField from './old-student-reward-field';
import { NewStudentRewardField } from './new-student-reward-field';
import { CustomInfoCollectField } from '../../../../components/custom-info-collect-field';
import PosterSelectField from '../poster-select-field';
import OldStudentPosterField from '../old-student-poster-field';
import RichTextField from '../rich-text-field';
import { ActivityVersion } from '../../../../types';

const { FormDateRangePickerField } = Form;
const { ImgWrap } = Img;

const config = (activityVersion) => [
  {
    component: ({ children }) => (
      <div className="form-block">
        <h2 className="form-block-header">基础信息</h2>
        {children}
      </div>
    ),
    keyName: 'base-settings',
    children: [
      {
        label: '活动名称：',
        name: 'name',
        required: '请输入活动名称',
        type: 'field',
        component: FormInputField,
      },
      {
        label: '活动时间：',
        name: 'time',
        required: '请选择活动时间',
        type: 'field',
        component: FormDateRangePickerField,
        props: () => ({
          props: {
            disabled: true,
            showTime: true,
            format: 'YYYY-MM-DD HH:mm:ss',
            defaultTime: ['00:00:00', '23:59:59'],
          },
        }),
      },
    ],
  },
  {
    component: ({ children }) => (
      <div className="form-block">
        <h2 className="form-block-header">活动设置</h2>
        {children}
      </div>
    ),
    keyName: 'event-settings',
    destroyOnUnmount: false,
    children: [
      {
        label: '老学员设置：',
        name: 'oldStudentRule',
        required: '请输入老学员规则',
        type: 'field',
        component: FormRadioGroupField,
        props: () => ({
          props: {
            width: 314,
          },
        }),
        children: [{
          component: () => <div className="old-student-setting">
            <div className="old-student-setting__option">
              <Radio value={1}>
                购买过正式课/体验课的学员
                <Pop trigger="hover" content="包括在读、结业学员以及买过线下课程的潜在学员。">
                  <Icon className="tooltip" type="help-circle" />
                </Pop>
              </Radio>
            </div>
            <div>
              <Radio value={2}>当前在读学员</Radio>
            </div>
          </div>,
        }],
      },
      activityVersion === ActivityVersion.zero
        ? { // 老数据
          label: '老学员奖励规则：',
          name: 'oldStudentRewardRuleDesc',
          helpDesc: <>
            说明老学员奖励内容，可以赠送课程、优惠券、积分、实物。奖励需要商家进行手动发放，系统暂不支持自动发放。
            <div style={{ marginTop: 8 }}>
              <Pop
                trigger="hover"
                position="bottom-center"
                content={<div style={{ width: 240 }}>老学员是指在机构购买过正式课/体验课的学员。</div>}
              >
                <a>什么是老学员？</a>
              </Pop>
              <span className="operator-split">|</span>
              <Pop
                trigger="hover"
                position="bottom-center"
                content={
                  <div style={{ width: 353 }}>
                    <p>1、被介绍的新学员领取新学员奖励后，介绍人老学员即可获得1张100元优惠券、20积分；</p>
                    <p>2、被介绍的新学员有课程顾问跟进中，介绍人老学员即可获得1张200元优惠券、50积分；</p>
                    <p>3、被介绍的新学员报名正式课程后，介绍人老学员即可获得1张500元优惠券、83积分。</p>
                  </div>
                }
              >
                <a>查看示例</a>
              </Pop>
            </div>
          </>,
          required: '请输入老学员奖励规则',
          className: 'reward-input-field',
          type: 'field',
          component: FormInputField,
          props: () => ({
            props: {
              width: 314,
              placeholder: '活动奖励的详细规则说明，200个字以内',
              type: 'textarea',
              showCount: true,
              autoSize: true,
              maxLength: 200,
            },
          }),
        }
        : { // 新数据
          label: '老学员奖励规则：',
          name: 'oldStudentAwards',
          helpDesc: '系统暂不支持自动发放奖励，奖励内容需要商家进行手动发放。',
          required: '请设置老学员奖励',
          className: 'reward-input-field',
          component: OldStudentRewardField,
          destroyOnUnmount: false,
          defaultValue: [],
          props: () => ({
            props: {
              width: 314,
            },
          }),
        },
      {
        label: '新学员设置：',
        name: 'newStudentRule',
        required: '请输入新学员规则',
        type: 'field',
        component: FormRadioGroupField,
        props: () => ({
          props: {
            width: 314,
          },
        }),
        children: [{
          component: () => <div className="old-student-setting">
            <div className="new-student-setting__option">
              <Radio value={1}>线索池中不存在的线索</Radio>
            </div>
            <div className="new-student-setting__option">
              <Radio value={2}>未到店试听过的线索</Radio>
            </div>
            <div>
              <Radio value={3}>未购买正式课的线索</Radio>
            </div>
          </div>,
        }],
      },
      {
        label: '新学员奖励设置：',
        name: 'newStudentRewardSetting',
        required: true,
        helpDesc: <>
          建议设置分享活动或获得好友能量后发放奖励，提高活动曝光度，带来更多线索；系统暂时不支持自动发放奖励。
          <span>
            <Pop
              trigger="hover"
              position="bottom-center"
              content={<img width="182px" height="393px" src='//b.yzcdn.cn/public_files/13159368aecb6d223297c6a58d9ab267.png' />}
            >
              <a>查看示例</a>
            </Pop>
          </span>
        </>,
        defaultValue: {
          newStudentRewardSettingType: 1,
          newStudentRewardRuleDesc: '',
        },
        component: NewStudentRewardField,
      },
      {
        label: '新学员信息采集：',
        name: 'newStudentInfoCollectSetting',
        className: 'info-collect-field',
        required: true,
        helpDesc: <>
          设置新学员在领取奖励前，需要填写的信息，设置过多会影响新学员线索录入率。
          <Pop
            trigger="hover"
            position="bottom-center"
            content={<img src="https://b.yzcdn.cn/public_files/71b7d4fde6ff945e31bce810a5a8494d.png" />}
          >
            <a>查看示例</a>
          </Pop>
        </>,
        props: () => ({
          showDesc: false,
          disabled: true,
        }),
        defaultValue: { infoCollect: { customizeItems: [] }, needVerifyCode: 0 },
        component: CustomInfoCollectField,
      },
      {
        component: ({ children }) => (
          <div className="form-block">
            <h2 className="form-block-header">
              高级设置
            </h2>
            {children}
          </div>
        ),
        keyName: 'advanced-settings',
        children: [
          {
            label: '活动页风格：',
            name: 'posterStyle',
            required: '请选择活动页风格',
            component: PosterSelectField,
            defaultValue: 1,
            props: () => ({
              activityVersion
            })
          },
          {
            label: '老学员海报：',
            name: 'oldStudentPoster',
            required: '请选择老学员海报',
            component: OldStudentPosterField,
            defaultValue: {
              list: [],
            },
            props: () => ({
              activityVersion
            })
          },
          {
            label: '机构介绍：',
            name: 'constitutionDesc',
            component: RichTextField,
            type: 'field',
            fieldProps() {
              return {
                editorConfig: {
                  readonly: true,
                  wordCount: false,
                  initialFrameWidth: 600,
                },
              };
            },
          },
          {
            label: '活动参与人数：',
            name: 'showJoinNum',
            required: true,
            type: 'field',
            defaultValue: 1,
            className: 'form-joinnum-field',
            component: FormRadioGroupField,
            children: [
              {
                component: () => (
                  <>
                    <Radio value={1}>展示</Radio>
                    <Radio value={0}>不展示</Radio>
                  </>
                ),
              },
            ],
          },
          {
            label: '活动页推荐商品：',
            name: 'showRecommendGoods',
            required: true,
            type: 'field',
            defaultValue: 1,
            className: 'form-joinnum-field',
            component: FormRadioGroupField,
            children: [
              {
                component: () => (
                  <>
                    <Radio value={1}>
                      展示
                      <Pop
                        trigger="hover"
                        content={
                          <div className="example-pop">
                            <div className="groups">
                              <ImgWrap
                                width="200px"
                                height="504px"
                                src="https://img.yzcdn.cn/upload_files/2020/11/02/Fvvj0O7lJDs7dm9Y964kkSuDO7w_.png"
                                alt="图片示例"
                                backgroundColor="#FFF"
                              />
                            </div>
                          </div>
                        }
                      >
                        <span
                          style={{
                            paddingLeft: '15px',
                          }}
                          className="default-background-example ml-8"
                        >
                          查看示例
                        </span>
                      </Pop>
                    </Radio>
                    <Radio value={0}>不展示</Radio>
                  </>
                ),
              },
            ],
          },
        ]
      },
      {
        component: () => (
          <div className="edu-bottom_fixed">
            <Link to="list" style={{ marginLeft: 8 }}>
              <Button disabled={false}>
                返回
              </Button>
            </Link>
          </div>
        ),
      }
    ],
  },
];

export default config;
