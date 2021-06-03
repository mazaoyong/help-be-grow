import { hashHistory } from 'react-router';
import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { Tabs } from 'zent';
import { isInStoreCondition } from 'fns/chain';

import StudentListTab from './container/student-list';
import AddStudent from './container/add-student';
import ApplyList from './container/apply-list';

import { LIST_TYPE } from './constant';

import './style.scss';

const TabPanel = Tabs.TabPanel;

const prefixcls = 'student-list';

class StudentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'student',
      category: '',
      learnStatus: 0
    };
  }

  componentDidMount() {
    this.removeClassToAppInner();
    const params = hashHistory.getCurrentLocation().query;
    if (params && Number(params.learnStatus)) {
      this.setState({
        learnStatus: params.learnStatus
      });
    }
    const { category } = this.props.location.query;
    this.setState({ category: category || '' }, () => {
      this.renderBreadcrumb();
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.category !== this.state.category) {
      this.renderBreadcrumb();
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { category } = props.location.query;
    if (category !== state.category) {
      return { category: category || '' };
    }
    return null;
  }

  renderBreadcrumb = () => {
    const navDom = document.getElementById('js-page-breadcrumb');
    const { category } = this.state;
    if (category) {
      const navs = (
        <>
          <a className='project' href='/v4/vis/edu/page/student#/list'>学员查询</a>
          <span className='page'>{LIST_TYPE[category].title}</span>
        </>
      );
      ReactDOM.render(navs, navDom);
    }
  }

  // 详情页app-inner上需要挂特殊样式
  removeClassToAppInner() {
    const appInner = document.querySelectorAll('.app-inner')[0];
    appInner.className = 'app-inner';
  }

  changeTab = (activeTab) => {
    this.setState({
      activeTab
    });
  };

  render() {
    const {
      category,
      activeTab,
      learnStatus
    } = this.state;

    return (
      <div className={prefixcls}>
        {!category &&
          isInStoreCondition({ supportEduBranchStore: true, supportEduSingleStore: true }) && (
          <div className={`${prefixcls}-add`}>
            <AddStudent />
          </div>
        )}
        <Tabs activeId={activeTab} onChange={this.changeTab}>
          <TabPanel tab={<span>花名册</span>} id="student">
            <StudentListTab category={category} learnStatus={learnStatus} />
          </TabPanel>
          <TabPanel tab={<span>报读列表</span>} id="apply">
            <ApplyList />
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}

export default hot(module)(StudentList);
