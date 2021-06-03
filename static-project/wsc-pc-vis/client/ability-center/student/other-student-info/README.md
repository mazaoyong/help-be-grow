---
- title: 其他学员信息
- owner: 逐浪
- description: 线索详情页其他学员信息
- cover: https://img.yzcdn.cn/upload_files/2020/07/09/FtZ3n8n3Fj2BlfY-UvmSd8LeHHkT.png
- tag:
  - 线索
  - 学员信息
  - 侧边栏
  - 能力
---

# 其他学员信息

包括回访时间、创建时间、校区名称、课程顾问等

## 参数

```ts
interface IOtherStudentInfoProps {
  phase: number; //阶段
  revisitTime?: number | string; //回访时间
  createdAt?: number | string; //创建时间
  ownerSchoolName?: string; //校区名称
  owners?: IOwner[]; //课程顾问
}
```
