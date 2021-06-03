import { useEffect, useState } from 'react';

import { getDetail, IStudentInfoQuery } from './api';

const useStudentDetail = ({ studentId }: IStudentInfoQuery) => {
  const [detail, setDetail] = useState({
    name: '',
    mobile: '',
    studentNo: '',
    userId: ''
  });
  useEffect(() => {
    if (!studentId) return;
    getDetail({
      studentId
    }).then(data => {
      setDetail(data.student);
    });
  }, [studentId]);
  return [detail];
};

export default useStudentDetail;
