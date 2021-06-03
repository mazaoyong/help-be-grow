---
- title: 学员模块
- owner: 逐浪
- description: 学员能力包含学员列表、学员详情和学员导入三个页面
- tag:
  - 学员列表
  - 学员详情
  - 学员导入
---

## 页面

[学员导入](./student-import/containers/list/index.jsx)
[学员列表](./student-list/index.tsx)
[学员详情](./student-detail/index.tsx)

## 模块职责

在B端开发过程中，如果遇到如下需求，请询问`chenzihao@youzan.com`

- 获取学员列表
- 通过No(Id)获取学员信息
- 添加/编辑学员信息
- 删除学员
- 展示学员信息

## 组件概览

### StudentInfo 学员信息

- StudentDataProvider 学员资料的数据层
- StudentCard 学员信息卡片（通过Provider提供的数据进行渲染）

通过学员标识获取学员信息，并通过这个信息渲染学员信息卡片

## StudentEdit 学员编辑

- StudentProfile 学员资料项表单

通过外部传入的initialValues对StudentProfile进行初始化；
该组件内置获取资料项配置和apollo配置的能力；
同时组件内部提供学员资料项的相关判断逻辑；
最终通过提交的学员资料项数据通过`onSubmit`回调进行后续的数据提交。
