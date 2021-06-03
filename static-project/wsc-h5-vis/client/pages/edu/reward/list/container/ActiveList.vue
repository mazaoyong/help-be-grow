<template>
  <div class="reward-list reward-list--active">
    <van-list
      v-if="list.length > 0"
      v-model="loading"
      :finished="finished"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      @load="fetchData"
    >
      <!-- 优惠券奖励 -->
      <div
        v-for="(item, index) in list"
        :key="`ticket${index}`"
      >
        <h3
          v-if="index === 0 && hasAward('TICKET')"
        >
          优惠券
        </h3>
        <award-ticket
          v-if="get(item, 'awardDTO.awardType') === 1 &&
            get(item, 'awardDTO.voucherCouponAwardDetailDTO')"
          :label="get(item, 'awardDTO.voucherCouponAwardDetailDTO.title')"
          :desc="get(item, 'awardDTO.voucherCouponAwardDetailDTO.usingThresholdDisplay')"
          :campus="get(item, 'awardDTO.voucherCouponAwardDetailDTO.applyCampus')"
          :date="get(item, 'awardDTO.voucherCouponAwardDetailDTO.validDurationDisplay')"
          :unit="getTicketUnit(get(item, 'awardDTO.voucherCouponAwardDetailDTO.preferentialType'))"
          :number="getTicketNumber(
            get(item, 'awardDTO.voucherCouponAwardDetailDTO.preferentialType'),
            get(item, 'awardDTO.voucherCouponAwardDetailDTO.value')
          )"
          :type="get(item, 'awardDTO.voucherCouponAwardDetailDTO.preferentialType')"
          :status="getTicketStatus(
            get(item, 'rewardStatus'),
            get(item, 'awardDTO.voucherCouponAwardDetailDTO.useStatus')
          )"
          :jump-url="get(item, 'awardDTO.voucherCouponAwardDetailDTO.usingJumpUrl')"
          :kdt-id="get(item, 'ebizSimpleShopDTO.kdtId', kdtId)"
          :coupon-id="get(item, 'awardDTO.voucherCouponAwardDetailDTO.couponId') || get(item, 'awardData')"
          @takeReward="takeReward(null, get(item, 'recordId'), index)"
        />
      </div>
      <!-- 课程奖励 -->
      <div
        v-for="(item, index) in list"
        :key="`course${index}`"
      >
        <h3 v-if="index === 0 && hasAward('COURSE')">
          赠送的课程
        </h3>
        <award-course
          v-if="isFormally(item) || isExperience(item)"
          :label="isFormally(item)
            ? get(item, 'awardDTO.normalCourseTimeAwardDetailDTO.title')
            : get(item, 'awardDTO.trialCourseProductAwardDetailDTO.title')"
          :desc="isFormally(item)
            ? getFormallyDoc(item)
            : getExperienceDoc(
              get(item, 'rewardStatus'),
              get(item, 'awardDTO.trialCourseProductAwardDetailDTO.useStatus'),
              get(item, 'trialCourse.state')
            )"
          :campus="get(item, 'ebizSimpleShopDTO.shopName')"
          :status="getCourseStatus(
            get(item, 'rewardStatus'),
            get(item, 'awardDTO.trialCourseProductAwardDetailDTO.useStatus')
          )"
          :alias="get(item, 'awardDTO.awardId')"
          :type="isFormally(item) ? 'formally' : 'experience'"
          :thumb-url="isFormally(item)
            ? get(item, 'awardDTO.normalCourseTimeAwardDetailDTO.pictureWrapDTO.url')
            : get(item, 'awardDTO.trialCourseProductAwardDetailDTO.pictureWrapDTO.url')"
          :record-id="get(item, 'recordId')"
          :kdt-id="get(item, 'ebizSimpleShopDTO.kdtId', kdtId)"
          @takeReward="takeReward(null, get(item, 'recordId'), index)"
        />
      </div>
      <!-- 积分奖励 -->
      <div
        v-for="(item, index) in list"
        :key="`point${index}`"
      >
        <h3 v-if="index === 0 && hasAward('POINT')">
          积分
        </h3>
        <award-point
          v-if="get(item, 'awardDTO.awardType') === 4"
          label="积分"
          desc="领取后立即生效"
          unit="分"
          :number="get(item, 'awardDTO.awardValue')"
          :status="get(item, 'rewardStatus')"
          @takeReward="takeReward(null, get(item, 'recordId'), index)"
        />
      </div>
    </van-list>
    <no-course
      v-else
      desc="很抱歉，你还没有获得奖励哦"
    />
    <div class="reward-list__ft">
      <span>
        <span v-if="list.length > 0">没有更多可用奖励</span>
      </span>
    </div>
  </div>
