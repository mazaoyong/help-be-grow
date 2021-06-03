import React, { useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { IDirectoryTreeProps } from './types';
import BaseTree from './base-tree';
import { queryDirectoryList } from '../../api';
import { BlockLoading, ITreeData, Notify } from 'zent';
import { checkMoveDown, checkMoveUp, mergeDirectory } from './utils';
import EventEmitter from 'wolfy87-eventemitter';
import './style.scss';

const getDefaultTree: () => ITreeData[] = () => [
  {
    name: '全部课程',
    id: -1,
    isLeaf: true,
    level: 0,
    pid: null,
    parentId: 0,
    selectable: true,
    contentNum: 0,
    expand: true,
    cached: true,
  },
];
const defaultRootPid = 0;
const lineEmitter = new EventEmitter();

const DirectoryTree = React.forwardRef<any, IDirectoryTreeProps>((props, ref) => {
  const {
    maxLevel = 1,
    showUnClassify = true,
    onDirectorySelect,
    afterTreeRender,
    enableType,
    showRoot,
    getOperations,
    hasOperation = false,
    itemClassName,
    columnAlias,
    onRename,
    emptyText,
    maxDirNameLength,
  } = props;

  const defaultTree: ITreeData[] = showRoot ? getDefaultTree() : [];
  const defaultSelect: number = showRoot ? defaultTree[0].id : null;
  const [treeData, setTreeData] = useState<ITreeData[]>(defaultTree);
  const [currentSelect, setCurrentSelect] = useState<number | null>(defaultSelect);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchDirectoryList = useCallback<(pid: number, currentLevel: number, isOpen?: boolean) => any>(
    (pid, currentLevel, isOpen) => {
      const queryDTO = {
        columnAlias,
        pid,
      };
      const pageRequest = {
        pageNumber: 1,
        pageSize: 100,
      };
      setLoading(true);
      return queryDirectoryList({ pageRequest, queryDTO })
        .then(res => {
          if (!res) {
            return;
          }
          const { content = [] } = res as any;
          const mergeTree = mergeDirectory({
            currentData: treeData,
            newData: content,
            currentLevel,
            maxLevel,
            showRoot,
            showUnClassify,
            openId: isOpen ? pid : undefined,
          });
          setTreeData(mergeTree);
        })
        .catch(error => Notify.error(error))
        .finally(() => {
          setLoading(false);
          afterTreeRender && afterTreeRender();
        });
    },
  [afterTreeRender, columnAlias, maxLevel, showRoot, showUnClassify, treeData],
  );

  const onSelect = useCallback(
    data => {
      if (enableType === 'leaf') {
        if (data.isLeaf || data.id === -1) {
          setCurrentSelect(data.id);
          onDirectorySelect && onDirectorySelect(data);
        }
      } else if (enableType === 'branch') {
        // 枝节点，或者层级小于最大层，但是不包含内容的叶节点
        if (!data.isLeaf || (data.isLeaf && data.level < maxLevel)) {
          const curId = data.id === -1 ? 0 : data.id;
          setCurrentSelect(curId);
          onDirectorySelect && onDirectorySelect(data);
        }
      }
    },
    [enableType, onDirectorySelect, maxLevel],
  );

  const loadMore = useCallback(
    data => {
      if (data.cached) {
        return new Promise<void>(resolve => setTimeout(() => resolve(), 1000000));
      }
      const curId = data.id === -1 ? 0 : data.id;
      return fetchDirectoryList(curId, data.level + 1);
    },
    [fetchDirectoryList],
  );

  const refreshTree = useCallback(
    (data?: ITreeData, isOpen?: boolean) => {
      if (!data) {
        setTreeData(defaultTree);
        fetchDirectoryList(defaultRootPid, 0, isOpen);
      } else {
        fetchDirectoryList(data.pid, data.level, isOpen);
      }
    },
    [defaultTree, fetchDirectoryList],
  );

  useImperativeHandle(
    ref,
    () => ({
      refresh: (data, isOpen) => {
        refreshTree(data, isOpen);
      },
      triggerLineHovered: (id) => {
        lineEmitter.emit('lineHovered', id);
      },
      triggerLineUnHovered: (id) => {
        lineEmitter.emit('lineUnHovered', id);
      },
      getTreeData: () => {
        return treeData;
      },
      checkMove: (data: ITreeData, treeData: ITreeData[], direction: 'up' | 'down') => {
        if (direction === 'up') {
          return checkMoveUp(treeData, data);
        } else {
          return checkMoveDown(treeData, data);
        }
      },
      getNextId: (id, pid, treeData) => {
        const allData = treeData.filter(item => item.pid === pid) || [];
        for (let index = 0; index < allData.length; index++) {
          if (index === allData.length - 1) {
            return null;
          } else if (allData[index].id === id) {
            return allData[index + 1].id;
          }
        }
        return null;
      },
      getPreviousId: (id, pid, treeData) => {
        const allData = treeData.filter(item => item.pid === pid) || [];
        for (let index = 0; index < allData.length; index++) {
          if (allData[index].id === id && index !== 0) {
            return allData[index - 1].id;
          }
        }
        return null;
      },
    }),
    [refreshTree, treeData],
  );

  useEffect(() => {
    fetchDirectoryList(defaultRootPid, 0);
  }, []);

  const isEmptyData = useCallback(() => {
    return treeData.length === 0 || (treeData.length === 1 && treeData[0].directoryType === 1);
  }, [treeData]);

  return (
    <div className="column-directory__tree__wrapper">
      <BlockLoading loading={loading}>
        <BaseTree
          hasOperation={hasOperation}
          itemClassName={itemClassName}
          treeData={treeData}
          onSelect={onSelect}
          loadMore={loadMore}
          getOperations={getOperations}
          currentSelect={currentSelect}
          onRename={onRename}
          setTreeData={setTreeData}
          emitter={lineEmitter}
          maxDirNameLength={maxDirNameLength}
        />
        {isEmptyData() && <p className="dir-manage__emptytext">{emptyText}</p>}
      </BlockLoading>
    </div>
  );
});

export default DirectoryTree;
