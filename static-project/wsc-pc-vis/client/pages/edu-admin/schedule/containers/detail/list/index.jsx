import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import YZLocalStorage from 'zan-utils/local_storage';
import Head from './Head';
import List from './List';
import NoticeDialog from '@ability-center/schedule/student-reminder-dialog';

import openStudentSelect from '../../../components/open-student-select';

class ListDetail extends PureComponent {
  state = {
    signInStatus: '',
  };

  childRef = dom => {
    this.dom = dom;
  };

  isFirstNotice = () => {
    const isFirstVisitStudent = YZLocalStorage.getItem(`student_first-visit_${_global.kdtId}`);
    if (isFirstVisitStudent !== 'false') {
      return true;
    }
    return false;
  }

  render() {
    const { lessonNo, profile = {}, statistics, settings, kdtId } = this.props;
    const { signInStatus } = this.state;
    return (
      <div>
        <Head
          lessonNo={lessonNo}
          data={statistics}
          selected={signInStatus}
          onSelected={this.handleSignInStatusChange}
          onAdd={this.handleStudentAdd}
          isTrial={profile.isTrial}
          kdtId={kdtId}
        />
        <List
          lessonNo={lessonNo}
          kdtId={kdtId}
          profile={profile}
          settings={settings}
          childRef={this.childRef}
          zanQueries={{ signInStatus }}
          onAdd={this.handleStudentAdd}
          afterSignIn={this.afterAction}
        />
        <NoticeDialog
          isFirstVisit={this.isFirstNotice()}
        />
      </div>
    );
  }

  afterAction = () => {
    this.dom.refetchData.refresh();
    this.props.afterAction();
  };

  handleSignInStatusChange = signInStatus => {
    this.setState({ signInStatus });
  };

  handleStudentAdd = () => {
    const { lessonNo, profile, kdtId } = this.props;
    openStudentSelect(lessonNo, profile, this.afterAction, kdtId);
  };
}

export default withRouter(ListDetail);
