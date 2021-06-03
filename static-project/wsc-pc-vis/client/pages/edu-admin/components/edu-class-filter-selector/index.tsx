import React from 'react';
import { Select } from '@youzan/ebiz-components';
import { get } from 'lodash';

import { getEduClassListAPI } from '../../schedule/api';

import type { IEbizSelectAsyncProps } from '@youzan/ebiz-components/es/types/select';

export const ALL_OPTION = { text: '全部', value: 'all' };
interface IEduClassSelectorProps extends Record<string, any> {
  targetKdtId?: number;
}
export const EduClassFilterSelector: React.FC<IEduClassSelectorProps> = (props) => {
  const { targetKdtId = _global.kdtId, ...restProps } = props;
  const fetchStudentList = React.useCallback<IEbizSelectAsyncProps['fetchOptions']>(
    (query, pageRequest) => {
      return getEduClassListAPI({
        query: {
          eduClassName: query,
          kdtId: targetKdtId,
        },
        page: {
          pageNumber: pageRequest.current,
          pageSize: 30,
        },
      }).then(({ content, total, pageable }) => {
        const prefixOpt = pageRequest.current === 1 ? [ALL_OPTION] : [];
        return {
          options: prefixOpt.concat(
            (content as any[]).map((item = {}) => ({
              text: get(item, 'eduClass.eduClassName'),
              value: get(item, 'eduClass.id'),
            })),
          ),
          pageInfo: {
            total: total + 1,
            current: pageable.pageNumber,
          },
        };
      });
    },
    [targetKdtId],
  );
  return (
    <div className="student-selector">
      <Select {...restProps} mode="async" filter fetchOnOpened fetchOptions={fetchStudentList} />
    </div>
  );
};
