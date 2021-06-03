<template>
  <div class="course-info">
    <img class="course-info__cover" :src="cover">
    <p class="course-info__title">
      {{ title }}
    </p>
    <div class="course-info__footer">
      <p class="course-info__desc" v-html="desc"></p>
      <div class="course-info__price">
        价格：{{ price }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    cover: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    price: {
      type: String,
      default: '',
    },
    desc: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss">
.course-info {
  width: 236px;
  height: 209px;
  margin: 32px auto 0;

  &__cover {
    width: 100%;
    height: 133px;
    border-radius: 4px;
    object-fit: contain;
  }

  &__title {
    display: -webkit-box;
    margin-top: 12px;
    overflow: hidden;
    font-size: 14px;
    font-weight: 500;
    line-height: 18px;
    min-height: 36px;
    color: #323233;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
  }

  &__footer {
    display: flex;
    margin-top: 8px;
    align-items: center;
    justify-content: space-between;
  }

  &__desc {
    font-size: 16px;
    font-weight: 500;
    line-height: 20px;
    color: #fa1919;
    flex: 1 1 0;
    word-break: break-all;
  }

  &__price {
    font-size: 12px;
    line-height: 16px;
    color: #c8c9cc;
    text-align: right;
    flex: 0 0 auto;
  }
}
</style>
