<template>
  <van-action-sheet v-model="show" :title="`已有${inviteRecord.pageRequest.total}位好友报名`">
    <div class="rule-pop">
      <div class="rule-pop__list">
        <van-list @load="onLoad">
          <div
            v-for="(item, index) in inviteRecord.list"
            :key="index"
            class="invite-item"
          >
            <img :src="item.profileUrl" class="invite-item__avatar">
            <div class="invite-item__name">
              {{ item.name }}
            </div>
            <div class="invite-item__date">
              {{ item.orderTime | relativeTime }}
            </div>
          </div>
        </van-list>
      </div>
      <slot name="bottom" />
    </div>
  </van-action-sheet>
</template>

<script>
import { ActionSheet, List } from 'vant';
import { mapActions, mapGetters, mapState } from 'vuex';
import getRelativeTime from '@/common/utils/getRelativeTime';

export default {
  filters: {
    relativeTime(value) {
      return getRelativeTime(value);
    },
  },
  components: {
    'van-action-sheet': ActionSheet,
    'van-list': List,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    inviteRecord: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    ...mapState('recommend-gift', ['recommendGift']),
    ...mapGetters(['isCourseEntry']),
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },
  methods: {
    ...mapActions('recommend-gift', ['openSharePoster', 'getInviteRecord']),
    onLoad() {
      this.fetchInviteRecord();
    },
    fetchInviteRecord() {
      if (this.isCourseEntry) {
        this.getInviteRecord(this.recommendGift.activityId);
      } else {
        this.getInviteRecord();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';
@import 'var';

.rule-pop {
  min-width: 240px;
  padding: 30px 20px;
  text-align: left;
  background-color: $c-white;

  &__title {
    line-height: 28px;
    margin-bottom: 18px;
    font-size: 20px;
    color: $c-black;
  }

  &__list {
    max-height: 300px;
    overflow-y: scroll;
  }

  .invite-item{
    padding: 12px 8px;
    line-height: 20px;
    font-size: 14px;
    color: $c-black;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #EBEDF0;

    &__avatar {
      width: 36px;
      height: 36px;
      border-radius: 100%;
    }
    &__name {
      flex: 1;
      margin-left: 16px;
      font-size: 14px;
      color: #323233;
      line-height: 18px;
    }
    &__date {
      font-size: 14px;
      color: #969799;
      text-align: right;
      line-height: 18px;
    }
  }
}
</style>
