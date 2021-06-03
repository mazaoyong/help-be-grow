import { Cascader, Select } from '@zent/compat';
import React, { useState, useEffect } from 'react';
import { isInStoreCondition } from 'fns/chain';

import { findSourceGroupPageAPI, findListAllCampusAPI } from '../../../../api';

import './styles.scss';

const isChainMaster = isInStoreCondition({ supportHqStore: true });

interface ISourceSelectProps {
  value?: number[];
  onChange?: ({ value }: { value: number[] }) => void;
  updateFlag?: number;
}

function SourceSelect(props: ISourceSelectProps) {
  const { value, onChange, updateFlag } = props;
  const [options, setOptions] = useState<any[]>([]);
  useEffect(() => {
    if (isChainMaster) {
      findListAllCampusAPI().then(data => {
        const _options = [
          {
            id: window._global.kdtId,
            title: '总部',
            isLeaf: false,
          },
        ].concat(
          data.map(item => ({
            id: item.kdtId,
            title: item.shopName,
            isLeaf: false,
          })),
        );
        setOptions(_options);
      });
    } else {
      const params = {
        pageRequest: {
          pageNumber: 1,
          pageSize: 100,
        },
        query: {
          needSystemDefault: false,
        },
      };
      findSourceGroupPageAPI(params).then(({ content = [] }) => {
        const _options = content
          .map(item => {
            if (item.sourceDTOS && item.sourceDTOS.length > 0) {
              return {
                id: item.groupId,
                title: item.name,
                children: item.sourceDTOS.map(source => ({
                  id: source.sourceId,
                  title: source.name,
                })),
              };
            }
            return null;
          })
          .filter(item => item);
        setOptions(_options);
      });
    }
  }, [updateFlag]);
  const loadMore = root => {
    const params = {
      pageRequest: {
        pageNumber: 1,
        pageSize: 100,
      },
      query: {
        kdtId: root.id,
        needSystemDefault: false,
      },
    };

    return findSourceGroupPageAPI(params).then(({ content = [] }) => {
      return content
        .map(item => {
          if (item.sourceDTOS && item.sourceDTOS.length > 0) {
            return {
              id: item.groupId,
              title: item.name,
              children: item.sourceDTOS.map(source => ({
                id: source.sourceId,
                title: source.name,
                isLeaf: true,
              })),
            };
          }
          return null;
        })
        .filter(item => item);
    });
  };
  const handleChange = data => {
    onChange && onChange({ value: data.map(item => item.id) });
  };
  const disabled = options.length === 0;
  if (disabled) {
    return <Select emptyText="暂无数据" data={[]}/>;
  }

  const _value = (value || []).map(id => Number(id) || 0);
  return (
    <Cascader
      value={_value}
      options={options}
      onChange={handleChange}
      loadMore={loadMore}
      placeholder="请选择"
      className="clue-pool-source-filter"
      popClassName="clue-pool-source-filter-popup"
      type="menu"
    />
  );
}

export default SourceSelect;
