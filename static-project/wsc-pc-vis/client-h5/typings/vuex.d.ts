import _Vue, { WatchOptions } from "vue";

// 映射函数类型到其返回值
export type ResultMap<M> = {
  [K in keyof M]: ReturnType<M[K]>;
}

export declare class Store<States, Getters, Mutations, Actions> {
  constructor(options: StoreOptions<States, Getters, Mutations, Actions>);

  readonly state: States;
  readonly getters: ResultMap<Getters>;

  replaceState(state: States): void;

  dispatch: Dispatch<Actions> & ModuleDispatch;
  commit: Commit<Mutations> & ModuleCommit;

  // 业务中没有用到
  subscribe<P extends MutationPayload>(fn: (mutation: P, state: States) => any): () => void;
  // 业务中没有用到
  subscribeAction<P extends ActionPayload>(fn: SubscribeActionOptions<P, States>): () => void;
  // 业务中没有用到
  // eslint-disable-next-line max-len
  watch<T>(getter: (state: States, getters: ResultMap<Getters>) => T, cb: (value: T, oldValue: T) => void, options?: WatchOptions): () => void;

  registerModule<T>(path: string, module: Module<T, States>, options?: ModuleOptions): void;
  registerModule<T>(path: string[], module: Module<T, States>, options?: ModuleOptions): void;

  unregisterModule(path: string): void;
  unregisterModule(path: string[]): void;

  // 业务中没有用到
  hotUpdate(options: {
    actions?: ActionTree<States, States>;
    mutations?: MutationTree<States>;
    getters?: GetterTree<States, States>;
    modules?: ModuleTree<States>;
  }): void;
}

export declare function install(Vue: typeof _Vue): void;

export interface Dispatch<Actions> {
  // eslint-disable-next-line max-len
  <Key extends keyof Actions>(type: Key, payload?: Parameters<Actions[Key]>[1], options?: DispatchOptions): Promise<ReturnType<Actions[Key]> extends Promise<infer T> ? T : ReturnType<Actions[Key]>>;
  <P extends Payload>(payloadWithType: P, options?: DispatchOptions): Promise<any>;
}

export interface Commit<Mutations> {
  <Key extends keyof Mutations>(type: Key, payload?: Parameters<Mutations[Key]>[1], options?: CommitOptions): void;
  <P extends Payload>(payloadWithType: P, options?: CommitOptions): void;
}

// 针对module的commit，dispatch的payload类型需要自行指定
// TODO: 后续ts4.1.0正式版出了之后可以做到module的类型推导
export interface ModuleDispatch {
  <P extends ActionPayload>(type: string, payload?: P, options?: DispatchOptions): Promise<any>;
}

export interface ModuleCommit {
  <P extends MutationPayload>(type: string, payload?: P, options?: CommitOptions): Promise<any>;
}

export interface ActionContext<S, R> {
  dispatch: ModuleDispatch;
  commit: ModuleCommit;
  state: S;
  getters: any;
  rootState: R;
  rootGetters:any;
}

export interface Payload {
  type: string;
}

export interface MutationPayload extends Payload {
  payload: any;
}

export interface ActionPayload extends Payload {
  payload: any;
}

export type ActionSubscriber<P, S> = (action: P, state: S) => any;

export interface ActionSubscribersObject<P, S> {
  before?: ActionSubscriber<P, S>;
  after?: ActionSubscriber<P, S>;
}

export type SubscribeActionOptions<P, S> = ActionSubscriber<P, S> | ActionSubscribersObject<P, S>;

export interface DispatchOptions {
  root?: boolean;
}

export interface CommitOptions {
  silent?: boolean;
  root?: boolean;
}

export interface StoreOptions<States, Getters, Mutations, Actions> {
  state?: States | (() => States);
  getters?: Getters;
  actions?: Actions;
  mutations?: Mutations;
  modules?: ModuleTree<States>;
  plugins?: Plugin<States, Getters, Mutations, Actions>[];
  strict?: boolean;
}

export type ActionHandler<S, R> = (injectee: ActionContext<S, R>, payload: any) => any;
export interface ActionObject<S, R> {
  root?: boolean;
  handler: ActionHandler<S, R>;
}

