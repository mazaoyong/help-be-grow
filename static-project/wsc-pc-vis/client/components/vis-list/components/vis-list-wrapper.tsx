/**
 * 这是个简单的高阶函数，用于包裹传入的zent/table或者是zent/grid组件，并且在其中放置了一些API
 * 用以让grid也能够实现table中支持但是grid不支持的属性配置，避免重复书写VisTable以及VisGrid组件
 */
import { Location } from 'history';
import { isEqual } from 'lodash';
import React, { Component } from 'react';
import { Notify, IGridProps } from 'zent';
import isPromise from 'fns/is-promise';
import { formatQueries, getQueries } from '../ultis/index';
import { IHandleSelect, IPageRequest, IVisListTableProps, IVislistTableState } from '../ultis/type';

function VisListWrapper(Comp: React.ComponentClass<any> | React.StatelessComponent<any>) {
  class VisListWrapperComponent extends Component<
  Omit<IGridProps, 'datasets'> & IVisListTableProps,
  IVislistTableState
  > {
    static readonly displayName = 'VisListWrap';

    static defaultProps: Readonly<IVisListTableProps> = {
      columns: [],
      pageConfig: Object.create(null),
      selectable: false,
      formatRes(data: any) {
        return {
          current: data.pageable.pageNumber,
          datasets: data.content,
          total: data.total,
        };
      },
    };

    // 当url发生改变的时候，被VisWrap包裹的VisTable组件会相应URL的变化
    static getDerivedStateFromProps(
      nextProps: Readonly<IVisListTableProps>,
      prevState: Readonly<IVislistTableState>,
    ) {
      const prevLocation = prevState.prevLocation;
      const { location } = nextProps;
      if (prevLocation && !isEqual(prevLocation, location)) {
        return {
          ...getQueries(location, prevState),
          prevLocation: location,
        };
      }
      return null;
    }

    constructor(props: IVisListTableProps) {
      super(props as any);

      let addonProps: object = Object.create(null);
      // 对VisGrid组件传递特殊的props
      if ((Comp.displayName as string) === 'VisGrid') {
        addonProps = { handleToggleSelectAll: this.handleToggleSelectAll };
      }

      const { fetchData, pageConfig } = props;
      // this.fetchingData(fetchData);
      // fetchData应该是一个promise对象
      if (typeof fetchData !== 'function') {
        throw new Error('property fetchData required Promise type object');
      }
      // 在VisTable和VisGrid组件中没有指定onSelect属性的时候，onSelect方法入参不包括selectRows
      // 当onSelect属性被指定的时候，选择事件的回调要能够同时反映到调用该组件的页面中去，其入参为两个
      // 入参，参数分别为rowKeys和selectRows
      this.boundUserSelect();

      this.state = {
        addonProps,
        datasets: [],
        loading: true,
        pageConfig: {
          current: 0,
          pageSize: 20,
          total: 0,
          ...pageConfig,
        },
        prevLocation: props.location,
        selectedRowKeys: [],
        sortBy: 'created_time',
        sortType: 'desc',
      };
    }

    /**
     * 初始化是否开启select功能和pageinfo信息，初始化默认参数
     *
     * @memberof VisList
     */
    componentDidMount() {
      const { initQueries, location } = this.props;
      let state: IVislistTableState | null = null;
      if (location) {
        state = getQueries(location, this.state);
      }
      if (state) {
        this.setState({ ...state.queries } as object);
      }
      this.getDatasets(
        formatQueries({
          ...initQueries,
          ...(state && state.queries),
        }, this.state.pageConfig.pageSize),
      );
    }

    componentDidUpdate(prevProps: IVisListTableProps, prevState: IVislistTableState) {
      const { zanQueries } = this.props;
      const prevZanQueries = prevProps.zanQueries;
      const { loading, pageConfig } = this.state;
      if (!loading) {
        if (!isEqual(zanQueries, prevZanQueries)) {
          // 如果存在zanQueries，则使用zanQueries配合pageRequest来查询
          const { pageConditions } = this.getZanQuery(null);
          this.getDatasets(formatQueries(zanQueries, pageConfig.pageSize, pageConditions));
        } else {
          this.updateWithRouterLocation(prevProps, prevState);
        }
      }
    }

    updateWithRouterLocation(prevProps: IVisListTableProps, prevState: IVislistTableState) {
      // 处理根据浏览器url触发更新的情况
      if (this.props.push) {
        const { loading } = prevState;
        const currentQueries = this.state.queries;

        const _location = this.props.location as Location;
        const _prevLocation = prevProps.location as Location;

        // 当 action，或者search，key 不同的时候触发更新
        const isActionEqual = _location.action === _prevLocation.action;
        const isQueryEqual = _location.search === _prevLocation.search;
        const isKeyEqual = _location.key === _prevLocation.key;

        if (!loading) {
          const zanQuery = {
            ...this.props.initQueries,
            ...currentQueries,
          };
          if (!isActionEqual || !isQueryEqual || !isKeyEqual) {
            this.getDatasets(formatQueries(zanQuery, this.state.pageConfig.pageSize));
          }
        }
      }
    }

    // 当获取数据的时候，通知父组件
    // 触发VisTable的onDataChange事件，入参是表单数据
    dispatchDataUpdate(datasets: any): void {
      const { onDataChange } = this.props;
      if (onDataChange) {
        onDataChange(datasets);
      }
    }

    // 获取表格所需的数据
    getDatasets(queries: { filterConditions: object; pageConditions: IPageRequest }): void {
      const { fetchData } = this.props;
      const pageNumber = queries.pageConditions.pageNumber;
      this.setState({ loading: true });
      if (fetchData) {
        const promise = fetchData(queries);
        if (isPromise(promise)) {
          promise
            .then(data => {
              const { datasets, current, total } = data;
              this.setState({
                datasets,
                pageConfig: {
                  ...this.state.pageConfig,
                  current: current || pageNumber,
                  total,
                },
              });
              this.dispatchDataUpdate(datasets);
            })
            .catch((err: Error) => {
              Notify.error(err);
              throw new Error('获取数据失败');
            })
            .finally(() => this.setState({ loading: false }));
        } else {
          throw new Error('property fetchData required Promise type');
        }
      }
    }

    /**
     * 在页面首次渲染的时候重写该方法减少每次select回调时的判断过程
     *
     * @type {IHandleSelect}
     * @memberof VisList
     */
    boundUserSelect: IHandleSelect = () => {
      const { onSelect } = this.props;
      // 根据是否存在onSelect方法，重写onSelect函数
      if (onSelect) {
        this.onSelect = (rowKeys, selectedRow) => {
          this.setState({ selectedRowKeys: rowKeys });
          const { datasets } = this.state;
          if (typeof onSelect === 'function') {
            onSelect(selectedRow, datasets);
          }
        };
      }
    };

    onSelect: IHandleSelect = rowKeys => {
      this.setState({ selectedRowKeys: rowKeys });
    };

    /**
     * 是否需要渲染选择按钮
     *
     * @memberof VisList
     */
    shouldRenderSelections() {
      const { selectable, rowKey, getCheckboxProps } = this.props;
      if (!rowKey) {
        throw new Error(
          'you should configure rowKey property when you turn option selectable enable',
        );
      }
      if (selectable) {
        if (typeof getCheckboxProps === 'function') {
          return {
            ...(selectable as object),
            onSelect: this.onSelect,
            selectedRowKeys: this.state.selectedRowKeys,
            getCheckboxProps
          };
        }
        return {
          ...(selectable as object),
          onSelect: this.onSelect,
          selectedRowKeys: this.state.selectedRowKeys,
        };
      }
    }

    getZanQuery = (
      conf: any,
    ): {
      sort: object;
      pageConditions: IPageRequest;
      filterConditions: object;
    } => {
      const { current = 1, sortBy, sortType, pageSize } = (conf || {}) as any;
      const { initQueries, zanQueries } = this.props;
      const {
        pageConfig: { pageSize: defaultPageSize },
        queries,
      } = this.state;
      const pageConditions = {
        pageNumber: current || this.state.pageConfig.current,
        pageSize: pageSize || defaultPageSize,
      };
      const sort = sortBy
        ? {
          sortBy,
          sortType: (sortType as string) === '' ? 'desc' : sortType,
        }
        : Object.create(null);
      const filterConditions = {
        ...initQueries,
        ...zanQueries,
        ...queries,
        ...sort,
      };
      return { pageConditions, filterConditions, sort };
    };

    // Table的change事件
    handleTableChange = (conf: any, forceUpdate: boolean = false) => {
      const { onChange, push } = this.props;
      const { pageConfig } = this.state;
      const { sort, filterConditions, pageConditions } = this.getZanQuery(conf);
      this.setState({
        pageConfig: {
          ...pageConfig,
          ...conf,
        },
        selectedRowKeys: [],
        ...sort,
      });
      if (push && !forceUpdate) {
        push({
          ...filterConditions,
          ...pageConditions,
        });
      } else {
        this.getDatasets(formatQueries(filterConditions, pageConfig.pageSize, pageConditions));
      }
      if (onChange) {
        onChange(conf);
      }
    };

    /**
     * 暴露tableChange方法，用于重新获取数据
     * @memberof VisListWrapperComponent
     * @member cancelLoading 用于停止表格的pending状态
     * @member loading 用于主动让表格组件进入pending状态
     * @member refresh 用于刷新表格数据，notIndex表示让页面刷新停留在本页（默认为false)
     */
    // tslint:disable-next-line:member-ordering
    refetchData = {
      cancelLoading: () => this.setState({ loading: false }),
      loading: () => this.setState({ loading: true }),
      refresh: (notIndex: boolean = false) => {
        const conf = Object.create(null);
        if (notIndex) {
          const { pageConfig } = this.state;
          conf.current = pageConfig.current;
        }
        this.handleTableChange(conf, true);
      },
    };

    // 清空table选中项
    resetSelection = () => {
      const { selectable } = this.props;
      if (selectable) {
        this.setState({
          selectedRowKeys: [],
        });
      }
    };

    // VisGrid方法用到这个全选事件
    handleToggleSelectAll = () => {
      const { rowKey } = this.props;
      if (!rowKey) {
        throw new Error('[vis-grid]: please delivery rowKey-prop to enable select function');
      } else {
        const { datasets, selectedRowKeys } = this.state;
        let alias: any[] = [];
        if (datasets.length > selectedRowKeys.length) {
          alias = datasets.map(data => data[rowKey]);
        }
        this.onSelect(alias, datasets);
      }
    };

    render() {
      const { columns, ...tableOptions } = this.props;
      const { pageConfig } = this.state;
      const selection = this.shouldRenderSelections();

      return (
        <Comp
          batchComponentsAutoFixed={false}
          handleToggleSelectAll={this.handleToggleSelectAll}
          {...tableOptions}
          {...this.state}
          className="vis-list"
          selection={selection}
          onChange={this.handleTableChange}
          pageInfo={pageConfig}
          columns={columns}
        />
      );
    }
  }

  return VisListWrapperComponent;
}

export default VisListWrapper;
