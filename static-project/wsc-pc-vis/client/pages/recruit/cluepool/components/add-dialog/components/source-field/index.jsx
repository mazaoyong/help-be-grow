
import { Form } from '@zent/compat';

import { MenuCascader as Cascader, Select } from 'zent';
import React, { PureComponent } from 'react';

import './styles.scss';
import { findSourceGroupPageAPI } from '../../../../api';
import SamWrapper from '../../../sam-wrapper';

const { getControlGroup } = Form;

class SourceField extends PureComponent {
  state = {
    options: [],
  };

  componentDidMount() {
    this.refreshData();
  }

  refreshData = () => {
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
      const options = content.map(item => {
        if (item.sourceDTOS && item.sourceDTOS.length > 0) {
          return {
            value: item.groupId,
            label: item.name,
            children: item.sourceDTOS.map(source => ({
              value: source.sourceId,
              label: source.value,
            })),
          };
        }
        return null;
      }).filter(item => item);
      this.setState({ options });
    });
  };

  renderWrapper(children) {
    return (
      <div className="clue-pool-source-filter-wrap">
        {children}
        <SamWrapper name="编辑来源">
          <div className="clue-pool-source-filter-link-group">
            <a onClick={this.refreshData}>刷新</a>
            <a href="/v4/vis/edu/page/clue/source" target="_blank" rel="noopener noreferrer">添加来源</a>
          </div>
        </SamWrapper>
      </div>
    );
  }

  render() {
    const disabled = this.state.options.length === 0;
    if (disabled) {
      return this.renderWrapper(<Select emptyText="暂无数据" />);
    }
    return this.renderWrapper(
      <Cascader
        value={this.props.value}
        options={this.state.options}
        onChange={this.handleChange}
        placeholder="请选择"
        className="clue-pool-source-filter"
        popClassName="clue-pool-source-filter-popup"
        type="menu"
      />
    );
  }

  handleChange = value => {
    this.props.onChange({ value });
  }
}

export default getControlGroup(SourceField);
