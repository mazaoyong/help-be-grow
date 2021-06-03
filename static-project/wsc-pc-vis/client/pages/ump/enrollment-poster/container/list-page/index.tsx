import React, { useState, useCallback, useEffect } from 'react';
import { hashHistory } from 'react-router';
import { hot } from 'react-hot-loader';
import { Button as SamButton } from '@youzan/sam-components';
import SearchInput from 'components/search-input';
import { visitTracker, clickTracker, EventTypeEnum } from 'components/logger';
import PosterList from '../../components/PosterList';
import { Provider } from '../../store';
import { appName, ENROLLMENT_POSTER_LIST } from '../../contants';

function ListPage() {
  const [keyword, setKeyword] = useState<string>('');
  const [searchTitle, setSearchTitle] = useState<string>('');
  const handleSearchChange = useCallback(e => {
    setKeyword(e.target.value);
  }, []);
  const handleSearch = useCallback(() => {
    setSearchTitle(keyword);
  }, [keyword]);
  const handleAddPoster = useCallback(() => {
    clickTracker({
      eventName: '新建海报',
      eventSign: 'add_poster',
      pageType: ENROLLMENT_POSTER_LIST,
      otherParams: {
        eventType: EventTypeEnum.ADD,
      },
    });
    hashHistory.push('/create');
  }, []);

  useEffect(() => {
    visitTracker({ pageType: ENROLLMENT_POSTER_LIST, eventName: '浏览招生海报列表' });
  }, []);

  return (
    <Provider>
      <div className="enrollment-poster-list">
        <div className="market-wrapper">
          {appName}
        </div>
        <div className="list-filter clearfix">
          <SamButton name="编辑" type="primary" onClick={handleAddPoster}>
            新建海报
          </SamButton>
          <div className="filter-right">
            <SearchInput
              value={keyword}
              placeholder="搜索海报名称"
              onChange={handleSearchChange}
              onPressEnter={handleSearch}
            />
          </div>
          <PosterList title={searchTitle} />
        </div>
      </div>
    </Provider>
  );
}

export default hot(module)(ListPage);
