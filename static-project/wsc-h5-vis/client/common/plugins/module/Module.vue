<template>
  <div class="module" />
</template>

<script>
export default {
  name: 'module',

  props: {
    name: {
      type: String,
      default: '',
    },
    component: {
      type: String,
      default: '',
    },
  },

  beforeCreate() {
    if (!this.$options.propsData.name) return;

    const moduleName = this.$options.propsData.name;
    let parent = this.$parent;
    let component, components, module;
    const componentName = this.$options.propsData.component || `module-${moduleName}`;
    while (parent && !component) {
      module = parent.$options.$modules && parent.$options.$modules[moduleName];
      if (module) {
        if ((components = module.components)) {
          component = components[componentName];
        }

        if (component || (component = module.component)) {
          this.$options.components[componentName] = component;
        }
      } else {
        parent = parent.$parent;
      }
    }

    if (component) {
      this.$options.render = function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c('div', { staticClass: 'module' }, [_c(componentName, { props: this.$attrs, on: this.$listeners })], 1);
      };
    }

    this.module = module;
  },

  mounted() {
    if (this.module && this.module.methods) {
      const componentInstance = this.$children[0];
      Object.keys(this.module.methods).forEach(key => {
        this[key] = this.module.methods[key].bind(Object.create({
          componentInstance,
        }));
      });
    }
  },
};
</script>

<style lang="scss">
.module {}
</style>
