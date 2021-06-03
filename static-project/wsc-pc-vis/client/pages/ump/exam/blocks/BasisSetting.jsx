import React, { Component } from 'react';
import { Notify, BlockLoading } from 'zent';
import { hashHistory } from 'react-router';
import PropTypes from 'prop-types';

import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';

import Form from './BasisSettingForm';
import Preview from '../components/preview';
import WrapFooter from '../components/wrap-footer';

import { formatBasisDataToForm, formatBasisDataToQuery } from '../utils';
import { BASIS_FORM_DATA } from '../constants';
import { getBasis, saveBasis, examHasParticipant } from '../api';
import { chainSupportBranch } from '../chain';

let wrappedForm = null;
class BasisSetting extends Component {
  static childContextTypes = {
    submitLoading: PropTypes.bool,
  };

  getChildContext() {
    return {
      submitLoading: this.state.submitLoading,
    };
  }

  state = {
    formData: formatBasisDataToForm(BASIS_FORM_DATA),
    examId: this.props.location.query.id || 0,
    loading: /edit/.test(this.props.route.path),
    isEdit: /edit/.test(this.props.route.path),
    hasParticipant: false,
  };

  componentDidMount() {
    const { examId, isEdit } = this.state;

    if (examId > 0) {
      this.getDetail();

      if (isEdit) {
        // 判断小测验是否有人参与
        examHasParticipant({ examId })
          .then(res => {
            this.setState({ hasParticipant: res });
          })
          .catch(err => {
            Notify.error(err || '网络错误');
          });
      }
    }
  }

  getDetail = () => {
    const { examId } = this.state;
    const req = {
      id: examId || 0,
      examState: 0,
    };
    getBasis(req)
      .then(res => {
        if (res) {
          this.setState({
            formData: formatBasisDataToForm(res),
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

  onChange = data => {
    if (+data.style !== +this.state.formData.style) {
      this.setState({
        formData: data,
      });
    }
  };

  handleFieldChange = (name, value) => {
    const { formData } = this.state;
    const changedValue = value.data;

    const formDataCopy = cloneDeep(formData);
    // 根据 name 将对应的字段重新赋值
    set(formDataCopy, name, changedValue);

    this.setState({
      formData: formDataCopy,
    });
  };

  handleSubmit = data => {
    const { examId, isEdit } = this.state;
    const formatData = formatBasisDataToQuery(data, { examId });
    this.setState({
      submitLoading: true,
    });

    saveBasis(formatData)
      .then(res => {
        const url = isEdit ? `/edit?step=2&id=${res}` : `/add?step=2&id=${res}`;
        res && hashHistory.push(url);
      })
      .catch(err => {
        Notify.error(err || '网络错误');
      })
      .finally(() => {
        this.setState({
          submitLoading: false,
        });
      });
  };

  handleNext = () => {
    const { examId } = this.state;
    if (chainSupportBranch) {
      hashHistory.push(`/edit?step=2&id=${examId}`);
    } else {
      if (wrappedForm) {
        const wrapForm = wrappedForm.getWrappedForm();
        wrapForm.submit();
      }
    }
  };

  render() {
    const { formData = {}, loading, isEdit, examId, hasParticipant } = this.state;
    const { location } = this.props;
    const unchangable = isEdit && hasParticipant;
    return (
      <div className="exam-overflow-container">
        {loading ? (
          <BlockLoading loading={true} />
        ) : (
          <span>
            <Preview type={1} value={formData} title={formData.title || ''}>
              <Form
                ref={instant => {
                  wrappedForm = instant;
                }}
                formData={formData}
                isEdit={isEdit}
                id={examId}
                onFieldChange={this.handleFieldChange}
                onSubmit={this.handleSubmit}
                unchangable={unchangable}
                {...this.props}
              />
            </Preview>
            <WrapFooter
              step={+location.query.step}
              id={+location.query.id}
              onNext={this.handleNext}
            />
          </span>
        )}
      </div>
    );
  }
}

export default BasisSetting;
