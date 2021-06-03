import React from 'react';
import { Form } from 'zent';
import {
  IEasyFormFieldRenderProps,
  IListEasyFormConfigs,
  ListEasyFormModel,
  ListStatusModel,
  NormalEasyFormModel,
} from '../types';
import { initModelValue } from '../utils/get-form-builder';
import { EasyFormNormalFieldRender } from './normal-field';
import { getDecoratedLabel } from '../hooks/use-form-configs';

const { useFieldArray } = Form;

export const EasyFormListFieldRender: React.FC<IEasyFormFieldRenderProps<
  ListEasyFormModel,
  ListStatusModel,
  IListEasyFormConfigs
>> = (props) => {
  const {
    addColon,
    model: valueRef,
    statusModel: statusRef,
    config: listConfig,
    onChange: formChangeCallback,
  } = props;
  const listModels = useFieldArray(valueRef);
  const listStatus = React.useMemo(() => statusRef.getRawValue(), [statusRef]);

  const RepeatTriggerNode = React.useMemo(() => listConfig.repeatTrigger, [
    listConfig.repeatTrigger,
  ]);

  const getListItemKey = React.useCallback(
    (index: number) => {
      if (listConfig.getRepeatKey) return listConfig.getRepeatKey(listConfig.listName, index);
      return listConfig.listName + index;
    },
    [listConfig]
  );

  const handleListChange = React.useCallback(
    (modifyIdx?: number) => {
      return (_?: any, value?: any) => {
        if (modifyIdx !== undefined) {
          const modifiedKey = `${listConfig.listName}[${modifyIdx}]`;
          formChangeCallback(modifiedKey, value);
        }
        const newListValues = listModels.getRawValue();
        formChangeCallback(listConfig.listName, newListValues);
        listConfig.onChange && listConfig.onChange(newListValues);
      };
    },
    [formChangeCallback, listConfig, listModels]
  );

  const addListItems = React.useCallback(
    (addCount?: number, presetValue?: any) => {
      const itemConfigTpl = listConfig.repeatConfig;
      if (presetValue) itemConfigTpl.defaultValue = presetValue;
      const addonItems = new Array(addCount || 1).fill(initModelValue(itemConfigTpl));
      listModels.push(...addonItems);
      handleListChange()();
    },
    [handleListChange, listConfig.repeatConfig, listModels]
  );

  const deleteItems = React.useCallback(
    (deleteCount?: number, startIndex?: number) => {
      if (deleteCount === undefined && startIndex === undefined) listModels.pop();
      else listModels.splice(startIndex || 0, deleteCount || 1);
      handleListChange()();
    },
    [handleListChange, listModels]
  );

  return (
    <div data-testid="easy-form-list-field" className="easy-form list-field">
      <RepeatTriggerNode
        {...listConfig.fieldProps}
        {...(listStatus as any)}
        label={getDecoratedLabel(listConfig.label, { addColon })}
        methods={{ add: addListItems, delete: deleteItems }}
      >
        {listModels.children.map((listChildModel, index) => {
          const listChildConfig = listConfig.repeatConfig || {};
          const config = {
            ...listChildConfig,
            label: getDecoratedLabel(listChildConfig.label, {
              addColon,
              fieldName: listConfig.listName,
              filedIndex: index,
            }),
          };
          return (
            <EasyFormNormalFieldRender
              {...listStatus}
              addColon={addColon}
              config={config}
              key={getListItemKey(index)}
              model={listChildModel as NormalEasyFormModel}
              onChange={handleListChange(index)}
              statusModel={statusRef}
            />
          );
        })}
      </RepeatTriggerNode>
    </div>
  );
};
