import React from 'react';
import cx from 'classnames';
import { Icon } from 'zent';
import {
  GroupEasyFormModel,
  GroupStatusModel,
  IEasyFormFieldRenderProps,
  IGroupEasyFormConfigs,
} from '../types';
import { EasyFormNormalFieldRender } from './normal-field';

type EasyFromGroupCollapseState = 'disabled' | 'expand' | 'collapse';
export const EasyFormGroupFieldRender: React.FC<IEasyFormFieldRenderProps<
  GroupEasyFormModel,
  GroupStatusModel,
  IGroupEasyFormConfigs
>> = (props) => {
  const {
    addColon,
    model: valueRef,
    statusModel: statusRef,
    config: groupConfig,
    onChange: formChangeCallback,
  } = props;
  const [collapseState, setCollapseState] = React.useState<EasyFromGroupCollapseState>(
    groupConfig.collapse ? 'expand' : 'disabled'
  );
  const groupStatus = React.useMemo(() => {
    const selfStatusModel = statusRef.get('self');
    if (!selfStatusModel) return {};
    return selfStatusModel.getRawValue();
  }, [statusRef]);

  /**
   * group类型中，通知key改变应该再做一层包裹，用于命中对应的订阅器，比如：
   * groupName: foo, (改变的)name: boo，则正确的key为foo.boo，则触发
   * watch函数为foo.boo的函数，修改则是model.get(foo).get(boo).value
   */
  const handleGroupChange = React.useCallback(
    (key: string, value: any) => {
      const updateKey = `${groupConfig.groupName}.${key}`;
      formChangeCallback(updateKey, value);
      const newGroupValues = valueRef.getRawValue();
      formChangeCallback(groupConfig.groupName, newGroupValues);
      groupConfig.onChange && groupConfig.onChange(newGroupValues);
    },
    [groupConfig, formChangeCallback, valueRef]
  );

  const configChildren = React.useMemo(() => groupConfig.config, [groupConfig.config]);
  const collapseCls = React.useMemo(() => {
    if (['expand', 'collapse'].includes(collapseState)) {
      return `group-${collapseState}`;
    }
    return undefined;
  }, [collapseState]);
  const toggleCollapseState = React.useCallback(
    () =>
      setCollapseState((prevState) => {
        if (prevState === 'collapse') return 'expand';
        else return 'collapse';
      }),
    []
  );

  /** 如果不存在model，就返回null */
  if (!valueRef) return null;

  return (
    <div data-testid="easy-form-group-field" className="easy-form group-field">
      {!groupConfig.hideGroupHeader && (
        <div className="easy-form group-field__header">
          <div className="easy-form group-field__group-title">{groupConfig.groupTitle}</div>
          {collapseState !== 'disabled' && (
            <div className="easy-form group-field__collapse-trigger" onClick={toggleCollapseState}>
              <span className="easy-form group-field__collapse-text">
                {collapseState === 'expand' ? '收起' : '展开'}
              </span>
              <Icon
                className="easy-form group-field__collapse-icon"
                type={collapseState === 'expand' ? 'up' : 'down'}
              />
            </div>
          )}
        </div>
      )}
      <div className={cx('easy-form group-field__body', collapseCls)}>
        {configChildren && configChildren.length
          ? configChildren.map((childConfig) => {
              const curValueModel = valueRef.get(childConfig.name);
              const curStatusModel = statusRef.get(childConfig.name);
              if (!curValueModel) return null;
              return (
                <EasyFormNormalFieldRender
                  {...groupStatus}
                  addColon={addColon}
                  config={childConfig}
                  key={childConfig.name}
                  model={curValueModel}
                  onChange={handleGroupChange}
                  statusModel={curStatusModel!}
                />
              );
            })
          : null}
      </div>
    </div>
  );
};
