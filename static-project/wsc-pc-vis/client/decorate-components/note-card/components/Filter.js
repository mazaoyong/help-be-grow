import { Select } from '@zent/compat';
import React, { Component } from 'react';
import classnames from 'classnames';
import { Button, Input, Icon } from 'zent';

const url = window._global && window._global.url ? window._global.url : {};

export default class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      goodsTypes: [{ id: '', title: '所有分组' }],
      showSearchCancel: false,
    };
  }

  static defaultProps = {
    createUrl: '/v4/shop/shopnote#/design/create',
    goodsTypeUrl: `${url.www}/showcase/tag/option.json`,
    optionsData: [
      {
        value: 0,
        text: '所有类型',
      },
      {
        value: 1,
        text: '实物商品',
      },
      {
        value: 2,
        text: '虚拟商品',
      },
      {
        value: 3,
        text: '电子卡券',
      },
    ],
    showCreate: true,
    showReload: true,
    showIsVirtual: false,
    showGoodsType: false,
    showSearch: true,
  };

  cancelKeyword = () => {
    this.props.handleChangeKeyword({ target: { value: '' } }, true);
    this.setState({ showSearchCancel: false });
  };

  handleSearch = () => {
    this.props.onChange(1, true);
    this.setState({
      showSearchCancel: true,
    });
  };

  render() {
    const {
      showCreate,
      createUrl,
      showReload,
      optionsData,
      showIsVirtual,
      showGoodsType,
      showSearch,
      handleReload,
      handleChangeIsVirtual,
      handleChangeGoodsType,
      handleChangeKeyword,
      buttonText,
    } = this.props;

    return (
      <div className="modal__filter">
        <div>
          {showCreate && (
            <Button type="primary" href={createUrl} target="_blank">
              {buttonText}
            </Button>
          )}
          {showReload && (
            <span onClick={handleReload} className="link">
              刷新
            </span>
          )}
        </div>
        <div>
          {showIsVirtual && (
            <Select
              placeholder="所有类型"
              value={this.props.is_virtual}
              onChange={handleChangeIsVirtual}
              data={optionsData}
            />
          )}
          {showGoodsType && (
            <Select
              placeholder="所有分组"
              value={this.props.goods_type}
              onChange={handleChangeGoodsType}
              optionText="title"
              optionValue="id"
              data={this.state.goodsTypes}
            />
          )}
          {showSearch && (
            <div className="modal__search">
              <Input
                value={this.props.keyword}
                className="modal__search-input"
                placeholder="搜索笔记名称"
                onChange={handleChangeKeyword}
                onPressEnter={this.handleSearch}
              />
              <Icon
                type="search"
                className={classnames({
                  'zenticon-cancel': this.state.showSearchCancel,
                })}
              />
            </div>
          )}
          {showSearch &&
            this.state.showSearchCancel && (
              <Button style={{ marginLeft: 10 }} type="primary" onClick={this.cancelKeyword}>
                取消
              </Button>
            )}
        </div>
      </div>
    );
  }
}
