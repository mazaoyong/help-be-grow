import React, { Component } from 'react';
import { Icon, Button } from 'zent';

import SearchInput from 'components/search-input';

export default class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: '',
    };
  }

  renderFilterOptions(option) {
    switch (option.type) {
      case 'search':
        return (
          <div className="modal__search">
            <SearchInput className="modal__search-input" placeholder="搜索" />
            <Icon type="search" />
          </div>
        );
      case 'select':
        return <div>test</div>;
      case 'refresh':
        return 'refresh';
      case 'button':
        return <Button>新建商品</Button>;
      default:
        return null;
    }
  }

  render() {
    const filterOptionLeft = this.props.filterOptionLeft || [];

    return (
      <div className="modal__filter">
        <div className="modal__filter__left">
          {filterOptionLeft.map(option => {
            return this.renderFilterOptions(option);
          })}
        </div>
      </div>
    );
  }
}
