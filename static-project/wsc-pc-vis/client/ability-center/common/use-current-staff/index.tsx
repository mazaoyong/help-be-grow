import { useEffect, useState } from 'react';

import { getStaff } from './api';

const useCurrentStaff = () => {
  const [staffInfo, setStaffInfo] = useState('');
  useEffect(() => {
    getStaff({ adminId: window._global.userId }).then(data => {
      setStaffInfo(data);
    });
  }, [setStaffInfo]);
  return [staffInfo];
};

export default useCurrentStaff;
