
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import { get, isEqual, clone } from 'lodash';
import { Radio, Button, Notify, Dialog, BlockLoading, Checkbox, Alert } from 'zent';
import { switchWrapper, isEduHqStore, isEduSingleStore } from 'fns/chain';
import format from 'date-fns/format';
import Edit from '../../edu-admin/classroom/Edit';
import getFieldInfoByQuery from './utils/get-field-info';
import getMaxClassTimes from './utils/caculate-max-times';
import { TimingTask, Select as EbizSelect } from '@youzan/ebiz-components';
import ValuntaryAsyncSelectField from 'components/valuntary-async-select';
import { NoRepeatField, RepeatDayField, RepeatWeekField } from './components/repeat-fields';
import { SplitTitle } from './components/split-title';
import { HolidaySelectField } from './components/holiday-select-field';
import AppointmentRuleConfig from './components/appointment-rule-config';
import { formatValueToQuery, formatScheduleInfoToFormValue } from './utils/format-value';
import {
  createSchedule,
  updateSchedule,
  getActionResult,
  getClassroomById,
  getScheduleDetail,
  getDateRangeConfig,
  validateBeforeSaveOrModify,
  getCourseList,
  getAppointmentConfig,
  isShopAppointmentConfigIndependent,
} from './utils/api';
import { listAllLegalHolidayByYear } from '../../edu-admin/api/holiday';
import { getShopList } from '@ability-center/shop/shop-choose';
// 获取下拉框选项的配置文件
import {
  CourseName,
  CourseClass,
  CourseStore,
  CourseClassroom,
  ChooseTeacherOrAssistant,
  asyncValidateKdtId,
  CourseKdt,
} from './utils/get-options';
import { chainSupportOnlySingle, chainSupportOnlyHq } from './utils/chain';
import EduClass from '../educlass';
import wrapper from '../wrapper';
import { IScheduleProps, IScheduleState } from './types';
import VersionWrapper from 'fns/version';

import '../../edu-admin/classroom/styles.scss';
import './style.scss';

const { Group } = Radio;
const { openDialog, closeDialog } = Dialog;
const {
  createForm,
  getControlGroup,
  Field,
  FormSection,
  FormInputField,
  FormNumberInputField,
  FormCheckboxField,
  FormCheckboxGroupField,
} = Form;
const EduClassDialog = wrapper(EduClass);

// 冲突文字也可用作抛弃teacherName等属性
// [text, key, prop]
const conflictText = [
  '',
  ['老师', 'teacherNo', 'teacherName'],
  ['班级', 'classNo', 'className'],
  ['教室', 'classroomNo', 'classroomName'],
];

// 新增老师链接
const addTeacherLink = chainSupportOnlySingle
  ? 'https://www.youzan.com/v2/staff/index/index#/create'
  : 'https://www.youzan.com/v4/setting/chainstaff#/staff/add?roleId=21';
const AssistantsSelect = getControlGroup(EbizSelect);

// 根据zentForm.onChange事件来更新这个对象，form表单内诸如是否显示班级都根据这个对象中的数据来
let validateCondition: any = {};

const nextYear = (new Date()).getFullYear() + 1;

class CreateOrEditCourse extends Component<IScheduleProps, IScheduleState> {
  static defaultProps = {
    teachType: 0, // 0: 班课，1：一对一
    isTry: false, // 是否是试听类型的创建
  };

  timeRangeQueryDefer: Promise<any> | null = null;

  state: IScheduleState = {
    operateType: this.props.operateType || 1, // 1：创建排课，2：编辑单个课节，3：编辑单个及后续
    btnLoading: false,
    repeatType: 0, // 0: no-repeat, 1: repeat day, 2: repeat-week
    scheduleDetail: null, // 用于排课回显
    inValidRules: [], // 不通过校验的规则
    dateRangeConfig: [],
    attachOptions: {},
    endType: 1,
    noNextYearLegalHoliday: false, // 明年法定节假日未公布
    assistantsSelectKey: 0, // 用于重置助教选择器
    independentConfigVisible: isEduSingleStore || isEduHqStore, // 店铺是否可配置日程的独立预约设置
  };

  // 用于渲染重复配置表单区域
  decideRepeatField = (type, props = {}) => {
    const {
      scheduleDetail,
      attachOptions,
      endType,
      operateType,
      inValidRules,
      dateRangeConfig,
    } = this.state;
    const defaultType = get(scheduleDetail, 'repeatConfig.type') || 0;
    let _type = type !== undefined ? type : defaultType;
    const _props: any = {
      ...props,
      disabledDate: [],
      type: _type,
      dateRangeConfig,
      operateType,
      refetchOptions: this.getOptions,
    };
    // 如果选中了班级，根据班级的开始结束时间，限制排课方式中的开课结课时间选项
    if (get(validateCondition, 'classNo')) {
      const { classStartTime, classEndTime } = validateCondition.classNo;
      // disabledDate = [班级实际开课时间, 用户选择的开始时间, 班级实际结课时间]
      _props.disabledDate = [classStartTime, '', classEndTime];
    }
    // 如果设置了开始日期，就将这个日期作为结束日期的一个
    const setStartTime = get(validateCondition, 'repeatConfig.noRepeat.startDate');
    if (setStartTime) {
      _props.disabledDate[1] = setStartTime;
    }
    if (attachOptions) {
      // 设置排课方式禁用（如果能够拿到重复配置，说明处于编辑状态）
      _props.defaultOptions = attachOptions;
      _props.disabled = operateType > 1;
      _props.endType = endType;
    }
    return (
      <FormSection name="repeatConfig">
        {_type === 2 ? <RepeatWeekField inValidRules={inValidRules} {..._props} /> : null}
        <NoRepeatField {..._props} />
        {_type >= 1 ? <RepeatDayField operateType={operateType} {..._props} /> : null}
      </FormSection>
    );
  };

