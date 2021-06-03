import React, { Component } from 'react';
import { Button, Notify, BlockLoading, Dialog } from 'zent';
import { hashHistory } from 'react-router';
import PropTypes from 'prop-types';
import set from 'lodash/set';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import uuid from 'uuid';

import DragSelect from '../components/drag-select';
import Preview from '../components/preview';
import Card from '../components/card';
import WrapFooter from '../components/wrap-footer';
import FormWrap from './TitleSettingForm';

import { formatTitleDataToForm, formatTitleDataToQuery, canShowFactoryHOC } from '../utils';
import { chainSupportHqAndSingle, chainSupportBranch } from '../chain';

import { TITLE_FORM_DATA } from '../constants';

import { getTitle, saveTitle, updateTitle, examHasParticipant } from '../api';

const { openDialog, closeDialog } = Dialog;

const PreviewCanShow = canShowFactoryHOC(Preview);

const _uniqueKeyName = 'title_name_';
let wrappedForm = null;
class TitleSetting extends Component {
  static childContextTypes = {
    submitLoading: PropTypes.bool,
  };

  state = {
    loading: /edit/.test(this.props.route.path),
    isEdit: /edit/.test(this.props.route.path),
    submitLoading: false,
    titleIndex: -1,
    titleCount: 0, // 题目的数量
    examId: +this.props.location.query.id || 0,
    formData: [],
    deleteItemIdList: [], // 删除的选项 id 列表
    deleteQuestionIdList: [], // 删除的题目 id 列表
    backgroundPic: {}, // 全局的背景图
    nextQuestionMenuPic: {}, // 下一题背景图
    title: '', // 设置的测试标题
    hasParticipant: false, // 测验是否有人参与
  };

  getChildContext() {
    return {
      submitLoading: this.state.submitLoading,
    };
  }

