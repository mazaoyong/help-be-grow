<template>
  <a class="teacher-item" :href="url">
    <img-wrap
      class="image"
      width="40px"
      height="40px"
      :src="data.icon"
      :fullfill="'!100x0.jpg'"
    />
    <div class="content">
      <p class="name">
        {{ data.teacherName || data.staffName }}
      </p>
      <p v-if="data.duty" class="duty">
        {{ data.duty }}
      </p>
      <p v-if="data.description" class="description">
        {{ data.description }}
      </p>
    </div>
  </a>
</template>

<script>
import { ImgWrap } from '@youzan/vis-ui';

export default {
  components: {
    ImgWrap,
  },

  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    kdtId: {
      type: Number,
      required: true,
    },
  },

  computed: {
    url() {
      return `/wscvis/edu/master-detail?teacherId=${this.data.id}&kdt_id=${this.kdtId}`;
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.teacher-item {
  @include clearfix;

  display: block;
  padding-left: 66px;

  &:last-child .content::after {
    @include border-retina(bottom, transparent);
  }

  .image {
    float: left;
    margin: 12px 0 0 -50px;
    border-radius: 20px;
  }

  .content {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 12px 14px 12px 0;
    min-height: 40px;

    &::after {
      @include border-retina(bottom, #f2f2f2);
    }

    .name {
      line-height: 17px;
      font-size: 13px;
      font-weight: bold;
      color: $main-text-color;
    }

    .duty {
      margin-top: 2px;
      line-height: 16px;
      font-size: 12px;
      color: $disabled-color;
    }

    .description {
      @include multi-ellipsis(2);

      margin-top: 8px;
      line-height: 16px;
      font-size: 12px;
      color: $vice-text-color;
    }
  }
}
</style>