  // 校验规则是否重复或者漏填
  validateRules = values => {
    const { repeatType = 0, operateType } = this.state;
    const weekRepeat = get(values, 'repeatConfig.repeatWeek');
    return new Promise<void>((resolve, reject) => {
      if (repeatType === 2 && operateType === 1) {
        if (Array.isArray(weekRepeat)) {
          const invalidGroup: number[] = [];
          let isValid = true;
          weekRepeat.forEach((rule, index) => {
            const containAll = ['weekDay', 'startTime', 'endTime'].every(
              key => rule[key] !== undefined,
            );
            // 如果有选项没有填写，就将index添加到检验不通过中
            if (!containAll) {
              invalidGroup.push(index);
              isValid = false;
            }
          });

          // eslint-disable-next-line prefer-promise-reject-errors
          if (!isValid) reject({ msg: '排课方式规则不能为空', invalidGroup });
          else {
            // 是否有重复项
            let hasDuplicate = false;
            const dupRepeat = clone(weekRepeat);
            dupRepeat.reduce((prev, cur, index) => {
              if (!hasDuplicate && isEqual(prev, cur)) {
                invalidGroup.push(index);
                hasDuplicate = true;
              }
              return cur;
            }, '');
            if (hasDuplicate) {
              // eslint-disable-next-line prefer-promise-reject-errors
              // reject({ msg: '有规则重复', invalidGroup });
              resolve();
              // return void 0;
            }
            // 检查完排课方式检查最大排课总数是否超过限制
            const endType = get(values, 'repeatConfig.repeatDay.endType');
            if (endType === 1) {
              const totalTimes = get(values, 'repeatConfig.repeatDay.totalTimes') || 0;
              // 同时再检测一下如果按周重复且按课节总数结束的时候课节总数是不是超过了最大值
              const endTime = get(values, 'classNo.classEndTime');
              const startTime = get(values, 'repeatConfig.noRepeat.startDate');
              const maxClassTimes = getMaxClassTimes(2, startTime, endTime, weekRepeat);
              // 如果最大课节总数为0
              if (maxClassTimes === 0) {
                // eslint-disable-next-line prefer-promise-reject-errors
                reject({
                  msg: '按周排课方式，至少有1天需要在所选时间范围内可排',
                  invalidGroup: [],
                });
                return void 0;
              }
              if (maxClassTimes > 0 && totalTimes > maxClassTimes) {
                // eslint-disable-next-line prefer-promise-reject-errors
                reject({
                  msg: `排课总数(${totalTimes})已超过班级可排课总数(${maxClassTimes})，请重新输入`,
                  invalidGroup: [],
                });
                return void 0;
              }
            }
          }
        } else {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject({ msg: '排课方式规则不能为空', invalidGroup: [0] });
        }
      }

      if (get(validateCondition, 'skipHoliday', []).includes('custom') &&
        get(validateCondition, 'customHolidays', []).length === 0) {
        reject({ msg: '请选择节假日', invalidGroup: [] });
      }

      let delayResolve = false;
      const repeatWeek = get(validateCondition, 'repeatConfig.repeatWeek', []);
      if (repeatType > 0 &&
        operateType === 1 &&
        repeatType === 2 &&
        Array.isArray(repeatWeek) &&
        repeatWeek.some(item => item.weekDay >= 6) &&
        get(validateCondition, 'skipHoliday', []).includes('weekend')
      ) {
        delayResolve = true;
        Dialog.openDialog({
          dialogId: 'schedule-holiday-weekend-skip-notify',
          title: '提示',
          children: '你选择了跳过周末，排课方式中所配置的周六/周日循环排课将不起效，确认继续排课？',
          footer: <>
            <Button onClick={() => {
              Dialog.closeDialog('schedule-holiday-weekend-skip-notify');
              reject();
            }}>取消</Button>
            <Button type="primary" onClick={() => {
              Dialog.closeDialog('schedule-holiday-weekend-skip-notify');
              resolve();
            }}>继续排课</Button>
          </>,
        });
      }
      if (!delayResolve) resolve();
    });
  };

  /**
   *  处理提交，需要保存前校验
   * @param {Object} val
   * @memberof CreateOrEditCourse
   * @return {void}
   */

