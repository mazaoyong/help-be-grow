import * as React from 'react';
import { Tabs } from 'zent';
import indexOf from 'lodash/indexOf';
import './style.scss';

import { IDetailTabProps } from './types';

import TabCourse from './TabCourse';
import TabAvailable from './TabAvailable';
import TabClass from './TabClass';

const TabPanel = Tabs.TabPanel;

const DetailTab: React.FC<IDetailTabProps> = (props) => {
  const { studentId, assetNo, kdtId, blockShowStatus } = props;
  const firstActiveId = indexOf([
    blockShowStatus.hasAssetValue,
    blockShowStatus.hasAssetValidity,
    blockShowStatus.hasAssetClass,
  ], true);

  const [activeId, setActiveId] = React.useState<number>(firstActiveId);

  React.useEffect(() => {
    setActiveId(firstActiveId);
  }, [firstActiveId, setActiveId]);

  const panels = [
    {
      el: (
        <TabPanel key="0" tab="课时变更明细" id={0}>
          <TabCourse
            studentId={studentId}
            assetNo={assetNo}
            kdtId={kdtId}
          />
        </TabPanel>
      ),
      show: blockShowStatus.hasAssetValue,
    },
    {
      el: (
        <TabPanel key="1" tab="有效期变更明细" id={1}>
          <TabAvailable
            studentId={studentId}
            assetNo={assetNo}
            kdtId={kdtId}
          />
        </TabPanel>
      ),
      show: blockShowStatus.hasAssetValidity
    },
    {
      el: (
        <TabPanel key="2" tab="班级变更明细" id={2}>
          <TabClass
            studentId={studentId}
            assetNo={assetNo}
            kdtId={kdtId}
          />
        </TabPanel>
      ),
      show: blockShowStatus.hasAssetClass
    }
  ];

  return (
    <div className="data-block">
      <Tabs
        activeId={activeId}
        onChange={setActiveId}
        type="card"
      >
        { panels.filter(o => o.show).map(o => o.el) }
      </Tabs>
    </div>
  );
};

export default DetailTab;
