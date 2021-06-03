<template>
  <vis-page-container>
    <login-tip v-if="isShowLoginTip" />
    <div class="appointment-list">
      <template v-if="appointmentList.length">
        <div class="appointment-list__header">
          请选择需要预约的课程
        </div>
        <version-wrapper name="userCenterAppoint">
          <info-card
            v-for="appointment in appointmentList"
            :key="appointment.id"
            :title="appointment.courseName || appointment.eduCourseName"
            :subtitle="getSubtitle(appointment)"
            :show-action="!!appointment.validity"
            :show-status="!appointment.validity"
            :body-name-width="53"
            :body-list="appointment.infoList"
            action-name="make-appointment"
            action-text="预约"
            status-text="未生效"
            @make-appointment="onAppointmentMake(appointment.eduCourseIds,
                                                 appointment.studentId,
                                                 appointment.assetNo,
                                                 appointment.kdtId,
                                                 appointment.assetType)"
          />
        </version-wrapper>
      </template>

      <no-course
        v-else
        class="appointment-list__no-course"
        desc="暂无可预约的课程"
      />
    </div>
  </vis-page-container>
</template>

<script>
import { format } from 'date-fns';
import { Toast } from 'vant';
import Args from 'zan-utils/url/args';
import { InfoCard } from '@youzan/vis-ui';
import LoginTip from '@/components/login-tip';
import * as SafeLink from '@youzan/safe-link';
import { VersionWrapper } from '@/vis-shared/configs/version/components';
import VisPageContainer from '../../components/page-container';
import NoCourse from '../../components/no-course';
import AppointmentApi from '../api';
import {
  COURSE_SELL_TYPE,
  COURSE_VALIDITY_UNIT,
  ASSET_VALID_TYPE,
} from '../constants';

