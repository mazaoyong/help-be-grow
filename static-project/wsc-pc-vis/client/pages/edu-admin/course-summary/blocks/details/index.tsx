import React from 'react';
import { get } from 'lodash';
import { Tabs, BlockLoading } from 'zent';
import { CardItem } from '@youzan/ebiz-components';
import { SUMMARY_DETAIL_TAB_CONFIG } from '../../domain/constants';
import { useSummaryDetailCommonModel, isReadyToDisplay } from '../../models/details/common';
import { iconfontAdaptor, useOverrideStyle, useUserScript } from '@hooks';

import type { PageRouterWrapper } from 'fns/router';

import './styles.scss';

const { TabPanel } = Tabs;
const overrideStyles = `
.app .app-inner {
  margin: 0 !important;
  background: transparent;
}`;
const userScriptParams = iconfontAdaptor(
  'summaryDetail',
  '//at.alicdn.com/t/font_1077682_hlji41e2vtg.js',
);

interface ICourseSummaryDetail {}
export const CourseSummaryDetail: React.FC<PageRouterWrapper<ICourseSummaryDetail>> = (props) => {
  const { params, location } = props;
  const { overviewType, targetId } = params;
  const [activeTab, setActiveTab] = React.useState('records');
  const summaryDetailCommonModel = useSummaryDetailCommonModel({
    /** 学员/资产信息类型，如果是学员信息，则展示较少的信息 */
    overviewType,
    studentId: targetId,
    assetNo: targetId,
    queryString: location.search,
  });

  const panelPropsFromParams = React.useMemo(() => {
    switch (overviewType) {
      case 'student':
        return { studentId: Number(targetId), pageType: overviewType };
      case 'course':
        return { assetNo: targetId, pageType: overviewType };
      default:
        break;
    }
  }, [overviewType, targetId]);

  const overviewData = React.useMemo(
    () => ({
      title: get(summaryDetailCommonModel, 'studentInfo.name', '-'),
      subtitle: get(summaryDetailCommonModel, 'studentInfo.mobile', '-'),
      ...summaryDetailCommonModel.assetInfo,
    }),
    [summaryDetailCommonModel],
  );

  useOverrideStyle({ uniqueId: 'course-summary-detail', overrideStyles });
  useUserScript({
    uniqueId: 'course-summary-detail',
    ...userScriptParams,
  });

  return (
    <div className="course-summary__detail">
      <BlockLoading className="overview" loading={summaryDetailCommonModel.loading}>
        {isReadyToDisplay(summaryDetailCommonModel) ? (
          <CardItem
            border={false}
            rowData={overviewData}
            colorSchema={{ secondaryColor: '#969799' }}
            {...summaryDetailCommonModel.overviewContentConfig}
          />
        ) : null}
      </BlockLoading>
      <Tabs activeId={activeTab} onChange={setActiveTab} className="tab__container">
        {SUMMARY_DETAIL_TAB_CONFIG.map((tabConfig) => (
          <TabPanel key={tabConfig.key} tab={tabConfig.title} id={tabConfig.key}>
            <tabConfig.Comp
              {...panelPropsFromParams}
              defaultFilter={summaryDetailCommonModel.dumpFilter}
              fallback={<BlockLoading loading />}
            />
          </TabPanel>
        ))}
      </Tabs>
    </div>
  );
};
