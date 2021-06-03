import { Pop } from '@zent/compat';
import React, { FC, useState, useEffect, useCallback } from 'react';
import { Icon } from 'zent';
import { INodeItemProps } from './types';
import './style.scss';

const TreeNodeItem: FC<INodeItemProps> = props => {
  const {
    data,
    hasOperation,
    getOperations,
    itemClassName,
    isSelect,
    onRename = () => {},
    treeData,
    emitter,
    maxDirNameLength = 10,
  } = props;
  const { name, contentNum, isLeaf, level, expand = false } = data;

  const [isExpand, setExpand] = useState<boolean>(expand);
  const [isFocused, setFocused] = useState<boolean>(false);
  const canOperation = hasOperation && data.directoryType !== 1;

  const setLineHovered = useCallback<(id: number) => void>(
    id => {
      if (!isFocused && id === data.id) {
        setFocused(true);
      }
    },
  [data.id, isFocused],
  );

  const setLineUnHovered = useCallback<(id: number) => void>(
    id => {
      if (isFocused && id === data.id) {
        setFocused(false);
      }
    },
  [data.id, isFocused],
  );

  useEffect(() => {
    if (treeData.length === 1 && data.id === -1) {
      // 根目录刷新时得展开
      setExpand(true);
    } else if (!isExpand && data.expand) {
      setExpand(true);
    }
  }, [treeData.length, data.id, data.expand]);

  useEffect(() => {
    if (emitter) {
      emitter.on('lineHovered', setLineHovered);
      emitter.on('lineUnHovered', setLineUnHovered);
    }
  }, [emitter, setLineHovered, setLineUnHovered]);

  return (
    <div
      className={`column-basetree__node ${itemClassName} ${
        isSelect ? 'column-basetree__node__select' : ''
      } ${isFocused ? 'column-basetree__node__hovered' : ''}`}
      style={{ paddingLeft: `${20 * (level + 1)}px` }}
      onClick={() => setExpand(!isExpand)}
    >
      {!isLeaf && (
        <Icon
          type="caret-down"
          className={`column-basetree__node__switcher ${
            isExpand ? '' : 'column-basetree__node__switcher__collapse'
          }`}
        />
      )}
      <div className="column-basetree__node__info">
        <div style={{ display: 'flex' }}>
          {name.length > maxDirNameLength ? (
            <Pop content={name} trigger="hover">
              <div className="column-basetree__node__name">{`${name.slice(0, maxDirNameLength)}..`}</div>
            </Pop>
          ) : (
            <div className="column-basetree__node__name">{name}</div>
          )}
          {canOperation && (
            <Icon
              type="edit-o"
              onClick={() => onRename && onRename(data)}
              className="column-basetree__node__edit"
            />
          )}
          {data.directoryType === 1 && (
            <Pop
              trigger="hover"
              content={
                <>
                  <p>该目录名称将不会在消费者端展示，放入该目录下的</p>
                  <p>内容将会默认展示在专栏中最下方且不归属于任一目录</p>
                </>
              }
            >
              <Icon type="help-circle" color="#bbb" className="column-basetree__node__qa" />
            </Pop>
          )}
        </div>
        <div className="column-basetree__node__number">{contentNum}</div>
      </div>
      {hasOperation && (
        <div className="column-basetree__node__operations">
          {data.directoryType !== 1 && getOperations && getOperations(data, treeData)}
        </div>
      )}
    </div>
  );
};

export default TreeNodeItem;
