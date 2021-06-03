import { useCallback, useEffect, useMemo, useState } from 'react';
import { get } from 'lodash';
import { IFormCreatorConfig } from '@youzan/ebiz-components/es/types/easy-form-archive';
import { Form, Notify } from 'zent';
import formatFields from './utils/format-fields';
import { getCompProps } from './utils/get-comp-props';
import { StudentProfileAPI } from '@ability-center/student';

export default function useFormFields({ applicableScene, profileFields }) {
  const getValidateOption = useCallback(() => Form.ValidateOption.IncludeAsync, []);
  const [remoteConf, setRemoteConf] = useState<Record<string, any>>({});

  // 在加载完成之后获取远程配置和学员信息
  useEffect(() => {
    StudentProfileAPI.getRemoteConf().then(setRemoteConf).catch(Notify.error);
  }, []);

  const formattedFields = useMemo(() => {
    if (profileFields.length === 0) {
      return [];
    }
    return formatFields(profileFields, applicableScene);
  }, [profileFields, applicableScene]);

  const formFields = useMemo<IFormCreatorConfig[]>(() => {
    if (formattedFields.length === 0) {
      return [];
    }

    // apollo配置
    let placeholders: string[] = [];
    if (remoteConf) {
      try {
        placeholders = get(remoteConf, 'placeholders', []);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    }
    const params = Object.assign({}, remoteConf, { placeholders });
    return formattedFields.map(config => {
      // 添加onChange事件
      const { name } = config;
      const { NodeConfig, props: passiveProps, formRenderProps } = getCompProps(config, params);
      const { validators, asyncValidators, ...otherFormRenderProps } = formRenderProps;
      return {
        name,
        label: passiveProps.label,
        type: NodeConfig.isField ? 'field' : '',
        required: passiveProps.required,
        props() {
          return NodeConfig.isField ? { props: passiveProps } : passiveProps || {};
        },
        defaultValue: passiveProps.defaultValue,
        component: NodeConfig.component,
        getValidateOption,
        validators: (validators || []).concat(asyncValidators),
        ...otherFormRenderProps,
      };
    });
  }, [formattedFields, getValidateOption, remoteConf]);
  return {
    formFields,
  };
}
