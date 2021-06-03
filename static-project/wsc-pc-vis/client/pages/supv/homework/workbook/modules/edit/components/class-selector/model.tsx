import { Pop } from '@zent/compat';
import { React, useCallback, useMemo, useRef, createModel } from '@youzan/tany-react';
import { ClampLines } from 'zent';
import { format } from 'date-fns';
import cx from 'classnames';
import { IListContext, IListProps } from '@youzan/ebiz-components/es/types/easy-list';
import type { IEasyGridColumn } from '@youzan/ebiz-components/es/types/easy-list';
import toSnakeCase from '@youzan/utils/string/toSnakeCase';
import useWorkbookEditModel from '../../models/workbook-edit';
import { EduClassSelectorDialogId } from './constants';

import { getEduClassList } from 'domain/workbook-domain/data-source/apis';
import { joinLimit } from 'domain/workbook-domain/types';
import { ISelectedClass } from '../../types';

const EduClassListModel = () => {
  const listRef = useRef<IListContext>(null);

  const { formRef } = useWorkbookEditModel();

  const { joinType = {} } = formRef.current && (formRef.current.zentForm.getValue() as any);

  const refreshList = useCallback(() => listRef.current && listRef.current.action.refresh(), []);

  const selectedClass = useMemo(
    () => (joinType?.type === joinLimit.boundClass ? joinType?.educlass : null),
    [joinType],
  );

  const handleFetchEduClassList = useCallback<IListProps['onSubmit']>((query) => {
    const { page, pageSize, sortBy, sortType, name } = query;
    return getEduClassList({
      query: {
        eduClassName: name,
      },
      pageRequest: {
        pageNumber: page,
        pageSize,
        sort: {
          orders:
            sortBy && sortType
              ? [
                {
                  direction: sortType.toUpperCase(),
                  property: toSnakeCase(sortBy),
                },
              ]
              : [
                {
                  direction: 'DESC',
                  property: 'start_time',
                }
              ],
        },
      },
    }).then((res) => ({
      dataset: res?.content || [],
      pageInfo: {
        page,
        total: res?.total ?? 0,
      },
    }));
  }, []);

  const columns: IEasyGridColumn<any>[] = [
    {
      title: '班级名称',
      fixed: 'left',
      width: 156,
      bodyRender: ({ eduClassName }) => <ClampLines lines={2} text={eduClassName || '-'} />,
    },
    {
      name: 'startTime',
      title: '开班日期',
      needSort: true,
      width: 120,
      bodyRender: ({ startTime }) => <span>{format(startTime, 'YYYY-MM-DD') ?? '-'}</span>,
    },
    {
      name: 'endTime',
      title: '结班日期',
      needSort: true,
      width: 120,
      bodyRender: ({ endTime }) => <span>{format(endTime, 'YYYY-MM-DD') ?? '-'}</span>,
    },
    {
      title: '人数/上限',
      width: 100,
      bodyRender: ({ currentStuNum, maxStuNum }) => (
        <span>{`${currentStuNum}/${maxStuNum}`}</span>
      )
    },
    {
      title: '关联作业本',
      width: 209,
      bodyRender: ({ workbookNames }) => {
        const popContent = workbookNames?.map((name, index) => <p key={index}>{`• ${name}`}</p>);
        return (
          <Pop trigger="hover" wrapperClassName="homework-name" content={popContent || '-'}>
            <span className="ellipsis-2">{workbookNames?.join('、') || '-'}</span>
          </Pop>
        );
      },
    },
  ];

  const getSelectedColumns = useCallback(
    (onDeleteClass: () => void, disabled?: boolean) =>
      [
        {
          title: '班级名称',
          width: 200,
          bodyRender: (eduClass) => <ClampLines lines={2} text={eduClass?.name || ''} />,
        },
        {
          title: '操作',
          textAlign: 'right',
          width: 120,
          bodyRender: () => (
            <span className={cx('operation', { disabled })} onClick={disabled ? () => {} : onDeleteClass}>
              删除
            </span>
          ),
        },
      ] as IEasyGridColumn<ISelectedClass>[],
    [],
  );

  return {
    handleFetchEduClassList,
    columns,
    listRef,
    refreshList,
    selectedClass,
    getSelectedColumns,
    EduClassSelectorDialogId,
  };
};

export type AssignmentListModelType = ReturnType<typeof EduClassListModel>;
export default createModel(EduClassListModel);
