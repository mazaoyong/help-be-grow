import { startOfMonth, endOfMonth, startOfDay, endOfDay, format, startOfWeek, endOfWeek } from 'date-fns';
import { Dialog, Toast } from 'vant';
import Args from 'zan-utils/url/args';
import { isEduSingleStore } from '@youzan/utils-shop';
import AppointmentApi from '../../api';
import { APPOINTMENT_STATUS, CANCEL_TYPE } from '../../constants';
import { parseCancelAppointmentRules } from '../../utils/main';
import * as SafeLink from '@youzan/safe-link';
import { ZNB } from '@youzan/wxsdk';

// 因为涉及到了跳回小程序下单页的逻辑，所以这里统一处理跳转
const handleRedirect = (query) => {
  const callbackUrl = Args.get('callback_url');
  const prevPage = document.referrer;
  // 跳回小程序下单页
  if (callbackUrl === 'WEAPP_BACK_ACTION') {
    query.type = 'chosenAppointment';
    ZNB.postMessage({
      data: query,
    })
      .then(() => {
        ZNB.back();
      })
      .catch((err) => {
        console.error('跳回小程序失败：', err);
      });
  } else if (prevPage) {
    const location = Args.add(prevPage, query);
    SafeLink.redirect({
      url: location,
      kdtId: window._global.kdt_id,
      redirectType: 'replace',
    });
  } else {
    history.go(-1);
  }
};

