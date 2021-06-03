import React, { useState, useCallback } from 'react';
import { Input } from 'zent';

function Filter(props) {
  const { setFilter } = props;
  const [name, setName] = useState('');
  const onInputChange = useCallback(
    e => {
      setName(e.target.value);
    },
    [name]
  );
  const onSearch = useCallback(() => {
    setFilter({
      name,
    });
  }, [setFilter, name]);
  return (
    <Input
      icon="search"
      placeholder="酒店名称、地址"
      value={name}
      onChange={onInputChange}
      onPressEnter={onSearch}
    />
  );
}

export default Filter;
