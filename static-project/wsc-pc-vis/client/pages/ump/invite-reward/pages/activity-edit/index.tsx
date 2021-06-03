import React, { FC, useMemo, useLayoutEffect, useCallback, useRef, useState } from 'react';
import { Disabled, ErrorBoundary, Notify, BlockLoading } from 'zent';
import qs from 'querystring';
import { ZentForm } from 'zent/es/form/ZentForm';
import { EasyFormArchive } from '@youzan/ebiz-components';
import { date } from '@youzan/utils';
import { IFormCreatorConfig } from '@youzan/ebiz-components/es/types/easy-form-archive';
import { RewardTypeEnum } from 'definitions/api/owl/pc/CommonActivityPCFacade/getRewardByPage';

import { SuccessPage } from './components/success-page';
import Preview, { IPreviewProps } from './components/preview';
import oldDataFormConfig from './components/old-form-config';
import OldPreview from './components/old-preview';
import formConfig from './components/form-config';

import { create, edit, getDetail } from '../../api';
import {
  IInviteRewardCreateCommand,
  NewStudentRewardDisplaySettingType,
  ActivityVersion,
} from '../../types';
import { canEditField } from '../../constants';
import { log } from '../../utils/logger';
import { getAbilitys } from '../../utils';

import {
  getEditType,
  getRule,
  getAwardNodeLabel,
  transAwards,
  transAwardItemToPost,
  transOldStuAwardsToPost,
  transOldStuAwardsFromGet,
  getAwardTip,
} from './utils';

import './style.scss';

const { EasyForm } = EasyFormArchive;
interface ActivityEditProps {
  route: {
    path: string;
  };
  params: {
    id: string;
  };
  router: {
    push: (path: string) => void;
  };
  location: {
    search: string;
  };
}

let startTime = 0;
let ruleHasInput = false;

