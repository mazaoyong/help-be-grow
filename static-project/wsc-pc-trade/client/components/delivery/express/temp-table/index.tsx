import React, { Component, Fragment } from 'react';
import { browserHistory } from 'react-router';
import cx from 'classnames';
import { Collapse, Grid, BlockLoading, Notify, Sweetalert, Alert } from 'zent';
import mapValues from 'lodash/mapValues';
import get from 'lodash/get';
import format from 'date-fns/format';
import { Pagination, IGridPageInfo } from 'zent';
import { getTempList, deleteTemp, copyTemp } from '../apis';
import openGoodsDialog from '../open-goods-dialog';
import { openRegionDialog } from '@youzan/react-components';
import { getTemplateUrl } from '../utils';
import { IPaginator } from 'definitions/delivery';
import { IExpressTemplate, IValuationRule } from 'definitions/delivery/express';
import './style.scss';

const { Panel } = Collapse;
const { withRegionMapConsumer } = openRegionDialog;

interface IProps {
  transformIdToName: (regionId: number, externalRegionMap: { [key: number]: string }) => string;
  setRef: any;
}

interface IState {
  loading: boolean;
  activeKey: string;
  list: IExpressTemplate[];
  pageInfo: IGridPageInfo;
  search: string;
}

class TempTable extends Component<IProps, IState> {
  state: IState = {
    activeKey: '',
    loading: true,
    list: [],
    pageInfo: {},
    search: '',
  };

  handleChange = activeKey => {
    this.setState({
      activeKey,
    });
  };

  getCmpData(page = 1, search = '') {
    this.setState({
      loading: true,
    });

    getTempList({
      pageSize: 10,
      page,
      templateName: search,
    })
      .then(value => {
        const { items, paginator = {} as IPaginator } = value;
        const { page, pageSize, totalCount } = paginator;
        this.setState({
          list: items,
          loading: false,
          pageInfo: {
            current: page,
            pageSize,
            total: totalCount,
          },
          search,
        });
      })
      .catch(err => {
        Notify.error(err);
        this.setState({
          loading: false,
        });
      });
  }

  copyTemp = templateId => e => {
    e.stopPropagation();

    try {
      const { search } = this.state;
      copyTemp({ templateId })
        .then(() => {
          Notify.success('复制成功');
          this.getCmpData(1, search);
        })
        .catch(error => {
          Notify.error(error);
        });
    } catch (error) {
      Notify.error(error);
    }
  };

  deleteTemp = (templateId, useCount) => e => {
    e.stopPropagation();

    if (useCount) {
      Sweetalert.alert({
        content: `该模板已被${useCount}个商品使用，不允许删除`,
      });
    } else {
      Sweetalert.confirm({
        content: '你确定要删除该模板么？',
        closeBtn: true,
        maskClosable: true,
        onConfirm: () => {
          try {
            const { search } = this.state;
            deleteTemp({ templateId })
              .then(() => {
                Notify.success('删除成功');
                this.getCmpData(1, search);
              })
              .catch(error => {
                Notify.error(error);
              });
          } catch (error) {
            Notify.error(error);
          }
        },
      });
    }
  };

  showGoods = ops => e => {
    e.stopPropagation();

    openGoodsDialog(ops);
  };

  editTemp = id => e => {
    e.stopPropagation();
    const templateType = get(_global, 'templateType', 3);
    const prefix = getTemplateUrl(templateType);
    const link = `${prefix}/edit/${id}${window.location.search}`;
    browserHistory.push(link);
  };

  renderContent = options => {
    const { id, name, useCount, updatedAt } = options;
    const { activeKey } = this.state;

    return (
      <div className="temp-item__block">
        <div className="temp-item__title">
          <span>{name}</span>
          {useCount ? (
            <span>
              (已被
              {useCount}
              个商品使用)
            </span>
          ) : null}
        </div>
        <div className="temp-item__action">
          <p>最后编辑时间: {format(updatedAt * 1000, 'YYYY-MM-DD')}</p>
          {useCount ? (
            <span
              onClick={this.showGoods({
                title: name,
                id,
              })}
            >
              查看商品
            </span>
          ) : null}
          <span onClick={this.copyTemp(id)}>复制模板</span>
          <span onClick={this.editTemp(id)}>修改</span>
          <span onClick={this.deleteTemp(id, useCount)}>删除</span>
          <i
            className={cx('temp-item__arrow', {
              reverse: activeKey && activeKey.indexOf(id.toString()) !== -1,
            })}
          />
        </div>
      </div>
    );
  };

  renderGrid = (options: IExpressTemplate) => {
    const { transformIdToName } = this.props;

    const columns = [
      {
        title: '可配送区域',
        bodyRender: ({ regions, compatMap }: IValuationRule) => {
          // 兼容的旧地址映射表
          const externalRegionMap = mapValues(compatMap, v => v.compatRegionName);
          return regions.map(region => transformIdToName(region, externalRegionMap)).join(',');
        },
      },
      {
        title: options.valuationType === 1 ? '首件(个)' : '首重(kg)',
        bodyRender: ({ firstAmount }: IValuationRule) =>
          options.valuationType === 1 ? firstAmount : (firstAmount / 1000).toFixed(1),
        width: '100px',
      },
      {
        title: '运费(元)',
        bodyRender: ({ firstFee }: IValuationRule) => (firstFee / 100).toFixed(2),
        width: '100px',
      },
      {
        title: options.valuationType === 1 ? '续件(个)' : '续重(kg)',
        bodyRender: ({ additionalAmount }: IValuationRule) =>
          options.valuationType === 1 ? additionalAmount : (additionalAmount / 1000).toFixed(1),
        width: '100px',
      },
      {
        title: '续费(元)',
        bodyRender: ({ additionalFee }: IValuationRule) => (additionalFee / 100).toFixed(2),
        width: '100px',
      },
    ];

    const { valuationRules = [] } = options;

    return <Grid columns={columns} datasets={valuationRules} rowKey="regions" />;
  };

  render() {
    const { list = [], activeKey, loading, pageInfo, search } = this.state;

    if (loading) {
      return <BlockLoading loading />;
    }

    if (!list.length) {
      return (
        <Alert className="temp-item__alert" type="warning">
          {search ? `未搜索到包含“${search}”的运费模板` : '暂无更多数据。'}
        </Alert>
      );
    }

    return (
      <Fragment>
        <Collapse className="temp-item__cps" activeKey={activeKey} onChange={this.handleChange}>
          {list.map(item => (
            <Panel
              title={this.renderContent(item)}
              key={item.id}
              showArrow={false}
              panelKey={String(item.id)}
              onChange={this.handleChange}
            >
              {this.renderGrid(item)}
            </Panel>
          ))}
        </Collapse>
        <Pagination
          className="temp-item__pag"
          {...pageInfo}
          onChange={config => this.getCmpData(config.current, search)}
        />
      </Fragment>
    );
  }

  componentDidMount() {
    this.getCmpData();
    this.props.setRef(this);
  }
}

export default withRegionMapConsumer(TempTable);
