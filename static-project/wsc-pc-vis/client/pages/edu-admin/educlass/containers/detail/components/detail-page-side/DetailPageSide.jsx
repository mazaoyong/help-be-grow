import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Icon, Notify } from 'zent';
import { Link as SamLink } from '@youzan/sam-components';
// import EduClassDialog from '../../../../components/dialog-edu-class';
import EduClassStatusTag from '../../../../components/tag-edu-class-status';
import DescLine from './DescLine';

import { getClassDetail } from '../../../../api';
import { getEduClassStatus } from '../../../../utils';
import { EDU_CLASS_STATUS_TEXT } from '../../../../constants';
import { arrayColumnWrapper } from 'fns/chain';
import formatDate from 'zan-utils/date/formatDate';
import { chainSupportOnlyHq } from '../../../../chain';
import { EduClassNewDialog } from '../../../../../../new-dialogs';

class DetailPageSide extends Component {
  state = {
    eduClassInfo: {},
  };

  constructor(props) {
    super(props);
    const { getInstance } = props;
    if (typeof getInstance === 'function') {
      getInstance(this); // 在这里把this暴露给`parentComponent`
    }
  }

  editEduClass = () => {
    const { eduClassInfo } = this.state;
    EduClassNewDialog.open('编辑班级', { defaultData: eduClassInfo, callback: this.getEduClassDetail });
  };

  getEduClassInfo = () => {
    return this.state.eduClassInfo;
  };

  getEduClassDetail = () => {
    const { params = {} } = this.props;
    getClassDetail({
      id: params.eduClassId,
      kdtId: params.kdtId,
    })
      .then(data => {
        this.setState({ eduClassInfo: data || {} });
      })
      .catch(error => {
        Notify.error(error);
      });
  };

  formatEduClassDetail = () => {
    const { eduClassInfo } = this.state;
    const { eduClass = {}, classStat = {} } = eduClassInfo;
    return [
      {
        name: '所属课程',
        value: eduClass.eduCourseName,
      },
      {
        name: '上课校区',
        value: eduClass.shopName,
        chainState: chainSupportOnlyHq,
      },
      {
        name: '班级人数',
        value: classStat.currentStuNum,
      },
      {
        name: '人数上限',
        value: eduClass.maxStuNum,
      },
      {
        name: '已排课数',
        value: classStat.planLessonNum,
      },
      {
        name: '上课次数',
        value: classStat.endLessonNum,
      },
      {
        name: '开班时间',
        value: formatDate(eduClass.startTime, 'YYYY-MM-DD'),
      },
      {
        name: '结班时间',
        value: formatDate(eduClass.endTime, 'YYYY-MM-DD'),
      },
    ];
  };

  componentDidMount() {
    this.getEduClassDetail();
  }

  render() {
    const {
      eduClassInfo: { eduClass = {} },
    } = this.state;
    const eduClassDetail = arrayColumnWrapper(this.formatEduClassDetail());
    const eduClassStatus = getEduClassStatus(eduClass.startTime, eduClass.endTime);

    return (
      <div className="detail-page-side">
        <div className="detail-page-side-top">
          <span className="detail-page-side-top__title">{eduClass.eduClassName}</span>
          {!!(eduClassStatus && eduClassStatus !== 'DONE') && (
            <SamLink className="detail-page-side-top__title-edit" onClick={this.editEduClass}>
              <Icon type="edit-o" className="detail-page-side-top__title-edit-icon" />
              <span>编辑</span>
            </SamLink>
          )}
        </div>
        <div className="detail-page-side-status">
          <EduClassStatusTag type="primary">
            {EDU_CLASS_STATUS_TEXT[eduClassStatus]}
          </EduClassStatusTag>
        </div>
        <div className="detail-page-side-detail">
          {eduClassDetail.map((item, index) => {
            return <DescLine key={index} label={item.name} value={item.value} />;
          })}
        </div>
      </div>
    );
  }
}

export default withRouter(DetailPageSide, { withRef: true });
