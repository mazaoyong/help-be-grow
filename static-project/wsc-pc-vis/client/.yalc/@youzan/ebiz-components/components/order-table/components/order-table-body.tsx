import React, { Component, ReactNode } from 'react';
import { orderTableCols } from '../types';
import OrderTableHeader from './order-table-header';

type objectLike = {[key: string]: any};

interface IOrderTableBodyProps {
  selectable?: boolean;
  headKeys: string[];
  bodyKeys: string[];
  columns: orderTableCols;
  datasets: object[];
  selectAll: { [key: string]: boolean };
  extend?: (row: object, index?: number, datasets?: object[]) => ReactNode;
  onSelectChange: (selected: number, row: number) => void;
}

interface IOrderTableBodyState {
  headerRenderConf: any[];
  bodyRenderConf: any[];
  selectRows: number[];
}

export default class OrderTableBody extends Component<IOrderTableBodyProps, IOrderTableBodyState> {
  constructor(props: IOrderTableBodyProps) {
    super(props);

    const { headKeys, bodyKeys, columns } = props;
    const headerRenderConf = headKeys.map((key: string) => columns.find(col => col.name === key));
    const bodyRenderConf = bodyKeys.map((key: string) => columns.find(col => col.name === key));
    this.state = {
      headerRenderConf,
      bodyRenderConf,
      selectRows: [],
    };
  }

  // 渲染checkbox
  renderHeadBox = (data: objectLike, index: number, colSpan: number) => {
    const { selectRows, headerRenderConf } = this.state;
    const { onSelectChange, selectable } = this.props;
    const isSelected = selectRows.findIndex(r => r === index) > -1;

    // 选择事件
    const handleSelect = (checked: boolean) => {
      const res = checked
        ? selectRows.concat(index)
        : selectRows.filter(rowIndex => rowIndex !== index);
      this.setState({ selectRows: res });
      if (onSelectChange) {
        onSelectChange(res.length, index);
      }
    };
    return (
      <tr className="ebiz-order-table__tr" key={`bodyHead${index}`}>
        <td className="ebiz-order-table__body-check" colSpan={colSpan}>
          {selectable && (
            <div className="cell__selection">
              <OrderTableHeader.CheckBox status={{ checked: isSelected }} onSelect={handleSelect} />
            </div>
          )}
          {headerRenderConf.length &&
            headerRenderConf.map((conf: any, index: number) => {
              const { name, title, bodyRender } = conf;
              let val = data[name];
              if (bodyRender) {
                val = bodyRender(data, index);
              }
              return (
                <div key={`${name}${index}`} className="ebiz-order-table__body-header">
                  {title}: {val}
                </div>
              );
            })}
        </td>
      </tr>
    );
  };

  renderContentBox = (data: objectLike, index: number, renderConf: any[]): ReactNode => {
    if (!renderConf.length) {
      return null;
    }
    const { selectable } = this.props;
    const cells = renderConf.map((conf: any, i: number) => {
      const style = { textAlign: conf.textAlign || 'center' };
      // 如果有bodyRender就优先渲染bodyRender，如果没有，就用name方式渲染
      const content = () => {
        if (conf.bodyRender) {
          return conf.bodyRender(data, index);
        }
        return data[conf.name];
      };
      return (
        <td
          colSpan={selectable && i === 0 ? 2 : 1}
          style={style}
          key={`cell${i}`}
          className="ebiz-order-table__body-content-cell"
        >
          {content()}
        </td>
      );
    });

    return (
      <tr key={`contentBox${index}`} className="ebiz-order-table__body-content-box">
        {cells}
      </tr>
    );
  };

  static getDerivedStateFromProps(
    nextProps: IOrderTableBodyProps,
    state: IOrderTableBodyState,
  ): IOrderTableBodyState | null {
    const { selectAll, datasets } = nextProps;
    if (datasets) {
      if (!selectAll.checked && !selectAll.indeterminate) {
        return { ...state, selectRows: [] };
      }
      if (selectAll.checked) {
        const res = datasets.map((_, index) => index);
        return { ...state, selectRows: res };
      }
    }
    return null;
  }

  // 根据设计稿，将table的每三行合并作一个数据展示的项（实际上是四行，因为还有一行作为留白的占位）
  render() {
    const { datasets, extend } = this.props;
    const { bodyRenderConf } = this.state;
    const totalColSpan = bodyRenderConf.length;
    return (
      <tbody>
        {datasets.map((data: any, index: number) => {
          const HeadBox: ReactNode = this.renderHeadBox(data, index, totalColSpan);
          // 渲染表格主体
          const ContentBox: ReactNode = this.renderContentBox(data, index, bodyRenderConf);
          const extentContent = extend && extend(data, index);
          // 防止出现两条重合的边框
          const ExtendBox: ReactNode = extentContent ? (
            <tr className="ebiz-order-table__body-extend" key={`extend${index}`}>
              <td colSpan={totalColSpan}>{extentContent}</td>
            </tr>
          ) : null;
          return [
            HeadBox,
            ContentBox,
            ExtendBox,
            <tr key={`blank${index}`} className="ebiz-order-table__blank-end">
              <td colSpan={totalColSpan} />
            </tr>,
          ];
        })}
      </tbody>
    );
  }
}
