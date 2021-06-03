<template>
  <vis-page-container class="offline">
    <div
      class="offline-cover"
    >
      <img-wrap
        :style="{ height: coverWrapHeight }"
        :src="pictureWrapDTO.url
          || '//b.yzcdn.cn/edu/default/default.png'"
        :fullfill="'!800x0q75.png'"
        :cover="false"
        disable-lazyload
      />
      <vis-tag
        v-if="courseStatus"
        :class="['offline-cover__state', {'offline-cover__state--ongoing': eduCourseLittleDTO.eduCourseState === 3}]"
      >
        {{ courseStatus }}
      </vis-tag>
    </div>

    <div class="offline-intro">
      <div
        class="intro__title"
      >
        <vis-tag
          v-if="tagText"
          extend-class="vis-tag-theme"
        >
          {{ tagText }}
        </vis-tag>
        <span class="title">
          {{ courseProductDTO.title || eduCourseLittleDTO.name }}
        </span>
      </div>
      <div class="type__list">
        <intro-type
          v-if="userAssetDTO.studentName"
          :type-name="'my'"
          :type-desc="userAssetDTO.studentName || ''"
        />
        <intro-type
          v-if="courseSku"
          :type-name="'course'"
          :type-desc="courseSku"
          :type-arrow="courseProductDTO.sellType===3"
          class="sku__hide"
          @click.native="onClickOperation(3)"
        />
        <intro-type
          v-if="courseProductDTO.courseType === 1 && courseTimes"
          :type-name="'frequency'"
          :type-desc="courseTimes"
          :type-arrow="courseProductDTO.sellType===1"
          @click.native="onClickOperation(1)"
        />
        <intro-type
          v-if="courseProductDTO.courseType === 1 && dateRange"
          :type-name="'time'"
          :type-desc="dateRange"
          :type-arrow="clickToValidity"
          @click.native="onClickOperation(2)"
        />
        <intro-type
          v-if="shopNameDesc"
          :type-name="'address-o'"
          :type-desc="shopNameDesc"
          @click.native="onOpenMap"
        >
          <vis-icon
            slot="after"
            class="type__list-address-icon"
            name="arrow"
            size="12px"
            color="#7d7e80"
          />
        </intro-type>
      </div>
    </div>

    <wait-course
      v-if="eduCourseLittleDTO.eduCourseState !== 1"
      :wait-list="lessonLittleDTOList"
      :asset-no="assetNo"
      :course-type="courseProductDTO.courseType"
      :target-course="courseAttendDTO || {}"
    />

    <other-entry
      v-if="showOtherEntry"
      :alias="courseProductDTO.alias"
      :student-uid="userAssetDTO.studentUid"
      :asset-no="assetNo"
      :asset-type="userAssetDTO.type"
      :title="courseProductDTO.title"
      :picture="pictureWrapDTO.url"
      :join-group-setting="courseProductDTO.joinGroupSettingDTO"
      :sell-type="courseProductDTO.sellType"
      :course-type="courseProductDTO.courseType"
      :data-range="dataRange"
      :not-be-used-asset="userAssetDTO.notBeUsedAsset"
      :has-exam="hasExam"
      :exam-info="examInfo"
    />

    <!-- 证书信息弹窗 -->
    <vis-popup-close
      :show-pop="showPop"
      class="order-cert"
      @close-pop="onCloseAndShow"
    >
      <vis-canvas-cert :cert-list="certList" />
    </vis-popup-close>

    <!-- 奖励弹窗 -->
    <vis-popup-close
      :show-pop="showRewardPop"
      class="order-cert"
      @close-pop="() => showRewardPop = false"
    >
      <div class="popup-reward">
        <h3>你有{{ rewardCount }}个奖励待领取</h3>
        <img-wrap
          :cover="false"
          width="220px"
          height="186px"
          src="https://img01.yzcdn.cn/public_files/2019/05/11/4ffe464d84f0b0b1f7c93724719b23b6.png"
        />
        <van-button
          size="large"
          type="primary"
          round
          @click="linkTo('reward')"
        >
          去领取
        </van-button>
      </div>
    </vis-popup-close>

    <van-popup
      v-model="show"
      :overlay="false"
      position="top"
      class="offline__notice"
    >
      你的证书已收入“会员中心-我的证书”中啦~
    </van-popup>
  </vis-page-container>
</template>

