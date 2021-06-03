import React, { Component } from 'react';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import { PREVIEW_SOURCE } from '../constants';
import GoodsListPreview from './goods-list-preview';
import PctListPreview from './pct-list-preview';
import { goodsListAdaptor, pctListAdaptor } from '../utils';

export default class Previewer extends Component {
  componentDidMount() {}

  renderTop(singleModule) {
    const { source } = this.props;
    const recommend = get(singleModule, 'recommends[0]', {});
    return (
      <div className="top">
        {(() => {
          if (isEmpty(recommend) && source === PREVIEW_SOURCE.edit) {
            return <p className="top__hint">点击右方【添加商品】按钮，即可推荐商品哦</p>;
          } else if (isEmpty(recommend) && source === PREVIEW_SOURCE.preview) {
            return (
              <div className="top__nonctner">
                <img
                  className="top__icon"
                  src="https://img.yzcdn.cn/paidcontent/goods-recommend/goodsicon@2x.png"
                />
                <p className="top__hint">你还未设置商品推荐</p>
              </div>
            );
          } else {
            return (
              <div className="topgoods">
                <p className="topgoods__hint">为你推荐</p>
                <div className="topgoods__container">
                  <img
                    className={
                      recommend.productType === 0 ? 'topgoods__goodsimg' : 'topgoods__pctimg'
                    }
                    src={recommend.cover}
                  />
                  <div className="topgoods__right">
                    <p className="topgoods__title">{recommend.title}</p>
                    <p className="topgoods__price">￥{(recommend.price / 100).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            );
          }
        })()}
      </div>
    );
  }

  renderBottom(nonOwlModule, owlModule) {
    const { source } = this.props;
    const switched = get(nonOwlModule, 'serialNo', 0) !== 0;
    if (isEmpty(get(nonOwlModule, 'recommends')) && isEmpty(get(owlModule, 'recommends'))) {
      return (
        <div className="bottom">
          <p className="bottom__title">关联商品推荐</p>
          <div className="bottom__container">
            {(() => {
              if (source === PREVIEW_SOURCE.edit) {
                return (
                  <p className="bottom__emptyhint">点击右方【添加商品】按钮，即可推荐商品哦</p>
                );
              } else {
                return (
                  <div className="bottom__nonctner">
                    <img
                      className="bottom__icon"
                      src="https://img.yzcdn.cn/paidcontent/goods-recommend/goodsicon@2x.png"
                    />
                    <p className="bottom__hint">你还未设置详情页底部的推荐商品</p>
                  </div>
                );
              }
            })()}
          </div>
        </div>
      );
    }
    return (
      <div>
        {!switched ? this.renderNonOwlGoods(nonOwlModule) : this.renderOwlGoods(owlModule)}
        {switched ? this.renderNonOwlGoods(nonOwlModule) : this.renderOwlGoods(owlModule)}
      </div>
    );
  }

  renderOwlGoods(owlModule) {
    let recommends = get(owlModule, 'recommends', []);
    if (isEmpty(recommends)) return null;
    return <PctListPreview list={pctListAdaptor(recommends)} />;
  }

  renderNonOwlGoods(nonOwlModule) {
    let recommends = get(nonOwlModule, 'recommends', []);
    if (isEmpty(recommends)) return null;
    return <GoodsListPreview list={goodsListAdaptor(recommends)} />;
  }

  render() {
    const { showTop, showBottom, setting, height } = this.props;
    const { nonOwlModule, owlModule, singleModule } = setting;
    return (
      <div className="previewer" style={{ height: height }}>
        <img
          className="previewer__header"
          src="https://img.yzcdn.cn/paidcontent/goods-recommend/head@2x.png"
        />
        {showTop ? this.renderTop(singleModule) : null}
        <img
          className="previewer__placeholder"
          src={
            showTop
              ? 'https://img.yzcdn.cn/paidcontent/goods-recommend/bigplaceholder@2x.png'
              : 'https://img.yzcdn.cn/paidcontent/goods-recommend/smallplaceholder@2x.png'
          }
        />
        {showBottom ? this.renderBottom(nonOwlModule, owlModule) : null}
      </div>
    );
  }
}
