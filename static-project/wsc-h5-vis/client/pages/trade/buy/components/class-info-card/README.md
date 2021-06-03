## 课程信息卡片

### Props
name | 类型 | 是否必填 | 默认值 | 描述
- | - | - | - | -
isEditable | Boolean | 否 | true | 是否可以选择
isNeedTime | Boolean | 否 | false | 是否选择时间cell
isNeedAddress | Boolean | 否 | false | 是否显示地点cell
isNeedAppointment | Boolean | 否 | false | 是否选择预约cell
courseStart | Number | 否 | - | 课程开始时间
courseEnd | Number | 否 | - | 课程结束时间
alias | String | 否 | - | 用于预约
skuId | String | 否 | - | 用于预约
applyCourseType | String | 否 | - | 用于预约
chosenStudent | Object | 否 | {} | 当前选中的学生，用于预约
chosenTime | Date | 否 | - | 当前选中的时间
chosenAppointment | Object | 否 | {} | 当前的预约信息
chosenAddress | Object | 否 | {} | 当前选择的地点
getAddressList | Function | 否 | () => Promise([]) | 获取地址列表