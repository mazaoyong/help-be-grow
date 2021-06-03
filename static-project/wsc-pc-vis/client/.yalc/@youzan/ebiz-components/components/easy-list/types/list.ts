export type HistoryModeType = 'hash' | 'browser' | 'none';
export type QueryFormatterType = (params: Record<string, any>) => Record<string, any>;
export type FilterNormalizerType = (filter: Record<string, any>) => Record<string, any>;

export interface IPageInfo {
  page: number;
  pageSize?: number;
  total: number;
}

export interface IListQuery {
  page?: number;
  pageSize?: number;
  sortType?: string;
  sortBy?: string;
  [propName: string]: any;
}

export interface IFormatData {
  pageInfo: IPageInfo;
  dataset: any[];
}

type FetchFn = (
  state: IRequestParams,
  globalState: IGlobalState,
  reason?: Reason
) => Promise<IFormatData>;

export interface IListProps {
  onSubmit: FetchFn;
  mode?: HistoryModeType;
  /** 调用setFilter方法更新query会调用这个方法，用于格式化filter */
  filterNormalizer?: FilterNormalizerType;
  defaultFilter?: IListQuery;
  /** 可以指定延迟多久进行数据设置 */
  delay?: number;
  onError?(error: Error): void;
  /** 
   * @description 是否在初始化完成List之后立马请求
   * 
   * **default:true**
   * 
   * 场景举例：*在配合filter使用的过程中，可能会存在第一次请求不能带上filter
   * 的默认值的情况，遇到这种情况，在旧版中因为不能打断，所以只能通过设置delay来避免二次请求*
   */
  fetchInInit?: boolean;
}

export interface IFilter {
  pageSize: number;
  [propName: string]: any;
}

interface IListState {
  page: number;
  filter: IFilter;
  total: number;
  dataset: any[];
  loading: boolean;
}

export interface IRequestParams extends IFilter {
  page: number;
}

interface IGlobalState {
  [propName: string]: any;
}

interface IListAction {
  refresh(): void;
  setDataset(data: any[]): void;
  setPage(page: number): void;
  setFilter(nextFilter: Record<string, any>): void;
  setLoading(): void;
  stopLoading(): void;
  setGlobalState(state: Record<string, any>): void;
}

export interface IListContext {
  state: IListState;
  globalState: IGlobalState;
  action: IListAction;
}

export enum Reason {
  Init = 0,
  Filter = 1,
  Page = 2,
  Other = 3,
}
