import React, { Component, cloneElement } from 'react';
import DetailPageSide from './components/detail-page-side';
import './index.scss';

export default class Detail extends Component {
  detailRef = null;

  onDetailRefresh = () => {
    if (this.detailRef) {
      this.detailRef.getEduClassDetail();
    }
  };

  getClassDetail = () => {
    if (this.detailRef) {
      return this.detailRef.getEduClassInfo();
    }
  };

  render() {
    return (
      <div className="class-detail-page">
        <DetailPageSide getInstance={ref => (this.detailRef = ref)} />
        <div className="class-detail-page__content">
          {cloneElement(this.props.children, {
            refreshDetail: this.onDetailRefresh,
            getClassDetail: this.getClassDetail
          })}
        </div>
      </div>
    );
  }
}