  componentDidMount() {
    const { examId, isEdit } = this.state;

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

  getDetail = () => {
    const { examId } = this.state;
    const req = {
      examId,
    };

    getTitle(req)
      .then(
        ({
          questionList: res,
          questionCount: titleCount,
          backgroundPic = {},
          title = '',
          nextQuestionMenuPic = {},
        } = {}) => {
          let formData;
          const storage = localStorage.getItem('TitleSetting');
          if (Array.isArray(res) && res.length) {
            formData = formatTitleDataToForm(res);
            this.setState({
              formData,
              titleCount,
              titleIndex: 0,
              backgroundPic,
              title,
              nextQuestionMenuPic,
            });
            if (storage && storage.length > 0 && !isEqual(formData, JSON.parse(storage))) {
              this.openStorageDialog('TitleSetting', storage);
            }
          } else if (storage && storage.length > 0) {
            this.openStorageDialog('TitleSetting', storage);
          } else {
            this.setState({
              backgroundPic,
              title,
              nextQuestionMenuPic,
            });
          }
        },
      )
      .catch(msg => {
        Notify.error(msg);
      })
      .finally(() => {
        this.setState({
          loading: false,
        });
      });
  };

  openStorageDialog = (name, storage) => {
    const id = uuid.v4();
    const recoverStorage = () => {
      this.setState({ formData: JSON.parse(storage), titleIndex: 0 }, closeDialog(id));
    };
    const clearStorage = () => {
      closeDialog(id);
      localStorage.removeItem(name);
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

  handleFieldChange = (name, value) => {
    const { titleIndex, formData } = this.state;
    const changedValue = value.data;

    const formDataCopy = Object.assign([], formData);
    const changedValueCopy = cloneDeep(changedValue);
    const currFormData = formDataCopy[titleIndex];

    // 编辑的是选项并且单选
    if (name === 'itemList' && +currFormData.questionType === 1) {
      if (+get(changedValueCopy, `[${value.index}].score`) === 1) {
        changedValueCopy.forEach((item, itemIndex) => {
          if (itemIndex !== value.index) {
            item.score = -1;
          }
        });
      }
    }

    // 根据 name 将对应的字段重新赋值
    set(formDataCopy[titleIndex], name, changedValueCopy);

    this.setState({
      formData: formDataCopy,
    });
  };

  handleSelectTitleList = index => {
    const mainProcess = () => {
      this.setState({
        titleIndex: index,
      });
    };

    if (wrappedForm) {
      wrappedForm.wrappedForm.$validateForm(isValid => {
        if (isValid) {
          mainProcess();
        } else {
          Notify.error('须填写完当前题目才可以切换题目哦');
        }
      });
    } else {
      mainProcess();
    }
  };

  handleDragChange = ({ list, index }) => {
    this.setState({
      formData: list,
      titleIndex: index,
    });
  };

  handleDeleteTitle = (index, data) => {
    if (chainSupportHqAndSingle) {
      const { titleIndex, formData, deleteQuestionIdList } = this.state;
      const formDataCopy = Object.assign([], formData);
      formDataCopy.splice(index, 1);

      const newdeleteQuestionIdList = data.id
        ? [...deleteQuestionIdList, data.id]
        : deleteQuestionIdList;

      let prevTitleIndex = titleIndex - 1 < 0 ? 0 : titleIndex - 1;
      formDataCopy.length === 0 && (prevTitleIndex = -1);

      this.setState({
        formData: formDataCopy,
        titleIndex: prevTitleIndex,
        deleteQuestionIdList: newdeleteQuestionIdList,
      });
    }
  };

  handleDeleteItem = (index, data) => {
    const { deleteItemIdList } = this.state;
    const newDeleteItemIdList = data.id ? [...deleteItemIdList, data.id] : deleteItemIdList;
    this.setState({
      deleteItemIdList: newDeleteItemIdList,
    });
  };

  handleAddTitle = type => {
    const mainProcess = () => {
      const { formData, titleIndex } = this.state;
      const formDataCopy = cloneDeep(formData);
      const newTitle = formatTitleDataToForm(TITLE_FORM_DATA);

      newTitle.questionType = type;
      newTitle.uniqId = `${_uniqueKeyName}${uuid.v4()}`; // 用于空数据列表的 key
      formDataCopy.splice(titleIndex + 1, 0, newTitle);

      this.setState({
        formData: formDataCopy,
        titleIndex: titleIndex + 1,
      });
    };

    const { titleIndex } = this.state;

    if (titleIndex >= 198) {
      Notify.error('最多可以添加200个题目');
      return;
    }

    if (wrappedForm) {
      wrappedForm.wrappedForm.$validateForm(isValid => {
        if (isValid) {
          mainProcess();
        } else {
          Notify.error('须填写完当前题目才可以新建新的题目哦');
        }
      });
    } else {
      mainProcess();
    }
  };

  handleSubmit = data => {
    const { examId, deleteQuestionIdList, deleteItemIdList, isEdit } = this.state;
    const formatData = formatTitleDataToQuery(this.state.formData, { examId });

    const queryData = {
      questionList: formatData,
      examId,
      deleteItemIdList,
      deleteQuestionIdList,
    };

    this.setState({
      submitLoading: true,
    });
    const methodName = isEdit ? updateTitle : saveTitle;
    methodName(queryData)
      .then(res => {
        const url = isEdit ? `/edit?step=3&id=${examId}` : `/add?step=3&id=${examId}`;
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
      hashHistory.push(`/edit?step=3&id=${examId}`);
    } else {
      if (wrappedForm) {
        const wrapForm = wrappedForm.getWrappedForm();
        const isValid = wrappedForm.isValid();
        if (isValid) {
          localStorage.removeItem('TitleSetting');
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
        Notify.error('当前题目信息有误，请完成后再试');
      } else {
        localStorage.setItem('TitleSetting', JSON.stringify(formData));
        hashHistory.push(`/exam/edit?step=1&id=${examId}`);
      }
    } else {
      hashHistory.push(`/exam/edit?step=1&id=${examId}`);
    }
  };

  render() {
    const { formData, titleIndex, loading, backgroundPic,
      title, nextQuestionMenuPic, hasParticipant, isEdit } = this.state;
    const { location } = this.props;

    const unchangable = isEdit && hasParticipant; // 测验部分项不可被修改

    return (
      <BlockLoading loading={loading}>
        <div className="exam-overflow-container">
          <div>
            <Button
              disabled={!chainSupportHqAndSingle || unchangable}
              onClick={() => {
                this.handleAddTitle(1);
              }}
            >
              新建单选题
            </Button>
            <Button
              disabled={!chainSupportHqAndSingle || unchangable}
              onClick={() => {
                this.handleAddTitle(2);
              }}
            >
              新建多选题
            </Button>
          </div>

          <DragSelect
            className="exam__drag-select"
            current={titleIndex}
            placeholder="快去新建题目吧"
            onSelect={this.handleSelectTitleList}
            onChange={this.handleDragChange}
            onDelete={this.handleDeleteTitle}
            sort={!unchangable}
            removable={!unchangable}
            items={formData.map((item, index) => {
              const concatItem = {
                ...item,
                dragCardTitle: item.description,
                dragCardIndex: `第${index + 1}题`,
                dragCardExtra: item.questionType === 1 ? '单选题' : '多选题',
                dragCardKey: item.id || item.uniqId,
              };
              return {
                ...concatItem,
                dragCardRender() {
                  return <Card data={concatItem} index={index} current={titleIndex} />;
                },
              };
            })}
          />

          <PreviewCanShow
            canShow={formData.length}
            type={2}
            index={titleIndex}
            value={formData}
            backgroundPic={backgroundPic}
            nextQuestionMenuPic={nextQuestionMenuPic}
            title={title}
          >
            <FormWrap
              ref={instant => {
                wrappedForm = instant;
              }}
              onFieldChange={this.handleFieldChange}
              onDeleteItem={this.handleDeleteItem}
              onSubmit={this.handleSubmit}
              formData={formData[titleIndex]}
              titleIndex={titleIndex}
              unchangable={unchangable}
              isEdit={isEdit}
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

export default TitleSetting;
