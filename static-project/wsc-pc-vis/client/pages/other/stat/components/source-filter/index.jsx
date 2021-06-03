import { Cascader, Select } from '@zent/compat';
import React, { PureComponent } from 'react';

import { findSourceGroupPageAPI } from '../../api';

import './styles.scss';

class SourceFilter extends PureComponent {
  state = {
    options: [],
  };

  componentDidMount() {
    const params = {
      pageRequest: {
        pageNumber: 1,
        pageSize: 100,
      },
      query: {
        needSystemDefault: true,
      },
    };
    findSourceGroupPageAPI(params).then(({ content = [] }) => {
      const options = [{
        id: 0,
        title: '全部来源',
        isLeaf: true,
      }].concat(content.map(item => {
        if (item.sourceDTOS && item.sourceDTOS.length > 0) {
          return {
            id: item.groupId,
            title: item.name,
            children: [{
              id: 0,
              title: '全部',
            }].concat(item.sourceDTOS.map(source => ({
              id: source.sourceId,
              title: source.name,
            }))),
          };
        }
        return null;
      }).filter(item => item));
      this.setState({ options });
    });
  }

  render() {
    const disabled = this.state.options.length === 0;
    if (disabled) {
      return <Select emptyText="暂无数据" />;
    }

    const value = (this.props.value || []).map(id => (Number(id) || 0));
    return (
      <Cascader
        value={value}
        options={this.state.options}
        onChange={this.handleChange}
        loadMore={this.state.loadMore}
        placeholder="请选择"
        className="clue-pool-source-filter"
        popClassName="clue-pool-source-filter-popup"
        type="menu"
      />
    );
  }

  handleChange = data => {
    this.props.onChange({ value: data.map(item => item.id) });
  }
}

export default SourceFilter;
