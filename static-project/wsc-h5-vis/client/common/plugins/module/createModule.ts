import { IModuleConfig } from './types';

const createModule = (config: IModuleConfig) => {
  if (config.component) {
    config.component = Object.assign({}, config.component, {
      computed: Object.assign({}, config.component.computed),
      methods: Object.assign({}, config.component.methods),
    });
  }

  return () => ({
    ...config,
    useModule(module: IModuleConfig | (() => IModuleConfig), name: string = '') {
      const mm = typeof module === 'function' ? module() : module;

      name = name || mm.name;
      if (!name) return this;

      const { component, components, route } = this;

      if (route) {
        const component = route.component;
        if (typeof component === 'function') {
          const newFn = () => {
            return component()
              .then((cpt: any) => {
                const component = cpt.default || cpt;
                (component.$modules || (component.$modules = {}))[name] = mm;
                return cpt;
              });
          };
          route.component = newFn as any;
        } else {
          (component!.$modules || (component!.$modules = {}))[name] = mm;
        }
      } else if (component) {
        // 将模块赋给组件实例
        (component!.$modules || (component!.$modules = {}))[name] = mm;
      } else if (components) {
        // 将模块赋给每个组件实例
        Object.keys(components).forEach(cptName => {
          const component = components[cptName];
          (component!.$modules || (component!.$modules = {}))[name] = mm;
        });
      }

      // 注册模块store
      if (mm.store) {
        // 强制使用命名空间
        mm.store.namespaced = true;
        if (!this.store) {
          this.store = {};
        }
        (this.store.modules || (this.store.modules = {}))[name] = mm.store;

        if (mm.component) {
          const component = Object.assign({}, mm.component);
          mm.component = component;

          // 设置 store 路径
          // const storePath = (this.storePath || (this.storePath = [])).slice(0);
          // storePath.push(name);
          // mm.storePath = storePath;
          mm.component.$storePath = name;
        }

        if (mm.components) {
          Object.keys(mm.components).forEach(cptName => {
            const component = mm.components![cptName];
            const cpt = Object.assign({}, component);
            cpt.$storePath = name;
            mm.components![cptName] = cpt;
          });
        }
      }

      if (mm.component || mm.components) {
        // Nothing to do
      }

      return this;
    },
    mount() {
      // todo
    },
  });
};

export default createModule;
