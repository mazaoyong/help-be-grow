import { useEffect, useState } from 'react';

import { getClassList } from './api';

const useEduCourseClass = ({ id, filteIsEnd = true }) => {
  const [list, setList] = useState([]);
  useEffect(() => {
    if (!id) return;
    getClassList({
      query: { eduCourseId: id, isEnd: filteIsEnd ? 1 : 0 },
      page: {
        pageNumber: 1,
        pageSize: 1000
      }
    }).then(({ content = [] }) => {
      setList(content.map(item => {
        const { kdtId, eduClass, classStat } = item;
        return {
          ...classStat,
          ...eduClass,
          kdtId
        };
      }));
    });
  }, [id]);
  return { list };
};

export default useEduCourseClass;
