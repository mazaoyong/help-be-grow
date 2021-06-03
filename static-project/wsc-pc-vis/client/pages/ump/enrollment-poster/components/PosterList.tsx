import React, { useEffect, useState, useCallback } from 'react';
import { Pagination, Notify, BlockLoading } from 'zent';
import PosterItem from './PosterItem';
import PosterTemplateList from './PosterTemplateList';
import PosterListEmpty from './PosterListEmpty';
import Promotion from './Promotion';
import { getList, IGetListParams } from '../api';
import { IPosterItemData } from '../types';
import { useStore } from '../store';

interface IPosterListProps {
  title: string;
}

function PosterList(props: IPosterListProps) {
  const [data] = useStore();
  const { refreshFlag } = data;
  const { title } = props;
  const [list, setList] = useState<IPosterItemData[]>([]);
  const [current, setCurrent] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    const params: IGetListParams = { pageSize: 20, pageNumber: current };
    if (title) {
      params.query = {
        title,
      };
    }
    setLoading(true);
    getList(params)
      .then(data => {
        setList(data.content);
        setTotal(data.total);
        setIsLoaded(true);
      })
      .catch(e => {
        Notify.error(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [current, title, refreshFlag]);

  const onPageChange = useCallback(({ current }) => {
    setCurrent(current);
  }, []);

  return (
    <div className="poster-list">
      <BlockLoading loading={loading}>
        {/* 没有创建过海报并且没有搜索关键词显示默认模板示例 */}
        {isLoaded && list.length === 0 && !title ? (
          <div className="poster-list-content">
            <PosterTemplateList />
          </div>
        ) : list.length > 0 ? (
          <>
            <div className="poster-list-content">
              {list.map(item => (
                <PosterItem key={item.id} data={item} />
              ))}
            </div>
            <Pagination current={current} total={total} onChange={onPageChange} pageSize={20} />
            <Promotion />
          </>
        ) : (
          <PosterListEmpty title={title} />
        )}
      </BlockLoading>
    </div>
  );
}

export default PosterList;
