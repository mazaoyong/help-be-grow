---
- title: InfoCollectField 信息采集自定义表单域
- owner:
  - 逐浪
- description: InfoCollectField 信息采集自定义表单域
- cover: https://b.yzcdn.cn/plus/one/second/image-20191104145218946.png
- tag:
  - InfoCollectField
  - 信息采集
  - 自定义表单域
---

## InfoCollectField 信息采集自定义表单域

导入路径 `components/field/info-collect`

### 适用场景

该组件用作在线课程创建/编辑表单中的「信息采集」部分，用来设置客户在支付前需要必填的信息，如：

- [课程/在线课程/内容/新建（编辑）内容页](https://www.youzan.com/v4/vis/pct/page/content#/add/text)

- [课程/在线课程/专栏/新建（编辑）专栏页](https://www.youzan.com/v4/vis/pct/page/column#/add)

- [课程/在线课程/直播/新建（编辑）直播页](https://www.youzan.com/v4/vis/pct/page/live#/add)

该组件包括：

- 信息采集项列表
  - 默认展示6项，超出的采集项隐藏
  - 编辑：如果选择了隐藏的采集项，列表展示状态为显示全部
- 效果预览为一张固定的资源图片
- 新增按钮
- 刷新按钮
  - 微商城：客户资料项
  - 教育：自定义资料项

**信息采集组件内部会请求一个获取信息采集配置项的接口，这个接口场景值恒为6**

### 使用指南

该组件是[「使用 `getControlGroup` 封装的自定义表单域」](https://zent-contrib.github.io/zent-compat/zh/component/form#shi-yong-getcontrolgroup-feng-zhuang-zi-ding-yi-biao-dan-yu)，应当作为[「表单域  Filed」](https://zent-contrib.github.io/zent-compat/zh/component/form#biao-dan-yu-field) 组件的 `component` props 使用。

见[「API」一节](#api)。

### 代码演示

> 说明：该组件不包含截图中「信息采集：[x] 开启」这部分

![image-20191104145218946](https://b.yzcdn.cn/plus/one/second/image-20191104145218946.png)

~~当点击「效果预览」按钮时会显示实时预览图：~~



```jsx
// file: client/pages/pct/column/containers/edit/index.jsx

import InfoCollectField from '../../../common/components/field/info-collect';

<div>
  <label>信息采集：</label>
  <div>
    <Checkbox>开启</Checkbox>
  </div>
</div>
<Field
  name="collectInfoSetting"
  label="显示信息"
  component={InfoCollectField}
  value={collectInfoSetting}
  onChange={val => this.setState({ collectInfoSetting: val })}
/>

```



### API

该组件本身并不提供任何 API，请参考 [`From.Fileld` 的 API 文档](https://zent-contrib.github.io/zent-compat/zh/component/form#form-field)。

## Changelogs

- 2020-01-10 信息采集支持自定义资料项
- 2020-01-14 信息采集“去添加”按钮由新页面打开
- 2020-01-18
  - “显示/隐藏” -> “展开/收起”
  - “添加新字段” -> “添加自定义字段”
- 2020-01-22
  - 添加自动展开隐藏的功能
- 2020-02-07
  - 添加信息采集的单词编辑/新建的记忆功能，使用session-storage，需要注意的是，在content、columns和live的路由中，在`/list`的onEnter钩子中清空了sessionStorage的tempInfoCollect字段（为了避免再次新建读取上一次的值）
  - 为【添加自定义字段】添加跳转参数，支持在自定义资料项直接打开添加弹窗
- 2020-02-09
  - 修复文字居中对齐

- 2020-02-11
  - 升级zent7.4.3，修改form为compat中的

- 2020-04-16
  - 移动到components/field
  - 添加`itemRender`参数用于自定义渲染采集项
  - 添加`formatItems`参数用于对采集项排序
  - 添加`expandLimit`参数用于设置折叠阈值

- 2020-07-15
  - 添加信息采集支持纳入线索字段

- 2020-07-21
  - 添加`showInClue`字段用于控制是否进入线索条件的开启关闭

- 2020-09-15
  - 分校区信息采集移除添加自定义字段选项
- 2020-09-17
  - 添加`infoCollectHelpDesc`字段展示信息采集帮助文案，用于不同模块展示自己独有的帮助文案
  - 添加`sceneId`字段，支持传入场景ID，为0则展示商家后台设置的所有资料项，不填默认为6（信息采集（学员报名场景的资料项））
  - 添加`showDesc`字段，控制帮助文案字段是否展示
