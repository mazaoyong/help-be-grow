---
- title: 编辑学员资料项
- owner: 逐浪
- description: 用于获取编辑学员资料项的表单，资料项配置在设置->招生设置->学员资料项
- cover: https://b.yzcdn.cn/cdn/modify-student.png
- tag:
    - 编辑学员
    - 线索详情
    - 学员详情
---

# Modify Student 编辑学员资料项

### 适用场景

1. 更新学员信息
2. 更新线索信息

### 使用截图

![编辑学员](https://b.yzcdn.cn/cdn/modify-student.png)

### 使用说明

#### API

| 属性名          | 描述                                                                             | 类型                                                 | 是否必填 | 默认值 |
| --------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------- | -------- | ------ |
| applicableScene | 适用场景值                                                                       | ApplicableSceneEnums(0: 所有场景，1：学员，2：线索） | 是       | -      |
| studentNo       | 学员编号，用于通过接口查询学员信息，用于回填表单，如果没有传递，表示一个空的表单 | number                                               | 否       | -      |
| refreshSignal   | 刷新资料项的信号量，变化了组件就会重新获取资料项                                 | number                                               | 否       | -      |
| submitSignal    | 提交信号量，用于触发表单的提交操作，主要用于在 Dialog 中由外部按钮触发提交       | number                                               | 否       | -      |
| onSubmit        | 当数据通过校验的时候回触发的校验                                                 | (values: Record<string, any>) => void                | 否       | -      |

### 注意事项

## ChangeLog

- 2020-02-03
  - 修改地址组件的省市区数据从 cdn 改为接口
- 2020-02-05
  - 移除地址类型 useMemo 钩子
- 2020-03-23
  - 使用 EasyForm 替代原有的 zent/Form
- 2020-04-08
  - 修复编辑学员场景值为ALL的时候必填丢失的问题
  - 修复 getRequired 方法
