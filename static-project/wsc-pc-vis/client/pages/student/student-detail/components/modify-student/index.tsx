import React, { useMemo, useState, useEffect, FC, useRef, useCallback, ComponentType } from 'react';
import { EasyFormArchive } from '@youzan/ebiz-components';
import { Notify, BlockLoading, Form, IValidators } from 'zent';
import { get, find } from 'lodash';

import { StudentProfileAPI, getStudentInfoByNo, DataType } from '@ability-center/student';

import formatFields, { getAge } from './utils/format-fields';
import { ICustomProfileProps, IProfileField, IApolloRes, IFormatSubmitOptions } from './types';
import './styles/index.scss';

import getComponentNode from './utils/get-component-node';
import getBasicProps from './utils/get-basic-props';
import getSpecialProps from './utils/get-special-props';
import { IFormCreatorConfig } from '@youzan/ebiz-components/es/types/easy-form-archive';
import { ZentForm } from 'zent/es/form/ZentForm';

const { EasyForm } = EasyFormArchive;

const { ValidateOption } = Form;

function fetchStudentUpdateItemByStudentNo({ identityNo, clueId }) {
  return getStudentInfoByNo({ identityNo, clueId })
    .then(res => get(res, 'attributeItems', []))
    .then(studentProfile => {
      const defaultValues = getDefaultValue(studentProfile);
      return defaultValues;
    });
}

