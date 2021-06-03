import React, { Component } from 'react';
import { Button, Checkbox, Notify, BlockLoading, Dialog } from 'zent';
import { hashHistory } from 'react-router';
import PropTypes from 'prop-types';
import set from 'lodash/set';
import cloneDeep from 'lodash/cloneDeep';
import uuid from 'uuid';

import Form from './ResultSettingForm';
import Preview from '../components/preview';
import DragSelect from '../components/drag-select';
import WrapFooter from '../components/wrap-footer';

import {
  formatResultDataToForm,
  formatResultDataToQuery,
  canShowFactoryHOC,
  tryCatch,
  updateNewHighPoint,
  isEqualWithoutConditions,
} from '../utils';

import { RESULT_FORM_DATA } from '../constants';
import { chainSupportHqAndSingle, chainSupportBranch } from '../chain';

import { getResult, saveResult, updateResult, examHasParticipant } from '../api';

const PreviewCanShow = canShowFactoryHOC(Preview);

const { openDialog, closeDialog } = Dialog;

let _uniqueKey = 0;
const _uniqueKeyName = 'result_name_';
let wrappedForm = null;
const dialogId = 'check_result';

class ResultSetting extends Component {
  static childContextTypes = {
    submitLoading: PropTypes.bool,
  };

  state = {
    loading: /edit/.test(this.props.route.path),
    isEdit: /edit/.test(this.props.route.path),
    submitLoading: false,
    resultIndex: 0,
    titleCount: 0,
    formData: [],
    examId: +this.props.location.query.id || 0,
    deleteResultIdList: [],
    shareResult: true,
    title: '',
    hasParticipant: false,
  };

  getChildContext() {
    return {
      submitLoading: this.state.submitLoading,
    };
  }

