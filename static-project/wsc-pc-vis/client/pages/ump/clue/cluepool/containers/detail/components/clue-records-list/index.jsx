import { Select } from '@zent/compat';
import React, { useEffect, useState, useRef } from 'react';
import { Pagination, BlockLoading, Notify } from 'zent';
import ClueReadordsItem from './Item';
import getCurClueId from '../../utils/get-cur-clueid';

import store from '../../store';
import { RecordTypeOptions } from '../../config';
import { findPageClueRecordsAPI } from '../../../../api';
import './style.scss';

/**
 * @type React.FC<{}>
 *
 * @return {React.ReactElement}
 */
const ClueRecordsList = () => {
  const clueId = getCurClueId();
  const { timeStamp } = store.useStoreState();

  const [loading, setLoading] = useState(false);
  const [recordType, setRecordType] = useState(0);
  const [content, setContent] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const preTimeStamp = useRef(0);

  useEffect(
    () => {
      if (!timeStamp) {
        return;
      }

      // 第一次请求
      if (preTimeStamp.current === 0) {
        preTimeStamp.current = timeStamp;
      }
      // 时间戳变化的话重置 page 来请求第一页
      if (timeStamp !== preTimeStamp.current && page !== 1) {
        preTimeStamp.current = timeStamp;
        setPage(1);
        return;
      }

      setLoading(true);

      const recordQuery = {
        clueId,
        recordType: recordType,
      };

      const pageRequest = {
        pageNumber: page,
        pageSize: 5,
        sort: {
          orders: [{
            direction: 'DESC',
            property: 'updated_at',
          }],
        },
      };

      findPageClueRecordsAPI({ recordQuery, pageRequest })
        .then((res = {}) => {
          const { content, total } = res;
          setContent(content);
          setTotal(total);
        }).catch(msg => {
          Notify.error(msg || '获取跟进记录失败');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [clueId, page, recordType, timeStamp],
  );

  const handleRecordTypeChange = (evt) => {
    setRecordType(evt.target.value);
    setPage(1);
    setTotal(0);
  };

  return (
    <article className="clue-reacords__list">
      <div>
        <Select
          data={RecordTypeOptions}
          value={recordType}
          optionText="text"
          optionValue="recordType"
          width="184px"
          onChange={handleRecordTypeChange}
        />
        <BlockLoading loading={loading}>
          <ul className="clue-reacords__list__item__wrap">
            {content.map(item => (
              <li className="clue-reacords__list__item" key={item.id}>
                <ClueReadordsItem data={item} />
              </li>
            ))}
            {content.length === 0 && (
              <p className="clue-reacords__list__empty">
                暂无数据
              </p>
            )}
          </ul>
        </BlockLoading>
        <Pagination
          className="clue-reacords__list__pagination"
          current={page}
          totalItem={total}
          pageSize={5}
          onChange={({ current }) => { setPage(current); }}
        />
      </div>
    </article>
  );
};

export default ClueRecordsList;
