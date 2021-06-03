---
- title: 版本差异化配置中心
- owner:
  - 埃里克
- description: 微商城教育不同版本功能配置中心
- cover: ''
- tag:
  - 版本差异
  - 教育商业化
---

# Name
  VersionWrapper
## guide
  要是用VersionWrapper组件，需预先在config.ts文件中按版本配置相应功能，配置格式见“types.ts”:
  ```jsx
    interface IArrayConfigData {
      key: 'index' | 'key';
      filter?: 'include' | 'omit';
      value: number[] | Record<string, any>[];
    }

    interface IComponentConfigData {
      key: 'show' | 'switch' | 'attribute';
      value: string | boolean | Record<string, any>;
    }

    interface IObjectConfigData {
      key?: 'reduce';
      filter?: 'include' | 'omit';
      value: string[];
    }
  ```
## demo
前端代码：
```jsx
  import VersionWrapper from 'fns/version';
  // array、 object case:
  const columns = VersionWrapper({
    name: '新建预约按钮',
    children: [{
      name: 'a',
      bodyRender(){},
      title: 'a'
    },{
      name: 'b',
      bodyRender(){},
      title: 'b'
    }],
  });

  // component case:
  <VersionWrapper name='test' downgrade={{ data: '', from: true }}>
    <LiftNav1 />
    <LiftNav2 />
  </VersionWrapper>
```

配置文件如下：
```jsx
  const basicVersionConfig: IVersionConfigs = {
  'test': {
    type: 'component',
    configs: [{
      key: 'switch',
      value: 'LiftNav1',
    }],
  },
};
```
## api
| 属性名  | 描述                 | 类型                                                  | 是否必填 | 默认值               |
| ------ | ------------------- | ---------------------------------------------------- | ------- | ------------------- |
|   name     |         功能名称，建议使用中文描述          |            string                                          |    是     |                     |
|   children     |         传入的数据类型，包括数组，对象，jsx         |            array, object, jsx                                         |    是     |                     |

## ChangeLog