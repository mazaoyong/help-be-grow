---
- title: Promotion 推广对话框组件
- owner:
  - 埃里克
- description: Promotion 推广对话框组件
- cover: https://b.yzcdn.cn/public_files/cd203d466d5c2c2e5ad40cd15f2aa65d.png
- tag:
  - Promotion
  - 推广
  - 对话框
---

# Promotion 推广对话框组件

### 适用场景
适用于推广（包含网页链接、微信小程序、百度小程序），点击子元素即可在页面弹出包含推广信息的对话框

### 使用示例
* 会员权益-推广(client/pages/pct/benefit/list/index.jsx)
* 课程管理-课程分组-推广(client/pages/course/group/list/Table.jsx)

### 使用截图
![](https://b.yzcdn.cn/public_files/cd203d466d5c2c2e5ad40cd15f2aa65d.png)

### 使用说明

defaultProps:
```
data: {
  url: '',
  qrcode: '',
  pagePath: '',
  name: 'qrcode',
  getQrcode: null,
  webviewPath: '',
  hideBdapp: true, // 注：defaultProps在此处并不生效，传入data对象时它的值是undefined，在解构data对象时需重新提供默认值为true
},
hideWeb: false,
hideWeapp: false,
```

#### API
name | 说明 | 默认值
-|-|-
data.url | 对应的微商城网页url | ''
data.pagePath | 对应的小程序页面路径 | ''
data.alias | 小程序alias | ''
data.name | 对应的会员权益/知识付费商品 名称 | qrcode
data.getQrcode | 获取二维码函数 | null
data.webviewPath | 百度小程序的webview path | ''
data.hideBdapp | 是否忽略百度小程序 | true
hideWeb | 是否忽略网页端 | false
hideWeapp | 是否忽略微信小程序 | false

### 注意事项
- props中qrcode不存在，则将异步获取，注意qrcode存在判断
