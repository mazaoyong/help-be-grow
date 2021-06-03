
import { Pop, Form } from '@zent/compat';
/* eslint-disable eqeqeq */
import React, { Component } from 'react';
import { Button, Radio } from 'zent';

import { pctCheck } from 'fns/auth';
import { daysDiff } from 'fns/time-diff';
import get from 'lodash/get';

import AlertTimeField from './field/AlertTime';
import ParticipateField from './field/Participate';
import RewardField from './field/Reward';

const {
  createForm,
  Field,
  FormInputField,
  FormCheckboxField,
  FormRadioGroupField,
  FormNumberInputField,
  FormDateRangePickerField,
} = Form;

class Step2Form extends Component {
  preStep = () => {
    this.props.preStep(this.props.zentForm.getFormValues());
  };

  save = data => {
    pctCheck().then(() => {
      this.props.zentForm.asyncValidateForm(() => {
        this.props.onSubmit(data);
      });
    });
  };

  renderButtonPreview = () => {
    const preview = (
      <section className="button-copy-preview">
        <img src="https://img.yzcdn.cn/wsc/paidcontent/punch/punchcopy.png" alt="" />
        <p className="text">{get(this.props, 'data.buttonCopy') || '我要打卡'}</p>
      </section>
    );

    return (
      <section>
        该文案将在打卡详情页中的打卡按钮上显示。
        <Pop trigger="click" position="right-center" content={preview}>
          <span className="cursor-link">查看示例</span>
        </Pop>
      </section>
    );
  };

