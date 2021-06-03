import { Select, Table } from '@zent/compat';
import React, { Component } from 'react';
import { Button, Dialog, Notify } from 'zent';
import has from 'lodash/has';
// import SearchInput from 'components/search-input/index';
import ajax from 'zan-pc-ajax/lib';
import './style.scss';

export default class GoodsSelect extends Component {
  static defaultProps = {
    url: '',
    activityId: '',
    selectedRowKeys: [],
    selectedRows: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      keyword: '',
      types: '',
      paginator: {
        pageSize: 6,
        current: 1,
        totalItem: 0,
      },
      tableloading: true,
      datasets: [],
    };
  }

  componentWillMount() {
    this.setState({
      selectedRowKeys: this.props.selectedRowKeys,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible) {
      this.getGoodsData();
    }
    this.setState({
      selectedRowKeys: nextProps.selectedRowKeys,
    });
  }

  handleClose() {
    this.props.onClose();
  }

  // 获取商品列表
  getGoodsData = current => {
    this.setState({
      tableloading: true,
    });
    const { paginator, types } = this.state;
    ajax({
      url: this.props.url,
      method: 'GET',
      data: {
        types,
        activityId: this.props.activityId,
        size: paginator.pageSize,
        page: current || paginator.current,
      },
    })
      .then(data => {
        const items = data.items;
        const datasets = items.map(item => {
          if (this.props.selectedRowKeys.includes(item.itemId)) {
            item.join = 0;
          }
          return item;
        });
        this.setState({
          tableloading: false,
          datasets,
          paginator: {
            pageSize: data.paginator.pageSize,
            current: data.paginator.page,
            totalItem: data.paginator.totalCount,
          },
        });
      })
      .catch(({ msg }) => {
        Notify.error(msg);
      })
      .finally(() => {
        this.setState({
          tableloading: false,
        });
      });
  };

  // 不可选判断
  getRowConf(rowData) {
    return {
      canSelect: rowData.join === 0 || (has(rowData, 'could_join') && rowData.could_join),
    };
  }

  onSelect(selectedRowKeys) {
    this.setState({
      selectedRowKeys,
    });
  }

  getBatchFunc = () => {
    const { selectedRowKeys } = this.state;
    return <span>已选择 {`${selectedRowKeys.length}`} 个商品</span>;
  };

  handleSearchChange = evt => {
    this.setState({
      keyword: evt.target.value,
    });
  };

  handleSelectChange = evt => {
    this.setState(
      {
        types: evt.target.value,
      },
      () => {
        this.getGoodsData();
      }
    );
  };

  onPageChange = conf => {
    this.getGoodsData(conf.current);
  };

  handleSubmit = () => {
    this.props.onSubmit(this.state.selectedRowKeys);
  };

  renderFilter() {
    const selectOption = [
      {
        value: '',
        text: '全部',
      },
      {
        value: 1,
        text: '专栏',
      },
      {
        value: 2,
        text: '内容',
      },
    ];
    return (
      <div className="modal-filter">
        <div className="left" />
        <div />
        <div className="right">
          <Select
            placeholder="全部"
            data={selectOption}
            value={this.state.types}
            onChange={evt => this.handleSelectChange(evt)}
          />
        </div>
      </div>
    );
  }

  getColumns() {
    return [
      {
        title: '商品',
        width: '50%',
        bodyRender: data => {
          return (
            <div className="modal__goods-info">
              <a href={data.url || data.kdt_url} target="_blank" rel="noopener noreferrer">
                <img alt="" src={data.image_url || data.cover_attachment_url} />
              </a>
              <div className="content">
                <a
                  className="ellipsis"
                  href={data.url || data.kdt_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {data.title}
                </a>
                <span className="modal__goods-price">￥{(data.price / 100).toFixed(2)}</span>
              </div>
            </div>
          );
        },
      },
      {
        title: '不可选原因',
        width: '50%',
        bodyRender: data => {
          let text;
          switch (data.join) {
            case 1:
              text = '已参加其他活动';
              break;
            case 2:
              text = '免费商品不可参加';
              break;
            case 3:
              text = '仅专栏售卖的内容不可参加';
              break;
            default:
              text = '可以参加';
          }

          if (has(data, 'could_join') && !data.could_join) {
            text = data.could_not_join_reason;
          }
          return <p className="modal__disabled">{text}</p>;
        },
      },
    ];
  }

  renderTable() {
    const { paginator, datasets } = this.state;
    return (
      <Table
        className="goods-list-table"
        columns={this.getColumns()}
        rowKey="itemId"
        datasets={datasets}
        pageInfo={paginator}
        getRowConf={this.getRowConf}
        loading={this.state.tableloading}
        onChange={conf => {
          this.onPageChange(conf);
        }}
        batchComponents={[this.getBatchFunc]}
        selection={{
          selectedRowKeys: this.state.selectedRowKeys,
          needCrossPage: !this.props.isSingleSelection,
          isSingleSelection: this.props.isSingleSelection,
          onSelect: selectedRowkeys => {
            this.onSelect(selectedRowkeys);
          },
        }}
      />
    );
  }

  renderContent() {
    const { selectedRowKeys } = this.state;
    return (
      <div className="modal-content">
        {this.renderFilter()}
        {this.renderTable()}
        <div className="modal-footer">
          <Button
            type="primary"
            onClick={this.handleSubmit}
            disabled={selectedRowKeys.length === 0}
          >
            确定
            {selectedRowKeys.length > 0 && `(${selectedRowKeys.length})`}
          </Button>
        </div>
      </div>
    );
  }

  render() {
    const { visible } = this.props;
    return visible ? (
      <Dialog
        className="goods_list"
        closeBtn
        mask
        maskClosable={false}
        title="商品选择"
        onClose={() => {
          this.handleClose();
        }}
        visible={visible}
      >
        {this.renderContent()}
      </Dialog>
    ) : null;
  }
}
