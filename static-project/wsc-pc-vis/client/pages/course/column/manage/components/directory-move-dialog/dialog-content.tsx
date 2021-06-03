import waitFor from 'components/wait-for';
import React, { FC, useState } from 'react';
import { Button, ITreeData } from 'zent';
import DirectoryTree from '../directory-tree';
import TreeHeader from '../tree-header';
import { IMoveDirContentProps } from './types';

const MoveDirecotoryList: FC<IMoveDirContentProps> = (props) => {
  const { enableType, onConfirm, onClose, columnAlias, showUnClassify = false } = props;
  const [currentNode, setCurrentNode] = useState<ITreeData | undefined>(undefined);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  return (
    <div className="move-directory__wrapper">
      <div className="move-directory__title">请选择你想要移动到的目录</div>
      <TreeHeader hasOperations={false} />
      <DirectoryTree
        onDirectorySelect={setCurrentNode}
        hasOperation={false}
        enableType={enableType}
        itemClassName="move-tree__item"
        columnAlias={columnAlias}
        showUnClassify={showUnClassify}
        maxDirNameLength={20}
      />
      <div className="move-directory__actions">
        <span>
          <Button onClick={() => onClose()}>取消</Button>
          <Button
            type="primary"
            disabled={!currentNode}
            loading={btnLoading}
            onClick={() => {
              if (currentNode) {
                if (onConfirm) {
                  setBtnLoading(true);
                  onConfirm(currentNode).finally(() => {
                    // TODO：临时解决方案，解决es同步数据慢的问题
                    if (enableType === 'leaf') {
                      waitFor(2000).then(() => {
                        setBtnLoading(false);
                        onClose();
                      });
                    } else {
                      setBtnLoading(false);
                      onClose();
                    }
                  });
                }
              }
            }}
          >
            确定
          </Button>
        </span>
      </div>
    </div>
  );
};

export default MoveDirecotoryList;
