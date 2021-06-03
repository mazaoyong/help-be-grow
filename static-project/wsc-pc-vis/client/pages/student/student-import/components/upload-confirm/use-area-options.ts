import { getAreaList } from '@ability-center/student/modify-student';
import { useEffect, useState } from 'react';
import { Notify } from 'zent';

export default function useAreaOptions() {
  const [areaOptions, setAreaOptions] = useState<any[]>([]);

  useEffect(() => {
    getAreaList()
      .then(setAreaOptions)
      .catch(() => Notify.error('获取省市区资源出错'));
  }, []);

  return {
    areaOptions,
  };
}
