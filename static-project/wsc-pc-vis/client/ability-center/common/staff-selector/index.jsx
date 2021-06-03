import React, { useCallback } from 'react';
import ValuntaryAsyncSelect from 'components/valuntary-async-select/ValuntaryAsyncSelect';

import { getStaffList } from './api';

const StaffSelector = ({ defaultOption, setDefaultOption, width = '185px', hideClose = true, value, onChange, kdtId = null }) => {
  const getOptions = useCallback((query, pageConditions) => {
    const { name = null } = query || {};
    const { pageNumber = 1, pageSize = 20 } = pageConditions || {};
    const params = {
      status: 'ON',
      pageSize,
      pageNo: pageNumber,
      keyword: name
    };
    return getStaffList(params).then(({ items = [] }) => {
      const options = items.map(item => {
        return {
          text: item.name,
          value: item.adminId,
        };
      });
      if (pageNumber === 1) {
        options.unshift({ text: '全部', value: '' });
      }
      return options;
    });
  }, [kdtId]);
  const handleChange = useCallback((val, selectedOpt) => {
    onChange(val.target.value);
    setDefaultOption(selectedOpt);
  }, []);
  return (
    <ValuntaryAsyncSelect
      onSearch={(keyword) => {
        return { name: keyword };
      }}
      defaultOption={defaultOption}
      create={false}
      refresh={false}
      getOptions={getOptions}
      placeholder='全部'
      width={width}
      hideClose={hideClose}
      value={value}
      onChange={handleChange}
    />
  );
};

export default StaffSelector;
