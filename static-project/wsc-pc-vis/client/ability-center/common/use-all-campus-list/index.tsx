import { useEffect, useState } from 'react';

import { findListAllCampus } from './api';

const useAllCampusList = () => {
  const [options, setOptions] = useState([]);
  useEffect(() => {
    findListAllCampus().then(res => {
      const schoolSelectOpts = res.map((item) => ({ value: item.kdtId, text: item.shopName }));
      schoolSelectOpts.unshift({
        value: 'all',
        text: '全部',
      });
      setOptions(schoolSelectOpts);
    });
  }, []);
  return [options];
};

export default useAllCampusList;
