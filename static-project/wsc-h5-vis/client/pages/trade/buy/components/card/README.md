## Card
卡片布局

### Card Props
name | 类型 | 是否必填 | 默认值 | 描述
- | - | - | - | -
title | String | 否 | - | 标题，自带样式

### Card Slots
name | 描述
- | -
head | 自定义头部
default | 自定义主体


## CardCell
基于vant的cell二次封装

### CardCell Props
在vant cell的基础上增加或覆写了props或更改了样式
name | 类型 | 是否必填 | 默认值 | 描述
- | - | - | - | -
value | String | 否 | - | 同vant cell的value，颜色为 #323233
tip | String | 否 | - | 同vant cell的value，颜色为 #c8c9cc
isEditable | Boolean | 否 | true | 当为true的时候等价于is-link为true，为false时不触发click事件
border | Boolean | 否 | false | 同vant cell的border，透传但更新了样式
leftIcon | String | 否 | - | vant cell的icon，换了个名字
icon | String | 否 | - | title后跟着的icon

### CardCell Slots
同vant cell的slots
