import React, { PureComponent, Component } from 'react';
import { Button as SamButton } from '@youzan/sam-components';
import { hashHistory } from 'react-router';
import EduCourseForm from './components/educourse-listform';
import { isInStoreCondition, ShowWrapper } from 'fns/chain';
import VersionWrapper from 'fns/version';
import './style/list-page.scss';

import { getRiskLock } from '../api/risk-lock';
import get from 'lodash/get';
import { Notify } from 'zent';
export default class EduCourseList extends (PureComponent || Component) {
  constructor(props) {
    super(props);
    this.state = {
      isRiskLock: false
    };
  }
  componentDidMount() {
    getRiskLock()
      .then(data => {
        const onoff = get(data, 'onoff');
        if (+onoff === 1) {
          this.setState({ isRiskLock: true });
        }
      })
      .catch(error => Notify(error));
  }
  onEduCourseEdit = id => {
    hashHistory.push(`edit/${id}`);
  };

  render() {
    const { isRiskLock } = this.state;
    return (
      <div>
        {ShowWrapper({ children: <div className="educourse-filter-panel">
          <VersionWrapper name='educourse-create-btn'>
            <SamButton name='编辑' onClick={() => hashHistory.push(`/add`)} type="primary">新建课程</SamButton>
          </VersionWrapper>
        </div>,
        isInStoreCondition: isInStoreCondition({
          supportEduHqStore: true,
          supportSingleStore: true,
        }),
        })}
        <EduCourseForm onEduCourseEdit={this.onEduCourseEdit} isRiskLock={isRiskLock} {...this.props} />
      </div>
    );
  }
}
