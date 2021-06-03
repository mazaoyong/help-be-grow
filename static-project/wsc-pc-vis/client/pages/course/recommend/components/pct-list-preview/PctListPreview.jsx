import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class PctListPreview extends Component {
  static propTypes = {
    list: PropTypes.array,
  };

  render() {
    let { list = [] } = this.props;
    let showMoreFlag = false;
    if (list.length > 3) {
      list = list.slice(0, 3);
      showMoreFlag = true;
    }
    return (
      <div className="pct-list">
        <p className="pct-list__title">推荐知识</p>
        <div className="pct-list__container">
          {list.map(item => {
            return (
              <div className="pct-item" key={item.id}>
                <div className="pct-item__thumbnail">
                  <img
                    src={
                      item.cover ||
                      'https://img.yzcdn.cn/paidcontent/goods-recommend/emptypcticon@2x.png'
                    }
                    alt=""
                  />
                </div>
                <div className="pct-item__detail">
                  <h4 className="pct-item__title ellipsis">{item.title}</h4>
                  <p className="pct-item__subtitle">{item.subtitle}</p>
                  <p className="pct-item__price">￥{item.price}</p>
                </div>
              </div>
            );
          })}
        </div>
        {showMoreFlag ? <p className="pct-list__bottom">查看更多</p> : null}
      </div>
    );
  }
}
