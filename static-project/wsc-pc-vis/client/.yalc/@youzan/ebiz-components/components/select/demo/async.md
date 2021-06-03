---
order: 3
title: 异步的用法
subtitle: Async mode
---

## 适用场景

在特定业务场景中，选项信息需要从后端接口中拿到，并且选项的数量非常庞大，为了不影响页面其他区块的正常
渲染，就需要`Select`能够支持使用分页的方式从后端获取数据并且渲染出相应的数据。

## 使用要点

因为数据是异步获取，并且数据源可能是分页类型，所以如果有回填数据的需求，请务必配
置`defaultValue`和`defaultOptions`属性。

## fetchOptions 函数

该函数应该返回一个`Promise`，这么做符合我们一贯的用法（通过 ajax 请求获取数据），并且强烈建议使用
到`Select`异步模式的文件改用**TypeScript**书写以获取最完善的必填属性校验和返回参数的校验。为了数据能
够正确的渲染，这个方法应该返回如下格式的数据：

```typescript
type FetchOptionsRes = Promise<{
  options: IOption[];
  pageInfo: {
    // 当前的页码
    current?: number;
    pageSize?: number;
    // 必须要返回，组件需要根据这个来判断是否拉完了全部的option
    total: number;
  };
}>;
```

## 用到的 API

| 属性名         | 描述                                                  | 类型                                                                                                         | 是否必填 | 默认值 |
| -------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | -------- | ------ |
| fetchOptions   | 一个 Promise 方法，返回 IOption[]来改变组件的 options | (filterKeyword: string, pageRequest: IPageRequest) => Promise<{options: IOption[]; pageInfo: IPageRequest;}> | 是       | -      |
| fetchOnOpened  | 是否在 dropdown 开启的时候请求                        | boolean                                                                                                      | -        | false  |
| fetchOnMounted | 是否在组件加载完成之后请求                            | boolean                                                                                                      | -        | false  |

组件会利用`total`字段，判断当`Select`滚动到底部的时候是否还需要再进行数据请求。

```jsx
import { Select } from '@youzan/ebiz-components';

let storeOptions = [];
const mockOptions = (keyword, pageRequest) => {
  console.log('invoke fetch', keyword);
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
      <p>最简单的异步用法</p>
      <Select mode="async" filter fetchOptions={mockOptions} />
      <p>在页面一加载就触发请求</p>
      <Select mode="async" fetchOnMounted fetchOptions={mockOptions} />
      <p>异步多选的用法</p>
      <Select mode="async" multiple width="256px" displayNum={2} fetchOptions={mockOptions} />
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
