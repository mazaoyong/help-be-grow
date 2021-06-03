import { Form } from '@zent/compat';
import React, { PureComponent } from 'react';
import { BlockLoading, BlockHeader } from 'zent';
import { Button as SamButton } from '@youzan/sam-components';
import pick from 'lodash/pick';
import RewardNodeField from '../fields/reward-node';
import CourseField from '../fields/course-selector';
// import { arrayColumnWrapper, isInStoreCondition } from 'fns/chain';
import AwardField from '../fields/awards';
import CourseTypeField from '../fields/course-type';
import AwardDisplayField from '../fields/award-display-config';
import supportShopField from '../fields/support-shop';
import ActivityNameField from '../fields/activity-name';
import ActivityTimeField from '../fields/activity-time';

const { createForm } = Form;

// 所有field的属性
const globalProps = ['zentForm', 'isView', 'isAdd'];

const ActivityNameFieldWrap = {
  key: 'activityNameField',
  label: '活动名称：',
  props: ['activityName'],
  field: ActivityNameField,
};

const ActivityTimeFieldWrap = {
  key: 'activityTimeField',
  label: '活动时间：',
  props: ['activityTime'],
  field: ActivityTimeField,
};

const courseFieldWrap = {
  key: 'courseProduct',
  label: '活动课程：',
  props: ['courseProduct', 'rewardType'],
  hideOnProcess: true,
  field: CourseField,
};

const rewardNodeFieldWrap = {
  key: 'rewardNode',
  label: '发放节点：',
  props: ['courseProduct', 'rewardNode', 'startRewardType', 'endRewardType', 'rewardType'],
  field: RewardNodeField,
};

const awardFieldWrap = {
  key: 'award',
  label: '奖励内容：',
  props: ['courseProduct', 'awardType', 'coupon', 'pointNumber', 'rewardType'],
  field: AwardField,
};

const courseTypeFieldWrap = {
  key: 'courseType',
  label: '线下课类型：',
  props: [
    'courseProduct',
    'rewardNode',
    'awardType',
    'givenClassTime',
    'courseType',
    'trialCourse',
    'rewardType',
  ],
  field: CourseTypeField,
};

const awardDisplayFieldWrap = {
  key: 'awardDisplay',
  label: '展示设置：',
  props: ['awardDisplay'],
  hideOnProcess: true,
  field: AwardDisplayField,
};

const supportShopFieldWrap = {
  key: 'supportShop',
  label: '适用校区',
  props: ['campusList', 'campusType'],
  field: supportShopField,
};

const regions = [
  {
    title: '基础设置',
    fields: [ActivityNameFieldWrap, ActivityTimeFieldWrap, courseFieldWrap],
  },
  // {
  //   title: '发放节点设置',
  //   fields: [rewardNodeFieldWrap, startRewardSettingFieldWrap, endRewardSettingFieldWrap],
  // },
  {
    title: '奖励设置',
    fields: [
      rewardNodeFieldWrap,
      awardFieldWrap,
      courseTypeFieldWrap,
      awardDisplayFieldWrap,
      supportShopFieldWrap,
    ],
  },
];

class EditRewardForm extends PureComponent {
  render() {
    const { loading, handleSubmit, onSubmit, cancelForm, isView, rewardType } = this.props;
    return (
      <div className="edit-rewards-form">
        <BlockLoading loading={loading}>
          <Form horizontal onSubmit={handleSubmit(onSubmit)}>
            {regions.map((item, index) => {
              return (
                <div key={index}>
                  {item.title && <BlockHeader type="minimum" title={item.title} />}
                  {item.fields
                    .filter(item => !(item.hideOnProcess && rewardType === 'processing'))
                    .map(fieldItem => {
                      const itemLabel = fieldItem.label;
                      const ItemField = fieldItem.field;
                      return (
                        <ItemField
                          key={fieldItem.key}
                          label={itemLabel}
                          {...pick(this.props, globalProps.concat(fieldItem.props))}
                        ></ItemField>
                      );
                    })}
                </div>
              );
            })}
            <div className="app-design">
              <div className="app-action">
                {!isView && (
                  <SamButton name="编辑" type="primary" htmlType="submit">
                    保存
                  </SamButton>
                )}
                <SamButton onClick={cancelForm}>取消</SamButton>
              </div>
            </div>
          </Form>
        </BlockLoading>
      </div>
    );
  }
}

export default createForm()(EditRewardForm);
