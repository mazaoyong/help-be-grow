---
- title: 获取学员导入URL链接
- owner: 逐浪
- description: 通过调用函数的方式获取学员详情页的URL链接
- ref: client/pages/student/student-import/utils/get-student-import-url
- tag:
    - 学员导入
    - 跳转
    - 函数调用
    - Link组件
---

# 获取导入学员链接

当需要从某个页面跳转到学员导入页面的时候，需要使用这个函数进行跳转；
同时跳转也提供一个使用`a`标签包裹的组件让使用者调用进行跳转。

> 学员导入函数目前没有特殊参数

## 函数调用

```typescript
import { getStudentImportUrl } from '@ability-center/student';

const url = getStudentImportUrl();
```

## 组件调用

```tsx
import { StudentImportLink } from '@ability-center/student';
...
<StudentImportLink studentNo={1}>
  查看详情
</StudentImportLink>
```
