import { Form } from '@zent/compat';
import React, { FC, useState, useRef, useLayoutEffect, useEffect, useMemo } from 'react';
import { isEduSingleStore, isEduBranchStore, chainDisableForm } from 'fns/chain';
import CommonLink from 'components/common-link';

import { FieldLimit, FieldCancel, FieldAudition } from '@ability-center/appointment/settings';

import { IAppointmentConfigDTO } from './types';
import './styles.scss';

const { FormSection, FormCheckboxField, Field } = Form;

const showGeneralisedRule = isEduSingleStore || isEduBranchStore;
const shopAppointmentRuleConfigPage = `${_global.url.v4}/vis/edu/page/settings`;

const defaultAppointmentConfigDTO: IAppointmentConfigDTO = {
  isAppointmentLimit: 0,
  isIndependentConfig: 0,
  isCancelAppointment: 0,
  trialCourseOccupyQuota: 1
};

const AppointmentRuleConfig: FC<{ appointmentConfigDTO: IAppointmentConfigDTO, independentConfigVisible: boolean }> = ({
  appointmentConfigDTO,
  independentConfigVisible, // 是否禁用独立预约配置规则
}) => {
  const appointmentConfig = useMemo<IAppointmentConfigDTO>(() =>
    appointmentConfigDTO || defaultAppointmentConfigDTO, [appointmentConfigDTO]);

  const appointmentFieldValue = useMemo<Partial<IAppointmentConfigDTO>>(() => ({
    isAppointmentLimit: appointmentConfig.isAppointmentLimit,
    startAppointmentDay: appointmentConfig.startAppointmentDay,
    stopAppointmentHour: appointmentConfig.stopAppointmentHour,
  }), [
    appointmentConfig.isAppointmentLimit,
    appointmentConfig.startAppointmentDay,
    appointmentConfig.stopAppointmentHour,
  ]);

  const cancelationFieldValue = useMemo<Partial<IAppointmentConfigDTO>>(() => ({
    isCancelAppointment: appointmentConfig.isCancelAppointment,
    canCancelAppointmentHour: appointmentConfig.canCancelAppointmentHour,
  }), [
    appointmentConfig.isCancelAppointment,
    appointmentConfig.canCancelAppointmentHour,
  ]);

  const [enableIndependentConfig, toggleEnableIndependentConfig] =
    useState(!!appointmentConfig.isIndependentConfig); // 是否开启独立预约配置规则
  const [hasToggledCheckbox, setHasToggledCheckbox] = useState(false); // 用户是否操作了独立预约配置规则开关

  const dialogBottomRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (enableIndependentConfig && hasToggledCheckbox) {
      dialogBottomRef && dialogBottomRef.current!.scrollIntoView(false);
    }
  }, [hasToggledCheckbox, enableIndependentConfig]);

  useEffect(() => {
    toggleEnableIndependentConfig(!!appointmentConfig.isIndependentConfig);
  }, [appointmentConfig.isIndependentConfig]);

  const ChainDisabledFormSection = useMemo(() =>
    chainDisableForm(independentConfigVisible, FormSection), [independentConfigVisible]
  );

  return (<ChainDisabledFormSection name="appointmentConfigDTO">
    <FormCheckboxField
      value={enableIndependentConfig}
      label="规则配置："
      name="isIndependentConfig"
      onChange={e => {
        toggleEnableIndependentConfig(e.target.checked);
        setHasToggledCheckbox(true);
      }}
      helpDesc={
        <span>
          开启后，当前日程的预约规则不受店铺统一规则影响 {showGeneralisedRule
            ? <CommonLink className="link" displayType="link" url={shopAppointmentRuleConfigPage}>
              查看统一规则
            </CommonLink>
            : ''}
        </span>
      }
    >
      独立配置预约规则
    </FormCheckboxField>
    {enableIndependentConfig
      ? (
        <div className="appointment-independent-config">
          <Field
            name="appointment"
            label="预约规则:"
            required
            validations={{
              appointmentTime(_, value) {
                if (
                  !value.isAppointmentLimit ||
                  (value.startAppointmentDay * 24 > value.stopAppointmentHour)
                ) {
                  return true;
                }
              },
            }}
            validationErrors={{
              appointmentTime: '约课开始时间不能晚于结束时间',
            }}
            validateOnBlur={false}
            value={appointmentFieldValue}
            component={FieldLimit}
            inputWidth={51}
          />
          <Field
            name="cancel"
            label="取消规则:"
            required
            value={cancelationFieldValue}
            component={FieldCancel}
            inputWidth={51}
          />
          <Field
            name="trialCourseOccupyQuota"
            label="试听名额设置:"
            required
            value={appointmentConfig.trialCourseOccupyQuota}
            component={FieldAudition}
          />
          <div ref={dialogBottomRef}></div>
        </div>
      )
      : null
    }
  </ChainDisabledFormSection>);
};

export default AppointmentRuleConfig;
