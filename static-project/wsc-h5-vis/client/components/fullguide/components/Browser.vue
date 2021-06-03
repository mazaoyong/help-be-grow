<template>
  <div
    id="js-share-guide"
    class="js-fullguide fullscreen-guide hide"
    style="font-size: 16px; line-height: 35px; color: #fff; text-align: center;"
  >
    <span class="js-close-guide guide-close">&times;</span>
    <span class="guide-arrow" />
    <div class="guide-inner">
      请点击右上角<br>
      {{ options.message }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'browser',

  props: ['options'],
};
</script>
