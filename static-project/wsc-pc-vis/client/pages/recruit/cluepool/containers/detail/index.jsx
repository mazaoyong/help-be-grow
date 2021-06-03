import React from 'react';
import { hot } from 'react-hot-loader';
import { BlockLoading } from 'zent';
import { useDidMount, useWillUnmount } from '../../utils/hooks';
import DetailPanel from './components/detail-panel';
import DetailEtc from './components/detail-etc';
import UpgradeTip from './components/upgrade-tip';
import store, { INIT_PAGE_TITLE } from './store';
import './style.scss';

const DetailPage = ({ params }) => {
  const { globalLoading } = store.useStoreState();

  useDidMount(() => {
    const { clueId } = params;
    /** 清空 state 避免数据异常 */
    store.resetState();
    store.getDetail(clueId);
  });

  useWillUnmount(() => {
    /** 离开页面要恢复 Title */
    document.title = INIT_PAGE_TITLE;
  });

  return (
    <BlockLoading loading={globalLoading}>
      <UpgradeTip />
      <main className="clue-detail">
        <DetailPanel />
        <DetailEtc />
      </main>
    </BlockLoading>
  );
};

export default hot(module)(DetailPage);
