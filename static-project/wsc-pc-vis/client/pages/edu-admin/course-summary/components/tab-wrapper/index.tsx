import React from 'react';
import { Tabs } from 'zent';
import { SUMMARY_LIST_TAB_CONFIG } from 'pages/edu-admin/course-summary/domain/constants';

import type { PageRouterWrapper } from 'fns/router';
import './styles.scss';

interface ITabWrapperProps {}
export const TabWrapper: React.FC<PageRouterWrapper<ITabWrapperProps>> = (props) => {
  const { children, route, router } = props;
  const [activeId, setActiveId] = React.useState<string>(route.path || 'student');

  const handleRouterChange = React.useCallback(
    (newTab: string) => {
      router.push(newTab);
      setActiveId(newTab);
    },
    [router],
  );
  return (
    <div className="course-summary__container">
      <div className="tabs-container">
        <Tabs activeId={activeId} tabs={SUMMARY_LIST_TAB_CONFIG} onChange={handleRouterChange} />
      </div>
      <div className="content-container">{children}</div>
    </div>
  );
};
