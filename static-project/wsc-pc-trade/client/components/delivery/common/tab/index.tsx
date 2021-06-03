import * as React from 'react';
import { isRetailChainStore, isRetailSingleStore, isPureWscSingleStore } from '@youzan/utils-shop';
import { Tabs } from 'zent';
import { getSameCityCap, getExpressCap } from './api';
import './styles.scss';

interface ITabConfig {
  title: string;
  key: string;
}

// 零售单店tab顺序与微商城单店tab顺序不同
const TAB_CONFIG = isRetailSingleStore
  ? [
      {
        title: '同城配送',
        key: '/local-delivery',
      },
      {
        title: '上门自提',
        key: '/self-fetch',
      },
      {
        title: '快递发货',
        key: '/express',
      },
    ]
  : [
      {
        title: '快递发货',
        key: '/express',
      },
      {
        title: '同城配送',
        key: '/local-delivery',
      },
      {
        title: '上门自提',
        key: '/self-fetch',
      },
    ];

/** 零售连锁体系不能使用后两个标签 */
if (isRetailChainStore) {
  TAB_CONFIG.splice(1, 2);
}

const PREFIX_URL = '/v4/trade';

const { useState, useEffect } = React;

const DeliveryTab: React.FC = props => {
  const [activeTab, setActiveTab] = useState('');
  const [tabConfig, setTabConfig] = useState<ITabConfig[]>([]);

  useEffect(() => {
    const formatConfig = TAB_CONFIG;
    // eslint-disable-next-line
    if (isPureWscSingleStore) {
      getSameCityCap()
        .then(val => {
          // 没有开启同城能力则关闭同城配送服务
          if (!val) {
            formatConfig.splice(1, 1);
            setTabConfig(formatConfig);
          }
        })
        .finally(() => {
          setTabConfig(formatConfig);
          const selectedTab =
            formatConfig.filter(tab => window.location.pathname.indexOf(tab.key) !== -1)[0] ||
            formatConfig[0];
          const activeKey = selectedTab.key;
          setActiveTab(activeKey);
        });
    } else if (isRetailSingleStore) {
      getExpressCap()
        .then(val => {
          // 没有开启快递能力则关闭快递服务
          if (!val) {
            formatConfig.splice(2, 1);
            setTabConfig(formatConfig);
          }
        })
        .finally(() => {
          setTabConfig(formatConfig);
          const selectedTab =
            formatConfig.filter(tab => window.location.pathname.indexOf(tab.key) !== -1)[0] ||
            formatConfig[0];
          const activeKey = selectedTab.key;
          setActiveTab(activeKey);
        });
    } else {
      setTabConfig(formatConfig);
      const selectedTab =
        formatConfig.filter(tab => window.location.pathname.indexOf(tab.key) !== -1)[0] ||
        formatConfig[0];
      const activeKey = selectedTab.key;
      setActiveTab(activeKey);
    }
  }, []);

  /** 零售连锁体系不显示 Tab 切换 */
  if (isRetailChainStore) {
    return <>{props.children}</>;
  }

  const handleTabChange = activeKey => {
    window.location.href = PREFIX_URL + activeKey;
  };

  return (
    <>
      <Tabs
        className="delivery-tab"
        activeId={activeTab}
        onChange={handleTabChange}
        tabs={tabConfig}
      />
      {props.children}
    </>
  );
};

export default DeliveryTab;
