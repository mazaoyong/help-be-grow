import { Select } from '@zent/compat';
import React, { PureComponent } from 'react';
import { MultiCascader } from '@youzan/react-components';
import './styles.scss';
import { findTagGroupPageAPI } from '../../api';

export default class TagsFilter extends PureComponent {
  state = {
    options: [],
  };

  componentDidMount() {
    const pageRequest = {
      pageNumber: 1,
      pageSize: 100,
    };
    findTagGroupPageAPI(pageRequest).then(({ content = [] }) => {
      const options = content.map(item => {
        if (item.tagDTOS && item.tagDTOS.length > 0) {
          return {
            id: item.groupId,
            title: item.name,
            children: item.tagDTOS.map(tag => ({
              id: tag.tagId,
              title: tag.name,
            })),
          };
        }
        return null;
      }).filter(item => item);
      this.setState({ options });
    });
  }

  onChange = data => {
    this.props.onChange({
      value: data.map(items => items.map(item => item.id)),
    });
  };

  render() {
    const disabled = this.state.options.length === 0;
    if (disabled) {
      return <Select emptyText="暂无数据" />;
    }

    const value = (this.props.value || []).map(item => item.map(id => (Number(id) || 0)));
    return (
      <MultiCascader
        className="clue-pool-tags-filter"
        popClassName="clue-pool-tags-pop"
        tagClassName="clue-pool-tags-item"
        value={value}
        options={this.state.options}
        onChange={this.onChange}
        loadMore={this.loadMore}
      />
    );
  }
}
