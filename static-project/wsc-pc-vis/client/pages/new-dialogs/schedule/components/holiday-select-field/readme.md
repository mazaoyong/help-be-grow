# HolidaySelectField

选择节假日表单组件
在新建/编辑排课窗口，选中跳过节假日选项后会出现

```typescript
interface HolidaySelectFieldProps {
  isCreate?: boolean; // 是否是新建排课，若为false，则不能编辑节假日
  queryKdtId?: number; // 总部排课只能选择总部和指定校区的节假日
  visible?: boolean; // 组件是否可见
  name: string; // 表单field名
  value: CustomHolidayData[]; // 已选中的节假日
}
```