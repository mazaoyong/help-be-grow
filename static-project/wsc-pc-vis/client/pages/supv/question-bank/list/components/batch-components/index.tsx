import React from 'react';
import { Button } from 'zent';
import { EasyList } from '@youzan/ebiz-components';
import { Operations } from '@youzan/react-components';
import { IClassifyTreeItem } from '@ability-center/supv/question-bank';

import { IMoveQuestionFunc, IDeleteQuestionsFunc } from '../../types';
import './style.scss';

const { GridPop } = EasyList;
interface IDescriptionProps {
  totalNumber: number;
}
interface IBatchComponentsProps extends IDescriptionProps {
  disabled: boolean;
  selectedRows: IClassifyTreeItem[];
  onDelete: IDeleteQuestionsFunc;
  onMoveItem: IMoveQuestionFunc;
}

const Descriptions: React.FC<IDescriptionProps> = (props) => {
  return (
    <Operations
      className="batch-components__description"
      items={[
        <span key="totalNumber">共{props.totalNumber}项</span>,
        <span key="batchLabel">批量操作</span>,
      ]}
    />
  );
};

const BatchComponents: React.FC<IBatchComponentsProps> = ({
  disabled,
  onDelete,
  onMoveItem,
  selectedRows,
  ...descriptionProps
}) => {
  const passiveIds = React.useMemo(() => {
    if (Array.isArray(selectedRows) && selectedRows.length) {
      return selectedRows.map((selected) => selected.id);
    }
    return [];
  }, [selectedRows]);

  const handleMoveItem = React.useCallback(
    // 需要传给moveClassify组件选中题目的深度信息，用以剔除这个层级及其子级的分类
    () => onMoveItem({ moveIds: passiveIds, needSystemDefault: true }),
    [onMoveItem, passiveIds],
  );
  const handleDeleteItem = React.useCallback(() => onDelete(passiveIds), [onDelete, passiveIds]);

  return (
    <div className="question-bank__list-batch-components">
      <Descriptions {...descriptionProps} />
      <Button disabled={disabled} onClick={handleMoveItem}>
        移动
      </Button>
      <GridPop
        text={<Button disabled={disabled}>删除</Button>}
        key="delete"
        trigger="click"
        confirmText="确定"
        position="top-center"
        className="double-confirm"
        content="删除后不可恢复，确认删除？"
        onConfirm={handleDeleteItem}
      />
    </div>
  );
};

export default BatchComponents;