export const ActivityEdit: FC<ActivityEditProps> = ({
  route: { path },
  params: { id },
  location: { search = '' },
}) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [alias, setAlias] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewState, setPreviewState] = useState<IPreviewProps>({
    posterStyle: 1,
    oldStudentAwardName: '',
    oldStudentAwardLabel: '',
    newStudentRewardDisplaySetting: {
      type: NewStudentRewardDisplaySettingType.priceAndTitle,
      price: 3000,
      priceLabel: '课程大礼包',
      title: '',
    },
    newStudentRewardSetting: {
      couponList: [],
      presentList: [],
      newStudentRewardSettingType: 1,
      friendHelpTotalNum: 0,
    },
    time: [],
    constitutionDesc: '',
    showJoinNum: 1,
    oldStudentPoster: {
      list: [1],
      upload: [],
    },
  });
  const [formHasSubmit, setFormHasSubmit] = useState(false);

  const abilitys = useMemo(() => {
    return getAbilitys();
  }, []);

  const formRef = useRef<ZentForm<any>>();
  const editType = getEditType(path);
  const queryObj = qs.parse(search.substr(1)) || {};
  const { version = ActivityVersion.two } = queryObj;
  const activityVersion = Number(version);

  const scrollIntoFirstError = useCallback(() => {
    try {
      const formErrorDom = document.querySelectorAll('form .zent-form-error');
      if (formErrorDom) {
        let ele = formErrorDom[0] as any;
        while (ele) {
          ele = ele.parentNode;
          if (ele && ele.nodeType === 1) {
            ele.scrollIntoView();
            break;
          }
        }
      }
    } catch (err) {}
  }, []);

  const handleClickSubmitBtn = useCallback(() => {
    setFormHasSubmit(true);
    setTimeout(() => {
      scrollIntoFirstError();
    }, 0);
  }, [scrollIntoFirstError]);

  const handleSubmit = useCallback(
    (form: ZentForm<any>) => {
      setLoading(true);
      const value = form.getValue();
      const {
        name,
        time,
        newStudentRule,
        newStudentRewardSetting: {
          newStudentRewardSettingType,
          friendHelpTotalNum = 0,
          couponList = [],
          presentList = [],
        },
        newStudentRewardDisplaySetting: { type, price, priceLabel, title },
        newStudentInfoCollectSetting: {
          infoCollect: { customizeItems = [] },
          needVerifyCode = 0,
        },
        oldStudentRule,
        oldStudentAwards,
        posterStyle: pageStyle,
        showRecommendGoods,
        oldStudentPoster,
        constitutionDesc: organizationDesc,
        showJoinNum,
        rule,
      } = value as any;
      let newStudentAwardList = [
        ...transAwardItemToPost(couponList, RewardTypeEnum.COUPON),
        ...transAwardItemToPost(presentList, RewardTypeEnum.PRESENT),
      ];
      const newStudentAwardDesc = {
        awardValueDesc: priceLabel,
        awardTotalValue: price,
        descriptionMode: type,
        freestyleDesc: title,
      };
      const params: IInviteRewardCreateCommand = {
        copy: editType === 'copy' ? 1 : 0,
        introductionInfo: {
          baseInfoSetting: {
            name,
            startAt: date.makeDateTimeStr(time[0]),
            endAt: date.makeDateTimeStr(time[1]),
          },
          ruleSetting: {
            newStudentRewardSettingType,
            friendHelpTotalNum,
            newStudentRule,
            newStudentInfoCollectSetting: {
              attributeIds: customizeItems,
              needVerifyCode,
            },
            oldStudentRule,
            oldStudentAwards: transOldStuAwardsToPost(oldStudentAwards),
            newStudentAward: {
              awards: newStudentAwardList,
              awardDesc: newStudentAwardDesc,
              awardNode: newStudentRewardSettingType,
            },
          },
          newStudentPageSetting: {
            organizationDesc,
            showJoinNum,
          },
          advanceSetting: {
            pageStyle: pageStyle,
            showRecommendGoods,
            oldStudentPosterSetting: oldStudentPoster.list,
            customizePosters: oldStudentPoster.upload,
            activityRuleDesc: rule,
          },
        },
      };

      if (editType === 'edit') params.introductionInfo.id = +id;

      if (editType === 'add' || editType === 'copy') {
        create({ command: params })
          .then(newId => getDetail({ query: { id: newId } }))
          .then(newData => {
            setAlias(newData.alias);
            setTitle(newData.baseInfoSetting.name);
            setShowSuccess(true);

            log({
              et: 'custom',
              ei: 'create_activity',
              en: '创建活动',
              params: {
                showJoinNum,
                newStudentRewardType: newStudentRewardSettingType,
                name,
                alias: newData.alias,
              },
            });
          })
          .catch(err => {
            Notify.error(err);
          })
          .finally(() => {
            setLoading(false);
          });
      } else if (editType === 'edit') {
        edit({ command: params })
          .then(() => getDetail({ query: { id } }))
          .then(newData => {
            setAlias(newData.alias);
            setTitle(newData.baseInfoSetting.name);
            setShowSuccess(true);
          })
          .catch(err => {
            Notify.error(err);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    },
    [id, editType],
  );

  const updateRule = useCallback(awards => {
    if (ruleHasInput || editType !== 'add') return;
    formRef.current!.patchValue({
      rule: getRule(awards),
    });
  }, [editType]);

  const changeHasRuleInput = useCallback(() => {
    ruleHasInput = true;
  }, []);

  const formModelSubscribe = useCallback(fieldName => {
    const form = formRef.current;
    if (form) {
      const model = form.model.get(fieldName);
      model.value$.subscribe(fieldValue => {
        setPreviewState(prev => ({
          ...prev,
          [fieldName]: fieldValue,
        }));
      });
    }
  }, []);

  const subscribeEffect = useCallback(() => {
    const form = formRef.current;
    if (form) {
      if (activityVersion !== ActivityVersion.two) {
        formModelSubscribe('posterStyle');
        return;
      }
      formModelSubscribe('time');
      formModelSubscribe('posterStyle');
      formModelSubscribe('newStudentRewardSetting');
      formModelSubscribe('constitutionDesc');
      formModelSubscribe('showJoinNum');
      formModelSubscribe('oldStudentPoster');
      formModelSubscribe('newStudentRewardSetting');
      formModelSubscribe('newStudentRewardDisplaySetting');
      const oldStuentAwardsModel = form.model.get('oldStudentAwards');
      oldStuentAwardsModel.value$.subscribe(awards => {
        updateRule(awards);
        if (Object.keys(awards).length > 0) {
          let firstKey = Object.keys(awards)[0];
          let oldStudentAwardName = awards[firstKey].name;
          if (!oldStudentAwardName) {
            oldStudentAwardName = getAwardTip(awards[firstKey]);
          }
          let oldStudentAwardLabel = getAwardNodeLabel(firstKey);
          setPreviewState(prev => ({
            ...prev,
            oldStudentAwardLabel,
            oldStudentAwardName,
          }));
        }
      });
    }
  }, [activityVersion, updateRule, formModelSubscribe]);

  const getDisabled = useCallback(
    (fieldName: string) => {
      if (editType === 'detail') return true;
      if (editType === 'edit') {
        if (Date.now() > startTime && !canEditField.includes(fieldName)) return true;
      }
      return false;
    },
    [editType],
  );

  const initValue = useCallback(() => {
    if (id) {
      setLoading(true);
      getDetail({ query: { id } })
        .then(data => {
          const {
            baseInfoSetting: { name, startAt, endAt },
            ruleSetting: {
              friendHelpTotalNum,
              oldStudentRule,
              newStudentRule,
              oldStudentRewardRuleDesc,
              newStudentRewardRuleDesc,
              oldStudentAwards,
              newStudentInfoCollectSetting: { attributeIds, needVerifyCode },
              newStudentRewardSettingType,
              newStudentAward: { awards = [], awardDesc },
            },
            advanceSetting: {
              pageStyle,
              showRecommendGoods,
              oldStudentPosterSetting,
              customizePosters,
              activityRuleDesc,
            },
            newStudentPageSetting: { organizationDesc, showJoinNum },
          } = data;
          const { couponList, presentList } = transAwards(awards);
          setLoading(false);
          if (editType === 'edit') {
            startTime = startAt;
          }
          const initVal = {
            name,
            time: editType === 'copy' ? [] : [new Date(startAt), new Date(endAt)], // 复制时活动时间一定会重新选择
            newStudentRewardSetting: {
              newStudentRewardSettingType,
              friendHelpTotalNum,
              couponList,
              presentList,
              newStudentRewardRuleDesc
            },
            newStudentRewardDisplaySetting: {
              type: awardDesc.descriptionMode,
              price: awardDesc.awardTotalValue,
              priceLabel: awardDesc.awardValueDesc,
              title: awardDesc.freestyleDesc,
            },
            newStudentInfoCollectSetting: {
              infoCollect: { customizeItems: attributeIds },
              needVerifyCode,
            },
            oldStudentRule,
            newStudentRule,
            oldStudentRewardRuleDesc,
            oldStudentAwards: transOldStuAwardsFromGet(oldStudentAwards),
            posterStyle: pageStyle || 1,
            oldStudentPoster: {
              list: oldStudentPosterSetting,
              upload: customizePosters,
            },
            constitutionDesc: organizationDesc,
            showJoinNum,
            showRecommendGoods,
            rule: activityRuleDesc,
          };
          formRef.current!.initialize(initVal);
          if (editType === 'copy') {
            log({
              et: 'click',
              ei: 'copy_activity',
              en: '点击复制',
              params: {
                alias: data.alias,
                showJoinNum,
                newStudentRewardType: newStudentRewardSettingType,
                name,
              },
            });
          }
        })
        .catch(Notify.error);
    }
  }, [editType, id]);

  useLayoutEffect(() => {
    initValue();
    subscribeEffect();
  }, [editType, initValue, subscribeEffect]);

  const config: IFormCreatorConfig[] = useMemo(() => {
    if (activityVersion !== ActivityVersion.two) {
      return oldDataFormConfig(activityVersion);
    }
    return formConfig({
      showApplySchool: abilitys.chainStore && abilitys.introductionDataView,
      editType,
      getDisabled,
      changeHasRuleInput,
      id,
      handleClickSubmitBtn,
    });
  }, [
    activityVersion,
    abilitys.chainStore,
    abilitys.introductionDataView,
    editType,
    getDisabled,
    changeHasRuleInput,
    id,
    handleClickSubmitBtn,
  ]);

  return showSuccess ? (
    <SuccessPage title={title} alias={alias} action={editType === 'edit' ? '保存' : '新建'} />
  ) : (
    <div className={`activity-edit ${formHasSubmit ? 'has-submit' : ''}`}>
      {activityVersion !== ActivityVersion.two ? (
        <OldPreview posterStyle={previewState.posterStyle} />
      ) : (
        <Preview {...previewState} />
      )}
      <div className="form-wrapper">
        <ErrorBoundary>
          <Disabled value={editType === 'detail'}>
            <BlockLoading loading={loading}>
              <EasyForm
                ref={form => {
                  formRef.current = form;
                }}
                config={config}
                layout="horizontal"
                onSubmit={handleSubmit}
              />
            </BlockLoading>
          </Disabled>
        </ErrorBoundary>
      </div>
    </div>
  );
};
