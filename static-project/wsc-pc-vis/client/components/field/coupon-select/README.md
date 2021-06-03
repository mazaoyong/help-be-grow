---
- title: Coupon selector 优惠券选择器
- owner:
    - 逐浪
- description: Coupon selector 优惠券选择器
- cover: https://img.yzcdn.cn/upload_files/2020/12/01/FsrQsGdj8XvlfrCwiKQ9E6QZ2tly.png
- tag:
    - Coupon selector
    - 优惠券选择
---

# Coupon selector 优惠券选择Field

### 适用场景
营销活动中有优惠券选择的场景

### 使用示例
* 推荐有奖新建/编辑页(client/pages/ump/referral/edit/components/phased-reward-item/index.tsx)

### 使用截图
![](https://img.yzcdn.cn/upload_files/2020/12/01/FhHuWqH2PxzW8VUL-dzkKq2AogHZ.png)

![](https://img.yzcdn.cn/upload_files/2020/12/01/FsrQsGdj8XvlfrCwiKQ9E6QZ2tly.png)

### 使用说明
#### API
name |类型 | 说明 | 是否必填 | 默认值
-|-|-|-|-
disabled |`boolean` | 是否禁用 |  |  
helpDesc |`React.ReactNode` | 提示信息 |  |  
triggerText |`string` | 添加优惠券按钮的文案 |  | 添加优惠券 
attachColumns |`Array<IGridColumn>` | Grid 需要添加的列 |  | `[COUPON_CONTENT]` 
value |`Array<ICouponListItem>` | 选择的优惠券信息 | 是 |  
onChange |`(value: ICouponListItem[]): void` | 添加优惠券的回调 | 是 |  
activityTypeGroup |`number` | 活动类型分组 0: 全部分组；1：优惠券；2：优惠码 | 是 |  
refActivityScene |`string` | 活动场景值，是个固定值（新项目联系李翔宇添加） | 是 |  
showStepper |`boolean` | 是否展示最后数量选择那一列 |  | `true` 
maxTypeLimit |`number` | 最大种类限制 |  |  
maxNumLimit |`number` | 所有选择券的最大数量限制 |  |  
overlapColumns |`any[]` | 对优惠券的 columns 进行覆盖 |  |  
isSingleSelection |`boolean` | 是否单选 |  | `false` 
searchPlaceholder |`string` | 搜索框的 placeholder |  |  
renderOperators |`(couponData: ICouponListItem, gridPos: IGridCellPos): ReactNode` | 如果不指定这个属性只会渲染一个删除按钮 |  |  

### onChange 的 value 示例

```json
[{
    "activityDisplayTypeCopywriting": "满减券",
    "activityType": 7,
    "applicableGoodRangeDesc": "全部商品",
    "applicableShopRangeDesc": "仅本店可用",
    "externalPlatformType": 0,
    "founder": 0,
    "id": 33003277,
    "isSelectable": true,
    "preferentialCopywriting": "无门槛，减1",
    "remainStock": 977,
    "remark": "1111",
    "shopName": "yz测试店铺教育版",
    "takeUrl": "https://shop51247326.youzan.com/v2/ump/promocard/fetch?alias=l3zr698o",
    "title": "kl满减券-1",
    "unSelectReason": "",
    "userIdentityLimitCopywriting": "不限制",
    "userTakeLimitCopyWriting": "不限制",
    "validTimeCopywriting": "2020-11-09 19:39:45 - 2021-11-27 00:00:00",
    "voucherGenRuleDTO": {
        "maxValue": 0,
        "minValue": 0,
        "preferentialMode": 1,
        "value": 100,
        "voucherValueGenerateType": 1
    },
    "rangeTypeDesc": "全部商品",
    "preferentialDesc": "无门槛，减1",
    "humanLimitDesc": "不限制",
    "fetchNumLimitDesc": "不限制",
    "remainQty": 977,
    "isCanSelect": true,
    "amount": "5"
}]
```

### 注意事项

### Changelog
