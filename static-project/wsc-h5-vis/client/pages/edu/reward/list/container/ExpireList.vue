<template>
  <div class="reward-list reward-list--expire">
    <van-list
      v-if="list.length > 0"
      v-model="loading"
      :finished="finished"
      @load="fetchData"
    >
      <!-- 优惠券奖励 -->
      <div
        v-for="(item, index) in list"
        :key="item"
      >
        <h3 v-if="index === 0">
          优惠券
        </h3>
        <award-ticket
          v-if="item.awardDTO.awardType === 1"
          label="77优惠券"
          desc="无使用门槛"
          date="2019.05.11 - 2018.06.11"
          unit="折"
          :number="7.5"
          :status="1"
        />
      </div>
      <!-- 课程奖励 -->
      <div
        v-for="(item, index) in list"
        :key="item"
      >
        <h3 v-if="index === 0">
          赠送的课程
        </h3>
        <award-course
          label="美国Sracth编程少儿班高级班级哈哈哈哈哈哈地的的的"
          desc="3课时"
          date="2019.05.11 - 2018.06.11"
          :status="1"
          type="experience"
          thumb-url=""
        />
      </div>
      <!-- 积分奖励 -->
      <div
        v-for="(item, index) in list"
        :key="item"
      >
        <h3 v-if="index === 0">
          积分
        </h3>
        <award-point
          label="积分"
          desc="领取后立即生效"
          unit="分"
          :number="200"
          :status="1"
        />
      </div>
    </van-list>
  </div>
</template>

<script>
import { Toast } from 'vant';
import mixinVisPage from 'common/mixins/mixin-vis-page';
import AwardCourse from '../component/AwardCourse.vue';
import AwardTicket from '../component/AwardTicket.vue';
import AwardPoint from '../component/AwardPoint.vue';
import apis from '../../../api';

export default {
  name: 'record-list',
  components: {
    AwardCourse,
    AwardTicket,
    AwardPoint,
  },
  mixins: [mixinVisPage],
  config: {
    title: '已失效奖励',
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
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      const { pageable, list } = this;
      apis.getRewardRecordList({
        pageNumber: pageable.index,
        pageSize: pageable.size,
        status: '4',
      }).then(res => {
        const { total = 0, content = [] } = res || {};
        this.list = content;
        this.loading = false;
        if (total <= list.length) {
          this.finished = true;
        }
      }).catch(err => {
        Toast(err);
        this.loading = false;
        this.finished = true;
        this.error = true;
      });
    },
  },
};
</script>

<style lang="scss">
/* 已失效奖品通用样式 */
.reward-list.reward-list--expire {
  .award__label,
  .award__number,
  .award__unit,
  .award__btn-text,
  .award__desc,
  .award__date, {
    color: #C8C9CC !important;
  }
  .award__btn {
    display: none;
  }
  .award__btn-text {
    display: block;
  }
  .award__status-icon {
    top: 15px;
    right: 15px;
  }
}
</style>
