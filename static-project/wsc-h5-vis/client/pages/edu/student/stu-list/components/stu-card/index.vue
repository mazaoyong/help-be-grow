<template>
  <div class="stu-card--wrap">
    <div class="stu-card">
      <div class="card-avatar">
        <img-wrap
          width="78px"
          height="78px"
          :src="avatar"
          :fullfill="'!156x156.jpg'"
        />
      </div>
      <div class="card-info">
        <p class="card-info__name">
          {{ item.name }}
        </p>
        <div class="card-info__num">
          {{ item.studentNo ? `No.${item.studentNo}` : '' }}
        </div>
      </div>
      <div
        class="card-edit"
        @click="onGoStuEdit"
      >
        <vis-icon name="attendanceinclass" />
        编辑
      </div>
    </div>
  </div>
</template>
<script>
import { Icon, ImgWrap } from '@youzan/vis-ui';
import * as SafeLink from '@youzan/safe-link';

const kdtId = _global.kdt_id || 0;

export default {
  name: 'stu-list',

  components: {
    'vis-icon': Icon,
    ImgWrap,
  },

  props: {
    item: {
      type: Object,
      default() {
        return {};
      },
    },
  },

  computed: {
    avatar() {
      if (this.item.avatar) return this.item.avatar;
      // 如果是女性
      if (this.item.gender === 2) {
        return 'https://img01.yzcdn.cn/edu/avatar-woman@3x.png';
      } else {
        return 'https://img01.yzcdn.cn/edu/avatar-man@3x.png';
      }
    },
  },

  methods: {
    onGoStuEdit() {
      SafeLink.redirect({
        url: `https://h5.youzan.com/wscvis/edu/student-edit.html?alias=${this.item.id}&from=studentCert&kdt_id=${kdtId}`,
        kdtId,
      });
    },
  },
};
</script>
<style lang="scss">
.stu-card--wrap {
  height: 100%;
  padding: 0 7px;
}

.stu-card {
  height: 100%;
  padding-top: 134px;
  background: url('https://img01.yzcdn.cn/public_files/2019/04/02/63e1bc1d91f0c2c493c3cea1cf17eca1.png') no-repeat top center;
  background-color: #fff;
  background-size: 100% 72px;
  border-radius: 4px;

  .card-avatar {
    position: relative;
    width: 140px;
    height: 84px;
    margin: 0 auto;
    background: url('https://img01.yzcdn.cn/public_files/2019/03/14/ed169da55a4775724d15b505bb137680.png') no-repeat center center;
    background-size: 100% 100%;
  }

  .card-avatar img {
    position: absolute;
    bottom: 19px;
    left: 31px;
    width: 78px;
    height: 78px;
    border-radius: 50%;
  }

  .imgWrap {
    overflow: visible;
  }

  .card-info {
    text-align: center;

    &__name {
      margin: 20px 0;
      font-size: 32px;
      font-weight: 500;
      line-height: 45px;
      color: #323233;
    }

    &__num {
      font-size: 13px;
      line-height: 18px;
      color: #969799;
    }
  }

  .card-edit {
    position: absolute;
    bottom: 20px;
    left: 50%;
    margin-left: -21px;
    font-size: 13px;
  }
}
</style>
