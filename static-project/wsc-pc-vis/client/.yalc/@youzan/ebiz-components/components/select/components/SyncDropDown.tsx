import React from 'react';
import cx from 'classnames';

import Option from './Option';

import { IEbizSelectDropDownProps, IOption } from '../types';

interface ISyncExtendsProps {
  options: IOption[];
  tags: boolean;
}

const SyncDropDown = React.forwardRef<
  HTMLUListElement,
  Partial<IEbizSelectDropDownProps> & ISyncExtendsProps
>(function SyncDropDownWithRef(props, ref) {
  const { keyword, options = [], prefixOption, suffixOption, tags, width } = props;

  const OPTION_NODES = React.useMemo<React.ReactNode[] | null>(() => {
    if (options.length === 0) {
      return null;
    }
    return options.map((option, index) => {
      return (
        <Option
          tags={tags}
          keyword={keyword}
          handleClick={props.handleSelect}
          key={`option-${index}-${option.value}`}
          {...option}
        />
      );
    });
  }, [options, tags, keyword, props.handleSelect]);

  return (
    <ul
      ref={ref}
      role="menu"
      style={{ width }}
      className={cx('ebiz-select-dropdown option-list', props.className)}
    >
      {prefixOption && (
        <li role="menuitem" className="option-item">
          {prefixOption}
        </li>
      )}
      {OPTION_NODES}
      {options.length === 0 && (
        <li role="menuitem" className="option-item">
          {props.noData || <span className="option-placeholder">没有找到匹配项</span>}
        </li>
      )}
      {suffixOption && (
        <li role="menuitem" className="option-item">
          {suffixOption}
        </li>
      )}
    </ul>
  );
});

export default SyncDropDown;