  submit = val => {
    // hack: 主动校验重复配置
    this.validateRules(val)
      .then(() => {
        // 处理提交事件需要校验输入信息
        const { operateType, repeatType } = this.state;
        // 设置默认扣课时数
        if (!val.consumeNum) val.consumeNum = 0;

        if (!val.kdtId) val.kdtId = _global.kdtId;

        // 提交之前校验冲突
        // formatValueToQuery: 将field对象转成符合规定的query对象
        const validatedQuery = formatValueToQuery(
          Object.assign(val, { operateType, type: repeatType }),
        );
        // feature: 因为将设置OperateType的工作交由panel来做,这里直接进行检测冲突
        this.setState({ btnLoading: true }, () => this.validateBeforeSubmit(val, validatedQuery));
      })
      .catch(err => {
        if (!err) return;
        Notify.error(err.msg);
        this.setState({ inValidRules: err.invalidGroup, btnLoading: false });
      });
  };

  // 打开用户确认是否强制保存的dialog
  confirmToForceModify = (val, conflictCodes, validatedQuery) => {
    // 多个冲突默认展示第一个冲突的详情
    const [text, key, prop] = conflictText[conflictCodes[0]];
    openDialog({
      dialogId: 'conflictConfirm',
      title: '日程冲突',
      children: (
        <div>{`${get(val, `${key}.${prop}`)}${text}在该时段内已有日程，是否继续${
          this.state.operateType === 1 ? '创建' : '编辑'
        }？`}</div>
      ),
      onClose: this.handleEditClose('conflictConfirm', true),
      footer: [
        <Button key="confirm" onClick={this.saveOrModifySchedule.bind(null, val, validatedQuery)}>
          继续{this.state.operateType === 1 ? '创建' : '编辑'}
        </Button>,
        <Button key="close" type="primary" onClick={this.handleEditClose('conflictConfirm', true)}>
          我再想想
        </Button>,
      ],
    });
  };

  handleEditClose = (id, resetLoading = false) => () => {
    closeDialog(id, { triggerOnClose: resetLoading });
    if (resetLoading) {
      this.setState({ btnLoading: false });
    }
  };

  closeAll = () => {
    this.handleEditClose('conflictConfirm')();
    this.handleEditClose('switchOperateType')();
  };

  changeOperateType = operateType => {
    this.setState({ operateType });
  };

  // 提交之前校验冲突
  validateBeforeSubmit = (val, validatedQuery) => {
    this.setState({ btnLoading: true });
    const { operateType, scheduleDetail } = this.state;
    const { lessonNo } = this.props;
    validatedQuery.operateType = operateType;
    if (operateType !== 1) {
      // 如果不是新建，需要带上这两个字段
      validatedQuery.lessonNo = lessonNo;
      validatedQuery.scheduleId = (scheduleDetail as any).scheduleId;
    }

    // 试听预约新增日程时
    if (this.props.isTry) {
      validatedQuery.isTrial = 1;
    } else {
      validatedQuery.isTrial = 0;
    }
    return validateBeforeSaveOrModify(validatedQuery)
      .then(data => {
        if (data === '0') {
          this.saveOrModifySchedule(val, validatedQuery);
          return void 0;
        }
        // 后端传来的数据格式是"0,1,2,3"这样的数据，0表示没有冲突
        const conflictCodes = data.split(',').map(c => Number(c));
        // 如果没有日程冲突并且设置了重复规则
        if (conflictCodes[0] !== 0) {
          // 打开用户确认是否强制保存的dialog
          this.confirmToForceModify(val, conflictCodes, validatedQuery);
        }
      })
      .catch(err => {
        Notify.error(err);
        this.setState({ btnLoading: false });
      });
  };

  // 保存或者更新排课
  saveOrModifySchedule = (_val, validatedQuery) => {
    this.closeAll();
    const { operateType } = this.state;
    const startTime = new Date().getTime();
    // 如果是编辑
    let lock = false;
    const handlePolling = (timingTask, data, hint) => {
      const kdtId = get(validateCondition, 'kdtId') || _global.kdtId;
      getActionResult({ taskNo: data, kdtId })
        .then(res => {
          if (res.actionStatus === 1) {
            timingTask.stop();
            this.props.close();
            this.setState({ btnLoading: false });
            Notify.success(hint);
            const { afterSaveSucceed } = this.props;
            if (afterSaveSucceed) {
              afterSaveSucceed(validatedQuery, res.globalActionMsg);
            }
            // hashHistory.push(`/panel/view?startTime=${startTime}`);
          }
          lock = false;
        })
        .catch(err => {
          timingTask.stop();

          lock = false;
          Notify.error(err);

          const { afterSaveError } = this.props;
          if (afterSaveError) {
            afterSaveError();
          }
          hashHistory.push(`/panel/view?startTime=${startTime}`);
          this.setState({ btnLoading: false });
        });
    };
    if (operateType > 1) {
      updateSchedule(validatedQuery)
        .then(({ data }) => {
          const timingTask = new TimingTask(15000);
          timingTask
            .start(() => {
              // 锁定请求
              if (!lock) {
                lock = true;
                handlePolling(timingTask, data, '更新日程成功');
              }
            })
            .catch(() => {
              timingTask.stop();
              hashHistory.push(`/panel/view?startTime=${startTime}`);
            });
        })
        .catch(err => {
          Notify.error(err && err.msg);
          this.setState({ btnLoading: false });
        });
      return void 0;
    }
    validatedQuery.needValidateResource = false;
    createSchedule(validatedQuery)
      .then(({ data }) => {
        const timingTask = new TimingTask(15000);
        timingTask
          .start(() => {
            if (!lock) {
              lock = true;
              handlePolling(timingTask, data, '新建日程成功');
            }
          })
          .catch(() => {
            timingTask.stop();
            hashHistory.push(`/panel/view?startTime=${startTime}`);
          });
      })
      .catch(err => {
        Notify.error(err && err.msg);
        this.setState({ btnLoading: false });
      });
  };

