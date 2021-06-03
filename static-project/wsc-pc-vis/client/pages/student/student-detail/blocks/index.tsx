import React, { FC, useState, useCallback, useMemo } from 'react';
import { Tabs } from 'zent';

import { ClueRecords, IClueRecordsProps } from '@ability-center/clue';
import { SignedCourseList, AppointmentList } from '@ability-center/assets';

import ClassSchedule from './class-schedule';
import StudyRecords from './study-records';
import CommentRecords from './comment-records';
import { ITabsContainerProps, ActionEnums } from '../types';

const { TabPanel } = Tabs;

enum TabPanelIDList {
  SIGNED_COURSE = 0, // signed course
  TRIAL_COURSE, // trail course
  CLASS_SCHEDULE, // class schedule
  STUDY_RECORDS, // study records
  COMMENT_RECORDS, // comment records
  CLUE_MODIFY_RECORDS, // clue modify record
}

const TabsContainer: FC<ITabsContainerProps> = (props) => {
  const {
    campusKdtId,
    campusName,
    studentName,
    studentPhone,
    updatingSignal,
    clueInfo,
    studentId,
    onActionCallback,
    ...baseCompProps
  } = props;
  const [activeId, setActiveId] = useState<TabPanelIDList>(TabPanelIDList.SIGNED_COURSE);

  const handleActiveId = useCallback((activeId: TabPanelIDList) => setActiveId(activeId), []);
  const handleModifyRecords = useCallback(() => onActionCallback(ActionEnums.MODIFY_CLUE_RECORDS), [
    onActionCallback,
  ]);

  // 防止接口出错，如果没有clueId就设置为0禁止获取数据
  const clueUpdateSignal = useMemo(
    () =>
      ((clueInfo as unknown) as IClueRecordsProps).clueId !== undefined
        ? updatingSignal.clueModifyRecords
        : 0,
    [clueInfo, updatingSignal.clueModifyRecords],
  );

  return (
    <Tabs {...baseCompProps} activeId={activeId} onChange={handleActiveId} unmountPanelOnHide>
      <TabPanel tab="已购正式课" id={TabPanelIDList.SIGNED_COURSE}>
        <SignedCourseList
          key={campusKdtId || 'signedCourse'}
          campusKdtId={campusKdtId}
          studentId={studentId}
          studentName={studentName}
          studentMobile={studentPhone}
        />
      </TabPanel>
      <TabPanel tab="体验课试听" id={TabPanelIDList.TRIAL_COURSE}>
        <AppointmentList
          key={campusKdtId || 'appointment'}
          campusKdtId={campusKdtId}
          studentId={studentId}
        />
      </TabPanel>
      <TabPanel tab="课表" id={TabPanelIDList.CLASS_SCHEDULE}>
        <ClassSchedule
          key={campusKdtId || 'courseSchedule'}
          campusKdtId={campusKdtId}
          studentId={studentId}
          updatingSignal={updatingSignal.classSchedule || 0}
        />
      </TabPanel>
      <TabPanel tab="学习记录" id={TabPanelIDList.STUDY_RECORDS}>
        <StudyRecords
          key={campusKdtId || 'studyRecords'}
          campusKdtId={campusKdtId}
          studentId={studentId}
          updatingSignal={updatingSignal.studyRecords || 0}
        />
      </TabPanel>
      <TabPanel tab="点评记录" id={TabPanelIDList.COMMENT_RECORDS}>
        <CommentRecords
          key={campusKdtId || 'commentRecords'}
          queryData={{
            kdtId: campusKdtId || _global.kdtId,
            shopName: campusName || '',
            userId: studentId,
            // 有歧义，username结果用studentName
            userName: studentName,
          }}
          type={0}
          updatingSignal={updatingSignal.commentRecords || 0}
        />
      </TabPanel>
      <TabPanel tab="动态记录" id={TabPanelIDList.CLUE_MODIFY_RECORDS}>
        <ClueRecords
          {...((clueInfo as unknown) as IClueRecordsProps)}
          timeStamp={clueUpdateSignal || 0}
          needCheckAccess={false}
          onChange={handleModifyRecords}
        />
      </TabPanel>
    </Tabs>
  );
};

export default TabsContainer;
