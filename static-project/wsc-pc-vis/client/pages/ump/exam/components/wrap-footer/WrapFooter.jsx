import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import Footer from '../footer';
import Proptypes from 'prop-types';

export default class WrapFooter extends Component {
  static propTypes = {
    step: Proptypes.number,
    id: Proptypes.number,
    onPrev: Proptypes.func,
    onNext: Proptypes.func,
    isHtmlType: Proptypes.bool,
  };

  static contextTypes = {
    submitLoading: Proptypes.bool,
  };

  hendlePrev = step => {
    const { id, onPrev } = this.props;
    console.log('onprev');
    if (onPrev) {
      onPrev();
    } else {
      hashHistory.push(`/exam/edit?step=${step}&id=${id}`);
    }
  };

  handleNext = step => {
    this.props.onNext();
  };

  render() {
    const { step, isHtmlType } = this.props;
    return (
      <Footer
        first={1}
        last={4}
        step={step}
        onPrev={this.hendlePrev}
        onNext={this.handleNext}
        loading={this.context.submitLoading}
        isHtmlType={isHtmlType}
      />
    );
  }
}