  // 当用户选择了有强连带关系的选项的时候，清空与之相关的选项
  handleValueChange(keys, prevValue, curValue) {
    if (!isEqual(prevValue, curValue)) {
      const formVal: any = {};
      if (Array.isArray(keys)) {
        keys.forEach(key => (formVal[key] = ''));
      } else {
        formVal[keys] = '';
      }

      // 需重置为空数组的数据
      if (formVal.customHolidays === '') formVal.customHolidays = [];
      // 助教选择器组件需重新载入
      if (formVal.assistantNo === '') {
        formVal.assistants = [];
        this.setState(({ assistantsSelectKey }) => ({ assistantsSelectKey: assistantsSelectKey + 1 }));
      }

      this.props.zentForm.setFieldsValue(formVal);
    }
  }

  // 获取时段选项
  getOptions = () => {
    this.timeRangeQueryDefer = new Promise<void>((resolve, reject) => {
      getDateRangeConfig()
        .then(res => {
          if (Array.isArray(res)) {
            const options = res.map(config => {
              const { startTime, endTime } = config;
              const dateRange = [startTime, endTime].join('-');
              const option = {
                text: dateRange,
                value: dateRange,
              };
              return option;
            });
            this.setState({ dateRangeConfig: options }, () => {
              resolve();
            });
          }
          resolve();
        })
        .catch(err => {
          Notify.error(err);
          reject();
        });
    });
  };
  // 选中教室之后需要回填上课地点
  handleSelectClassroom = (_value, _, item) => {
    // 非单店情况下不操作
    if (!chainSupportOnlySingle) return;

    const { attachOptions = {} } = this.state;
    if (item) {
      getClassroomById({ id: item.classroomId }).then(data => {
        const { addressName, addressId } = data;
        (attachOptions as any).addressId = {
          text: addressName,
          value: addressId,
        };
        this.setState({ attachOptions }, () => this.props.zentForm.setFieldsValue({ addressId }));
      });
    }
  };

  // 选中班级后需要回填上课校区
  handleSelectClass = (_value, val) => {
    const { attachOptions = {} } = this.state;

    if (val && val.kdtId) {
      (attachOptions as any).kdtId = {
        text: val.shopName,
        value: val.kdtId,
      };
      this.setState(({ assistantsSelectKey }) => ({
        attachOptions,
        assistantsSelectKey: assistantsSelectKey + 1,
      }), () =>
        this.props.zentForm.setFieldsValue({
          kdtId: val.kdtId,
          teacherNo: '',
          classroomNo: '',
          customHolidays: [],
          assistants: [],
          assistantNo: '',
        }),
      );
    }
  };

