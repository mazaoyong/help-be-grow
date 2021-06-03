<template>
  <div v-if="show" class="version-wrapper">
    <slot />
  </div>
</template>

<script>
import { getEffectsByName } from '../../utils';

export default {
  name: 'version-wrapper',

  props: {
    name: {
      type: String,
      default: '',
    },
    downgrade: {
      type: Object,
      default() {
        return {
          from: false,
        };
      },
    },
  },

  data() {
    return {
      effects: [],
      show: true,
    };
  },

  created() {
    this.effects = getEffectsByName(this.name, this.downgrade);
    this.parseEffects(this.effects);
  },

  methods: {
    parseEffects(effects) {
      if (Array.isArray(effects)) {
        effects.forEach(effect => this.useEffect(effect));
      }
    },
    useEffect(effect) {
      switch (effect.key) {
        case 'show':
          if (typeof effect.value === 'boolean') {
            this.show = effect.value;
          }
          break;
        case 'prop':
          if (typeof effect.value === 'object') {
            this.useProp(effect.value);
          }
          break;
        default:
          break;
      }
    },
    useProp({ key = '', value = '' }) {
      if (!key) {
        return;
      }

      // 劫持 prop
      const effect = function() {
        const propsProxy = this._props;
        Object.defineProperty(propsProxy, key, {
          get() { return value; },
        });
      }
      
      // 获取到 slot 组件的 mounted 配置
      // 塞入 effect 逻辑
      const slotNode = this.$slots &&
        this.$slots.default && this.$slots.default[0];
      let nodeOptions;
      if (slotNode && (nodeOptions = slotNode.componentOptions)) {

        let comOptions;
        if (nodeOptions.Ctor && (comOptions = nodeOptions.Ctor.options)) {
          
          if (Array.isArray(comOptions.mounted)) {
            comOptions.mounted.push(effect);
          } else {
            comOptions.mounted = [effect];
          }
        }
      }
    },
  },
};
</script>
