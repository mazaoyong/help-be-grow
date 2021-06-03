import React, { FC, useState, useCallback, useMemo, ReactNode, useEffect } from 'react';
import { Icon, Checkbox } from 'zent';
import isExpand from './is-expand';

import { IAttributeDTO, BooleanLike } from './types';

const { Group: CheckboxGroup } = Checkbox;
const requiredAttributeInClue = ['edu_stuName', 'edu_stuContractPhone']; // 这里不需要区分微商城还是教育店铺，attributeKey是一样的

const InfoCollectionBox: FC<{
  value: number[];
  tempValue: string;
  expandLimit?: number;
  isInClue: BooleanLike;
  attributeItems: IAttributeDTO[];
  onChange(selectList: number[]): void;
  render?: React.ComponentType<{ item: IAttributeDTO }>;
  disabled?: boolean;
}> = (props) => {
  const {
    value,
    render,
    isInClue = false,
    onChange,
    tempValue,
    attributeItems,
    expandLimit = 6,
    disabled,
  } = props;
  const numberingTempValue = useMemo(
    () =>
      tempValue
        .split(',')
        .map(Number)
        .filter((v) => !isNaN(v)),
    [tempValue],
  );
  const currentValue = tempValue === '' ? value : numberingTempValue;
  const [expand, setExpand] = useState(isExpand(attributeItems, currentValue, expandLimit));

  const toggleExpand = useCallback(() => setExpand(!expand), [expand]);

  const CHECKBOX_ITEMS = useMemo<ReactNode[]>(() => {
    if (attributeItems.length > 0) {
      return attributeItems.map((setting) => {
        const { attributeId, attributeKey, attributeTitle } = setting;
        const isDisabled =
          isInClue === BooleanLike.True && requiredAttributeInClue.includes(attributeKey);

        if (render) {
          const Component = render;
          return <Component item={setting} key={attributeId} />;
        }

        return (
          <Checkbox disabled={disabled || isDisabled} key={attributeId} value={attributeId}>
            {attributeTitle}
          </Checkbox>
        );
      });
    }
    return [];
  }, [attributeItems, disabled, isInClue, render]);

  const VISIBLE_CHECKBOX_ITEMS = useMemo<ReactNode[] | null>(() => {
    let visibleCheckboxItems: ReactNode[] | null = null;
    if (CHECKBOX_ITEMS.length) {
      visibleCheckboxItems = CHECKBOX_ITEMS.slice(0, expandLimit);
      if (expand) {
        visibleCheckboxItems = CHECKBOX_ITEMS;
      }
    }
    return visibleCheckboxItems;
  }, [CHECKBOX_ITEMS, expand, expandLimit]);

  // 需要在组件载入的时候触发onChange事件
  // 用于处理用户关闭信息采集又开启之后没有选择任何一个采集项导致formValue没有及时更新的问题
  useEffect(() => {
    props.onChange(currentValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 处理isInClue的情况
  useEffect(() => {
    if (isInClue) {
      const selectedItems = attributeItems.filter((item) =>
        currentValue.includes(item.attributeId),
      );
      const hasRequiredItems =
        selectedItems.length > 0 &&
        selectedItems.filter((item) => requiredAttributeInClue.includes(item.attributeKey))
          .length === requiredAttributeInClue.length;
      if (!hasRequiredItems) {
        const newSelectedValues = selectedItems
          .filter((item) => !requiredAttributeInClue.includes(item.attributeKey))
          .concat(
            attributeItems.filter((item) => requiredAttributeInClue.includes(item.attributeKey)),
          )
          .map((item) => item.attributeId);
        onChange(newSelectedValues);
      }
    }
  }, [attributeItems, currentValue, isInClue, onChange]);

  return (
    <div className="info-collect__setting-box">
      <div className="info-collect__wrapper">
        <CheckboxGroup value={currentValue || []} onChange={onChange}>
          {VISIBLE_CHECKBOX_ITEMS}
        </CheckboxGroup>
      </div>
      {attributeItems.length > 6 && (
        <p className="info-collect__line info-collect__expand">
          <a onClick={toggleExpand}>
            {expand ? '收起' : '展开'}
            <Icon type="down" className={expand ? 'icon-arrow-up' : ''} />
          </a>
        </p>
      )}
    </div>
  );
};

// function isEditMode(): boolean {
//   return /edit\//.test(window.location.href);
// }

export default InfoCollectionBox;
