<template>
  <div class="book-listen-wrapper">
    <div
      v-if="isConfirm"
      class="book-listen-notice"
    >
      <div class="book-listen-notice-title">
        <van-icon class="book-listen-notice-title-icon" name="info" />
        学员的报名信息
      </div>
      <div class="book-listen-notice-info">
        <p v-for="(item, index) in studentBuyInfos" :key="index" class="book-listen-notice-info-item">
          {{ item.title }}: {{ item.value }}
        </p>
      </div>
    </div>

    <div class="book-listen-container">
      <div class="book-listen-container__stu wrap">
        <van-cell
          :class="[isDisabled ? 'disabled' : '', studentId ? 'active' : '']"
          title="学员"
          :is-link="!isDisabled"
          @click="onSelectStudent()"
        >
          <template v-if="studentId">
            <span>{{ selectedStu.name }} </span>
            <span>{{ selectedStu.mobile }}</span>
          </template>
          <span v-else>(必填)请选择学员</span>
        </van-cell>
      </div>

      <div class="wrap">
        <van-cell-group>
          <van-cell
            :class="selectedSchedule.lessonNo ? 'active' : ''"
            title="上课日程"
            is-link
            @click="onSelectSchedule"
          >
            <template v-if="selectedSchedule.lessonNo">
              <p>{{ selectedSchedule.lessonDate }} {{ selectedSchedule.lessonTime }}</p>
              <p>{{ selectedSchedule.lessonName }}</p>
            </template>
            <span v-else>(必填)请选择上课日程</span>
          </van-cell>
          <van-cell
            v-if="selectedSchedule.addressName"
            class="active"
            title="上课地点"
          >
            {{ selectedSchedule.addressName }}
          </van-cell>
          <van-cell
            v-if="selectedSchedule.teacherName"
            class="active"
            title="上课老师"
          >
            {{ selectedSchedule.teacherName }}
          </van-cell>
        </van-cell-group>
      </div>

      <div class="wrap comment">
        <span class="text-num">{{ comment.length }}/200</span>
        <van-field
          v-model="comment"
          type="textarea"
          placeholder="请输入备注"
          rows="4"
          maxlength="200"
        />
      </div>

      <div class="book-listen-container__button">
        <van-button
          :class="['book-listen-container__button-save', isCanSave ? 'active' : '']"
          round
          @click="onSave"
        >
          保存
        </van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Cell, CellGroup, Dialog, Field, Button, Toast, Icon } from 'vant';
import Args from 'zan-utils/url/args';
import { APPOINTMENT_STATUS_TYPE, APPOINTMENT_TYPE } from '../../constants';
import get from 'lodash/get';

