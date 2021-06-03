import React, { PureComponent, Component } from 'react';
import VuePreview from 'components/vue-preview';
import unify from 'components/vue-preview/unify';
import { GoodsList } from '@youzan/captain-showcase';

const VueComponent = unify(GoodsList);

const GOODSLISTCONF = {
  layout: 3,
  sizeType: 2,
  showBuyButton: false,
  imageFillStyle: 2,
};

export default class GoodsListPreview extends (PureComponent || Component) {
  render() {
    let { list } = this.props;
    let showMoreFlag = false;
    if (list.length > 3) {
      list = list.slice(0, 3);
      showMoreFlag = true;
    }
    return (
      <div className="goods-list">
        <p className="goods-list__title">推荐好物</p>
        <div className="goods-list__container">
          <VuePreview
            vueComponent={VueComponent}
            value={Object.assign({}, GOODSLISTCONF, { list })}
            className="goods-list-preview"
          />
        </div>
        {showMoreFlag ? <p className="goods-list__bottom">查看更多</p> : null}
      </div>
    );
  }
}
