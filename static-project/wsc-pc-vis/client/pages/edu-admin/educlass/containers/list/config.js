import React from 'react';
// import { VisLink } from 'fns/router'; // 不好使
import { Link } from 'react-router';
import { Link as SamLink } from '@youzan/sam-components';
import EduClassStatusTag from '../../components/tag-edu-class-status';
import { ValuntaryAsyncSelect } from 'components/valuntary-async-select/ValuntaryAsyncSelect';
import { PrimitiveShopSelector as ShopChoose } from '@ability-center/shop/shop-choose';
import { getDefaultText, getEduClassStatus } from '../../utils';
import { EDU_CLASS_STATUS_TEXT } from '../../constants';
import { chainSupportOnlyHq } from '../../chain';

import formatDate from 'zan-utils/date/formatDate';

const getFilterOptions = ctx => {
  return [
    {
      type: 'Input',
      name: 'eduClassName',
      label: '班级名称：',
      props: {
        placeholder: '',
        width: 165,
      },
    },
    {
      type: 'Custom',
      name: 'kdtId',
      format: (data) => Promise.resolve(data.target),
      label: '上课校区：',
      component: ShopChoose,
      defaultOption: ctx.getDefaultShopNameOption(),
      getShopListCallback: ctx.setStateShopNameList,
      width: 165,
      fetchApi: ctx.state.eduCourseId ? ctx.getShopNameList : undefined,
      valueChange: ctx.handleShopChange,
      chainState: chainSupportOnlyHq,
    },
    {
      type: 'Custom',
      name: 'eduCourseId',
      format: (data) => Promise.resolve(data.target),
      label: '所属课程：',
      component: ValuntaryAsyncSelect,
      defaultOption: ctx.getDefaultEduCourseOption(),
      create: false,
      refresh: false,
      valueChange: ctx.handleEduCourseIdChange,
      getOptions: ctx.getEduCourseOptions,
      placeholder: '全部',
      width: 165,
    },
    {
      type: 'Select',
      name: 'classStatus',
      label: '班级状态：',
      data: [
        {
          value: '',
          text: '全部',
        },
        {
          value: 1,
          text: '待开班',
        },
        {
          value: 2,
          text: '开班中',
        },
        {
          value: 3,
          text: '已结班',
        },
      ],
      props: {
        placeholder: '全部',
        width: 165,
      },
    },
  ];
};

const getColumns = ctx => {
  // todo ctx可以调用一些方法
  return [
    {
      title: '班级名称',
      name: 'eduClassName',
      width: '185px',
      fixed: 'left',
      bodyRender: ({ eduClass = {} }) => {
        return (
          <Link to={`/detail/${eduClass.id}/${eduClass.eduCourseId}/${eduClass.kdtId || _global.kdtId}/student`}>
            {getDefaultText(eduClass.eduClassName)}
          </Link>
        );
      },
    },
    {
      title: '上课校区',
      name: 'eduClassAera',
      bodyRender: ({ shopName }) => {
        return shopName;
      },
      chainState: chainSupportOnlyHq,
    },
    {
      title: '所属课程',
      name: 'eduCourseName',
      bodyRender: ({ eduClass = {} }) => {
        return getDefaultText(eduClass.eduCourseName);
      },
    },
    {
      title: '人数/上限',
      name: 'studentNumInfo',
      bodyRender: ({ classStat = {}, eduClass = {} }) => {
        const currentStuNum = classStat.currentStuNum;
        const maxStuNum = eduClass.maxStuNum;
        return (
          <React.Fragment>
            <span className="lesson-num">
              {getDefaultText(currentStuNum)}/{getDefaultText(maxStuNum)}
            </span>
            {!!(currentStuNum && currentStuNum >= maxStuNum) && (
              <EduClassStatusTag>满班</EduClassStatusTag>
            )}
          </React.Fragment>
        );
      },
    },
    {
      title: '已上/排课次数',
      name: 'lessonNumInfo',
      bodyRender: ({ classStat = {} }) => {
        const endLessonNum = classStat.endLessonNum;
        const planLessonNum = classStat.planLessonNum;
        return (
          <span>
            {getDefaultText(endLessonNum)}/{getDefaultText(planLessonNum)}
          </span>
        );
      },
    },
    {
      title: '开班时间',
      name: 'startTime',
      needSort: true,
      bodyRender: ({ eduClass = {} }) => {
        // todo time formt
        return +eduClass.startTime ? formatDate(eduClass.startTime, 'YYYY-MM-DD') : '-';
      },
    },
    {
      title: '结班时间',
      name: 'endTime',
      needSort: true,
      bodyRender: ({ eduClass = {} }) => {
        // todo time format
        return +eduClass.endTime ? formatDate(eduClass.endTime, 'YYYY-MM-DD') : '-';
      },
    },
    {
      title: '班级状态',
      name: 'eduClassStatus',
      bodyRender: ({ eduClass = {} }) => {
        const startTime = +eduClass.startTime;
        const endTime = +eduClass.endTime;
        return EDU_CLASS_STATUS_TEXT[getEduClassStatus(startTime, endTime)] || '-';
      },
    },
    {
      title: '操作',
      name: 'operate',
      width: '160px',
      fixed: 'right',
      textAlign: 'right',
      bodyRender: (data = {}) => {
        const { eduClass = {} } = data;
        // 待开班、开班中：显示“班级排课、编辑、删除”按钮
        const startTime = +eduClass.startTime;
        const endTime = +eduClass.endTime;
        const now = Date.now();
        if (!startTime || !endTime) {
          return '-';
        }
        if (now > endTime) {
          return <div className="class-table-operate">
            <SamLink className="class-table-operate__item" onClick={() => ctx.deleteEduClass(data)}>
              删除
            </SamLink>
          </div>;
        }
        return (
          <div className="class-table-operate">
            <SamLink className="class-table-operate__item" onClick={() => ctx.addSchedule(data)}>
              排课
            </SamLink>
            <SamLink className="class-table-operate__item" onClick={() => ctx.editEduClass(data)}>
              编辑
            </SamLink>
            <SamLink className="class-table-operate__item" onClick={() => ctx.deleteEduClass(data)}>
              删除
            </SamLink>
          </div>
        );
      },
    },
  ];
};

export { getFilterOptions, getColumns };
