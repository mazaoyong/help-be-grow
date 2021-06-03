import React, { FC, useCallback } from 'react';
import { Tree } from 'zent';
import TreeNodeItem from './tree-node-item';
import { IBaseTreeProps } from './types';
// import { Operations } from '@youzan/react-components';
// import { checkMoveDown, checkMoveUp } from './utils';

const BaseTree: FC<IBaseTreeProps> = (props) => {
  const {
    treeData,
    itemClassName = '',
    getOperations,
    hasOperation,
    loadMore,
    onSelect,
    currentSelect,
    onRename,
    setTreeData,
    emitter,
    maxDirNameLength,
  } = props;

  const customRender = useCallback(
    (data) => {
      const { id } = data;
      const isSelect = currentSelect === id;
      return (
        <TreeNodeItem
          data={data}
          treeData={treeData}
          isSelect={isSelect}
          hasOperation={hasOperation}
          getOperations={getOperations}
          itemClassName={itemClassName}
          onRename={onRename}
          setTreeData={setTreeData}
          emitter={emitter}
          maxDirNameLength={maxDirNameLength}
        />
      );
    },
    [currentSelect, hasOperation, getOperations, itemClassName, onRename, treeData, setTreeData, emitter],
  );

  return (
    <Tree
      data={treeData}
      dataType="plain"
      render={customRender}
      loadMore={loadMore}
      onSelect={onSelect}
    />
  );
};

export default BaseTree;
