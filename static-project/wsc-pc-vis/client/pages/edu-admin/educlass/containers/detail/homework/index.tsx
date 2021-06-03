import React, { FC, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { BlockLoading, Notify, ClampLines } from 'zent';
import { ArthurContainer, ArthurSubContainer } from '@youzan/arthur-scheduler-react';
import { EasyList } from '@youzan/ebiz-components';
import get from 'lodash/get';
import { IVisRouterProps } from 'fns/router';
import { Link as SamLink } from '@youzan/sam-components';

import {
  HomeworkList,
  HomeworkListOperations,
  workbookHomeworkListSortByMap,
} from '@ability-center/supv/homework';
import EmptyListWrapper from 'components/empty-list-wrapper';
import CommonLink from 'components/common-link';
import WorkbookSelector from '../components/workbook-selector';
import WorkbookService from 'domain/workbook-domain/services';
import HomeworkService from 'domain/homework-domain/services';
import { IListContext, IEasyGridColumn } from '@youzan/ebiz-components/es/types/easy-list';
import type { IWorkbookRelClassPageDTO } from 'domain/workbook-domain/types';
import { IHomeworkListDTO } from 'domain/homework-domain/types/homework';

import './styles.scss';

const { fetchEduClassWorkbookList, getWorkbookDetail } = WorkbookService;

const { onFetchHomeworkList, deleteHomework } = HomeworkService;

const { Filter } = EasyList;

interface IHomeworkListQuery {
  pageSize: number;
  page: number;
  sortBy?: string;
  sortType?: string;
  title?: string;
  id?: number;
}

const now = Date.now();

const ClassHomework: FC<IVisRouterProps & { getClassDetail: () => Record<string, any> }> = (props) => {
  const { params = {}, getClassDetail } = props;

  const [total, setTotal] = useState<number>();
  const [workbookList, setWorkbookList] = useState<IWorkbookRelClassPageDTO[]>([]);
  const [workbookTeacherIdList, setWorkbookTeacherIdList] = useState<number[]>([]);
  const [workbookId, setWorkbookId] = useState<number>();
  const [isFilterEmpty, toggleIsFilterEmpty] = useState(true);

  const classId = useMemo(() => Number(params?.eduClassId), [params]);

  const classKdtId = useMemo(() => Number(params?.kdtId), [params]);

  const listRef = useRef<IListContext>(null);

  const refreshList = useCallback(() => listRef?.current && listRef.current.action.refresh(), []);

  const isAuthorizedTeacher = workbookTeacherIdList.includes(_global.userId);

  const homeworkCreateLink = useMemo(
    () => `/v4/vis/supv/homework/work/add?workbookId=${workbookId}`,
    [workbookId],
  );
  const workbookCreateLink = useMemo(
    () => `/v4/vis/supv/homework/workbook/add?eduClassId=${classId}`,
    [classId]
  );

  const classDetail = getClassDetail();
  const classIsEnded = useMemo(() => get(classDetail, 'eduClass.endTime', now) < now, [classDetail]);

  useEffect(() => {
    if (classId) {
      fetchEduClassWorkbookList({
        query: { classId, targetKdtId: classKdtId },
        pageRequest: {
          pageSize: 999,
          pageNumber: 1,
        },
      })
        .then((res) => {
          if (res) {
            const { total, content } = res;
            setWorkbookList(content);
            setTotal(total);

            const id = content?.[0]?.workbookId;
            setWorkbookId(id);
            listRef.current && listRef.current.action.setFilter({ pageSize: 10, id });
            return id;
          }
        })
        .then((workbookId) => {
          if (workbookId) {
            getWorkbookDetail({ id: workbookId }).then((detail) => {
              setWorkbookTeacherIdList(
                detail?.teacherList?.map((teacher) => teacher?.teacherId) || [],
              );
            });
          }
        });
    }
  }, [classId, classKdtId]);

  const handleFetchHomeworkList = useCallback(
    (query: IHomeworkListQuery) => {
      const { page = 1, pageSize = 10, sortBy, sortType, title, id } = query;

      if (Number(page) === 1 && !title) {
        toggleIsFilterEmpty(true);
      } else {
        toggleIsFilterEmpty(false);
      }

      if (id) {
        return onFetchHomeworkList({
          query: {
            title,
            exerciseBookId: id,
            targetKdtId: classKdtId,
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
                      property: workbookHomeworkListSortByMap?.[sortBy],
                    },
                  ]
                  : [
                    {
                      direction: 'DESC',
                      property: 'created_at',
                    },
                  ],
            },
          },
        });
      }
    },
    [classKdtId],
  );

  const handleDelete = useCallback(
    (id: number) => {
      return deleteHomework({ id })
        .then(() => Notify.success('作业删除成功'))
        .then(refreshList)
        .catch((e) => {
          Notify.error(e || '删除作业失败，请稍后重试');
        });
    },
    [refreshList],
  );

  const columns: IEasyGridColumn<IHomeworkListDTO>[] = useMemo(
    () => [
      {
        title: '作业名称',
        name: 'title',
        fixed: 'left',
        width: 200,
        bodyRender: (data) => <ClampLines lines={2} text={data.title || '-'} />,
      },
      {
        title: '发布时间',
        name: 'publishTime',
        needSort: true,
        width: 112,
      },
      {
        title: '截止时间',
        name: 'deadlineTime',
        needSort: true,
        width: 112,
      },
      {
        title: '提交作业数',
        name: 'submitNum',
        needSort: true,
        width: 112,
      },
      {
        title: '作业提交率',
        name: 'submitRatio',
        needSort: true,
        width: 112,
      },
      {
        title: '待批阅',
        name: 'awaitMarkingNum',
        needSort: true,
        width: 96,
      },
      {
        title: '操作',
        fixed: 'right',
        textAlign: 'right',
        bodyRender: (data) =>
          workbookId ? (
            <HomeworkListOperations
              data={data}
              handleDelete={handleDelete}
              isTeacher={isAuthorizedTeacher}
              workbookId={workbookId}
            />
          ) : null,
      },
    ],
    [handleDelete, isAuthorizedTeacher, workbookId],
  );

  const emptyLabel = useMemo(() => (
    <EmptyListWrapper>
      {isFilterEmpty ? (
        <>
          暂无作业
          {!classIsEnded ? <ArthurContainer name="createHomework" namespace="督学互动">
            {isAuthorizedTeacher ? (
              <>
                ，
                <CommonLink url={homeworkCreateLink} target="_blank">
                  去布置
                </CommonLink>
              </>
            ) : (
              <>
                ，
                <SamLink name="编辑" href={homeworkCreateLink} target="_blank">
                  去布置
                </SamLink>
              </>
            )}
          </ArthurContainer> : null}
        </>
      ) : (
        '没有更多数据了'
      )}
    </EmptyListWrapper>
  ), [classIsEnded, homeworkCreateLink, isAuthorizedTeacher, isFilterEmpty]);

  const customFilter = useMemo(
    () => (
      <Filter
        config={[
          {
            name: 'id',
            type: 'Custom',
            renderField: ({ value, onChange }) => {
              return (
                <WorkbookSelector
                  total={total}
                  workbookList={workbookList}
                  value={value || workbookList?.[0]?.workbookId}
                  onChange={val => {
                    setWorkbookId(val);
                    onChange(val);
                  }}
                />
              );
            },
          },
        ]}
        autoFilter
      />
    ),
    [total, workbookList],
  );

  return (
    <BlockLoading loading={total === undefined}>
      <div className="educlass-homework">
        {~~Number(total) <= 0 ? (
          <EmptyListWrapper>
            暂无作业本
            {!classIsEnded ? <ArthurContainer name="viewHomework" namespace="督学互动">
              <ArthurSubContainer name="createHomework">
                ，
                <SamLink name="编辑" href={workbookCreateLink} target="_blank">
                  去新建
                </SamLink>
              </ArthurSubContainer>
            </ArthurContainer> : null}
          </EmptyListWrapper>
        ) : (
          <div className="homework-list">
            <HomeworkList
              ref={listRef}
              onSubmit={handleFetchHomeworkList as any}
              isAuthorizedTeacher={isAuthorizedTeacher}
              homeworkCreateLink={homeworkCreateLink}
              columns={columns}
              customFilter={customFilter}
              emptyLabel={emptyLabel}
              createLoading={false} // todo
              fromEduClass={true}
              classIsEnded={classIsEnded}
            />
          </div>
        )}
      </div>
    </BlockLoading>
  );
};

export default ClassHomework;
