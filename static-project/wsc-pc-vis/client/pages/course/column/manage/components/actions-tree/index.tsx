import { Pop } from '@zent/compat';
import { ITreeData, Notify } from 'zent';
import React, { useCallback, useImperativeHandle, useRef } from 'react';
import { deleteColumnDir, moveColumnDir } from '../../api';
import openDirectoryMoveDialog from '../directory-move-dialog';
import DirectoryTree from '../directory-tree';
import { IActionTreeProps } from './types';
import get from 'lodash/get';
import { Operations } from '@youzan/react-components';
import './style.scss';
import openEditDirDialog from '../create-dir-dialog';
import DeletePop from './delete-pop';

const ActionTree = React.forwardRef<any, IActionTreeProps>((props, ref) => {
  const { maxLevel = 1, enableType, columnAlias, afterTreeRender, emptyText } = props;
  const directoryTreeRef = useRef<any>();

  const onCancel = useCallback(data => {
    directoryTreeRef.current && directoryTreeRef.current.triggerLineUnHovered(data.id);
  }, []);

  const onMoveAnother = useCallback(
    data => {
      directoryTreeRef.current && directoryTreeRef.current.triggerLineHovered(data.id);
      openDirectoryMoveDialog({
        enableType: 'branch',
        columnAlias,
        onCancel: () => {
          onCancel(data);
        },
        onConfirm: targetData => {
          const { id: targetId } = targetData;
          if (targetId === data.id) {
            Notify.error('移动目录和目标目录不能相同');
            return Promise.resolve();
          }
          const params = {
            id: data.id,
            moveType: 3,
            columnAlias,
            pid: data.pid,
            targetId,
          };
          return moveColumnDir({ moveDTO: params })
            .then(() => {
              directoryTreeRef.current.refresh();
              directoryTreeRef.current.triggerLineUnHovered(data.id);
              Notify.success('移动成功');
            })
            .catch(() => {
              Notify.error(`移动失败，${targetData.name || ''}目录下最多支持100个子目录`);
            });
        },
      });
    },
    [columnAlias, onCancel],
  );

  const onMoveUp = useCallback(
    (data, treeData) => {
      if (get(directoryTreeRef, 'current.getPreviousId')) {
        const targetId = directoryTreeRef.current.getPreviousId(data.id, data.pid, treeData);
        const params = {
          id: data.id,
          moveType: 1,
          columnAlias,
          pid: data.pid,
          targetId,
        };
        moveColumnDir({ moveDTO: params })
          .then(() => {
            directoryTreeRef.current.refresh(data);
            Notify.success('移动成功');
          })
          .catch(() => Notify.error('移动失败'));
      }
    },
    [columnAlias],
  );

  const onMoveDown = useCallback(
    (data, treeData) => {
      if (get(directoryTreeRef, 'current.getNextId')) {
        const targetId = directoryTreeRef.current.getNextId(data.id, data.pid, treeData);
        const params = {
          id: data.id,
          moveType: 2,
          columnAlias,
          pid: data.pid,
          targetId,
        };
        moveColumnDir({ moveDTO: params })
          .then(() => {
            directoryTreeRef.current.refresh(data);
            Notify.success('移动成功');
          })
          .catch(() => Notify.error('移动失败'));
      }
    },
    [columnAlias],
  );

  const onDelete = useCallback(
    data => {
      directoryTreeRef.current && directoryTreeRef.current.triggerLineHovered(data.id);
      const params = {
        id: data.id,
        columnAlias,
      };
      deleteColumnDir({ deleteDTO: params })
        .then(() => {
          directoryTreeRef.current.refresh(data);
          directoryTreeRef.current.triggerLineUnHovered(data.id);
          Notify.success('删除成功');
        })
        .catch(() => {
          Notify.error('删除失败，请重试');
        });
    },
    [columnAlias],
  );

  const onCreateSubDir = useCallback(
    data => {
      directoryTreeRef.current && directoryTreeRef.current.triggerLineHovered(data.id);
      openEditDirDialog({
        currentDir: data,
        type: 'create',
        level: 'subNode',
        columnAlias,
        onCancel: () => {
          onCancel(data);
        },
        onCorfirm: () => {
          if (get(directoryTreeRef, 'current.refresh')) {
            directoryTreeRef.current.refresh({ pid: data.id, level: data.level + 1 }, true);
            directoryTreeRef.current.triggerLineUnHovered(data.id);
          }
        },
      });
    },
    [columnAlias, onCancel],
  );

  const onRename = useCallback(
    data => {
      directoryTreeRef.current && directoryTreeRef.current.triggerLineHovered(data.id);
      openEditDirDialog({
        currentDir: data,
        level: data.level === 1 ? 'parentNode' : 'subNode',
        type: 'update',
        columnAlias,
        onCancel: () => {
          onCancel(data);
        },
        onCorfirm: () => {
          if (get(directoryTreeRef, 'current.refresh')) {
            directoryTreeRef.current.refresh(data);
            directoryTreeRef.current.triggerLineUnHovered(data.id);
          }
        },
      });
    },
    [columnAlias, onCancel],
  );

  const getOperation = useCallback(
    (data: ITreeData, treeData: ITreeData[]) => {
      const { isLeaf, level } = data as any;
      const operations: React.ReactNode[] = [];
      const hasRef = get(directoryTreeRef, 'current.checkMove');
      const canMoveUp = hasRef && directoryTreeRef.current.checkMove(data, treeData, 'up');
      const canMoveDown = hasRef && directoryTreeRef.current.checkMove(data, treeData, 'down');
      if (!isLeaf || (isLeaf && level < maxLevel)) {
        operations.push(
          <span
            className="column-basetree__operation__item"
            onClick={e => {
              e.stopPropagation();
              onCreateSubDir(data);
            }}
          >
            创建子目录
          </span>,
        );
      }
      operations.push(
        canMoveUp ? (
          <span
            className={`column-basetree__operation__item`}
            onClick={e => {
              e.stopPropagation();
              onMoveUp(data, treeData);
            }}
          >
            上移
          </span>
        ) : (
          <Pop trigger="hover" content="该目录已是第一位，无法上移">
            <span
              className={`column-basetree__operation__item operation__disabled`}
              onClick={e => e.stopPropagation()}
            >
              上移
            </span>
          </Pop>
        ),
      );
      operations.push(
        canMoveDown ? (
          <span
            className={`column-basetree__operation__item`}
            onClick={e => {
              e.stopPropagation();
              onMoveDown(data, treeData);
            }}
          >
            下移
          </span>
        ) : (
          <Pop trigger="hover" content="该目录已是最后一位，无法下移">
            <span
              className={`column-basetree__operation__item operation__disabled`}
              onClick={e => e.stopPropagation()}
            >
              下移
            </span>
          </Pop>
        ),
      );
      operations.push(
        isLeaf ? <span
          className={`column-basetree__operation__item`}
          onClick={e => {
            e.stopPropagation();
            isLeaf && onMoveAnother(data);
          }}
        >
          移动
        </span>
          : <Pop trigger="hover" content="该目录包含子目录，无法移动">
            <span
              className={`column-basetree__operation__item operation__disabled`}
            >
              移动
            </span>
          </Pop>,
      );
      operations.push(
        <DeletePop
          onCancel={() => onCancel(data)}
          onClick={() => directoryTreeRef.current && directoryTreeRef.current.triggerLineHovered(data.id)}
          onDelete={() => {
            onDelete(data);
          }}
        />,
      );
      return <Operations maxDisplayItemNum={5} items={operations} />;
    },
    [maxLevel, onCancel, onCreateSubDir, onDelete, onMoveAnother, onMoveDown, onMoveUp],
  );

  useImperativeHandle(ref, () => ({
    refreshTree: () => {
      if (get(directoryTreeRef, 'current.refresh')) {
        directoryTreeRef.current.refresh();
      }
    },
    getTreeData: () => {
      if (get(directoryTreeRef, 'current.getTreeData')) {
        return directoryTreeRef.current.getTreeData();
      }
    },
  }));

  return (
    <div className="action-tree__container">
      <DirectoryTree
        itemClassName="action-tree__item"
        hasOperation={true}
        getOperations={getOperation}
        ref={directoryTreeRef}
        enableType={enableType}
        onDirectorySelect={() => {}}
        onRename={onRename}
        columnAlias={columnAlias}
        showUnClassify={false}
        afterTreeRender={afterTreeRender}
        emptyText={emptyText}
      />
    </div>
  );
});

export default ActionTree;
