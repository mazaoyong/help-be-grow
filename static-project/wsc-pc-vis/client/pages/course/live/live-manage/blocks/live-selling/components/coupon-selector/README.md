---
- title: 优惠券选择组件
- owner: 逐浪
- description: 优惠券选择组件，包括一个选择器和一个Grid
- cover: https://b.yzcdn.cn/public_files/7d7140e328d069d5524f32e89bf474ba.png
- tag:
    - Coupon
    - 优惠券
    - 上下移动优惠券
    - 删除添加优惠券
---

## 使用场景

需要使用优惠券选择器的场景

## 注意

这个组件不是个 Field，因为优惠券选择器的形式，所以如果需要将它作为一个 Field 使用，请在外层套一个壳处理 Form 的 props.onChange 事件

## 默认行为

- 默认操作部分只有删除按钮
- 优惠券名称会跳转到相对应的优惠券详情页

## API

| 属性名          | 描述                                           | 类型                                                              | 是否必填 | 默认值                                           |
| --------------- | ---------------------------------------------- | ----------------------------------------------------------------- | -------- | ------------------------------------------------ |
| label           | 标签名                                         | string                                                            | true     | -                                                |
| onChange        | 添加优惠券回调                                 | `(couponData: ICoupon[]) => void`                                 | true     | -                                                |
| couponList      | 已选择优惠券列表，数据应该符合优惠券的格式     | `ICoupon[]`                                                       | true     | -                                                |
| required        | 必填的样式                                     | boolean                                                           | false    | -                                                |
| loading         | 列表加载状态                                   | boolean                                                           | false    | false                                            |
| helpDesc        | 提示信息                                       | ReactNode                                                         | false    | -                                                |
| width           | 列表的宽度                                     | string                                                            | false    | 520px                                            |
| triggerText     | 添加优惠券按钮的触发文案                       | string                                                            | false    | 添加优惠券                                       |
| attachColumns   | 已选择优惠券列表除了优惠券名称和操作之外的内容 | IGridColumn[]                                                     | false    | `[{ title: '优惠内容', name: 'couponContent' }]` |
| renderOperators | 渲染操作部分，可以用这个属性覆盖默认行为       | `(couponData: ICoupon, gridPos: IGridCellPos) => React.ReactNode` | false    | -                                                |
| onDelete        | 删除优惠券回调                                 | `(couponData: ICoupon) => void`                                   | false    | -                                                |

## ChangeLog

- 20200825 添加
- 20200826
  - 添加width属性
  - 修改onAdd为onChange事件
- 20200901 替换优惠券列表接口
- 20200911 添加优惠券失效文案
