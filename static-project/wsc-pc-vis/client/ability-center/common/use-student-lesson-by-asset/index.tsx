import { useEffect, useState } from 'react';

import { findPageStudentLessonByAssetNo } from './api';

export interface StudentLesson {
  studentLessonNo: string;
}

const useStudentLessonByAsset = ({ pageNumber = 1, pageSize = 100, kdtId, assetNo, callback }) => {
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    findPageStudentLessonByAssetNo({
      pageRequest: {
        pageNumber,
        pageSize
      },
      studentLessonByAssetQuery: {
        kdtId,
        assetNo,
      },
    }).then(({ content = [], total }) => {
      setList(content.map(item => { item.assetNo = assetNo; return item; }));
      setTotal(total);
    }).finally(() => {
      callback && callback();
    });
  }, [pageNumber, pageSize, kdtId, assetNo]);
  return { list, total };
};

export default useStudentLessonByAsset;
