<template>
  <vis-popup v-model="show" title="活动规则">
    <div class="rule-pop">
      <div class="rule-pop__content">
        <b>奖励说明：</b>
        <p>1.分享指定课程给好友，好友下单后，同时达到奖励节点时，分享者可获得对应节点的奖励</p>
        <p>2.积分、优惠券、佣金奖励目前会自动发放到账户中，课程赠品、实物赠品需要用户手动进行领取。赠品发放后需要在一定时间内进行领取，否则会自动失效无法领取。</p>
        <p>领取赠品路径：个人中心-赠品</p>
        <br>
        <br>
        <br>
        <br>
        <b>其他说明：</b>
        <p>1、活动有效期内，相同好友重复下单视为一次有效分享，例如你将一门2元的特价课分享给好友，好友下了两次单，此时只能算你邀请1位好友下单，而不是2位好友。</p>
        <p>2.若奖励未到帐请联系客服进行处理。奖励的使用有效期以实际发放奖励为准，请及时使用。</p>
        <p>3.通过不正当手段参与活动获得奖励，店铺有权撤销奖励。在法律范围内，本店铺有最终活动解释权。如有疑问请联系店铺客服。</p>
      </div>
      <div class="rule-pop__close" @click="show = false">
        我知道了
      </div>
    </div>
  </vis-popup>
</template>

<script>
import { Popup } from '@youzan/vis-ui';

export default {
  components: {
    'vis-popup': Popup,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';
@import 'var';

.rule-pop {
  min-width: 240px;
  padding: 30px 20px;
  padding-top: 10px;
  text-align: left;
  background-color: $c-white;

  &__title {
    line-height: 28px;
    margin-bottom: 18px;
    font-size: 20px;
    color: $c-black;
  }

  &__content {
    max-height: 300px;
    overflow-y: auto;
    margin-bottom: 20px;
    font-size: 14px;
    color: $c-black;
    -webkit-overflow-scrolling: touch;

    b {
      font-weight: bold;
    }

    p {
      line-height: 25px;
    }
    b + p {
      margin-top: 10px;
    }
  }

  &__close {
    background-image: linear-gradient(131deg, #FF7B17 0%, #FF2B00 100%);
    border-radius: 22px;
    font-size: 14px;
    color: #FFFFFF;
    text-align: center;
    height: 44px;
    line-height: 44px;
  }
}
</style>
