import React, { Component } from 'react';
import classnames from 'classnames';
import ListModal from './ListModal';
import multiEllipsis from './multi-ellipsis';
import { IFilterOption } from './type';

interface IProps {
  url: string;
  filterOption: IFilterOption;
  columns: any[];
  onClose: (...args) => void;
  onConfirm: (...args) => void;
  visible: boolean;
  multiple: boolean;
  dataType: string;
  shouldSelect: (...args) => boolean;
  joinReason: any[];
  needCheckbox: boolean;
}
/**
 * GoodsSelectModal 是基于ListModal封装的简易版商品选择，里面默认了一些props
 */
export default class GoodsSelectModal extends Component<IProps> {
  static defaultProps = {
    columns: [],
  };

  render() {
    const {
      url,
      filterOption,
      columns,
      onClose,
      onConfirm,
      visible,
      multiple,
      dataType,
      shouldSelect,
      joinReason,
    } = this.props;

    return (
      <ListModal
        tabs={[
          {
            text: '商品选择',
            url,
            dataType: dataType || 0,
            columns: [
              {
                title: '商品',
                bodyRender: (data, pos) => (
                  <div
                    className={classnames('modal__goods-info', {
                      modal__disabled: !shouldSelect(data, pos.row),
                    })}
                  >
                    <a href={data.url || data.kdt_url} target="_blank" rel="noopener noreferrer">
                      <img alt="" src={data.image_url || data.cover_attachment_url} />
                    </a>
                    <div>
                      <a href={data.url || data.kdt_url} target="_blank" rel="noopener noreferrer">
                        {multiEllipsis(data.title)}
                      </a>
                      <span className="modal__goods-price">￥{(data.price / 100).toFixed(2)}</span>
                    </div>
                  </div>
                ),
              },
              {
                title: '创建时间',
                bodyRender: (data, pos) => (
                  <div
                    className={classnames({
                      modal__disabled: !shouldSelect(data, pos.row),
                    })}
                  >
                    {data.created_time}
                  </div>
                ),
              },
              {
                title: '不可选原因',
                width: '30%',
                bodyRender: (data, pos) => {
                  return (
                    <div
                      className={classnames({
                        modal__disabled: !shouldSelect(data, pos.row),
                      })}
                    >
                      {shouldSelect(data, pos.row) ? '' : joinReason[+data.join]}
                    </div>
                  );
                },
              },
            ].concat(
              columns.map(col => {
                return {
                  title: col.title,
                  width: col.width,
                  bodyRender: col.bodyRender
                    ? col.bodyRender
                    : (data, pos) => (
                        <div
                          className={classnames({
                            modal__disabled: !shouldSelect(data, pos.row),
                          })}
                        >
                          {data[col.key]}
                        </div>
                      ),
                };
              }),
            ),
          },
        ]}
        shouldSelect={shouldSelect}
        multiple={multiple}
        onClose={onClose}
        visible={visible}
        filterOption={filterOption}
        emptyLabel="暂无商品，你可以新建商品"
        onConfirm={onConfirm}
      />
    );
  }
}
