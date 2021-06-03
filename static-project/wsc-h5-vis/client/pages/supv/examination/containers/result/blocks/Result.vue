<template>
  <div class="block-result">
    <div class="block-result__caption">
      {{ studentName }}，恭喜你完成此次考试
    </div>
    <main>
      <div class="block-result__score" :class="{ 'block-result__score--normal' : isReviewing }">
        {{ isReviewing ? '批阅中' : studentScore }}
      </div>
      <p>
        {{ isReviewing ? ' ' : '你的考试得分' }}
      </p>
      <div class="block-result__completed-time">
        {{ completedTime | format }}
      </div>
    </main>
  </div>
</template>

<script>
import { format } from 'date-fns';
import { ExamResultStatus } from 'supv/examination/types';

export default {
  name: 'block-result',

  filters: {
    format(time) {
      return format(time, 'YYYY-MM-DD HH:mm:ss');
    },
  },

  state: [
    'status',
    'studentName',
    'studentScore',
    'completedTime',
  ],

  computed: {
    isReviewing() {
      return this.status === ExamResultStatus.REVIEWING;
    },
  },
};
</script>

<style lang="scss">
@import '~supv/examination/style/index';

.block-result {
  overflow: hidden;
  background: $white;

  &__caption {
    @include text(16px, $black, 22px, 500);

    margin-top: 20px;
    text-align: center;
  }

  main {
    width: 270px;
    height: 120px;
    margin: 24px auto;
    text-align: center;
    background:
      url(https://b.yzcdn.cn/public_files/b7dbe2389ee6e91fae104106d4cd765d.jpg) no-repeat left 10px / 66px 110px,
      url(https://b.yzcdn.cn/public_files/5cabc61cbb7c3c6aafc9a19b7075c899.jpg) no-repeat right 10px / 66px 110px;
  }

  &__score {
    @include text(56px, $black, 76px, 700);

    font-style: italic;

    &--normal {
      font-style: initial;
    }
  }

  p {
    @include text(14px, $black, 20px);

    height: 20px;
  }

  &__completed-time {
    @include text(12px, $deeper-gray, 17px);

    margin-top: 4px;
  }
}
</style>
