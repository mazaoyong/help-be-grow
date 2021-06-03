import React, { Component } from 'react';
import { Button, Dialog, Notify, Tabs } from 'zent';
import { Table } from '@zent/compat';
import map from 'lodash/map';
import pick from 'lodash/pick';
import ajax from 'zan-pc-ajax';
import Filter from './Filter';
import handleMap from './handle-data';
import * as render from './BodyRender';

import './style.scss';

export const { titleBodyRender, imageBodyRender, createTimeBodyRender } = render;

const { TabPanel } = Tabs;

/**
 * ListModal是基础班商品选择器
 */
export default class ListModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      page: 1,
      total: 0,
      pageSize: 8,
      curTabIndex: 1,
      selectedRowKeys: this.props.selectedRowKeys,
      selectedRows: [],
      keyword: '',
      is_virtual: '',
      goods_type: '',
    };
  }
  static defaultProps = {
    visible: false,
    multiple: false,
    emptyLabel: '没有更多数据了',
    showCheckbox: true,
    selectedRowKeys: [],
    selectedRows: [],
    onClose: () => null,
    onChangeTab: () => null,
    onConfirm: () => null,
    filterOption: {
      optionsData: [],
      showCreate: true,
      showReload: true,
      showIsVirtual: true,
      showGoodsType: true,
      showSearch: true,
    },
    shopNoteIds: [],
    pageSize: 8,
  };

  componentWillReceiveProps(nextProps) {
    const { selectedRowKeys = [], selectedRows = [] } = nextProps;
    if (!this.props.visible && nextProps.visible) {
      this.setState(
        {
          page: 1,
          selectedRowKeys: selectedRowKeys.length > 0 ? selectedRowKeys : [],
          selectedRows: selectedRows.length > 0 ? selectedRows : [],
          keyword: '',
          is_virtual: '',
          goods_type: '',
        },
        this.fetch()
      );
    } else if (this.props.visible && nextProps.visible) {
      this.setState({
        selectedRowKeys: selectedRowKeys.length > 0 ? selectedRowKeys : [],
        selectedRows: selectedRows.length > 0 ? selectedRows : [],
      });
    }
  }

  fetch = op => {
    const self = this;
    const { page, curTabIndex } = this.state;
    const { tabs, pageSize } = this.props;
    const curTab = tabs[curTabIndex - 1];
    const pageValue = op && op.p ? op.p : page;
    const noteType = curTab.noteType ? { noteType: curTab.noteType } : null;
    const keyword = op && op.title ? { title: op.title } : null;
    const params = {
      page,
      pageSize,
      // kdt_id: `${kdtId}`,
      ignoreStickNote: false,
      noteStatus: 'published',
      ...keyword,
      ...noteType,
    };
    this.setState({ isFetching: true });
    const dataType = curTab.dataType;
    ajax({
      url: curTab.url,
      data: params,
    })
      .then(res => {
        const handleFunc = handleMap.get(dataType || 0);
        pageValue !== this.state.page && this.setState({ page: pageValue });
        handleFunc(res, self);
      })
      .catch(resp => {
        this.setState({ isFetching: false });
        Notify.error(resp && resp.msg ? resp.msg : '获取数据失败');
      });
  };

  handleClose = () => {
    this.setState({
      curTabIndex: 1,
      page: 1,
      keyword: '',
    });
  };

  handleChangeTab = id => {
    if (id === this.state.curTabIndex) {
      return;
    }
    this.setState(
      {
        curTabIndex: id,
      },
      () => {
        this.handleChangePage(1);
        this.props.onChangeTab();
      }
    );
  };

  handleChangePage = page => {
    const p = page.current || page;
    this.setState({ page: p }, () => {
      this.fetchWithParams(p);
    });
  };

  handleSelect = (selectedRowKeys, selectedRows, currentRow) => {
    const { multiple } = this.props;
    if (multiple) {
      this.setState({ selectedRowKeys, selectedRows });
      return;
    }
    this.setState({
      selectedRowKeys: currentRow ? [currentRow.noteId] : [],
      selectedRows: currentRow ? [currentRow] : [],
    });
  };

  fetchWithParams = (p = 1, isSearch) => {
    const title = isSearch ? { title: this.state.keyword } : null;
    this.fetch({
      p,
      ...title,
    });
  };

  handleChangeKeyword = (e, shouldUseCallback = false) => {
    this.setState(
      { keyword: e.target.value },
      shouldUseCallback ? this.fetchWithParams : () => null
    );
  };

  handleChangeIsVirtual = (e, data) =>
    this.setState({ is_virtual: data.value }, this.fetchWithParams);

  handleChangeGoodsType = (e, data) => this.setState({ goods_type: data.id }, this.fetchWithParams);

  handleReload = () => {
    this.setState(
      {
        keyword: '',
        is_virtual: '',
        goods_type: '',
      },
      this.fetchWithParams
    );
  };

  handleConfirm = () => {
    const { onConfirm, onClose, shopNoteIds } = this.props;
    const row = this.state.selectedRows;
    const length = shopNoteIds.length + row.length;
    if (length <= 10) {
      onConfirm(this.state.selectedRows);
      this.handleClose();
      onClose();
    } else {
      Notify.error('最多添加十篇笔记');
    }
  };

  renderTitle = () => {
    const { tabs, title } = this.props;
    const { curTabIndex } = this.state;
    const links = tabs[curTabIndex - 1].links || [];
    return (
      <div className="shopnote-showcase-modal">
        <div className="modal__title">{title}</div>
        <div className="modal__links">
          {tabs.length > 1 ? (
            <Tabs activeId={curTabIndex} onChange={this.handleChangeTab} type="slider">
              {tabs.map((tab, index) => (
                <TabPanel id={index + 1} tab={tab.text} key={`${tab.text}`} />
              ))}
            </Tabs>
          ) : (
            <div>{tabs[0].text}</div>
          )}
          {links.map(link => (
            <Button
              key={link.link}
              type="primary"
              href={link.link}
              target="_blank"
              bordered={false}
              outline
            >
              {link.text}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  getBatchFunc = data => {
    return <span>已选择 {data.length} 个商品</span>;
  };

  renderChildren = () => {
    const {
      page,
      total,
      list,
      curTabIndex,
      isFetching,
      selectedRowKeys,
      is_virtual: isVirtual,
      goods_type: goodsType,
      keyword,
      pageSize,
    } = this.state;
    const { tabs, filterOption, emptyLabel, showCheckbox, buttonText } = this.props;
    const curTab = tabs[curTabIndex - 1];
    const { columns } = curTab;
    const tableSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onSelect: this.handleSelect,
      needCrossPage: true,
    };
    return (
      <div className="modal__children shopnote-modal__children">
        <Filter
          {...filterOption}
          onChange={this.fetchWithParams}
          handleReload={this.handleReload}
          handleChangeKeyword={this.handleChangeKeyword}
          handleChangeIsVirtual={this.handleChangeIsVirtual}
          handleChangeGoodsType={this.handleChangeGoodsType}
          is_virtual={isVirtual}
          goods_type={goodsType}
          keyword={keyword}
          buttonText={buttonText}
        />
        <Table
          className="rc-goods-list-dialog-table"
          columns={map(columns, col => pick(col, ['title', 'bodyRender']))}
          datasets={list}
          onChange={this.handleChangePage}
          loading={isFetching}
          rowKey={'noteId'}
          emptyLabel={isFetching ? '' : emptyLabel}
          getRowConf={() => {
            return { canSelect: true };
          }}
          selection={showCheckbox ? tableSelection : null}
          batchComponents={[this.getBatchFunc]}
          pageInfo={{
            limit: pageSize,
            current: parseInt(page, 10),
            total,
          }}
        />
        <div className="modal__footer-child">
          <Button
            className="modal__footer-btn"
            type="primary"
            disabled={selectedRowKeys.length === 0}
            onClick={this.handleConfirm}
          >
            确定
            {selectedRowKeys.length > 0 && `(${selectedRowKeys.length})`}
          </Button>
        </div>
      </div>
    );
  };

  render() {
    const { visible, onClose } = this.props;
    return visible ? (
      <Dialog
        className="list-modal note-card"
        closeBtn
        mask
        maskClosable={false}
        title={this.renderTitle()}
        onClose={() => {
          this.handleClose();
          onClose();
        }}
        visible={visible}
      >
        {this.renderChildren()}
      </Dialog>
    ) : null;
  }
}
