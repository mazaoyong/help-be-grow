import React from 'react';
import { Tabs } from 'zent';

import './style/index.scss';

const DecorateTabs = props => {
  return <Tabs stretch {...props} className="decorate-tabs" />;
};

DecorateTabs.TabPanel = Tabs.TabPanel;

export default DecorateTabs;
