import React from 'react';
import { Sweetalert, Dialog, Notify } from 'zent';
import { Button as SamButton } from '@youzan/sam-components';
// 引入批量操作的服务
import * as batchServices from '../../../../api/course-manage';

const { openDialog, closeDialog } = Dialog;

const successHint = {
  editGroup: '',
  stopSale: '批量下架成功',
  inSale: '批量上架成功',
  removeItem: '批量删除成功',
  vipDiscount: '批量设置VIP折扣成功',
};
const successTipMap = {
  inSale: (effectedNum, lockNum) => {
    return `${effectedNum}个商品上架成功，${lockNum}个商品正在参加营销活动修改失败`;
  },
  stopSale: (effectedNum, lockNum) => {
    return `${effectedNum}个商品下架成功，${lockNum}个商品正在参加营销活动修改失败`;
  },
  removeItem: (effectedNum, lockNum) => {
    return `${effectedNum}个商品删除成功，${lockNum}个商品正在参加营销活动修改失败`;
  },
};

function successTipFactory(type) {
  return function createMsg({ effectedNum = 0, lockNum = 0 }) {
    const fn = successTipMap[type];
    if (!fn) return '';
    return fn(effectedNum, lockNum);
  };
}

export default function handleBatchActions(aliasList, extra) {
  /**
   * ##################################################
   *  #               表格数据批处理                     #
   *  ##################################################
   */
  // 批量删除数据
  const handleRemoveItem = () => {
    closeDialog('remove_item');
    this.refreshList().loading();
    batchServices
      .setBatchDelete({ aliasList })
      .then(data => {
        this.refreshList().refresh();
        if (!data) return;
        if (!extra) {
          Notify.success(successHint.removeItem);
          return;
        }
        const tip = successTipFactory('removeItem')(extra);
        Notify.success(tip);
      })
      .finally(_ => this.refreshList().cancelLoading())
      .catch(err => Notify.error(err));
  };

  // 批量设置折扣
  const handleSetDiscount = joinDiscount => {
    this.refreshList().loading();
    batchServices
      .setBatchSetDiscount({ joinDiscount, aliasList })
      .then(data => {
        this.refreshList().refresh(true);
        if (data) {
          Notify.success(successHint.vipDiscount);
        }
      })
      .finally(_ => this.refreshList().cancelLoading())
      .catch(err => Notify.error(err));
  };

  // 批量上架销售/下架
  const toggleSale = (sale, type) => {
    this.refreshList().loading();
    batchServices
      .setBatchSetSellStatus({ aliasList, sell: sale })
      .then(data => {
        this.refreshList().refresh(true);
        if (!data) return;
        if (!extra) {
          Notify.success(successHint[type]);
          return;
        }
        const tip = successTipFactory(type)(extra);
        Notify.success(tip);
      })
      .finally(_ => this.refreshList().cancelLoading())
      .catch(err => Notify.error(err));
  };
  return {
    editGroup: () => {},
    stopSale: () => {
      Sweetalert.confirm({
        title: '停止销售线下课',
        content:
          '停止销售线下课后，已购买的学员仍旧可以继续上课。未购买的用户将无法购买，确定停止销售线下课吗？',
        onConfirm: toggleSale.bind(this, false, 'stopSale'),
        closeBtn: true,
        parentComponent: this.stopSale,
        className: 'dialog-box',
      });
    },
    inSale: () => toggleSale(true, 'inSale'),
    removeItem: () => {
      // 删除商品的Dialog
      openDialog({
        dialogId: 'remove_item',
        title: '删除线下课',
        parentComponent: this.removeBtn,
        maskClosable: false,
        children: <p>删除后无法恢复，确定删除吗？</p>,
        footer: (
          <p className="dialog-box">
            <SamButton name='编辑' onClick={handleRemoveItem.bind(this, aliasList)}>永久删除</SamButton>
            <SamButton type="primary" onClick={() => closeDialog('remove_item')}>
              我再想想
            </SamButton>
          </p>
        ),
      });
    },
    vipDiscount: joinDiscount => handleSetDiscount(joinDiscount),
  };
}
