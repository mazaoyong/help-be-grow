import React, { FC } from 'react';
import { InfiniteScroller, BlockLoading } from 'zent';

import style from './export-list.m.scss';
import { Empty } from './empty';

interface IProps {
  children: React.ReactNode;
  /** 报表标题 */
  title?: string;
  /** 列表是否为空 */
  isEmpty?: boolean;
  /** 是否正在加载（显示在列表尾部） */
  isLoading?: boolean;
  /** 底部scroll回调，用于获取更多数据 */
  onScroll?: () => unknown;
  /** 是否还有更多数据（用于屏蔽onScroll回调） */
  hasMore?: boolean;
}

export const ExportList: FC<IProps> = props => {
  const hasMore = props.hasMore && !props.isLoading;
  const loadMore = () => {
    props.onScroll && props.onScroll();
    return Promise.resolve();
  };
  if (props.isEmpty && !props.isLoading) {
    return <Empty />;
  }
  return (
    <div className={style.wrapper}>
      <InfiniteScroller
        loadMore={loadMore}
        skipLoadOnMount={true}
        hasMore={hasMore}
        loader={null}
        useWindow
      >
        {props.title ? <h1 className={style.title}>{props.title}</h1> : null}
        {props.children}
        <BlockLoading loading={props.isLoading} />
      </InfiniteScroller>
    </div>
  );
};
