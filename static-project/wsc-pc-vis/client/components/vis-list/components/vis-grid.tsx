import React, { Component, ReactNode } from 'react';
import { Grid, IGridProps, IGridBatchRender } from 'zent';
import '@zent/compat/css/table.css';
import { IPageableProperty, IVisListTableProps, IVislistTableState } from '../ultis/type';

interface IExtendProps extends IGridProps {
  datasets: any[];
  loading: boolean;
  pageInfo: IPageableProperty;
  batchComponents?: ReactNode[];
  selection?: { [key: string]: any };
  selectedRowKeys: any[];
  handleToggleSelectAll: () => void;
}

type MixProps = IExtendProps & IVisListTableProps;

// ⚠️VisGrid组件不支持跨页选择的操作！！！！！！！
export default class VisGrid extends Component<MixProps, IVislistTableState> {
  static displayName = 'VisGrid';

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

  state: IVislistTableState = {
    addonProps: Object.create(null),
    datasets: [],
    loading: true,
    pageConfig: {
      current: 0,
      total: 0,
    },
    selectedRowKeys: [],
    sortBy: 'created_time',
    sortType: 'desc',
  };

  constructor(props: MixProps) {
    super(props);
    const { selection } = props;
    if (selection) {
      const { needCrossPage } = selection;
      if (needCrossPage) {
        throw new Error('[vis-grid]: this component does not surpport property needCrossPage');
      }
    }
  }

  renderBatchComponents: IGridBatchRender = selectedRows => {
    const { batchComponents } = this.props;
    if (batchComponents) {
      return batchComponents.map(comp => {
        if (typeof comp === 'function') {
          if (selectedRows.length === 0) {
            return comp([]);
          }
          return comp(selectedRows);
        }
        return comp;
      });
    }
    return null;
  }

  render() {
    const { columns, datasets, pageInfo, onChange, batchComponents, ...resOpts } = this.props;

    return (
      <div className="vis-list__table-container zent-table">
        <Grid
          {...resOpts}
          columns={columns as any}
          datasets={[...datasets]}
          onChange={conf => onChange && onChange(conf)}
          batchRender={batchComponents ? this.renderBatchComponents : undefined}
          pageInfo={pageInfo}
        />
      </div>
    );
  }
}