  componentDidMount() {
    const { lessonNo, zentForm, kdtId, query = {}, isTry } = this.props;
    const { operateType } = this.state;
    // 是否是复制日程配置信息
    const isDuplicate = get(query, 'duplicate') || false;
    // 获取时间区间的选项
    this.getOptions();
    // 如果是复制，同样需要获取课程配置
    if (operateType > 1 || isDuplicate) {
      // 如果是编辑排课，那么需要获取排课信息
      getScheduleDetail({
        lessonNo,
        kdtId: kdtId || _global.kdtId,
      })
        .then(scheduleInfo => {
          // 多校区总部的情况下，应该将eduCourseId换成总部的
          if (isEduHqStore) {
            const { eduCourseName } = scheduleInfo;
            const pageRequest = { pageNumber: 1, pageSize: 20 };
            const query = { name: eduCourseName };
            return getCourseList({ query, pageRequest }).then(res => {
              scheduleInfo.eduCourseId = get(res, 'content[0].id', scheduleInfo.eduCourseId);
              return scheduleInfo;
            });
          } else {
            return scheduleInfo;
          }
        })
        .then((scheduleInfo = {}) => {
          const { attachOptions, formValues } = formatScheduleInfoToFormValue(
            { ...scheduleInfo, consumeNum: String(scheduleInfo.consumeNum || 0) },
            operateType,
          );
          const filterConfig = scheduleInfo.filterConfig || {};
          formValues.skipHoliday = [];
          if (filterConfig.skipLegalHoliday) formValues.skipHoliday.push('legal');
          if (filterConfig.skipWeekend) formValues.skipHoliday.push('weekend');
          if (filterConfig.customHolidays && filterConfig.customHolidays.length) {
            formValues.skipHoliday.push('custom');
            formValues.customHolidays = filterConfig.customHolidays;
          }

          this.setState(
            {
              scheduleDetail: scheduleInfo,
              attachOptions,
              // 如果是编辑单个日程,那么就展示单次排课的设置
              repeatType: operateType === 2 ? 0 : formValues.repeatConfig.type - 1,
              endType: get(formValues.repeatConfig, 'repeatDay.endType') || 1,
            },
            () => zentForm.initialize(formValues),
          );
        })
        .catch(err => Notify.error(err));
    } else if (operateType === 1 && Object.keys(query).length) {
      getFieldInfoByQuery(query, kdtId || _global.kdtId)
        .then(({ attachOptions, formValues }) => {
          this.setState({ attachOptions });
          // before:极其不优雅，因为上课时间是条件渲染的原因，在一开始就初始化，时间会被重置为['', '']
          // after: 需要给上课时间动态加一条筛选项
          if (this.timeRangeQueryDefer) {
            this.timeRangeQueryDefer.finally(() => {
              if (formValues.repeatConfig.type === 1) {
                const { noRepeat } = formValues.repeatConfig;
                if (noRepeat) {
                  const { dateRangeConfig } = this.state;
                  this.setState(
                    {
                      dateRangeConfig: [
                        ...dateRangeConfig,
                        {
                          text: noRepeat.schoolTime,
                          value: noRepeat.schoolTime,
                        },
                      ],
                    },
                    () => {
                      zentForm.setFieldsValue(formValues);
                    },
                  );
                  return;
                }
              }
              zentForm.setFieldsValue(formValues);
            });
          } else {
            zentForm.setFieldsValue(formValues);
          }
        })
        .catch(err => Notify.error(err));
    }

    if (operateType === 1) {
      listAllLegalHolidayByYear({ year: (new Date()).getFullYear() + 1 }).then((data) => {
        if (!data.length) this.setState({ noNextYearLegalHoliday: true });
      });
    }

    if (isTry) {
      // 读取店铺独立预约规则配置
      getAppointmentConfig()
        .then(data => {
          if (data) {
            this.setState({
              scheduleDetail: {
                appointmentConfigDTO: data,
                ...this.state.scheduleDetail,
              },
            });
          }
        })
        .catch(e => {
          Notify.error(e || '获取店铺预约配置失败，请稍后重试');
        });
    } else {
      Promise.all([getAppointmentConfig(), isShopAppointmentConfigIndependent()])
        .then(data => {
          const [appointmentConfig, shopConfigIndependentVisible] = data;
          if (!data || !appointmentConfig) {
            return;
          }
          this.setState({
            scheduleDetail: {
              appointmentConfigDTO: appointmentConfig,
              ...this.state.scheduleDetail,
            },
            independentConfigVisible: shopConfigIndependentVisible,
          });
        })
        .catch(e => {
          Notify.error(e || '获取店铺预约配置失败，请稍后重试');
        });
    };
  }

  componentWillUnmount() {
    // 释放这个对象
    validateCondition = null;
    Dialog.closeDialog('dateRangePicker');
  }

  renderLocation = getDefaultOptions => {
    const { operateType } = this.state;

    return switchWrapper({
      supportSingleStore: () => {
        return (
          <ValuntaryAsyncSelectField
            label="上课地点："
            name="addressId"
            infinityScroll={false}
            getOptions={CourseStore}
            placeholder="请选择上课地点"
            fetchOnLoadAnyway
            defaultOption={getDefaultOptions('addressId')}
            valueChange={this.handleValueChange.bind(this, ['classroomNo'])}
            onAdd={() => window.open('https://www.youzan.com/v2/setting/store#physical_store')}
          />
        );
      },
      supportBranchStore: () => {
        return null;
      },
      supportHqStore: () => {
        const shopNameObj = getDefaultOptions('kdtId');

        const isChooseClassNo = !!get(validateCondition, 'classNo');
        const isChooseEduCourseId = !!get(validateCondition, 'eduCourseId.eduCourseId');

        const getShopListFn = (() => {
          if (isChooseClassNo) {
            return () => Promise.resolve([shopNameObj]);
          } else if (!isChooseEduCourseId) {
            return (query, pageRequest) => {
              return getShopList({
                query,
                pageRequest,
                addAll: false,
                cb: () => {},
              });
            };
          } else {
            return CourseKdt.bind(validateCondition);
          }
        })();
        return (
          <ValuntaryAsyncSelectField
            label="上课校区："
            name="kdtId"
            required
            asyncValidation={asyncValidateKdtId}
            placeholder={'请选择校区'}
            fetchOnLoadAnyway
            disabled={
              operateType > 1 ||
              (!get(validateCondition, 'eduCourseId.eduCourseId') && !this.props.isTry) ||
              isChooseClassNo
            }
            defaultOption={shopNameObj}
            valueChange={this.handleValueChange.bind(this, [
              'teacherNo',
              'assistantNo',
              'classroomNo',
              'customHolidays',
            ])}
            getOptions={getShopListFn}
            onAdd={() => window.open('https://www.youzan.com/v4/shop/online-store#/create')}
          />
        );
      },
    });
  };

