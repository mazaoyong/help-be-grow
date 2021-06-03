<template>
  <div class="block-rules">
    <div class="block-rules__action" @click="openRulesPopup">
      规则
    </div>

    <vis-popup
      v-model="showRules"
      title="助力规则"
      :buttons="buttons"
      close-on-click-overlay
    >
      <ol class="block-rules__list">
        <li v-for="(rule, index) in rules" :key="rule" class="block-rules__list-item">
          {{ index + 1 }}. {{ rule }}
        </li>
      </ol>
    </vis-popup>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { Popup as VisPopup } from '@youzan/vis-ui';

export default {
  name: 'block-rules',

  components: {
    VisPopup,
  },

  data() {
    return {
      showRules: false,
      buttons: [
        {
          text: '我知道了',
          class: 'main-btn',
          onClick: () => {
            this.showRules = false;
          },
        },
      ],
    };
  },

  computed: {
    ...mapGetters(['rules']),
  },

  methods: {
    openRulesPopup() {
      this.showRules = true;
    },
  },
};
</script>

<style lang="scss">
.block-rules {
  .vis-standard-popup__title {
    margin: 24px 0 16px;
    font-size: 20px;
    line-height: 28px;
  }

  &__action {
    height: 28px;
    padding: 0 8px;
    font-size: 12px;
    line-height: 28px;
    color: #fff;
    background: rgba(0, 0, 0, .24);
    border-radius: 0 0 8px 8px;
  }

  &__list {
    margin: 0 24px;
    font-size: 14px;
    line-height: 26px;
    color: #323233;
  }

  .main-btn {
    color: #fff;
    background: #fa1919;
  }
}

body:not(.is-iphonex) {
  .block-rules .vis-standard-popup__buttons {
    padding-bottom: 24px;
  }
}
</style>
