---
order: 2
title: 为异步操作添加按钮
subtitle: Async mode
---

## 适用场景

在特定业务场景中，可能需要用户在另一个打开的页面配置选项信息，然后再回到当前页面获取新的选项列表，就
需要有两个按钮，分别为“新建”和“刷新”。

## 使用要点

这两个按钮，因为功能明确，所以不提供文案修改的属性。

## 用到的 API

| 属性名      | 描述                           | 类型       | 是否必填 | 默认值 |
| ----------- | ------------------------------ | ---------- | -------- | ------ |
| showRefresh | 是否展示刷新按钮               | boolean    | -        | false  |
| showAdd     | 是否展示新增按钮               | boolean    | -        | false  |
| onRefresh   | 当点击刷新按钮的时候触发的函数 | () => void | -        | -      |
| onAdd       | 当点击新增按钮的时候触发的函数 | () => void | -        | -      |

```jsx
import { Select } from '@youzan/ebiz-components';

let storeOptions = [];
const mockOptions = (keyword, pageRequest) => {
  console.log('invoke fetch');
  return new Promise((resolve) => {
    setTimeout(() => {
      if (keyword && storeOptions.length) {
        const matcher = new RegExp(keyword, 'g');
        const matchedOptions = storeOptions.filter((option) => matcher.test(option.text));
        resolve({
          options: matchedOptions,
          pageInfo: {
            current: pageRequest.current,
            total: matchedOptions.length,
          },
        });
      }
      const options = genOptions(20, pageRequest.current);
      storeOptions = options;
      resolve({
        options,
        pageInfo: {
          current: pageRequest.current,
          total: 200,
        },
      });
    }, 200);
  });
};

const AsyncDemo = () => {
  return (
    <section>
      <Select mode="async" showAdd showRefresh fetchOptions={mockOptions} />
    </section>
  );
};

function genOptions(size, pageNumber) {
  const curPage = pageNumber;
  const options = new Array(size).fill(0).map((item, index) => ({
    text: `第${curPage} 选项${index}`,
    value: curPage * size + index,
  }));
  options.unshift({
    text: `第${curPage}页`,
    value: 'page' + curPage,
    isGroup: true,
  });

  return options;
}

ReactDOM.render(<AsyncDemo />, mountNode);
```
