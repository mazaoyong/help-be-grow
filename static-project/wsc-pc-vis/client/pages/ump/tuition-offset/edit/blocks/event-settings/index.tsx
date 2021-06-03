import { Pop } from '@zent/compat';
import React from 'react';
import { FormRadioGroupField, Validators, Radio } from 'zent';
import { IFormCreatorConfig } from '@youzan/ebiz-components/es/types/easy-form-archive';

import { InfoCollectField } from '@ability-center/ump/info-collect-field';
import CourseSelectField from '../../components/course-select-field';
import BoostSettingField from '../../components/boost-setting-field';
import PosterSelectField from 'components/field/poster-select';
import { editType } from '../../context';

import { EventCourseType, PhaseOneNeedBoost, BackgroundTypeEnum } from '../../types';
import { EventStatus } from '../../../types';
import './styles.scss';

interface IEventSettingsProps {
  editType?: editType;
  eventStatus?: EventStatus;
}

const customExampleImage = '//b.yzcdn.cn/public_files/85841ec36a197870a15cf48c91fce994.png';
const posterImageHover = '//b.yzcdn.cn/public_files/0dc6500ba4c72df80d05f7035d5f5db8.png';
const defaultExampleImage = '//b.yzcdn.cn/public_files/e8a105d3b60bdb1042127f2564654922.png';
const posterTemplateFile = '//img.yzcdn.cn/upload_files/2020/11/23/FoLqx4vGGbcW1cakq7wNncfnLNdz.psd?attname=攒学费自定义海报模板.psd';

const EventSettings = (props: IEventSettingsProps): IFormCreatorConfig[] => {
  const { editType, eventStatus } = props;
  const isEdit = editType === 'edit';
  const isDetail = editType === 'detail';

  const isEventNotStarted = eventStatus === EventStatus.notStarted;
  const isEventEnded = eventStatus === EventStatus.ended;

  return [
    {
      label: '活动课程：',
      name: 'courseSelect',
      component: CourseSelectField,
      required: true,
      defaultValue: {
        eventCourseType: EventCourseType.all,
        courseList: [],
      },
      props: () => ({
        props: {
          width: 314,
        },
        disabled: (isEdit && eventStatus && !isEventNotStarted) || isDetail,
      }),
      validators: [
        (value) => {
          const { eventCourseType = EventCourseType.all, courseList = [] } = value;
          if (eventCourseType === EventCourseType.partial && courseList.length === 0) {
            return {
              name: 'no course selected',
              message: '需要选择课程',
            };
          }
          return null;
        },
      ],
      withoutError: true, // 为了把错误显示在helpDesc上面
    },
    {
      label: '助力设置：',
      name: 'boostSetting',
      type: 'field',
      component: BoostSettingField,
      required: true,
      defaultValue: {
        enableNoBoost: PhaseOneNeedBoost.noNeed,
        boostDetail: [{
          phaseNo: 1,
          helpCnt: 0,
        }, {
          phaseNo: 2,
        }],
      },
      props: () => ({
        props: {
          width: 416,
        },
        disabled: (isEdit && eventStatus && !isEventNotStarted) || isDetail,
      }),
    },
    {
      label: '学员信息采集：',
      name: 'needInfoCollect',
      type: 'field',
      component: FormRadioGroupField,
      required: true,
      children: [
        {
          component: (
            <>
              <Radio value={1}>开启</Radio>
              <Radio value={0}>关闭</Radio>
            </>
          )
        }
      ],
      props: () => ({
        props: {
          disabled: (isEdit && eventStatus && !isEventNotStarted) || isDetail,
        },
      }),
      defaultValue: 1,
      validators: [
        Validators.required('请选择是否需要学员信息采集'),
      ],
    },
    {
      label: '信息采集字段：',
      name: 'collectInfo',
      className: 'tuition-offset__info-collect',
      component: InfoCollectField,
      required: true,
      props: () => ({
        showDesc: false,
        disabled: (isEdit && eventStatus && !isEventNotStarted) || isDetail,
      }),
      helpDesc: <>
        学员在参与活动前，需要填写的信息。
        <Pop
          trigger="hover"
          position="auto-bottom-center"
          content={<img
            height={357}
            width={178}
            src="//b.yzcdn.cn/public_files/114cd25f3bb9b2c9fa29a5667899342b.png" alt="" />}
        >
          <span className="show-example">查看示例</span>
        </Pop>
      </>,
      defaultValue: { infoCollect: { customizeItems: [] }, needVerifyCode: 0 },
      show: {
        dep: 'needInfoCollect',
        fn: (needInfoCollect: 0 | 1) => needInfoCollect === 1,
      },
    },
    {
      label: '助力海报：',
      name: 'posterSelect',
      className: 'tuition-offset__poster',
      component: PosterSelectField,
      required: true,
      defaultValue: {
        backgroundType: BackgroundTypeEnum.default,
        // backgroundUrl: null,
      },
      props: () => ({
        disabled: (isEdit && isEventEnded) || isDetail, // 编辑时允许修改海报
        tips: (
          <p className="desc">
            建议尺寸 600x836px，JPG、PNG 格式，图片小于 1M。
            <br className="desc-break-line" />
            <Pop
              trigger="hover"
              position="top-center"
              content={
                <img width="196px" src={customExampleImage} alt="图片示例" />
              }
            >
              <span className="default-background-example">查看示例</span>
            </Pop>
            <a
              href={posterTemplateFile}
              className="poster-template-file-download"
              target="_blank" rel="noopener noreferrer">
               下载海报模版
            </a>
          </p>
        ),
        previewMode: '3:4',
        imageHover: posterImageHover,
        defaultBgExample: (
          <Pop
            trigger="hover"
            content={
              <div className="example-pop">
                <div className="example-image">
                  <img
                    width="179px"
                    height="249px"
                    src={defaultExampleImage}
                    alt="图片示例"
                  />
                </div>
              </div>
            }
          >
            <span className="default-background-example ml-8">查看示例</span>
          </Pop>
        ),
      }),
      validators: [
        (val) => {
          const { backgroundType, backgroundUrl } = val;
          if (backgroundType === null || backgroundType === undefined) {
            return {
              name: 'EmptyBoostPoster',
              message: '请选择助力海报类型',
            };
          }
          if (backgroundType === BackgroundTypeEnum.customised && !backgroundUrl) {
            return {
              name: 'EmptyCustomPoster',
              message: '请选择自定义背景图',
            };
          }
        },
      ],
    }
  ];
};

export default EventSettings;
