import React, { useCallback, useState } from 'react';
import renderConfig from './card-layouts';
import { CardList } from '@youzan/ebiz-components';
// import { FetchData } from '@youzan/ebiz-components/es/types/card-list';
// import { ISwitchoutListProps } from './types';
import { findPageByWithSpecificCourse } from '../../../../api';

const CardListWrap = ({ studentInfo, onSelect }) => {
  const [total, setTotal] = useState(0);
  const fetchSignedCourseData = useCallback((pageInfo) => {
    const { current } = pageInfo;
    const params = {
      pageRequest: {
        pageSize: 2,
        pageNumber: current,
      },
      query: studentInfo,
    };
    return findPageByWithSpecificCourse(params).then((resp) => {
      // @ts-ignore
      const { content = [], total = 0 } = resp || {};
      setTotal(total);
      return {
        total: total,
        datasets: content,
        pageSize: 2,
      };
    });
  }, []);

  return (
    <>
      {total > 0 && <p className="switch-out-dialog-tip">已学完、已退课、按期销售、按自定义销售、按时段销售且签到后生效但未签到的课程不支持转课</p>}
      <CardList
        // @ts-ignore
        selectable={true}
        onSelected={(item) => onSelect(item)}
        renderConfig={renderConfig}
        fetchData={fetchSignedCourseData}
        pageInfo={{
          pageSize: 2
        }}
        emptyLabel='该学员没有可以转出的课程'
      />
    </>
  );
};

export default CardListWrap;
