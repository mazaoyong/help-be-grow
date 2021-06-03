import React from 'react';
import { Notify } from 'zent';
import { EasyList } from '@youzan/ebiz-components';
import {
  IListProps,
  IListContext,
  IEasyGridSelection,
} from '@youzan/ebiz-components/es/types/easy-list';
import {
  ClassifyList,
  QuestionEditLink,
  IClassifyTreeItem,
  openMoveClassifyDialog,
} from '@ability-center/supv/question-bank';

import OperatorButtons from './components/operator-buttons';
import BatchComponents from './components/batch-components';
import listFilterConfig from './utils/list-filter-config';
import columnsConfig from './utils/list-grid-config';
import { resetStashedQuestion } from '../edit/utils/stash-question-content';
import { findPageByCondition, deleteQuestion, moveQuestion } from '../../api/question-bank';
import { IQuestionBankListDataType, IDeleteQuestionsFunc, IMoveQuestionProps } from './types';
import './styles.scss';

const { Filter, List, InlineFilter, Search, EasyGrid } = EasyList;

type IGridSelectWrapperType = IEasyGridSelection<IQuestionBankListDataType>;

const QuestionBankList: React.FC<{}> = () => {
  const questionList = React.useRef<IListContext | null>(null);
  const [totalQuestionNumber, setTotal] = React.useState<number>(0);
  /** 选中的数据 */
  const [selectedData, setSelectedRows] = React.useState<IQuestionBankListDataType[]>([]);
  /** 选中的分类 */
  const [categoryId, setCategoryId] = React.useState(0);
  const [selectedCategory, setSelectedCategory] = React.useState<IClassifyTreeItem>();

  const categoryName = React.useMemo(() => (selectedCategory && selectedCategory.title) || '', [
    selectedCategory,
  ]);
  const disabledBatchActions = React.useMemo<boolean>(() => selectedData.length === 0, [
    selectedData,
  ]);
  const emptyCreateLabel = React.useMemo(() => {
    return (
      <QuestionEditLink queries={{ type: 'create', categoryId, categoryName }}>
        &nbsp;去添加
      </QuestionEditLink>
    );
  }, [categoryId, categoryName]);

  const getQuestionBankList = React.useCallback<IListProps['onSubmit']>(
    (filter) => {
      const { page, pageSize, ...questionQuery } = filter;
      // 将categoryId作为一个外接的搜索条件接入
      const questionListQuery = Object.assign({}, questionQuery, { categoryId });
      return findPageByCondition(questionListQuery as any, { pageNumber: page, pageSize }).then(
        (res) => {
          const { content, total, pageable } = res;
          setTotal(total);
          return {
            dataset: content,
            pageInfo: {
              total,
              page: pageable.pageNumber,
            },
          };
        },
      );
    },
    [categoryId],
  );

  const handleSelect = React.useCallback<Required<IGridSelectWrapperType>['onSelect']>(
    (_, selectedRows) => {
      setSelectedRows(selectedRows);
      return true;
    },
    [],
  );

  const forceUpdate = React.useCallback(() => {
    // 重置筛选项
    if (questionList.current) {
      const { state, action } = questionList.current;
      action.setGlobalState({ selectedRowKeys: [] });
      if (state.page > 1) {
        action.setPage(1);
      } else {
        action.refresh();
      }
    }
  }, []);

  const handleDeleteQuestions = React.useCallback<IDeleteQuestionsFunc>(
    (deleteIds) => {
      deleteQuestion({ ids: deleteIds })
        .then((success) => {
          if (success) {
            Notify.success('删除成功');
            return Promise.resolve();
          } else {
            return Promise.reject('网络异常，请稍后重试');
          }
        })
        .then(forceUpdate)
        .catch(Notify.error);
    },
    [forceUpdate],
  );

  const handleMoveQuestions = React.useCallback(
    (passiveProps: IMoveQuestionProps) => {
      openMoveClassifyDialog(passiveProps, {
        submitEffect({ targetId }) {
          return moveQuestion({ ids: passiveProps.moveIds, targetCategoryId: targetId }).then(
            (success) => {
              if (success) Notify.success('移动分类成功');
              else Notify.error('网络异常，请稍后重试');
              return success;
            },
          );
        },
      })
        .afterClosed()
        .then((success) => success && forceUpdate())
        .catch((err) => err && Notify.error(err));
    },
    [forceUpdate],
  );

  const handleClickClassifyList = React.useCallback((targetId, rowData) => {
    setCategoryId(targetId);
    setSelectedCategory(rowData);
  }, []);
  // 强制更新列表
  React.useEffect(forceUpdate, [categoryId, forceUpdate]);
  React.useLayoutEffect(resetStashedQuestion, []);

  return (
    <div className="question-bank__list">
      <h1>题库</h1>
      <List
        mode="none"
        delay={2500}
        ref={questionList}
        onError={Notify.error}
        onSubmit={getQuestionBankList}
        defaultFilter={{ pageSize: 10 }}
      >
        <InlineFilter
          left={<OperatorButtons categoryId={categoryId} categoryName={categoryName} />}
          right={[
            <Filter
              autoFilter
              key="select-filter"
              config={listFilterConfig}
              backgroundColor="transparent"
            />,
            <Search key="keyword-filter" name="title" placeholder="输入题目名称搜索" />,
          ]}
        />
        <div className="question-bank__list-content">
          <div className="question-bank__list-classify-container">
            <ClassifyList
              needSystemDefault
              popPosition="top-left"
              defaultTreeNode={defaultTreeNode}
              onClickItem={handleClickClassifyList}
            />
          </div>
          <EasyGrid
            paginationType="lite"
            columns={columnsConfig(
              {
                deleteQuestions: handleDeleteQuestions,
                moveQuestions: handleMoveQuestions,
              },
              selectedCategory,
            )}
            scroll={{ x: 900 }}
            emptyCreateLabel={emptyCreateLabel}
            selection={{ onSelect: handleSelect }}
            batchRender={(selectedRows) => (
              <BatchComponents
                selectedRows={selectedRows}
                disabled={disabledBatchActions}
                onDelete={handleDeleteQuestions}
                onMoveItem={handleMoveQuestions}
                totalNumber={totalQuestionNumber}
              />
            )}
          />
        </div>
      </List>
    </div>
  );
};

export default QuestionBankList;

const defaultTreeNode = {
  id: 0,
  parentId: 0,
  expand: true,
  children: [],
  depPointer: [],
  title: '全部分类',
};
