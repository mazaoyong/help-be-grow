<template>
  <div class="prod-detail-vis-service-info">
    <vis-icon
      :name="type"
      class="prod-detail-vis-service-info__vis-icon"
    />
    <span class="prod-detail-vis-service-info__vis-message">
      {{ message }}
    </span>
  </div>
</template>

<script>
import { Icon } from '@youzan/vis-ui';

export default {
  name: 'service-info',

  components: {
    'vis-icon': Icon,
  },

  props: {
    type: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
    };
  },
};
</script>

<style lang="scss">
.prod-detail-vis-service-info {
  width: 100%;
  background-color: #fff;
  height: 46px;
  line-height: 46px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &__vis-icon {
    display: inline-block;
    float: left;
    margin-top: 15px;
    width: 14px;
    height: 14px;
  }

  &__vis-message {
    display: block;
    margin-left: 20px;
    height: 46px;
    line-height: 46px;
    font-size: 13px;
    color: #666;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
