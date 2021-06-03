import { Module } from 'vuex';
import { ComponentOptions } from 'vue';
import { RouteConfig } from 'vue-router';

export type VisComponent = ComponentOptions<any> & {
  $modules: Record<string, any>;
  $storePath: string;
  state: string[];
  getters: string[];
  mutations: string[];
  actions: string[];
  rootState: string[];
  rootGetters: string[];
  rootMutations: string[];
  rootActions: string[];
};

export interface IModuleConfig {
  name: string;
  store?: Module<any, any>;
  storePath?: string[];
  components?: Record<string, VisComponent>;
  component?: VisComponent;
  route?: RouteConfig & { component: VisComponent & (() => Promise<VisComponent>) };
  self?: boolean;
  methods?: any;
}
