import { startOfMonth, endOfMonth, startOfDay, endOfDay, format, startOfWeek, endOfWeek } from 'date-fns';
import { Dialog, Toast } from 'vant';
import Args from 'zan-utils/url/args';
import { isEduSingleStore } from '@youzan/utils-shop';
import { logMakeAppointment } from '../track';
import AppointmentApi from '../../api';
import { APPOINTMENT_STATUS, CANCEL_TYPE } from '../../constants';
import * as SafeLink from '@youzan/safe-link';
import OpenFreezeDetail from '@/vis-shared/views/edu-admin/freeze-detail';
import { STUDENT_CHECK_CODE } from '../../../constant';
import { parseCancelAppointmentRules } from '../../utils/main';
import { getThemeColor } from '@youzan/vue-theme-plugin';

const mainColor = getThemeColor('main');
console.log('mainColor', mainColor);

let clickCanAppointment = true;
export default {
  name: 'appointment',

  data() {
    return {
      studentId: 0,
      assetNo: 0,
    };
  },

  created() {
    // 页面类型
    // pageFrom=order 来源下单页
    this.pageFrom = Args.get('pageFrom');
    this.studentId = Args.get('studentId');
    this.assetNo = Args.get('assetNo');
  },

  methods: {
    fetchCalendarData() {
      let startOfDay;
      let endOfDay;
      if (this.calendarMode === 'week') {
        startOfDay = startOfWeek(this.currentMonth, { weekStartsOn: 1 });
        endOfDay = endOfWeek(this.currentMonth, { weekStartsOn: 1 });
      }
      if (this.calendarMode === 'month') {
        startOfDay = startOfMonth(this.currentMonth);
        endOfDay = endOfMonth(this.currentMonth);
      }
      return AppointmentApi
        .getCalendar({
          eduCourseIds: this.eduCourseIds,
          studentId: this.studentId,
          addressId: this.selectedAddress,
          teacherNo: this.selectedTeacher,
          assetNo: this.assetNo,
          startTime: format(startOfDay, 'YYYY-MM-DD HH:mm:ss'),
          endTime: format(endOfDay, 'YYYY-MM-DD HH:mm:ss'),
        })
        .then(res => {
          this.calendarData = res;
        })
        .catch(err => {
          console.error(err);
          Toast(err);
        })
        .finally(() => {

        });
    },

    fetchAppointmentList(isRefresh = false) {
      if (isRefresh) {
        this.pageNumber = 1;
        this.appointmentList = [];
        this.isListFinished = false;
      }
      this.isListLoading = true;

      const {
        pageNumber,
        pageSize = 10,
        eduCourseIds = '',
        studentId = 0,
      } = this;
      return AppointmentApi
        .getListByDate({
          pageNumber,
          pageSize,
          eduCourseIds,
          studentId,
          addressId: this.selectedAddress,
          teacherNo: this.selectedTeacher,
          assetNo: this.assetNo,
          startTime: format(startOfDay(this.currentDate), 'YYYY-MM-DD HH:mm:ss'),
          endTime: format(endOfDay(this.currentDate), 'YYYY-MM-DD HH:mm:ss'),
        })
        .then(res => {
          if (!res) return;

          this.appointmentList = [
            ...this.appointmentList,
            ...this.parseAppointmentList(res.content),
          ];
          this.totalPages = res.totalPages;
          if (this.pageNumber >= this.totalPages) {
            this.isListFinished = true;
          } else {
            this.isListFinished = false;
          }
          return this.appointmentList;
        })
        .catch(err => {
          console.error(err);
          Toast(err);
          this.isListFinished = true;
        })
        .finally(() => {
          this.isListLoading = false;
        });
    },

    fetchMakeAppointment(appointment) {
      AppointmentApi
        .createStudentLessonV2({
          courseType: appointment.courseType,
          comment: appointment.comment,
          lessonNo: appointment.lessonNo,
          operatorId: window._global.userId,
          studentId: this.studentInfo.id,
          assetNo: this.assetNo,
        })
        .then(res => {
          logMakeAppointment(this.pageFrom);

          this.checkCanMakeAppointment(res)
            .then(res => {
              if (res.success) {
                Toast('预约成功');
                // 学生课表编号
                this.navigateToResult(res.data);
              } else {
                setTimeout(() => {
                  this.fetchAppointmentList(true);
                }, 1000);
              };
            });
        })
        .catch(err => {
          console.error(err);
          Toast(err);
        })
        .finally(() => {
          // 预约请求结束重置
          clickCanAppointment = true;
        });
    },

    checkCanMakeAppointment(res) {
      return new Promise((resolve, reject) => {
        if (res.success) {
          resolve({ success: true, data: res.studentLessonNo });
        } else {
          const checkConfig = res.check || {};
          const checkcode = checkConfig.checkCode;
          const assetCheckInfo = checkConfig.assetCheckInfo || {};
          const lessonCheckInfo = checkConfig.lessonCheckInfo || {};

          const statusMap = {
            [STUDENT_CHECK_CODE.ALREADY_IN_LESSON]: {
              text: '已经本日程',
              extraText: '学员已预约过本课节。',
            },
            [STUDENT_CHECK_CODE.ASSET_EXPIRE]: {
              text: '课程已到期',
              extraText: `课程在上课日期（${format(lessonCheckInfo.startTime, 'M月D日')}）前已到期，\n到期日：${format(assetCheckInfo.endTime, 'YYYY-MM-DD')}。`,
            },
            [STUDENT_CHECK_CODE.ASSET_REMAINING_NOT_ENOUGH]: {
              text: '课时不足',
              extraText: `可用课时为${assetCheckInfo.available / 100}${lessonCheckInfo.consumeNum ? `，本节课需扣除${lessonCheckInfo.consumeNum / 100}课时。` : '。'}`,
            },
            [STUDENT_CHECK_CODE.ASSET_REMAINING_ENOUGH]: {
              text: '课时不足',
              extraText: `可用课时为${assetCheckInfo.available / 100}，${lessonCheckInfo.consumeNum ? `本节课需扣除${lessonCheckInfo.consumeNum / 100}课时，` : ''}有${assetCheckInfo.locked / 100}课时已被其他日程冻结，可前往取消日程。`,
            },
            [STUDENT_CHECK_CODE.QUOTA_NOT_ENOUGH]: {
              text: '名额不足',
              extraText: `课程的名额不足。`,
            },
          };

          const statusMapText = statusMap[checkcode];

          if (checkcode === STUDENT_CHECK_CODE.ALREADY_IN_LESSON) {
            Toast(statusMapText.extraText);
            resolve({ success: false });
          } else if (checkcode === STUDENT_CHECK_CODE.ASSET_REMAINING_ENOUGH) {
            this.showDialog(statusMapText.extraText, '我知道了', '前往取消', statusMapText.text)
              .then(() => resolve({ success: false }))
              .catch(() => {
                function getContentTop(stu) {
                  const checkConfig = stu.check || {};
                  const assetCheckInfo = checkConfig.assetCheckInfo || {};
                  const lessonCheckInfo = checkConfig.lessonCheckInfo || {};

                  let text = '';
                  if (assetCheckInfo.locked) {
                    text = `${lessonCheckInfo.consumeNum ? `本节课需扣减 ${lessonCheckInfo.consumeNum / 100} 课时，` : ''}剩余 ${assetCheckInfo.available / 100} 课时可用。\n有 ${assetCheckInfo.locked / 100} 课时已被冻结，可先将学员从日程中移除再操作。`;
                  } else {
                    text = '';
                  }
                  return text;
                }

                OpenFreezeDetail({
                  props: {
                    tip: getContentTop(res),
                    params: {
                      kdtId: _global.kdt_id,
                      assetNos: [assetCheckInfo.assetNo],
                    },
                    fetchPromise: (params) => AppointmentApi.findLockedPage(params).then((res = {}) => {
                      const list = res.content || [];
                      list.forEach(o => {
                        o.keyName = o.lessonNo;
                      });
                      return { list, hasNext: list.length === params.pageSize };
                    }),
                    removePromise: (selectedList) => {
                      const req = {
                        kdtId: _global.kdt_id,
                        studentLessonNos: selectedList.map(o => o.studentLessonNo),
                      };
                      return AppointmentApi.batchCancel(req);
                    },
                    buttonText: '取消预约',
                    removeSuccessText: '已取消预约',
                    themeMainColor: mainColor,
                  },
                })
                  .then(res => {
                    if (res === 'success') {
                      resolve({ success: false });
                    } else {
                      resolve({ success: false });
                    }
                  });
              });
          } else if (statusMapText) {
            Dialog.confirm({
              title: statusMapText.text,
              message: statusMapText.extraText,
              showCancelButton: false,
              confirmButtonColor: mainColor,
              className: `${checkcode === STUDENT_CHECK_CODE.ASSET_EXPIRE ? 'dialog-status' : ''}`,
              messageAlign: `${checkcode === STUDENT_CHECK_CODE.ASSET_EXPIRE ? 'left' : 'center'}`,
              confirmButtonText: '我知道了',
            })
              .then(() => {
                resolve({ success: false });
              })
              .catch(() => {
                resolve({ success: false });
              });
          } else {
            Toast(res.msg);
            setTimeout(() => {
              resolve({ success: false });
            }, 1000);
          }
        }
      });
    },

    fetchCancelAppointment(studentLessonNo) {
      AppointmentApi
        .getCancelAppointment({
          studentLessonNo,
        })
        .then(res => {
          this.fetchAppointmentList(true);
        })
        .catch(err => {
          Toast(err);
          console.error(err);
        })
        .finally(() => {

        });
    },

    parseAppointmentList(originData = []) {
      return originData
        .map(item => {
          const showMakeBtn = item.appointmentStatus === APPOINTMENT_STATUS.VALID;
          const showCancelBtn = !showMakeBtn &&
            item.appointmentStatus === APPOINTMENT_STATUS.EXISTED &&
            item.cancelAppointmentStatus === CANCEL_TYPE.ALLOWED;

          const ageValue = item.minApply === item.maxApply
            ? `${item.minApply}${item.applyType === 0 ? '个月' : '岁'}`
            : `${item.minApply}-${item.maxApply}${item.applyType === 0 ? '个月' : '岁'}`;

          return {
            addressWrapDTO: item.addressWrapDTO,
            courseType: item.courseType,
            studentLessonNo: item.studentLessonNo,
            lessonNo: item.lessonNo,
            title: item.lessonContent || item.eduCourseName,
            canCancel: !!item.canCancelAppointmentSetting,
            actionName: showMakeBtn
              ? 'make-appointment'
              : showCancelBtn
                ? 'cancel-appointment'
                : '',
            actionText: showMakeBtn
              ? '预约'
              : showCancelBtn
                ? '取消'
                : '',
            actionType: showMakeBtn
              ? 'primary'
              : showCancelBtn
                ? 'text'
                : '',
            statusText: [
              '',
              '已预约',
              '无需预约',
              '未到预约时间',
              '已超过预约时间',
              '已约满',
            ][item.appointmentStatus],
            stock: item.stock,
            appointmentCountLimit: item.appointmentCountLimit,
            startTime: item.startTime,
            endTime: item.endTime,
            addressId: item.addressId,
            applyType: item.applyType,
            maxApply: item.maxApply,
            minApply: item.minApply,
            bodyList: [
              { icon: 'course', value: item.eduCourseName, hidden: !item.lessonContent },
              { icon: 'time', value: `${format(item.startTime, 'HH:mm')}-${format(item.endTime, 'HH:mm')}` },
            ],
            moreInfo: [
              isEduSingleStore ? { name: '上课地点', value: item.addressName, hidden: !item.addressName }
                : { name: '上课校区', value: item.shopName, hidden: !item.shopName },
              { name: '教室', value: item.classRoomName, hidden: !item.classRoomName },
              // 没有设置则隐藏
              { name: '适合年龄', value: ageValue, hidden: item.minApply === 10000 },
              { name: '老师', value: item.teacherName, hidden: !item.teacherName },
              {
                name: '助教',
                value: item.assistantNames && item.assistantNames.join('、'),
                hidden: !item.assistantNames ||
                  (Array.isArray(item.assistantNames) && item.assistantNames.length === 0),
              },
              // 无需预约时异常
              { name: '剩余名额', value: item.stock, hidden: item.appointmentStatus === 2 },
              { name: '消耗课时', value: item.cost / 100, hidden: !item.cost },
              {
                name: '取消规则',
                value: parseCancelAppointmentRules(item),
                hidden: !parseCancelAppointmentRules(item),
              },
            ],
          };
        });
    },

    navigateToResult(studentLessonNo) {
      SafeLink.redirect({
        url: `/wscvis/edu/appointment/result?kdt_id=${window._global.kdt_id}&studentLessonNo=${studentLessonNo}`,
        kdtId: window._global.kdt_id,
      });
    },

    showDialog(message, buttonText = '继续预约', cancelButtonText = '取消', title = '') {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          Dialog.confirm({
            title,
            message,
            confirmButtonText: buttonText,
            cancelButtonText,
            confirmButtonColor: mainColor,
          })
            .then(() => {
              resolve();
            })
            .catch(() => {
              reject();
            });
        }, 300);
      });
    },

    onAppointmentCancel({ studentLessonNo, stock = '', appointmentCountLimit = '' }) {
      this.showDialog(`当前预约剩余名额${stock}/${appointmentCountLimit}，确定取消预约吗？`, '取消预约')
        .then(() => this.fetchCancelAppointment(studentLessonNo));
    },

    onAppointmentMake(appointment) {
      if (!clickCanAppointment) {
        return;
      }
      clickCanAppointment = false;
      const [isAgeSuitable, ageMessage] = this.getAgeSuitable(appointment);
      const { canCancel } = appointment;
      let promise = Promise.resolve();

      const conflictQuery = {
        kdtId: _global.kdt_id,
        startTime: format(appointment.startTime, 'YYYY-MM-DD HH:mm:ss'),
        endTime: format(appointment.endTime, 'YYYY-MM-DD HH:mm:ss'),
        studentIds: [this.studentId],
      };
      AppointmentApi.detectConflict(conflictQuery).then((res) => {
        if (res && res.hasConflict) {
          promise = promise.then(() => this.showDialog(`${res.conflictMsg}，继续预约？`, '继续预约', '我再想想'));
        }

        if (!isAgeSuitable) {
          promise = promise.then(() => this.showDialog(ageMessage));
        }
        if (!canCancel) {
          const {
            name,
          } = this.studentInfo;
          promise = promise.then(() => this.showDialog(`确定预约${name}的${format(appointment.startTime, 'HH:mm')}-${format(appointment.endTime, 'HH:mm')}${appointment.title}吗？\n确定预约后无法取消。`));
        }
        promise.then(() => this.fetchMakeAppointment(appointment)).catch(() => {
          // 弹框取消重置
          console.log('取消弹框');

          clickCanAppointment = true;
        });
      }).catch(err => {
        // 冲突请求失败重置
        clickCanAppointment = true;
        Toast(err);
      });
    },
  },
};
