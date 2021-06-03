# EbizComponents ChangeLog 

## 0.1.63


**Bugfix: 优化 select 组件 [#166](http://gitlab.qima-inc.com/ebiz-web/ebiz-react-components/merge_requests/166)@chenzihao**

1. 修复onChange和onSelect的options入参会丢失option定义的属性 #bugfix
2. 异步模式下指定filter属性的时候会将option进行缓存，修复清除keyword导致备选列表还是展示上一次keyword请求的列表 #feature
3. 修复之前版本中mounted时都会请求选项的bug，现在如果设置了`fetchOnOpened`属性，就不会在mount阶段触发请求 #bugfix
4. 修复滚动到底部的时候有概率发起多个请求的bug #bugfix
5. 修复Select中输入 `+` 等正则表达式的符号的时候会导致option高亮逻辑报错 #bugfix

## 0.1.62


## 0.1.61


**Bugfix: EasyForm: 修改初始化过程show的问题 [#162](http://gitlab.qima-inc.com/ebiz-web/ebiz-react-components/merge_requests/162)@chenzihao**

EasyForm: 修改Form在初始化过程中缺少show属性就不初始化model的bug

## 0.1.60


**Bugfix: 修复EasyForm在指定了show方法的时候会丢失model的bug [#160](http://gitlab.qima-inc.com/ebiz-web/ebiz-react-components/merge_requests/160)@chenzihao**

EasyForm: 修复了如果指定了show.fn，在初始化过程中会导致form model丢失的bug

现在，指定了destroyOnUnmount为false的field即使show为false，也不会从form model中移除

## 0.1.59


**Bugfix: fix(CustomSelector): 修复重新拉取接口后未更新 selectedRows [#157](http://gitlab.qima-inc.com/ebiz-web/ebiz-react-components/merge_requests/157)@meijing**



## 0.1.56


**Bugfix: fix: 修复select在开启键盘事件情况下会对输入产生影响 [#151](http://gitlab.qima-inc.com/ebiz-web/ebiz-react-components/merge_requests/151)@chenzihao**

Select: 修复Select组件输入无响应的bug

修复Select因为监听键盘上下方向键导致输入无响应的bug

## 0.1.55


**Feature: Feature/tuition offset [#149](http://gitlab.qima-inc.com/ebiz-web/ebiz-react-components/merge_requests/149)@zhaozihao**

组件: 教育商品选择器

- 新增`dictConfig`用于覆盖goods-selector-v2的dict属性
- 新增 `customManageUrl`属性值，用于自定义商品管理的链接
- 将`isOnlyShowEduGoods` 移入dictConfig

## [DEPRECATED] ~~0.1.53~~


**Bugfix: fix: 修复lodash引入方式导致打包失败 [#146](http://gitlab.qima-inc.com/ebiz-web/ebiz-react-components/merge_requests/146)@meijing**

修复lodash引入方式导致打包失败

## 0.1.52


**Feature: feat: 完成课程商品选择组件 [#144](http://gitlab.qima-inc.com/ebiz-web/ebiz-react-components/merge_requests/144)@meijing**

课程商品选择组件: 新特性

 - 透传中台组件props
 - 支持营销活动配置
 - 支持选择非教育商品（如实物商品）
 - 支持隐藏「商品管理」按钮

## 0.1.51


**Bugfix: Select：非受控模式兼容 [#142](http://gitlab.qima-inc.com/ebiz-web/ebiz-react-components/merge_requests/142)@chenzihao**

Select: 添加value在非受控模式下的兼容

value在非受控模式下由上一个版本的错误改由控制台提示「配合使用onChange来使用受控模式」而不阻塞渲染

## 0.1.50


**Feature: Select组件特性更新，并修复若干bug [#138](http://gitlab.qima-inc.com/ebiz-web/ebiz-react-components/merge_requests/138)@chenzihao**

Select:
 0. 添加单测用例
 1. 调整Select Dropdown的浮层的优先级
 2. 支持设置Dropdown的classname
 3. 支持displayNum属性，支持新版Select规范中超出内容折叠的功能
 4. 添加onKeywordChange钩子
 5. 兼容tags和multiple的属性（**新版的Select将不再支持tags属性**）
 6. 优化默认值和默认选项的设置时间
 7. 下拉列表支持展示分组选项（样式不同，不可点击，仅仅用作视图分割）

## 0.1.49


**Bugfix: EasyList，修复组件无法回填的bug [#133](http://gitlab.qima-inc.com/ebiz-web/ebiz-react-components/merge_requests/133)@chenzihao**

EasyList: 修复因为修改defaultFilter的初始化导致filter组件无法回填的bug

## 0.1.48


**Bugfix: 修复List组件初始化参数错误的问题 [#130](http://gitlab.qima-inc.com/ebiz-web/ebiz-react-components/merge_requests/130)@chenzihao**

EasyList: 修复List组件初始化参数错误的问题

## 0.1.46


**Bugfix: 修复select在老Form中选中了没效果的bug [#124](http://gitlab.qima-inc.com/ebiz-web/ebiz-react-components/merge_requests/124)@chenzihao**

Select: 修复select在老Form中选中了没效果的bug

## 0.1.45


**Bugfix: 支持线索列表改造项目 [#120](http://gitlab.qima-inc.com/ebiz-web/ebiz-react-components/merge_requests/120)@chenzihao**

- Select: 修复select组件在老Form中无法清空已选项的bug
- EasyList: 修改传入filter输入域的props入参的合并方式，现在使用者指定的入参有最高的优先级

## 0.1.44


**Bugfix: Feature/supv melo [#112](http://gitlab.qima-inc.com/ebiz-web/ebiz-react-components/merge_requests/112)@huxuewang**

增加@youzan/utils依赖

## 0.1.43


**Feature: feat: 增加教育商品选择器 [#108](http://gitlab.qima-inc.com/ebiz-web/ebiz-react-components/merge_requests/108)@suntianxiao**

EduGoodsSelector: 教育商品选择器

- 基于午十大哥的GoodsSelectorV2
- 支持选择线下课、专栏、内容、直播
- 依赖@youzan/react-components的最低版本是2.0.10

**Feature: feat: 增加下载图片组件 [#107](http://gitlab.qima-inc.com/ebiz-web/ebiz-react-components/merge_requests/107)@huxuewang**

1. 增加下载图片组件
2. 修改easyform关于show字段的刷新延迟问题

**Feature: EasyList支持题库项目 [#105](http://gitlab.qima-inc.com/ebiz-web/ebiz-react-components/merge_requests/105)@chenzihao**

EasyList: 添加一些新特性
- 支持设置`delay`属性来延迟触发`onSubmit`方法，用于`ES`反馈慢的情况
- Gird组件添加`emptyCreateLabel`属性，支持空列表的时候展示创建文案
- Grid/Pop添加`preventDefault`属性来防止点击文本的时候事件向上冒泡
- Grid/Pop添加`adjustPositionOnShow`属性，支持在打开Pop的时候自动调整位置

**Feature: PopEllipsis、Dialog和EditFormHOC组件支持题库项目 [#104](http://gitlab.qima-inc.com/ebiz-web/ebiz-react-components/merge_requests/104)@chenzihao**

PopEllipsisText: 添加文字超出隐藏的新特性
- 支持渲染虚拟节点来计算宽度是否超出限制宽度
- 支持使用`selector`选择父节点，并判断是否超出宽度

Dilog：添加`submitEffect`属性，用于处理数据提交的副作用，同时返回一个`Promise<boolean>`控制Dialog是否关闭

EditFormHOC: 优化TS类型定义

## 0.1.42


**Bugfix: Hotfix/alert link [#101](http://gitlab.qima-inc.com/ebiz-web/ebiz-react-components/merge_requests/101)@zhaozihao**

TempAlertInfo: 修改TempAlertInfo中IOSBuyAlert的跳转链接

## 0.1.41


**Bugfix: Hotfix/change img referenec [#99](http://gitlab.qima-inc.com/ebiz-web/ebiz-react-components/merge_requests/99)@zhuguangji**

Video: 改变Img引用位置

原先直接引用@youzan/ebiz-components,改为内部相对路径引用

## 0.1.40


**Bugfix: Select: 回退select value的改动 [#94](http://gitlab.qima-inc.com/ebiz-web/ebiz-react-components/merge_requests/94)@chenzihao**

Select: 回退select value的改动

## [DEPRECATED] ~~0.1.39~~


**Bugfix: Hotfix/wc select [#91](http://gitlab.qima-inc.com/ebiz-web/ebiz-react-components/merge_requests/91)@chenzihao**

Select: Select组件添加`multiple`属性的支持，单选模式下支持`value`属性为单个值

## 0.1.38


**Feature: pc-vis通用组件迁移 [#88](http://gitlab.qima-inc.com/ebiz-web/ebiz-react-components/merge_requests/88)@zhuguangji**

pc-vis组件迁移: 将多个项目中通用展示组件迁移至ebiz
迁移组件列表：

   - ActionFooter 页面底部吸底操作
   - ClickTable 双标投表格
   - CustomSelector 自定义selector
   - OrderFilter 知识付费筛选弹窗
   - Img 高斯模糊图片展示
   - LinkGroup 链接群组件
   - ListPopupEditor 快速修改popup
   - LockWrap 风控锁
   - TempAlertInfo 临时提醒信息组件
   - PopEllipsisText 字符串超出省略
   - EditFormHoc 页面退出提醒弹窗
   - Video 基于zan-media-sdk的视频播放器
   - TimingTask 执行轮询任务



## 0.1.37


**Bugfix: fix: 拖拽列表样式改动 [#85](http://gitlab.qima-inc.com/ebiz-web/ebiz-react-components/merge_requests/85)@chenzihao**

DragList: 拖拽列表样式改动

## 0.1.36


**Feature: Feature/drag list [#82](http://gitlab.qima-inc.com/ebiz-web/ebiz-react-components/merge_requests/82)@chenzihao**

DargList: 一个API类似`zent/grid`的拖拽排序列表组件，额外支持`swap`模式进行排序，支持筛选数据，将某些数据标为禁用

**Feature: Hotfix/easy list live [#81](http://gitlab.qima-inc.com/ebiz-web/ebiz-react-components/merge_requests/81)@chenzihao**

EasyList: 更新EasyList组件

- `GridPop`组件添加`confirmText`和`cancelText`属性
- `GridPop`组件支持自定义position
- `quickEditPop`组件支持`zent/Validators`
- `quickEditPop`组件`onConfirm`支持传入`Pormise<boolean>`类型控制确认按钮的

## 0.1.35


**Feature: Hotfix/easy list sup [#79](http://gitlab.qima-inc.com/ebiz-web/ebiz-react-components/merge_requests/79)@chenzihao**

EasyList: 添加新组件`InlineFilter`，支持`autoFilter`模式下更灵活的配置筛选域的布局

## 0.1.34


**Bugfix: 修复Select 多选在受控模式下无法删除唯一一个选项tag的bug [#76](http://gitlab.qima-inc.com/ebiz-web/ebiz-react-components/merge_requests/76)@chenzihao**

Select: 修复多选受控模式下当被选值删到最后一个的时候无法删除的bug

## 0.1.33


**Bugfix: 修复select依赖的hooks的改动 [#72](http://gitlab.qima-inc.com/ebiz-web/ebiz-react-components/merge_requests/72)@chenzihao**

useValueCallback: 修复hooks的更新时机的，适配easy-list/filter

## 0.1.32


**Bugfix: 【select】更新select，修复问题，靠拢标准 [#69](http://gitlab.qima-inc.com/ebiz-web/ebiz-react-components/merge_requests/69)@chenzihao**

Select: Select版本大更新，完善一些之前未完善的功能，修复一些bug

- 修改内部实现原有的rc-dropdown为zent/popover
- 修改throttleConf为debounceConf，使用方法保持一致
- 添加`closeOnSelect`，即使是多选模式下，也能点击一个选项就关闭

**Feature: Hotfix/student import 2 [#68](http://gitlab.qima-inc.com/ebiz-web/ebiz-react-components/merge_requests/68)@zhaozihao**

Icon组件: 新增doc图标

## 0.1.31


**Bugfix: grid样式兼容调整 [#65](http://gitlab.qima-inc.com/ebiz-web/ebiz-react-components/merge_requests/65)@duyuehan**

easy-list: 调整grid排序表头样式兼容

**Feature: 优化Filter的更新时机 [#64](http://gitlab.qima-inc.com/ebiz-web/ebiz-react-components/merge_requests/64)@chenzihao**

EasyList: 优化更新时机，配合`rxjs`精确更新视图，现在表单的联动改动不会触发整个视图的重绘，只会触发关联视图的重绘了

**需要注意的是，现在如果`config`相对应的修改了`visible`或者`disabled`属性，视图会被相应的更新，请检查这两个属性是否在外部有被修改**

**Feature: Hotfix/xianyu hotfix [#63](http://gitlab.qima-inc.com/ebiz-web/ebiz-react-components/merge_requests/63)@xianyu_wang**

EasyList: 增加触发分页查询的原因参数

EasyForm: 更新
- 增加initialize属性用来针对第一次初始化表单值
- 增加RadioInput组件
- 文档更新

**Feature: EasyList Actions组件更新 [#62](http://gitlab.qima-inc.com/ebiz-web/ebiz-react-components/merge_requests/62)@chenzihao**

EasyList: Action组件的`actionsOption`属性支持renderChildren模式，且入参为`filter`

**Bugfix: 修复EasyList快速选择时间范围时”今“无法选中 [#61](http://gitlab.qima-inc.com/ebiz-web/ebiz-react-components/merge_requests/61)@chenzihao**

EasyList: 修复type为`DateRangeQuicker`

- DatePickerTypes枚举值增加`DateRangeQuickPicker`
- 修复`preset`为0的时候的解析错误

**Feature: EasyList Filter 支持visible从config中主动更新 [#60](http://gitlab.qima-inc.com/ebiz-web/ebiz-react-components/merge_requests/60)@chenzihao**

EasyList: EasyList的`visible`属性现在会优先从`config`中获取状态

如果`config`中的`visible`属性值被变更为`false`，那么这个Field将不会被渲染，**同时建议配合`formatFields`属性对这个值在提交前进行过滤操作**

## 0.1.30


**Feature: 课程卡片组件 [#55](http://gitlab.qima-inc.com/ebiz-web/ebiz-react-components/merge_requests/55)@chenzihao**

新增：CardList 课程卡片组件

**Bugfix: easyForm定义兼容zent8 [#54](http://gitlab.qima-inc.com/ebiz-web/ebiz-react-components/merge_requests/54)@xianyu_wang**

兼容zent8 form定义

**Feature: easyform [#46](http://gitlab.qima-inc.com/ebiz-web/ebiz-react-components/merge_requests/46)@xianyu_wang**

EasyForm更新

- easyform修改了watch的触发时机
- 增加了config的immediate字段，可以自己决定是否在表单初始化的时候就执行watch的回调
- 增加show的value，可以直接决定表单项是否展示
- 增加了fieldProps，可以根据form值决定表单属性

**Bugfix: Hotfix/easy list support [#45](http://gitlab.qima-inc.com/ebiz-web/ebiz-react-components/merge_requests/45)@chenzihao**

修复easy-list的watch函数的更新时会覆盖上一次的状态的bug

**Bugfix: Hotfix/timepicker fixes [#43](http://gitlab.qima-inc.com/ebiz-web/ebiz-react-components/merge_requests/43)@zhaozihao**

修复time-picker滚动问题

