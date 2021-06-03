# 横向滚动的日历组件

**不可复用**

该组件会通过开始时间和结束时间渲染一个特定范围的时间选择器，并且首次加载会将当前选中的时间居中

## props 说明

```javascript
const calendarProps = {
  startDate: {
    type: [Date, String, Number],
    default: undefined
  },
  endDate: {
    type: [Date, String, Number],
    default: undefined
  },
  taskState: {
    type: Object,
    default: () => ({})
  },
  taskInit: {
    type: Boolean,
    default: false
  },
  chooseDate: {
    type: String,
    default: undefined
  },
  loading: {
    type: Boolean,
    default: false
  }
};
```

组件只有在传入的 taskInit 标记为 true 时才会渲染视图；同时可以指定 chooseDate 来指定页面加载时选中的时间是哪一天。

## 关于 taskState

用于渲染不同类型日期的颜色，在打卡项目中，存在如下格式：

```javascript
const taskState = {
  "2020-02-29": {
    state: "ADD_CLOCK_IN",
    style: {
      color: "#fff",
      backgroundColor: "#FFBB17",
      border: "1px solid #FFBB17"
    }
  }
};
```

## 关于 loading

loading 变量作为防止页面在请求数据时日期还允许切换导致产生竞态数据的一个属性，你可以在调用的父组件中设置 loading 属性来达到在请求数据的时候禁用时间切换的功能。

## ChangeLog

- 2020-02-29 添加loading属性用于禁止在请求数据的时候日期被切换
