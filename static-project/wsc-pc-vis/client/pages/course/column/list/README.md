# live 直播列表页面

## 代码结构
├── constant.ts
├── index.tsx
├── list.tsx
├── model.ts
├── README.md
└── style.scss

## 依赖
  - 课程商品卡片 ` client/pages/course/common/components/live/course-goods-item`
  - 由于直播列表的操作按钮及相关处理逻辑，会被专栏内容管理页面复用，故被提取到course共用组件下 ` client/pages/course/common/components/live/action-menu`

