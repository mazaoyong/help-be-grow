import { useEffect, useState } from 'react';

import { findStaff } from './api';

const useStaffList = () => {
  const [options, setOptions] = useState([]);
  useEffect(() => {
    findStaff().then(data => {
      const options = data.map(item => ({
        text: item.name,
        value: {
          sellerName: item.name,
          sellerId: item.adminId,
        },
      }));
      setOptions(options);
    });
  }, []);
  return [options];
};

export default useStaffList;
