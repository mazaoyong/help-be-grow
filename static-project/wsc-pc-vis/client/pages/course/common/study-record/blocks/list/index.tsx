import React, { FC, useCallback, useState } from 'react';
import { getCustomerList, findDetail, exportTask } from '../../api';
import { optionTextGen } from '../../utils/list';
import StudyListFC from '../../components/list';
import { IOption, IPageRequest } from '@youzan/ebiz-components/es/types/select';
import throttle from 'lodash/throttle';
import { IListProps, IFormatData } from '@youzan/ebiz-components/es/types/easy-list';
import { IStudyRecordPageProps } from '../../types';
import { Notify } from 'zent';
import { getExportRecordUrl, EXPORT_RECORD_TYPES } from '@ability-center/ump/export-record';

// select下拉读取店铺客户信息
const fetchOptions = throttle((keyword, pageRequest): Promise<{ options: IOption[]; pageInfo: IPageRequest; }> => {
  return getCustomerList({
    pageRequest: {
      pageNumber: pageRequest.current || 1,
      pageSize: pageRequest.pageSize || 20,
    },
    query: {
      keyword,
      kdtId: _global.kdtId, // 暂不支持校区选择
    },
  })
    .then((data) => {
      const { content = [], pageable, total } = data;
      const options: IOption[] = content.map((customer) => {
        const text = optionTextGen({ name: customer.name, nickName: customer.nickName, mobile: customer.mobile });
        return {
          text: text,
          value: customer.userId,
        };
      }).filter((customer: { text: string; }) => customer.text && !(/^(.*?)(匿名用户)$/).test(customer.text));

      const pageInfo: IPageRequest = {
        current: pageable.pageNumber || 1,
        total: total || 0,
      };

      return {
        options,
        pageInfo,
      };
    });
}, 200);

const StudyListWrapper: FC<IStudyRecordPageProps> = (props) => {
  const { courseType, courseId } = props;
  const [ userId, setUserId ] = useState<number | null>(null);

  const onSelect = useCallback((value) => {
    setUserId(value);
  }, []);

  const onReset = useCallback(() => {
    setUserId(null);
  }, []);

  const exportData = useCallback<() => void>(() => {
    const query = {
      courseType,
      courseId,
    };

    if (userId) {
      query['userId'] = userId;
    }
    exportTask({
      query
    }).then(resp => {
      if (resp) {
        window.open(getExportRecordUrl({ type: EXPORT_RECORD_TYPES.COLUMN_STUDY_RECORD }), '_blank');
        Notify.success('生成导出记录成功');
      } else {
        Notify.error('生成导出记录失败');
      }
    }).catch(err => Notify.error(err));
  }, [ courseType, courseId, userId ]);

  const fetch = useCallback<IListProps['onSubmit']>((params) => {
    const { pageSize, page = 1, name } = params;
    const query = {
      courseType,
      courseId,
    };

    if (name && name.length) {
      query['userId'] = name[0];
    }

    const pageRequest = {
      pageNumber: page,
      pageSize,
    };

    return findDetail({ query, pageRequest })
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
  }, [courseId, courseType]);

  return (<div className='study-record__block'>
    <p className='study-record__title'>学习明细</p>
    <StudyListFC
      onReset={onReset}
      onSelect={onSelect}
      courseId={courseId}
      selectFetchOption={fetchOptions}
      onExport={exportData}
      onFetch={fetch}
      courseType={courseType} />
  </div>);
};

export default StudyListWrapper;
