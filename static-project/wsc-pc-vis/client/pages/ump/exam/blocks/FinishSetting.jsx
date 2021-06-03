import React, { Component } from 'react';
import { Notify, BlockLoading } from 'zent';
import { hashHistory } from 'react-router';
import PropTypes from 'prop-types';
import set from 'lodash/set';
import isEmpty from 'lodash/isEmpty';

import Form from './FinishSettingForm';
import Preview from '../components/preview';
import { getFinish, saveFinish } from '../api';

import { formatFinishDataToForm, formatFinishDataToQuery } from '../utils';

import { FINISH_FORM_DATA } from '../constants';

class ResultSetting extends Component {
  static childContextTypes = {
    submitLoading: PropTypes.bool,
  };

  getChildContext() {
    return {
      submitLoading: this.state.submitLoading,
    };
  }

  state = {
    loading: /edit/.test(this.props.route.path),
    submitLoading: false,
    formData: FINISH_FORM_DATA,
    examId: +this.props.location.query.id || 0,
  };

  componentDidMount() {
    this.getDetail();
  }

  getDetail = () => {
    const req = {
      examId: this.state.examId,
    };
    getFinish(req)
      .then(res => {
        if (!isEmpty(res)) {
          const formData = formatFinishDataToForm(res);
          this.setState({
            formData,
          });
        }
      })
      .catch(msg => {
        Notify.error(msg);
      })
      .finally(() => {
        this.setState({
          loading: false,
        });
      });
  };

  handleSubmit = data => {
    const { formData, examId } = this.state;
    const queryData = formatFinishDataToQuery(formData, { examId });
    queryData.examId = examId;

    this.setState({
      submitLoading: true,
    });

    saveFinish(queryData)
      .then(res => {
        res && hashHistory.push('/list/0');
      })
      .catch(msg => {
        Notify.error(msg);
      });
  };

  handleFieldChange = (name, value) => {
    const { formData } = this.state;
    const changedValue = value.data;

    // 根据 name 将对应的字段重新赋值
    set(formData, name, changedValue);

    this.setState({
      formData,
    });
  };

  render() {
    const { formData, loading } = this.state;
    return (
      <BlockLoading loading={loading}>
        <div className="exam-finish-wrap">
          <Preview type={4} value={formData} title={formData.title}>
            <Form
              onSubmit={this.handleSubmit}
              onFieldChange={this.handleFieldChange}
              formData={formData}
              {...this.props}
            />
          </Preview>
        </div>
      </BlockLoading>
    );
  }
}

export default ResultSetting;
