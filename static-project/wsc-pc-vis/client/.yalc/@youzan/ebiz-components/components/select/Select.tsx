import React from 'react';
import cx from 'classnames';
import { Popover } from 'zent';
import { Operations } from '@youzan/react-components';
import '@youzan/react-components/es/components/operations/style/index.css';

import difference from 'lodash/difference';

import EbizDropDown from './components/DropDownProvider';
import EbizSelectTrigger from './components/SelectTrigger';
import {
  IOption,
  IEbizSelectProps,
  IEbizSelectTriggerProps,
  IEbizSelectDropDownProps,
} from './types';

import './style.scss';
import useModeProps from './utils/use-mode-props';
import useRemoteOptions from './utils/use-remote-options';
import getMultiSelectValues from './utils/get-multi-select-values';
import convertWidthToString from '../utils/convert-width-to-string';
import { getNewSelectedOptions } from './utils/handle-select-options';
import { getOptionsByValues } from './utils/get-options-by-values';
import useValueCallback from '../utils/use-value-callback';

type fetchFlagType = 'fetchOnMounted' | 'fetchOnOpened' | boolean;

const EbizSelectWithRef = React.forwardRef<any, IEbizSelectProps>(function EbizSelect(props, ref) {
  const {
    // values
    value,
    defaultValue,
    defaultOptions = [],
    // properties
    maxSize,
    className,
    offset = 4,
    width = 185,
    tags = false,
    mode = 'sync',
    filter = false,
    displayNum = 0,
    placeholder = '',
    multiple = false,
    disabled = false,
    clearable = false,
    dropdownClassName,
    closeOnSelect = false,
    // noAnimate = false, // 不需要动画
    noKeyboardHandle = false, // 不需要键盘事件
    // handler
    onOpen,
    onClose,
    onChange,
    onSelect,
    onKeywordChange,
  } = props;

  const PopoverRef = React.useRef<Popover | null>(null);
  React.useImperativeHandle(ref, () => PopoverRef);

  const [keyword, setKeyword] = React.useState<string | undefined>(undefined);
  const [visible, setVisible] = React.useState(false);
  const [values, setValues] = React.useState<any[] | undefined>(
    getConvertedValue(value || defaultValue)
  );
  const [selectedOpts, setSelectedOptions] = React.useState<IOption[] | undefined>(undefined);
  const isMultiSelect = React.useMemo(() => multiple || tags, [multiple, tags]);
  const isControlMode = React.useMemo(() => {
    let _isControlMode = onChange !== undefined && value !== undefined;
    if (value !== undefined && onChange === undefined) {
      const illegalControlModeWarning =
        "It seems that you want to change the value of Select component which running under controlled mode, but you are missing property 'onChange'.";
      console.error(illegalControlModeWarning);
    }
    return _isControlMode;
  }, [onChange, value]);

  const { syncModeProps, asyncModeProps, isRunAsyncMode } = useModeProps(props);
  const { remoteOptions, loading, fetchNow, setOptionCache } = useRemoteOptions({
    fetchOptions: asyncModeProps.fetchOptions,
    useFilterCache: !asyncModeProps.fetchOnOpened,
  });
  const invokeFetchNow = React.useCallback(
    (flag: fetchFlagType, reset?: boolean, fetchKeyword?: string) => {
      if (isRunAsyncMode) {
        let canInvoke = typeof flag === 'boolean' ? flag : asyncModeProps[flag];
        if (canInvoke) fetchNow && fetchNow(reset, fetchKeyword);
      }
    },
    [asyncModeProps, fetchNow, isRunAsyncMode]
  );

  const handleKeywordChange = React.useCallback<IEbizSelectTriggerProps['handleKeywordChange']>(
    (input) => {
      setVisible(true);
      setKeyword(input);
      setOptionCache(!input);
      onKeywordChange && onKeywordChange(input);
    },
    [onKeywordChange, setOptionCache]
  );

  const setValuesAndOptions = React.useCallback(
    (newValues: any[] | undefined, newSelectOpts: IOption[] | undefined) => {
      if (newSelectOpts !== undefined) {
        invokeChangeHandler(onChange, newSelectOpts);
      }
      // 非受控模式
      setSelectedOptions(newSelectOpts);
      setValues(newValues);
    },
    [onChange]
  );

  const handleDeleteOption = React.useCallback(
    (deleteOption?: IOption, reset?: boolean) => {
      setVisible(false);
      let newSelectOpts;
      let newValues;
      if (reset) {
        newSelectOpts = [];
        newValues = [];
      } else {
        newSelectOpts = getNewSelectedOptions(deleteOption, selectedOpts);
        newValues = newSelectOpts && newSelectOpts.map((opt) => opt.value);
      }
      setValuesAndOptions(newValues, newSelectOpts);
    },
    [selectedOpts, setValuesAndOptions]
  );

  const handleSelect = React.useCallback<IEbizSelectDropDownProps['handleSelect']>(
    (option) => {
      setKeyword('');
      setOptionCache(true);
      let currentSelectedOpts: IOption[] | undefined = selectedOpts;
      let currentValues;
      if (isMultiSelect) {
        currentSelectedOpts = getMultiSelectValues(selectedOpts, option);
        currentValues = currentSelectedOpts.map((opt) => opt.value);

        closeOnSelect && setVisible(false);
        if (maxSize && currentSelectedOpts.length > maxSize) return;
      } else {
        setVisible(false);
        currentSelectedOpts = [option];
        currentValues = option.value;
      }
      onSelect && onSelect(option.value, currentSelectedOpts);
      setValuesAndOptions(currentValues, currentSelectedOpts);
    },
    [
      setOptionCache,
      selectedOpts,
      isMultiSelect,
      onSelect,
      setValuesAndOptions,
      closeOnSelect,
      maxSize,
    ]
  );

  const passiveOptions = React.useMemo(
    () => (isRunAsyncMode ? remoteOptions : syncModeProps.options),
    [isRunAsyncMode, remoteOptions, syncModeProps.options]
  );
  // 受控模式的更新，但是defaultOptions/defaultValue也会利用它进行初始化（forceUpdate）
  const setValuesByControlMode = React.useCallback(
    (passiveValues: any, forceUpdate?: boolean) => {
      if (!forceUpdate) {
        if (!isControlMode) return;
      }
      // 如果没有值，就直接重置组件，不做后续的比较
      const isNullable = passiveValues === undefined || passiveValues === null;
      const hasSize = Array.isArray(passiveValues) && passiveValues.length > 0;
      if (isNullable || !hasSize) {
        setSelectedOptions([]);
        return;
      }

      const defaultSelectOptions = getOptionsByValues(passiveValues, defaultOptions);
      const notFoundValues = difference(
        passiveValues,
        defaultSelectOptions.map((opt) => opt.value)
      );
      const passiveSelectOptions = getOptionsByValues(notFoundValues, passiveOptions);
      const tempSelectedOptions = defaultSelectOptions
        .concat(passiveSelectOptions)
        .concat(selectedOpts || []);
      const removeDuplicateOptions = getOptionsByValues(passiveValues, tempSelectedOptions);
      setSelectedOptions(removeDuplicateOptions);
    },
    [defaultOptions, isControlMode, passiveOptions, selectedOpts]
  );

  const restoreKeyboardScrollPosition = React.useCallback(() => {
    if (!noKeyboardHandle) {
      const listDOMs = document.querySelectorAll('.ebiz-select-dropdown[role=menu]');
      listDOMs.forEach((dom) => {
        dom.removeAttribute('pre-scrollTop');
        dom.scrollTop = 0;
      });
    }
  }, [noKeyboardHandle]);

  const handleVisibleChange = React.useCallback(
    (_visible: boolean) => {
      setVisible(_visible);
      if (!_visible) {
        setKeyword('');
        setOptionCache(true);
        restoreKeyboardScrollPosition();
        onClose && onClose();
      }
    },
    [onClose, restoreKeyboardScrollPosition, setOptionCache]
  );

  const stringifyWidth = React.useMemo(() => convertWidthToString(width), [width]);
  const operationItems = React.useMemo(() => {
    const items = [];
    const handleClick = (cb: any | undefined) => cb && cb();
    if (isRunAsyncMode) {
      const { showAdd, onAdd, showRefresh, onRefresh } = asyncModeProps;
      if (showAdd) items.push(<div onClick={handleClick.bind(null, onAdd)}>新增</div>);
      if (showRefresh) {
        const wrapperRefresh = () => {
          invokeFetchNow(true, true);
          onRefresh && onRefresh();
        };
        items.push(<div onClick={wrapperRefresh}>刷新</div>);
      }
    }
    return items;
  }, [asyncModeProps, invokeFetchNow, isRunAsyncMode]);

  React.useEffect(() => {
    setValuesByControlMode(getConvertedValue(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // 监听键盘事件，Esc关闭dropdown
  React.useEffect(() => {
    if (!noKeyboardHandle) {
      const handleCloseDropdown = (evt: KeyboardEvent) => {
        if (evt.code === 'Escape') setVisible(false);
      };
      window.addEventListener('keydown', handleCloseDropdown);
      return () => window.removeEventListener('keydown', handleCloseDropdown);
    }
  }, [noKeyboardHandle]);

  useValueCallback(['fetchOnMounted'], invokeFetchNow);
  useValueCallback<any[]>(['fetchOnOpened', visible], invokeFetchNow, {
    predicate(valueList) {
      return valueList.every(Boolean);
    },
    useOnce: false,
  });
  // 第一次打开的时候获取选项
  useValueCallback(['fetchOnFirstOpen', visible], (_, _vis) => {
    if (!asyncModeProps.fetchOnOpened && !asyncModeProps.fetchOnMounted) {
      invokeFetchNow(true);
    }
  });
  // prettier-ignore
  useValueCallback(defaultOptions, () => setValuesByControlMode(getConvertedValue(value || defaultValue), true));
  // prettier-ignore
  useValueCallback(passiveOptions, () => setValuesByControlMode(getConvertedValue(value || defaultValue), true));
  // default value只用一次
  useValueCallback([getConvertedValue(defaultValue), true], setValuesByControlMode);

  // 当选中的值发生改变或者keyword改变
  React.useEffect(() => {
    if (PopoverRef.current) {
      PopoverRef.current.adjustPosition();
    }
    // 自动调整位置
    const timer = setTimeout(() => {
      if (PopoverRef.current) {
        PopoverRef.current.adjustPosition();
        clearTimeout(timer);
      }
    }, 50);
  }, [keyword, visible, passiveOptions]);

  const passiveValue = React.useMemo(() => getConvertedValue(isControlMode ? value : values), [
    isControlMode,
    value,
    values,
  ]);
  const handleFocus = React.useCallback(() => {
    setKeyword('');
    setOptionCache(true);
    onOpen && onOpen();
    const hasFilter = filter !== false;
    setVisible((_state) => (!hasFilter ? !_state : true));
  }, [filter, onOpen, setOptionCache]);
  const baseProps = {
    filter,
    visible,
    keyword,
    disabled,
    clearable,
    displayNum,
    placeholder,
    handleDeleteOption,
    handleKeywordChange,
    tags: isMultiSelect,
    width: stringifyWidth,
    selectedOpts: selectedOpts,
  };

  return (
    <div className="ebiz-select__container">
      <div data-testid="select-container" className={cx(visible ? 'has-focus' : '', className)}>
        <Popover
          ref={PopoverRef}
          cushion={offset}
          visible={visible}
          prefix="ebiz-select"
          className={cx('ebiz-select-dropdown-provider', dropdownClassName)}
          onVisibleChange={handleVisibleChange}
          position={Popover.Position.AutoBottomLeft}
        >
          <Popover.Trigger.Click>
            {isRunAsyncMode ? (
              <EbizSelectTrigger
                {...baseProps}
                value={passiveValue}
                handleFocus={handleFocus}
                // async mode props
                mode="async"
                fetchNow={fetchNow}
                debounceConf={asyncModeProps.debounceConf}
              />
            ) : (
              <EbizSelectTrigger
                {...baseProps}
                handleFocus={handleFocus}
                value={passiveValue}
                mode="sync"
              />
            )}
          </Popover.Trigger.Click>
          <Popover.Content>
            <EbizDropDown
              mode={mode}
              filter={filter}
              visible={visible}
              loading={loading}
              keyword={keyword}
              tags={isMultiSelect}
              noData={props.noData}
              width={stringifyWidth}
              options={passiveOptions}
              selectedOpts={selectedOpts}
              handleSelect={handleSelect}
              prefixOption={props.prefixOption}
              suffixOption={props.suffixOption}
              noKeyboardHandle={noKeyboardHandle}
              onScrollBottom={() => invokeFetchNow(true)}
            />
          </Popover.Content>
        </Popover>
      </div>
      {operationItems.length > 0 && (
        <Operations
          data-testid="select-ops"
          className="ebiz-select-trigger__operations"
          items={operationItems}
        />
      )}
    </div>
  );
});

function invokeChangeHandler(onChange: IEbizSelectProps['onChange'], selectedOpts?: IOption[]) {
  if (onChange) {
    let selectedOptList = (selectedOpts || []) as IOption[];
    if (Array.isArray(selectedOpts)) {
      const values = selectedOptList.map((opt) => opt.value || '');
      onChange(values, selectedOptList);
    }
  }
}

function getConvertedValue(value: any | any[]): any[] | undefined {
  if (Array.isArray(value)) {
    if (value.length) return value;
  } else if (value) return [value];
  return undefined;
}

export default EbizSelectWithRef;
