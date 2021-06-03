import React from 'react';
import { Select } from '@youzan/ebiz-components';
import { get } from 'lodash';

import { findStudents } from '../../api/student-list';

import type { IEbizSelectAsyncProps } from '@youzan/ebiz-components/es/types/select';

import './styles.scss';

const STATIC_SORT = {
  orders: [{ direction: 'DESC', property: 'created_at' }],
};
export const ALL_OPTION = { text: '全部', value: 'all' };
interface IStudentSelectorProps extends Record<string, any> {
  targetKdtId?: number;
  /** 目标字段key，默认为studentId */
  targetKey?: string;
}
export const StudentFilterSelector: React.FC<IStudentSelectorProps> = (props) => {
  const { targetKdtId = _global.kdtId, targetKey = 'studentId', onChange, ...restProps } = props;
  const fetchStudentList = React.useCallback<IEbizSelectAsyncProps['fetchOptions']>(
    (query, pageRequest) => {
      let mobileQuery = '';
      let keywordQuery = '';
      if (/^(\+\d{2}\s)?\d+$/.test(query)) {
        mobileQuery = query;
      } else {
        keywordQuery = query;
      }
      return findStudents({
        query: {
          name: keywordQuery,
          mobile: mobileQuery,
          targetKdtId,
        },
        pageRequest: {
          pageNumber: pageRequest.current,
          pageSize: 30,
          sort: STATIC_SORT,
        },
      }).then(({ content, total, pageable }) => {
        const prefixOpt = pageRequest.current === 1 ? [ALL_OPTION] : [];
        return {
          options: prefixOpt.concat(
            (content as any[]).map((item = {}) => {
              const mobile = item.mobile || '';
              return {
                text: item.name || item.nickName,
                extra: <span title={mobile}>{mobile}</span>,
                value: get(item, targetKey, 0),
              };
            }),
          ),
          pageInfo: {
            total: total + 1,
            current: pageable.pageNumber,
          },
        };
      });
    },
    [targetKdtId, targetKey],
  );

  const handleValueChange = React.useCallback(
    (value: any[]) => {
      onChange && onChange(value[0]);
    },
    [onChange],
  );

  return (
    <div className="student-selector">
      <Select
        {...restProps}
        onChange={handleValueChange}
        dropdownClassName="student-selector__dropdown"
        filter
        mode="async"
        fetchOnOpened
        fetchOptions={fetchStudentList}
      />
    </div>
  );
};
