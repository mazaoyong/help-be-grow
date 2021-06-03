import React from 'react';
import { ZentForm } from 'zent/es/form/ZentForm';

import {
  EasyFormConfigType,
  EasyFormModelType,
  EasyFormStatusModelType,
  GroupEasyFormModel,
  GroupStatusModel,
  IGroupEasyFormConfigs,
  IListEasyFormConfigs,
  ListEasyFormModel,
  NormalEasyFormModel,
  NormalStatusModel,
} from '../types';
import { EasyFormNormalFieldRender } from './normal-field';
import { EasyFormGroupFieldRender } from './group-field';
import { EasyFormListFieldRender } from './list-field';

interface IEasyFormFieldRendererProps {
  addColon: boolean;
  config: EasyFormConfigType;
  valueForm: ZentForm<Record<string, EasyFormModelType>>;
  statusForm: ZentForm<Record<string, EasyFormStatusModelType>>;
  onChange(key: string, value: any): void;
}
export const RenderField: React.FC<IEasyFormFieldRendererProps> = (props) => {
  const { addColon, config, valueForm, statusForm, onChange } = props;
  const valueModel = valueForm.model.get(config.name);
  const statusModel = statusForm.model.get(config.name);

  const { isNormalConfig, isGroupConfig, isListConfig } = React.useMemo(
    () => ({
      isNormalConfig: !['__internal_list__', '__internal_group__'].includes(config.type),
      isListConfig: config.type === '__internal_list__',
      isGroupConfig: config.type === '__internal_group__',
    }),
    [config.type]
  );
  if (!valueModel) return null;

  return (
    <div data-testid="easy-form-field-render" className="easy-form form-field">
      {isNormalConfig && (
        <EasyFormNormalFieldRender
          config={config}
          onChange={onChange}
          addColon={addColon}
          model={valueModel as NormalEasyFormModel}
          statusModel={statusModel as NormalStatusModel}
        />
      )}
      {isListConfig && (
        <EasyFormListFieldRender
          addColon={addColon}
          onChange={onChange}
          config={config as IListEasyFormConfigs}
          model={valueModel as ListEasyFormModel}
          statusModel={statusModel as NormalStatusModel}
        />
      )}
      {isGroupConfig && (
        <EasyFormGroupFieldRender
          addColon={addColon}
          onChange={onChange}
          config={config as IGroupEasyFormConfigs}
          model={valueModel as GroupEasyFormModel}
          statusModel={statusModel as GroupStatusModel}
        />
      )}
    </div>
  );
};
