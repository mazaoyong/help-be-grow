import { React, createBlock, useEffect, useState } from '@youzan/tany-react';
import { closeDialog, Tabs } from 'zent';
import { ArthurContainer } from '@youzan/arthur-scheduler-react';
import { isInStoreCondition } from 'fns/chain';
import CampusFilter, { CampusContext } from './components/campus-filter';
import { UmpAppBoardV2 } from '@youzan/react-components';
import WorkbookList from './blocks/workbook-list';
import AwardManage from './blocks/award-manage';
import { WORKBOOK_DELETE_DIALOG_ID } from './constants';
import { APPID } from '../../../constants';
import './styles.scss';

interface IModel {
  targetKdtId: number,
  tabActive: string;
  isHqAndSelf: boolean;
  setTabActive: Function;
  setTargetKdtId: Function;
}

const TabPanel = Tabs.TabPanel;

const model = () => {
  const [tabActive, setTabActive] = useState('1');
  const [targetKdtId, setTargetKdtId] = useState(_global.kdtId);
  const isHqAndSelf = showCampusFilter && targetKdtId === _global.kdtId;
  useEffect(() => {
    return () => closeDialog(WORKBOOK_DELETE_DIALOG_ID); // 防止打开弹窗时回退，弹窗未关闭
  }, []);
  return {
    targetKdtId,
    tabActive,
    setTabActive,
    setTargetKdtId,
    isHqAndSelf,
  };
};

const showCampusFilter = isInStoreCondition({
  supportHqStore: true,
  supportUnifiedPartnerStore: true,
  supportMinifyParterShop: true,
});

const ListPage = (model: IModel) => {
  return (
    <div className="workbook-list">
      <div className="workbook-list__head">
        <UmpAppBoardV2 id={APPID} title="作业本" hasMarginBottom={false} />
        {showCampusFilter && <CampusFilter onChange={val => model.setTargetKdtId(val)} />}
      </div>
      <ArthurContainer name="createHomework" namespace="督学互动"></ArthurContainer>
      <CampusContext.Provider
        value={{ targetKdtId: model.targetKdtId, isHeadquarters: showCampusFilter }}
      >
        {model.isHqAndSelf ? (
          <WorkbookList />
        ) : (
          <Tabs
            activeId={model.tabActive}
            onChange={id => model.setTabActive(id)}
            unmountPanelOnHide
          >
            <TabPanel tab="作业本管理" id="1">
              <WorkbookList />
            </TabPanel>
            <TabPanel tab="奖励管理" id="2">
              <AwardManage />
            </TabPanel>
          </Tabs>
        )}
      </CampusContext.Provider>
    </div>
  );
};

export default createBlock({
  root: ListPage,
  model,
});
