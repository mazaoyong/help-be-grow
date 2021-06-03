import { Location } from 'history';
import { ReactNode, ReactText } from 'react';

// ========================
// public interface
// ========================

export interface ICompRouter {
  // 当组件被VisWrap包裹的时候，会被注入这个对象,并且如果location中存在query（Location）属性，该属性会覆盖defaultValue
  location?: Location;
  // 当组件被VisWrap包裹的时候，会传入一个方法，调用该方法能够相对应的修改浏览器地址
  push?: (...args: any) => void;
}

// <--dubbo pageRequest-->
export interface IPageRequest {
  pageNumber: number;
  pageSize?: number;
  sort?: IPageRequestSortType;
  total?: number;
}

interface IPageRequestSortType {
  orders: [
    {
      direction: string;
      nullHandling?: () => void;
      property: string;
    }
  ];
}

// 表格配置
export type IVisListTableColunms = Array<{
  /** 列头的名称 */
  title: ReactNode;
  /** 对应数据中的 key (建议设置) 支持  a.b.c 的嵌套写法 */
  name?: string;
  /** 列表宽度 11px | 11 */
  width?: string | number;
  /** 渲染复杂组件 */
  bodyRender?: ((data: any, pos: {row: number, column: number, fixed?: 'left' | 'right'}, name: string) => ReactNode) | ReactNode;
  /** 列头的 className */
  className?: string;
  /** 是否支持排序 (⚠️使用此功能 请设置 name) */
  needSort?: true;
  /** 列合并 当为 0 时不渲染 */
  colSpan?: number;
  /** 是否固定列 可选值为  left  right  true ( true 与  left 等效) */
  fixed?: 'left' | 'right' | true;
  /** 点击单元格回调 */
  onCellClick?: (data: any, event: Event) => any;
  /** 文本对齐方式 */
  textAlign?: 'center' | 'left' | 'right';
  /** 默认显示文字 */
  defaultText?: ReactNode;
  /** 渲染分组表头 */
  children?: ReactNode[];
  // 其他自定义字段
  [key: string]: any;
}>

// <-- vis-table -->
type IBatchFunc = (data: any[]) => ReactNode;
export interface IVisListTableProps extends ICompRouter {
  columns: IVisListTableColunms;
  /** 该参数可以是一个url字符串用于使用该url获取表单数据，或者是[Methods, url]形式的数组 */
  fetchData?: (object) => Promise<any>;
  /** 格式化表单初始查询参数（可能存在API需要接受若干数量的默认参数） */
  initQueries?: object;
  /** 主动调用的查询参数 */
  zanQueries?: object;
  /** 用于格式化查询参数 */
  formatReq?: (param: { filterConditions: object; pageConditions: IPageRequest }) => any;
  /** 用于格式化fetch拿到的data */
  formatRes?: (data: object) => { datasets: any[]; total: number; current?: number };
  /** 表单的onChange事件 */
  onChange?: (conf) => void;
  /** 当表单数据发生变化的时候，会触发这个事件来通知外部 */
  onDataChange?: (datasets: any[]) => void;
  /** 当组件被设置为开启选择功能的时候，每当表格的一行被选中会触发这个事件 */
  onSelect?: (selectedRow: any[], datasets: any[]) => void;
  pageConfig?: IPageableProperty;
  rowKey?: string;
  /** 是否开启选择模式 */
  selectable?: boolean | ISelectableProperty;
  /** 批量操作 */
  batchComponents?: (ReactNode | IBatchFunc)[];
  // 可选时checkbox 的props
  getCheckboxProps?: (data: any) => any;
}

export interface IVislistTableState {
  datasets: any[];
  loading: boolean;
  pageConfig: IPageableProperty;
  queries?: object;
  selectedRowKeys: any[];
  sortBy: string;
  sortType: 'desc' | 'asc';
  addonProps: object;
  prevLocation?: Location;
}

export interface IPageableProperty {
  conf?: any;
  current: number;
  limit?: number;
  pageSize?: number;
  total?: number;
  pageSizeOptions?: number[]
}

interface ISelectableProperty {
  needCrossPage: boolean;
  isSingleSelection: boolean;
}

// 选择处理函数
export type IHandleSelect = (rowKeys?: any, datasets?: any) => void;

// <-- vis-filter -->
export interface IVisListFilterProps extends ICompRouter {
  options: FilterOptions;
  /** Filter组件的默认value */
  defaultValue?: IFilterValueOrHides;
  hides?: IFilterValueOrHides;
  className?: string;
  onChange?: (value: object) => void;
  onSubmit?: (value: object) => void;
  children?: ReactNode | ReactNode[];
  bottomActions?: (filter: IFilterMethod) => ReactNode | ReactNode[];
}

export interface IFilterMethod {
  data(): void;
  /** 该方法用于提交filter数据 */
  submit(): void;
  /** 用于重置filter数据 */
  reset(): void;
}

type FilterOptsTypes = 'Select' | 'Input' | 'Checkbox' | 'DateRangePicker' | 'DateRangeQuickPicker';

export interface IFilterOptsItem {
  type: FilterOptsTypes;
  name: string;
  label: string;
  data?: [
    {
      value: any;
      text: string;
    }
  ];
  props?: Record<string, any>;
}

type FilterOptions = IFilterOptsItem[] | null;

interface IFilterValueOrHides {
  [key: string]: any;
}

export interface IFilterConf {
  options: FilterOptions;
  defaultValue?: IFilterValueOrHides;
  hides?: IFilterValueOrHides;
}

// 处理事件函数的第二个参数
export interface IFilterChangeConf {
  data?: {
    value: string;
    text?: string;
  };
  date?: string | number | Date | [ReactText, ReactText] | [string | number | Date, string | number | Date];
  chooseDays?: number;
}

export type Methods = 'GET' | 'PUT' | 'POST' | 'DELETE' | 'OPTIONS';

export type FetchingData = (fetchData?: string | [Methods, string]) => void | Promise<any>;

// <-- vis-search -->
export interface IVisSearchProps extends ICompRouter {
  /** name用于标识字段 */
  name: string;
  className?: string;
  position?: 'left' | 'right';
  placeholder?: string;
  /** 当输入的时候触发，入参(value: 输入内容, e: event对象) => void */
  onChange?: (value: { [name: string]: string }, e: React.ChangeEvent) => void;
  /** 当敲击回车以及点击搜索图标会触发该事件 */
  onSubmit?: (value: { [name: string]: string }) => void;
  /** 额外添加的查询条件 */
  addonQuery?: { [name: string]: string };
}
