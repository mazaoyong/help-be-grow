### 组件功能
展示下单页活动优惠信息
当活动优惠超过一个时，会展示汇总数据

### 参数说明
discountDetail是个数组传入
####demo，以下为必选项
discountDetail: [
  {
    name: String,
    title: String,
    value: Number(单位是分)
  }
]

### 已使用场景
1.粉丝优惠

### changelog
2020-02-14 针对粉丝优惠信息抽离弹窗