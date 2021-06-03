import React, { useCallback } from 'react';
import ValuntaryAsyncSelect from 'components/valuntary-async-select/ValuntaryAsyncSelect';

import { getClassList } from './api';

const EduClassSelector = ({ defaultOption, setDefaultOption, width = '185px', hideClose = true, value,
  onChange, kdtId = _global.kdtId }) => {
  const getOptions = useCallback((query, pageConditions) => {
    const { name = null } = query || {};
    const { pageNumber = 1, pageSize = 20, sort = null } = pageConditions || {};
    const courseParams = {
      filter: {
        eduClassName: name,
        kdtId
      },
      pageRequest: {
        pageNumber,
        countEnabled: true,
        pageSize,
        sort
      }
    };
    return getClassList(courseParams).then(res => {
      const { content = [] } = res || {};
      const options = content.map(item => {
        return {
          text: item.eduClass.eduClassName,
          value: item.eduClass.id,
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

export default EduClassSelector;
