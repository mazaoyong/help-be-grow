<template>
  <div class="student-card">
    <div class="student-card__header">
      <img-wrap
        :src="avatar"
        class="student-card__avatar"
        width="44px"
        height="44px"
        disable-fullfill
      />
      <div class="student-card__header__main">
        <div class="student-card__nickname">
          {{ nickname }}
        </div>
        <div class="student-card__id">
          ID:{{ studentId }}
        </div>
      </div>
    </div>
    <div class="student-card__footer">
      <div class="student-card__owned-count student-card__footer-item">
        {{ ownedCount }}
        <div class="student-card__footer-item__name">
          已购课程/门
        </div>
      </div>
      <div class="student-card__used-count student-card__footer-item">
        {{ usedCount }}
        <div class="student-card__footer-item__name">
          上课次数/次
        </div>
      </div>
      <div class="student-card__total-time student-card__footer-item">
        {{ totalTime }}
        <div class="student-card__footer-item__name">
          上课时间/分
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ImgWrap } from '@youzan/vis-ui';

export default {
  name: 'student-item',

  components: {
    ImgWrap,
  },

  props: {
    avatarUrl: String,
    nickname: String,
    studentId: String,
    ownedCount: Number,
    usedCount: Number,
    totalTime: Number,
    gender: Number,
  },

  computed: {
    avatar() {
      if (this.avatarUrl) return this.avatarUrl;

      // 如果是女性
      if (this.gender === 2) {
        return 'https://img01.yzcdn.cn/edu/avatar-woman@3x.png';
      } else {
        return 'https://img01.yzcdn.cn/edu/avatar-man@3x.png';
      }
    },
  },
};
</script>

<style lang="scss">
.student-card {
  display: flex;
  height: 100%;
  padding: 20px 15px 16px;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: space-between;

  &__header {
    display: flex;
    flex: 0 0 auto;

    &__main {
      margin-left: 10px;
      overflow: hidden;
    }
  }

  &__avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    flex: 0 0 auto;
  }

  &__nickname {
    overflow: hidden;
    font-size: 18px;
    font-weight: 500;
    line-height: 26px;
    color: #323233;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__id {
    font-size: 12px;
    line-height: 18px;
    color: #969799;
  }

  &__footer {
    display: flex;
    flex: 0 0 auto;
    justify-content: space-between;

    &-item {
      font-size: 22px;
      line-height: 30px;
      color: #323233;

      &__name {
        margin-top: 6px;
        font-size: 12px;
        line-height: 17px;
        color: #969799;
      }
    }
  }
}
</style>
