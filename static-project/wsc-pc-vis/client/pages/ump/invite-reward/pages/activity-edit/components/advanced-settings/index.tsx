import { Pop } from '@zent/compat';
import React, { FC, useRef, useCallback, useState } from 'react';
import { FormRadioGroupField, Radio, Icon } from 'zent';
import { Img } from '@youzan/ebiz-components';
import PosterSelectField from '../poster-select-field';
import OldStudentPosterField from '../old-student-poster-field';
import RichTextField from '../rich-text-field';
import RuleField from '../rule-field';
import { IFormCreatorConfig } from '@youzan/ebiz-components/es/types/easy-form-archive';

import { oldStudentPoster, ShowJoinNum } from '../../../../types';

const { ImgWrap } = Img;

const AdvancedSettingsConfig = ({
  getDisabled,
  changeHasRuleInput,
}: {
  getDisabled: (name: string) => boolean;
  changeHasRuleInput: () => void;
}): IFormCreatorConfig[] => [
  {
    label: '活动页风格：',
    name: 'posterStyle',
    required: '请选择活动页风格',
    component: PosterSelectField,
    defaultValue: 1,
    props: () => ({
      disabled: getDisabled('posterStyle')
    })
  },
  {
    label: '老学员海报：',
    name: 'oldStudentPoster',
    required: '请选择老学员海报',
    component: OldStudentPosterField,
    defaultValue: {
      list: [oldStudentPoster.default],
    },
    props: () => ({
      disabled: getDisabled('oldStudentPoster'),
    }),
    validators: [
      val => {
        const { list, upload } = val;
        if (!list || list.length === 0) {
          return {
            name: 'EmptyOldStudentPoster',
            message: '请选择老学员海报',
          };
        }
        if (list && list.includes(oldStudentPoster.custom) && (!upload || upload.length === 0)) {
          return {
            name: 'EmptyCustomPoster',
            message: '请选择自定义背景图',
          };
        }
      },
    ],
  },
  {
    label: '活动规则：',
    name: 'rule',
    required: '请填写活动规则',
    component: RuleField,
    props: () => ({
      disabled: getDisabled('rule'),
      changeHasRuleInput,
    }),
  },
  {
    label: '机构介绍：',
    name: 'constitutionDesc',
    component: RichTextField,
    type: 'field',
    fieldProps() {
      return {
        editorConfig: {
          readonly: getDisabled('constitutionDesc'),
          wordCount: false,
          initialFrameWidth: 600,
        },
      };
    },
  },
  {
    label: '活动参与人数：',
    name: 'showJoinNum',
    required: true,
    type: 'field',
    defaultValue: ShowJoinNum.TRUE,
    className: 'form-joinnum-field',
    component: FormRadioGroupField,
    props: () => ({
      props: {
        disabled: getDisabled('showJoinNum')
      }
    }),
    children: [
      {
        component: () => (
          <>
            <Radio value={ShowJoinNum.TRUE}>展示</Radio>
            <Radio value={ShowJoinNum.FALSE}>不展示</Radio>
          </>
        ),
      },
    ],
    helpDesc: '该数据是指用户端页面浏览量，不是实际参与人数，主要是为了烘托活动氛围营造出很多人参与的感觉，引导用户参与',
  },
  {
    label: '活动页推荐商品：',
    name: 'showRecommendGoods',
    required: true,
    type: 'field',
    defaultValue: 1,
    className: 'form-joinnum-field',
    component: FormRadioGroupField,
    props: () => ({
      props: {
        disabled: getDisabled('showRecommendGoods')
      }
    }),
    children: [
      {
        component: () => (
          <>
            <Radio value={1}>
              展示
              <Pop
                trigger="hover"
                content={
                  <div className="example-pop">
                    <div className="groups">
                      <ImgWrap
                        width="200px"
                        height="504px"
                        src="https://b.yzcdn.cn/public_files/63ada232810d1fa9646f8bb2dd7cf397.jpg"
                        alt="图片示例"
                        backgroundColor="#FFF"
                      />
                    </div>
                  </div>
                }
              >
                <span
                  style={{
                    paddingLeft: '15px',
                  }}
                  className="default-background-example ml-8"
                >
                  查看示例
                </span>
              </Pop>
            </Radio>
            <Radio value={0}>不展示</Radio>
          </>
        ),
      },
    ],
  },
];

interface IProps {
  childrens: any;
}

const AdvancedHeader: FC<IProps> = ({ childrens }) => {
  const advancedSettingsRef = useRef<HTMLDivElement | null>(null);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const handleShowAdvancedSettings = useCallback(() => {
    setShowAdvanced(val => !val);
    setTimeout(() => {
      advancedSettingsRef && advancedSettingsRef.current!.scrollIntoView(true);
    }, 300);
  }, []);
  return (
    <div className="form-block">
      <h2 className="form-block-header" ref={advancedSettingsRef}>
        高级设置
        <span className="more" onClick={handleShowAdvancedSettings}>
          {showAdvanced ? (
            <>
              <span className="text">收起</span>
              <Icon type="up" />
            </>
          ) : (
            <>
              <span className="text">展开</span>
              <Icon type="down" />
            </>
          )}
        </span>
      </h2>
      <div className={`${showAdvanced ? '' : 'hidden-field'}`}>
        {childrens}
      </div>
    </div>
  );
};

const AdvancedSettings = ({ getDisabled, changeHasRuleInput }) => {
  return {
    component: ({ children }) => (
      <AdvancedHeader
        childrens={children}
      />
    ),
    keyName: 'advanced-settings',
    children: AdvancedSettingsConfig({ getDisabled, changeHasRuleInput }),
  };
};

export default AdvancedSettings;
