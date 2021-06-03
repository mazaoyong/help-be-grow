
import { Pop, Form } from '@zent/compat';
import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import { BlockLoading, Button, Radio, Notify, Icon } from 'zent';
import { Button as SamButton } from '@youzan/sam-components';
import SelectQuickOperateField from '../field/select-quick-operate';
import { getShopList } from '@ability-center/shop/shop-choose';
import FakeField from '../fake-field';
import ConflictDialog from '../dialog-conflict';
import MaxStudentDialog from '../dialog-max-student';
import { switchWrapper } from 'fns/chain';
import DialogCourseField from '../dialog-course';
import { isEduHqStore } from '@youzan/utils-shop';
import AssetTip from './AssetTip';
import { openAbnormalCodeDialog } from '@ability-center/appointment/abnormal-util';
import VersionWrapper from 'fns/version';

import {
  detectConflict,
  getStudentList,
  getAppointment,
  getOfflineCourseList,
  getStoreList,
  createAppointment,
  confirmAppointment,
  getStudentLessonForUpdate,
  updateStudentLesson,
  getUpdateAppointmentResult,
} from '../../api';
import { findPageByEduCourse } from '../../../api/educourse';
import formatDate from 'zan-utils/date/formatDate';
import { deleteEmptyProperty } from '../../utils';
import { APPOINTMENT_STATUS_TYPE, PAGE_URL_MAP } from '../../constants';
import { has, get } from 'lodash';
import { APPOINTMENT_TYPE, COURSE_TYPE } from './constants';

const {
  createForm,
  Field,
  FormInputField,
  FormRadioGroupField,
} = Form;
const nowDate = new Date();

const openSubmitDialog = (res = {}, onConfirm, kdtId, type = -1, studentLessonNo = '') => {
  const { msg = '', check } = res;
  let { assetCheckInfo, checkCode, lessonCheckInfo } = check || {};
  assetCheckInfo = assetCheckInfo || {};
  lessonCheckInfo = lessonCheckInfo || {};
  openAbnormalCodeDialog({
    type, // 签到 | 请假 | 未到
    data: {
      assetNo: assetCheckInfo.assetNo || '', // 资产编号
      checkCode, // 检查错误码
      message: msg, // 异常原因
      numCheckDetail: {
        availableNum: assetCheckInfo.available || 0,
        consumeNum: lessonCheckInfo.consumeNum || 0,
        lockedNum: assetCheckInfo.locked || 0,
        needRemoved: assetCheckInfo.needRemoved || 0,
      }, // 课时校验详情
      timeCheckDetail: {
        lessonTime: lessonCheckInfo.endTime,
        assetEndTime: assetCheckInfo.endTime,
      },
      studentLessonNo,
    },
    onConfirm,
    kdtId,
  });
};

class AppointmentDialogContent extends Component {
  getStudentByNoPromise = null;
  studentNo = '';

  constructor(props) {
    super(props);
    const { defaultData = {} } = props;
    const { remark = '' } = defaultData;

    this.state = {
      loading: false,
      loadingText: '',
      confirmInfo: {},
      editInfo: {},
      studentId: '',
      assetNo: '',
      courseName: '', // 用户线下课的 placeholder
      rawAssetList: [],
      eduCoursePlaceholder: '',
      lessonNo: '',
      courseType: '0',
      monthDate: formatDate(nowDate, 'YYYY-MM'),
      dayDate: '',
      dayList: [],
      address: '',
      addressList: [],
      eduCourseId: '',
      eduCourseName: '',
      kdtId: _global.kdtId,
      shopName: '',
      lessonList: [],
      storeList: [],
      offlineCourseList: [],
      remark,
      offlineMode: 0, // 选择的线下课的类型，0 是指定，1 是通用
      selectedLesson: null, // 已选择课节
      editLessonInfo: null, // 编辑时读取的已选课节信息
    };
  }

