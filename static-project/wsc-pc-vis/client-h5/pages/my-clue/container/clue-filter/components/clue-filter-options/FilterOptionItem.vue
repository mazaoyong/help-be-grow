<template>
  <div
    :class="['filter-option-item', isChecked ? 'checked' : '']"
    @click="onCheckItem">
    <span class="filter-option-item__content">
      {{ name }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'filter-option-item',

  props: {
    name: {
      type: String,
      default: '',
    },
    id: {
      type: Number,
      default: 0,
    },
    isMulti: {
      type: Boolean,
      default: false,
    },
    checkedList: {
      type: [Number, Array],
      default: () => {
        return 0;
      },
    },
  },

  data() {
    return {
      // isChecked: false,
    };
  },

  computed: {
    isChecked() {
      const list = [].concat(this.checkedList);
      return list.indexOf(this.id) > -1;
    },
  },

  methods: {
    onCheckItem() {
      this.$emit('checkedItem', this.id);
    },
  },
};
</script>

<style lang="postcss">
  .filter-option-item {
    display: inline-block;
    min-width: 30%;
    height: 32px;
    line-height: 32px;
    margin-right: 3%;
    margin-bottom: 10px;
    padding: 0 5px;
    text-align: center;
    font-size: 13px;
    color: #323233;
    border-radius: 2px;
    background-color: #f7f8fa;

    &.checked {
      color: #fff !important;
      background-color: #00b389;
    }
  }
</style>
