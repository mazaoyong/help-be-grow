# 办理试听

## 注意事项

1. 因为过去使用的是在全局注册的 vuex store，这次改成独立的 store 之后并没有更新原先业务逻辑，所以部分 vuex 代码使用并不规范。

## 使用场景

### 对学员新建试听

**入参**
type: create-try
studentId: string

### 确认预约

**入参**
type: confirm-try
studentId: string
studentLessonNo: string
studentLessonStatus: number

### 修改预约

**入参**
type: edit-try
studentId: string
studentLessonNo: string
studentLessonStatus: number