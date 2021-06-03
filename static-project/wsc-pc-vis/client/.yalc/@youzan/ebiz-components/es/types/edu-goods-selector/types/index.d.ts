import { IChannelSelected, IPropsConfig, ISelectorDialogProps, ITypeFilterOption } from '@youzan/react-components/typings/components/goods-selector-v2';
export declare type EduGoodsType = 'course' | 'content' | 'column' | 'live' | 'contentText' | 'contentAudio' | 'contentVideo';
export declare type SelectTypes = 'all' | 'part';
export declare enum OwlItemType {
    ALL = 0,
    COLUMN = 1,
    CONTENT = 2,
    LIVE = 4,
    OFFLINE_COURSE = 10
}
export interface IEduGoodsSelectorProps extends Omit<ISelectorDialogProps, 'selected' | 'onSelectOk' | 'config' | 'dict'> {
    /** 选中商品的数据 */
    selected?: IChannelSelected;
    /** 是否是单选 */
    isSingle?: boolean;
    /** 是否支持 sku 粒度选择 */
    isSkuMode?: boolean;
    /** 是否隐藏商品管理按钮 */
    isHideManageBtn?: boolean;
    /** 活动类型（显式指定则开启营销模式） */
    activityType?: number;
    /** 商品参与的活动id 编辑时需要传入 */
    activityId?: number;
    /** 后端配置（营销模式下必传） */
    backEndConfig?: any;
    /** 支持选择的商品类型 */
    biz?: EduGoodsType[];
    /** 商品类型筛选项 */
    typeFilterOptions?: ITypeFilterOption[];
    /** 选择模式，全部和部分 */
    selectTypes?: SelectTypes[];
    /** 最多选择多少商品 */
    maxGoodsNum?: number;
    /** 最多选择 sku 数量; */
    maxSkuNum?: number;
    /** 是否显示商品类型筛选（默认隐藏） */
    showTypeFilter?: boolean;
    /** 是否显示商品分组列 */
    showGroupColumn?: boolean;
    /** 是否显示库存列 */
    showStockColumn?: boolean;
    /** 是否显示销量列 */
    showSalesColumn?: boolean;
    /** 是否显示已参与活动列 */
    showJoinActivityColumn?: boolean;
    /** 是否显示不可选原因列 */
    showNotOptionalColumn?: boolean;
    /** 是否过滤已售罄的商品 */
    showSoldOut?: boolean;
    /** 筛选项是否显示内容细分项 */
    showContentFilterSubType?: boolean;
    /** 是否可以选择已售罄的商品 */
    soldOutSelectable?: boolean;
    /** 选择的商品信息是否需要包含 SKU 信息，isSkuMode 为 true 时无需指定 */
    needSkuInfo?: boolean;
    /** 确定 */
    onConfirm: (result: IChannelSelected) => void;
    /** 对后端返回的列表数据做二次处理 */
    mapGoodsValue?: (item: IGoodsValueItem) => IGoodsValueItem | void;
    dictConfig?: IDictConfig;
}
interface IDictConfig {
    /** 是否限制只能选择教育商品（默认只能选择教育商品） */
    isOnlyShowEduGoods?: boolean;
    /** 商品管理的自定义链接 */
    customManageUrl?: string;
}
export interface IGetConfigOptions extends Partial<IEduGoodsSelectorProps> {
    initConfig: IPropsConfig;
    activityType?: number;
    isUmpType: boolean;
}
export interface IFetchGoodsResult {
    items: IGoodsValueItem[];
    paginator: {
        pageSize: number;
        page: number;
        totalCount: number;
    };
}
export declare enum OwlSellerType {
    ONLY_ALONE = 1,
    ONLY_COLUMN = 2,
    ALONE_AND_COLUMN = 3
}
export interface IGoodsValueItem {
    goodsDesc: string;
    goodsDetailUrl: string;
    goodsGroupList: Array<{
        groupId: number;
        groupName: string;
    }>;
    goodsId: number;
    goodsImage: string;
    goodsInventory: number;
    goodsLabelList: string[];
    goodsName: string;
    goodsPrice: number;
    goodsSales: number;
    isSku: boolean;
    isFree: boolean;
    /** 知识付费类型 */
    owlItemType: OwlItemType;
    owlSellerType: OwlSellerType;
    joinActivityList: Array<{
        activityId: number;
        activityName: string;
        activityUrl: string;
        umpType: number;
    }>;
    notOptionalReason: string[];
    optional: boolean;
    skuInfo: {
        columns: Array<{
            _id: number;
            spec: Array<{
                text: string;
            }>;
            text: string;
        }>;
        id: number;
        sku: Array<{
            price: number;
            skuId: number;
            stock: number;
        } & Record<string, any>>;
    };
    sourceShop: string;
}
export {};
