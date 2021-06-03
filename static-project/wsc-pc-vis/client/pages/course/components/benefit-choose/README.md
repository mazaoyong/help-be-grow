---
- title: 选择归属会员权益
- owner:
  - 埃里克
- description: 选择归属会员权益表单
- cover: https://b.yzcdn.cn/plus/one/second/image-20191104161522640.png
- tag: 
  - 会员权益
---

## chooseBenefit 选择归属会员权益

导入路径 ` client/pages/pct/common/components/benefit-choose`

### 适用场景

这是一个命令式调用函数，用来弹出选择会员权益的对话框，适用于需要选择归属会员权益的地方。

目前它仅用于[归属会员权益自定义表单域组件](../field/vip-benefit)中。

### 使用指南

它是一个高阶函数，它接受一些参数，并返回一个 React Components 中的 [选择对话框组件](http://fedoc.qima-inc.com/react-components/#/choose-dialog)。

### 代码演示

![image-20191104161522640](https://b.yzcdn.cn/plus/one/second/image-20191104161522640.png)



```javascript
// file: client/pages/pct/common/components/field/vip-benefit/index.jsx

import chooseBenefit from '../../benefit-choose';

chooseBenefit({
  onChoose: data => {
    if (Array.isArray(data) && data.length > 0) {
      const benefitData = {
        isIn,
        list: unique(list, data),
      };
      this.props.onChange(benefitData);
      this.props.self.setState({
        benefitData,
      });
    }
  },
  config: {
    ...window._global,
    cards: list,
  },
});
```



### API

API 参见 React Components 中的 [选择对话框组件 API](http://fedoc.qima-inc.com/react-components/#/choose-dialog#api)