  onSubmit = async values => {
    const userInfo = window._global.userInfo;
    const { closeDialog, defaultData = {}, callback: callbackFn } = this.props;
    const { studentLessonStatus, studentLessonNo } = defaultData;
    const { lessonNo, lessonDate, lessonTime = '-', kdtId } = this.state.selectedLesson;
    // const _this = this;

    const callback = function lazyCallback(...args) {
      // 预约成功后 fetchList es 返回比较慢，前端设置 3s 延迟
      setTimeout(() => {
        callbackFn(...args);
      }, 3000);
    };

    if (!lessonNo) {
      return Notify.error('暂未选择可用课节');
    }
    const lessonInfo = this.state.selectedLesson;
    if (!lessonInfo) return Notify.error('课节查找失败');

    let submitFn = () => { };

    const isEdit = studentLessonStatus === APPOINTMENT_STATUS_TYPE.TO_BE_PERFORMED;

    // 确认预约
    if (studentLessonStatus === APPOINTMENT_STATUS_TYPE.TO_BE_CONFIRMED) {
      submitFn = () => {
        this.setState({ loading: true });
        confirmAppointment(
          deleteEmptyProperty({
            lessonNo: lessonNo,
            studentLessonNo,
            comment: values.comment,
            kdtId: kdtId || _global.kdtId,
          }),
        )
          .then((res) => {
            this.setState({ loading: false });
            // Notify.success('确认预约成功');
            openSubmitDialog(res, () => {
              callback();
              closeDialog();
            }, kdtId);
            // callback();
          })
          .catch(error => {
            this.setState({ loading: false });
            Notify.error(error);
          });
      };
    } else if (isEdit) {
      // 修改预约
      submitFn = () => {
        this.setState({ loading: true });
        updateStudentLesson(
          deleteEmptyProperty({
            assetNo: values.assetNo,
            courseType: +values.courseType || 0, // 这里 0 兜底是为了基础版没有预约类型选择
            lessonNo: lessonNo,
            studentLessonNo,
            operatorId: userInfo.id,
            studentId: values.studentId,
            comment: values.comment,
            kdtId: kdtId || _global.kdtId,
          }),
        )
          .then((res) => {
            const params = {
              appointId: res,
              date: lessonDate,
              lessonTime,
            };
            openSubmitDialog(res, async () => {
              this.setState({ loadingText: '获取结果中...' });

              // 轮询结果
              try {
                await this.pollUpdateResult({
                  originStudentLessonNo: res.originStudentLessonNo,
                  studentLessonNo: res.studentLessonNo,
                  kdtId: kdtId || _global.kdtId,
                });
                Notify.success('修改预约成功');
              } catch (errMsg) {
                Notify.error(errMsg);
                console.error(errMsg);
              }

              this.setState({ loading: false });
              // 刷新列表
              callbackFn(params);
              // 关闭预约弹窗
              closeDialog();
            }, kdtId, -2, studentLessonNo);
            // callback(params);
            // closeDialog();
          })
          .catch(error => {
            this.setState({ loading: false });
            Notify.error(error);
          });
      };
    } else {
      submitFn = () => {
        this.setState({ loading: true });
        createAppointment(
          deleteEmptyProperty({
            assetNo: values.assetNo,
            courseType: +values.courseType || 0, // 这里 0 兜底是为了基础版没有预约类型选择
            lessonNo: lessonNo,
            operatorId: userInfo.id,
            studentId: values.studentId,
            comment: values.comment,
            kdtId: kdtId || _global.kdtId,
          }),
        )
          .then((res) => {
            this.setState({ loading: false });
            // Notify.success('新建预约成功');
            const params = {
              appointId: res,
              date: lessonDate,
              lessonTime,
            };
            openSubmitDialog(res, () => {
              callback(params);
              closeDialog();
            }, kdtId);
            // callback(params);
            // closeDialog();
          })
          .catch(error => {
            this.setState({ loading: false });
            Notify.error(error);
          });
      };
    }

    // 学员日程冲突校验
    const [startTime, endTime] = lessonTime.split('-');
    const conflictQuery = {
      kdtId: kdtId || _global.kdtId,
      studentIds: [values.studentId],
      startTime: `${lessonDate} ${startTime}:00`, // '2019-09-09 16:11:25',
      endTime: `${lessonDate} ${endTime}:00`, // '2019-09-10 16:11:25',
    };
    isEdit &&
      (conflictQuery.excludeStudentLessonNos = [studentLessonNo]);
    const { hasConflict, conflictMsg } = await detectConflict(conflictQuery);
    if (hasConflict) {
      await ConflictDialog.open({
        defaultData: { conflictMsg, type: isEdit ? 1 : 0 },
      });
    }

    // 试听占用名额校验
    // 试听课
    if (+values.courseType === 0) {
      // 学员预约后才可上课, 试听占用名额, 且日程已满员
      if (+lessonInfo.appointRule === 1 &&
        +lessonInfo.trialCourseOccupyQuota === 1 &&
        +lessonInfo.appointNumLeft <= 0
      ) {
        Notify.error('所选择的日程，无剩余名额；请重新选择');
        return;
      }
    }

    // 确认预约时满员提醒
    if (+lessonInfo.appointRule === 1 && +lessonInfo.appointNumLeft <= 0) {
      MaxStudentDialog.open({ defaultData: lessonInfo, callback: submitFn });
    } else {
      submitFn();
    }
  };

