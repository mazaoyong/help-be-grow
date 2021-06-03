import { Select } from '@zent/compat';
import React, { Component } from 'react';
import ajax from 'zan-pc-ajax';
import { Button, Input, Notify, Icon } from 'zent';
import get from 'lodash/get';
import { IFilterProps, IFilterState } from './type';

const url = get(window, '_global.url', {});

export default class Filter extends Component<IFilterProps, IFilterState> {
  constructor(props) {
    super(props);
    this.state = {
      goodsTypes: [{ id: '', title: '所有分组' }],
    };
  }

  static defaultProps = {
    createUrl: `${url.www}/showcase/goods/edit`,
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

  componentDidMount() {
    this.fetchTags();
  }

  fetchTags = () => {
    ajax({ url: this.props.goodsTypeUrl })
      .then(res => {
        this.setState({
          goodsTypes: [{ id: '', title: '所有分组' }].concat(res),
        });
      })
      .catch(err => {
        Notify.error(err && err.msg ? err.msg : '获取商品分组失败');
      });
  };

  handleChangeKeyword = e => {
    const { handleChangeKeyword } = this.props;
    handleChangeKeyword && handleChangeKeyword(e);
  };

  handleSearch = () => {
    const { onChange } = this.props;
    onChange && onChange(1, true);
  };

  render() {
    const {
      customLeft,
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
    } = this.props;

    const { goodsTypes } = this.state;

    return (
      <div className="modal__filter">
        <div>
          {customLeft && customLeft}
          {showCreate && (
            <Button type="primary" href={createUrl} target="_blank" outline>
              新建商品
            </Button>
          )}
          {showReload && <Button onClick={handleReload}>刷新</Button>}
        </div>
        <div className="modal__filter_right">
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
              data={goodsTypes}
            />
          )}
          {showSearch && (
            <div className="modal__search">
              <Input
                value={this.props.keyword}
                className="modal__search-input"
                placeholder="搜索"
                onChange={this.handleChangeKeyword}
                onPressEnter={this.handleSearch}
              />
              <Icon type="search" />
            </div>
          )}
        </div>
      </div>
    );
  }
}
