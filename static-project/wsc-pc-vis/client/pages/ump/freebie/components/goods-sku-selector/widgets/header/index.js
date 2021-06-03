import { Select } from '@zent/compat';
import React from 'react';
import { Button, Input } from 'zent';
import { isEduSingleStore, isRetailSingleStore } from '@youzan/utils-shop';

const onlineChannels = [
  {
    value: -1,
    text: '全部分组',
  },
  {
    value: 10,
    text: '线下课',
    hidden: !(isEduSingleStore || isRetailSingleStore),
  },
  {
    value: 1,
    text: '专栏',
  },
  {
    value: 2,
    text: '内容',
  },
  {
    value: 4,
    text: '直播',
  },
].filter(item => !item.hidden);

export default function Header(props) {
  const { value, url, onSearch, onChange } = props;

  return (
    <div className="rc-goods-sku-selector__header">
      <div>
        <Button href={url} target="_blank">
          商品管理
        </Button>
        <Button onClick={onSearch}>刷新</Button>
      </div>
      <div className="rc-goods-sku-selector__header-seach">
        <Select
          className="rc-goods-sku-selector__header-select"
          placeholder="全部分组"
          data={onlineChannels}
          value={value.subType}
          onChange={e => {
            const _value = e.target.value;
            onChange('subType', _value === -1 ? null : _value, true);
          }}
        />
        <Input
          icon="search"
          width={175}
          value={value.search}
          placeholder="搜索商品名称或编码"
          onChange={e => {
            onChange('search', e.target.value.trim(), e.fromClearButton);
          }}
          onPressEnter={onSearch}
        />
      </div>
    </div>
  );
}
