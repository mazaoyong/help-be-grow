import React, { FC, useState, useCallback } from 'react';
import { EasyList } from '@youzan/ebiz-components';
import { Button, Notify } from 'zent';
import { columns } from './list-config';
import { findLockedPage, batchCancel } from '../api';
import { TCourseDialogListProps } from '../types';
import { IListProps } from '@youzan/ebiz-components/es/types/easy-list';

const { List, EasyGrid } = EasyList;
const CourseDialogList: FC<TCourseDialogListProps> = (props) => {
  const { onConfirm = () => {}, ...restProps } = props;
  const [ selectKeys, setSelectKeys ] = useState<string[]>([]);
  const [ pageShow, setPageShow ] = useState<boolean>(false);

  const onFetch = useCallback<IListProps['onSubmit']>((params) => {
    const { sortBy = 'created_at', sortType, page = 1 } = params;
    return findLockedPage({ pageRequest: {
      pageNumber: page,
      pageSize: 5,
      sort: { orders: [{ direction: (sortType || 'DESC').toLocaleUpperCase(), property: sortBy }] },
    },
    query: restProps }).then((resp) => {
      const { content = [], pageable = {}, total = 0 } = resp || {};
      if (total > 5 && !pageShow) {
        setPageShow(true);
      } else if (total <= 5 && pageShow) {
        setPageShow(false);
      }
      return {
        dataset: content,
        pageInfo: {
          page: pageable.pageNumber || 1,
          pageSize: 5,
          total: total,
        },
      };
    });
  }, []);

  return (<div>
    <List mode='none' defaultFilter={{ pageSize: 5 }} onSubmit={onFetch}>
      <EasyGrid
        pageable={pageShow}
        columns={columns(restProps.studentLessonNo)}
        rowKey={'studentLessonNo'}
        paginationType={'lite'}
        selection={{
          onSelect: (selectedRowKeys) => {
            setSelectKeys(selectedRowKeys);
            return true;
          },
          getCheckboxProps: (rowData) => {
            return { disabled: restProps.studentLessonNo === rowData.studentLessonNo };
          }
        }}
      />
    </List>
    <div className='lock_course_dialog_footer'>
      <Button type='primary' onClick={() => {
        if (!selectKeys || !selectKeys.length) {
          Notify.error('请至少选择一个日程');
          return;
        }
        batchCancel({ command: {
          kdtId: props.kdtId,
          studentLessonNos: selectKeys || [],
        } }).then(() => {
          Notify.success('移除成功');
          onConfirm();
        }).catch(error => {
          Notify.error(error);
          onConfirm();
        });
      }}>移除</Button>
    </div>
  </div>);
};

export default CourseDialogList;
