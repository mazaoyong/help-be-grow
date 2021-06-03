import React, { PureComponent, Component } from 'react';
import { Dialog, Notify } from 'zent';
import { Button as SamButton } from '@youzan/sam-components';
import { hashHistory } from 'react-router';
import EduCourseEditForm from './components/educourse-editform';
import { createEduCourse, updateEduCourse, getByIdV2 } from '../api/educourse';
import { assign, get } from 'lodash';
import { ScheduleNewDialog } from '../../new-dialogs';
import './style/edit-page.scss';

import { onOpenLockDialogClick, LockType } from '@youzan/ebiz-components/es/lock-wrap/';
import { getRiskLock } from '../api/risk-lock';

const { openDialog, closeDialog } = Dialog;

export default class EduCourseEdit extends (PureComponent || Component) {
  constructor(props) {
    super(props);
    this.eduCourseId = null;
    this.state = {
      model: {
        eduCourseName: '',
        eduCourseType: 1,
        courseSuitAge: {
          minApply: '',
          maxApply: '',
          applyType: 0,
        },
        shopInfo: {
          applicableCampusList: [],
          applicableCampusType: 0,
        },
      },
      isRiskLock: false,
      loading: /edit/.test(props.route.path),
      isEdit: /edit/.test(props.route.path),
    };
  }

  componentDidMount() {
    const { params } = this.props;
    if (this.state.isEdit && params.id) {
      this.eduCourseId = parseInt(params.id);
      getByIdV2({ eduCourseDetailQuery: { id: this.eduCourseId } })
        .then(data => {
          this.initPage(data);
        })
        .catch(err => {
          Notify.error(err || '获取课程信息失败');
        });
    }
    getRiskLock()
      .then(data => {
        const onoff = get(data, 'onoff');
        if (+onoff === 1) {
          this.setState({ isRiskLock: true });
        }
      })
      .catch(error => Notify(error));
  }

  initPage = data => {
    const { minApply, maxApply, applyType, name, teachType, applicableCampusList, applicableCampusType } = data;
    let model = assign({}, this.state.model, {
      eduCourseName: name,
      eduCourseType: teachType,
      courseSuitAge: {
        minApply: minApply === 10000 ? '' : minApply, // 特殊情况，记录不填的值
        maxApply: maxApply === 10000 ? '' : maxApply,
        applyType,
      },
      shopInfo: {
        applicableCampusList,
        applicableCampusType,
      },
    });

    this.setState({
      model,
      loading: false,
    });
  };

  openPage = url => {
    window.open(url);
  };

  getEduClassParams = search => {
    return search !== '';
  };

  onAgeRangeChange = data => {
    let model = assign({}, this.state.model, { courseSuitAge: data });
    this.setState({
      model,
    });
  };

  submitFormData = data => {
    const { courseSuitAge, eduCourseName, eduCourseType, shopInfo } = data;
    let command = {
      maxApply: courseSuitAge.maxApply !== '' ? courseSuitAge.maxApply : null,
      name: eduCourseName,
      minApply: courseSuitAge.minApply !== '' ? courseSuitAge.minApply : null,
      applyType: courseSuitAge.applyType,
    };
    if (shopInfo) {
      command['applicableCampusList'] = shopInfo.applicableCampusList.map(item => ({ shopName: item.shopName, kdtId: item.kdtId }));
      command['applicableCampusType'] = shopInfo.applicableCampusType;
    }
    if (this.state.isEdit && this.eduCourseId) {
      command['id'] = this.eduCourseId;
      return updateEduCourse({ command });
    } else {
      command['teachType'] = eduCourseType;
      return createEduCourse({ command });
    }
  };

  onChange = (data) => {}

  handleSave = data => {
    if (this.state.isEdit || this.getEduClassParams(this.props.location.search)) {
      this.submitFormData(data).then(res => {
        hashHistory.push('list');
      }).catch(e => {
        Notify.error(e);
      });
    } else {
      const _this = this;
      this.submitFormData(data)
        .then(res => {
          openDialog({
            dialogId: 'eduCourseDialog',
            title: '提示',
            children: (
              <>
                <p>
                  新建成功。该课程还没有排课，可以直接对课程排课生成课程表，
                </p>
                <p>
                  也可直接发布线上售卖，快速展开招生。
                </p>
              </>
            ),
            footer: (
              <div>
                <SamButton type='primary' outline
                  onClick={() => {
                    closeDialog('eduCourseDialog');
                  }}
                >
                  暂不设置
                </SamButton>
                <SamButton name='编辑' type='primary' outline
                  onClick={onOpenLockDialogClick(this.state.isRiskLock, LockType.COURSE_SHOP, () => {
                    _this.openPage(
                      `https://www.youzan.com/v4/vis/edu/course#/course-manage/add?eduCourseId=${
                        res.id
                      }&eduCourseName=${res.name}`,
                    );
                    closeDialog('eduCourseDialog');
                  })
                  }
                >
                  发布线上售卖
                </SamButton>
                <SamButton name='编辑' type='primary'
                  onClick={() => {
                    closeDialog('eduCourseDialog');
                    ScheduleNewDialog.open('新建日程', {
                      query: {
                        eduCourseId: res.id,
                      },
                    });
                  }}
                >
                  去排课
                </SamButton>
              </div>
            ),
            onClose() {
              hashHistory.push('list');
            },
          });
        })
        .catch(err => {
          Notify.error(err);
        });
    }
  };

  render() {
    const { model, loading, isEdit } = this.state;
    return (
      <div>
        <div className="educourse-tips-panel">
          <div className="educourse-tips-content">
            <p className="educourse-title">课程</p>
            <div className="educourse-content">
              <p >
                课程可以设置线下课程的适用年龄，设置完后可以发布到线上售卖、排课、分班等。
              </p>
              <p>
                用于教育机构内部排课管理，排课后会生成机构的课程表。
              </p>
            </div>
          </div>
          <SamButton className='educourse-knowmore' type="primary" outline onClick={() => this.openPage('https://help.youzan.com/displaylist/detail_13_13-2-45070')}>
            了解更多
          </SamButton>
        </div>
        <EduCourseEditForm
          {...model}
          loading={loading}
          id={this.eduCourseId}
          isEdit={isEdit}
          className="educourse-editform-wrap"
          onChange={this.onChange}
          handleSave={this.handleSave.bind(this)}
        />
      </div>
    );
  }
}
