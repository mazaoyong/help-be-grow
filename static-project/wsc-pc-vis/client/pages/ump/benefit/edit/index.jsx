import React, { Component } from 'react';
import { Steps } from 'zent';
import BenefitForm from '../components/benefit-form';
import './style.scss';

export default class Edit extends Component {
  state = {
    step: 1,
  };
  onStepChange = step => {
    this.setState({
      step,
    });
  };
  render() {
    const { step } = this.state;
    const { benefitAlias } = this.props.routeParams;
    const { isFast } = this.props.location.query;
    return (
      <div className="content-form content-form__benefit-form">
        {!isFast ? (
          <Steps type="breadcrumb" current={step} sequence={false}>
            <Steps.Step title="1.创建权益包" />
            <Steps.Step title="2.关联会员卡" />
          </Steps>
        ) : null}
        <BenefitForm
          isFast={isFast}
          alias={benefitAlias}
          step={step}
          onStepChange={this.onStepChange}
          {...this.props}
        />
      </div>
    );
  }
}
