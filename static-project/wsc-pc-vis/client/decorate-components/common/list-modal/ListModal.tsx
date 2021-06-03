import * as React from 'react';
import ajax from 'zan-pc-ajax';
import { Button, Dialog, Notify, Tabs } from 'zent';
import { Table } from '@zent/compat';
import omit from 'lodash/omit';
import get from 'lodash/get';
import Filter from './Filter';
import handleMap from './handle-data';
import GoodsSelectModal from './GoodsSelectModal';
import { IListModalProps, IListModalState } from './type';

const { TabPanel } = Tabs;
/**
 * ListModal是基础班商品选择器
 */
export default class ListModal extends React.Component<IListModalProps, IListModalState> {
  static GoodsSelectModal: typeof GoodsSelectModal;

  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      page: 1,
      total: 0,
      curTabIndex: 1,
      selectedRowKeys: [],
      selectedRows: [],
      keyword: '',
      is_virtual: '',
      goods_type: '',
      list: [],
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
    shouldSelect: () => true,
    filterOption: {
      optionsData: [],
      showCreate: true,
      showReload: true,
      showIsVirtual: true,
      showGoodsType: true,
      showSearch: true,
    },
  };

  componentWillReceiveProps(nextProps) {
    const { selectedRowKeys = [], selectedRows = [] } = nextProps;

    if (!this.props.visible && nextProps.visible) {
      this.setState(
        {
          page: 1,
          selectedRowKeys: [],
          selectedRows: [],
          keyword: '',
          is_virtual: '',
          goods_type: '',
        },
        this.fetch,
      );
    } else if (this.props.visible && nextProps.visible) {
      this.setState({
        selectedRowKeys: selectedRowKeys.length > 0 ? selectedRowKeys : [],
        selectedRows: selectedRows.length > 0 ? selectedRows : [],
      });
    }
  }

  fetch = (op?) => {
    const self = this;
    const { page, curTabIndex, is_virtual: isVirtual, goods_type: goodsType, keyword } = this.state;
    const { tabs, pageSize } = this.props;
    const curTab = tabs[curTabIndex - 1];
    const pageValue = op && op.p ? op.p : page;
    const kdtId = get(window._global, 'kdt_id', '') || get(window._global, 'kdtId', '');
    const params = {
      keyword,
      is_virtual: isVirtual,
      goods_type: goodsType,
      ...(curTab.dataType === 1 ? { page: pageValue } : { p: pageValue }),
      ...omit(op, ['p']),
      pageSize,
      kdt_id: kdtId,
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
      },
    );
  };

  handleChangePage = page => {
    const p = page.current || page;
    this.setState({ page: p });
    this.fetchWithParams(p);
  };

  handleSelect = (selectedRowKeys, selectedRows, currentRow) => {
    const { multiple } = this.props;
    if (multiple) {
      this.setState({ selectedRowKeys, selectedRows });
      return;
    }
    this.setState({
      selectedRowKeys: currentRow ? [currentRow.id || currentRow.item_id] : [],
      selectedRows: currentRow ? [currentRow] : [],
    });
  };

  fetchWithParams = (p = 1, isSearch?) => {
    if (isSearch) {
      this.setState(
        {
          goods_type: '',
        },
        () => {
          this.fetch({
            p,
            keyword: this.state.keyword,
            is_virtual: this.state.is_virtual,
            goods_type: this.state.goods_type,
          });
        },
      );
    }

    this.fetch({
      p,
      keyword: this.state.keyword,
      is_virtual: this.state.is_virtual,
      goods_type: this.state.goods_type,
    });
  };

  handleChangeKeyword = (e, shouldUseCallback = false) => {
    this.setState(
      { keyword: e.target.value },
      shouldUseCallback ? this.fetchWithParams : () => null,
    );
  };

  // tslint:disable-next-line: variable-name
  handleChangeIsVirtual = (_e, data) =>
    this.setState({ is_virtual: data.value }, this.fetchWithParams);

  // tslint:disable-next-line: variable-name
  handleChangeGoodsType = (_e, data) =>
    this.setState({ goods_type: data.id }, this.fetchWithParams);

  handleReload = () => {
    this.setState(
      {
        keyword: '',
        is_virtual: '',
        goods_type: '',
      },
      this.fetchWithParams,
    );
  };

  handleConfirm = () => {
    const { onConfirm, onClose, multiple } = this.props;
    onConfirm(multiple ? this.state.selectedRows : this.state.selectedRows[0]);
    this.handleClose();
    onClose();
  };

  renderTitle = () => {
    const { tabs } = this.props;
    const { curTabIndex } = this.state;
    const links = tabs[curTabIndex - 1].links || [];
    return (
      <div className="modal__links">
        {tabs.length > 1 ? (
          <Tabs activeId={curTabIndex} onChange={this.handleChangeTab}>
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
    } = this.state;
    const {
      tabs,
      filterOption,
      shouldSelect,
      emptyLabel,
      showCheckbox,
      rowKey,
      pageSize = 8,
    } = this.props;
    const curTab = tabs[curTabIndex - 1];
    const { columns } = curTab;
    const tableSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onSelect: this.handleSelect,
      needCrossPage: true,
    };
    const tableRowKey = rowKey || (+curTab.dataType === 2 ? 'item_id' : 'id');
    return (
      <div className="modal__children">
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
        />
        <Table
          className="rc-goods-list-dialog-table"
          columns={columns}
          datasets={list}
          onChange={this.handleChangePage}
          loading={isFetching}
          rowKey={tableRowKey}
          emptyLabel={isFetching ? '' : emptyLabel}
          getRowConf={(data, index) => {
            return { canSelect: shouldSelect(data, index), rowClass: '' };
          }}
          selection={showCheckbox ? tableSelection : undefined}
          batchComponents={showCheckbox ? [this.getBatchFunc] : undefined}
          pageInfo={{
            limit: pageSize,
            current: parseInt(`${page}`, 10),
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
        className="list-modal"
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
