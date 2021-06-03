import React from 'react';
import { isElement } from 'react-is';
import { Input, IInputCoreProps } from 'zent';
import get from 'lodash/get';

import { adaptorConstructor } from './constant';
import { ISearchProps } from '../../types/filter';
import useValueCallback from '../../../utils/use-value-callback';

const Search: React.FC<ISearchProps> = (props) => {
  const {
    position = 'right',
    placeholder = '请输入',
    onChange,
    name,
    children,
    afterPressEnter,
  } = props;
  const [keyword, setKeyword] = React.useState('');
  // 用于暂存输入值，然后降低触发提交的频率
  const [prevValue, setPrevValue] = React.useState('');

  // 初始化adaptor提交easy-list
  const adaptor = React.useMemo(() => adaptorConstructor(props), [props]);
  const initValue = React.useMemo(() => get(props, `${adaptor.initValuePath}.${name}`, ''), [
    adaptor.initValuePath,
    name,
    props,
  ]);
  useValueCallback(initValue, setKeyword, {
    /** 不确定useValueCallback的影响，这里单独接管设置keyword的判断 */
    predicate(value) {
      return value !== undefined && value !== '';
    },
  });

  const handleValueChange: IInputCoreProps['onChange'] = React.useCallback(
    (evt) => {
      const value = evt.target.value;
      if (onChange) onChange(value);
      setKeyword(value);
    },
    [onChange]
  );

  const handleSubmit = React.useCallback(() => {
    if (prevValue === keyword) return;
    setPrevValue(keyword);
    if (adaptor.afterSubmit) {
      adaptor.afterSubmit({ [name]: keyword });
    }
  }, [prevValue, keyword, adaptor, name]);

  const handlePressEnter = React.useCallback(() => {
    handleSubmit();
    if (afterPressEnter) afterPressEnter();
  }, [afterPressEnter, handleSubmit]);

  const ChildNode = React.useMemo(() => {
    if (children && isElement(children)) return children;
    return null;
  }, [children]);

  return (
    <div data-testid="easy-filter-search" className="easy-filter__search">
      {position === 'right' && <div style={{ flex: 1 }}>{ChildNode}</div>}
      <div className="easy-filter__search-box">
        <Input
          icon="search"
          className={`position-${position}`}
          placeholder={placeholder}
          value={keyword}
          onChange={handleValueChange}
          onPressEnter={handlePressEnter}
          onBlur={handleSubmit}
        />
      </div>
      {position === 'left' && <div style={{ flex: 1 }}>{ChildNode}</div>}
    </div>
  );
};

export default Search;
