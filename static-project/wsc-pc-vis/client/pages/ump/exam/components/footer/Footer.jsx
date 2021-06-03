import React, { Component } from 'react';
import { Button } from 'zent';
import PropTypes from 'prop-types';
import { hashHistory } from 'react-router';

import { chainSupportBranch } from '../../chain';

import './style.scss';

class Footer extends Component {
  static propTypes = {
    first: PropTypes.number,
    last: PropTypes.number,
    step: PropTypes.number,
    onPrev: PropTypes.func,
    onNext: PropTypes.func,
    loading: PropTypes.bool,
    isHtmlType: PropTypes.bool,
  };

  handleNext = () => {
    const { isHtmlType, step } = this.props;
    console.log('on finish click', isHtmlType);
    if (isHtmlType && chainSupportBranch) {
      hashHistory.push('/list/0');
    }
    if (!isHtmlType) {
      this.props.onNext(step + 1);
    }
  };

  render() {
    const { first, last, step, loading, isHtmlType } = this.props;
    const isFirst = first === step;
    const isLast = last === step;
    const extraObj = {};

    isHtmlType && (extraObj.htmlType = 'submit');
    return (
      <div className="app-design exam-footer">
        <div className="app-actions">
          <div className="form-actions new-actions text-center">
            {!isFirst ? (
              <Button
                onClick={() => {
                  console.log('onprev');
                  this.props.onPrev(step - 1);
                }}
              >
                上一步
              </Button>
            ) : null}
            <Button type="primary" loading={loading} {...extraObj} onClick={this.handleNext}>
              {isLast ? '完成' : '下一步'}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default Footer;
