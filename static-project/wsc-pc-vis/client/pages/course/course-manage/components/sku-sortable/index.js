import React, { Component } from 'react';
import { Button, Dialog, Sortable } from 'zent';
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import './style.scss';

const { closeDialog } = Dialog;

class SkuSortableTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      list: props.value,
    };
  }

  onConfirm = () => {
    this.props.onChange(this.state.list);
    closeDialog(this.props.dialogId);
  };

  onCancel = () => {
    closeDialog(this.props.dialogId);
  };

  onItemStart = e => {
    try {
      e.item.classList.add('is-draged');
    } catch (ex) {
      //
    }
  };

  onItemEnd = (e, id) => {
    try {
      e.item.classList.remove('is-draged');
    } catch (ex) {
      //
    }

    const { oldIndex, newIndex } = e;
    if (oldIndex === newIndex) return;

    let { list } = this.state;
    let items = find(list, { dictId: id });
    items = this.swapItems(items.leaf, oldIndex, newIndex);

    list = cloneDeep(list);
    find(list, { dictId: id }).leaf = items;

    this.setState({
      list,
    });
  };

  swapItems(items, oldIndex, newIndex) {
    items = cloneDeep(items);
    let swapItem = items[oldIndex];
    items.splice(oldIndex, 1);
    items.splice(newIndex, 0, swapItem);
    return items;
  }

  render() {
    let { list } = this.state;

    return (
      <div className="sku-sortable-dialog">
        <div className="sku-sortable-wrap">
          {list.length < 1 && <div className="text-center">无可拖拽的商品规格~</div>}
          {list.map(item => {
            return (
              <div className="sku-sortable-group" key={item.dictId}>
                <div className="sku-sortable-group__title">{`${item.text}：`}</div>
                <div className="sku-sortable-group__content">
                  <div className="sku-sortable-items">
                    <Sortable
                      onStart={this.onItemStart}
                      onEnd={e => this.onItemEnd(e, item.dictId)}
                    >
                      {item.leaf &&
                        item.leaf.map(atom => {
                          return (
                            <span className="item" key={atom.dictId}>
                              <i>{atom.text}</i>
                            </span>
                          );
                        })}
                    </Sortable>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="zent-dialog-r-footer">
          <Button type="primary" onClick={this.onConfirm}>
            确定
          </Button>
          <Button onClick={this.onCancel}>取消</Button>
        </div>
      </div>
    );
  }
}

export default SkuSortableTable;
