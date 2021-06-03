import React, { Component } from 'react';
import helpPopupTips from '../../components/help-popup-tips';
import { ShowWrapper, isInStoreCondition } from 'fns/chain';
const helpContent = ['已关联线下课', '已满员', '已结班'];

class PopupTips extends Component {
  isOptionCanSelect = e => {
    e.stopPropagation();
  };

  onOpenClassClick = (id, eduCourseId) => {
    const { value } = this.props;
    window.open(`page/educlass#/detail/${id}/${eduCourseId}/${value.kdtId}`);
  }

  render() {
    const { value } = this.props;
    return (
      <div
        onClick={e => this.isOptionCanSelect(e)}
        className='course-dropdown-option'
      >
        <div>
          <div className="course-dropdown-classname">{value.eduClassName.length < 15 ? value.eduClassName : `${value.eduClassName.slice(0, 15)}..`}</div>
          {ShowWrapper({
            children: <div className='course-dropdown-shopname'>{value.shopName || ''}</div>,
            isInStoreCondition: isInStoreCondition({
              supportEduHqStore: true,
            }),
          })}
        </div>
        <span className={ isInStoreCondition({
          supportEduHqStore: true,
        }) ? 'course-dropdown-hq-operator' : 'course-dropdown-single-operator'}>
          {helpPopupTips(helpContent[value.type > 3 ? 0 : value.type - 1])}
          <a style={{ paddingLeft: '4px' }} href="javascript:;" onClick={() => this.onOpenClassClick(value.id, value.eduCourseId)}>查看</a>
        </span>
      </div>
    );
  }
}

export default PopupTips;
