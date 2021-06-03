import React, { FC, useCallback, useRef } from 'react';
import { Drawer } from '@youzan/react-components';
import ActionTree from '../actions-tree';
import { IDrawProps } from './types';
import { Button } from 'zent';
import openEditDirDialog from '../create-dir-dialog';
import TreeHeader from '../tree-header';
import './style.scss';
// import get from 'lodash/get';

const ActionTreeDraw: FC<IDrawProps> = props => {
  const { visible = false, setVisible, columnAlias } = props;
  // const [hasData, setHasData] = useState<boolean>(false);

  const drawerRef = useRef<any>();

  const createDir = useCallback(
    data => {
      openEditDirDialog({
        currentDir: data,
        type: 'create',
        columnAlias,
        onCorfirm: () => {
          if (drawerRef && drawerRef.current) {
            drawerRef.current.refreshTree();
          }
        },
      });
    },
    [columnAlias],
  );

  return (
    <Drawer title="目录管理" visible={visible} onClose={() => setVisible(false)}>
      <div className="dir-manage__drawer">
        <Button
          onClick={() =>
            createDir({
              id: 0,
              pid: -1,
            })
          }
          style={{ margin: '16px 0 0 16px' }}
          type="primary"
        >
          新增目录
        </Button>
        <TreeHeader hasOperations />
        <ActionTree
          enableType="none"
          maxLevel={1}
          columnAlias={columnAlias}
          ref={drawerRef}
          emptyText={
            <>
              暂无目录，
              <a
                onClick={() =>
                  createDir({
                    id: 0,
                    pid: -1,
                  })
                }
              >
                立即新建目录
              </a>
            </>
          }
        />
      </div>
    </Drawer>
  );
};

export default ActionTreeDraw;
