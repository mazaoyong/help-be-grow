import React from 'react';

import get from 'lodash/get';

import SyncDropDown from './SyncDropDown';
import { IEbizSelectDropDownProps, IOption } from '../types';
import { setSelectedFlag } from '../utils/handle-select-options';
import AsyncDropDown from './AsyncDropDown';

const EbizDropDownProvider: React.FC<IEbizSelectDropDownProps> = (props) => {
  const {
    mode,
    selectedOpts,
    options = [],
    visible = false,
    noKeyboardHandle,
    filter: enabledOrPredicate,
    ...passiveProps
  } = props;
  const [availableIndex, setAvailableIndex] = React.useState(-1);
  const UListRef = React.useRef<HTMLUListElement>(null);

  const passiveClassName = React.useMemo(
    () => (props.tags ? 'multi-select-dropdown' : 'single-select-dropdown'),
    [props.tags]
  );

  const availableOptions = React.useMemo(
    () =>
      options
        .map((opt, index) => Object.assign({}, opt, { _index: index }))
        .filter((opt) => !opt.disabled && !opt.isGroup),
    [options]
  );

  const pressDown = React.useCallback(() => {
    setAvailableIndex((prevVal) => {
      if (availableOptions.length) {
        const curVal = prevVal + 1;
        if (curVal <= availableOptions.length - 1) return curVal;
      }
      return prevVal;
    });
  }, [availableOptions]);

  const pressUp = React.useCallback(() => {
    setAvailableIndex((prevVal) => {
      if (availableOptions.length) {
        const curVal = prevVal - 1;
        if (curVal >= 0) return curVal;
      }
      return prevVal;
    });
  }, [availableOptions]);

  const pressEnter = React.useCallback(() => {
    if (availableIndex >= 0) {
      const currentKeyboardSelectIndex = availableOptions[availableIndex]._index;
      const currentKeyboardSelectOpt = options[currentKeyboardSelectIndex];
      props.handleSelect(currentKeyboardSelectOpt);
    }
  }, [availableIndex, availableOptions, options, props]);

  const handleKeyboardEvents = React.useCallback(
    (code: string): boolean => {
      switch (code) {
        case 'ArrowUp':
          pressUp();
          return true;
        case 'ArrowDown':
          pressDown();
          return true;
        case 'Enter':
          pressEnter();
          return true;
        default:
          return false;
      }
    },
    [pressDown, pressEnter, pressUp]
  );

  React.useEffect(() => {
    if (!noKeyboardHandle) {
      if (!visible) {
        setAvailableIndex(-1);
        safeScrollArea = [0, 7];
      }
      return bindKeyboardEvents(visible, handleKeyboardEvents);
    }
  }, [handleKeyboardEvents, noKeyboardHandle, visible]);

  // 选中的值对应的选项中的序列的值是多少
  const keyboardIndex = React.useMemo(
    () => get(availableOptions, `[${availableIndex}]._index`, -1),
    [availableIndex, availableOptions]
  );
  // 根据键盘事件改变选中的选项的值改变ul的上边距
  React.useEffect(() => adjustUListScrollTop(UListRef, keyboardIndex), [keyboardIndex]);

  const highlightKeywords = React.useCallback(
    (passOptions: IOption[]) => {
      if (mode === 'sync' && passiveProps.keyword) {
        if (enabledOrPredicate) {
          const keywordMatch = new RegExp(escapeRegChars(passiveProps.keyword), 'g');
          const defaultFilterFunc = (optionText: string) => keywordMatch.test(optionText);

          const filterFunc =
            typeof enabledOrPredicate === 'function' ? enabledOrPredicate : defaultFilterFunc;
          return passOptions
            .filter((option) => !option.isGroup && !option.disabled)
            .filter((option) => filterFunc(option.text, option));
        }
      }

      return passOptions;
    },
    [enabledOrPredicate, mode, passiveProps.keyword]
  );
  const filteredOptions = React.useMemo(() => {
    // 设置键盘事件
    let passOptions = setSelectedFlag(options, selectedOpts, keyboardIndex);
    passOptions = highlightKeywords(passOptions);
    return passOptions;
  }, [highlightKeywords, keyboardIndex, options, selectedOpts]);

  const nodes = React.useMemo(
    () =>
      mode === 'sync' ? (
        <SyncDropDown
          {...passiveProps}
          ref={UListRef}
          options={filteredOptions}
          className={passiveClassName}
        />
      ) : (
        <AsyncDropDown
          {...passiveProps}
          ref={UListRef}
          options={filteredOptions}
          className={passiveClassName}
        />
      ),
    [filteredOptions, mode, passiveClassName, passiveProps]
  );

  return nodes;
};

export default EbizDropDownProvider;

function bindKeyboardEvents(visible: boolean, fn: (code: string) => boolean) {
  const initEvent = (evt: KeyboardEvent) => {
    // 如果被劫持了按键行为，就阻止事件默认行为
    const isHijacked = fn(evt.code);
    if (isHijacked) evt.preventDefault();
  };
  const init = () => window.addEventListener('keydown', initEvent, true);
  const remove = () => window.removeEventListener('keydown', initEvent, true);
  if (visible) init();
  else remove();

  return remove;
}

/**
 * 调整位置算法：
 * 下拉框，一次最多展示8条数据，所有在0-7（安全区）范围内的上下移动，都不需要调整
 * 指针位置；但是当指针的位置超过上限之后，就将范围上、下限+1，并添加偏移量让选择
 * 的内容展示在范围内；当指针继续运动，如果超过选项的最大高度，即指针变为0（或者最
 * 上面的一个可选值的索引）的时候，应该重置安全区为0-7；
 * 如果指针超过下限，偏移量应该为当前指针与下限的差值的整数倍的偏移量，并且上下限
 * 应该同时-1
 */
let safeScrollArea = [0, 7]; // 安全滚动区域，在这里的不需要重设scrollTop值
function adjustUListScrollTop(UListRef: React.RefObject<HTMLUListElement>, keyboardIndex: number) {
  if (keyboardIndex >= 0 && UListRef.current) {
    const [minimum, maximum] = safeScrollArea;
    let stepOffset = 0;
    if (keyboardIndex < minimum) {
      stepOffset = keyboardIndex - minimum;
    } else if (keyboardIndex > maximum) {
      stepOffset = keyboardIndex - maximum;
    }

    if (stepOffset) {
      safeScrollArea = [minimum + stepOffset, maximum + stepOffset];
      const prevScrollTop = Number(UListRef.current.getAttribute('pre-scrollTop') || 0);
      UListRef.current.scrollTop = prevScrollTop + 32 * stepOffset;
      UListRef.current.setAttribute('pre-scrollTop', String(UListRef.current.scrollTop));
    }
  }
}

/**
 * 需要对正则表达字符串的字符进行转译，要不会出现bug
 */
function escapeRegChars(matchStr: string) {
  return matchStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
