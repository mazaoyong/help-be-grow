/**
 * 积分商城 选择商品组件
 */
import React, { Component } from 'react';
import ListModal from '../../common/list-modal';
import { IChooseGoodsProps } from '../type';
import fullfillImage from '@youzan/utils/fullfillImage';
import { Button } from 'zent';
const POINT_STATE = {
  1: '未开始',
  2: '进行中',
  3: '已过期',
  4: '已失效',
};
const showSelect = data => +data.state === 1 || +data.state === 2;
export default class ChoseGoods extends Component<IChooseGoodsProps> {
  render() {
    // goodsType 商品类型，NULL：全部商品，1：普通商品，2：优惠券码， 3: 权益卡
    const url = '/v4/shop/design/point_mall/list.json?goodsType=1';
    const url2 = '/v4/shop/design/point_mall/list.json?goodsType=2';
    const url3 = '/v4/shop/design/point_mall/list.json?goodsType=3';
    const { visiblity, onClose, onConfirm } = this.props;
    const multiple = true;

    return (
      <div>
        <ListModal
          tabs={[
            {
              text: '普通商品',
              url,
              dataType: 2,
              columns: [
                {
                  title: '商品信息',
                  bodyRender: data => {
                    const {
                      price,
                      remainPrice,
                      title,
                      image_url: imgUrl,
                      url: linkUrl,
                      goodsType,
                    } = data;

                    // 判断是否 除了积分 还需要加钱兑换
                    let priceStr = `${price}积分`;
                    if (remainPrice > 0) {
                      priceStr += ` + ${remainPrice / 100}元`;
                    }

                    return (
                      <div className="modal__goods-info">
                        <a href={linkUrl} target="_blank" rel="noopener noreferrer">
                          <img alt="" src={imgUrl} />
                        </a>
                        <div className="modal__goods-info--content">
                          <a
                            className="points-mall__link-forbid"
                            href={linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {title}
                          </a>
                          <span className="modal__goods-price">
                            {+goodsType === 31 && (
                              <span className="modal__goods-type">课程商品</span>
                            )}
                            {priceStr}
                          </span>
                        </div>
                      </div>
                    );
                  },
                  width: '500px',
                },
                {
                  title: '库存',
                  width: '100px',
                  bodyRender: data => data.stock,
                },
                {
                  title: '活动状态',
                  width: '100px',
                  bodyRender: data => POINT_STATE[data.state],
                },
              ],
            },
            {
              text: '优惠券/码',
              url: url2,
              dataType: 2,
              columns: [
                {
                  title: '优惠券信息',
                  bodyRender: data => {
                    const { price, remainPrice, title, image_url: imgUrl, url: linkUrl } = data;

                    // 判断是否 除了积分 还需要加钱兑换
                    let priceStr = `${price}积分`;
                    if (remainPrice > 0) {
                      priceStr += ` + ${remainPrice / 100}元`;
                    }

                    return (
                      <div className="modal__goods-info">
                        <a
                          className="points-mall__link-forbid"
                          href={linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img alt="" src={imgUrl} />
                        </a>
                        <div className="modal__goods-info--content">
                          <a href={linkUrl} target="_blank" rel="noopener noreferrer">
                            {title}
                          </a>
                          <span className="modal__goods-price">{priceStr}</span>
                        </div>
                      </div>
                    );
                  },
                  width: '400px',
                },
                {
                  title: '优惠内容',
                  bodyRender: data => data.desc,
                  width: '167px',
                },
                {
                  title: '库存',
                  width: '67px',
                  bodyRender: data => data.stock,
                },
                {
                  title: '活动状态',
                  width: '66px',
                  bodyRender: data => POINT_STATE[data.state],
                },
              ],
            },
            {
              text: '权益卡',
              url: url3,
              dataType: 2,
              columns: [
                {
                  title: '权益卡信息',
                  bodyRender: data => {
                    const { price, remainPrice, title, url: linkUrl, image_url: imgUrl } = data;

                    // 判断是否 除了积分 还需要加钱兑换
                    let priceStr = `${price}积分`;
                    if (remainPrice > 0) {
                      priceStr += ` + ${remainPrice / 100}元`;
                    }

                    return (
                      <div className="modal__goods-info">
                        <a href={linkUrl} target="_blank" rel="noopener noreferrer">
                          <img alt="" src={fullfillImage(imgUrl, '!80x80')} />
                        </a>
                        <div className="modal__goods-info--content">
                          <a href={linkUrl} target="_blank" rel="noopener noreferrer">
                            {title}
                          </a>
                          <span className="modal__goods-price">{priceStr}</span>
                        </div>
                      </div>
                    );
                  },
                  width: '500px',
                },
                {
                  title: '库存',
                  width: '100px',
                  // tslint:disable-next-line: arrow-parens
                  bodyRender: (data /* , pos */) => data.stock,
                },
                {
                  title: '活动状态',
                  width: '100px',
                  // tslint:disable-next-line: arrow-parens
                  bodyRender: (data /* , pos */) => POINT_STATE[data.state],
                },
              ],
            },
          ]}
          visible={visiblity}
          multiple={multiple}
          pageSize={5}
          filterOption={{
            optionsData: [],
            showIsVirtual: false,
            showGoodsType: false,
            showCreate: false,
            showReload: true,
            showSearch: true,
            customLeft: (
              <Button href="/v4/ump/pointsmall" target="_blank" outline>
                商品管理
              </Button>
            ),
          }}
          onClose={onClose}
          onConfirm={onConfirm}
          shouldSelect={showSelect}
        />
      </div>
    );
  }
}
