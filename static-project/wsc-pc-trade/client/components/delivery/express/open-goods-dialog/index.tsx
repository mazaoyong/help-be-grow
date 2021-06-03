import React, { Component, Fragment } from 'react';
import { Grid, Dialog, BlockLoading, Notify, IGridPageInfo, IGridOnChangeConfig } from 'zent';
import { getGoodsById } from '../apis';
import { isRetailShop } from '@youzan/utils-shop';
import './style.scss';
// @ts-ignore
import buildUrl from '@youzan/utils/url/buildUrl.js';
import get from 'lodash/get';
import { IGoodsItem } from 'definitions/delivery/express';
import { IPaginator } from 'definitions/delivery';

const kdtId = get(_global, 'kdt_id', 0) || get(_global, 'kdtId', 0);

const dialogId = 'GOODS_TABLE_DIALOG';
const { openDialog, closeDialog } = Dialog;

const { store, www, h5 } = _global.url;

const itemEditPath = isRetailShop
  ? `${store}/goods/goods/shop#/edit/`
  : `${www}/showcase/goods/edit#/id=`;
const columns = [
  {
    title: '商品',
    bodyRender: item => {
      const { alias, title, picture } = item;
      let url;

      try {
        url = JSON.parse(picture)[0].url;
      } catch (err) {
        //
      }

      return (
        <Fragment>
          <img className="goods-dialog__pic" src={url} />
          <a href={buildUrl(`${h5}/v2/goods/${alias}`, '', kdtId)}>{title}</a>
        </Fragment>
      );
    },
  },
  {
    title: '操作',
    bodyRender: item => <a href={`${itemEditPath}${item.itemId}`}>查看详情</a>,
  },
];
interface IProps {
  id: number;
}

interface IState {
  loading: boolean;
  pageInfo: IGridPageInfo;
  list: IGoodsItem[];
  fxGoodsNumber: number;
}

class GoodsContent extends Component<IProps, IState> {
  state = {
    loading: true,
    pageInfo: {},
    list: [],
    fxGoodsNumber: 0,
  };

  getCmpdata = (value: IGridOnChangeConfig = { current: 1 }) => {
    const { current } = value;
    const { id } = this.props;
    this.setState({
      loading: true,
    });

    getGoodsById({
      id,
      page: current || 1,
    })
      .then(data => {
        const { items, fxGoodsNumber, paginator = {} as IPaginator } = data;
        const { totalCount, page, pageSize } = paginator;

        this.setState({
          list: items,
          fxGoodsNumber,
          pageInfo: {
            total: totalCount,
            pageSize,
            current: page,
          },
          loading: false,
        });
      })
      .catch(error => {
        Notify.error(error);
        this.setState({
          loading: false,
        });
      });
  };

  render() {
    const { pageInfo, list, fxGoodsNumber = 0, loading } = this.state;

    if (loading) {
      return <BlockLoading loading />;
    }

    return (
      <Fragment>
        <p className="goods-dialog__tip">
          提示：除以下商品，还有 <span>{fxGoodsNumber}</span>
          个商品正在供货平台使用，你可以请去供货平台修改调整商品的运费模板信息
        </p>
        <Grid
          datasets={list}
          onChange={this.getCmpdata}
          columns={columns}
          rowKey="alias"
          pageInfo={pageInfo}
        />
      </Fragment>
    );
  }

  componentDidMount() {
    this.getCmpdata();
  }
}

export default options => {
  const { title, ...restProps } = options;
  openDialog({
    title,
    dialogId,
    style: {
      width: '600px',
    },
    children: <GoodsContent {...restProps} />,
  });

  return () => closeDialog(dialogId);
};