export type Getter<S, R> = (state: S, getters: any, rootState: R, rootGetters: any) => any;
export type Action<S, R> = ActionHandler<S, R> | ActionObject<S, R>;
export type Mutation<S> = (state: S, payload: any) => any;
export type Plugin<States, Getters, Mutations, Actions> = (store: Store<States, Getters, Mutations, Actions>) => any;

export interface Module<S, R> {
  namespaced?: boolean;
  state?: S | (() => S);
  getters?: GetterTree<S, R>;
  actions?: ActionTree<S, R>;
  mutations?: MutationTree<S>;
  modules?: ModuleTree<R>;
}

export interface ModuleOptions {
  preserveState?: boolean;
}

export interface GetterTree<S, R> {
  [key: string]: Getter<S, R>;
}

export interface ActionTree<S, R> {
  [key: string]: Action<S, R>;
}

export interface MutationTree<S> {
  [key: string]: Mutation<S>;
}

export interface ModuleTree<R> {
  [key: string]: Module<any, R>;
}

declare const _default: {
  Store: typeof Store;
  install: typeof install;
  mapState: typeof mapState,
  mapMutations: typeof mapMutations,
  mapGetters: typeof mapGetters,
  mapActions: typeof mapActions,
  createNamespacedHelpers: typeof createNamespacedHelpers,
};
export default _default;


// vuex-helper
type Dictionary<T> = { [key: string]: T };
type Computed = () => any;
type MutationMethod = (...args: any[]) => void;
type ActionMethod = (...args: any[]) => Promise<any>;
type CustomVue = typeof _Vue & Dictionary<any>;

interface Mapper<R> {
  (map: string[]): Dictionary<R>;
  (map: Dictionary<string>): Dictionary<R>;
}

interface MapperWithNamespace<R> {
  (namespace: string, map: string[]): Dictionary<R>;
  (namespace: string, map: Dictionary<string>): Dictionary<R>;
}

interface FunctionMapper<F, R> {
  (map: Dictionary<(this: CustomVue, fn: F, ...args: any[]) => any>): Dictionary<R>;
}

interface FunctionMapperWithNamespace<F, R> {
  (
    namespace: string,
    map: Dictionary<(this: CustomVue, fn: F, ...args: any[]) => any>
  ): Dictionary<R>;
}

interface MapperForState {
  <S>(
    map: Dictionary<(this: CustomVue, state: S, getters: any) => any>
  ): Dictionary<Computed>;
}

interface MapperForStateWithNamespace {
  <S>(
    namespace: string,
    map: Dictionary<(this: CustomVue, state: S, getters: any) => any>
  ): Dictionary<Computed>;
}

interface OriginDispatch {
  (type: string, payload?: any, options?: DispatchOptions): Promise<any>;
  <P extends Payload>(payloadWithType: P, options?: DispatchOptions): Promise<any>;
}

interface OriginCommit {
  (type: string, payload?: any, options?: CommitOptions): void;
  <P extends Payload>(payloadWithType: P, options?: CommitOptions): void;
}

interface NamespacedMappers {
  mapState: Mapper<Computed> & MapperForState;
  mapMutations: Mapper<MutationMethod> & FunctionMapper<OriginCommit, MutationMethod>;
  mapGetters: Mapper<Computed>;
  mapActions: Mapper<ActionMethod> & FunctionMapper<OriginDispatch, ActionMethod>;
}

export declare const mapState: Mapper<Computed>
  & MapperWithNamespace<Computed>
  & MapperForState
  & MapperForStateWithNamespace;

export declare const mapMutations: Mapper<MutationMethod>
  & MapperWithNamespace<MutationMethod>
  & FunctionMapper<OriginCommit, MutationMethod>
  & FunctionMapperWithNamespace<OriginCommit, MutationMethod>;

export declare const mapGetters: Mapper<Computed>
  & MapperWithNamespace<Computed>;

export declare const mapActions: Mapper<ActionMethod>
  & MapperWithNamespace<ActionMethod>
  & FunctionMapper<OriginDispatch, ActionMethod>
  & FunctionMapperWithNamespace<OriginDispatch, ActionMethod>;

export declare function createNamespacedHelpers(namespace: string): NamespacedMappers;