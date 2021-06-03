<template>
  <div class="no-data">
    <icon symbol="nodata" />
    <slot>
      <div>{{ desc }}</div>
      <div class="no-data__button">
        <a class="no-data__button-text" :href="buttonLink">
          {{ buttonText }}
        </a>
      </div>
    </slot>
  </div>
</template>

<script>
import Icon from 'components/svg-icon';

export default {
  name: 'no-data',

  components: {
    Icon,
  },

  props: {
    desc: {
      type: String,
      default: '该内容已经删除',
    },
    buttonLink: {
      type: String,
      default: `${window._global.wap_url.wap}/showcase/homepage?kdt_id=${window._global.kdt_id}`,
    },
    buttonText: {
      type: String,
      default: '去逛逛',
    },
  },
};
</script>

<style lang="scss">
@import 'var';

.no-data {
  padding: 87px 0;
  font-size: 12px;
  color: $c-gray-dark;
  text-align: center;

  .svg-icon-nodata {
    display: block;
    margin: 0 auto 20px;
    width: 60px;
    height: 60px;
  }

  &__button {
    width: 104px;
    height: 36px;
    line-height: 18px;
    padding: 8px 30px;
    font-size: 14px;
    margin: 0 auto;
    border: 1px solid #f60;
    margin-top: 30px;
    color: #f60;
    border-radius: 3px;
    box-sizing: border-box;

    &-text {
      display: block;
      color: #f60;
    }
  }
}

.paid-content__no-data {
  padding: 87px 0;
  font-size: 12px;
  color: $c-gray-dark;
  text-align: center;
}

.paid-content__no-data .svg-icon-nodata {
  display: block;
  margin: 0 auto 20px;
  width: 60px;
  height: 60px;
}

.paid-content__no-data--fullpage {

  .paid-content__no-data-btn {
    width: 104px;
    height: 36px;
    line-height: 18px;
    padding: 8px 30px;
    font-size: 14px;
    margin: 0 auto;
    border: 1px solid #f60;
    margin-top: 30px;
    color: #f60;
    border-radius: 3px;
    box-sizing: border-box;

    .paid-content__no-data--go-home {
      display: block;
      color: #f60;
    }
  }
}

.column-show__nodata--big .svg-icon-nodata {
  width: 100px;
  height: 100px;
}
</style>