export default {
  data() {
    return {
      productAlias: '',
      studentId: 0,
      skuId: 0,
    };
  },
  created() {
    console.log('from order');

    this.studentId = Args.get('studentId');
    this.productAlias = Args.get('productAlias');
    this.skuId = Args.get('skuId');
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
      return AppointmentApi.getCalendarForOrder({
        productAlias: this.productAlias,
        studentId: this.studentId,
        startTime: format(startOfDay, 'YYYY-MM-DD HH:mm:ss'),
        endTime: format(endOfDay, 'YYYY-MM-DD HH:mm:ss'),
        skuId: this.skuId,
        queryEduCourseIds: this.eduCourseIds,
        addressId: this.selectedAddress,
        teacherNo: this.selectedTeacher,
      })
        .then((res) => {
          this.calendarData = res;
        })
        .catch((err) => {
          console.error(err);
          Toast(err);
        })
        .finally(() => {});
    },

    fetchAppointmentList(isRefresh = false) {
      if (isRefresh) {
        this.pageNumber = 1;
        this.appointmentList = [];
        this.isListFinished = false;
      }
      this.isListLoading = true;

      const { pageNumber, pageSize = 10, studentId = 0 } = this;
      return AppointmentApi.getListByDateForOrder({
        pageNumber,
        pageSize,
        productAlias: this.productAlias,
        studentId,
        skuId: this.skuId,
        startTime: format(startOfDay(this.currentDate), 'YYYY-MM-DD HH:mm:ss'),
        endTime: format(endOfDay(this.currentDate), 'YYYY-MM-DD HH:mm:ss'),
        queryEduCourseIds: this.eduCourseIds,
        addressId: this.selectedAddress,
        teacherNo: this.selectedTeacher,
      })
        .then((response) => {
          if (response && response.code === 0) {
            const res = response.data;
            if (!res) return;

            this.appointmentList = [...this.appointmentList, ...this.parseAppointmentList(res.content)];
            this.totalPages = res.totalPages;
            if (this.pageNumber >= this.totalPages) {
              this.isListFinished = true;
            } else {
              this.isListFinished = false;
            }
            return this.appointmentList;
          } else {
            return Promise.reject(response);
          }
        })
        .catch((err = {}) => {
          console.error(err);
          if (err.code !== 9999) {
            Toast(err.msg || err.message);
          }
          this.isListFinished = true;
        })
        .finally(() => {
          this.isListLoading = false;
        });
    },

    parseAppointmentList(originData = []) {
      return originData.map((item) => {
        const showMakeBtn = item.appointmentStatus === APPOINTMENT_STATUS.VALID;
        const showCancelBtn =
          !showMakeBtn &&
          item.appointmentStatus === APPOINTMENT_STATUS.EXISTED &&
          item.cancelAppointmentStatus === CANCEL_TYPE.ALLOWED;

        const ageValue =
          item.minApply === item.maxApply
            ? `${item.minApply}${item.applyType === 0 ? '个月' : '岁'}`
            : `${item.minApply}-${item.maxApply}${item.applyType === 0 ? '个月' : '岁'}`;

        return {
          addressWrapDTO: item.addressWrapDTO,
          courseType: item.courseType,
          studentLessonNo: item.studentLessonNo,
          lessonNo: item.lessonNo,
          lessonContent: item.lessonContent,
          title: item.lessonContent || item.eduCourseName,
          canCancel: !!item.canCancelAppointmentSetting,
          actionName: showMakeBtn ? 'make-appointment' : showCancelBtn ? 'cancel-appointment' : '',
          actionText: showMakeBtn ? '预约' : showCancelBtn ? '取消' : '',
          actionType: showMakeBtn ? 'primary' : showCancelBtn ? 'text' : '',
          statusText: ['', '已预约', '无需预约', '未到预约时间', '已超过预约时间', '已约满'][item.appointmentStatus],
          stock: item.stock,
          appointmentCountLimit: item.appointmentCountLimit,
          startTime: item.startTime,
          endTime: item.endTime,
          addressId: item.addressId,
          addressName: item.addressName,
          applyType: item.applyType,
          maxApply: item.maxApply,
          minApply: item.minApply,
          bodyList: [
            { icon: 'course', value: item.eduCourseName, hidden: !item.lessonContent },
            { icon: 'time', value: `${format(item.startTime, 'HH:mm')}-${format(item.endTime, 'HH:mm')}` },
          ],
          moreInfo: [
            isEduSingleStore
              ? { name: '上课地点', value: item.addressName, hidden: !item.addressName }
              : { name: '上课校区', value: item.shopName, hidden: !item.shopName },
            { name: '教室', value: item.classRoomName, hidden: !item.classRoomName },
            // 没有设置则隐藏
            { name: '适合年龄', value: ageValue, hidden: item.minApply === 10000 },
            { name: '老师', value: item.teacherName, hidden: !item.teacherName },
            {
              name: '助教',
              value: item.assistantNames && item.assistantNames.join('、'),
              hidden: !item.assistantNames || (Array.isArray(item.assistantNames) && item.assistantNames.length === 0),
            },
            // 无需预约时异常
            { name: '剩余名额', value: item.stock, hidden: item.appointmentStatus !== 0 },
            { name: '消耗课时', value: item.cost / 100, hidden: !item.cost },
            {
              name: '取消规则',
              value: parseCancelAppointmentRules(item),
              hidden: !parseCancelAppointmentRules(item),
            },
          ],
          checked: false,
        };
      });
    },

    navigateToResult(studentLessonNo) {
      SafeLink.redirect({
        url: `/wscvis/edu/appointment/result?kdt_id=${window._global.kdt_id}&studentLessonNo=${studentLessonNo}`,
        kdtId: window._global.kdt_id,
      });
    },

    showDialog(message, buttonText = '继续预约', cancelButtonText = '取消') {
      return Dialog.confirm({
        message,
        confirmButtonText: buttonText,
        cancelButtonText,
      });
    },

    showAlert(message, buttonText = '确认') {
      return Dialog.alert({
        message,
        confirmButtonText: buttonText,
      });
    },

    onCheckedInfoCard(appointment, checked) {
      console.log('onCheckedInfoCard', appointment.lessonNo, checked);
      const lessonNo = appointment.lessonNo;

      if (checked) {
        this.appointmentList.forEach((item) => {
          if (item.lessonNo === lessonNo) {
            item.checked = true;
          } else {
            item.checked = false;
          }
        });
      } else {
        appointment.checked = false;
      }
    },

    checkAppointment(appointment) {
      const [isAgeSuitable, ageMessage] = this.getAgeSuitable(appointment);
      let promise = Promise.resolve();

      const conflictQuery = {
        kdtId: _global.kdt_id,
        startTime: format(appointment.startTime, 'YYYY-MM-DD HH:mm:ss'),
        endTime: format(appointment.endTime, 'YYYY-MM-DD HH:mm:ss'),
        studentIds: [this.studentId],
      };
      return AppointmentApi.detectConflict(conflictQuery).then((res) => {
        if (res && res.hasConflict) {
          promise = promise.then(() => this.showDialog(`${res.conflictMsg}，继续预约？`, '继续预约', '我再想想'));
        }

        if (!isAgeSuitable) {
          promise = promise.then(() => this.showDialog(ageMessage));
        }

        return promise;
      });
    },

    onFooterConfirmMixinsOrder(value) {
      let lessonName = '';
      try {
        lessonName = encodeURIComponent(value.lessonContent || value.title);
      } catch (error) {}

      this.checkAppointment(value).then(() => {
        AppointmentApi.canTradeWithLessonAppointmentInfo({
          lessonNo: value.lessonNo,
          skuId: `${this.skuId}`,
          alias: this.productAlias,
          studentId: this.studentId,
        })
          .then((response) => {
            if (response.code === 0) {
              const res = response.data;
              if (res) {
                const addressId = value.addressId || '';
                const addressName = value.addressName || '';
                handleRedirect({
                  appointmentTime: `[${value.startTime},${value.endTime}]`,
                  appointmentLesson: value.lessonNo,
                  appointmentLessonName: lessonName,
                  appointmentAddressId: addressId,
                  appointmentAddressName: addressName,
                });
              }
            } else {
              return Promise.reject(response);
            }
          })
          .catch((err = {}) => {
            if (err.code === 9999) {
              this.showAlert('网络异常，可点击“暂不选择”继续下单', '知道了');
            } else {
              this.showAlert(err.msg || err.message || '不可预约，请重新选择预约时间', '知道了');
            }
          });
      });
    },

    onFooterCloseMixinsOrder() {
      handleRedirect({
        appointmentTime: [],
        appointmentLesson: -1,
        appointmentLessonName: '',
        appointmentAddressId: '',
        appointmentAddressName: '',
      });
    },
  },
};
