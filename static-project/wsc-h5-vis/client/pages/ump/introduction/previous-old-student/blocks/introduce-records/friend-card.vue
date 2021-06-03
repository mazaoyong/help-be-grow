<template>
  <van-cell
    :title="name"
    :label="statusText"
    :value="timeText"
    center
    class="old-student__friend-card"
  >
    <vis-img-wrap
      slot="icon"
      :src="avatar"
      width="40px"
      height="40px"
    />
  </van-cell>
</template>
<script>
import { Cell } from 'vant';
import { ImgWrap } from '@youzan/vis-ui';

import formatDate from '@youzan/utils/date/formatDate';
import { getRandomAvatar } from '../../utils';
import { RECORDS_STATUS } from '../../constants';

export default {
  name: 'friend-card',

  components: {
    'van-cell': Cell,
    'vis-img-wrap': ImgWrap,
  },

  props: {
    name: {
      type: String,
      required: true,
    },
    status: {
      type: Number,
      required: true,
    },
    time: {
      type: Number,
      required: true,
    },
  },

  computed: {
    statusText() {
      let text;
      switch (this.status) {
        case RECORDS_STATUS.TO_BE_FOLLOW_UP:
          text = '机构待跟进';
          break;
        case RECORDS_STATUS.FOLLOW_UP:
          text = '机构跟进中';
          break;
        case RECORDS_STATUS.AUDITIONED:
          text = '已试听';
          break;
        case RECORDS_STATUS.COMPLETED:
          text = '已报课';
          break;
        default:
          text = '';
      }
      return text;
    },

    avatar() {
      return getRandomAvatar();
    },

    timeText() {
      return formatDate(this.time, 'YYYY-MM-DD');
    },
  },
};
</script>
<style lang="scss" scoped>
.old-student {
  &__friend-card {
    .imgWrap {
      margin-right: 10px;
      border-radius: 50%;
    }

    .van-cell__title {
      color: #111;
    }

    .van-cell__label {
      margin-top: 0;
      color: #646566;
    }

    .van-cell__value {
      span {
        font-size: 12px;
      }
    }
  }
}
</style>
