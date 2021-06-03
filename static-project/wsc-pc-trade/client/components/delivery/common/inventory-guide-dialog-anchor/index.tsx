import * as React from 'react';
import { Dialog } from 'zent';
import { isSingleStore, isHqStore } from '@youzan/utils-shop';
import { BlankLink } from '@youzan/react-components';
import './style.scss';

const { useState } = React;
const { cdnStatic } = _global.url;

const WarehousePlanUrl = `${_global.url.store}/v2/warehouse/plan`;
const WarehouseIntegrateUrl = `${_global.url.store}/v2/warehouse/integrate`;
const WarehouseIntegrateHelpUrl = `${_global.url.help}/displaylist/detail_5_5-2-52768`;

const hasWarehouseIntegrate = isSingleStore || isHqStore; // 仅单店和连锁总部

export default function InventoryGuideDialogAnchor() {
  const [visible, setVisible] = useState(false);

  function showDialog() {
    setVisible(true);
  }

  function closeDialog() {
    setVisible(false);
  }

  return (
    <>
      <a onClick={showDialog}>查看使用教程</a>

      <Dialog
        className="inventory-guide-dialog"
        title="使用教程"
        visible={visible}
        onClose={closeDialog}
      >
        <p>
          使用流程如下，可
          <BlankLink href={WarehouseIntegrateHelpUrl}>查看详细教程</BlankLink>。
        </p>

        <div className="guide-block">
          <div className="guide-block-title">
            <div className="guide-block-title-no">1</div>
            设置预约下单时间规则
          </div>
          <div className="guide-block-content">
            <p>操作路径：订单 - 配送管理 - 同城配送/上门自提</p>
            <img src={`${cdnStatic}/public_files/2020/12/30/delivery/guide_step1.png`} alt="" />
          </div>
        </div>

        <div className="guide-block">
          <div className="guide-block-title">
            <div className="guide-block-title-no">2</div>
            新建商品计划库存
          </div>
          <div className="guide-block-content">
            <p>
              操作路径：
              <BlankLink href={WarehousePlanUrl}>库存 - 计划库存</BlankLink>
            </p>
            <img src={`${cdnStatic}/public_files/2020/12/30/delivery/guide_step2.png`} alt="" />
          </div>
        </div>

        <div className="guide-block">
          <div className="guide-block-title">
            <div className="guide-block-title-no">3</div>
            设置渠道库存的共享策略
          </div>
          <div className="guide-block-content">
            <p>
              操作路径：
              {hasWarehouseIntegrate ? (
                <BlankLink href={WarehouseIntegrateUrl}>库存 - 库存共享</BlankLink>
              ) : (
                '库存 - 库存共享'
              )}
            </p>
            <img src={`${cdnStatic}/public_files/2020/12/30/delivery/guide_step3.png`} alt="" />
          </div>
        </div>
      </Dialog>
    </>
  );
}
