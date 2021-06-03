import React from 'react';
import cx from 'classnames';
import { BlockLoading, Tree, ITreeData } from 'zent';

import CustomTreeRender from './custom-tree-render';

import {
  IClassifyTree,
  IClassifyTreeItem,
  IClassifyListProps,
  IModifyTreeDataParams,
  IDeleteTreeDataParams,
} from './types';
import { getCategoryTreeData, updateTreeData, deleteTreeData } from './tree-data-utils';
import { getCategoryList } from '../../../../api/question-bank';
import './styles.scss';

const ClassifyList: React.FC<IClassifyListProps> = (props) => {
  const {
    style,
    className,
    omitChild,
    onClickItem,
    updateSignal,
    onDataChange,
    defaultTreeNode,
    withHeader = false,
    showOperators = false,
    showQuestionCount = true,
    needSystemDefault = false,
    popPosition = 'top-center',
  } = props;
  const [loading, setLoading] = React.useState(false);
  const [prevOpenedId, setPrevOpenedId] = React.useState<number>();
  const [categoryData, setCategoryData] = React.useState<IClassifyTree>(
    defaultTreeNode ? [defaultTreeNode] : [],
  );
  /** 用于强制刷新树形图的key，在请求根节点数据的时候会被设置 */
  const [treeUpdateKey, setTreeUpdateKey] = React.useState(0);

  // 获取分类列表
  const fetchCategoryList = React.useCallback(
    (parentId?: number, selectDepPointer?: number[]): Promise<any> => {
      // 获取数据
      setLoading(true);
      if (parentId === 0 && selectDepPointer && selectDepPointer.length === 0) {
        setTreeUpdateKey((prevTreeUpdateKey) => prevTreeUpdateKey + 1);
      }
      return getCategoryList(
        { parentId: parentId || 0, needSystemDefault },
        { pageNumber: 1, pageSize: 200 },
      )
        .then((res) => {
          const { content } = res;
          setCategoryData((prevCategoryList) => {
            const newCategoryData = getCategoryTreeData(
              content,
              prevCategoryList,
              selectDepPointer || [],
              omitChild,
            );
            onDataChange && onDataChange(newCategoryData);
            return newCategoryData;
          });
          return Promise.resolve();
        })
        .catch(/** do nothing */)
        .finally(() => setLoading(false));
    },
    [needSystemDefault, omitChild, onDataChange],
  );

  const handleModifyTreeData = React.useCallback<IModifyTreeDataParams>(
    (modifiedAttr, dep) => {
      const newTreeDataList = updateTreeData(modifiedAttr, categoryData, dep);
      setCategoryData(newTreeDataList);
    },
    [categoryData],
  );

  const handleDeleteTreeData = React.useCallback<IDeleteTreeDataParams>(
    (dep) => {
      const newTreeDataList = deleteTreeData(categoryData, dep);
      setCategoryData(newTreeDataList);
    },
    [categoryData],
  );

  const customRender = React.useCallback(
    (data: ITreeData) => {
      const treeData = data as IClassifyTreeItem;
      return (
        <CustomTreeRender
          treeData={treeData}
          popPosition={popPosition}
          showOperators={showOperators}
          updateList={fetchCategoryList}
          showQuestionCount={showQuestionCount}
          updateTreeData={handleModifyTreeData}
          deleteTreeData={handleDeleteTreeData}
        />
      );
    },
    [
      popPosition,
      showOperators,
      showQuestionCount,
      fetchCategoryList,
      handleDeleteTreeData,
      handleModifyTreeData,
    ],
  );

  // 加载更多
  const loadMoreTreeData = React.useCallback(
    (data: ITreeData) => {
      const treeData = data as IClassifyTreeItem;
      if (prevOpenedId !== treeData.id) {
        setPrevOpenedId(treeData.id);
        return fetchCategoryList(treeData.id, treeData.depPointer);
      }
      return Promise.resolve();
    },
    [fetchCategoryList, prevOpenedId],
  );

  const listClasses = React.useMemo(
    () =>
      // prettier-ignore
      cx({
        'classify-list': true,
        'classify-list__withHeader': withHeader,
      }, className),
    [className, withHeader],
  );

  React.useEffect(() => {
    fetchCategoryList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (updateSignal && updateSignal > 0) {
      fetchCategoryList(0, []);
    }
  }, [fetchCategoryList, updateSignal]);

  const handleSelect = React.useCallback(
    (data: ITreeData) => {
      const treeData = data as IClassifyTreeItem;
      if (onClickItem) {
        onClickItem(treeData.id, treeData);
      }
    },
    [onClickItem],
  );

  return (
    <BlockLoading loading={loading} className={listClasses}>
      {withHeader && (
        <div className="classify-list__header">
          <div className="classify-list__header-content">分类名称</div>
          <div className="classify-list__header-content">题目数量</div>
        </div>
      )}
      <div className="classify-list__content" style={style}>
        <Tree
          key={treeUpdateKey}
          data={categoryData}
          render={customRender}
          loadMore={loadMoreTreeData}
          onSelect={handleSelect}
        />
      </div>
    </BlockLoading>
  );
};

export default ClassifyList;
export type { IClassifyTree, IClassifyTreeItem };
