import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Dialog } from 'zent';
import SkuSortableTable from '../../sku-sortable';
import { ignoreEmptySku } from '../../sku/utils';
import PopWrapper from '../../pop-wrapper';

const { openDialog } = Dialog;
const dialogId = 'sku_sortable_dialog';

class SKUButton extends Component {
  onSorted = value => {
    value.length > 0 && this.props.onSorted(value);
  };

  openSortTable = () => {
    const pureStore = ignoreEmptySku(this.props.skuStore, { optionValue: 'dictId' });

    openDialog({
      dialogId,
      title: '拖动规格值进行排序',
      children: <SkuSortableTable dialogId={dialogId} value={pureStore} onChange={this.onSorted} />,
      maskClosable: false,
    });
  };

  render() {
    const prefix = `${this.context.prefix}-group`;
    let { disabled, skuStore } = this.props;
    const { maxSize } = this.context;
    const showAddBtn = !disabled;
    if (typeof disabled !== 'string' && skuStore.length >= maxSize) {
      disabled = `${maxSize === 1 ? '酒店商品' : ''}最多支持 ${maxSize} 组规格`;
    }

    return (
      <div className={prefix}>
        <h3 className="group-title">
          <PopWrapper
            trigger="hover"
            position="top-left"
            content={typeof disabled === 'string' ? disabled : null}
          >
            <Button onClick={this.props.onClick} disabled={!!disabled}>
              添加规格项目
            </Button>
          </PopWrapper>
          {showAddBtn && skuStore.length > 0 && (
            <a href="javascript:;" style={{ marginLeft: 15 }} onClick={this.openSortTable}>
              自定义排序
            </a>
          )}
        </h3>
      </div>
    );
  }
}

SKUButton.contextTypes = {
  prefix: PropTypes.string,
  maxSize: PropTypes.number,
};

export default SKUButton;
