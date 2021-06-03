<template>
  <div
    v-if="!noLocation"
    class="feeds-card-operator__location"
  >
    <span @click="clickLocation">
      {{ feed.location.schoolName }}
      <span v-if="feed.location.eduCourseName">
        <span class="separation">·</span>
        {{ feed.location.eduCourseName }}
      </span>
    </span>
  </div>
</template>

<script>
import isEmpty from 'lodash/isEmpty';
export default {
  name: 'location',
  props: {
    feed: {
      type: Object,
      default: () => {},
    },
  },

  computed: {
    noLocation() {
      return isEmpty(this.feed.location);
    },
  },

  methods: {
    clickLocation() {
      if (_global.visBuyer) {
        window.location.href = `/wscshop/showcase/homepage?kdt_id=${this.feed.kdtId}`;
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.feeds-card-operator__location {
  margin-bottom: 8px;
  color: #576B95;
}
</style>
