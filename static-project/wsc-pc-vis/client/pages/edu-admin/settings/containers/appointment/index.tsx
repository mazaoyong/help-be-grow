
import { Form } from '@zent/compat';
import React, { PureComponent } from 'react';

import { BlockLoading, Notify } from 'zent';
import { Button as SamButton } from '@youzan/sam-components';
import FieldAudition from '../../components/FieldAudition';
import FieldLimit from '../../components/FieldLimit';
import FieldCancel from '../../components/FieldCancel';
import FieldConflict from '../../components/field-conflict';
import { getAppointmentConfig, updateAppointmentConfig, isShopAppointmentConfigIndependent } from '../../api';
import { chainSupportHqAndSingle } from '../../chain';
import { chainDisableForm, showWrapper } from 'fns/chain';
import addZero from '@youzan/utils/string/addZero';

const { createForm, Field, FormTimeRangePickerField } = Form;

interface AppointmentSettingsProps {
  handleSubmit: Function;
}

class AppointmentSettings extends PureComponent<AppointmentSettingsProps> {
  configuration = {
    appointment: ['isAppointmentLimit', 'startAppointmentDay', 'stopAppointmentHour'],
    cancel: ['isCancelAppointment', 'canCancelAppointmentHour'],
    signin: ['signInRule', 'startSignInRuleHour', 'stopSignInRuleHour'],
    timeRange: [ 'kanbanStartTime', 'kanbanEndTime' ],
  };

  state = {
    loading: false,
    data: {
      isAppointmentLimit: 0,
      isCancelAppointment: 0,
      signInRule: 0,
      startAppointmentDay: 1,
      kanbanStartTime: 420,
      kanbanEndTime: 1320,
      trialCourseOccupyQuota: 0,
      isAllowConflict: 1
      // id: undefined,
    },
    enableAppointmentConfig: chainSupportHqAndSingle,
  };
  componentDidMount() {
    this.wrapLoading(
      Promise.all([getAppointmentConfig(), isShopAppointmentConfigIndependent()])
        .then(data => {
          const [appointmentConfig, enableAppointmentConfig] = data;
          if (!data || !appointmentConfig) {
            return;
          }
          // format data to make it suitable for number input
          if (!appointmentConfig.startAppointmentDay) {
            appointmentConfig.startAppointmentDay = 1;
          }
          this.setState({
            data: appointmentConfig,
            enableAppointmentConfig,
          });
        })
        .catch(e => {
          Notify.error(e || '获取预约配置失败，请稍后重试');
        }),
    );
  }

  getTimeRange = (timeRange) => {
    if (!timeRange || !timeRange.kanbanEndTime) {
      return ['07:00', '22:00'];
    }
    const startHour = Math.floor(timeRange.kanbanStartTime / 60);
    const startMin = timeRange.kanbanStartTime % 60;
    const endHour = Math.floor(timeRange.kanbanEndTime / 60);
    const endMin = timeRange.kanbanEndTime % 60;
    return [`${addZero(startHour)}:${addZero(startMin)}`, `${addZero(endHour)}:${addZero(endMin)}`];
  }

  getTimeMins = (timeString) => {
    if (!timeString) {
      return timeString;
    }
    const hourandMin = timeString.split(':');
    return parseInt(hourandMin[0]) * 60 + parseInt(hourandMin[1]);
  }

  handleSubmit = data => {
    const formatData = Object.assign({}, data, {
      timeRange: {
        kanbanStartTime: this.getTimeMins(data.timeRange[0]),
        kanbanEndTime: this.getTimeMins(data.timeRange[1]),
      },
    });
    const result = this.unfoldData(formatData);
    this.wrapLoading(
      updateAppointmentConfig(Object.assign(result, {
        trialCourseOccupyQuota: data.trialCourseOccupyQuota,
        isAllowConflict: data.conflict
      })).then(() => getAppointmentConfig().then(data => {
        this.setState({ data });
        Notify.success('保存成功');
      })),
    );
  };

  // fold and unfold data
  foldData = data => {
    const { configuration } = this;
    return Object.keys(configuration)
      .map(key => ({
        [key]: configuration[key]
          .map(subKey => ({ [subKey]: data[subKey] }))
          .reduce((obj, subItem) => Object.assign(obj, subItem), {}),
      }))
      .reduce((obj, item) => Object.assign(obj, item), {});
  };

  unfoldData = data =>
    Object.keys(data)
      .map(key => data[key])
      .reduce((obj, item) => {
        return Object.assign(obj, item);
      }, {});

  // wrap loading
  wrapLoading(promise) {
    this.setState({ loading: true });
    promise
      .catch(err => {
        Notify.error(err);
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  }

  render() {
    const { handleSubmit } = this.props;
    const { loading, data, enableAppointmentConfig } = this.state;
    const { trialCourseOccupyQuota, isAllowConflict } = data;
    const { appointment, cancel, timeRange } = this.foldData(data);

    const ChainDisabledForm = chainDisableForm(enableAppointmentConfig, Form);
    const ChainSaveButton = showWrapper(enableAppointmentConfig, SamButton);
    return (
      <BlockLoading loading={loading}>
        <div className="edu-settings">
          <ChainDisabledForm horizontal onSubmit={handleSubmit(this.handleSubmit)}>
            <Field
              name="appointment"
              label="预约规则:"
              value={appointment}
              asyncValidation={(_, value) => {
                if (
                  !value.isAppointmentLimit ||
                  (value.startAppointmentDay * 24 > value.stopAppointmentHour)
                ) {
                  return Promise.resolve();
                }
                return Promise.reject('约课开始时间不能晚于结束时间');
              }}
              component={FieldLimit}
            />
            <Field
              name="cancel"
              label="取消规则:"
              value={cancel}
              component={FieldCancel}
            />
            <Field
              name="conflict"
              label="冲突规则:"
              value={isAllowConflict}
              component={FieldConflict}
            />
            <Field
              name="trialCourseOccupyQuota"
              label="试听名额设置:"
              value={trialCourseOccupyQuota}
              component={FieldAudition}
            />
            {<FormTimeRangePickerField
              label='课程表看板时间:'
              name="timeRange"
              value={this.getTimeRange(timeRange)}
              canClear={false}
              required
              validations={{
                required(_, values) {
                  if (!values || !values[0] || !values[1]) {
                    return '请输入看板时间';
                  }
                  return true;
                },
              }}
            />}
            <div className="edu-bottom_fixed">
              <ChainSaveButton name="编辑预约设置" type="primary" htmlType="submit" loading={loading}>
                保存
              </ChainSaveButton>
            </div>
          </ChainDisabledForm>
        </div>
      </BlockLoading>
    );
  }
}

export default createForm({ scrollToError: true })(AppointmentSettings);
