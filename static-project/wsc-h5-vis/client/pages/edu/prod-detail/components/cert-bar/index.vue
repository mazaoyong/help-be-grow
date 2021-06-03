<template>
  <div
    v-if="showService"
  >
    <div class="cert-bar">
      <span class="cert-bar__type">服务</span>
      <van-cell-group class="cert-bar__list">
        <div
          v-for="(serviceItem, index) in list"
          :key="serviceItem.tag"
        >
          <van-cell
            v-if="serviceItem.visible"
            is-link
            @click="onOpen"
          >
            <slot name="title">
              <div class="cert-bar__item">
                <span class="cert-bar__tag">{{ serviceItem.tag }}</span>
                <span class="cert-bar__tip">{{ serviceItem.tip }}</span>
              </div>
            </slot>
            <template slot="right-icon">
              <van-icon
                v-if="index === 0"
                class="van-cell__right-icon"
                name="arrow"
                color="#c8c9cc"
              />
              <span v-else />
            </template>
            <!-- <span v-if="index === 0" /> -->
          </van-cell>
        </div>
      </van-cell-group>
    </div>
    <popup v-model="visible" :close-on-click-overlay="false" :buttons="buttons">
      <div class="cert-bar__popup">
        <ul class="cert-bar__list">
          <li
            v-for="serviceItem in list"
            :key="serviceItem.tag"
          >
            <div v-if="serviceItem.visible" class="cert-bar__item">
              <span class="cert-bar__tag theme-tag">{{ serviceItem.tag }}</span>
              <span class="cert-bar__tip">{{ serviceItem.tip }}</span>
            </div>
          </li>
        </ul>
      </div>
    </popup>
  </div>
</template>

<script>
import { Cell, CellGroup, Button, Icon } from 'vant';
import Popup from 'components/popup';

export default {
  name: 'cert-bar',

  components: {
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button,
    [Popup.name]: Popup,
    'van-icon': Icon,
  },

  props: {
    list: {
      type: Array,
      default: function() {
        return [];
      },
    },
  },

  data() {
    return {
      visible: false,
      buttons: [
        {
          text: '完成',
          class: 'main-btn',
          onClick: this.onClose,
        },
      ],
    };
  },

  computed: {
    showService() {
      return this.list.some(item => item.visible);
    },
  },

  methods: {
    onOpen() {
      this.visible = true;
    },

    onClose() {
      this.visible = false;
    },
  },
};
</script>

<style lang="scss">
@import 'mixins/index.scss';

.cert-bar {
  padding-left: 41px;
  margin-bottom: 10px;
  background-color: #fff;
  box-sizing: border-box;

  li {
    position: relative;
    padding: 14px 15px 14px 0;
    overflow: hidden;

    &::after {
      @include border-retina(bottom, #F2F2F2);

      left: -40px;
      width: 300%;
    }
  }

  &__list {
    width: 100%;
    box-sizing: border-box;
  }

  &__item {
    @include ellipsis;
  }

  &__type {
    float: left;
    margin-left: -41px;
    padding: 15px 0 15px 15px;
    font-size: 13px;
    color: #969799;
  }

  &__tag {
    flex-shrink: 0;
    font-size: 12px;
    color: #00b389;
    background-color: #e5f7f3;
    padding: 3px 5px;
    margin-right: 5px;
    border-radius: 9px;
    line-height: 12px;
    display: inline-block;
    height: 12px;
    transform: scale(.83);
  }

  &__tip {
    color: #323233;
    font-size: 13px;
  }

  &__popup {
    position: relative;
    height: 100%;

    .cert-bar__list {
      padding: 20px 15px;
    }

    .cert-bar__item {
      display: flex;
      align-items: normal;
      margin-bottom: 15px;
      line-height: 18px;
      white-space: pre-wrap;
    }
  }
}
</style>
