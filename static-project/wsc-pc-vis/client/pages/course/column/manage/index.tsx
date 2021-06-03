import React, { FC, useEffect, useState, useCallback, useRef } from 'react';
import { ITreeData, Notify } from 'zent';
import mapKeysToCamelCase from 'zan-utils/string/mapKeysToCamelCase';
import { ShowWrapper } from 'fns/chain';
import { showBdappCode } from 'common/api/request';
import FilterList, { IContentFilterProps } from './list';
import { getRiskLockAPI } from '../../api/pct/risk-lock';
import { chainSupportHqAndSingle } from '../../common/chain';
import ColumnBoard from './components/column-board';
import ActionBar from './components/action-bar';
import { getByAlias, updateSerializedStatus } from '../common/api';
import { IColumnData } from './model';
import DirectoryContainer from './blocks/directory-container';
import DirectoryTreeDrawer from './components/directory-manage-drawer';
import './style.scss';
import { get } from 'lodash';

const { alias } = window._global as IGlobal & { alias: string };

const App: FC = () => {
  const [isRiskLock, setRiskLock] = useState(false);
  const [hideBdapp, setBdapp] = useState(true);
  const [updateState, setUpdateState] = useState(0);
  const [columnData, setColumnData] = useState({} as IColumnData);
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const [currentDirId, setDirId] = useState<number>(0);
  const [filterData, setFilterData] = useState<IContentFilterProps>({ type: 'all', name: '' });
  const treeRef = useRef<any>();
  const { isUpdate } = columnData;

  const getDetail = useCallback(() => {
    getByAlias({
      alias,
    })
      .then((data) => {
        setColumnData(mapKeysToCamelCase(data));
      })
      .catch((msg) => {
        Notify.error(msg);
      });
  }, []);

  const onChangeUpdate = useCallback(() => {
    const errMsg = `${isUpdate === 0 ? '开启更新' : '停止更新'}失败`;

    updateSerializedStatus(alias, isUpdate)
      .then(() => {
        const newStatus = isUpdate === 0 ? 1 : 0;
        setColumnData({
          ...columnData,
          isUpdate: newStatus,
        });
      })
      .catch(({ msg }) => {
        Notify.error(msg || errMsg);
      });
  }, [isUpdate, columnData]);

  const refresh = useCallback(() => {
    setUpdateState(updateState + 1);
    refreshTreeContainer();
  }, [updateState]);

  useEffect(() => {
    getRiskLockAPI().then((data = {}) => {
      setRiskLock(!!Number(data.onoff || 0));
    });
    showBdappCode().then((res) => {
      if (res && res.mpId) {
        setBdapp(false);
      }
    });
    getDetail();
  }, [getDetail]);

  const setCurrentDirectory = useCallback((data: ITreeData) => {
    const currentDataId = data.id === -1 ? 0 : data.id;
    setDirId(currentDataId);
  }, []);

  const refreshTreeContainer = useCallback(() => {
    if (get(treeRef, 'current.refreshTree')) {
      treeRef.current.refreshTree();
    }
  }, []);

  const toggleDrawerShow = useCallback((value) => {
    setShowDrawer(value);
    if (!value) {
      refreshTreeContainer();
    }
  }, [refreshTreeContainer]);

  return (
    <div className="column-list">
      <ColumnBoard
        data={columnData}
        onGetDetail={getDetail}
        onChangeUpdate={onChangeUpdate}
        hideBdapp={hideBdapp}
      />
      <div className="content-list__container">
        <DirectoryContainer
          ref={treeRef}
          columnAlias={alias}
          setDrawerVisible={toggleDrawerShow}
          setCurrentDir={setCurrentDirectory}
        />
        <div className="column-content__list">
          <ShowWrapper isInStoreCondition={chainSupportHqAndSingle}>
            <ActionBar
              currentDirId={currentDirId}
              data={columnData}
              onChangeUpdate={onChangeUpdate}
              isLock={isRiskLock}
              onBatchSuccess={refresh}
              setFilterData={setFilterData}
            />
          </ShowWrapper>
          <FilterList
            filterData={filterData}
            hideBdapp={hideBdapp}
            alias={alias}
            refreshTreeContainer={refreshTreeContainer}
            updateState={updateState}
            directoryId={currentDirId}
          />
        </div>
      </div>
      <DirectoryTreeDrawer columnAlias={alias} visible={showDrawer} setVisible={toggleDrawerShow} />
    </div>
  );
};

export default App;
