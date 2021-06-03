import React from 'react';
import { hashHistory } from 'react-router';
import { Link as SamLink } from '@youzan/sam-components';

interface IPosterListEmpty {
  title: string;
}

function PosterListEmpty(props: IPosterListEmpty) {
  const { title } = props;
  return (
    <div className="empty-list">
      <div className="empty-list-image">
        <img src="https://img.yzcdn.cn/public_files/a1795e31787cadcacbc3fdf5b6f8c0ac.png" />
      </div>
      <div className="empty-list-info">
        {title ? (
          <>没有更多数据了</>
        ) : (
          <>
            暂无数据，
            <SamLink name="编辑" onClick={() => hashHistory.push('/create')} href="javascript:;">
              去新建
            </SamLink>
          </>
        )}
      </div>
    </div>
  );
}
export default PosterListEmpty;