export default {
  name: 'book-listen',

  components: {
    'van-cell-group': CellGroup,
    'van-cell': Cell,
    'van-field': Field,
    'van-button': Button,
    'van-icon': Icon,
  },

  data() {
    return {
      studentInfo: '(必填)请选择学员',
      schedule: '(必填)请选择上课日程',
      address: '请选择上课地点',
      teacherName: '',
      comment: '',
      studentLessonNo: Args.get('studentLessonNo') || '',
      clueId: Args.get('clueId') || 0,
      type: Args.get('type'),
      fetched: false,
      studentLessonStatus: +Args.get('studentLessonStatus'),
      studentBuyInfos: [], // 用户购买信息
    };
  },

  computed: {
    isCanSave() {
      return this.studentId && this.selectedSchedule.lessonNo;
    },

    isDisabled() {
      return !!this.studentId && (this.isEdit || this.isConfirm || this.isFromTry);
    },

    isConfirm() {
      return this.studentLessonStatus === APPOINTMENT_STATUS_TYPE.TO_BE_CONFIRMED;
    },

    isFromTry() {
      return [APPOINTMENT_TYPE.EDIT_TRY, APPOINTMENT_TYPE.CREATE_TRY].includes(this.type);
    },

    isEdit() {
      return this.studentLessonStatus === APPOINTMENT_STATUS_TYPE.TO_BE_PERFORMED;
    },

    selectedSchedule() {
      return this.$store.state.selectedSchedule || {};
    },

    selectedStu() {
      return this.$store.state.selectedStu || {};
    },

    studentId() {
      return this.selectedStu.id || (Args.get('studentId') || 0);
    },
  },

  created() {
    if (this.studentLessonNo) {
      this.fetchAppointment();
    } else if (this.studentId) {
      this.fetchStudents();
    } else {
    }

    this.setPageTitle();
  },

  methods: {
    setPageTitle() {
      if (this.isEdit) {
        document.title = '修改试听';
      } else if (this.isConfirm) {
        document.title = '确认';
      } else {
        document.title = '办理试听';
      }
    },
    getStudentBuyInfos(res) {
      return [
        {
          title: '购买的体验课',
          value: res.courseName,
        },
        {
          title: '规格',
          value: res.sku,
        },
        {
          title: '意向上课时间',
          value: res.intentionTime,
        },
      ].filter(o => !!o.value);
    },
    fetchAppointment() {
      if (this.isConfirm) {
        this.$store
          .dispatch('fetchAppointment', { studentLessonNo: this.studentLessonNo })
          .then(res => {
            const selectedStu = {
              name: res.studentName,
              id: this.studentId,
            };
            this.studentBuyInfos = this.getStudentBuyInfos(res);
            this.$store.dispatch('updateSelectedStu', selectedStu);
          })
          .finally(() => {
            this.fetched = true;
          });
      } else if (this.isEdit) {
        this.$store
          .dispatch('getStudentLessonForUpdate', { studentLessonNo: this.studentLessonNo })
          .then(res => {
            const selectedStu = {
              name: get(res, 'studentDTO.name', ''),
              id: get(res, 'studentDTO.id', 0),
            };
            !this.comment && (this.comment = get(res, 'remark', ''));
            this.$store.dispatch('updateSelectedStu', selectedStu);
            this.$store.dispatch('updateSelectedSchedule', get(res, 'lessonAppointmentDTO', {}));
          })
          .finally(() => {
            this.fetched = true;
          });
      }
    },

    fetchStudents() {
      console.log('this.studentId', this.studentId);

      const filter = {
        studentNo: this.studentId,
      };

      this.$store.dispatch('fetchStudents', { filter }).then((res = {}) => {
        const content = res.content;
        this.$store.dispatch('updateSelectedStu', content[0].student);
      });
    },

    onSelectStudent() {
      if (!this.isDisabled) {
        this.$router.push({ path: 'student-list' });
      }
    },

    onSelectSchedule() {
      if (this.selectedStu.id) {
        this.$router.push({
          path: 'schedule-list',
          query: {
            studentId: this.selectedStu.id,
            selectedLessonNo: this.selectedSchedule.lessonNo,
          },
        });
      } else {
        Toast('请先选择学员');
      }
    },

    detectConflict() {
      const lessonDate = this.selectedSchedule.lessonDate.replace(/\//g, '-'); // '2019-09-15'
      const lessonTime = this.selectedSchedule.lessonTime.split('-'); // ["19:00", "20:00"]
      const conflictQuery = {
        kdtId: _global.kdtId,
        studentIds: [this.selectedStu.id],
        startTime: lessonDate + ' ' + lessonTime[0] + ':00', // '2019-09-15 10:00:00'
        endTime: lessonDate + ' ' + lessonTime[1] + ':00', // '2019-09-15 11:00:00'
      };

      this.isEdit && (conflictQuery.excludeStudentLessonNos = [this.studentLessonNo]);

      return this.$store.dispatch('detectConflict', conflictQuery)
        .then(({ hasConflict, conflictMsg }) => {
          if (hasConflict) {
            return Dialog.confirm({
              message: `${conflictMsg}，继续${this.isEdit ? '修改' : '添加'}？`,
              confirmButtonText: `继续${this.isEdit ? '修改' : '创建'}`,
              cancelButtonText: '我再想想',
            });
          }
        });
    },

    // 试听占用名额校验
    detectTrialCourseOccupyQuota(values, lessonInfo) {
      return new Promise((resolve, reject) => {
        // 试听课
        if (+values.courseType === 0) {
          // 学员预约后才可上课, 试听占用名额, 且日程已满员
          if (+lessonInfo.appointRule === 1 &&
            +lessonInfo.trialCourseOccupyQuota === 1 &&
            +lessonInfo.appointNumLeft <= 0
          ) {
            Toast('所选择的日程，无剩余名额；请重新选择');
            return reject(false);
          }

          // 确认预约时满员提醒
          if (+lessonInfo.appointRule === 1 && +lessonInfo.appointNumLeft <= 0) {
            // 连续多个 dialog 会出现重叠的 bug，待 vant 修复
            return setTimeout(() => {
              Dialog.confirm({
                message: `该上课日程已满员（上限${lessonInfo.maxAppointNum}人），是否仍然预约？`,
                confirmButtonText: '确定预约',
                cancelButtonText: '取消',
              })
                .then(() => {
                  return resolve(true);
                })
                .catch(() => {
                  return resolve(false);
                });
            }, 500);
          }
          return resolve(true);
        }
        return resolve(true);
      });
    },

    // 临时处理办理预约的异常状态
    showAppointmentCallback(res) {
      return new Promise((resolve, reject) => {
        const check = res.check || {};
        const checkCode = check.checkCode;
        if (checkCode === 0) {
          resolve({ success: true });
        } else if (checkCode === 1) {
          Toast('学员已预约过本节课');
        } else if (checkCode === 40) {
          Toast('所选择的日程无剩余名额，请重新选择。');
        } else if (checkCode === 100) {
          Toast('学员已被移除');
        } else {
          Toast(check.msg || check.message || '');
        }
      });
    },

    onSave() {
      if (this.isCanSave) {
        const params = {
          lessonNo: this.selectedSchedule.lessonNo,
          comment: this.comment,
          courseType: 0,
          studentId: this.selectedStu.id,
          kdtId: this.selectedSchedule.kdtId || _global.kdtId,
        };
        if (this.studentLessonNo) {
          params.studentLessonNo = this.studentLessonNo;
        }

        this.detectConflict().then(() => {
          return this.detectTrialCourseOccupyQuota(params, this.selectedSchedule);
        }).then((canAppoint) => {
          if (!canAppoint) {
            return;
          }

          if (this.isConfirm) {
            this.$store.dispatch('confirmAppointment', params)
              .then(res => {
                this.$router.go(-1);
              })
              .catch(e => {
                Toast(e.msg || e);
              });
          } else if (this.isEdit) {
            setTimeout(() => {
              Dialog.confirm({
                title: '确认修改预约',
                message: `修改预约后，会先取消学员原预约日程\n确认修改吗？`,
                confirmButtonText: '确定预约',
                cancelButtonText: '取消',
              })
                .then(() => {
                  this.$store.dispatch('updateAppointment', params)
                    .then(res => {
                      this.showAppointmentCallback(res)
                        .then(async ({ success }) => {
                          if (success) {
                            Toast.loading({
                              message: '获取结果中...',
                              duration: 0,
                              forbidClick: true,
                            });
                            try {
                              await this.$store.dispatch('pollUpdateResult', {
                                originStudentLessonNo: res.originStudentLessonNo,
                                studentLessonNo: res.studentLessonNo,
                                kdtId: this.selectedSchedule.kdtId || _global.kdtId,
                              });
                              Toast('修改试听成功');
                            } catch (error) {
                              Toast(error);
                            }
                            setTimeout(() => {
                              this.$router.go(-1);
                            }, 1000);
                          }
                        });
                    })
                    .catch(e => {
                      Toast(e.msg || e);
                    });
                });
            }, 500);
          } else {
            this.$store.dispatch('createAppointment', params)
              .then(res => {
                this.showAppointmentCallback(res)
                  .then(({ success }) => {
                    if (success) {
                      Toast('办理试听成功');
                      setTimeout(() => {
                        this.$router.go(-1);
                      }, 1000);
                    }
                  });
              })
              .catch(e => {
                Toast(e.msg || e);
              });
          }
        });
      }
    },
  },
};
</script>

<style lang="postcss">
.book-listen-wrapper {
  overflow: hidden;
  background-color: #f2f2f2;
}

.book-listen-notice {
  background-color: #E8EFFA;
  padding: 12px 0;

  &-title {
    color: #323233;
    margin-bottom: 8px;
    font-size: 14px;
    line-height: 20px;
    display: flex;
    align-items: center;
    font-weight: bold;
  }

  &-title-icon {
    color: #5487DF;
    margin-right: 4px;
    font-size: 16px;
    margin-left: 16px;
  }

  &-info {
    color: #646566;
    font-size: 14px;
    margin-left: 36px;

    &-item {
      line-height: 20px;
    }
  }
}

.book-listen-container {
  min-height: 100vh;
  margin: 10px;

  .wrap {
    margin-bottom: 10px;
    border-radius: 6px;
    background-color: #fff;
    overflow: hidden;

    .van-cell {
      background-color: transparent;
      font-size: 14px;
      color: #646566;

      &__value {
        text-align: left;
        flex: 3;
        color: #ccc;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      &.active {
        .van-cell__value {
          color: #323233;
        }
      }

      &.disabled {
        background-color: #f8f8f8;

        .van-cell__value {
          color: #969799;
        }
      }

      &__right-icon {
        align-self: center;
      }
    }

    .van-cell:not(:last-child)::after {
      right: 15px;
    }

    .van-cell-group {
      background-color: transparent;
    }

    &.comment {
      position: relative;
      padding-bottom: 15px;

      .text-num {
        position: absolute;
        bottom: 10px;
        right: 15px;
        font-size: 12px;
        color: #c8c9cc;
      }
    }
  }

  &__schedule {
    width: 100%;
    height: 100%;
    top: 0;
    background-color: #f2f2f2;
    transform: none;
  }

  &__student {
    width: 100%;
    height: 100%;
  }

  &__button {
    position: fixed;
    left: 0;
    bottom: 20px;
    width: 100%;
    height: 44px;
    padding: 0 10px;
    font-size: 16px;

    &-save {
      width: 100%;
      color: #969699;
      background-color: #dcdee0;

      &.active {
        color: #fff;
        background-color: #00b389;
      }
    }
  }
}
</style>
