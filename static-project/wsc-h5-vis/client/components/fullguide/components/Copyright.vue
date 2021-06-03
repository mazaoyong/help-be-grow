<template>
  <div class="fullguide-copyright">
    <p class="fullguide-follow__text">
      长按图片【识别二维码】关注公众号
    </p>
    <p class="fullguide-follow__text-title">
      你还可以
    </p>
    <p class="fullguide-follow__text-step">
      1.打开微信，点击‘添加朋友’
    </p>
    <p class="fullguide-follow__text-step">
      2.点击“公众号”
    </p>
    <p class="fullguide-follow__text-step">
      3.搜索公众号：{{ weixin }}
    </p>
    <p class="fullguide-follow__text-step">
      4.点击“关注”，完成
    </p>
  </div>
</template>

<script>
export default {
  name: 'copyright',

  props: ['weixin'],
};
</script>
