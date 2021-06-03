import React, { useState, useEffect, FC, useMemo } from 'react';
import { EasyList } from '@youzan/ebiz-components';
import { filterConfig, columns, generateStatusTabs } from './config';
import { IListProps } from '@youzan/ebiz-components/es/types/easy-list';
import './index.scss';
import { getExamTemplateDetail, findByReview } from '../../api';

const { List, Filter, EasyGrid, Tabs } = EasyList;

export interface IReviewListPageParams {
  examTemplateId: string;
}
interface IReviewListPageProps {
  params: IReviewListPageParams
}

interface ITabsCount {
  notReviewCount:number;
  reviewedCount:number;
  totalCount:number;
}

const ReviewListPage : FC<IReviewListPageProps> = ({ params: { examTemplateId } }) => {
  // 页面顶部需要展示考试的名称
  const [examinationTitle, setExaminationTitle] = useState<string>('-');

  // 列表的 Tab 显示各个状态的数量 [全部，已批阅，未批阅]
  const [tabsCount, setTabsCount] = useState<ITabsCount>({
    notReviewCount: 0,
    reviewedCount: 0,
    totalCount: 0
  });
  const tabsConfig = useMemo(() => generateStatusTabs(tabsCount), [tabsCount]);

  // 操作栏需要知道考试 id
  const columnConfig = useMemo(() => columns(examTemplateId), [examTemplateId]);

  // 根据条件查询批阅列表
  const fetchList: IListProps['onSubmit'] = filter => {
    const { page, pageSize, examUserName, reviewerId, submitDateRange = [], status } = filter;
    // console.log(submitDateRange, reviewerId, examUserName, submitDateRange, 'status', status);
    const reviewListQuery: Record<string, any> = {
      examUserName,
      // submitDateRange: {
      //   startTime: submitDateRange[0],
      //   endTime: submitDateRange[1]
      // },
      status: status || 0,
      examTemplateId
    };

    if (reviewerId >= 0) {
      reviewListQuery.reviewerId = reviewerId;
    }

    if (examUserName) {
      reviewListQuery.examUserName = examUserName;
    }

    if (Array.isArray(submitDateRange) && submitDateRange.length > 0) {
      const data: Record<string, any> = { };
      const [startTime, endTime] = submitDateRange[0];
      if (startTime) {
        data.startTime = startTime;
      }
      if (endTime) {
        data.endTime = endTime;
      }

      reviewListQuery.submitDateRange = data;
    }

    const pageRequest = { pageNumber: page,
      pageSize,
      sort: {
        orders: [
          {
            direction: 'DESC',
            property: 'submit_time'
          }
        ]
      }
    };
    return findByReview({ reviewListQuery, pageRequest })
      .then((res) => {
      // @ts-ignore
        const { reviewPage: { content, total }, notReviewCount, reviewedCount, totalCount } = res;
        // 设置各各状态的数量
        setTabsCount({
          notReviewCount, reviewedCount, totalCount
        });
        return {
          dataset: content,
          pageInfo: {
            total,
            page,
          },
        };
      });
  };

  // 请求考试详情接口设置考试名称（只需请求一次）
  useEffect(() => {
    getExamTemplateDetail(Number(examTemplateId)).then((resp) => {
      const { title = '-' } = resp;
      setExaminationTitle(title);
    });
  }, [examTemplateId]);

  return (
    <main className="review-list">
      <header className="review-list__title">{examinationTitle}</header>
      <section className="review-list__table">
        <List mode="hash" onSubmit={fetchList} defaultFilter={{ pageSize: 10 }}>
          <Filter
            config={filterConfig}
          />
          <Tabs name="status"
            tabs={tabsConfig}
            defaultValue="0"
            onChange={() => void 0}
          />
          <EasyGrid columns={columnConfig}/>
        </List>
      </section>
    </main>
  );
};

export default ReviewListPage;