  pollUpdateResult(query) {
    return new Promise((resolve, reject) => {
      let duration = 0;
      const threshold = 15000;
      const defaultInterval = 1000;

      const intervalTask = (interval) => {
        setTimeout(() => {
          duration += interval;
          getUpdateAppointmentResult(query)
            .then(res => {
              if (res) {
                resolve();
              } else if (duration >= threshold) {
                reject('获取结果超时');
              } else {
                intervalTask(interval);
              }
            })
            .catch(errMsg => {
              reject(errMsg);
            });
        }, interval);
      };

      intervalTask(defaultInterval);
    });
  }

  formatStudentOption = (studentInfo = {}) => {
    const student = studentInfo.student || {};
    const customer = studentInfo.customer || {};

    // 显示学员姓名和手机号
    let customerText = '';
    if (customer.mobile) {
      customerText = ` ${customer.mobile || ''}`;
    }

    return {
      text: student.name || '',
      extra: customerText || null,
      value: student.id,
    };
  };

  getStudentOptions = (query, { current }) => {
    return getStudentList({
      filter: deleteEmptyProperty({ keyword: query }),
      pageRequest: {
        pageSize: 20,
        pageNumber: current,
        sort: {
          orders: [
            {
              direction: 'DESC',
              property: 'created_at',
            },
          ],
        },
      },
    }).then(({ content = [], total, pageable }) => {
      const options = [];
      content.map(item => {
        const student = item.student || {};
        if (student.studentNo.toString() !== this.studentNo.toString()) {
          options.push(this.formatStudentOption(item));
        }
      });

      return {
        options,
        pageInfo: {
          current,
          total,
        },
      };
    });
  };

