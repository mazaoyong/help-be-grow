import { Pop } from '@zent/compat';
import React, { useState, useRef, useImperativeHandle, useMemo } from 'react';
import { ITreeData, Icon, Button } from 'zent';
import DirectoryTree from '../../components/directory-tree';
import { Icon as EbizIcon } from '@youzan/ebiz-components';
import './style.scss';
// import { DIR_TREE_ICON } from '../../constants';
import { get } from 'lodash';
import { ArthurContainer } from '@youzan/arthur-scheduler-react';
import { iconfontAdaptor, useUserScript } from '@hooks';

// const { ImgWrap } = Img;

interface IDirectoryContainerProps {
  setDrawerVisible: (visible: boolean) => void;
  columnAlias: string;
  setCurrentDir: (data: ITreeData) => void;
}

const DirectoryContainer = React.forwardRef<any, IDirectoryContainerProps>((props, ref) => {
  const { setDrawerVisible, columnAlias, setCurrentDir } = props;
  const treeRef = useRef<any>();
  const [showTree, setShowTree] = useState<boolean>(true);

  const userScriptParams = useMemo(() => iconfontAdaptor(
    'summaryDetail',
    '//at.alicdn.com/t/font_941543_speku2y40u9.js',
  ), []);

  useImperativeHandle(ref, () => ({
    refreshTree: () => {
      if (get(treeRef, 'current.refresh')) {
        treeRef.current.refresh();
      }
    },
  }));

  useUserScript({
    uniqueId: 'column-directory__wrapper',
    ...userScriptParams,
  });

  return (
    <div className={`column-directory__wrapper ${!showTree ? 'column-directory__hide' : ''}`}>
      {showTree ? (
        <div className="column-directory__group">
          <ArthurContainer name="dirManage" namespace="知识付费">
            <Button
              className="column-directory__btn"
              outline
              onClick={() => setDrawerVisible(true)}
            >
              目录管理
            </Button>
          </ArthurContainer>
          <div className="column-directory__container">
            <DirectoryTree
              ref={treeRef}
              columnAlias={columnAlias}
              enableType="leaf"
              onDirectorySelect={setCurrentDir}
              showRoot
              itemClassName="column-directory__menu"
            />
          </div>
        </div>
      ) : (
        <Icon
          type="nav-line"
          onClick={() => setShowTree(true)}
          className="column-directory__cast"
        />
      )}
      <Pop content={`${showTree ? '收起' : '展开'}目录`} trigger="hover">
        <div
          className={`column-directory__toggle ${
            showTree ? 'column-directory__toggle__collapse' : 'column-directory__toggle__expand'
          }`}
          onClick={() => setShowTree(!showTree)}
        >
          <EbizIcon
            type={'d-arrow-down' as any}
            size="16px"
            color="#c3c3c3"
            className="column-directory__toggle__icon"
          />
        </div>
      </Pop>
    </div>
  );
});

export default DirectoryContainer;
