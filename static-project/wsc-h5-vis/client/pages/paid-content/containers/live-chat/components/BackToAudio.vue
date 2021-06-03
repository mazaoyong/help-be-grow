<template>
  <div
    v-if="value"
    class="back-to-audio-wrap"
    @click="handleClick">
    回到播放位置
  </div>
</template>

<script>
import popupMixins from '../mixins/popup.js';
export default {
  name: 'back-to-audio',

  mixins: [popupMixins],

  data() {
    return {

    };
  },

  methods: {
    handleClick() {
      this.$emit('back');
      this.closePopup();
    },
  },
};
</script>

<style lang="scss">
  .back-to-audio-wrap {
    padding: 0 12px 0 30px;
    color: #666;
    font-size: 12px;
    box-shadow: 0 1px 5px rgba(0, 0, 0, .12);
    position: fixed;
    bottom: 65px;
    left: 50%;
    transform: translateX(-50%);
    height: 30px;
    line-height: 30px;
    border-radius: 15px;
    z-index: 9;
    background-color: #fff;

    &::before {
      display: block;
      content: '';
      width: 18px;
      height: 18px;
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAABNFJREFUWAnNlk1sFVUUx//zeNqv90IkNlWJaUnUoEEIISbw5qH1k4WKdsfGRGJa3LgwwAJdyErcsdCFiQsXihgTfPZDDSKkMdQaIyE2grKQFguYhmggQKC17XjO7ZzpmevcmXkFU27yes4959xzfnPv3DMFbvHhLZCv3nXBAuugnkL1xGbx5AbOWzRvXBaY9ueCzFM4T4wuXI+eCZlV/Eb9DJsFkepPA1ioz7WDaSBOnwvCZefi2qf1JDC7sD3XaxJ9BR0R6q6ibBef1nmZ93gfqk8dwpede1FOi+Ngx5DcMbdttOcSrO2iiwTB+UuaMUBvW4l+Q9Mn8Nzg67gSLtY7I7pIya9lzLdEeaKCysaqtoseyc4aqsXSHBwZJyl6RaEVG+95CAf+OIx/wlxRvDUPpzEhscYoRxwzqnBtF52l+RGcXyyj3+zcLPZN/oW1pI+T129ch/7qHtrR+QfU67mEzFl3DgF0BoQOSWbA2PbYAdo5gZvBJ7/tRvd3W3B6+hyeuQmQUg8MGE1CGBFi19LoDHfbUvTxzgW0cyffRPfZYZpRrsGtGJs6g00acsPu/1wcqcFS8mtbpLMzKUDbdIxnw/36BnrOHzNwUVJSgg0foqNlOb6h7PeSd+j6MTx/dJe5OPwgchFsGcvBk6wjjoHmhOO83vBWnLnqPm7Ja0teK8P4sgA5mAM9vhD6WO2dq+6D/+RB9K5+1RynKZICafx5/nCbkaeQeJlHkuCiC8HvnAXnMVxjG2qehwebV8Ivl1Cb+AlTnPBsLy62PYH+28t4gSqtKt6NatiCjF+KuqTZHcsZgZGdvxBRE1Zws+zjdQJHb1WJDJP0UjVQ3PcXaugaeR+XOYZG4H+E9qY2HKJV5p0Mm3nknwuL3s1wiiD7iAtopPb78swlrD+8Ca/QhWA4MzbuR4V3juEwjf1XTuMR0se9AiqtXaitfc30QRM79BLGJo5gzcx1PEvtey/uw13kkM2YS5jwlwPsIG1L0k08wfkNrfhC4H7egZ4LJzDrv4cVTQ/ga94p3sm/B/Di8Xfnd5LqyS3WN1jrGjOw30GB1dLWvUc/Q6XhTvQyHB/7yHZsYzjOPP4VLi73MVC8A5tpJ1c13Q9/WRs+/3OYzmEBg4sLAC8XXcuYTq2mom/zLzuxbWJk/tiFYf0H6Ci146Ds5OVBbP5xT6wP6l3TuqRgmeMdVOE2HN9mgptRIaIGP3RjVPogv5PlTvTRF6VFAvLK7EsSZiK4WB88Rd9edWF4B/TPrKI+OHptAk+Tx1ycloqB5H8gcg8+PjlCXmTrZh7rgwE+PvUWeujbG93mrGrVT9HeuAzf8nETrHz2uMXYRytzSRnYgOwQSOOL9UGC+/1tdI8N5oeTSgTZoSHz9sGiJHDIwCuigfvg7BTGj3ThuCMu03x0C0bXvYOHl65GpRCgOeyD0qid67N2UBbKrvJc6+LPK/URii6Sc2jdzO0+yEYN4NI57kaGgIjkXFqPcicBsvP/AosKk5IIpANYdwGyT0MmzdnGI62QncMV78yRBsjJkgqw/WYOJxwXyQLkmCzItAJpa9PWcV0zOEFakjBsUYR5AP7U5XqSRUGkorm/xYsFqI9X64vFI3WjU02CSrLJwiQZJUtw1pMrLU9C6lvE9C+2A52DHgGpkgAAAABJRU5ErkJggg==);
      background-repeat: no-repeat;
      background-size: 18px;
    }
  }
</style>
