<script>
import { Cell, Icon } from 'vant';
import { noop } from 'lodash';

export default {
  name: 'card-cell',

  functional: true,

  props: {
    value: {
      type: String,
      default: undefined,
    },

    tip: {
      type: String,
      default: undefined,
    },

    isLink: {
      type: Boolean,
      default: undefined,
    },

    isEditable: {
      type: Boolean,
      default: true,
    },

    border: {
      type: Boolean,
      default: false,
    },

    title: {
      type: String,
      default: undefined,
    },

    leftIcon: {
      type: String,
      default: undefined,
    },

    icon: {
      type: String,
      default: undefined,
    },
  },

  render(createElement, context) {
    const { props, data, listeners } = context;
    const { isEditable, isLink, value, tip, border, title, leftIcon, icon } = props;
    const slots = context.slots();

    // 传递给van-cell的props
    const cellAttrs = Object.assign({}, data.attrs, {
      border,
      icon: leftIcon,
      value: value || tip,
      valueClass: `vis-biz-card-cell__${
        value || slots.default ? 'value' : 'tip'
      }`,
      isLink: isLink === undefined ? isEditable : isLink,
    });

    const cellScopedSlots = {};
    if (!slots.title) {
      const createTitleElement = () =>
        createElement('div', { class: 'vis-biz-card-cell__title' }, [
          createElement('span', title),
          icon &&
            createElement(Icon, {
              class: 'vis-biz-card-cell__icon',
              props: {
                name: icon,
                size: '16',
                color: '#969799',
              },
              on: {
                click: listeners['click-icon'] || noop,
              },
            }),
        ]);

      cellScopedSlots.title = createTitleElement;
    }

    const cellListeners = Object.assign({}, listeners, {
      'click-icon': noop,
      click: isEditable ? listeners.click : noop,
    });

    return createElement(
      Cell,
      Object.assign({}, context.data, {
        class: 'vis-biz-card-cell',
        attrs: cellAttrs,
        on: cellListeners,
        scopedSlots: cellScopedSlots,
      }),
      context.children
    );
  },
};
</script>

<style lang="scss">
@import 'mixins/index.scss';

.vis-biz-card-cell {
  padding-left: 12px;
  padding-right: 12px;
  width: auto;

  &__value {
    color: $main-text-color;
    font-weight: 500;
  }

  &__tip {
    color: $gray-icon-color;
  }

  &__icon {
    margin-left: 4px;
  }

  &__title {
    display: flex;
    align-items: center;
  }

  &:not(:last-child)::after {
    left: 12px;
    right: 12px;
  }

  .van-cell__title {
    flex: none;
    margin-right: 40px;
  }
}
</style>
