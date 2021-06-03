import React, { useCallback } from 'react';
import { Tabs } from 'zent';
import { withRouter } from 'react-router';

const tabs = [
  { title: '所有促销', key: '3' },
  { title: '未开始', key: '2' },
  { title: '进行中', key: '1' },
  { title: '已结束', key: '0' },
];

function RouterTabs(props) {
  const { params, router } = props;
  const handleChange = useCallback(id => {
    router.replace(`/list/${id}`);
  }, [router]);
  return (
    <Tabs
      type="card"
      tabs={tabs}
      activeId={params.type}
      onChange={handleChange}
    />
  );
}

export default withRouter(RouterTabs);
