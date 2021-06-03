import React, { Component } from 'react';
import { Steps } from 'zent';
import BasisSetting from './blocks/BasisSetting';
import TitleSetting from './blocks/TitleSetting';
import ResultSetting from './blocks/ResultSetting';
import FinishSetting from './blocks/FinishSetting';

import { SETTING_STEPS } from './constants';

class EditFormEntry extends Component {
  state = {
    loading: /edit/.test(this.props.route.path),
  };

  handleWindowClose = (e) => {
    e.returnValue = true;
  };

  returnBasisSetting = () => {
    return <BasisSetting {...this.props} />;
  };

  returnTitleSetting = () => {
    return <TitleSetting {...this.props} />;
  };

  returnResultSetting = () => {
    return <ResultSetting {...this.props} />;
  };

  returnFinishSetting = () => {
    return <FinishSetting {...this.props} />;
  };

  returnCompoennt = () => {
    const componentName = SETTING_STEPS[this.props.location.query.step || '1'];
    return this[`return${componentName}`]();
  };

  componentDidMount() {
    window.addEventListener('beforeunload', this.handleWindowClose);
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.handleWindowClose);
  };

  render() {
    const { location } = this.props;

    return (
      <div>
        <Steps current={+location.query.step || 1} type="breadcrumb" className="exam-steps">
          <Steps.Step title="基本信息设置" />
          <Steps.Step title="题目设置" />
          <Steps.Step title="测试结果设置" />
          <Steps.Step title="完成" />
        </Steps>
        {this.returnCompoennt()}
      </div>
    );
  }
}

export default EditFormEntry;
