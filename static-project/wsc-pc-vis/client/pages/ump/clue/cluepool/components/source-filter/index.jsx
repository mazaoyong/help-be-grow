import { Cascader, Select } from '@zent/compat';
import React, { PureComponent } from 'react';
import { isInStoreCondition } from 'fns/chain';

import { findSourceGroupPageAPI, findListAllCampusAPI } from '../../api';

import './styles.scss';

const isChainMaster = isInStoreCondition({ supportHqStore: true });

class SourceFilter extends PureComponent {
  state = {
    options: [],
  };

  componentDidMount() {
    if (isChainMaster) {
      findListAllCampusAPI().then(data => {
        const options = [{
          id: '',
          title: '全部来源',
          isLeaf: true,
        },
        {
          id: window._global.kdtId,
          title: '总部',
          isLeaf: false,
        }].concat(data.map(item => ({
          id: item.kdtId,
          title: item.shopName,
          isLeaf: false,
        })));

        const loadMore = (root, stage) => {
          const params = {
            pageRequest: {
              pageNumber: 1,
              pageSize: 100,
            },
            query: {
              kdtId: root.id,
              needSystemDefault: true,
            },
          };

          return findSourceGroupPageAPI(params).then(({ content = [] }) => {
            return content.map(item => {
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
            }).filter(item => item);
          });
        };

        this.setState({ options, loadMore });
      });
    } else {
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
          id: '',
          title: '全部来源',
          isLeaf: true,
        }].concat(content.map(item => {
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
        }).filter(item => item));
        this.setState({ options });
      });
    }
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