  componentDidMount() {
    const { examId, isEdit } = this.state;

    this.getResultDetail();

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

  getResultDetail = () => {
    const req = {
      examId: this.state.examId,
    };
    getResult(req)
      .then(({ resultList: res, questionCount: titleCount, title }) => {
        let formData;
        if (Array.isArray(res) && res.length) {
          formData = formatResultDataToForm(res);

          const display = (formData[0] || {}).display;
          const shareResult = typeof display === 'undefined' ? true : !!display;

          this.setState({
            formData,
            titleCount,
            shareResult,
            title,
          });
        } else {
          this.setState({
            titleCount,
            title,
          });
        }
        const storage = localStorage.getItem('ResultSetting');
        if (storage && storage.length > 0 && !isEqualWithoutConditions(formData, JSON.parse(storage))) {
          const id = uuid.v4();
          const recoverStorage = () => {
            this.setState({ formData: JSON.parse(storage) }, closeDialog(id));
          };
          const clearStorage = () => {
            closeDialog(id);
            localStorage.removeItem('ResultSetting');
          };
          openDialog({
            dialogId: id,
            children: <div>有未提交的数据，是否需要恢复？</div>,
            footer: <>
              <Button type="primary" onClick={recoverStorage}>是</Button>
              <Button onClick={clearStorage}>否</Button>
            </>,
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

  getCheckFitResultRule = () => {
    const { formData = [] } = this.state;
    const resultLen = formData.length;
    const lastIndexResult = formData[resultLen - 1];
    const lastResultLowPoint = tryCatch(() => {
      return JSON.parse(lastIndexResult.conditions).lowPoint;
    });

    return +lastResultLowPoint;
  };

  handleFieldChange = (name, value) => {
    const { resultIndex, formData } = this.state;
    const changedValue = value.data;

    // number index 有问题 所以这样兼容
    const indexFromField = value.index;

    const formDataCopy = cloneDeep(formData);
    // 根据 name 将对应的字段重新赋值
    set(
      formDataCopy[typeof indexFromField !== 'undefined' ? indexFromField : resultIndex],
      name,
      changedValue,
    );

    this.setState({
      formData: formDataCopy,
    });
  };

  handleDisplayChange = ev => {
    this.setState({
      shareResult: !ev.target.checked,
    });
  };

  handleSelectTitleList = index => {
    const mainProcess = () => {
      this.setState({
        resultIndex: index,
      });
    };

    if (wrappedForm) {
      wrappedForm.wrappedForm.$validateForm(isValid => {
        if (isValid) {
          mainProcess();
        }
      });
    } else {
      mainProcess();
    }
  };

  handleDeleteTitle = (index, data) => {
    if (chainSupportHqAndSingle) {
      const { deleteResultIdList, formData, resultIndex } = this.state;

      if (index < formData.length - 1) {
        return Notify.error('只允许从最后一项开始删除');
      }
      const formDataCopy = Object.assign([], formData);
      formDataCopy.splice(index, 1);

      const newdeleteResultIdList = data.id ? [...deleteResultIdList, data.id] : deleteResultIdList;

      let prevResultIndex = resultIndex - 1 < 0 ? 0 : resultIndex - 1;
      formDataCopy.length === 0 && (prevResultIndex = -1);

      this.setState({
        formData: formDataCopy,
        deleteResultIdList: newdeleteResultIdList,
        resultIndex: prevResultIndex,
      });
    }
  };

  handleAddResult = () => {
    const { resultIndex, formData } = this.state;

    // 计算当前的最低值是不是0，如果为0 不允许新增
    const lowPoint = tryCatch(() => {
      return JSON.parse(formData[resultIndex].conditions).lowPoint;
    });

    const mainProcess = () => {
      const { formData } = this.state;
      const NEW_RESULT_FORM_DATA = Object.assign({}, RESULT_FORM_DATA);
      if (lowPoint > 1) {
        // 如果当前的最低值n大于1，则新建的最高值应从n-1开始。
        Object.assign(NEW_RESULT_FORM_DATA, updateNewHighPoint(RESULT_FORM_DATA, lowPoint));
      };
      const newData = formatResultDataToForm(lowPoint > 1 ? NEW_RESULT_FORM_DATA : RESULT_FORM_DATA);
      const newFormData = [...formData, newData];
      const nextResultIndex = newFormData.length - 1;
      this.setState({
        formData: newFormData,
        resultIndex: nextResultIndex,
      });
    };

    if (wrappedForm) {
      wrappedForm.wrappedForm.$validateForm(isValid => {
        if (isValid && +lowPoint !== 0) {
          mainProcess();
        }
        if (+lowPoint === 0) {
          Notify.error('结果区间已全部覆盖，无法添加结果');
        }
      });
    } else {
      mainProcess();
    }
  };

  handleSubmit = data => {
    const { formData, examId, deleteResultIdList, shareResult, isEdit } = this.state;

    // 提交前校验题目区间
    const lowPoint = this.getCheckFitResultRule();
    if (typeof lowPoint === 'number') {
      if (lowPoint !== 0) {
        const lowPointText = lowPoint - 1 === 0 ? '0' : `0~${lowPoint - 1}`;
        return openDialog({
          dialogId, // id is used to close the dialog
          children: `结果区间未全部覆盖，请填写共答对 ${lowPointText} 道题的结果`,
          footer: <Button onClick={() => closeDialog(dialogId)}>关闭</Button>,
        });
      }
    }

    const resultSaveList = formatResultDataToQuery(formData, { examId, shareResult });

    const queryData = {
      resultSaveList,
      examId,
      deleteResultIdList,
    };

    this.setState({
      submitLoading: true,
    });

    const methodName = isEdit ? updateResult : saveResult;
    methodName(queryData)
      .then(res => {
        const url = isEdit ? `/edit?step=4&id=${examId}` : `/add?step=4&id=${examId}`;
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
      hashHistory.push(`/edit?step=4&id=${examId}`);
    } else {
      if (wrappedForm) {
        const wrapForm = wrappedForm.getWrappedForm();
        const isValid = wrappedForm.isValid();
        if (isValid) {
          localStorage.removeItem('ResultSetting');
        }
        wrapForm.submit();
      }
    }
  };

  handlePrev = () => {
    const { examId, formData } = this.state;
    if (wrappedForm) {
      const isValid = wrappedForm.isValid();
      if (!isValid) {
        Notify.error('当前结果信息有误，请完成后再试');
      } else {
        localStorage.setItem('ResultSetting', JSON.stringify(formData));
        hashHistory.push(`/exam/edit?step=2&id=${examId}`);
      }
    } else {
      hashHistory.push(`/exam/edit?step=2&id=${examId}`);
    }
  };

  render() {
    const { formData, resultIndex, titleCount, loading, shareResult, title, hasParticipant, isEdit } = this.state;
    const { location } = this.props;
    const unchangable = isEdit && hasParticipant;
    return (
      <BlockLoading loading={loading}>
        <div className="exam-result-wrap exam-overflow-container">
          <div>
            <Button
              disabled={!chainSupportHqAndSingle || unchangable}
              onClick={this.handleAddResult}
            >
              新建测试结果
            </Button>
            <Checkbox
              className="exam-result-wrap__display-result-checkbox"
              checked={!shareResult}
              disabled={!chainSupportHqAndSingle}
              onChange={this.handleDisplayChange}
            >
              隐藏测试分数
            </Checkbox>
          </div>

          <DragSelect
            sort={false}
            className="exam__drag-select"
            current={resultIndex}
            placeholder="快去新建测试结果吧"
            onSelect={this.handleSelectTitleList}
            onDelete={this.handleDeleteTitle}
            items={formData.map((item, index) => {
              return {
                ...item,
                dragCardTitle: item.title,
                dragCardIndex: `测试结果${index + 1}`,
                dragCardExtra: '',
                dragCardKey: item.id || `${_uniqueKeyName}${_uniqueKey++}`,
              };
            })}
            removable={!unchangable}
          />

          <PreviewCanShow
            canShow={formData.length}
            type={3}
            index={resultIndex}
            value={formData}
            title={title}
            shareResult={shareResult}
          >
            <Form
              ref={instant => {
                wrappedForm = instant;
              }}
              onFieldChange={this.handleFieldChange}
              onSubmit={this.handleSubmit}
              formData={formData[resultIndex]}
              formDataList={formData}
              resultIndex={resultIndex}
              titleCount={titleCount}
              unchangable={unchangable}
              {...this.props}
            />
          </PreviewCanShow>
          <WrapFooter
            step={+location.query.step}
            id={+location.query.id}
            onNext={this.handleNext}
            onPrev={this.handlePrev}
          />
        </div>
      </BlockLoading>
    );
  }
}

export default ResultSetting;
