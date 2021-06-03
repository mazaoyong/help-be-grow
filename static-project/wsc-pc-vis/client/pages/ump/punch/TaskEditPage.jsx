
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import { BlockLoading, Checkbox, Button, Alert, Notify } from 'zent';
import merge from 'lodash/merge';
import has from 'lodash/has';
import switchBreadcrumb from 'fns/switch-breadcrumb';

import CoverField from 'components/field/cover';
import PunchDetailField from './components/punch-design';
import { TASK_CONTENT, TASK_CONTENT_ERROR, TASK_CONDITIONS } from './constants';

import { getPunchTaskAPI, updatePunchTaskAPI } from './api';

const { Field, FormInputField, createForm, FormCheckboxField, FormCheckboxGroupField } = Form;

class TaskEditForm extends Component {
  state = {
    loading: true,
    formData: {
      name: '',
      dayOffset: 1,
      taskContent: TASK_CONTENT,
      taskCondition: [],
      openDaySign: false,
      openDaySignQuotes: false,
      daySignQuotes: '', // 日签金句
    },
    daySignPic: '',
  };

  componentDidMount() {
    this.getPunchTask();
    switchBreadcrumb('设置任务', 'v4/vis/pct/page/tabs#/punch');
  }

  onDaySignChange = val => {
    this.setState({
      formData: merge({}, this.state.formData, { openDaySign: val }),
    });
  };

  onOpenDaySignQuotes = val => {
    this.setState({
      formData: merge({}, this.state.formData, { openDaySignQuotes: val }),
    });
  };

  save = data => {
    this.setState({
      loading: true,
    });

    data.taskContent = JSON.stringify(data.taskContent);

    if (data.taskCondition.length > 0) {
      data.taskCondition = data.taskCondition.reduce((pre, cur) => {
        return pre + cur;
      });
    } else {
      data.taskCondition = 0;
    }

    data.openDaySign = data.openDaySign ? 1 : 0;
    data.openDaySignQuotes = data.openDaySignQuotes ? 1 : 0;
    data.gciId = this.state.formData.gciId;
    data.id = this.props.params.id;

    updatePunchTaskAPI(data)
      .then(() => {
        Notify.success('更新成功！');
        hashHistory.goBack();
      })
      .catch(msg => {
        Notify.error(msg || '网络错误！');
      })
      .finally(() => {
        this.setState({
          loading: false,
        });
      });
  };

  // 获取打卡详情
  getPunchTask = () => {
    getPunchTaskAPI(this.props.params.id)
      .then(res => {
        if (has(res, 'taskContent')) {
          try {
            res.taskContent = JSON.parse(res.taskContent);
          } catch (error) {
            Notify.error('打卡详情解析失败');
            res.taskContent = TASK_CONTENT_ERROR;
          }
        } else {
          res.taskContent = TASK_CONTENT;
        }

        res.taskCondition = TASK_CONDITIONS[res.taskCondition];

        res.openDaySign = res.openDaySign !== 0;
        res.openDaySignQuotes = res.openDaySignQuotes !== 0;

        this.setState({
          formData: res,
        });
      })
      .catch(msg => {
        Notify.error(msg || '网络错误！');
      })
      .finally(() => {
        this.setState({
          loading: false,
        });
      });
  };

  render() {
    const { handleSubmit } = this.props;
    const {
      loading,
      formData: {
        name,
        taskContent,
        taskCondition,
        dayOffset,
        taskDate,
        openDaySign,
        openDaySignQuotes,
        daySignPic,
        daySignQuotes,
      },
    } = this.state;

    return (
      <BlockLoading loading={loading}>
        <div className="punch-task">
          <Alert className="punch-task__title">
            <h3>
              第{dayOffset}
              天任务
            </h3>
            <span>{taskDate}</span>
          </Alert>
          <Form horizontal className="split-form" onSubmit={handleSubmit(this.save)}>
            <h3 className="split-title"> 打卡内容 </h3>
            <FormInputField
              name="name"
              label="任务名称："
              type="text"
              autoComplete="off"
              placeholder="最多输入10个字"
              maxLength={10}
              value={name}
              required
              validations={{
                required: true,
                maxLength: 10,
              }}
              validationErrors={{
                required: '请填写打卡名称',
                maxLength: '最多输入10个字',
              }}
            />
            <Field
              name="taskContent"
              label="打卡详情："
              component={PunchDetailField}
              value={taskContent}
              validateOnBlur
              validations={{
                required: (values, value) => {
                  if (value.length > 0) {
                    return true;
                  }
                },
              }}
              validationErrors={{
                required: '请输入打卡详情',
              }}
              required
            />
            <h3 className="split-title"> 其他设置 </h3>
            <FormCheckboxGroupField
              name="taskCondition"
              label="任务要求："
              helpDesc="设置学员打卡内容要求，若不做勾选则视为不做限制。"
              value={taskCondition}
            >
              <Checkbox value={1}>必须上传语音</Checkbox>
              <Checkbox value={2}>必须上传一张图片</Checkbox>
            </FormCheckboxGroupField>
            <FormCheckboxField
              name="openDaySign"
              label="自定义日签："
              helpDesc="开启后当前任务将按自定义内容进行显示。"
              value={openDaySign}
              onChange={(_, val) => this.onDaySignChange(val)}
            >
              开启
            </FormCheckboxField>
            {openDaySign && [
              <FormCheckboxField
                name="openDaySignQuotes"
                key="openDaySignQuotes"
                label="金句："
                helpDesc="开启后当前任务将按自定义内容进行显示。"
                value={openDaySignQuotes}
                onChange={(_, val) => this.onOpenDaySignQuotes(val)}
              >
                开启
              </FormCheckboxField>,
              openDaySignQuotes && (
                <FormInputField
                  name="daySignQuotes"
                  key="daySignQuotes"
                  className="daySignQuotes-field"
                  type="textarea"
                  label=""
                  width="220px"
                  maxLength={30}
                  showCount
                  autoSize
                  validateOnBlur
                  value={daySignQuotes}
                />
              ),
              <Field
                name="daySignPic"
                key="daySignPic"
                label="上传图片："
                helpDesc="建议尺寸750*800，小于3M，支持jpg、png、jpeg格式。"
                component={CoverField}
                accept="image/jpg,image/jpeg,image/png"
                uploadCls="content-upload"
                value={daySignPic}
                required
                validations={{
                  required: true,
                }}
                validationErrors={{
                  required: '必须上传一张图片作为日签背景图',
                }}
              />,
            ]}
            <div className="app-design">
              <div className="app-actions">
                <div className="form-actions new-actions text-center">
                  <Button
                    onClick={() => {
                      hashHistory.goBack();
                    }}
                  >
                    取消
                  </Button>
                  <Button type="primary" htmlType="submit" loading={this.state.loading}>
                    保存
                  </Button>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </BlockLoading>
    );
  }
}

export default createForm({ scrollToError: true })(TaskEditForm);
