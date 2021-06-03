import React from 'react';
import { hot } from 'react-hot-loader';
import { BlockLoading } from 'zent';
import { useDidMount } from '../../utils/hooks';
import DetailPanel from './components/detail-panel';
import DetailEtc from './components/detail-etc';
import store from './store';
import './style.scss';

const DetailPage = ({ params }) => {
  const { globalLoading } = store.useStoreState();

  useDidMount(() => {
    const { clueId } = params;
    store.getDetail(clueId);
  });

  return (
    <BlockLoading loading={globalLoading}>
      <main className="clue-detail">
        <DetailPanel />
        <DetailEtc />
      </main>
    </BlockLoading>
  );
};

export default hot(module)(DetailPage);
