import Vue, { CreateElement } from 'vue';
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import ModuleComponent from './Module.vue';
import { hasOption, collectMapkeys } from './utils';

const VisApp = function(config: any) {
  if (config.app) {
    config.el = '#app';
    config.render = (h: CreateElement) => h(config.app);
  }
  const router = config.router;
  const store = config.store;

  if (VisApp._modules) {
    Object.keys(VisApp._modules).forEach((name: string) => {
      const module = VisApp._modules[name];
      VisApp._useModule(name, module, router, store);
    });
  }

  Vue.component('module', ModuleComponent);
  Vue.mixin({
    beforeCreate() {
      const options = this.$options;
      let storePaths = [];
      const { $storePath = '' } = options;
      if ($storePath) storePaths.push($storePath);

      let parent = this.$parent;
      while (parent) {
        const options = parent.$options || {};
        const { $storePath = '', $storePaths = [] } = options;
        if ($storePaths.length) {
          storePaths.unshift(...$storePaths);
          break;
        }
        if ($storePath) storePaths.unshift($storePath);
        parent = parent.$parent;
      }

      if (storePaths.length) {
        options.$storePaths = [...storePaths];
        const path = storePaths.join('/');

        // 支持 { state: [] } 选项
        if (Array.isArray(options.state)) {
          options.computed = Object.assign(
            {},
            { ...mapState(path, options.state) },
            options.computed
          );
        }

        // 支持 { getters: [] } 选项
        if (Array.isArray(options.getters)) {
          options.computed = Object.assign(
            {},
            { ...mapGetters(path, options.getters) },
            options.computed
          );
        }

        // 支持 { mutations: [] } 选项
        if (Array.isArray(options.mutations)) {
          options.methods = Object.assign(
            {},
            { ...mapMutations(path, options.mutations) },
            options.methods
          );
        }

        // 支持 { actions: [] } 选项
        if (hasOption('actions', options)) {
          options.methods = Object.assign(
            {},
            { ...mapActions(path, collectMapkeys('actions', options)) },
            options.methods
          );
        }

        // 支持 { rootState: [] } 选项
        if (Array.isArray(options.rootState)) {
          options.computed = Object.assign(
            {},
            { ...mapState(options.rootState) },
            options.computed
          );
        }

        // 支持 { rootGetters: [] } 选项
        if (Array.isArray(options.rootGetters)) {
          options.computed = Object.assign(
            {},
            { ...mapGetters(options.rootGetters) },
            options.computed
          );
        }

        // 支持 { rootMutations: [] } 选项
        if (Array.isArray(options.rootMutations)) {
          options.methods = Object.assign(
            {},
            { ...mapMutations(options.rootMutations) },
            options.methods
          );
        }

        // 支持 { rootActions: [] } 选项
        if (Array.isArray(options.rootActions)) {
          options.methods = Object.assign(
            {},
            { ...mapActions(options.rootActions) },
            options.methods
          );
        }
      }
    },
  } as any);

  // eslint-disable-next-line no-new
  new Vue(config);
};

VisApp._modules = {} as any;

VisApp.usePage = function(module: any | (() => any), name: string = ''): any {
  const mm = typeof module === 'function' ? module() : module;

  name = name || module.name;
  if (!name) {
    console.warn('模块注册失败，请设置模块名', mm);
    return this;
  }

  (VisApp._modules || (VisApp._modules = {}))[name] = mm;
};

VisApp._useModule = function(name: string = '', module: any, router: any, store: any) {
  if (module.store) {
    // 强制使用命名空间
    module.store.namespaced = true;
  }

  const createRegisterMixin = () => ({
    beforeCreate() {
      const store = this.$store;
      if (store) {
        store.registerModule(name, module.store);
      }
    },
    destroyed() {
      const store = this.$store;
      if (store) {
        store.unregisterModule(name);
      }
    },
  } as any);
  if (module.store && module.component) {
    const mixins = module.component.mixins || [];
    mixins.push(createRegisterMixin());
    module.component.mixins = mixins;
    module.component.$storePath = name;
  }

  if (module.route && router) {
    // 注册store模块
    if (!module.component && module.route.component) {
      const component = module.route.component;
      if (typeof component === 'function') {
        if (component.then) {
          component.then((cpt: any) => {
            const component = cpt.default || cpt;
            const mixins = component.mixins || [];
            mixins.push(createRegisterMixin());
            component.mixins = mixins;
            component.$storePath = name;
            return cpt;
          });
        } else {
          const newFn = () => {
            return component().then((cpt: any) => {
              const component = cpt.default || cpt;
              const mixins = component.mixins || [];
              mixins.push(createRegisterMixin());
              component.mixins = mixins;
              component.$storePath = name;
              return cpt;
            });
          };
          module.route.component = newFn;
        }
      } else {
        const mixins = component.mixins || [];
        mixins.push(createRegisterMixin());
        component.mixins = mixins;
        component.$storePath = name;
      }
    }

    router.addRoutes([module.route]);
  }

  if (module.store && !module.route && !module.component) {
    store.registerModule(name, module);
  }

  return this;
};

export default VisApp;
