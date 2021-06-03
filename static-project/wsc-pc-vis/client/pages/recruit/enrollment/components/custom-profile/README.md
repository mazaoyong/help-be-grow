---
- title: Custom Profile 自定义资料项
- owner:
  - 胡学望
- description: Custom Profile 自定义资料项
- cover: https://b.yzcdn.cn/public_files/e0862a691c82c69362782cdc73fc5b73.png
- tag:
  - Custom Profile 
  - 自定义资料项
---

# Custom Profile 自定义资料项

### 适用场景
1. 使用getAge(birthday)获取学员年龄
2. 自定义学员资料项表单

### 使用示例
1. 获取学员年龄：
  * 线索池(client/pages/edu/cluepool/containers/detail/components/detail-panel/index.jsx)
  * 添加线索(client/pages/edu/cluepool/components/add-dialog/index.jsx)

2. 自定义学员资料项表单：
  * 办理报名(client/pages/edu/enrollment/containers/user-info/index.jsx)
  * 添加线索(client/pages/edu/cluepool/components/add-dialog/index.jsx)
  * 学员查询-学员详情-编辑(client/pages/edu/student/components/student-card/edit.jsx)

### 使用截图
![](https://b.yzcdn.cn/public_files/e0862a691c82c69362782cdc73fc5b73.png)

### 使用说明
#### API
name | 说明 | 默认值
-|-|-
initialValue | 读取店铺配置，初始化单个配置项的信息（比如下拉菜单的所有选项、输入框的校验失败返回值等） | []
fields | 表单信息，具体数据结构见index.tsx IProfileField | []
applicableScenes | 招生设置-学员资料项的适用场景，1代表学员报名，2代表线索管理 | 1
onSubmit | 点击提交的回调 | -
onChange | 更改表单数据的回调 | -

### 注意事项

## ChangeLog

- 2020-02-03
  - 修改地址组件的省市区数据从cdn改为接口
- 2020-02-05
  - 移除地址类型useMemo钩子