<script>
import apis from '../../api';
import VisTag from 'components/tag';
import isEmpty from 'lodash/isEmpty';
import Args from 'zan-utils/url/args';
import { Toast, Button, Popup } from 'vant';
import * as SafeLink from '@youzan/safe-link';
import IntroType from './components/intro-type';
import WaitCourse from './components/wait-course';
import OtherEntry from './components/other-entry';
import { isEduSingleStore } from '@youzan/utils-shop';
import { findStuScheduleByCondition } from '../api.js';
import formatDate from '@youzan/utils/date/formatDate';
import PageContainer from '../../components/page-container';
import { hasExam } from 'supv/examination/modules/course-exam';
import * as customSafeLink from '@/common/utils/custom-safe-link';
import { ImgWrap, CanvasCert, PopupClose, Icon } from '@youzan/vis-ui';
import { COURSE_SELL_TYPE } from '@/constants/course/course-sell-type';

export default {
  name: 'course',

  components: {
    VisTag,
    ImgWrap,
    IntroType,
    WaitCourse,
    OtherEntry,
    'vis-icon': Icon,
    'van-popup': Popup,
    'van-button': Button,
    'vis-canvas-cert': CanvasCert,
    'vis-popup-close': PopupClose,
    'vis-page-container': PageContainer,
  },

  data() {
    const isPC = window.innerWidth > 600;

    return {
      isPC,
      campus: {},
      userAssetDTO: {},
      isEduSingleStore,
      pictureWrapDTO: {},
      courseAttendDTO: {},
      courseProductDTO: {},
      eduCourseLittleDTO: {},
      assetNo: Args.get('assetNo'), // 获取assetNo
      lessonLittleDTOList: [], // 后端从分页接口中返回截取的4条记录
      img: 'https://img01.yzcdn.cn/upload_files/2018/12/18/Fk1oW0t-l5FP7KBWzQcfM5r2aVGf.jpg',

      // 最新证书
      certList: [],
      currentInfo: {},
      // Popup
      show: false,
      showPop: false,
      rewardPopFlag: false,
      shopName: '', // 上课校区
      dataRange: {}, // 预约入口使用
      rewardCount: 0, // 未领取奖励记数
      showRewardPop: false, // 奖励弹窗
      showOtherEntry: false, // 显示底部动作栏

      hasExam: false, // 是否存在关联的考试
      examInfo: {}, // 获取到的关联的考试信息
    };
  },

  computed: {
    // 封面高度计算
    coverWrapHeight() {
      return `${this.isPC ? 210 : window.innerWidth / 16 * 9}px`;
    },

    tagText() {
      const { courseTypeName, courseType } = this.courseProductDTO;
      if (courseTypeName) {
        // 旧逻辑只显示体验课
        if (courseType === 0) {
          return courseTypeName;
        }
      }
      return '';
    },

    courseStatus() {
      switch (this.eduCourseLittleDTO.eduCourseState) {
        case 2:
          return '未开始';
        case 3:
          return '进行中';
        case 1:
          return '已结束';
        default:
          return '';
      }
    },

    // 有效期单位
    validityPeriodUnit() {
      switch (this.courseProductDTO.validityPeriodUnit) {
        case 1:
          return '天';
        case 2:
          return '月';
        case 3:
          return '季度';
        case 4:
          return '年';
        default:
          return '';
      }
    },

    // 判断是否能跳转到有效期
    clickToValidity() {
      // validityPeriodType有效期类型 1-永久有效 2-多少天生效
      const { sellType, validityPeriodType } = this.courseProductDTO;
      const dataRange = this.userAssetDTO.dataRange;
      // dataRange为空则无有效期不能跳转
      // eslint-disable-next-line max-len
      return !(isEmpty(dataRange) || sellType === COURSE_SELL_TYPE.SESSION || (sellType === COURSE_SELL_TYPE.COUNT && validityPeriodType === 1));
    },

    courseSku() {
      // sellType 1、按课时 2、按时段 3、按期 0 其他
      return (this.courseProductDTO.sellType === COURSE_SELL_TYPE.SESSION || this.courseProductDTO.sellType === COURSE_SELL_TYPE.DIY) ? this.courseProductDTO.skuVal : '';
    },

    courseTimes() {
      if (this.courseProductDTO.sellType === COURSE_SELL_TYPE.COUNT) return `课时： 剩余${this.userAssetDTO.remaining / 100}/共${this.userAssetDTO.total / 100}课时`;
      if (this.courseProductDTO.sellType === COURSE_SELL_TYPE.SESSION) return `上课次数： 剩余${this.eduCourseLittleDTO.remaining}/共${this.eduCourseLittleDTO.total}次`;
      return '';
    },

    dateRange() {
      // 线下课类型
      const sellType = this.courseProductDTO.sellType;
      // 有效期类型 1-永久有效 2-多少天生效
      const periodType = this.courseProductDTO.validityPeriodType;
      // 课程生效类型 1-首次签到后生效
      const courseEffectiveType = this.courseProductDTO.courseEffectiveType;
      // 有效期
      const validityPeriodRange = this.courseProductDTO.validityPeriodRange;

      const range = this.userAssetDTO.dataRange || {};
      const startYMD = formatDate(range.startTime, 'YYYY年MM月DD日');
      const endYMD = formatDate(range.endTime, 'YYYY年MM月DD日');
      // 非有效期类型显示时间范围
      const timeStatus = range.startTime ? `有效期： ${startYMD} - ${endYMD}` : '';
      // 按课时
      if (sellType === COURSE_SELL_TYPE.COUNT) {
        if (periodType === 1) {
          return '有效期： 永久有效';
        }
        if (periodType === 2) {
          if (courseEffectiveType === 1) {
            if (timeStatus) return timeStatus;
            return validityPeriodRange ? `有效期： ${validityPeriodRange}${this.validityPeriodUnit}（首次上课签到后生效）` : '';
          }
          return timeStatus;
        }
        return '';
      // 按时段
      } else if (sellType === COURSE_SELL_TYPE.DURATION) {
        if (timeStatus) return timeStatus;
        if (courseEffectiveType === 1) {
          return this.courseProductDTO.skuVal ? `有效期： ${this.courseProductDTO.skuVal}（首次上课签到后生效）` : '';
        }
        return '';
      // 按期、自定义
      } else {
        return timeStatus;
      }
    },

    shopNameDesc() {
      return this.isEduSingleStore || !this.shopName ? '' : `上课校区：${this.shopName}`;
    },
  },

  created() {
    this.fetchData();
    // this.getRewardTip();
  },

  methods: {
    fetchData() {
      const params = {
        assetNo: this.assetNo,
      };
      findStuScheduleByCondition(params)
        .then((data) => {
          this.courseProductDTO = data.courseProductDTO || {};
          this.pictureWrapDTO = this.courseProductDTO.pictureWrapDTO || {};
          this.eduCourseLittleDTO = data.eduCourseLittleDTO || {};
          // 后端从分页接口中返回截取的4条记录
          this.lessonLittleDTOList = data.lessonLittleDTOList || [];
          this.userAssetDTO = data.userAssetDTO || {};
          this.dataRange = this.userAssetDTO.dataRange || {};
          this.campus = data.campus || {};
          this.courseAttendDTO = data.courseAttendDTO || {};
          this.shopName = (data.campus && data.campus.name) || '';
          this.showOtherEntry = true;

          this.findCerts(this.courseProductDTO.alias)
            .then(data => {
              // 证书弹窗
              const certLength = data.content.length || 0;
              if (certLength > 0) {
                this.certList = data.content;
                this.showPop = true;
              }
              // 证书后奖励弹窗
              apis.getRewardWindow().then(res => {
                const { waitRewardCount = 0, isRead = false } = res || {};
                if (waitRewardCount > 0 && !isRead) {
                  this.rewardCount = waitRewardCount;
                  if (certLength > 0) {
                    this.rewardPopFlag = true;
                  } else {
                    this.showRewardPop = true;
                  }
                }
              });

              // if (data.content && data.content.length > 0) {
              //   this.showPop = true;
              //   this.certList = data.content;
              // }
            })
            .catch(msg => {
              Toast(msg);
            });

          this.findExam(this.courseProductDTO.alias);
        })
        .catch(msg => {
          Toast(msg);
        });
    },
    // 未弹窗证书
    findCerts(sourceId) {
      return apis.findCertificate({
        findType: 5,
        popStatus: 0,
        sourceId,
        sourceType: 1,
      });
    },
    findExam(alias) {
      hasExam(alias)
        .then((examInfo) => {
          this.hasExam = true;
          this.examInfo = examInfo;
        })
        .catch(() => {
          this.hasExam = false;
        });
    },
    // 查询奖励弹窗
    getRewardTip() {
      return apis.getRewardTip().then(res => {
        const { waitRewardCount = 0 } = res || {};
        if (waitRewardCount > 0) {
          this.showRewardPop = true;
          this.rewardCount = waitRewardCount;
        }
      }).catch(err => {
        Toast(err);
      });
    },
    updateCertStatus(certIds) {
      apis.batchUpdatePopStatus({
        certificateIds: certIds,
        popStatus: 1,
      })
        .then(data => {
          console.log('修改弹窗状态：', data);
        })
        .catch(msg => {
          console.log(msg);
          Toast(msg);
        });
    },
    // Popup
    onCloseAndShow() {
      this.showPop = false;
      if (this.rewardPopFlag) {
        this.showRewardPop = true;
      }
      if (!this.showPop) {
        // Popup关闭后展示NoticeBar
        this.show = true;
        setTimeout(() => {
          this.show = false;
        }, 2000);
      }
    },
    /**
     * 点击跳转
     *
     * @param {string} type type
     */
    linkTo(type) {
      switch (type) {
        case 'reward':
          SafeLink.redirect({
            url: `/wscvis/edu/reward/list/active?kdtId=${_global.kdt_id}`,
            kdtId: _global.kdt_id,
          });
          break;
        default:
      }
    },
    // 跳转到课程资产变更明细列表
    onClickOperation(operationType) {
      const studentId = this.userAssetDTO.studentUid;
      const changeUrl = customSafeLink.getSafeUrl({
        url: '/wscvis/edu/course-change/changelist',
        query: {
          assetNo: this.assetNo,
          operationType,
          studentId,
        },
      });
      // 线下课类型 sellType 1、按课时 2、按时段 3、按期 0 其他
      const sellType = this.courseProductDTO.sellType;
      switch (operationType) {
        case 3:
          if (sellType === COURSE_SELL_TYPE.SESSION) {
            SafeLink.redirect({
              url: changeUrl,
            });
          }
          break;
        case 1:
          if (sellType === COURSE_SELL_TYPE.COUNT) {
            SafeLink.redirect({
              url: changeUrl,
            });
          }
          break;
        case 2:
          if (this.clickToValidity) {
            SafeLink.redirect({
              url: changeUrl,
            });
          }
          break;
        default:
      }
    },
    // 跳转到地址地图页
    onOpenMap() {
      const shopDetailInfo = this.campus.addressWrapDTO || {};
      if (shopDetailInfo.latitude) {
        const reUrl = `/wscvis/edu/map?kdt_id=${window._global.kdt_id}&longitude=${shopDetailInfo.longitude}
          &latitude=${shopDetailInfo.latitude}&province=${shopDetailInfo.province}&city=${shopDetailInfo.city}
          &district=${shopDetailInfo.district}&address=${shopDetailInfo.address}`;
        SafeLink.redirect({
          url: reUrl,
          kdtId: _global.kdt_id,
        });
      }
    },
  },
};
</script>

