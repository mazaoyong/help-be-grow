##  知识付费项目公共组件

这个目录下是知识付费项目中用到的公共组件，在每个目录下都有对应的文档。

### 索引

#### 表单域

- [InfoCollectField 信息采集自定义表单域](./field/info-collect)

- [VipBenefitField 归属会员权益自定义表单域](./field/vip-benefit)
  
    - [chooseBenefit 选择归属会员权益](./benefit-choose)

- [VipCardField 参加会员折扣自定义表单域](./field/vip-card-field)

- [LiveCodeSelectField 活码选择自定义表单域](./live-code-select-field)

- [InvietFriendForm 请好友看表单](./invite-friend)

#### 加粉推广

- [joinGroupSetting 加粉推广表单模块](./join-group-setting)
  
    - [QRCodeSetting 推广码设置模块](./qr-code-setting)

    - [QRCodeSettingText 加粉推广其他设置模块](./qr-code-setting-text)

#### 直播课程

- [ LiveItem 直播课程展示](./live/item)

- [ LiveItemMenu 直播课程操作菜单](./live/item-menu)

- [ showTeacherQrcode 讲师设置](./live/teacher-dialog)

#### 通用

- [openDeleteDialog 知识付费课程删除确认](./pct-delete-dialog)

- [ QuickUpdateInfo 快速编辑/行内编辑](./quickupdate-info)


### 目录结构

```
/client/pages/pct/common/components
├── add-card-list              # 商品添加卡片布局
│   ├── index.tsx    
├── benefit-choose             # 选择归属会员权益
│   ├── index.jsx              
├── field
│   ├── info-collect           # 信息采集自定义表单域
│   │   ├── index.jsx
│   ├── vip-benefit            # 归属会员权益自定义表单域
│   │   ├── index.jsx
│   └── vip-card-field         # 选择会员折扣自定义表单域
│       ├── index.jsx
├── invite-friend              # 请好友看表单
│   ├── Field.jsx              # 请好友看自定义表单域
│   ├── index.jsx
├── join-group-setting         # 加粉推广表单模块
│   ├── index.jsx
├── live                       # 直播课程相关组件目录
│   ├── item                   # 直播课程展示
│   │   ├── index.jsx
│   ├── item-menu              # 直播课程操作菜单
│   │   ├── index.jsx
│   └── teacher-dialog         # 讲师设置
│       ├── index.js
├── live-code-select-field     # 活码选择自定义表单域
│   └── index.jsx
├── pct-delete-dialog          # 知识付费课程删除确认
│   ├── index.tsx
├── qr-code-setting            # 推广码设置模块
│   ├── index.jsx
├── qr-code-setting-text       # 加粉推广其他设置模块
│   ├── index.jsx
└── quickupdate-info           # 快速编辑/行内编辑
    └── index.js
```

### 注意事项

1. 组件文档中的代码演示部分只粘贴了关键部分，但都给出了文件路径
2. 部分组件依赖于 zent 、ReactComponents 或本项目中的其他组件，这些在文档中都有说明也都给出了链接，请先熟悉依赖的组件

## Changelog
- 2020-02-06
  - 修改了filed中的info-collect组件的样式 [信息采集支持自定义资料项-视觉验收①](https://doc.qima-inc.com/pages/viewpage.action?pageId=264410785)
- 2020-02-29
  - 增加了商品创建卡片布局组件
  - live目录增加视频直播dialog
- 2020-03-19
  - 有赞直播的普通直播-前往直播，增加推流地址展示