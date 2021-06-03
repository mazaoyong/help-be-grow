import { Select } from '@zent/compat';
import React, { useState, useCallback, useEffect } from 'react';
import { Input } from 'zent';
import ajax from 'fns/ajax';
import style from './room-type-filter.m.scss';

function getHotelNames() {
  return ajax('/v4/shop/design/hotel/getHotelNames.json');
}

function Filter(props) {
  const { setFilter } = props;
  const [name, setName] = useState('');
  const [hotelId, setHotelId] = useState('all');
  const [hotelNames, setHotelNames] = useState([
    {
      id: 'all',
      name: '全部',
    },
  ]);
  const onInputChange = useCallback(
    e => {
      setName(e.target.value);
    },
    [name]
  );
  const onHotelChange = useCallback(
    (_, data) => {
      setHotelId(data.id);
      setFilter({
        hotelId: data.id,
      });
    },
    [hotelId]
  );
  const onFilter = (item, keyword) => item.text.indexOf(keyword) > -1;
  const onSearch = useCallback(() => {
    setFilter({
      name,
      hotelId,
    });
  }, [setFilter, name]);
  useEffect(() => {
    getHotelNames().then(data => {
      data = data.map(one => ({
        id: one.id,
        name: one.name,
      }));
      data = hotelNames.concat(data);
      setHotelNames(data);
    });
  }, []);
  return (
    <div className={style.filter}>
      <Select
        className={style.select}
        optionText="name"
        optionValue="id"
        data={hotelNames}
        onChange={onHotelChange}
        onFilter={onFilter}
        value={hotelId}
        width={184}
        autoWidth
      />
      <Input
        icon="search"
        placeholder="房型名称"
        value={name}
        onChange={onInputChange}
        onPressEnter={onSearch}
        width={184}
      />
    </div>
  );
}

export default Filter;
