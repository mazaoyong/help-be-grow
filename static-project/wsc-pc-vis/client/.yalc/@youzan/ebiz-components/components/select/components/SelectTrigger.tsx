import React from 'react';
import { Icon } from 'zent';
import cx from 'classnames';

import get from 'lodash/get';

import { isAsyncTrigger } from '../utils/is-async-mode';
import EbizTagList from '../components/TagList';

import { IEbizSelectTriggerProps } from '../types';
import { useDebounce } from '../../utils/use-debounce';

const EbizSelectTrigger: React.FC<IEbizSelectTriggerProps> = (props) => {
  const {
    tags,
    width,
    value,
    filter,
    visible,
    keyword,
    disabled,
    clearable,
    displayNum,
    placeholder,
    selectedOpts,
    handleDeleteOption,
    handleKeywordChange,
  } = props;
  const filterRef = React.useRef<HTMLInputElement>(null);
  const mirrorRef = React.useRef<HTMLSpanElement>(null);
  const compositionState = React.useRef(false);
  const setComposition = React.useCallback(
    (state: boolean) => (compositionState.current = state),
    []
  );

  const notHasSelectOpts = React.useMemo(() => !value || !value.length, [value]);
  const showDeleteIcon = React.useMemo(() => !disabled && clearable && !notHasSelectOpts, [
    clearable,
    disabled,
    notHasSelectOpts,
  ]);
  const cls = React.useMemo(
    () =>
      cx({
        'ebiz-select-trigger': true,
        'is-tags': tags,
        wrapper: true,
        'has-focus': visible,
        'set-disabled': disabled,
        'show-delete': showDeleteIcon,
      }),
    [tags, visible, disabled, showDeleteIcon]
  );

  const triggerText = React.useMemo(() => {
    return tags ? keyword : get(selectedOpts, '[0].text', keyword);
  }, [keyword, tags, selectedOpts]);

  const handleFocusInput = React.useCallback(() => {
    notHasSelectOpts && filterRef.current && filterRef.current.focus();
    !disabled && !visible && props.handleFocus(true);
  }, [notHasSelectOpts, disabled, visible, props]);

  const handleCompositionEnd = React.useCallback(
    (input: string) => {
      handleKeywordChange(input);
      if (compositionState.current) return;
    },
    [handleKeywordChange]
  );

  const inputTrigger = React.useMemo(
    () => {
      let InputEle = null;
      let CalcMirrorEle = null; // 用于计算的镜像DOM
      let PlaceholderEle = null;
      if (filter) {
        InputEle = (
          <input
            type="text"
            ref={filterRef}
            disabled={disabled}
            onChange={(evt) => handleCompositionEnd(evt.target.value)}
            onCompositionStart={() => setComposition(true)}
            onCompositionEnd={(evt) => {
              setComposition(false);
              handleCompositionEnd(evt.data);
            }}
            value={visible ? keyword : triggerText}
            placeholder={triggerText || placeholder || '请输入'}
            className="ebiz-select-trigger__input auto-width"
          />
        );
        CalcMirrorEle = (
          <span ref={mirrorRef} className="ebiz-select-trigger__mirror">
            {keyword || triggerText || placeholder || '请输入'}
          </span>
        );
      } else {
        if (!tags) {
          InputEle = (
            <input
              readOnly
              disabled={disabled}
              value={triggerText}
              placeholder={placeholder || '请选择'}
              className="ebiz-select-trigger__input readonly"
            />
          );
        } else {
          PlaceholderEle = (
            <div className="ebiz-select-trigger__input placeholder">{placeholder || '请选择'}</div>
          );
        }
      }
      return (
        <div className="ebiz-select-trigger__input-container">
          {InputEle}
          {CalcMirrorEle}
          {!value && PlaceholderEle}
        </div>
      );
    },
    // prettier-ignore
    [
      disabled, filter, tags,
      keyword, placeholder, visible,
      handleCompositionEnd, setComposition,
      triggerText, value,
    ]
  );

  useDebounce(
    () => {
      if (keyword !== undefined && isAsyncTrigger(props)) {
        props.fetchNow && props.fetchNow(true, keyword);
      }
    },
    200,
    [keyword]
  );

  return (
    <div className={cls} style={{ width }} onClick={handleFocusInput} data-testid="select-trigger">
      {tags && (
        <EbizTagList
          disabled={disabled || false}
          options={selectedOpts}
          displayNum={displayNum}
          handleClose={handleDeleteOption}
          className="ebiz-select-trigger__tags"
        />
      )}
      {inputTrigger}
      {showDeleteIcon && (
        <Icon
          type="close-circle"
          className="ebiz-select-trigger__reset"
          onClickCapture={(evt) => {
            evt.stopPropagation();
            handleDeleteOption(undefined, true);
          }}
          data-testid="select-clearBtn"
        />
      )}
    </div>
  );
};

export default EbizSelectTrigger;
