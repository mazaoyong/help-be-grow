import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import Previewer from './components/Previewer';
import { Button, Tag, Notify, Sweetalert } from 'zent';
import isEmpty from 'lodash/isEmpty';
import * as API from './api';
import { PREVIEW_SOURCE, EDIT_TYPE } from './constants';

export default class PreviewPage extends Component {
  static defaultProps = {};

  state = {
    setting: {},
    // mode=1允许配置顶部&底部推荐 mode=0只允许底部推荐
    mode: 0,
  };

  componentDidMount() {
    const { location } = this.props;
    const { mode } = location.query;
    this.setState({ mode: +mode });
    this.getRecommendSetting();
  }

  getRecommendSetting() {
    const { alias, relatedAlias, type } = this.props.location.query;
    API.findRecommend({
      targetAlias: alias,
      relatedColumnAlias: relatedAlias,
      kdtId: window._global.kdtId,
      targetType: type,
    })
      .then(res => {
        this.setState({
          setting: res,
        });
      })
      .catch(err => {
        Notify.error(err);
      });
  }

  deleteRecommendSetting(position = EDIT_TYPE.top) {
    const { alias, relatedAlias, type } = this.props.location.query;
    const delFn =
      position === EDIT_TYPE.top ? API.deleteMediaEndingRecommend : API.deletePageDetailRecommend;
    const reqData = {
      targetAlias: alias,
      relatedColumnAlias: relatedAlias,
      kdtId: window._global.kdtId,
      targetType: type,
    };
    Sweetalert.confirm({
      content: '删除设置后，商品页将不再展示推荐商品',
      title: '删除设置',
      confirmText: '确定删除',
      cancelText: '暂不删除',
      className: 'dialog-450',
      closeBtn: 'true',
      onConfirm: () => {
        delFn(reqData)
          .then(res => {
            Notify.success('删除成功');
            this.getRecommendSetting();
          })
          .catch(err => {
            Notify.error(err);
          });
      },
    });
  }

  renderTopGoodsInfo(singleModule) {
    const hasSetting = !isEmpty(singleModule);
    return (
      <div className="info">
        <h3 className="info__title">
          音视频播放结尾处推荐
          {hasSetting ? (
            <Tag className="info__tag" color="blue" outline>
              已设置
            </Tag>
          ) : (
            <Tag className="info__tag" borderColor="#bbb" fontColor="#999" outline>
              未设置
            </Tag>
          )}
        </h3>

        <p className="info__desc">
          单卖的音频、视频，在播放结束时显示推荐的商品。（比如推荐关联的专栏大课)
        </p>

        <div className="info__btns">
          <Button
            type="primary"
            onClick={() =>
              hashHistory.push(`/goods-recommend/edit/top${this.props.location.search}`)
            }
          >
            {hasSetting ? '编辑' : '立即设置'}
          </Button>
          {hasSetting ? (
            <Button
              type="primary"
              outline
              onClick={() => this.deleteRecommendSetting(EDIT_TYPE.top)}
            >
              删除设置
            </Button>
          ) : null}
        </div>
      </div>
    );
  }

  renderBottomGoodsInfo(nonOwlModule, owlModule) {
    const hasSetting = !isEmpty(nonOwlModule) || !isEmpty(owlModule);
    return (
      <div className="info">
        <h3 className="info__title">
          详情页底部推荐商品
          {hasSetting ? (
            <Tag className="info__tag" color="blue" outline>
              已设置
            </Tag>
          ) : (
            <Tag className="info__tag" borderColor="#bbb" fontColor="#999" outline>
              未设置
            </Tag>
          )}
        </h3>

        <p className="info__desc">
          在买家订购后的内容详情页底部显示推荐的商品，提升关联商品的曝光量。（比如推荐关联的专栏或者配套的实物）
        </p>

        <div className="info__btns">
          <Button
            type="primary"
            onClick={() =>
              hashHistory.push(`/goods-recommend/edit/bottom${this.props.location.search}`)
            }
          >
            {hasSetting ? '编辑' : '立即设置'}
          </Button>
          {hasSetting ? (
            <Button
              type="primary"
              outline
              onClick={() => this.deleteRecommendSetting(EDIT_TYPE.bottom)}
            >
              删除设置
            </Button>
          ) : null}
        </div>
      </div>
    );
  }

  render() {
    const { mode, setting } = this.state;
    const { nonOwlModule, owlModule, singleModule } = setting;

    return (
      <div className="preview">
        <div className="preview__design-container">
          <Previewer
            showTop={mode === 1}
            showBottom={true}
            setting={setting}
            source={PREVIEW_SOURCE.preview}
          />
        </div>

        <div className="preview__info">
          {mode === 1 ? this.renderTopGoodsInfo(singleModule) : ''}
          {this.renderBottomGoodsInfo(nonOwlModule, owlModule)}
        </div>
      </div>
    );
  }
}
