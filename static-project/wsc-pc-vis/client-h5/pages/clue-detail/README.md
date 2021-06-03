|- clue-detail // 线索详情
  |- components
    |- dynamic-add.vue // 动态记录-添加线索组件
    |- dynamic-follow.vue // 动态记录-跟进记录组件
    |- dynamic-item-container.vue // 动态记录的各个组件的通用容器
    |- dynamic-person.vue // 动态记录-变更课程顾问组件
    |- dynamic-stage.vue // 动态记录-更新阶段组件
    |- dynamic-student-attribute-item.vue // 动态记录-更新基本资料的item组件
    |- dynamic-student.vue // 动态记录-更新基本资料组件
    |- dynamic-tag.vue // 动态记录-更新标签组件
    |- spread.vue // 折叠/展开组件
    |- next.vue // 下一条
    |- operation.vue // 底部的操作
  |- containers
    |- dynamic-item.vue // 单条动态业务组件
    |- experience-course-item.vue // 单个体验课组件
    |- bought-course-item.vue // 单个已买课程组件
    |- student-info.vue // 学员的信息
    |- clue-tag.vue // 线索标签
    |- detail-assemblage.vue // 动态记录+体验课+已购课程的组件集合
  |- views
    |- clue-detail //线索详情入口
      |- index.vue
    |- edit-tag // 编辑标签
      |- index.vue
    |- signup-detail // 报名详情（来源情况为报名表单，可以点击查看报名详情）
      |- components
        |- attribute-item.vue
      |- index.vue
    |- update-dynamic // 添加/编辑动态
      |- components
        |- label.vue // 回访时间选择label组件
        |- upload-bar.vue // 上传图片组件
      |- index.vue
    |- record-detail // 动态详情-添加跟进记录（单条动态业务组件的添加跟进记录的展开）
      |- index.vue
    |- student-info // 动态详情-更新基本资料（单条动态业务组件的更新基本资料的展开）
      |- components
        |- attribute-item.vue
      |- index.vue
    |- clue-tag // 动态详情-更新标签（单条动态业务组件的更新标签的展开）
      |- index.vue
  |- index.vue
  |- router.js
  |- main.js
  