---
- title: Date Range 日期（段）选择器
- owner:
    - 胡学望
- description: Date Range 日期（段）选择器
- cover: https://b.yzcdn.cn/public_files/f88b402510883028fe4cbce70c519f1c.png
- tag:
    - Date Range
    - 日期选择
---

# Date Range 日期（段）选择器

### 适用场景
选择从某年某月某日 - 某年某月某日的时间段

### 使用示例
* 推荐有奖-新建-生效日期(client/pages/pct/referral/EditPage.jsx)
* 公众号海报-新建海报-生效日期(client/pages/pct/poster/EditPage.jsx)

### 使用截图
![](https://b.yzcdn.cn/public_files/f88b402510883028fe4cbce70c519f1c.png)

### 使用说明
#### API
name | 说明 | 默认值
-|-|-
disabled | 时间1和时间2是否禁止选择 | -
disabledMsg | 禁止原因的气泡提示 | -
value | 值 | -
formatTime | 时间格式 | YYYY-MM-DD HH:mm:ss
showTime | 除日期外，是否显示时间 | true
placeholder | 占位符 | ['开始日期', '结束日期']

### 注意事项
