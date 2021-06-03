// 详情右侧
import React, { useState } from 'react';
import { Tabs, Dialog } from 'zent';
import { useWillUnmount } from '../../../../utils/hooks';
import store from '../../store';
import getCurClueId from '../../utils/get-cur-clueid';
import './style.scss';

import { CluePhase, ClueTag, ClueRecords } from '@ability-center/clue';
import { SignedCourseList, AppointmentList } from '@ability-center/assets';

import { isEduShop } from '@youzan/utils-shop';
import Actions from '../clue-actions';

const { closeDialog } = Dialog;
const TabPanel = Tabs.TabPanel;

const ChangePhaseDialogID = 'ChangePhaseDialogID';

const DetailEtc = () => {
  const clueId = getCurClueId();
  const [activeTab, setActiveTab] = useState(1);
  const { tags, phase, owners, kdtId, roleId, timeStamp, userId, name, telephone } = store.useStoreState();

  useWillUnmount(() => closeDialog(ChangePhaseDialogID));

  return (
    <article className="clue-detail__etc">
      <Actions owners={owners} clueId={clueId} />
      <hr color="#EBEDF0" />
      <CluePhase
        clueId={clueId}
        phase={phase}
        owners={owners}
        kdtId={kdtId}
        roleId={roleId}
        onChange={() => store.getDetail()}
      />
      <hr color="#EBEDF0" />
      <ClueTag
        clueId={clueId}
        phase={phase}
        owners={owners}
        kdtId={kdtId}
        roleId={roleId}
        tags={tags}
        onAdd={() => store.getDetail()}
      />
      <section className="clue-detail__etc__tabs">
        <Tabs activeId={activeTab} onChange={id => setActiveTab(id)} type="card">
          <TabPanel tab="动态记录" id={1}>
            {activeTab === 1 && <ClueRecords clueId={clueId} phase={phase}
              owners={owners} onChange={() => store.getDetail()} timeStamp={timeStamp} />}
          </TabPanel>
          {/* 此处使用 ShowWrapper 组件或 <> </> 包裹两个 TabPanel 都会有 Bug，生成空 Tab */}
          {isEduShop &&
            <TabPanel tab="体验课报名" id={2}>
              {activeTab === 2 && <AppointmentList studentId={userId} mobile={telephone} name={name} />}
            </TabPanel>
          }
          {isEduShop &&
            <TabPanel tab="已购课程" id={3}>
              {activeTab === 3 && <SignedCourseList
                studentId={userId}
                studentName={name}
                studentMobile={telephone}
              />}
            </TabPanel>
          }
        </Tabs>
      </section>
    </article>
  );
};

export default DetailEtc;
