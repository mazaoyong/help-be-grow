---
order: 4
title: 基础用法
subtitle: Basic
---

### 用到的 API

| 属性名          | 描述                                            | 类型                                                  | 是否必填 | 默认值   |
| --------------- | ----------------------------------------------- | ----------------------------------------------------- | -------- | -------- |
| tags            | 是否多选                                        | boolean                                               | -        | false    |
| multiple        | 是否多选                                        | boolean                                               | -        | false    |
| disabled        | 是否禁用                                        | boolean                                               | -        | false    |
| displayNum      | 多选模式下显示的 tag 最大数量，0 表示不折叠 tag | number                                                | -        | 0        |
| clearable       | 是否显示清除按钮                                | boolean                                               | -        | false    |
| filter          | 开启过滤，可以是个返回 boolean 值的过滤函数     | boolean\|(keyword:string, option: IOption) => boolean | -        | false    |
| onKeywordChange | 筛选关键字改变的回调函数                        | (keyword: string) => void                             | -        | -        |
| noData          | 没有数据的时候的提示                            | ReactNode                                             | -        | 暂无数据 |
| maxSize         | 多选模式下最多可以选择多少个选项                | number                                                | -        | -        |

### 关于 Option 配置

| 属性名   | 描述           | 类型      | 是否必填 | 默认值 |
| -------- | -------------- | --------- | -------- | ------ |
| text     | 展示的文本     | string    | -        | -      |
| value    | 选项的值       | any       | -        | -      |
| extra    | 额外展示的信息 | ReactNode | false    | -      |
| disabled | 是否禁用       | boolean   | false    | -      |
| isGroup  | 是否是分组     | boolean   | false    | -      |

**！！！注意！！！**

`extra`属性中的 ReactNode 会放在一个超出显示省略号的`div`中，所以，不建议 ReactNode 最外层包裹一
个`div`，而是用`children list`的方式使用来达到复用样式的目的。

而且，需要注意的是，`extra`字段仅仅在正式内容展示完成之后并且下拉框还有剩余空间的时候才能被展示，要
么`extra`的内容就会被隐藏。

```jsx
import { Select } from '@youzan/ebiz-components';
import { Icon } from 'zent';

const options = [
  { text: '选项1', value: 1 },
  { text: '选项2', value: 2 },
  { text: '选项3', value: 3, disabled: true },
  { text: '选项4', value: 4 },
];

const decorateOptions = [
  {
    text: '报名学员阿浪',
    value: 1,
    extra: [<strong key="label">手机：</strong>, <span key="phone">130xxxx8223</span>],
  },
  {
    text: '这是一个新疆同学，叫做尼格买提',
    value: 1,
    extra: [<strong key="label">手机：</strong>, <span key="phone">130xxxx8223</span>],
  },
];

const groupedOptions = [
  { text: '分组1', value: 'group1', isGroup: true },
  { text: '选项1', value: 1 },
  { text: '选项2', value: 2 },
  { text: '选项3', value: 3 },
  { text: '分组2', value: 'group2', isGroup: true },
  { text: '选项4', value: 4 },
];

const NoData = ({ keyword, handleClick }) => (
  <div onClick={handleClick} style={{ color: '#337ffb', flex: 1 }}>
    <Icon type="plus" style={{ marginRight: '8px' }} />
    <span>添加{keyword}</span>
  </div>
);

const BasicDemo = () => {
  const [dyOptions, setNewOptions] = React.useState(options);
  const [keyword, setKeyword] = React.useState('');
  const handleAddOption = React.useCallback(() => {
    const newOpt = {
      text: keyword,
      value: new Date().getTime(),
    };
    setNewOptions((prevOptions) => {
      const newOpts = [newOpt].concat(prevOptions);
      console.log(newOpts);
      return newOpts;
    });
  }, [keyword]);

  return (
    <div>
      <section>
        <h2>单选项并带有清除按钮</h2>
        <Select clearable options={options} />
        <h2>多选并设置最大可选数量</h2>
        <Select multiple clearable maxSize={2} options={options} />
        <h2>最多显示一个tag</h2>
        <Select multiple filter displayNum={1} options={options} />
        <h2>支持筛选选项</h2>
        <Select filter options={options} />
        <h2>选项带有辅助信息</h2>
        <Select options={decorateOptions} />
        <h2>将选项进行分组</h2>
        <Select options={groupedOptions} />
        <h2>带有添加按钮的Select</h2>
        <Select
          filter
          options={dyOptions}
          onKeywordChange={setKeyword}
          noData={<NoData keyword={keyword} handleClick={handleAddOption} />}
        />
        <h2>禁用Select</h2>
        <Select options={options} value={[1, 2]} disabled />
        <br/>
        <Select multiple displayNum={1} options={options} defaultValue={[1, 2]} disabled />
      </section>
    </div>
  );
};

ReactDOM.render(<BasicDemo />, mountNode);
```
