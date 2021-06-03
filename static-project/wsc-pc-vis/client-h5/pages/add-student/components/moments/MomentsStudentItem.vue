<template>
  <div>
    <div
      v-if="pageFrom === 'momentsEdit'"
      class="student-moment-item"
    >
      <div class="student-moment-item__body">
        <img-wrap
          :width="'40px'"
          :height="'40px'"
          :src="studentAvator"
          :fullfill="'!80x80.jpg'"
          :cover="true"
          class="student-moment-item__student-avator"
        />
        <span class="student-moment-item__student-name">
          {{ studentName }}
        </span>
      </div>
      <div class="student-moment-item__aside">
        <div class="student-moment-item__status-text">
          {{ statusText }}
        </div>
      </div>
    </div>

    <div
      v-if="pageFrom === 'moments'"
      class="student-v2-item"
    >
      <img-wrap
        :width="'40px'"
        :height="'40px'"
        :src="studentAvator"
        :fullfill="'!80x80.jpg'"
        :cover="true"
        class="student-v2-item__student-avator"
      />
      <div class="student-v2-item__student-info">
        <div class="student-v2-item__student-info-contact">
          <span>
            {{ student.name }}
          </span>
          <span
            v-if="student.phone"
            class="student-v2-item__student-info-contact-phone"
          >
            {{ student.phone }}
          </span>
        </div>
        <p
          v-if="student.time"
          class="student-v2-item__student-info-time"
        >
          上次上课时间：{{ student.time }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ImgWrap } from '@youzan/vis-ui';
import Args from 'zan-utils/url/args';

export default {
  name: 'moments-student-item',

  components: {
    ImgWrap,
  },

  props: {
    studentName: {
      type: String,
      default: '',
    },
    statusText: String,
    status: Number,
    studentAvator: {
      type: String,
      default: '',
    },
    student: {
      type: Object,
      default() {
        return {};
      },
    },
  },

  data() {
    return {
      pageFrom: Args.get('pageFrom'),
    };
  },

  computed: {
    infoList() {
      return [
        { name: '已上课时', value: this.usedHour / 100 },
        { name: '剩余课时', value: this.validHour / 100 },
        { name: '有效期', value: this.validDate, hidden: !this.validDate },
      ];
    },
  },
};
</script>

<style lang="postcss">
.student-v2-item {
  display: flex;
  align-items: center;

  &__student-avator {
    border-radius: 20px;
  }

  &__student-info {
    margin-left: 10px;
    flex: 1;
  }

  &__student-info-contact {
    color: #2e2e2e;
    font-size: 16px;
    font-weight: bold;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  &__student-info-contact-phone {
    margin-left: 15px;
  }

  &__student-info-time {
    margin-top: 9px;
    line-height: 18px;
    color: #7e7e7e;
    font-size: 13px;
  }
}

.student-moment-item {
  display: flex;
  justify-content: space-between;

  &__body {
    display: flex;
    align-items: center;
    width: 240px;
  }

  &__aside {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
  }

  &__student-name {
    line-height: 22px;
    font-weight: 500;
    font-size: 16px;
    color: #323233;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-left: 10px;
  }

  &__student-avator {
    border-radius: 20px;
  }

  &__try-tag {
    padding: 0 5px;
    line-height: 17px;
    font-size: 12px;
    color: #00b389;
    border: 1px solid #00b389;
    border-radius: 2px;
  }

  &__status-text {
    line-height: 16px;
    font-size: 16px;
    color: #646566;
  }
}
</style>
