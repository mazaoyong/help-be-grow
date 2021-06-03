---
- title: ImportList 通用导入列表页
- owner:
  - 赵梓皓
- description: ImportList 通用导入列表页
- cover: https://b.yzcdn.cn/public_files/1e4ef047da8e759ec0936e3e7cf43422.png
- tag:
  - ImportList
  - 导入
---

# ImportList 通用导入列表页

### 适用场景
用于导入列表页

### 使用示例
* 示例页面 (client/pages/student/student-import/pages/list/index.jsx)

### 使用截图
![](https://b.yzcdn.cn/public_files/1e4ef047da8e759ec0936e3e7cf43422.png)

#### API
name | 说明 | 默认值
-|-|-
className | 类名 | '' |
needValidation | 是否需要数据校验 | true |
enablePolling | 是否需要轮询进度 | true |
validationRequest | 数据校验函数，needValidation=true时使用 | noop |
findTaskProgress | 轮询进度函数，enablePolling=true时使用 | noop |
handleReimport | 重新导入失败数据函数 | noop |
findImportTaskByPageRequest | 查询列表数据函数 | noop |
recordPageUrl | 记录页面，用于跳转到记录页（前缀），例'//www.youzan.com/v4/vis/edu/page/stuimport#/record' | '' |

### 其他
1. 现有9种不同导入状态，分别为：
```
  0: '待导入',
  1: '导入中',
  2: '导入完成',
  10: '导入录入中',
  20: '导入失败',
  30: '数据校验中',
  40: '待导入',
  50: '待导入',
  60: '导入完成'
```

2.
 - importState = 50时，代表数据校验全部通过，此时跳转的url为 add/${id}/step=2?type=${importType}${targetKdtId !== _global.kdtId ? `&kdtId=${targetKdtId}；
 - importState = 40时，代表部分数据校验通过，此时跳转的url为 add/${id}/step=2?error=1&type=${importType}${targetKdtId !== _global.kdtId ? `&kdtId=${targetKdtId}
url拼接含义：
```
  id: 行任务id，
  step: 导入的第二步，
  type: 导入类型，
  targetKdtId: 分校区kdtId
```

### ChangeLog
2020-5-27 增加此组件
