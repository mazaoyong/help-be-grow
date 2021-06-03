<template>
  <div class="rules">
    <div role="button" class="button" @click="openRulesPopup">
      规则
    </div>

    <vis-popup
      v-model="showRules"
      title="活动规则"
      :buttons="buttons"
      close-on-click-overlay
    >
      <h2 class="title">
        奖励规则：
      </h2>
      <ol class="contents">
        <li v-for="rule in rewardRules" :key="rule" class="content">
          {{ rule }}
        </li>
      </ol>
      <h2 class="title">
        其他规则：
      </h2>
      <ol class="contents">
        <li v-for="rule in extraRules" :key="rule" class="content">
          {{ rule }}
        </li>
      </ol>
    </vis-popup>
  </div>
</template>

<script>
import Vue from 'vue';
// import { mapGetters } from 'vuex';
import { Popup as VisPopup } from '@youzan/vis-ui';
import { TUITION_RULES_REWARD, TUITION_RULES_EXTRA } from '../constants';

export default Vue.extend({
  name: 'block-rules',
  components: {
    VisPopup,
  },

  data() {
    return {
      rewardRules: TUITION_RULES_REWARD,
      extraRules: TUITION_RULES_EXTRA,
      showRules: false,
      buttons: [
        {
          text: '我知道了',
          class: 'confirm-button',
          onClick: () => {
            // @ts-ignore
            this.showRules = false;
          },
        },
      ],
    };
  },

  methods: {
    openRulesPopup() {
      this.showRules = true;
    },
  },
});
</script>

<style lang="scss" scoped>
.rules {
  ::v-deep .vis-standard-popup__title {
    font-size: 20px;
    font-weight: 500;
    margin-top: 12px;
  }
  .button {
    padding: 2px 8px;
    border-radius: 100px;
    font-size: 14px;
    color: #ffffff;
    text-align: center;
    line-height: 18px;
    background-color: rgba($color: #000000, $alpha: 0.2);
  }
  .title {
    font-size: 14px;
    padding: 0 24px;
    margin-top: 8px;
  }
  .contents {
    padding: 4px 24px;
    .content {
      font-size: 14px;
      line-height: 1.5;
      margin-top: 12px;
    }
  }
  ::v-deep .confirm-button {
    color: #ffffff;
    border: none;
    background-image: linear-gradient(
      90deg,
      #ff6713 0%,
      #ff6713 0%,
      #ff551f 100%
    );
  }
}
</style>
