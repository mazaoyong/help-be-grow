import React from 'react';
import { PopPositions, Link, Notify } from 'zent';
import { Operations } from '@youzan/react-components';
import { PopEllipsisText, EasyList } from '@youzan/ebiz-components';
import { openMoveClassifyDialog } from '@ability-center/supv/question-bank';

import openEditClassifyDialog, { IEditClassifyData } from '../edit-classify';

import {
  deleteCategory,
  updateCategory,
  createCategory,
  moveCategory,
} from '../../../../api/question-bank';
import {
  IClassifyTreeItem,
  IClassifyActions,
  IModifyTreeDataParams,
  IDeleteTreeDataParams,
} from './types';

interface ICustomTreeRender {
  showOperators: boolean;
  popPosition: PopPositions;
  showQuestionCount: boolean;
  treeData: IClassifyTreeItem;
  updateList(updateParentId: number, selectedDeps: number[]): void;
  updateTreeData: IModifyTreeDataParams;
  deleteTreeData: IDeleteTreeDataParams;
}

const { GridPop } = EasyList;

const CustomTreeRender: React.FC<ICustomTreeRender> = (props) => {
  const {
    treeData,
    popPosition,
    showOperators,
    updateList,
    updateTreeData,
    deleteTreeData,
    showQuestionCount,
  } = props;
  const { id, title, depPointer, parentId } = treeData;

  const setActiveClass = React.useCallback((evt: React.MouseEvent<HTMLDivElement>) => {
    const curTarget = evt.currentTarget;
    const allTreeNodes = document.querySelectorAll('.classify-list__treeNode');
    if (allTreeNodes.length) {
      allTreeNodes.forEach((node) => node.classList.remove('active'));
    }
    curTarget.classList.add('active');
  }, []);

  const handleDeleteClassify = React.useCallback(() => {
    deleteCategory({ id })
      .then((success) => {
        if (success) {
          Notify.success('删除成功');
          // 先从视图中删除
          deleteTreeData(depPointer);
          updateList(parentId || 0, depPointer);
        } else Notify.error('网络异常，请稍后重试');
      })
      .catch(Notify.error);
  }, [deleteTreeData, depPointer, id, parentId, updateList]);

  const handlePostResultCallback = React.useCallback(
    (type: 'add' | 'edit') => {
      return function handleSuccess(success: any) {
        if (success) {
          Notify.success(type === 'add' ? '添加成功' : '重命名成功');
          if (type === 'add') {
            updateList(id, depPointer);
          }
        } else {
          Notify.error('网络异常，请稍后重试');
        }
        return success;
      };
    },
    [depPointer, id, updateList],
  );

  /** 弹窗 */
  const handleAddClassify = React.useCallback(
    (evt: React.MouseEvent<HTMLAnchorElement>) => {
      if (depPointer.length >= 5) return;
      evt.stopPropagation();
      openEditClassifyDialog({
        type: 'add',
        parentId: id,
        submitEffect(payload) {
          return createCategory(payload).then(handlePostResultCallback('add'));
        },
      })
        .afterClosed()
        .catch((err) => err && Notify.error(err));
    },
    [depPointer.length, handlePostResultCallback, id],
  );

  // 更新分类名字不需要重新请求列表接口
  const handleEditCallback = React.useCallback(
    (payload: IEditClassifyData) => {
      const currentName = payload.name;
      updateTreeData({ title: currentName }, depPointer);
    },
    [depPointer, updateTreeData],
  );

  const handleEditClassify = React.useCallback(
    (evt: React.MouseEvent<HTMLAnchorElement>) => {
      evt.stopPropagation();
      openEditClassifyDialog({
        type: 'edit',
        id: id,
        name: title,
      })
        .afterClosed()
        .then((payload: any) => {
          handleEditCallback(payload);
          return payload;
        })
        .then(updateCategory)
        .then(handlePostResultCallback('edit'))
        .catch((err) => err && Notify.error(err));
    },
    [handleEditCallback, handlePostResultCallback, id, title],
  );

  const handleMoveClassify = React.useCallback(
    (evt: React.MouseEvent<HTMLAnchorElement>) => {
      evt.stopPropagation();
      openMoveClassifyDialog(
        { depPointer, selectedTreeNode: treeData },
        {
          submitEffect({ targetId }) {
            return moveCategory({ targetParentId: targetId, currentId: id }).then((success) => {
              if (success) Notify.success('移动分类成功');
              else Notify.error('网络异常，请稍后重试');
              return success;
            });
          },
        },
      )
        .afterClosed()
        /** 刷新分类列表，重新获取一级分类列表 */
        .then(() => updateList(0, []))
        .catch((err) => err && Notify.error(err));
    },
    [depPointer, id, treeData, updateList],
  );

  const ACTIONS = React.useMemo(() => {
    let actions: React.ReactNode[] = [];
    if (showOperators) {
      actions = [
        <Link
          key={IClassifyActions.addItem}
          disabled={depPointer.length >= 5}
          onClickCapture={handleAddClassify}
        >
          添加子分类
        </Link>,
        <Link key={IClassifyActions.refactorItem} onClickCapture={handleEditClassify}>
          重命名
        </Link>,
        <Link key={IClassifyActions.moveItem} onClickCapture={handleMoveClassify}>
          移动
        </Link>,
        <GridPop
          text="删除"
          trigger="click"
          preventDefault
          confirmText="确定"
          position="top-right"
          className="double-confirm"
          key={IClassifyActions.deleteItem + id}
          content={
            <div className="pop-content">
              <p>删除后将不可恢复，确定删除？</p>
              <p> 该分类下的题目将被移动到“未分类”下。</p>
            </div>
          }
          onConfirm={handleDeleteClassify}
        />,
      ];
    }
    return actions;
  }, [
    id,
    showOperators,
    depPointer.length,
    handleAddClassify,
    handleEditClassify,
    handleMoveClassify,
    handleDeleteClassify,
  ]);

  // 初次加载，如果当前的节点是categoryId为0，就选中
  const defaultClassName = React.useMemo(() => {
    if (treeData.id === 0) return 'classify-list__treeNode active';
    return 'classify-list__treeNode';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={defaultClassName} onClickCapture={setActiveClass}>
      <div className="treeNode__title">
        <PopEllipsisText text={treeData.title} selector=".treeNode__title" position={popPosition} />
      </div>
      {(showQuestionCount || showOperators) && (
        <div className="treeNode__right">
          {showQuestionCount && <div className="treeNode__content">{treeData.questionCount}</div>}
          {showOperators && (
            <div className="treeNode__ops">
              <Operations items={ACTIONS} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomTreeRender;
