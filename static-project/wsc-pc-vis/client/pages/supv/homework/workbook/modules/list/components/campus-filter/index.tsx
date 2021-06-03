import React, { useEffect, useState } from 'react';
import { Select } from '@zent/compat';
import { findListAllCampusAPI } from './api';
import { CampusContext } from './campus-provider';
import './index.scss';
const localKdtid = _global.kdtId;

interface optionType {
  shopName: string;
  kdtId: number;
}
function CampusFilter(props) {
  const [selectedValue, setSelectedValue] = useState(localKdtid);
  const [options, setOptions] = useState<Array<optionType>>([]);
  useEffect(() => {
    findListAllCampusAPI().then(data => {
      const options = [
        {
          shopName: '总部',
          kdtId: localKdtid,
        },
        ...data,
      ];
      setOptions(options);
    });
  }, []);

  const selectChangeHandler = e => {
    const val = e.target.value;
    setSelectedValue(val);
    props.onChange(val);
  };

  return (
    <div className="campus-filter-wrap">
      校区范围：
      <Select
        data={options}
        optionValue="kdtId"
        optionText="shopName"
        onChange={selectChangeHandler}
        value={selectedValue}
        filter={(item, keyword) => item.shopName.includes(keyword)}
      ></Select>
    </div>
  );
}

export default CampusFilter;
export { CampusContext };
