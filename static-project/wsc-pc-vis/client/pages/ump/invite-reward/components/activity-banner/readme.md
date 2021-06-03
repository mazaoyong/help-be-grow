# 转介绍活动信息banner
— 活动状态标签中的文字是根据className在::after中写的

```tsx
<ActivityBanner activity={activityData} />
```

```ts
export interface ActivityBannerData {
  name: string;
  startAt: number;
  endAt: number;
  status: number;
}

interface ActivityBannerProps {
  activity: ActivityBannerData;
}
```
