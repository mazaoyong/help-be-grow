<template>
  <div class="reward-record">
    <van-list
      v-if="list.length > 0"
      v-model="loading"
      :finished="finished"
      @load="fetchData"
    >
      <record-item
        v-for="item in list"
        :key="item.recordId"
        :label="getRecordValue(item, 'title')"
        :date="get(item, 'rewardAt')"
        :number="get(item, 'awardDTO.awardValue')"
        :unit="getRecordUnit(item)"
      />
    </van-list>
    <no-course
      v-else
      desc="暂无奖励记录"
    />
  </div>
</template>

<script>
import { List, Toast } from 'vant';
import mixinVisPage from 'common/mixins/mixin-vis-page';
import Args from 'zan-utils/url/args';
import get from 'lodash/get';
import RecordItem from './components/record-item';
import NoCourse from '../../../edu/components/no-course';
import apis from '../../api';

export default {
  name: 'reward-record',
  components: {
    RecordItem,
    NoCourse,
    'van-list': List,
  },
  mixins: [mixinVisPage],
  config: {
    title: '奖励记录',
  },
  data() {
    return {
      loading: false,
      finished: true,
      pageable: {
        index: 1,
        size: 20,
      },
      list: [],
      total: 0,
    };
  },
  computed: {
    alias() {
      return Args.get('alias');
    },
    get() {
      return get;
    },
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.loading = true;
      const { pageable } = this;
      apis.getRewardRecordList({
        pageNumber: pageable.index,
        pageSize: pageable.size,
        courseProductAlias: this.alias,
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
        this.finished = false;
      });
    },

    getRecordKey(item) {
      const type = get(item, 'awardDTO.awardType') - 1;
      const awardTypeKey = [
        'voucherCouponAwardDetailDTO',
        'normalCourseTimeAwardDetailDTO',
        'trialCourseProductAwardDetailDTO',
        'memberPointAwardDetailDTO',
      ];

      return awardTypeKey[type];
    },

    getRecordValue(item, key) {
      return get(item, `awardDTO.${this.getRecordKey(item)}.${key}`);
    },

    getRecordUnit(item) {
      const type = get(item, 'awardDTO.awardType');
      if (type === 1) {
        return '张';
      }
      if (type === 4) {
        return '分';
      }
      if (type === 2) {
        const courseSellType = get(item, 'awardDTO.normalCourseTimeAwardDetailDTO.courseSellType');
        if (courseSellType === 1) { // 按课时
          return '课时';
        }
        if (courseSellType === 2) { // 按时段
          return '天';
        }
      }
    },
  },
};
</script>

<style lang="scss">
@import 'mixins/index.scss';

.reward-record {
  position: relative;
  overflow: hidden;

  .van-list {
    background-color: #fff;
  }

  .vis-no-course {
    margin-top: 160px;
  }

  .record-item {
    position: relative;
    &:first-child {
      &::after {
        border: none;
      }
    }
    &::after {
      @include border-retina(top, #DCDCDC);
      left: 16px;
    }
  }
}
</style>
