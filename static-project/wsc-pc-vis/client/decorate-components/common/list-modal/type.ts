export interface IFilterOption {
  optionsData: any[];
  showCreate: boolean;
  showReload: boolean;
  showIsVirtual: boolean;
  showGoodsType: boolean;
  showSearch: boolean;
  customLeft?: React.ReactNode;
}

export interface IListModalProps {
  tabs: any[];
  pageSize?: number;
  visible: boolean;
  multiple?: boolean;
  emptyLabel: string;
  showCheckbox?: boolean;
  selectedRowKeys: string[];
  selectedRows: string[];
  onClose: (...args) => void;
  onChangeTab: (...args) => void;
  onConfirm: (...args) => void;
  shouldSelect: (...args) => boolean;
  filterOption?: IFilterOption;
  rowKey?: string;
}

export interface IListModalState {
  isFetching: boolean;
  page: number;
  total: number;
  curTabIndex: number;
  selectedRowKeys: string[];
  selectedRows: string[];
  keyword: string;
  is_virtual: string;
  goods_type: string;
  list: any[];
}

export interface IFilterProps extends IFilterOption {
  createUrl: string;
  goodsTypeUrl: string;
  is_virtual?: string;
  goods_type?: string;
  keyword?: string;
  handleChangeKeyword?: (...args) => void;
  onChange?: (...args) => void;
  handleReload?: (...args) => void;
  handleChangeIsVirtual?: (...args) => void;
  handleChangeGoodsType?: (...args) => void;
}

export interface IFilterState {
  goodsTypes: any[];
}
