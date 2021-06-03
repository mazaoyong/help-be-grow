import React, { FC, useEffect, useMemo, useState } from 'react';
import { MenuCascader, IPublicCascaderItem, CascaderValue, Select } from 'zent';
import { findTagGroupPageAPI } from '../../api';

import './styles.scss';

interface ITagItem {
  name: string;
  tagId: number;
}

interface ITagGroupContent {
  groupId: number;
  name: string;
  tagDTOS: ITagItem[];
}

interface ITagGroupPageAPIRes {
  content: ITagGroupContent[];
}

interface ITagsFilterProps {
  value: Array<CascaderValue[]>;
  onChange: (data: Array<CascaderValue[]>) => void;
}

const TagsFilter: FC<ITagsFilterProps> = ({ value, onChange }) => {
  const [options, setOptions] = useState<IPublicCascaderItem[]>([]);

  const _value = useMemo(() => {
    return (value || []).map(v1 => v1.map(v2 => +v2 || 0));
  }, [value]);

  const _disabled = options.length === 0;

  useEffect(() => {
    findTagGroupPageAPI({
      pageNumber: 1,
      pageSize: 100,
    }).then(({ content = [] }: ITagGroupPageAPIRes) => {
      const options: IPublicCascaderItem[] = content
        .map(item => {
          if (item.tagDTOS && item.tagDTOS.length > 0) {
            return {
              value: item.groupId,
              label: item.name,
              children: item.tagDTOS.map(tag => ({
                value: tag.tagId,
                label: tag.name,
              })),
            } as any;
          }
        })
        .filter(Boolean);
      setOptions(options);
    });
  }, []);

  return _disabled ? (
    <Select options={[]} placeholder="暂无数据" width={200} popupWidth={200} disabled />
  ) : (
    <MenuCascader
      value={_value}
      options={options}
      onChange={onChange}
      placeholder="请选择"
      className="clue-pool-tags-filter"
      popupClassName="clue-pool-tags-pop"
      expandTrigger="hover"
      multiple
    />
  );
};

export default TagsFilter;