  render() {
    const { handleSubmit, isTry } = this.props;
    const {
      repeatType,
      btnLoading,
      operateType,
      attachOptions,
      scheduleDetail,
      noNextYearLegalHoliday,
      independentConfigVisible,
    } = this.state;
    // 是否是创建排课操作
    const isCreate = operateType === 1;
    const detailInfo = operateType > 1 ? scheduleDetail : validateCondition;
    // 获取默认选项，用于回显
    const getDefaultOptions = key => {
      const defaultValues = {
        eduCourseId: get(attachOptions, 'eduCourseId'),
        classNo: get(attachOptions, 'classNo'),
        teacherNo: get(attachOptions, 'teacherNo'),
        assistantNo: get(attachOptions, 'assistantNo'),
        assistantNos: get(attachOptions, 'assistants'),
        addressId: get(attachOptions, 'addressId'),
        classroomNo: get(attachOptions, 'classroomNo'),
        kdtId: get(attachOptions, 'kdtId'),
      };

      return defaultValues[key];
    };
    const classStartTime = get(detailInfo, 'classNo.classStartTime');
    const classEndTime = get(detailInfo, 'classNo.classEndTime');
    const timeFormatStr = 'YYYY-MM-DD';
    const exsistClassTime = [
      classStartTime && format(classStartTime, timeFormatStr),
      classEndTime && format(classEndTime, timeFormatStr),
    ];
    // 显示班级选择框
    const showClassSelector = () => {
      if (operateType === 1) {
        return get(detailInfo, 'eduCourseId.classNum') > 0 || getDefaultOptions('classNo');
      }
      // 编辑的时候要看classNo
      return getDefaultOptions('classNo');
    };
    const chooseClass = get(detailInfo, 'classNo');

    // 跳过节假日选项是否可用
    const holidayOptionAvailable = !isCreate || (isEduHqStore && !get(validateCondition, 'kdtId', ''));

    // 判断是否有课排到明年
    const hasNextYear = repeatType > 0 &&
      get(validateCondition, 'repeatConfig.repeatDay.endDate', '').startsWith(nextYear);

    const renderNormalForm = () => {
      const validateConsumeNum = () => {
        const validation = {};
        validation['required'] = (_, value) => {
          if (!value && typeof value !== 'number') {
            return '请填写扣课时数';
          }
          return true;
        };

        return validation;
      };

      return (
        <>
          {/* 课程的基本信息 */}
          <SplitTitle title={'日程信息'} />
          {/* 选择上课课程，带异步加载选项 */}
          {
            (
              <ValuntaryAsyncSelectField
                required
                label="上课课程："
                name="eduCourseId"
                placeholder="请选择课程"
                getOptions={CourseName}
                create={chainSupportOnlyHq || chainSupportOnlySingle}
                refresh={chainSupportOnlyHq || chainSupportOnlySingle}
                disabled={operateType > 1}
                // asyncValidation={asyncValidateEduCourseId}
                validations={{
                  required: true,
                }}
                validationErrors={{
                  required: '请选择课程',
                }}
                defaultOption={getDefaultOptions('eduCourseId')}
                valueChange={this.handleValueChange.bind(this, ['classNo', 'kdtId'])}
                onAdd={() =>
                  window.open(
                    'https://www.youzan.com/v4/vis/edu/page/educourse#/add?from=scheduleCreate',
                  )
                }
              />
            )
          }
          {/* 选择上课班级，带异步加载选项 */}
          {/* 只有有班级的课程才能显示班级选择 */}
          {showClassSelector() && (
            <ValuntaryAsyncSelectField
              name="classNo"
              label="上课班级："
              placeholder="请选择班级"
              matainDefaultOption={false}
              disabled={operateType > 1}
              defaultOption={getDefaultOptions('classNo')}
              getOptions={CourseClass.bind(validateCondition, operateType, repeatType)}
              onAdd={
              // window.open('https://www.youzan.com/v4/vis/edu/page/educlass#/list?add=1')
                () => EduClassDialog.open('新建班级')
              }
              valueChange={this.handleSelectClass}
            />
          )}

          {/* 班级开课时间和结课时间 */}
          {exsistClassTime[0] ? (
            <p className="schedule__create-form des">
            开班时间（{exsistClassTime[0] || '-'}到{exsistClassTime[1] || '-'}）
            </p>
          ) : null}
          {/* 输入课节名称 */}
          <FormInputField
            name="name"
            width="250px"
            label="课节名称："
            autoComplete="off"
            placeholder="最多输入100个字"
            validations={{
              maxLength: 100,
            }}
            validationErrors={{
              maxLength: '最多输入100个字',
            }}
          />

          {/* 校区 & 上课地点 选项 */}
          {this.renderLocation(getDefaultOptions)}

          {/* 配置排课方式 */}
          <div className="schedule__create-form item">
            <label className="zent-form__control-label">排课方式：</label>
            <Group
              value={repeatType}
              disabled={operateType > 1}
              className="zent-form__controls"
              onChange={e => this.setState({ repeatType: e.target.value as number })}
            >
              <Radio value={0}>单次排课</Radio>
              <Radio value={1}>按天重复排课</Radio>
              <Radio value={2}>按周重复排课</Radio>
            </Group>
          </div>
          {/* 渲染相对应的排课方式输入域 */}
          {this.decideRepeatField(repeatType)}

          {repeatType !== 0 &&
        <>
          <FormCheckboxGroupField
            className={get(validateCondition, 'skipHoliday', []).includes('custom') ? 'has-selector' : '' }
            name="skipHoliday"
            label="跳过节假日："
          >
            <Checkbox
              disabled={holidayOptionAvailable}
              className="schedule__create-form holiday-checkbox"
              value="legal"
            >
              跳过法定节假日
            </Checkbox>
            {noNextYearLegalHoliday && hasNextYear && isCreate &&
            <p className="zent-form__help-desc">*次年法定节假日未出，无法跳过，请知晓</p>}
            <Checkbox
              disabled={holidayOptionAvailable}
              className="schedule__create-form holiday-checkbox"
              value="weekend"
            >
              跳过周末
            </Checkbox>
            <Checkbox
              disabled={holidayOptionAvailable}
              className="schedule__create-form holiday-checkbox"
              value="custom"
            >
              跳过自定义节假日
            </Checkbox>
          </FormCheckboxGroupField>
          <HolidaySelectField
            visible={get(validateCondition, 'skipHoliday', []).includes('custom')}
            isCreate={isCreate}
            name="customHolidays"
            value={get(validateCondition, 'customHolidays', [])}
            queryKdtId={isEduHqStore ? get(validateCondition, 'kdtId') : undefined}
            displayError={this.props.zentForm.isFormSubmitFail()}
          />
        </>}

          <div className="schedule__create-form item">
            <FormNumberInputField
              min={0}
              max={999}
              showStepper
              decimal={2}
              width="250px"
              required
              label="扣课时数："
              name="consumeNum"
              autoComplete="off"
              disabled={operateType > 1}
              validations={validateConsumeNum()}
            />
            <label>课时</label>
          </div>

          {/* 选择老师，带异步加载选项 */}
          <ValuntaryAsyncSelectField
            label="老师："
            name="teacherNo"
            placeholder="请选择老师"
            matainDefaultOption={false}
            defaultOption={getDefaultOptions('teacherNo')}
            onAdd={() => window.open(addTeacherLink)}
            getOptions={ChooseTeacherOrAssistant.getTeacherList.bind(
              validateCondition,
              this.props.lessonNo,
              operateType,
              repeatType,
            )}
            disabled={!get(validateCondition, 'kdtId') && chainSupportOnlyHq}
          />
          {/* 选择助教，带异步加载选项 */}
          <Field
            tags
            label="助教："
            className="assistant-selector"
            mode="async"
            fetchOnOpened
            width={'250px'}
            validations={{
              maxLength: 20,
            }}
            name="assistants"
            placeholder="请选择助教"
            component={AssistantsSelect}
            validationErrors={{
              maxLength: '最多可以选择20个助教',
            }}
            dropdownClassName="cover__schedule-assistant"
            filter
            defaultOptions={getDefaultOptions('assistantNos')}
            fetchOptions={async (query, pageRequest) => {
              const cloneOne = Object.assign({}, pageRequest);
              cloneOne.pageNumber = pageRequest.current;
              delete cloneOne.current;
              const options = await ChooseTeacherOrAssistant.getAssistantList.bind(
                validateCondition,
                this.props.lessonNo,
                operateType,
                repeatType,
              )(query, cloneOne);

              return new Promise(resolve =>
                resolve({
                  options,
                  pageInfo: {
                    current: cloneOne.pageNumber,
                    total: options.length ? options[0].total : 0,
                  },
                }),
              );
            }}
            showAdd="新建"
            showRefresh
            onAdd={() => window.open(addTeacherLink)}
            disabled={!get(validateCondition, 'kdtId') && chainSupportOnlyHq}
            key={this.state.assistantsSelectKey}
          />

          {/* 教室，带异步加载选项 */}
          <ValuntaryAsyncSelectField
            label="教室："
            name="classroomNo"
            placeholder="请选择教室"
            defaultOption={getDefaultOptions('classroomNo')}
            matainDefaultOption={false}
            getOptions={CourseClassroom.bind(
              validateCondition,
              this.props.lessonNo,
              operateType,
              repeatType,
            )}
            onAdd={openDialog.bind(this, {
              dialogId: 'createClassroom',
              title: '新建教室',
              children: <Edit type="create" onClose={this.handleEditClose('createClassroom')} />,
            })}
            valueChange={this.handleSelectClassroom}
            disabled={!get(validateCondition, 'kdtId') && chainSupportOnlyHq}
          />

          {chooseClass ? null : (
            <>
              <SplitTitle title={'预约信息'} />
              <FormCheckboxField value={true} label="预约设置：" name="appointRule">
              学员需预约后才可上课
              </FormCheckboxField>
              {get(validateCondition, 'appointRule', true) ? (
                <>
                  <FormNumberInputField
                    min={0}
                    required
                    max={99999}
                    width="250px"
                    label="上课人数："
                    autoComplete="off"
                    name="maxAppointNum"
                    validations={{ required: true }}
                    validationErrors={{ required: '上课人数不能为空' }}
                  />
                  <AppointmentRuleConfig
                    appointmentConfigDTO={get(scheduleDetail, 'appointmentConfigDTO')}
                    independentConfigVisible={independentConfigVisible}
                  />
                </>
              ) : null}
            </>
          )}
        </>
      );
    };

    const renderTryForm = () => {
      return (
        <>
          <FormInputField
            name="name"
            required
            width="250px"
            label="课节名称："
            autoComplete="off"
            placeholder="最多输入100个字"
            validations={{
              maxLength: 100,
              required: true,
            }}
            validationErrors={{
              maxLength: '最多输入100个字',
              required: '课节名称不能为空',
            }}
          />
          {/* 渲染相对应的排课方式输入域 */}
          {this.decideRepeatField(repeatType)}

          <FormNumberInputField
            min={0}
            required
            max={99999}
            width="250px"
            label="上课人数："
            autoComplete="off"
            name="maxAppointNum"
            validations={{ required: true }}
            validationErrors={{ required: '上课人数不能为空' }}
          />

          {/* 校区 & 上课地点 选项 */}
          {this.renderLocation(getDefaultOptions)}

          <VersionWrapper name="try-new-lesson">
            {/* 选择老师，带异步加载选项 */}
            <ValuntaryAsyncSelectField
              label="老师："
              name="teacherNo"
              placeholder="请选择老师"
              matainDefaultOption={false}
              defaultOption={getDefaultOptions('teacherNo')}
              onAdd={() => window.open(addTeacherLink)}
              getOptions={ChooseTeacherOrAssistant.getTeacherList.bind(
                validateCondition,
                this.props.lessonNo,
                operateType,
                repeatType,
              )}
              disabled={!get(validateCondition, 'kdtId') && chainSupportOnlyHq}
            />
            {/* 选择助教，带异步加载选项 */}
            <Field
              tags
              label="助教："
              className="assistant-selector"
              mode="async"
              fetchOnOpened
              width={'250px'}
              validations={{
                maxLength: 20,
              }}
              name="assistants"
              placeholder="请选择助教"
              component={AssistantsSelect}
              validationErrors={{
                maxLength: '最多可以选择20个助教',
              }}
              filter
              defaultOptions={getDefaultOptions('assistantNos')}
              fetchOptions={async (query, pageRequest) => {
                const cloneOne = Object.assign({}, pageRequest);
                cloneOne.pageNumber = pageRequest.current;
                delete cloneOne.current;
                const options = await ChooseTeacherOrAssistant.getAssistantList.bind(
                  validateCondition,
                  this.props.lessonNo,
                  operateType,
                  repeatType,
                )(query, cloneOne);

                return new Promise(resolve =>
                  resolve({
                    options,
                    pageInfo: {
                      current: cloneOne.pageNumber,
                      total: options.length ? options[0].total : 0,
                    },
                  }),
                );
              }}
              showAdd="新建"
              showRefresh
              onAdd={() => window.open(addTeacherLink)}
              disabled={!get(validateCondition, 'kdtId') && chainSupportOnlyHq}
              key={this.state.assistantsSelectKey}
            />

            {/* 教室，带异步加载选项 */}
            <ValuntaryAsyncSelectField
              label="教室："
              name="classroomNo"
              placeholder="请选择教室"
              defaultOption={getDefaultOptions('classroomNo')}
              matainDefaultOption={false}
              getOptions={CourseClassroom.bind(
                validateCondition,
                this.props.lessonNo,
                operateType,
                repeatType,
              )}
              onAdd={openDialog.bind(this, {
                dialogId: 'createClassroom',
                title: '新建教室',
                children: <Edit type="create" onClose={this.handleEditClose('createClassroom')} />,
              })}
              valueChange={this.handleSelectClassroom}
              disabled={!get(validateCondition, 'kdtId') && chainSupportOnlyHq}
            />
          </VersionWrapper>
        </>
      );
    };

    return (
      <BlockLoading loading={btnLoading} className="schedule__create-container">
        <VersionWrapper name="try-new-lesson">
          { !!isTry && (<Alert className="try-alert" type="warning">此为试听日程，只允许机构添加学员进此日程，学员自主约课无法预约此日程。</Alert>) }
        </VersionWrapper>

        <Form horizontal className="form-body" onSubmit={handleSubmit(this.submit)}>
          {
            isTry ? (renderTryForm())
              : (
                renderNormalForm()
              )
          }
          <div className="schedule__create-footer">
            <Button onClick={() => this.props.close()}>取消</Button>
            <Button type="primary" htmlType="submit" loading={btnLoading}>
              {operateType === 2 ? '更新' : '保存'}
            </Button>
          </div>
        </Form>
      </BlockLoading>
    );
  }
}

export default createForm({
  onChange: val => {
    validateCondition = val;
  },
})(CreateOrEditCourse);