const CustomProfile: FC<ICustomProfileProps> = props => {
  const {
    applicableScene,
    refreshSignal = 0,
    submitSignal = 0,
    validateSignal,
    onSubmit,
    studentNo,
    clueId,
    fetchProfileApi = StudentProfileAPI.getListByApplicableScene,
    fetchStudentInfoApi = fetchStudentUpdateItemByStudentNo,
    formatSubmitOptions,
  } = props;
  const [profileFields, setProfileFields] = useState<IProfileField[]>([]);
  const [remoteConf, setRemoteConf] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const EasyFormRef = useRef<ZentForm<any>>();

  const getValidateOption = useCallback(() => Form.ValidateOption.IncludeAsync, []);

  const handleSubmit = useCallback(
    (form: ZentForm<any>) => {
      const formValues = form.getValue();
      const submitData: Record<string, any>[] = [];
      Object.keys(formValues).forEach((keyOrId: string) => {
        const targetValue = get(formValues, keyOrId);
        const targetKey = Number(keyOrId) ? 'attributeId' : 'attributeKey';
        const target = find(profileFields, { [targetKey]: Number(keyOrId) || keyOrId });
        if (target) {
          submitData.push({
            attributeKey: get(target, 'attributeKey'),
            attributeId: get(target, 'attributeId'),
            dataType: get(target, 'dataType'),
            value: targetValue,
          });
        }
      });
      if (onSubmit) {
        onSubmit(formatSubmitValues(submitData, formatSubmitOptions));
      }
    },
    [onSubmit, profileFields],
  );

  // 在加载完成之后获取远程配置和学员信息
  useEffect(() => {
    setLoading(true);
    StudentProfileAPI.getRemoteConf()
      .then(setRemoteConf)
      .then(() => setLoading(false))
      .catch(Notify.error);
    if (studentNo) {
      fetchStudentInfoApi({ identityNo: String(studentNo), clueId })
        .then(values => {
          if (EasyFormRef.current) {
            EasyFormRef.current.patchValue(values);
          }
        })
        .catch(Notify.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 根据更新信号获取资料项配置
  useEffect(() => {
    setLoading(true);
    // 获取配置信息
    fetchProfileApi({ applicableScene })
      .then(d => {
        setProfileFields(d);
      })
      .then(() => setLoading(false))
      .catch(Notify.error);
  }, [applicableScene, refreshSignal]);

  // submit
  useEffect(() => {
    if (EasyFormRef.current && submitSignal > 0) {
      EasyFormRef.current.submit();
    }
  }, [submitSignal]);

  const formattedFields = useMemo(() => {
    if (profileFields.length === 0) {
      return [];
    }
    return formatFields(profileFields, applicableScene);
  }, [profileFields, applicableScene]);

  const formConfig = useMemo<IFormCreatorConfig[]>(() => {
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

  useEffect(() => {
    if (!EasyFormRef.current) return;
    const value = EasyFormRef.current?.getValue();
    if (!Object.keys(value).length) return;
    if (!formConfig.length) return;

    if (validateSignal && EasyFormRef.current) {
      EasyFormRef.current.validate(
        ValidateOption.IncludeAsync |
          ValidateOption.IncludeChildrenRecursively |
          ValidateOption.IncludeUntouched,
      );
    }
  }, [EasyFormRef.current?.getValue(), formConfig, validateSignal]);

  return (
    <BlockLoading loading={loading} className="custom-profile">
      <EasyForm
        ref={form => (EasyFormRef.current = form)}
        layout="horizontal"
        config={formConfig}
        onSubmit={handleSubmit}
      >
        {props.children}
      </EasyForm>
    </BlockLoading>
  );
};

interface IGetCompPropsRes {
  NodeConfig: { isField: boolean; component: ComponentType<any> };
  props: Record<string, any>;
  formRenderProps: {
    validators: IValidators<any>;
    asyncValidators: IValidators<any>;
  } & Record<string, any>;
}
function getCompProps(field: IProfileField, params: IApolloRes): IGetCompPropsRes {
  const { placeholders, ...otherRemoteConfigs } = params;
  const NodeConfig = getComponentNode(field);
  const basicProps = getBasicProps(field, placeholders);
  const { validators, asyncValidators, watch, ...specialProps } = getSpecialProps(
    field,
    otherRemoteConfigs,
  );

  return {
    NodeConfig,
    props: {
      ...basicProps,
      ...specialProps,
    },
    formRenderProps: {
      validators: validators || [],
      asyncValidators: asyncValidators || [],
      watch,
    },
  };
}

export default CustomProfile;
export { getAge };
export type { ICustomProfileProps };

function getDefaultValue(studentProfile: Record<string, any>[]) {
  const defaultValues: Record<string, any> = {};
  studentProfile.forEach(item => {
    const defaultValue = get(item, 'value');
    const itemKey = get(item, 'attributeKey') || get(item, 'attributeId');
    if (itemKey && defaultValue) {
      defaultValues[itemKey] = defaultValue;
    }
  });
  return defaultValues;
}

const defaultEncodeOptions: IFormatSubmitOptions = {
  addressFormatter: addresses => {
    return JSON.stringify(addresses);
  },
  selectFormatter: rawValue => {
    return get(rawValue, 'text', rawValue);
  },
  genderFormatter: rawValue => {
    return rawValue;
  },
};

export function formatSubmitValues(
  submitValues: Record<string, any>[],
  options?: IFormatSubmitOptions,
) {
  const mergeOptions = options
    ? Object.assign({}, defaultEncodeOptions, options)
    : defaultEncodeOptions;
  const formatValues: Record<string, any>[] = [];
  if (submitValues.length) {
    submitValues.forEach(item => {
      const dataType = item.dataType as DataType;
      const rawValue: any = item.value;
      formatValues.push(
        Object.assign({}, item, {
          value: encodeByDataType(rawValue, dataType, mergeOptions, item.attributeKey),
        }),
      );
    });
  }
  return formatValues;
}

function encodeByDataType(
  rawValue: any,
  dataType: DataType,
  options: IFormatSubmitOptions,
  attributeKey?: string,
) {
  let res = rawValue || '';
  // const isString = typeof res === 'string' ? 'default' : false;

  switch (dataType) {
    case DataType.IMAGE:
      // 图片可能是数组，可能是字符串
      if (typeof rawValue === 'string') {
        res = rawValue;
      } else {
        res = (rawValue || []).join(',');
      }
      break;
    case DataType.SELECT:
      if (options.selectFormatter && attributeKey) {
        res = options.selectFormatter(rawValue);
      } else {
        res = get(rawValue, 'value', rawValue);
      }
      break;
    case DataType.MULTI_SELECT:
      if (rawValue && typeof rawValue !== 'string') {
        res = ((rawValue as string[]) || []).join(',');
      }
      break;
    case DataType.ADDRESS:
    case DataType.PROVINCE:
      try {
        if (typeof rawValue === 'string') {
          res = rawValue;
        } else {
          // 检测地址第一项
          const isValid = get(rawValue, '[0].name') !== undefined;
          if (!isValid || !options.addressFormatter) {
            res = '';
            break;
          }
          res = options.addressFormatter(rawValue);
        }
      } catch (err) {
        console.error(err);
      }
      break;
    case DataType.GENDER:
      if (options.genderFormatter) {
        res = options.genderFormatter(rawValue);
      }
      break;
    default:
      break;
  }
  return res;
}
