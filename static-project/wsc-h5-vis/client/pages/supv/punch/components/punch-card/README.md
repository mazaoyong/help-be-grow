# 打卡详情卡片

用于渲染一个打卡详情组件，包括用户头像，昵称，标签，内容、点赞和评论

## props数据

```javascript
{
  gciId: {
    type: Number,
    default: undefined,
    required: true,
  },
  avatar: {// 头像地址
    type: String,
    default: '',
  },
  nickName: {// 昵称
    type: String,
    default: '',
    required: true,
  },
  isHandPick: {// 是否是精选内容
    type: Boolean,
    default: false,
  },
  maxContentLine: {
    type: Number, // 内容显示行数上线
    default: 3,
  },
  content: {// 内容的纯文本部分
    type: String,
    default: '',
  },
  images: {// 图片部分
    type: Array,
    default: () => ([]),
  },
  audio: {
    type: Object,
    default: () => ({}),
  },
  createdAt: {// 创建时间
    type: [String, Number],
    default: '',
  },
  allowEdit: {// 是否允许编辑
    type: Boolean,
    default: false,
  },
  description: {// 底部描述，跟在内容后面展示
    type: String,
    default: '',
  },
  hasLike: {// 是否点赞
    type: Boolean,
    default: false,
  },
  likeList: {// 点赞列表
    type: Array,
    default: () => ([]),
  },
  commentList: {// 评论列表
    type: Array,
    default: () => ([]),
  },
  commentNumber: { // 统计的评论数量
    type: Number,
    default: 0,
  },
}
```

## 注意

1. 图片

图片为一串url数组，会根据图片数量按照一定规则展示

2. 最大显示行数

最大显示函数表示，内容区域最多能够显示多少行，为零表示内容全部显示不隐藏

3. 评论数量

在有评论的时候需要填写，这里会需要将评论数据进行展示，如果评论数目超过8条，只展示8条

4. 评论

评论格式要求如下

```typescript
interface ICommentStrut {
  publisher: string;
  publisherId: number;
  commentId: number;
  content: string;
  receiver?: string;
  receiverId?: number;
  type: 'student' | 'teacher';
}
```

## ChangeLog

- 2020-02-29
  - 修改“不到一分钟”为“刚刚”
  - 修改发布时间的颜色
- 2020-03-01 删除跳转打卡详情页的逻辑