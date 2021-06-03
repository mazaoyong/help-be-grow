import { useState, useEffect } from 'react';
import { get } from 'lodash';

// import { useLocation } from 'react-router-dom';

export default function useLocationInfo(location) {
  const [errOnly, toggleErrOnly] = useState<boolean>(false);
  // 是否仅查看错误数据，false：查看所有数据，true：仅查看错误数据

  useEffect(() => {
    const err = get(location, 'query.error') === '1';
    toggleErrOnly(err);
  }, [location]);

  return { errOnly, toggleErrOnly };
}