export default {
  name: 'appointment-list',

  components: {
    InfoCard,
    VisPageContainer,
    NoCourse,
    LoginTip,
    VersionWrapper,
  },

  data() {
    return {
      // alias: '',
      orderNo: '',
      pageFrom: '',
      appointmentList: [],
      isShowLoginTip: !_global.buyer_id, // 如果没有buyerId，则没有用手机号登录
    };
  },

  created() {
    // 获取 orderNo
    // 如果是支付完成页直接跳转过来的，直接跳转至指定线下课的预约详情页
    // this.alias = Args.get('alias');
    this.orderNo = Args.get('orderNo');
    this.assetsNo = Args.get('assetNo');
    this.pageFrom = Args.get('pageFrom');
    // 获取数据
    this.fetchAppointmentList();
  },

  methods: {
    fetchAppointmentList() {
      return AppointmentApi
        .getAppointmentList()
        .then(res => {
          if (!res) return;

          // 如果存在 orderNo, 获取 orderNo 对应的课程信息
          let targetCourse;

          this.appointmentList = res.map(item => {
            const appointment = { ...item };

            const infoList = [];
            if (item.sellType === COURSE_SELL_TYPE.TIMES) {
              infoList.push({
                name: '课时',
                value: `剩余${item.assetRemaining / 100}/${item.assetAmount / 100}`,
              });
            }
            // else if (item.sellType === COURSE_SELL_TYPE.CUSTOM) {
            //   infoList.push({
            //     name: item.specifications.join(' | '),
            //     className: 'list-item--specification',
            //   });
            // }

            // 判断有效期
            switch (item.assetValidityType) {
              case ASSET_VALID_TYPE.FOREVER:
                infoList.push({
                  name: '有效期',
                  value: '永久有效',
                });
                break;
              case ASSET_VALID_TYPE.FIXED:
                infoList.push({
                  name: '有效期',
                  value: `${format(item.assetStartTime, 'YYYY[年]MM[月]DD[日]')}-${format(item.assetEndTime, 'YYYY[年]MM[月]DD[日]')}`,
                });
                break;
              case ASSET_VALID_TYPE.USED:
                // 签到后生效，如果已生效则展示时间段，根据是否返回来判断
                if (item.assetStartTime && item.assetEndTime) {
                  infoList.push({
                    name: '有效期',
                    value: `${format(item.assetStartTime, 'YYYY[年]MM[月]DD[日]')}-${format(item.assetEndTime, 'YYYY[年]MM[月]DD[日]')}`,
                  });
                } else {
                  infoList.push({
                    name: '有效期',
                    value: `${item.validityTime}${COURSE_VALIDITY_UNIT[item.validityUnit]}（首次上课签到后生效）`,
                  });
                }
                break;
              // 自定义销售
              case ASSET_VALID_TYPE.CUSTOM:
                if (item.assetStartTime && item.assetEndTime) {
                  infoList.push({
                    name: '有效期',
                    value: `${format(item.assetStartTime, 'YYYY[年]MM[月]DD[日]')}-${format(item.assetEndTime, 'YYYY[年]MM[月]DD[日]')}`,
                  });
                }
                break;
              default:
                break;
            }

            // 学员信息
            infoList.push({
              name: '学员',
              value: item.studentName,
            });
            appointment.infoList = infoList;

            // 如果存在 orderNo, 获取 orderNo 对应的课程信息
            if (this.orderNo && appointment.orderNo === this.orderNo) {
              targetCourse = appointment;
            }

            return appointment;
          });

          // 如果是支付完成页直接跳转过来的，直接跳转至指定线下课的预约详情页
          if (this.orderNo && targetCourse && targetCourse.validity) {
            const {
              eduCourseIds,
              studentId,
              assetNo,
              kdtId,
              assetType,
            } = targetCourse;
            this.navigateToCreate(eduCourseIds, studentId, assetNo, kdtId, true, assetType);
            return;
          }

          // 如果只有一条数据，则直接跳转到预约日历页
          if (!this.orderNo && this.appointmentList.length === 1 && this.appointmentList[0].validity) {
            const {
              eduCourseIds,
              studentId,
              assetNo,
              kdtId,
              assetType,
            } = this.appointmentList[0];
            this.navigateToCreate(eduCourseIds, studentId, assetNo, kdtId, true, assetType);
          }

          // 如果是从课程主页直接跳转过来的，直接跳转到指定线下课的预约详情页
          if (!this.orderNo && this.assetsNo) {
            this.appointmentList.forEach(appointment => {
              if (appointment.assetNo === this.assetsNo && appointment.validity) {
                const {
                  eduCourseIds,
                  studentId,
                  assetNo,
                  kdtId,
                  assetType,
                } = appointment;
                this.navigateToCreate(eduCourseIds, studentId, assetNo, kdtId, false, assetType);
              };
            });
          }
        })
        .catch(err => {
          console.log(err);
          Toast(err);
        })
        .finally(() => {

        });
    },

    getSubtitle(appointment) {
      if (appointment.sellType === COURSE_SELL_TYPE.CUSTOM && appointment.specifications) {
        return appointment.specifications.join(' | ');
      } else {
        return '';
      }
    },

    /**
     * 跳转至预约上课页
     */
    navigateToCreate(
      eduCourseIds = '',
      studentId,
      assetNo,
      targetKdtId,
      isAutoJump = false,
      assetType,
    ) {
      if (isAutoJump) {
        const sessionStorage = window.sessionStorage;
        const autoJumpFlag = sessionStorage.getItem('edu:appointmentlist:autojumpflag');
        if (autoJumpFlag) {
          return;
        }

        sessionStorage.setItem('edu:appointmentlist:autojumpflag', 1);
      }

      const pageCreateUrl = '/wscvis/edu/appointment/create';
      const reUrl = `${pageCreateUrl}?kdt_id=${targetKdtId}&eduCourseIds=${eduCourseIds}&studentId=${studentId}&assetNo=${assetNo}&applycourseType=${assetType}&pageFrom=${this.pageFrom}`;
      SafeLink.redirect({
        url: reUrl,
        kdtId: targetKdtId,
      });
    },

    onAppointmentMake(eduCourseIds, studentId, assetNo, targetKdtId, assetType) {
      this.navigateToCreate(eduCourseIds, studentId, assetNo, targetKdtId, false, assetType);
    },
  },
};
</script>

<style lang="scss">
.appointment-list {
  padding: 15px 15px 0;

  .list-item--specification {
    width: auto !important;
  }

  &__header {
    line-height: 17px;
    font-size: 12px;
    color: #969799;
  }

  &__no-course {
    margin-top: 130px;
  }

  .info-card__action.info-card__action--primary {
    height: 26px;
    line-height: 26px;
    border-radius: 13px;
  }

  .info-card__body .table-list-item__value {
    color: #323233;
  }
}
</style>
