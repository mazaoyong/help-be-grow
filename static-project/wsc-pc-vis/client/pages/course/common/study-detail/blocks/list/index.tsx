import React, { FC, useCallback } from 'react';
import { findUserLearnDetail } from '../../api';
import StudyDetailListFC from '../../components/list';
import { IListProps, IFormatData } from '@youzan/ebiz-components/es/types/easy-list';
import { IStudyDetailPageProps } from '../../types';

const StudyListWrapper: FC<IStudyDetailPageProps> = (props) => {
  const { courseAlias, courseId, userId } = props;

  const fetch: IListProps['onSubmit'] = useCallback((params) => {
    const { pageSize, page = 1 } = params;
    const query = {
      courseAlias,
      courseId,
      userId
    };

    const pageRequest = {
      pageNumber: page,
      pageSize,
    };

    return findUserLearnDetail({ query, pageRequest })
      .then(resp => {
        const { content = [], total = 0 } = resp || {};
        const result: IFormatData = {
          pageInfo: {
            page,
            pageSize,
            total,
          },
          dataset: content,
        };
        return result;
      });
  }, [courseAlias, courseId, userId]);

  return (<div className='study-detail__block'>
    <p className='study-detail__title'>完成课程明细</p>
    <StudyDetailListFC onFetch={fetch}/>
  </div>);
};

export default StudyListWrapper;
