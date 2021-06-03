import { Pop } from '@zent/compat';
import React from 'react';
import { FormInputField } from 'zent';
import { IFormCreatorConfig } from '@youzan/ebiz-components/es/types/easy-form-archive';
import get from 'lodash/get';
import OldStudentRewardField from '../old-student-reward-field';

const oldStudentAwardValidator = (val) => {
  if (val && val.length) {
    for (let i = 0; i < val.length; i++) {
      const contentLen = get(val[i], 'awards.[0].awardBizId.length');
      if (!contentLen || contentLen > 20) {
        return {
          name: 'OldStudentReward Error',
        };
      };
    };
    return null;
  }
  return null;
};

const useOldStudentReward = ({ staleData = false }): IFormCreatorConfig => {
  const oldStudentRewardRuleField = staleData
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
      destroyOnUnmount: false,
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
      validators: [
        val => oldStudentAwardValidator(val),
      ],
    };

  return oldStudentRewardRuleField;
};

export default useOldStudentReward;
