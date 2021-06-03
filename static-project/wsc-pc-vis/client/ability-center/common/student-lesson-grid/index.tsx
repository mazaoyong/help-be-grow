import React, { useMemo, useState, useCallback } from 'react';
import { Grid } from 'zent';
import format from 'date-fns/format';

import cent2yuan from 'fns/currency/cent2yuan';

import useStudentLessonByAsset, { StudentLesson } from '@ability-center/common/use-student-lesson-by-asset';

interface IProps {
  kdtId: string;
  assetNo: string;
  onSelectionChange: (rows: StudentLesson[]) => any;
}

const pageSize = 5;

const StudentLessonGrid: React.FC<IProps> = ({ kdtId, assetNo, onSelectionChange }) => {
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const { list: dataList, total } = useStudentLessonByAsset({
    pageNumber,
    pageSize,
    kdtId,
    assetNo,
    callback: () => {
      setLoading(false);
    }
  });
  const toggleSelectedRowKeys = useCallback((keys, rows: StudentLesson[]) => {
    setSelectedRowKeys(keys);
    onSelectionChange(rows);
  }, []);
  const columns = useMemo(() => [
    {
      title: '上课时间',
      bodyRender: ({ startTime }) => format(startTime, 'YYYY-MM-DD HH:mm'),
    },
    {
      title: '课节名称',
      bodyRender: ({ lessonName, lessonNo }) => (
        <a
          href={'/v4/vis/edu/page/schedule#/detail?lessonNo=' + lessonNo + '&kdtId=' + kdtId}
          target="_blank"
          rel="noopener noreferrer"
        >{lessonName || '-'}</a>
      ),
    },
    {
      title: '上课教室',
      bodyRender: ({ classroomName }) => classroomName || '-',
    },
    {
      title: '老师',
      bodyRender: ({ teacherName }) => teacherName || '-',
    },
    {
      title: '冻结课时',
      bodyRender: ({ lockedNum }) => cent2yuan(lockedNum) || '-',
    },
  ], []);
  const onPageChange = useCallback(({ current }) => {
    setPageNumber(current);
  }, []);
  return (
    <Grid
      rowKey="studentLessonNo"
      columns={columns}
      datasets={dataList}
      loading={loading}
      selection={{
        selectedRowKeys,
        onSelect: toggleSelectedRowKeys,
      }}
      onChange={onPageChange}
      pageInfo={{
        current: pageNumber,
        pageSize,
        total
      }}
    />
  );
};

export default StudentLessonGrid;
