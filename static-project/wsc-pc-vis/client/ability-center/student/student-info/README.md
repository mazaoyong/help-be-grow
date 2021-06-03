---
- title: 学员信息
- owner: 逐浪
- description: 包含获取学员信息接口和学员卡片组件
- ref: client/pages/student/student-detail
- cover: https://img.yzcdn.cn/upload_files/2020/07/09/Fjs5qEklmIHx7fRcU06InIeg7u53.png
- tag:
  - 获取学员信息
  - 获取学员联系人信息
  - 学员卡片组件
  - 分割线组件
---

# 学员信息

## 获取学员信息

```javascript
import { getStudentInfoById } from '@ability-center/student';

getStudentInfoById({ identityNo: 123 }).then(handleResponse);
```

```typescript
interface IStudentInfoQuery {
  identityNo: number;
  clueId?: number; // 线索id，可选
}
```

## 获取学员联系人信息
```javascript
import { getContractListByStudentId } from '@ability-center/student';

getContractListByStudentId({ studentId: 123 }).then(handleResponse);
```

```typescript
interface IContractListQuery {
  studentId: string | number;
}
```

## StudentCard 学员信息卡片