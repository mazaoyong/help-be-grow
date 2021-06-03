import ValuntaryAsyncSelect from 'components/valuntary-async-select/ValuntaryAsyncSelect';
export const filterOptions = (ctx) => [
  {
    type: 'Input',
    name: 'eduCourseName',
    label: '课程名称：',
    props: {
      placeholder: '',
    },
  },
  {
    type: 'Custom',
    name: 'eduCourseAreaId',
    label: '上课校区：',
    component: ValuntaryAsyncSelect,
    className: 'valuntary-async-select-option',
    onSearch: (keyword) => {
      return { name: keyword };
    },
    valueChange: ctx.onShopSelected,
    format: (data) => Promise.resolve(data.target),
    defaultOption: ctx.getDefaultEduShopOption(),
    create: false,
    refresh: false,
    getOptions: ctx.getShopOptions,
    placeholder: '全部',
    hideClose: true,
    width: 165,
  },
];
