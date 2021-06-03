import { useEffect, useState } from 'react';

import { getDetail } from './api';

interface IData {
  id: number;
  name: string;
}

const useEduCourseDetail = ({ id }) => {
  const [detail, setDetail] = useState<IData>({
    id: 0,
    name: ''
  });
  useEffect(() => {
    if (!id) return;
    getDetail({
      eduCourseDetailQuery: {
        id
      }
    }).then((data: IData) => {
      setDetail(data);
    });
  }, [id]);
  return [detail];
};

export default useEduCourseDetail;
