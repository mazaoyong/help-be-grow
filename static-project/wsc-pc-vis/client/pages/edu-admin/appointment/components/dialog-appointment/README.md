---
- title: 发起预约弹框
- owner:
  - 达达
- description: 发起预约弹框
- cover: https://b.yzcdn.cn/public_files/dfabb8a4564821b46f6fd08f135bc0f5.png
- tag:
  - 预约
  - 发起预约
  - dialog
  - 弹窗
---

# 发起预约弹框

## 使用场景

### 对学员新建试听      

**入参**
type: create-try
studentId: string
kdtId

### 确认预约

**入参**
type: confirm-try（在办理试听场景） / confirm-appointment（在预约管理场景
studentId: string
studentLessonNo: string
studentLessonStatus: number
kdtId

### 修改预约

**入参**
type: edit-try
studentLessonNo: string
studentLessonStatus: number
kdtId

type: edit-appointment
studentLessonNo: string
studentLessonStatus: number
kdtId

## demo
```jsx
```
## api
| 属性名  | 描述                 | 类型                                                  | 是否必填 | 默认值               |
| ------ | ------------------- | ---------------------------------------------------- | ------- | ------------------- |
|        |                     |                                                      |         |                     |
