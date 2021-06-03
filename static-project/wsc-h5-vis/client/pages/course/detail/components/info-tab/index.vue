<template>
  <component
    :is="sticky ? 'van-sticky' : 'div'"
    @scroll="scroll"
  >
    <van-tabs
      v-if="tabs.length"
      v-model="active"
      class="info-tab"
      line-width="40px"
      :color="mainColor"
      @change="change"
      @click="click"
    >
      <van-tab
        v-for="tab in groupedTabs"
        :key="tab.index"
        :name="tab.index"
      >
        <span slot="title">
          <slot :tab="tab">
            {{ tab.title }}
            <mini-font-tag
              v-if="tab.tag"
              class="title-tag"
              :text="tab.tag"
              :background-color="mainColor"
              height="16px"
            />
          </slot>
        </span>
      </van-tab>
    </van-tabs>
  </component>
</template>

<script>
import Vue from 'vue';
import { Tab, Tabs, Sticky } from 'vant';
import MiniFontTag from '@/components/mini-font-tag';
import { getElementTop, getVisibleTop, scrollTopTo } from './utils';

const cacheList = [];

Vue.directive('tab', {
  bind: (el, binding) => {
    cacheList.push({
      el,
      binding,
    });
  },
});

Vue.prototype.$tab = {
  reset: () => {},
};

export default {
  components: {
    'van-tab': Tab,
    'van-tabs': Tabs,
    'van-sticky': Sticky,
    MiniFontTag,
  },

  props: {
    value: {
      type: Number,
      default: 1,
    },

    sticky: Boolean,

    scrollspy: Boolean,
  },

  data() {
    return {
      active: this.value,
      tabs: [],
    };
  },

  computed: {
    groupedTabs() {
      let tabs = [];
      for (let i = 0; i < this.tabs.length; i++) {
        if (!tabs.find(tab => tab.index === this.tabs[i].index)) {
          tabs.push({
            index: this.tabs[i].index,
            title: this.tabs[i].title,
            tag: this.tabs[i].tag || '',
          });
        }
      }
      return tabs;
    },

    mainColor() {
      return this.$theme.colors.main;
    },
  },

  watch: {
    value(val) {
      this.active = val;
    },

    tabs() {
      this.setVisible();
    },

    active() {
      this.setVisible();
    },
  },

  created() {
    cacheList.forEach(item => {
      this.addTab(item.el, item.binding);
    });
    Vue.directive('tab', {
      bind: (el, binding) => {
        this.addTab(el, binding);
      },
      update: (el, binding) => {
        const index = this.tabs.findIndex(tab => tab.el === el);
        if (index === -1) {
          this.addTab(el, binding);
          return;
        }
        const tab = this.tabs[index];
        if (!binding.value) {
          this.tabs.splice(index, 1);
          return;
        }
        if (tab) {
          if (tab.index !== binding.value.index) {
            tab.index = binding.value.index;
          }
          if (tab.title !== binding.value.title) {
            tab.title = binding.value.title;
          }
          if (tab.tag !== binding.value.tag) {
            tab.tag = binding.value.tag;
          }
          if (tab.onShow !== binding.value.onShow) {
            tab.onShow = binding.value.onShow;
          }
          if (tab.onHide !== binding.value.onHide) {
            tab.onHide = binding.value.onHide;
          }
        }
      },
    });
    Vue.prototype.$tab = {
      reset: () => {
        this.active = 1;
        this.tabs.forEach(tab => {
          tab.el.classList.remove('hide');
        });
      },
    };
  },

  methods: {
    addTab(el, binding) {
      const { value } = binding;

      if (value && value.index && value.title) {
        this.tabs.push({
          index: value.index,
          title: value.title,
          tag: value.tag,
          onShow: value.onShow,
          onHide: value.onHide,
          el,
        });
        this.tabs.sort((tab1, tab2) => tab1.index - tab2.index);
        this.$emit('change', this.groupedTabs);
      }
    },

    setVisible() {
      if (!this.scrollspy) {
        this.tabs.forEach(tab => {
          if (this.active !== tab.index) {
            tab.el.classList.add('hide');
            tab.onHide && tab.onHide();
          } else {
            tab.el.classList.remove('hide');
            tab.onShow && tab.onShow();
          }
        });
      }
    },

    scroll() {
      if (this.scrollspy && !this.clickedScroll && this.tabs.length) {
        for (let i = 0; i < this.tabs.length; i++) {
          if (getVisibleTop(this.tabs[i].el) > 44) {
            this.active = i === 0 ? this.tabs[i].index : this.tabs[i - 1].index;
            return;
          }
        }
        this.active = this.tabs[this.tabs.length - 1].index;
      }
    },

    change(index) {
      if (!this.scrollspy) {
        this.setVisible(index);
      }
    },

    click(index) {
      if (this.scrollspy) {
        this.clickedScroll = true;
        const tab = this.tabs.find(tab => tab.index === index);
        const top = getElementTop(tab.el) - 44;
        scrollTopTo(top, 0.3, () => {
          this.clickedScroll = false;
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.info-tab {
  .title-tag {
    position: absolute;
    top: 50%;
    padding: 0 2px;
    margin-left: 4px;
    transform: translateY(-50%);
  }

  ::v-deep .van-tab {
    color: $disabled-color;
  }

  ::v-deep .van-tab--active {
    color: $main-text-color;
  }

  ::v-deep .van-tabs__wrap::after {
    border-top: 0 none;
  }
}
</style>
