/// <reference types="react" />
import { quickEditRender } from './components/grid/components';
import { connect } from './components/list';
import './styles/filter.scss';
import './styles/goods-card.scss';
import './styles/grid.scss';
import { DatePickerTypes, ITabsProps, IFilterProps, ISearchProps } from './types/filter';
import { IEasyGridProps, IEasyGridRef } from './types/grid';
declare const EasyList: {
    Actions: import("react").FC<{
        filter: import("./types/filter").IRenderPropsType;
    } & {
        isLink?: boolean | undefined;
        beforeReset?: import("./types/filter").ActionCustomNodeType;
        afterReset?: import("./types/filter").ActionCustomNodeType;
    }>;
    Search: import("react").ForwardRefExoticComponent<ISearchProps & import("react").RefAttributes<any>>;
    Tabs: import("react").ForwardRefExoticComponent<ITabsProps & import("react").RefAttributes<any>>;
    List: import("react").ForwardRefExoticComponent<import("./types/list").IListProps & {
        children: import("react").ReactNode;
    } & import("react").RefAttributes<import("./types/list").IListContext>>;
    Filter: import("react").ForwardRefExoticComponent<IFilterProps & import("react").RefAttributes<import("./types/filter").IRenderPropsType>>;
    EasyGrid: import("react").ForwardRefExoticComponent<IEasyGridProps & import("react").RefAttributes<IEasyGridRef>>;
    DatePickerTypes: typeof DatePickerTypes;
    HeaderHelp: import("react").FC<import("./types/grid").IHeaderHelpProps>;
    GoodsBriefCard: import("react").FC<import("./types/grid").IGoodsBriefCardProps>;
    quickEditRender: typeof quickEditRender;
    GridPop: import("react").FC<import("./types/grid").IGridPop>;
    GridSweetAlert: import("react").FC<import("./types/grid").IGridSweetAlert>;
    connect: typeof connect;
    InlineFilter: import("react").FC<{
        left: import("react").ReactNode;
        right: import("react").ReactNode;
    }>;
    PureFilter: import("react").ForwardRefExoticComponent<IFilterProps & import("react").RefAttributes<import("./types/filter").IRenderPropsType>>;
    PureSearch: import("react").FC<ISearchProps>;
    PureTabs: import("react").ForwardRefExoticComponent<ITabsProps & import("react").RefAttributes<any>>;
    PureGrid: import("react").ForwardRefExoticComponent<IEasyGridProps & import("react").RefAttributes<IEasyGridRef>>;
    useList: (params: import("./types/list").IListProps) => import("./types/list").IListContext;
};
export default EasyList;
export * from './types/filter';
export * from './types/grid';
export * from './types/list';
