# ImgWrap 图片容器组件

### 适用场景
图片压缩展示

### 使用示例
* 线索管理-我的线索-线索详情-学员动态记录(client/pages/edu/cluepool/containers/detail/components/clue-records-item/index.jsx)
* 家校圈-动态管理(client/pages/ump/moments/pages/management/index.tsx)

### 使用截图
![](https://b.yzcdn.cn/public_files/0a15c81e0eeb9746d885b81a8f4d0478.png)

### 使用说明
```tsx
import { ImgWrap } from 'components/img';

<ImgWrap width="80px" height="45px" src={item.cover} fullfill="!100x100.jpg" />;
```

### 注意事项

- 图片压缩 `fullfill` 默认开启，值为 `!100x100.jpg`;
- 图片压缩可通过 `disableFullfill` 关闭;
