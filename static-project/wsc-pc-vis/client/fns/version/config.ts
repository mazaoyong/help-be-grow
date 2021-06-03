import { IVersionConfigs } from './types';

export const basicVersionConfig: IVersionConfigs = {
  'course-manage-applyCourse': {
    desc: '线下课详情页适用课程',
    type: 'component',
    configs: [{
      key: 'attribute',
      value: {
        className: 'hide',
      },
    }],
    downgradeConfigs: [{
      key: 'attribute',
      value: {
        disabled: true,
        className: '',
      },
    }],
  },
  'course-manage-courseType': {
    desc: '线下课详情页正式课提示',
    type: 'component',
    configs: [{
      key: 'switch',
      value: 'div',
    }],
  },
  'course-manage-educoursetab': {
    desc: '线下课列表页课程tab',
    type: 'component',
    configs: [{
      key: 'attribute',
      value: {
        className: 'course-educourse__tabs',
      },
    }],
  },
  'course-manage-class1': {
    desc: '线下课详情页按期——名称',
    type: 'component',
    configs: [{
      key: 'show',
      value: true,
    }],
    downgradeConfigs: [{
      key: 'attribute',
      value: {
        disabled: true,
      },
    }],
  },
  'course-manage-class2': {
    desc: '线下课详情页按期——班级',
    type: 'component',
    configs: [{
      key: 'show',
      value: true,
    }],
    downgradeConfigs: [{
      key: 'attribute',
      value: {
        disabled: true,
      },
    }],
  },
  'course-manage-class3': {
    desc: '线下课详情页按期——价格',
    type: 'component',
    configs: [{
      key: 'show',
      value: true,
    }],
    downgradeConfigs: [{
      key: 'attribute',
      value: {
        disabled: true,
      },
    }],
  },
  'course-manage-skuadd': {
    desc: '线下课详情页按期——sku添加',
    type: 'component',
    configs: [{
      key: 'show',
      value: true,
    }],
    downgradeConfigs: [{
      key: 'attribute',
      value: {
        className: 'course-sku-add disable-pointer-input',
        onClick: null,
      },
    }],
  },
  'course-manage-skudelete': {
    desc: '线下课详情页按期——sku删除',
    type: 'component',
    configs: [{
      key: 'show',
      value: true,
    }],
    downgradeConfigs: [{
      key: 'attribute',
      value: {
        style: {
          color: 'grey',
          cursor: 'not-allowed',
        },
        onClick: null,
      },
    }],
  },
  'course-manage-effectDays': {
    desc: '线下课详情页按期生效时间不显示首次上课生效',
    type: 'component',
    configs: [{
      key: 'show',
      value: false,
    }],
    downgradeConfigs: [{
      key: 'attribute',
      value: {
        disabled: true,
      },
    }],
  },
  'course-manage-formalCourse': {
    desc: '线下课详情页按期生效时间不显示首次上课生效',
    type: 'object',
    configs: [{
      key: 'reduce',
      filter: 'include',
      value: [],
    }],
    downgradeConfigs: [{
      key: 'reduce',
      filter: 'omit',
      value: [],
    }],
  },
  'course-manage-courseSellType': {
    desc: '线下课详情页收费方式按期',
    type: 'component',
    configs: [{
      key: 'attribute',
      value: {
        className: 'hide',
      },
    }],
    downgradeConfigs: [{
      key: 'attribute',
      value: {
        disabled: true,
        className: '',
      },
    }],
  },
  'course-manage-duplicate': {
    desc: '线下课列表页复制按钮',
    type: 'component',
    configs: [{
      key: 'show',
      value: true,
    }],
    downgradeConfigs: [{
      key: 'show',
      value: false,
    }],
  },
  'course-manage-register-info': {
    desc: '线下课详情页报名信息',
    type: 'component',
    configs: [{
      key: 'show',
      value: false,
    }],
    downgradeConfigs: [{
      key: 'show',
      value: true,
    }],
  },
  'course-manage-register-text': {
    desc: '线下课详情页报名信息注解',
    type: 'component',
    configs: [{
      key: 'show',
      value: false,
    }],
  },
  'student-course-actions': {
    desc: '学员详情页已报课程操作',
    type: 'component',
    configs: [{
      key: 'show',
      value: false,
    }],
  },
  'scan-sign-list-filter': {
    desc: '扫码签到，签到记录页筛选项',
    type: 'array',
    configs: [{
      key: 'key',
      filter: 'omit',
      value: [{
        name: 'teacherId',
      },
      {
        name: 'classId',
      }],
    }],
  },
  'appointment-fromstudent-coursetype': {
    desc: '预约页面，来自学员的 coursetype 定义',
    type: 'array',
    configs: [{
      key: 'key',
      filter: 'omit',
      value: [{
        name: 'prod',
      }],
    }],
  },
  'scan-sign-list-actions': {
    desc: '扫码签到，签到记录页列表操作',
    type: 'array',
    configs: [{
      key: 'key',
      filter: 'omit',
      value: [{
        title: '上课老师',
      },
      {
        title: '上课班级',
      }],
    }],
  },
  'make-appointment-type': {
    desc: '新建预约的预约类型',
    type: 'component',
    configs: [{
      key: 'show',
      value: false,
    }],
  },
  'appointment-chooselesson-showtry': {
    desc: '预约时选择上课日程的课节试听展示',
    type: 'component',
    configs: [{
      key: 'show',
      value: false,
    }],
  },
  'course-manage-applycourse-validation': {
    desc: '线下课详情页关联课程校验',
    type: 'object',
    configs: [{
      key: 'reduce',
      filter: 'omit',
      value: ['required'],
    }],
  },
  'course-manage-effect': {
    desc: '线下课详情页生效日期降级',
    type: 'object',
    configs: [],
    downgradeConfigs: [
      {
        key: 'reduce',
        filter: 'omit',
        value: ['formalCourse.dateRangeCourse', 'formalCourse.classHourCourse.courseEffectiveType'],
      },
    ],
  },
  'course-manage-registry': {
    desc: '线下课详情页报名信息降级',
    type: 'object',
    configs: [],
    downgradeConfigs: [
      {
        key: 'reduce',
        filter: 'omit',
        value: ['intentTime'],
      },
    ],
  },
  'course-manage-quickmodify': {
    desc: '线下课列表页快捷修改',
    type: 'component',
    configs: [{
      key: 'show',
      value: false,
    }],
  },
  'appointment-chooselesson-hiddencolumn': {
    desc: '预约时选择上课日程列表字段隐藏',
    type: 'array',
    configs: [{
      key: 'key',
      filter: 'omit',
      value: [{
        title: '班级',
      }, {
        title: '教室',
      }, {
        title: '消耗课时',
      }],
    }],
  },
  'try-new-lesson': {
    desc: '试听场景下新建日程页面',
    type: 'component',
    configs: [{
      key: 'show',
      value: false,
    }],
  },
  'appointment-list-show': {
    desc: '预约列表页的 list 字段展示',
    type: 'array',
    configs: [{
      key: 'key',
      filter: 'omit',
      value: [{
        name: 'teacherName',
      }, {
        name: 'assistantNames',
      }],
    }],
  },
  'appointment-list-action': {
    desc: '预约列表页的 list 操作按钮',
    type: 'component',
    configs: [{
      key: 'show',
      value: false,
    }],
    downgradeConfigs: [
      {
        key: 'show',
        value: true,
      },
    ],
  },
  'appointment-chooselesson': {
    desc: '预约选择课节',
    type: 'component',
    configs: [{
      key: 'show',
      value: false,
    }],
    downgradeConfigs: [
      {
        key: 'show',
        value: true,
      },
    ],
  },
  'recruit-detail-action': {
    desc: '线索详情的行动点',
    type: 'component',
    configs: [{
      key: 'show',
      value: false,
    }],
    downgradeConfigs: [
      {
        key: 'show',
        value: true,
      },
    ],
  },
  'appointment-chooselesson-get-filter': {
    desc: '预约选择课节时获取课节列表 query 字段',
    type: 'object',
    configs: [{
      key: 'reduce',
      filter: 'omit',
      value: ['eduCourseId'],
    }],
  },
  'appointment-chooselesson-list-fixed': {
    desc: '预约选择课节时状态栏的 fixed 效果',
    type: 'object',
    configs: [{
      key: 'reduce',
      filter: 'omit',
      value: ['fixed'],
    }],
  },
  'educourse-create-btn': {
    desc: '教务课程创建按钮',
    type: 'component',
    configs: [{
      key: 'attribute',
      value: {
        className: 'eduCourse-create-more',
      },
    }],
  },
  'appointment-panel-setting-timerange': {
    desc: '预约页面的设置按钮内部时间区间设置',
    type: 'component',
    configs: [{
      key: 'show',
      value: false,
    }],
  },
  'student-list-operators': {
    desc: '学员列表页操作按钮显示隐藏，包括每行学员的操作以及导入学员按钮',
    type: 'component',
    configs: [{
      key: 'show',
      value: false,
    }],
  },
  'student-detail-operators': {
    desc: '学员详情页面操作按钮显示隐藏',
    type: 'component',
    configs: [{
      key: 'show',
      value: false,
    }],
  },
  'teacher-select-filterSchedule': {
    desc: '老师选择弹窗',
    type: 'component',
    configs: [{
      key: 'show',
      value: false,
    }],
  },
  'student-detail-sigend-course-edit-course-time': {
    desc: '学员详情已购课程修改课时',
    type: 'component',
    configs: [{
      key: 'show',
      value: false,
    }],
  },
  'student-detail-sigend-course-edit-available-time': {
    desc: '学员详情已购课程修改有效期',
    type: 'component',
    configs: [{
      key: 'show',
      value: false,
    }],
  },
  'student-detail-sigend-course-shift-class': {
    desc: '学员详情已购课程修改班级',
    type: 'component',
    configs: [{
      key: 'show',
      value: false,
    }],
  }
};

export const proVersionConfig: IVersionConfigs = {
  'make-appointment-type': {
    desc: '新建预约的预约类型',
    type: 'component',
    configs: [{
      key: 'show',
      value: true,
    }],
  },
  'appointment-chooselesson-showtry': {
    desc: '预约时选择上课日程的课节试听展示',
    type: 'component',
    configs: [{
      key: 'show',
      value: true,
    }],
  },
  'course-manage-courseType': {
    desc: '线下课详情页正式课提示',
    type: 'component',
    configs: [{
      key: 'switch',
      value: 'span',
    }],
  },
  'educourse-create-btn': {
    desc: '教务课程创建按钮',
    type: 'component',
    configs: [{
      key: 'attribute',
      value: {
        className: 'eduCourse-create-less',
      },
    }],
  },
  'educourse-route-redirect': {
    desc: '教务课程链接重定向',
    type: 'object',
    configs: [{
      key: 'reduce',
      filter: 'omit',
      value: ['onEnter'],
    }],
  },
  'appointment-fromstudent-coursetype': {
    desc: '预约页面，来自学员的 coursetype 定义',
    type: 'array',
    configs: [{
      key: 'key',
      filter: 'omit',
      value: [{
        name: 'basic',
      }],
    }],
  },
};
