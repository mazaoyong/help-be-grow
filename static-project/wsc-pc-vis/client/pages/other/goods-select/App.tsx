import React, { useCallback, useState } from 'react';
import { IChannelSelected } from '@youzan/react-components/typings/components/goods-selector-v2';

import { EduGoodsSelector } from '@youzan/ebiz-components';
import {
  NORMAL_TYPE,
  FEN_XIAO_TYPE,
  KNOWLEDGE_TYPE,
} from '@youzan/ebiz-components/es/edu-goods-selector';
const { GoodsSelector } = EduGoodsSelector;
const { gsConfig } = window._global as IGlobal & { gsConfig: any };

const App: React.FC = () => {
  const [selected, setSelected] = useState<IChannelSelected>({ type: 'part', value: [] });

  const onConfirm = useCallback((data: IChannelSelected) => {
    console.log(data);
    setSelected(data);
  }, []);

  return (
    <div className="page-goods-selector">
      <p> ------ 选择商品，营销活动模式 ------ </p>
      <GoodsSelector
        selected={selected}
        // btnText="可选全部或部分-不限制只能选择教育类商品-隐藏商品管理按钮-显示销量、库存列-遮罩点击可关闭"
        activityType={22}
        backEndConfig={gsConfig}
        showSalesColumn
        showStockColumn
        maskClosable
        isHideManageBtn
        onConfirm={onConfirm}
        dictConfig={{
          isOnlyShowEduGoods: false,
        }}
      />
      <GoodsSelector
        selected={selected}
        btnText="可选部分商品-只筛选线下课"
        activityType={22}
        backEndConfig={gsConfig}
        biz={['course']}
        selectTypes={['part']}
        onConfirm={onConfirm}
      />
      <GoodsSelector
        selected={selected}
        btnText="筛选专栏、直播-自定义过滤数据函数"
        activityType={22}
        biz={['column', 'live']}
        backEndConfig={gsConfig}
        onConfirm={onConfirm}
        mapGoodsValue={(item) => {
          if (item.goodsPrice >= 500) {
            item.optional = false;
            item.notOptionalReason.push('售价大于5元不可选');
          }
        }}
      />
      <p> ------ 选择商品，非营销活动模式 ------ </p>
      <GoodsSelector
        selected={selected}
        btnText="可选全部或部分-单选-选择商品包含SKU信息-显示商品类型筛选-显示已参与活动、不可选原因"
        onConfirm={onConfirm}
        isSingle
        needSkuInfo
        showJoinActivityColumn
        showNotOptionalColumn
        showTypeFilter
        dictConfig={{
          isOnlyShowEduGoods: false,
        }}
      />
      <GoodsSelector
        selected={selected}
        isSkuMode
        btnText="可选部分商品-筛选内容、直播-包含内容细分项-带sku-显示销量、库存-类型筛选实物、分销、课程"
        biz={['content', 'live']}
        selectTypes={['part']}
        onConfirm={onConfirm}
        showContentFilterSubType
        showSalesColumn
        showStockColumn
        showTypeFilter
        typeFilterOptions={[NORMAL_TYPE, FEN_XIAO_TYPE, KNOWLEDGE_TYPE]}
        dictConfig={{
          isOnlyShowEduGoods: false,
        }}
      />
      <GoodsSelector
        selected={selected}
        isSkuMode
        btnText="可选部分商品-筛选专栏、线下课-显示已售罄-带自定义过滤"
        selectTypes={['part']}
        biz={['column', 'course']}
        onConfirm={onConfirm}
        showNotOptionalColumn
        showSoldOut
        mapGoodsValue={(item) => {
          if (item.goodsPrice >= 5) {
            item.optional = false;
            item.notOptionalReason.push('售价大于5元不可选');
          }
        }}
      />
      <p>-</p>
      <p>已选择课程：</p>
      {selected.type === 'all' ? (
        <p>全部课程</p>
      ) : (
        <ul>
          {selected.value.map((item) => {
            return <li key={item.goodsId}>{item.goodsName}</li>;
          })}
        </ul>
      )}
    </div>
  );
};

export default App;
