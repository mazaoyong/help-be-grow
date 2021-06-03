export default {
  data() {
    return {
      displayValue: false,
    };
  },
  props: {
    value: Boolean,
  },
  watch: {
    value(newVlaue) {
      this.displayValue = newVlaue;
    },
    displayValue(newVlaue) {
      if (typeof newVlaue === 'boolean' && !newVlaue) {
        this.$emit('input', false);
      }
    },
  },
  methods: {
    closePopup() {
      this.$emit('input', false);
    },
  },
};
