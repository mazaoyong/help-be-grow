import { default as PureFilter } from './components/filter';
import { default as PureSearch } from './components/filter/Search';
import { default as PureTabs } from './components/filter/Tabs';
import { default as PureGrid } from './components/grid';
import {
  HeaderHelp,
  GoodsBriefCard,
  quickEditRender,
  GridPop,
  GridSweetAlert,
} from './components/grid/components';
import { Actions } from './components/filter/Actions';
import InlineFilter from './components/filter/InlineFilter';
import { List, connect, useList } from './components/list';

import './styles/filter.scss';
import './styles/goods-card.scss';
import './styles/grid.scss';

import {
  DatePickerTypes,
  ITabsProps,
  IFilterProps,
  ISearchProps,
  FilterRefType,
} from './types/filter';
import { IEasyGridProps, IEasyGridRef } from './types/grid';

const Filter = connect<IFilterProps, FilterRefType>(PureFilter);
const Tabs = connect<ITabsProps>(PureTabs);
const Search = connect<ISearchProps>(PureSearch);
const EasyGrid = connect<IEasyGridProps, IEasyGridRef>(PureGrid);

const EasyList = {
  Actions,
  Search,
  Tabs,
  List,
  Filter,
  EasyGrid,
  DatePickerTypes,
  HeaderHelp,
  GoodsBriefCard,
  quickEditRender,
  GridPop,
  GridSweetAlert,
  connect,
  InlineFilter,
  // pure components
  PureFilter,
  PureSearch,
  PureTabs,
  PureGrid,
  // hooks
  useList,
};

export default EasyList;
export * from './types/filter';
export * from './types/grid';
export * from './types/list';