</template>

<script>
import { List, Toast } from 'vant';
import mixinVisPage from 'common/mixins/mixin-vis-page';
import get from 'lodash/get';
import AwardCourse from '../component/AwardCourse.vue';
import AwardTicket from '../component/AwardTicket.vue';
import AwardPoint from '../component/AwardPoint.vue';
import NoCourse from '../../../../edu/components/no-course';
import apis from '../../../api';

export default {
  name: 'record-list',
  components: {
    AwardCourse,
    AwardTicket,
    AwardPoint,
    NoCourse,
    'van-list': List,
  },
  mixins: [mixinVisPage],
  config: {
    title: '我的奖励',
  },
  data() {
    return {
      loading: false,
      finished: false,
      error: false,
      pageable: {
        index: 1,
        size: 20,
      },
      list: [],
      timer: null,
      kdtId: get(window, '_global.kdt_id'),
    };
  },
  computed: {
    get() {
      return get;
    },
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      const { pageable } = this;
      apis.getRewardRecordList({
        pageNumber: pageable.index,
        pageSize: pageable.size,
        status: '1,2,3,4',
      }).then(res => {
        const { total = 0, content = [] } = res || {};
        this.list = this.list.concat(content);
        this.pageable.index += 1;
        this.loading = false;
        if (total <= this.list.length) {
          this.finished = true;
        }
      }).catch(err => {
        Toast(err);
        this.loading = false;
        this.finished = true;
        this.error = true;
      });
    },

    // 领取奖励
    takeReward(presentedStudentId, rewardRecordId, index) {
      if (this.loading) return;
      this.loading = true;
      apis.redeemReward({
        presentedStudentId,
        rewardRecordId,
      }).then(res => {
        const result = get(res, 'result');
        const success = get(res, 'success');
        const rewardStatus = get(res, 'rewardStatus');
        const awardData = get(res, 'awardData');
        if (success) {
          Toast({
            type: 'success',
            duration: 1000,
            forbidClick: true,
            message: result || '领取成功',
          });
        } else {
          Toast(result || '领取失败，请重试');
        }
        this.list.splice(index, 1, {
          ...this.list[index],
          rewardStatus,
          awardData,
        });
        this.loading = false;
      }).catch(err => {
        Toast(err);
        this.loading = false;
      });
    },

    // 跳转到已失效列表
    linkExpire() {
      this.$router.push({
        name: 'RewardListExpire',
      });
    },

    // 是否体验课
    isExperience(item) {
      return get(item, 'awardDTO.awardType') === 3;
    },

    // 是否正式课
    isFormally(item) {
      return get(item, 'awardDTO.awardType') === 2;
    },

    /**
     * 奖品使用状态useStatus:
     * 1:未使用 2:已使用 3:已失效
     * 奖励状态status:
     * 0, "未完成"
     * 1, "未领取"
     * 2, "领取中"
     * 3, "已领取"
     * 4, "已失效"
     *
     * 赠送的体验课状态 trialCourseState:
     * 1: 待确认，2: 已确认，但是未上课，3: 已完成上课，4: 取消预约
     *
     * @param {number} status 奖励状态
     * @param {number} useStatus 奖品使用状态
     * @param {number} tricalCourseState 赠送的体验课状态
     */
    getExperienceDoc(status, useStatus, trialCourseState) {
      let str;
      if (useStatus === 2 && trialCourseState !== 4) {
        str = '已到店上课';
      } else {
        switch (status) {
          case 1:
            str = '领取后自动预约体验课';
            break;
          case 3:
            switch (trialCourseState) {
              case 1:
                str = '请等待老师确认上课时间';
                break;
              case 2:
                str = '请按时到店上课';
                break;
              case 3:
                str = '已到店上课';
                break;
              case 4:
                str = '预约失败，请等待商家联系';
                break;
              default:
                str = '请等待老师确认上课时间';
            }
            break;
          default:
        }
      }
      return str;
    },

    /**
     * 获取正式课文案
     * 正式课文案根据courseSellType区分，目前只有1、2的情况
     * 枚举:0:自定义 1:按课时 2:按时段 3:按期
     *
     * @param {Object} item 课程数据
     */
    getFormallyDoc(item) {
      let str;
      let unit;
      let awardValue = get(item, 'awardDTO.awardValue');
      let courseSellType = get(item, 'awardDTO.normalCourseTimeAwardDetailDTO.courseSellType');

      if (courseSellType === 1) { // 按课时
        if (awardValue && typeof awardValue === 'number') {
          awardValue = awardValue / 100;
        }
        unit = '课时';
      }

      if (courseSellType === 2) { // 按时段
        unit = '天';
      }

      str = `${awardValue}${unit}`;
      return str;
    },

    /**
     * 获取优惠券单位
     * 1:固定金额
     * 2:固定折扣
     *
     * @param {number} type 奖励类型
     */
    getTicketUnit(type) {
      let str;
      if (type === 1) {
        str = '元';
      }
      if (type === 2) {
        str = '折';
      }
      return str;
    },

    /**
     * 获取优惠券数值
     * 金额券:单位是分
     * 折扣券:折扣 = value / 10
     *
     * @param {number} type 奖励类型
     * @param {number} value 优惠券数值
     */
    getTicketNumber(type, value) {
      let _value;
      if (type === 1) {
        _value = value / 100;
      }
      if (type === 2) {
        _value = value / 10;
      }
      return _value;
    },

    /**
     * 获取优惠券状态
     * rewardStatus: 0:未完成 1:未领取 2: 领取中 3:已领取 4:已失效
     * useStatus: 1:未使用 2:已使用 3:已失效
     *
     * @param {number} rewardStatus 奖励状态
     * @param {number} useStatus 优惠券使用状态
     * @return {number}
     */
    getTicketStatus(rewardStatus, useStatus) {
      // 如果奖品本身已失效，则奖励置为已失效状态
      if (useStatus === 2) {
        // 32代表已领取且已使用
        return 32;
      }
      if (useStatus === 3) {
        return 4;
      }
      return rewardStatus;
    },

    /**
     * 获取课程状态
     * rewardStatus: 0:未完成 1:未领取 2: 领取中 3:已领取 4:已失效
     * useStatus: 1:未使用 2:已使用
     *
     * @param {number} rewardStatus 奖励状态
     * @param {number} useStatus 体验课使用状态
     * @return {number}
     */
    getCourseStatus(rewardStatus, useStatus) {
      // 如果奖品本身已失效，则奖励置为已失效状态
      if (useStatus === 2) {
        // 32代表已领取且已使用
        return 32;
      }
      return rewardStatus;
    },

    hasAward(type) {
      const { list } = this;
      let bool = false;
      switch (type) {
        case 'TICKET':
          bool = list.some(item => get(item, 'awardDTO.awardType') === 1);
          break;
        case 'COURSE':
          bool = list.some(item => get(item, 'awardDTO.awardType') === 2 || get(item, 'awardDTO.awardType') === 3);
          break;
        case 'POINT':
          bool = list.some(item => get(item, 'awardDTO.awardType') === 4);
          break;
        default:
      }
      return bool;
    },
  },
};
</script>

<style lang="scss">
.reward-list.reward-list--active {}
</style>
