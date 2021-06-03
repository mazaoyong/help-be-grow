<template>
  <van-panel
    v-theme="{
      main: {
        '.van-panel__header-value span': 'color!important'
      }
    }"
    class="member-item"
    :title="role"
    :status="status"
  >
    <div class="member-item__content">
      <van-image
        class="member-item__content-avatar"
        width="32"
        height="32"
        :src="avatarUrl"
      />
      <div class="member-item__content-detail">
        <div class="detail-name">
          {{ itemName }}
        </div>
        <div
          v-if="item.state === 1 && item.remainSeconds > 0"
          v-theme.main="'color!important'"
          class="detail-time"
        >
          <count-down
            :start="startTime"
            :end="endTime"
            :time-separator="['', '小时', '分钟', '']"
            :hide-zero-day="true"
            time-style="custom"
            @timechange="timeChange"
          />后邀请将失效
        </div>
      </div>
      <van-icon name="ellipsis" @click="changeStatus" />
    </div>
  </van-panel>
</template>

<script>
import { Icon, Image, Panel } from 'vant';
import { Countdown } from '@youzan/captain';

export default {
  name: 'member-item',

  components: {
    'van-icon': Icon,
    'van-image': Image,
    'van-panel': Panel,
    'count-down': Countdown,
  },

  props: {
    item: {
      type: Object,
      default() {
        return {};
      },
    },
  },

  data() {
    return {
      avatarUrl: this.item.avatar || 'https://b.yzcdn.cn/public_files/5262cc40508999259a04e101fa37bab2.png',
      endTime: this.item.inviteEndTime,
      startTime: this.item.inviteEndTime - this.item.remainSeconds * 1000,
      itemName: this.item.name || '***',
    };
  },

  computed: {
    role() {
      const roleDescMap = {
        1: '爸爸',
        2: '妈妈',
        3: '爷爷',
        4: '奶奶',
        5: '外公',
        6: '外婆',
        7: '子女',
      };
      return roleDescMap[+this.item.role];
    },
    status() {
      switch (+this.item.state) {
        case 1:
          return '待确认';
        default:
          return '';
      }
    },
  },

  methods: {
    changeStatus() {
      this.$emit('changestatus');
    },

    timeChange(time) {
      const { hour, minute } = time;
      if (minute === 0 && hour === 0) {
        this.$emit('endtime');
      }
    },
  },
};
</script>

<style lang="scss">
@import "var";
@import 'mixins/index.scss';

.member-item {
  margin-bottom: 12px;
  padding: 0 12px;
  background-color: #fff;
  border-radius: 8px;

  &__content {
    display: flex;
    padding: 12px 0;
    align-items: center;
    font-size: 12px;

    &-avatar {
      margin-right: 12px;

      img {
        border-radius: 50%;
      }
    }

    &-detail {
      flex: 1;

      .detail-name {
        font-size: 16px;
        line-height: 20px;
        color: #323233;
      }

      .detail-time {
        margin-top: 4px;
        line-height: 16px;
        color: #00b389;

        &__count {
          display: inline-block;
          line-height: 16px;
          color: #00b389;
          font-size: 12px;
        }

        .cap-countdown__hour,
        .cap-countdown__minute {
          padding: 0;
          margin: 0;
        }

        .cap-countdown__second {
          display: none;
        }
      }
    }

    .van-icon-ellipsis {
      font-size: 24px;
    }
  }
}

.member-item .van-panel__header {
  font-size: 12px;

  .van-cell__title {
    color: #969799;
  }

  .van-cell__value {
    color: #00b389;
  }
}

div.van-hairline--top-bottom::after {
  border-width: 0;
}

div.van-cell:not(:last-child)::after {
  left: 0;
}

.member-item .van-panel__header {
  padding: 8px 0;
  line-height: 16px;
}
</style>
