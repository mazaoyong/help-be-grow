
import { Form } from '@zent/compat';
import React, { useEffect, useState } from 'react';

import { BlockLoading, Notify } from 'zent';
import { Button as SamButton } from '@youzan/sam-components';
import FieldSignIn from '../../components/FieldSignIn';
import FieldWriteOff from '../../components/FieldWriteOff';
import { getEduConfig, updateEduConfig } from '../../api';
import { chainSupportHqAndSingle } from '../../chain';
import { chainDisableForm, showWrapper } from 'fns/chain';

const ChainDisabledForm = chainDisableForm(chainSupportHqAndSingle, Form);
const ChainSaveButton = showWrapper(chainSupportHqAndSingle, SamButton);
const { createForm, Field } = Form;

interface EliminateSettingsProps {
  handleSubmit: Function;
}

interface EliminateData {
  isAppointmentLimit: number;
  isCancelAppointment: number;
  signInRule: number;
  writeOffRule: number;
  startAppointmentDay: number;
  kanbanStartTime: number;
  kanbanEndTime: number;
  trialCourseOccupyQuota: number;
  id?: number;
}

const configuration = {
  appointment: ['isAppointmentLimit', 'startAppointmentDay', 'stopAppointmentHour'],
  cancel: ['isCancelAppointment', 'canCancelAppointmentHour'],
  writeOff: ['writeOffRule', 'writeOffRuleLeave', 'writeOffRuleTruancy'],
  signin: ['signInRule', 'startSignInRuleHour', 'stopSignInRuleHour'],
  timeRange: [ 'kanbanStartTime', 'kanbanEndTime' ],
};

/** @fixme 当前zent版本7.0.0-next.39的Form的问题，createForm函数组件需要forwardRef传ref，等升级zent后用Form.useForm重构 */
const EliminateSettings = React.forwardRef(
  function EliminateSettings(props: EliminateSettingsProps, ref: React.Ref<HTMLDivElement>) {
    const [loading, setLoading] = useState(false);
    const [savedData, setSavedData] = useState<EliminateData>({
      isAppointmentLimit: 0,
      isCancelAppointment: 0,
      signInRule: 0,
      writeOffRule: 0,
      startAppointmentDay: 1,
      kanbanStartTime: 420,
      kanbanEndTime: 1320,
      trialCourseOccupyQuota: 0,
    });

    // wrap loading
    const wrapLoading = (promise) => {
      setLoading(true);
      promise
        .catch(err => {
          Notify.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    useEffect(() => {
      wrapLoading(
        getEduConfig().then(data => {
          if (!data) {
            return;
          }
          // format data to make it suitable for number input
          if (!data.startAppointmentDay) {
            data.startAppointmentDay = 1;
          }
          setSavedData({ ...data });
        }),
      );
    }, []);

    // fold and unfold data
    const foldData = data => {
      return Object.keys(configuration)
        .map(key => ({
          [key]: configuration[key]
            .map(subKey => ({ [subKey]: data[subKey] }))
            .reduce((obj, subItem) => Object.assign(obj, subItem), {}),
        }))
        .reduce((obj, item) => Object.assign(obj, item), {});
    };

    const unfoldData = data =>
      Object.keys(data)
        .map(key => data[key])
        .reduce((obj, item) => {
          return Object.assign(obj, item);
        }, {});

    const submit = data => {
      const formatData = data;
      const result = unfoldData(formatData);
      if (!savedData.id) {
        Notify.error('网络异常，请刷新页面重试');
        return;
      }
      wrapLoading(
        updateEduConfig(Object.assign(result, {
          id: savedData.id,
          trialCourseOccupyQuota: data.trialCourseOccupyQuota,
        })).then(() => getEduConfig().then((data: EliminateData) => {
          setSavedData(data);
          Notify.success('保存成功');
        })),
      );
    };

    const { handleSubmit } = props;
    const { writeOff, signin } = foldData(savedData);
    return (
      <BlockLoading loading={loading}>
        <div className="edu-settings eliminate" ref={ref}>
          <ChainDisabledForm horizontal onSubmit={handleSubmit(submit)}>
            <Field
              name="writeOff"
              label="消课规则:"
              value={writeOff}
              component={FieldWriteOff}
            />
            <Field
              name="signin"
              label="学员签到规则:"
              value={signin}
              component={FieldSignIn}
            />
            <div className="edu-bottom_fixed">
              <ChainSaveButton name="编辑消课设置" type="primary" htmlType="submit" loading={loading}>
                保存
              </ChainSaveButton>
            </div>
          </ChainDisabledForm>
        </div>
      </BlockLoading>
    );
  }
);

export default createForm({ scrollToError: true })(EliminateSettings);