<style lang="scss">
@import 'mixins/index.scss';

.offline {
  padding: 10px 10px 0;

  &-cover {
    position: relative;
    overflow: hidden;
    border-top-right-radius: 4px;
    border-top-left-radius: 4px;

    &__state.vis-tag {
      position: absolute;
      bottom: 10px;
      left: 10px;
      padding: 3px 7px;
      color: #fff;
      background-color: #c8c9cc;
      border-radius: 9px;
    }
  }

  &-intro {
    padding: 10px;
    background-color: #fff;
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;

    .intro__title {
      display: -webkit-box;
      overflow: hidden;
      font-size: 16px;
      font-weight: bold;
      line-height: 20px;
      color: #111;
      text-align: justify;
      text-overflow: ellipsis;

      .vis-tag {
        padding: 3px 7px;
        border-radius: 9px;
      }

      .title {
        line-height: 20px;
        color: #323233;
        vertical-align: top;
      }
    }

    .type__list .sku__hide {
      height: 18px;
      overflow: hidden;
    }
  }

  &__notice {
    padding: 11px 0;
    font-size: 14px;
    line-height: 18px;
    color: #ed6a0c;
    text-align: center;
    background-color: #fffbe8;
  }

  .van-popup.cert-pop {
    background-color: transparent;
  }

  .order-cert {
    .pop-info {
      width: 260px;
      color: #fff;
    }

    .cert-list__item {
      padding: 0;
    }
  }

  .popup-reward {
    display: flex;
    width: 260px;
    height: 346px;
    padding: 25px 15px;
    background-color: #fff;
    border-radius: 8px;
    box-sizing: border-box;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    h3 {
      font-size: 20px;
      font-weight: 500;
      line-height: 28px;
      color: #323233;
    }

    .van-button {
      height: 44px;
      line-height: 44px;
    }
  }
}

.type__list-address-icon {
  vertical-align: middle;
}
</style>
