import React from 'react';
import { hashHistory } from 'react-router';
import { Notify } from 'zent';
import get from 'lodash/get';
import { Button as SamButton, Link as SamLink } from '@youzan/sam-components';
import { isInStoreCondition, ShowWrapper } from 'fns/chain';
import { onOpenLockDialogClick, LockType } from '@youzan/ebiz-components/es/lock-wrap/';
import { getRiskLock } from '../api/risk-lock';
import CourseTable from './components/course-table';

import './styles/index.scss';

const ONOFF_MAP = {
  open: 1,
  close: 0,
};

class List extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      queries: {},
      isRiskLock: false,
    };
  }

  componentDidMount() {
    getRiskLock()
      .then(data => {
        const onoff = get(data, 'onoff');
        if (+onoff === ONOFF_MAP.open) {
          this.setState({ isRiskLock: true });
        }
      })
      .catch(error => Notify(error));
  }

  render() {
    const { isRiskLock } = this.state;
    return (
      <div className="course-manage__list">
        {ShowWrapper({ children: <section>
          <SamLink
            name='编辑'
            onClick={onOpenLockDialogClick(isRiskLock, LockType.COURSE_SHOP, () =>
              hashHistory.push(`/course-manage/add`),
            )}
          >
            <SamButton name='编辑' type="primary">发布线下课</SamButton>
          </SamLink>
        </section>,
        isInStoreCondition: isInStoreCondition({
          supportEduHqStore: true,
          supportSingleStore: true,
        }),
        })}
        <CourseTable location={location} isRiskLock={isRiskLock} />
      </div>
    );
  }
}

export default List;
