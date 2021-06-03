import React from 'react';
import cx from 'classnames';

import Option from './Option';

import { IEbizSelectDropDownProps, IOption } from '../types';

interface IASyncExtendsProps {
  tags: boolean;
  loading: boolean;
  options: IOption[];
  onScrollBottom(): void;
}

const OFFSET_HEIGHT = 4 * 32;

const AsyncDropDown = React.forwardRef<
  HTMLUListElement,
  Partial<IEbizSelectDropDownProps> & IASyncExtendsProps
>(function AsyncDropDownWithRef(props, ref) {
  const {
    tags,
    width,
    noData,
    loading,
    keyword,
    options = [],
    handleSelect,
    prefixOption,
    suffixOption,
    onScrollBottom,
  } = props;
  const blockBottomInvoke = React.useRef(false);

  const OPTION_NODES = React.useMemo<React.ReactNode>(() => {
    if (options.length === 0) {
      return null;
    }
    return options.map((option, index) => {
      return (
        <Option
          tags={tags}
          keyword={keyword}
          handleClick={handleSelect}
          key={`option-${index}-${option.value}`}
          {...option}
        />
      );
    });
  }, [options, tags, keyword, handleSelect]);

  const handleScroll = React.useCallback<(evt: React.UIEvent<HTMLUListElement>) => void>(
    (evt) => {
      if (!blockBottomInvoke.current) {
        const maxHeight = options.length * 32 - 270;
        if (maxHeight > 0) {
          const scrollTop = (evt.target as HTMLUListElement).scrollTop;
          if (maxHeight - scrollTop < OFFSET_HEIGHT) {
            onScrollBottom();
            // 暂时禁止底部触发
            blockBottomInvoke.current = true;
          }
        }
      }
    },
    [onScrollBottom, options]
  );

  React.useEffect(() => {
    // 如果options长度发生改变，就重新设置底部触发状态为可触发
    if (options.length > 0) {
      blockBottomInvoke.current = false;
    }
  }, [options.length]);

  return (
    <ul
      ref={ref}
      role="menu"
      style={{ width }}
      onScroll={handleScroll}
      className={cx('ebiz-select-dropdown option-list', props.className)}
    >
      {prefixOption && (
        <li role="menuitem" className="option-item">
          {prefixOption}
        </li>
      )}
      {OPTION_NODES}
      {suffixOption && (
        <li role="menuitem" className="option-item">
          {suffixOption}
        </li>
      )}
      {loading ? (
        <li role="menuitem" className="option-item option-placeholder">
          加载中...
        </li>
      ) : (
        options.length === 0 && (
          <li role="menuitem" className="option-item option-placeholder">
            {noData || '暂无数据'}
          </li>
        )
      )}
    </ul>
  );
});

export default AsyncDropDown;