  render() {
    const {
      cycle,
      everydayAlert,
      repairLimit,
      allowStudentView,
      allowStudentEdit,
      buttonCopy,
      openReward,
      gciRewardSetting,
      totalDaysCondition,
      participate,
      sellTimeType,
      proceedStatus,
    } = this.props.data;
    const { handleSubmit, isEdit, loading } = this.props;
    const { pointsName } = _global;

    let diffDays = 0;
    if (cycle.length === 2 && cycle[1] !== '') {
      diffDays = daysDiff(cycle[0], cycle[1]) + 1;
    }

    // 打卡周期最长为365天，打卡开始时间需在100天之内
    let maxCycle = new Date(new Date().toDateString()).getTime();
    if (cycle.length === 0 || cycle[0] === '') {
      maxCycle += 99 * 24 * 60 * 60 * 1000;
    }
    if (cycle.length > 0 && cycle[0] !== '') {
      maxCycle = new Date(cycle[0]).getTime();
      maxCycle += 364 * 24 * 60 * 60 * 1000;
    }

    return (
      <Form horizontal className="split-form" onSubmit={handleSubmit(this.save)}>
        <i className="split" />
        <h3 className="split-title"> 规则设置 </h3>
        <FormDateRangePickerField
          name="cycle"
          label="打卡周期："
          value={cycle}
          helpDesc={`共计${diffDays}天，创建后不可更改`}
          min={new Date()}
          max={maxCycle}
          required
          disabled={isEdit}
          onChange={val => this.props.onStateChange({ cycle: val })}
          asyncValidation={(_, value) => {
            return new Promise((resolve, reject) => {
              if (!value[0]) {
                return reject('必须选择一个开始时间');
              } else if (!value[1]) {
                return reject('必须选择一个结束时间');
              } else if (
                !isEdit &&
                value[0] &&
                value[0] !== '' &&
                daysDiff(value[0], new Date().toDateString()) > 99
              ) {
                return reject('打卡开始日期请在99天之内');
              } else if (value[0] && value[1] && daysDiff(value[0], value[1]) > 365) {
                return reject('打卡周期不能超过365天');
              }
              resolve();
            });
          }}
        />
        <Field
          name="everydayAlert"
          label="每日提醒："
          component={AlertTimeField}
          value={everydayAlert}
          disabled={proceedStatus === 3}
          validations={{
            validData(_, value) {
              if (value.type === 1) {
                return !!value.time;
              }
              return true;
            },
          }}
          validationErrors={{
            validData: '必须选择提醒时间',
          }}
          required
        />
        <FormNumberInputField
          name="repairLimit"
          label="补打卡次数："
          showStepper
          value={repairLimit}
          min={0}
          disabled={diffDays === 0}
          max={diffDays}
          autoComplete="off"
          width="80px"
          helpDesc="设置学员对非当日内容进行补打卡次数"
        />
        <FormRadioGroupField
          name="allowStudentView"
          label="学员查看权限："
          value={allowStudentView}
          required
          validations={{
            required: true,
          }}
          validationErrors={{
            required: '请填写打卡名称',
          }}
        >
          <Radio value={1}>不限制学员查看打卡区内容</Radio>
          <br />
          <Radio value={0}>打卡后才可查看打卡区内容</Radio>
        </FormRadioGroupField>
        <FormRadioGroupField
          name="allowStudentEdit"
          label="学员编辑权限："
          value={allowStudentEdit}
          required
          validations={{
            required: true,
          }}
          validationErrors={{
            required: '请填写打卡名称',
          }}
        >
          <Radio value={1}>不限制学员编辑已打卡内容</Radio>
          <br />
          <Radio value={0}>学员打卡后不可再次编辑已打卡内容</Radio>
        </FormRadioGroupField>
        <FormInputField
          name="buttonCopy"
          label="打卡按钮文案："
          type="text"
          width="183px"
          autoComplete="off"
          placeholder="我要打卡"
          value={buttonCopy}
          onChange={evt => this.props.onStateChange({ buttonCopy: evt.target.value })}
          maxLength={8}
          helpDesc={this.renderButtonPreview()}
        />
        <h3 className="split-title" style={{ marginTop: '40px' }}> 奖励设置 </h3>
        <FormCheckboxField
          name="openReward"
          label="打卡奖励："
          helpDesc="打卡周期生效后打卡奖励相关内容不可更改。"
          value={openReward}
          disabled={proceedStatus === 2 || proceedStatus === 3}
          onChange={evt => this.props.onStateChange({ openReward: evt.target.checked })}
        >
          开启
        </FormCheckboxField>
        {openReward && [
          <Field
            name="gciRewardSetting"
            key="gciRewardSetting"
            className="reward-field"
            label="奖励内容："
            component={RewardField}
            disabled={proceedStatus === 2 || proceedStatus === 3}
            value={gciRewardSetting}
            required
            asyncValidation={(_, value) => {
              return new Promise((resolve, reject) => {
                if (!value.couponChecked && !value.scoreChecked) {
                  return reject('请选择打卡奖励');
                } else {
                  if (value.couponChecked) {
                    if (get(value, 'coupon.length') <= 0) {
                      return reject('请选择优惠券');
                    } else if (value.coupon.map(item => +item.rewardCount).reduce((acc, cur) => acc + cur) > 5) {
                      return reject(' ');
                    }
                  }
                  const scoreCount = get(value, 'score.rewardCount');

                  if (value.scoreChecked && (!scoreCount || scoreCount <= 0)) {
                    return reject(`请填写${pointsName}`);
                  }
                }
                resolve();
              });
            }}
          />,
          <FormNumberInputField
            name="totalDaysCondition"
            key="totalDaysCondition "
            className="total-days-field"
            label="发放条件："
            width="240px"
            disabled={diffDays === 0 || proceedStatus === 2 || proceedStatus === 3}
            max={diffDays}
            min={0}
            autoComplete="off"
            addonBefore="打卡累计"
            addonAfter={
              <span>
                <span className="suffix">天</span> 后发放
              </span>
            }
            value={totalDaysCondition}
            required
            validations={{
              required: true,
              min: (_, value) => {
                return !(value <= 0);
              },
            }}
            validationErrors={{
              required: '请填写发放条件',
              min: '发放条件必须超过一天',
            }}
          />,
        ]}
        <h3 className="split-title" style={{ marginTop: '40px' }}> 其他 </h3>
        <Field
          name="participate"
          label="参与方式："
          className="participate-field"
          helpDesc="打卡创建成功后参与方式不可更改"
          disabled={isEdit}
          component={ParticipateField}
          onChange={(e, val) => this.props.onStateChange({ participate: val })}
          value={participate}
          required
          asyncValidation={(_, value) => {
            return new Promise((resolve, reject) => {
              if (value.way === 2 && value.price <= 0) {
                return reject('价格必须大于0');
              } else if (value.way === 3 && value.columnAlias === '') {
                return reject('请选择专栏');
              } else if (value.way === 4) {
                if (value.password === '') {
                  return reject('请设置密码');
                } else if (value.passwordCopy === '') {
                  return reject('请设置默认文案');
                }
              } else if (value.way === 4 && /\W/.test(value.password)) {
                return reject('密码只能由数字、字母和下划线组成');
              }
              resolve();
            });
          }}
        />
        <FormRadioGroupField
          name="sellTimeType"
          label="上架状态："
          value={sellTimeType}
          required
          validations={{
            required: true,
          }}
          validationErrors={{
            required: '请填写打卡名称',
          }}
        >
          <Radio value={1}>立即上架</Radio>
          <br />
          <Radio value={3}>暂不上架</Radio>
        </FormRadioGroupField>
        <div className="app-design">
          <div className="app-actions">
            <div className="form-actions new-actions text-center">
              <Button onClick={this.preStep}>上一步</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                保存
              </Button>
            </div>
          </div>
        </div>
      </Form>
    );
  }
}

export default createForm({ scrollToError: true })(Step2Form);
