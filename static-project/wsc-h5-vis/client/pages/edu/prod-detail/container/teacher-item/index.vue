<template>
  <div
    @click="onClick(id)"
    class="vis-teacher-item"
  >
    <div class="item-left">
      <img-wrap
        :width="'40px'"
        :height="'40px'"
        :src="img"
        :fullfill="'!100x0.jpg'"
        class="item-left-img"
      />
    </div>
    <div class="item-right">
      <div class="item-content">
        <p
          :class="post ? 'item-name-2' : ''"
          class="item-name"
        >
          {{ name }}
        </p>
        <p
          v-if="post"
          class="item-post"
        >
          {{ post }}
        </p>
      </div>
      <div
        v-if="desc"
        class="item-desc"
      >
        {{ desc }}
      </div>
    </div>
  </div>
</template>

<script>
import { ImgWrap } from '@youzan/vis-ui';

export default {
  name: 'teacher-item',
  components: {
    'img-wrap': ImgWrap,
  },
  props: {
    id: {
      type: Number,
      default: 0,
    },
    img: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    post: {
      type: String,
      default: '',
    },
    desc: {
      type: String,
      default: '',
    },
  },
  methods: {
    onClick(id) {
      this.$emit('click', id);
    },
  },
};
</script>

<style lang="scss">
.vis-teacher-item {
  width: 100%;
  min-height: 67px;
  &:last-child {
    .item-right {
      border: none;
    }
  }
  .item-left {
    position: relative;
    float: left;
    margin-right: 10px;
    width: 40px;
    min-height: 67px;
    &-img {
      position: absolute;
      top: 14px;
      left: 0;
      width: 40px;
      height: 40px;
      border-radius: 20px;
    }
  }
  .item-right {
    padding-right: 15px;
    overflow: hidden;
    min-height: 67px;
    border-bottom: 1px solid #f2f2f2;
  }
  .item-content {
    box-sizing: border-box;
    padding: 16px 10px 16px 0;
    height: 67px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    .item-name {
      line-height: 37px;
      font-size: 13px;
      font-weight: bold;
      color: #111;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .item-name-2 {
      line-height: 20px;
    }
    .item-post {
      font-size: 12px;
      color: #969799;
      line-height: 20px;
    }
  }
  .item-desc {
    margin: -7px 0 12px 0;
    font-size: 12px;
    color: #666;
    text-align: justify;
    line-height: 17px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}
</style>
