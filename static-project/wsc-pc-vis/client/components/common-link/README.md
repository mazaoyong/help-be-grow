---
- title: 标准的Link组件
- owner: 逐浪
- description: 将一个连接转为React组件
- cover: https://b.yzcdn.cn/upload_files/2020/07/09/readme/bCtCRV.png
- tag:
    - a标签
    - 通用
    - 跳转
    - Link组件
---

## 使用场景

当你需要将一个 URL 链接转成一个 React 组件的时候，推荐使用这个进行包裹，会将 url 作为参数传入 a 标签，同时会带上一些默认行为；

## 默认行为

- 使用 a 标签进行包裹
- 默认打开新的页面
- 默认带有 cursor-link 的 className

## API

| 属性名      | 描述                         | 类型                      | 是否必填 | 默认值  |
| ----------- | ---------------------------- | ------------------------- | -------- | ------- |
| className   | 额外的样式类名               | string                    | false    | -       |
| style       | 内联样式                     | CSSProperties             | false    | -       |
| target      | 跳转方式                     | HTMLLinkElement['target'] | false    | \_blank |
| url\|href   | 链接地址                     | string                    | false    | -       |
| displayType | 将按钮表现为“链接”还是“按钮” | `link                     | button`  | false   | 'link' |
| justButton | 是否仅仅只作为点击按钮 | boolean  | false   | false' |

## ChangeLog

- 20200824
  - 添加 className 支持
  - link 改为 zent/Link 实现
  - url 变为可选值
- 20201024 设置文案字体强制继承
- 20201027 添加 href 为 url 的备选字段
- 20201204 CommonLink可以不跳转
