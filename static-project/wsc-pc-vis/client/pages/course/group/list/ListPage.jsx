import React, { useState } from 'react';
import { Button as SamButton } from '@youzan/sam-components';
import SearchInput from 'components/search-input/index';
import Table from './Table';
import { isInStoreCondition } from 'fns/chain';
import { Notify } from 'zent';
import { getCourseGroupList } from '../api';
import { MAX_GROUP_COUNT } from './constants';

export default function ListPage() {
  const [searchValue, setSearchValue] = useState('');
  const [searchFlag, setSearchFlag] = useState(null);

  const handleSearch = () => {
    setSearchFlag({});
  };

  const isBranch = isInStoreCondition({ supportBranchStore: true });
  return (
    <div className="page-course-group-list">
      <div className="page-course-group-list__header clearfix">
        {!isBranch && (
          <SamButton
            type="primary"
            onClick={() => {
              getCourseGroupList({
                type: 1,
              }).then(res => {
                if (res.total >= MAX_GROUP_COUNT) {
                  Notify.error(`最多添加${MAX_GROUP_COUNT}个课程分组`);
                } else {
                  window.open('/v4/vis/course/group/add');
                }
              });
            }}
          >
            新建课程分组
          </SamButton>
        )}
        <SearchInput
          className="page-course-group-list__search"
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          onPressEnter={handleSearch}
          placeholder="搜索"
        />
      </div>
      <Table searchValue={searchValue} searchFlag={searchFlag} />
    </div>
  );
}
