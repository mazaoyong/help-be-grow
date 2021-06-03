import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import { EasyList } from '@youzan/ebiz-components';
import get from 'lodash/get';
import { IListFilterProps } from './types';

const { Filter } = EasyList;

// TODO: FC化
class ListFilterForm extends Component<IListFilterProps> {
  submit = (val?: any) => {
    const { onSearch } = this.props;
    if (onSearch) {
      onSearch(val);
      this.pushQuery(val);
    }
  };

  // TODO: EasyList接管URL
  pushQuery(val) {
    const location = hashHistory.getCurrentLocation();
    const query = location.query;
    const curLearnStatus = get(val, 'learnStatus');
    const queryLearnStatus = get(query, 'learnStatus');
    if (curLearnStatus && curLearnStatus !== queryLearnStatus) {
      location.query = { ...location.query, learnStatus: curLearnStatus };
    }
    hashHistory.replace(location);
  }

  // TODO: EasyList接管初始化的value
  render() {
    const { config } = this.props;
    return (
      <div className="student-list-filter">
        <Filter
          config={config}
          onSubmit={this.submit}
          onReset={this.submit}
        />
      </div>
    );
  }
}

export default ListFilterForm;
