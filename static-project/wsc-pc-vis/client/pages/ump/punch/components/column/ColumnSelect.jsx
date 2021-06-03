import React, { Component } from 'react';
import { Dialog, Radio, Button, ClampLines } from 'zent';
import { Table } from '@zent/compat';
import { Img } from '@youzan/ebiz-components';
import SearchInput from 'components/search-input';
import buildUrl from '@youzan/utils/url/buildUrl';

import { getPunchColumnsAPI } from '../../api';

const RadioGroup = Radio.Group;
const { ImgWrap } = Img;
export default class ColumnSelect extends Component {
  state = {
    datasets: [],
    tableLoading: true,
    title: '',
    page: 1,
    size: 5,
    total: 0,
    selected: this.props.selected || '',
  };

  componentDidMount() {
    this.getPunchColumns(1);
  }

  handleSelect = selected => {
    this.setState({
      selected,
    });
  };

  onInputChange = evt => {
    this.setState({
      title: evt.target.value,
    });
  };

  onSubmit = () => {
    this.props.onSubmit(this.state.selected);
  };

  onSelectChange = selected => {
    this.setState({
      selected,
    });
  };

  getPunchColumns(current) {
    this.setState({
      tableLoading: true,
    });

    const req = {
      page: current || this.state.page,
      size: this.state.size,
    };

    if (this.state.title !== '') {
      req.title = this.state.title;
    }

    getPunchColumnsAPI(req)
      .then(({ content = [], total = 0, pageable: { pageNumber } }) => {
        this.setState({
          datasets: content,
          total,
          page: pageNumber,
        });
      })
      .catch(msg => {})
      .finally(() => {
        this.setState({
          tableLoading: false,
        });
      });
  }

  getColumns() {
    return [
      {
        title: '',
        width: '36px',
        bodyRender: data => {
          return (
            <RadioGroup
              value={this.state.selected}
              onChange={evt => this.handleSelect(evt.target.value)}
            >
              <Radio value={data.columnAlias} disabled={!data.avaliableForGci} />
            </RadioGroup>
          );
        },
      },
      {
        title: '专栏',
        textAlign: 'left',
        bodyRender: item => {
          return (
            <div className="goods-name-col">
              <ImgWrap width="60px" height="60px" src={item.columnCoverUrl} alt="goods" />
              <div className="goods-name-col__detail">
                <a
                  href={buildUrl(`https://h5.youzan.com/wscvis/knowledge/index?kdt_id=${_global.kdtId}&p=columnshow` +
                  `&alias=${item.columnAlias}&qr=paidcolumn_${item.columnAlias}`, '', _global.kdtId)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ClampLines lines={1} text={item.columnTitle} />
                </a>
                <div className="goods-name-col__goods-no" />
                <div className="goods-name-col__rest">
                  <span className="goods-name-col__label">知识付费</span>
                  <span>￥{(item.price / 100).toFixed(2)}</span>
                </div>
              </div>
            </div>
          );
        },
      },
      {
        title: '状态',
        bodyRender: item => {
          let descript = '可选择';

          if (!item.avaliableForGci) {
            if (item.descript) {
              descript = item.descript;
            } else {
              descript = '状态冲突不可用';
            }
          }
          return <span className="gray">{descript}</span>;
        },
      },
    ];
  }

  renderTable() {
    const { datasets, tableLoading, page, size, total } = this.state;

    return (
      <Table
        className="column__list-table"
        columns={this.getColumns()}
        datasets={datasets}
        loading={tableLoading}
        onChange={({ current }) => this.getPunchColumns(current)}
        pageInfo={{
          current: page,
          pageSize: size,
          totalItem: total,
        }}
      />
    );
  }

  render() {
    const { visible, title } = this.props;

    return (
      <Dialog
        className="column-select"
        closeBtn
        mask
        maskClosable={false}
        title="商品选择"
        onClose={this.onSubmit}
        visible={visible}
        footer={
          <Button type="primary" onClick={this.onSubmit}>
            确定
          </Button>
        }
      >
        <div className="list-filter clearfix">
          <div className="filter-left">
            <Button type="primary" outline onClick={() => this.getPunchColumns()}>
              刷新
            </Button>
          </div>
          <div className="filter-right">
            <SearchInput
              placeholder="搜索"
              value={title}
              onChange={evt => {
                this.onInputChange(evt);
              }}
              onPressEnter={() => this.getPunchColumns(1)}
            />
          </div>
        </div>
        <div>{this.renderTable()}</div>
      </Dialog>
    );
  }
}
