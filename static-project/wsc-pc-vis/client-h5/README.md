```
- client-h5
  |- common
  |- pages-api
  |- components
    |- calendar
      |- index.vue  // 日历组件
    |- tab
      |- index.vue // 页面的底部tab组件
  |- pages
    |- shop-list // 店铺列表
      |- components
        |- shop-item.vue // 店铺item组件
      |- index.vue
      |- main.js
    |- lesson-list // 课表
      |- components
        |- lesson-item.vue // 课表item组件
      |- index.vue
      |- main.js
    |- sign-in // 签到
      |- components
        |- header.vue // 头部的课程介绍
        |- detail.vue // 学员签到情况
        |- student-item.vue // 单个学员组件
        |- all-sign-in.vue // 全部签到底部的组件
        |- confirm-modal // 签到确认弹窗
      |- index.vue
      |- main.js
    |- user-center // 我的
      |- components
        |- tag.vue // 老师的tag
        |- header.vue // 头部包含老师头像，姓名，手机号的整体组件
        |- label.vue // 当前机构的通用UI组件
      |- index.vue
      |- main.js
  |- store
    |- modules
      |- shop-list
      |- lesson-list
      |- sign-in
      |- user-center
    |- index.js
  |- package.json
  |- superman.json
  |- README.md
```