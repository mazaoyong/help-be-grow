<script>
export default {
  props: {
    slotContent: {
      type: Array,
      default() {
        return [];
      },
    },
    toolTipStyle: {
      type: Object,
      default() {
        return {};
      },
    },
    showTip: {
      type: Boolean,
      default: false,
    },
  },
  render(createElement) {
    if (this.showTip) {
      return createElement('div', {
        'class': {
          'vis-tool-tip': true,
        },
        on: {
          click: function(event) {
            event.stopPropagation();
          },
        },
        style: this.toolTipStyle,
      }, [
        createElement('div', {
          'class': {
            'vis-tool-tip__arrow': true,
          },
        }),
        createElement('div', this.slotContent),
      ]);
    } else {
      return null;
    }
  },
};
</script>

<style lang="scss">
  .vis-tool-tip {
    position: absolute;
    background-color: rgba(17, 17, 17, .7);
    padding: 8px;
    border-radius: 2px;
    cursor: pointer;

    &__arrow {
      position: absolute;
      top: -8px;
      right: 4px;
      width: 0;
      height: 0;
      border: 8px solid transparent;
      border-top: 0;
      border-bottom: 8px solid rgba(17, 17, 17, .7);
    }
  }
</style>
