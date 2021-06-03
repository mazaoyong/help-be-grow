import React, { FC, useCallback } from 'react';
import { Tabs } from 'zent';
import VersionWrapper from 'fns/version';
import EduCourse from 'pages/edu-admin/educourse/ListPage';
import ListPage from 'pages/course/course-manage/ListPage';

const TabPanel = Tabs.TabPanel;

const TabWrapper: FC<{id: 'educourse' | 'course'}> = (props) => {
  const { id } = props;

  const onTabChange = useCallback<(id: string) => void>(() => {
    location.href = id === 'educourse' ? `${_global.url.v4}/vis/edu/course#/course-manage/list` : `${_global.url.v4}/vis/edu/page/educourse`;
  }, []);

  return <VersionWrapper name='course-manage-educoursetab'>
    <Tabs activeId={id} onChange={onTabChange}>
      <TabPanel tab="课程" id="educourse" >
        <EduCourse />
      </TabPanel>
      <TabPanel tab="线下课" id="course" >
        <ListPage />
      </TabPanel>
    </Tabs>
  </VersionWrapper>
  ;
};

export default TabWrapper;
