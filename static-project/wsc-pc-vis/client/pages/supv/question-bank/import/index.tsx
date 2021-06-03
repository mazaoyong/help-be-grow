import React, { FC, useState, useCallback, useRef } from 'react';
import { withRouter, WithRouterProps, hashHistory } from 'react-router';
import { IListContext } from '@youzan/ebiz-components/es/types/easy-list';
import { Tabs } from 'zent';
import get from 'lodash/get';

import QuestionBatchImport from './components/batch-import';
import QuestionImportList from './components/list';

const { TabPanel } = Tabs;

const QuestionBankImport: FC<WithRouterProps> = props => {
  const [activeId, setActiveId] = useState<number>(get(props, 'route.path') === 'import/list' ? 2 : 1);

  const listRef = useRef<IListContext | null>(null);

  const onTabChange = useCallback((id: number) => {
    setActiveId(id);
    hashHistory.replace(id === 1 ? '/import' : '/import/list');
  }, []);

  return (
    <div className="question-bank__import">
      <Tabs activeId={activeId} onChange={onTabChange}>
        <TabPanel tab="批量导入" id={1}>
          <QuestionBatchImport handleTabChange={onTabChange} onNextStep={
            listRef &&
            listRef.current &&
            listRef.current.action.refresh}
          />
        </TabPanel>
        <TabPanel tab="导入记录" id={2}>
          <QuestionImportList ref={listRef} />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default withRouter(QuestionBankImport);
