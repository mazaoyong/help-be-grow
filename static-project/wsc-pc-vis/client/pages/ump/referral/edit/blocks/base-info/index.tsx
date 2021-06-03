import { Pop } from '@zent/compat';
import React from 'react';
import { Form, FormInputField, Validators } from 'zent';
import { DownloadImage } from '@youzan/ebiz-components';
import { IFormCreatorConfig } from '@youzan/ebiz-components/es/types/easy-form-archive';

import DateTimeRangePicker from 'components/field/date-range-picker';
import PosterSelectField from 'components/field/poster-select';
import { BgTypeEnum } from 'pages/ump/referral/types';
import CourseSelectField from '../../components/course-select-field';

import { DEFAULT_POSTER_BG_URL } from '../../../constants';

interface IBaseInfoProps {
  isDetail: boolean;
  disableName: boolean;
  disableGoods: boolean;
  disableTime: boolean[];
}

const defaultModelUrl = 'https://b.yzcdn.cn/public_files/4d9bbcf97eeba3bc6faba22a2ca102c2.png';

const BaseInfo = (props: IBaseInfoProps): IFormCreatorConfig => {
  const { isDetail, disableName, disableGoods, disableTime } = props;

  return {
    keyName: 'base-info',
    component: ({ children }) => (
      <div className="form-block">
        <h2 className="new-title">活动基础信息</h2>
        {children}
      </div>
    ),
    children: [
      {
        label: '活动名称：',
        name: 'name',
        className: 'form-error-control',
        required: '请输入活动名称',
        validators: [Validators.maxLength(20, '最多可输入20个字')],
        type: 'field',
        component: FormInputField,
        props: () => ({
          props: {
            width: 240,
            placeholder: '20个字以内',
            disabled: isDetail || disableName,
          },
        }),
      },
      {
        label: '活动时间：',
        name: 'time',
        className: 'form-error-control',
        required: '请选择活动时间',
        component: DateTimeRangePicker,
        props: () => ({
          disableStartTime: disableTime[0],
          disableEndTime: disableTime[1],
        }),
        defaultValue: ['', ''],
        getValidateOption() {
          return Form.ValidateOption.IncludeAsync;
        },
        validators: [
          (val) => {
            if (!val) {
              return {
                name: 'time',
                message: '请选择活动时间',
              };
            }
            const [startTime, endTime] = val || [];
            if (!startTime || !endTime) {
              return {
                name: 'time',
                message: `请选择${!startTime ? '开始' : '结束'}日期`,
              };
            }

            const ONE_DAY = 1000 * 60 * 60 * 24;

            if (endTime - startTime <= ONE_DAY) {
              return {
                name: 'time',
                message: '活动时间不可短于一天',
              };
            }

            if (endTime - startTime >= ONE_DAY * 365) {
              return {
                name: 'time',
                message: '活动时间不可超过一年',
              };
            }
          },
        ],
      },
      {
        label: '活动商品：',
        name: 'courseSelect',
        className: 'referral__course-select form-error-control',
        required: true,
        component: CourseSelectField,
        defaultValue: {},
        props: () => ({
          props: {
            width: 314,
          },
          disabled: isDetail || disableGoods,
        }),
        validators: [
          (value) => {
            if (!value || !value.alias) {
              return {
                name: 'courseSelect',
                message: '请选择课程',
              };
            }
          },
        ],
      },
      {
        label: '海报背景设置：',
        name: 'posterSelect',
        className: 'referral__poster form-error-control',
        component: PosterSelectField,
        required: true,
        defaultValue: {
          backgroundType: BgTypeEnum.DEFAULT,
        },
        props: () => ({
          disabled: isDetail || disableName,
          tips: (
            <p className="desc">
              点击上传你制作完成的海报图片，建议尺寸600*836px，JPG、PNG 格式，图片小于3M。
              <DownloadImage text={'下载海报示例'} url={defaultModelUrl} />
            </p>
          ),
          defaultBgExample: (
            <Pop
              trigger="hover"
              content={
                <div className="example-pop">
                  <div className="example-image">
                    <img width="179px" height="249px" src={DEFAULT_POSTER_BG_URL} alt="图片示例" />
                  </div>
                </div>
              }
            >
              <span className="default-background-example">查看示例</span>
            </Pop>
          ),
        }),
        validators: [
          (val) => {
            const { backgroundType, backgroundUrl } = val;
            if (backgroundType === null || backgroundType === undefined) {
              return {
                name: 'EmptyBoostPoster',
                message: '请选择海报背景类型',
              };
            }
            if (backgroundType === BgTypeEnum.CUSTOMIZE && !backgroundUrl) {
              return {
                name: 'EmptyCustomPoster',
                message: '请选择自定义背景图',
              };
            }
          },
        ],
      },
    ],
  };
};

export default BaseInfo;