  // 线下课列表
  getCourseOptions = () => {
    const userInfo = window._global.userInfo;
    const { studentId } = this.state;
    if (!studentId) {
      return Promise.reject({
        message: '请选择学员',
      });
    }
    return getOfflineCourseList({
      filter: { userId: userInfo.id, studentUid: studentId },
    })
      .then(data => {
        if (!data) {
          data = [];
        }
        return {
          options: data.map(item => {
            const { courseProductDTO = {}, userAssetDTO = {}, eduCourseLittleDTO = {} } = item;
            // notBeUsedAsset: 0 表示关联课程，1 表示没关联课程
            const { joinState = {}, notBeUsedAsset } = userAssetDTO;

            this.setState({
              offlineCourseList: (data || []).map(item => {
                const { courseProductDTO = {}, userAssetDTO = {}, eduCourseLittleDTO = {} } = item || {};
                return {
                  text: courseProductDTO.title || eduCourseLittleDTO.name,
                  value: userAssetDTO.assetNo,
                  // text: userAssetsDTO.assetNo,
                };
              }),
              rawAssetList: data || [],
              /* shopName,
              kdtId, */
            });

            // 校验状态 1：通过 2：自定义资产未设置有效期 3：学员课程到期 4：学员课时不足
            const { choose, description, state } = joinState;

            const popText = (
              <>
                {description}
                {state === 2 && (
                  <>
                    ，
                    <a
                      href={`${_global.url.v4}/vis/edu/page/student#/detail/${studentId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      立即生效
                    </a>
                  </>
                )}
              </>
            );

            const extra = choose ? (
              // 线下课没关联课程给提示
              notBeUsedAsset === 1 ? (
                <Pop
                  trigger="hover"
                  position="top-left"
                  content="未关联适用课程，不支持预约"
                  className="appointment__create__course__dialog__wrap"
                  wrapperClassName="appointment__create__course__dialog"
                >
                  <Icon type="help-circle-o" className="icon-help" title="" />
                </Pop>
              ) : ''
            ) : (
              <Pop
                trigger="hover"
                position="top-left"
                content={popText}
                className="appointment__create__course__dialog__wrap"
                wrapperClassName="appointment__create__course__dialog"
              >
                <Icon type="help-circle-o" className="icon-help" title="" />
              </Pop>
            );

            return {
              text: courseProductDTO.title || eduCourseLittleDTO.name || '',
              value: userAssetDTO.assetNo,
              extra,
              disabled: !choose || notBeUsedAsset === 1,
            };
          }),
          pageInfo: {
            current: 1,
            total: data.length,
          },
        };
      })
      .catch(error => {
        Notify.error(error);
      });
  };

  getLessonByNo = lessonNo => {
    const { lessonList } = this.state;
    return lessonList.find(item => {
      return item.lessonNo === lessonNo;
    });
  };

  handleStudentChange = value => {
    const { studentId } = this.state;
    if (studentId === value) return;
    this.setState(
      {
        selectedLesson: null,
        studentId: value,
        assetNo: '',
        lessonNo: '',
        offlineCourseList: [],
        eduCourseId: '',
        eduCoursePlaceholder: '',
        // monthDate: '',
        dayDate: '',
        dayList: [],
        address: '',
        addressList: [],
        kdtId: '',
        shopName: '',
      },
      () => {
        const { courseType } = this.state;
        if (+courseType === 1) {
          // 获取线下课列表
          // this.getOfflineCourseList();
        }
      },
    );
  };

  handleEduCourseChange = value => {
    const { confirmInfo, kdtId, offlineMode } = this.state;
    const isConfirm = !!confirmInfo.studentLessonNo;

    this.setState(
      {
        lessonNo: '',
        eduCourseId: value,
        dayDate: '',
        dayList: [],
        address: '',
        addressList: [],
        kdtId: isConfirm || offlineMode === 1 ? kdtId : '', // 编辑状态 或者 选择的线下课是通用 则不清空
      },
      () => {
        // this.getDayList();
      },
    );
  };

  handleCourseTypeChange = value => {
    const { courseType } = this.state;
    if (value === courseType) return;
    this.setState(
      {
        courseType: value,
        assetNo: '',
        lessonNo: '',
        offlineCourseList: [],
        eduCourseId: '',
        eduCoursePlaceholder: '',
        // monthDate: '',
        dayDate: '',
        dayList: [],
        address: '',
        addressList: [],
        kdtId: '',
      },
      () => {
        if (+value === 1) {
          // 0 体验课； 1 正式课
          // this.getOfflineCourseList();
        }
      },
    );
  };

  handleAssetNoChange = value => {
    // 线下课和课程 校区的联动处理
    const { rawAssetList = [] } = this.state;
    if (!value) {
      this.setState({
        eduCourseId: '',
        eduCoursePlaceholder: '',
        kdtId: '',
        shopName: '',
      });
    } else {
      const offlineCourseInfo = rawAssetList.find(item => {
        const userAssetDTO = (item && item.userAssetDTO) || {};
        return value === userAssetDTO.assetNo;
      });
      //  0是指定 1是通用
      if (has(offlineCourseInfo, 'userAssetDTO') && +offlineCourseInfo.userAssetDTO.type === 0) {
        const eduCourseLittleDTO = offlineCourseInfo.eduCourseLittleDTO || {};
        this.setState({
          eduCourseId: eduCourseLittleDTO.id,
          eduCoursePlaceholder: eduCourseLittleDTO.name,
          kdtId: offlineCourseInfo.kdtId,
          shopName: offlineCourseInfo.shopName,
          offlineMode: 0,
        });
      } else {
        this.setState({
          eduCourseId: '',
          eduCoursePlaceholder: '',
          kdtId: offlineCourseInfo.kdtId,
          shopName: offlineCourseInfo.shopName,
          offlineMode: 1,
        });
      }
    }
    this.setState(
      {
        assetNo: value,
        lessonNo: '',
        // monthDate: '',
        dayDate: '',
        dayList: [],
        address: '',
        addressList: [],
      },
      () => {
        // this.getDayList();
      },
    );
  };

  handleRemarkChange = remark => {
    this.setState({ remark });
  };

  openPage = url => {
    window.open(url);
  };

  initData = () => {
    this.setState({ loading: true });
    Promise.all([
      this.getStoreList(),
      this.getAppointment(),
      this.getDefaultStudentOption(),
    ]).finally(() => {
      this.setState({ loading: false });
    });
  };

  getStoreList = () => {
    return getStoreList()
      .then((data = []) => {
        this.setState({
          storeList: data.map(item => {
            return {
              text: item.name,
              value: item.id,
            };
          }),
        });
      })
      .catch(error => {
        Notify.error(error);
      });
  };

  getAppointment = () => {
    const { defaultData = {} } = this.props;
    const { studentLessonStatus, studentLessonNo, studentId, courseType, kdtId } = defaultData;
    if (studentLessonStatus === APPOINTMENT_STATUS_TYPE.TO_BE_CONFIRMED) {
      return getAppointment({ studentLessonNo, kdtId })
        .then(data => {
          const confirmInfo = data || {};
          this.setState(
            {
              confirmInfo,
              studentId,
              courseType: courseType + '',
              monthDate: confirmInfo.intentionTime || formatDate(nowDate, 'YYYY-MM'),
              address: confirmInfo.intentionStoreId,
              eduCourseId: confirmInfo.eduCourseId || '',
              eduCoursePlaceholder: confirmInfo.eduCourseName || '',
              eduCourseName: confirmInfo.eduCourseName || '',
              kdtId: kdtId,
            },
            () => {
            // 如果预约信息里包含课程。则自动填充课程
              if (confirmInfo.eduCourseId) {
                this.handleEduCourseChange(confirmInfo.eduCourseId);
              }
            },
          );
        })
        .catch(error => {
          Notify.error(error);
        });
    } else if (studentLessonStatus === APPOINTMENT_STATUS_TYPE.TO_BE_PERFORMED) {
      // 修改预约
      return getStudentLessonForUpdate({ studentLessonNo, kdtId })
        .then(data => {
          const editInfo = data || {};
          const courseSellType = get(editInfo, 'courseAssetDTO.userAssetDTO.type');
          // 通用课时包需要将 eduCourseId 置空，选择日程时需要用到
          const eduCourseId = courseSellType === 1 ? '' : get(editInfo, 'lessonAppointmentDTO.eduCourseId', '');
          const eduCoursePlaceholder = courseSellType === 1 ? '' : get(editInfo, 'lessonAppointmentDTO.eduCourseName', '');
          const lessonAppointmentDTO = get(editInfo, 'lessonAppointmentDTO', {});
          this.setState(
            {
              editInfo,
              studentId: studentId || get(editInfo, 'studentDTO.id', 0),
              courseType: courseType + '',
              assetNo: get(editInfo, 'courseAssetDTO.userAssetDTO.assetNo', ''),
              courseName: get(editInfo, 'courseAssetDTO.courseForUpdateShowDTO.courseName', ''),
              eduCourseId: eduCourseId,
              eduCoursePlaceholder: eduCoursePlaceholder,
              eduCourseName: eduCoursePlaceholder,
              selectedLesson: {
                ...lessonAppointmentDTO,
              },
              editLessonInfo: {
                ...lessonAppointmentDTO,
              },
              kdtId: kdtId,
              remark: editInfo.remark,
            },
          );
        })
        .catch(error => {
          Notify.error(error);
        });
    } else {
      return Promise.resolve();
    }
  };

  getDefaultStudentOption = () => {
    const location = hashHistory.getCurrentLocation();
    const query = location.query;
    const studentNo = query.studentNo;
    if (!studentNo) return Promise.resolve();
    this.studentNo = studentNo;
    location.query = {};
    hashHistory.replace(location);
    return getStudentList({ filter: { studentNo }, pageRequest: {} })
      .then(data => {
        const content = (data && data.content) || [];
        const targetContent = content[0];
        if (
          targetContent &&
          targetContent.student &&
          targetContent.student.studentNo === studentNo
        ) {
          this.setState({
            studentId: targetContent.student.id,
            defaultStudent: this.formatStudentOption(targetContent),
          });
        }
      })
      .catch(error => {
        Notify.error(error);
      });
  };

  asyncValid = values => {
    const zentForm = this.props.zentForm;
    zentForm.asyncValidateForm(() => {
      if (this.state.selectedLesson) {
        this.onSubmit(values);
      } else {
        Notify.error('请选择上课日程');
      }
    });
  };

  componentDidMount() {
    // 特殊值初始化
    const { defaultData = {} } = this.props;
    if (defaultData.time) {
      this.setState({ monthDate: formatDate(defaultData.time, 'YYYY-MM') });
    }
    if (defaultData.studentId) {
      this.setState({ studentId: defaultData.studentId });

      // 学员页面新建预约
      if (defaultData.fromStudent) {
        const courseType = VersionWrapper({
          name: 'appointment-fromstudent-coursetype',
          children: [{
            name: 'basic',
            value: COURSE_TYPE.TRIAL,
          }, {
            name: 'prod',
            value: COURSE_TYPE.REGULAR,
          }],
        })[0].value;
        this.setState({ courseType: courseType }, this.handleStudentChange(defaultData.studentId));
      }
    }

    if (defaultData.shopName) {
      this.setState({ shopName: defaultData.shopName });
    }
    this.initData();
  }

  getShopList = (query, pageRequest) => {
    const { eduCourseId } = this.state;
    return getShopList({
      addAll: false,
      fetchApi() {
        return findPageByEduCourse({
          eduCourseShopQuery: {
            id: eduCourseId,
            name: query,
            kdtId: _global.kdtId,
          },
          pageRequest,
        });
      },
    });
  };

  renderIntentionAddress = () => {
    const { confirmInfo } = this.state;

    return switchWrapper({
      supportBranchStore: () => null,
      supportHqStore: () => <FakeField label="上课校区：" component={confirmInfo.shopName} />,
      supportSingleStore: () =>
        confirmInfo.intentionAddress ? (
          <FakeField label="上课地点：" component={confirmInfo.intentionAddress} />
        ) : null,
    });
  };

  onChoose = (lesson) => {
    if (lesson) {
      this.setState({
        selectedLesson: { ...lesson },
      });
    } else {
      this.setState({
        selectedLesson: null,
      });
    }
  }

  render() {
    const { handleSubmit, closeDialog, defaultData, type } = this.props;
    const {
      confirmInfo,
      editInfo,
      studentId,
      defaultStudent,
      assetNo,
      courseName,
      courseType,
      remark,
      loading,
      loadingText,
      kdtId,
      shopName,
      eduCourseId,
      eduCoursePlaceholder,
      rawAssetList,
      editLessonInfo,
    } = this.state;

    const { studentName, fromStudent } = defaultData;

    // 是否是确认预约的场景
    const isConfirm = !!confirmInfo.studentLessonNo &&
    defaultData.studentLessonStatus === APPOINTMENT_STATUS_TYPE.TO_BE_CONFIRMED;

    // 是否是编辑预约的场景
    const isEdit = !!editInfo.studentLessonNo &&
    defaultData.studentLessonStatus === APPOINTMENT_STATUS_TYPE.TO_BE_PERFORMED;

    // 是否是试听场景进来的
    const isFromTry = [APPOINTMENT_TYPE.EDIT_TRY, APPOINTMENT_TYPE.CREATE_TRY].includes(type);

    // 学员页面点击预约上课
    const isFromStudent = fromStudent && studentName;

    const eduCourseInfo = (eduCourseId !== '') ? {
      eduCourseId,
      eduCoursePlaceholder,
    } : undefined;

    // 校区信息，如果是预约，那么取的是线下课的校区信息，如果是办理试听的确认，那么是确认信息中
    const branchInfo = (function() {
      if (isConfirm) {
        return {
          kdtId: confirmInfo.kdtId,
          shopName: confirmInfo.shopName,
        };
      } else if (isEdit) {
        return {
          kdtId: editInfo.kdtId,
          shopName: editInfo.shopName,
        };
      } else {
        if (isEduHqStore && +courseType === 1) {
          return {
            kdtId,
            shopName,
          };
        } else {
          return undefined;
        }
      }
    })();

    const assetInfo = rawAssetList.find(item => item.userAssetDTO.assetNo === assetNo);

    const studentFieldDisabled = isConfirm || isEdit || isFromTry || isFromStudent;

    return (
      <BlockLoading loading={loading} iconText={loadingText}>
        <div className="appointment-dialog-content">
          <Form
            horizontal
            onSubmit={handleSubmit(this.asyncValid)}
            className="appointment-dialog-content__form"
          >
            {!!isConfirm && (
              <>
                {!!confirmInfo.courseName && (
                  <FakeField
                    label="试听课程："
                    component={
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`${PAGE_URL_MAP.serviceDetail}?alias=${confirmInfo.courseAlias}&kdt_id=${kdtId}`}
                      >
                        {confirmInfo.courseName}
                      </a>
                    }
                  />
                )}
                {!!confirmInfo.eduCourseName && (
                  <FakeField
                    label="试听课程："
                    component={
                      confirmInfo.eduCourseName
                    }
                  />
                )}
                <FakeField label="购买规格：" component={confirmInfo.sku || '-'} />
                {!!confirmInfo.intentionTime && (
                  <FakeField
                    label={'上课时间：'}
                    component={confirmInfo.intentionTime || formatDate(nowDate, 'YYYY-MM-DD HH:mm')}
                  />
                )}
                {this.renderIntentionAddress()}
              </>
            )}
            <Field
              name="studentId"
              label="学员："
              placeholder={studentFieldDisabled ? studentName : '请选择学员'}
              component={SelectQuickOperateField}
              async={!(isConfirm || isEdit)}
              mode={!(isConfirm || isEdit) ? 'async' : 'sync'}
              dropdownClassName="cover__student"
              fetchOptions={this.getStudentOptions}
              create={false}
              refresh={false}
              value={studentId}
              defaultOption={defaultStudent}
              onSelect={value => this.handleStudentChange(value)}
              disabled={!!studentFieldDisabled}
              clearable={!studentFieldDisabled}
              width="220px"
              required
              filter
              fetchOnMounted
              asyncValidation={(values, value) => {
                if (value) return Promise.resolve();
                return Promise.reject('请选择学员');
              }}
            />
            <VersionWrapper name="make-appointment-type">
              {
                (!isConfirm && !isFromTry) && (
                  <FormRadioGroupField
                    name="courseType"
                    label="预约类型："
                    value={courseType}
                    onChange={e => this.handleCourseTypeChange(e.target.value)}
                    disabled={!!(isConfirm || isEdit)}
                    required
                    validations={{ required: true }}
                    validationErrors={{
                      required: '请选择预约类型',
                    }}
                  >
                    <Radio value="0" className="appointment-dialog-content__radio">
                    预约试听
                      <p className="appointment-dialog-content__radio-extra">给未购课学员办理试听体验</p>
                    </Radio>
                    <Radio value="1" className="appointment-dialog-content__radio">
                    预约上课
                      <p className="appointment-dialog-content__radio-extra">给已购正式课的学员预约上课</p>
                    </Radio>
                  </FormRadioGroupField>
                )
              }
            </VersionWrapper>
            {+courseType === 1 && !isConfirm && (
              <>
                <Field
                  name="assetNo"
                  label="购买的线下课："
                  placeholder={isEdit ? courseName : '请选择购买的线下课'}
                  async
                  mode="async"
                  component={SelectQuickOperateField}
                  value={assetNo || []}
                  dropdownClassName="cover__purchased-assets"
                  fetchOptions={this.getCourseOptions}
                  onSelect={value => this.handleAssetNoChange(value)}
                  extraComponent={<AssetTip assetInfo={assetInfo} />}
                  autoWidth
                  showEmpty
                  disabledAsyncFilter
                  disabled={!studentId || isEdit}
                  studentId={studentId}
                  create={false}
                  refresh={false}
                  infinityScroll={false}
                  width="220px"
                  required
                  clearable
                  fetchOnOpened
                  noData="没有可供选择的选项"
                  asyncValidation={(values, value) => {
                    if (value) return Promise.resolve();
                    return Promise.reject('请选择线下课');
                  }}
                />
              </>
            )}
            <Field
              name="eduCourse"
              label="上课日程："
              width="180px"
              autoWidth
              disabled={!studentId || (+courseType === 1 && assetNo === '')}
              required
              eduCourseInfo={eduCourseInfo}
              lessonInfo={editLessonInfo}
              studentLessonNo={defaultData.studentLessonNo || ''}
              branchInfo={branchInfo}
              courseType={+courseType}
              studentId={studentId}
              assetNo={assetNo}
              component={DialogCourseField}
              onChoose={this.onChoose}
              isConfirm={!!isConfirm}
              isEdit={!!isEdit}
            />
            <FormInputField
              className="appointment-dialog-content__form-textarea"
              name="comment"
              type="textarea"
              label="备注："
              onChange={e => this.handleRemarkChange(e.target.value)}
              value={remark}
              placeholder="不超过200个字"
              width="320px"
              maxLength={200}
              autoSize
              showCount
              disabled={!studentId}
            />
            <div className="appointment-dialog-content__actions">
              <Button onClick={closeDialog}>
                取消
              </Button>
              <SamButton name="新建、修改、确认预约" type="primary" htmlType="submit">
                确定
              </SamButton>
            </div>
          </Form>
        </div>
      </BlockLoading>
    );
  }
}

const wrapped = createForm()(AppointmentDialogContent);

export default wrapped;
