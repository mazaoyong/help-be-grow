<template>
  <div class="custom-btn">
    {{ activityData.originalPrice ? '推荐给好友' :'免费送好友' }}
    <div class="pop-tips">
      <div class="pop-content">
        <div class="tip-img">
          <img src="https://img01.yzcdn.cn/upload_files/2020/12/09/Fjt821CNarm9od6sl6fp9Bn2dAis.png">
        </div>
        <p class="tip-text">
          {{ activityData.originalPrice ? '推荐好友下单立赚': '免费送课给好友立领' }}
        </p>
        <div class="tip-reward">
          {{ activityData.commissionPrice ? `￥${format(activityData.commissionPrice, true, false)}` : '奖励' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import format from '@youzan/utils/money/format';
export default {
  props: {
    activityData: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    format,
  },
};
</script>

<style lang="scss" scoped>
.custom-btn {
  position: relative;

  .pop-tips {
    position: absolute;
    top: 22px;
    left: 50%;
    background: #323233;
    border-radius: 18px;
    opacity: .8;
    transform: translateX(-50%);
    animation: breath 1200ms linear 1200ms infinite;
    z-index: 2;

    &::before {
      position: absolute;
      top: -5px;
      left: 50%;
      width: 0;
      height: 0;
      border-right: 5px solid transparent;
      border-bottom: 5px solid #323233;
      border-left: 5px solid transparent;
      content: '';
      transform: translateX(-50%);
    }
  }

  .pop-content {
    display: flex;
    padding: 5px 7px;
    line-height: 15px;
    letter-spacing: 0;
    box-sizing: border-box;
    align-items: center;
  }

  @keyframes breath {
    from {
      top: 22px;
    }

    50% {
      top: 26px;
    }

    to {
      top: 22px;
    }
  }

  .tip-img {
    width: 27px;
    height: 27px;
    min-width: 27px;
    background: #7c7c84;
    border-radius: 100%;

    img {
      width: 100%;
    }
  }

  .tip-text {
    min-width: 110px;
    margin-left: 7px;
    font-size: 12px;
    font-weight: bold;
    color: #fff;
  }

  .tip-reward {
    min-width: 35px;
    margin-left: 6px;
    font-size: 16px;
    font-weight: bold;
    color: #ffd268;
  }
}
</style>
