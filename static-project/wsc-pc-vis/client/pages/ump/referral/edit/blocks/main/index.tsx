import React, { FC, useState, useEffect, useCallback, useRef, useMemo, useContext } from 'react';
import { hashHistory } from 'react-router';
import { ErrorBoundary, BlockLoading, Notify, Form } from 'zent';
import { ZentForm } from 'zent/es/form/ZentForm';
import { EasyFormArchive } from '@youzan/ebiz-components';
import { IFormCreatorConfig } from '@youzan/ebiz-components/es/types/easy-form-archive';
import { isBranchStore, isHqStore } from '@youzan/utils-shop';
import isNil from 'lodash/isNil';

import { clickTracker, EventTypeEnum } from 'components/logger';
import { Context, editType } from '../../context';
import BaseInfo from '../base-info';
import ActiveObject from '../active-object';
import ActivityAward from '../activity-award';
import BottomActions from '../bottom-actions';
import { crateReferralActive, updateReferralActive, getCompusAPI } from '../../../api/edit';
import { getDetailByActivityId } from '../../../api/list';
import {
  checkRewardContentIsValid,
  checkGoodsPriceEqualsZero,
  formData2submitData,
  submitData2formData,
} from '../../utils';
import { UPDATE_STATE, DEFAULT_SHOP_INFO_VALUE, TRACK_REFERRAL_CREATE } from '../../../constants';
import { EventStatus } from '../../../types';

import { pctCheck } from 'fns/auth';

const { EasyForm } = EasyFormArchive;

interface IMainProps {
  id?: string;
  editType: editType; // easyform使用context中取得的值作为deps时会导致form结构为{}
  pageStatus?: EventStatus;
}

const { ValidateOption } = Form;

const VALIDATE_OPTION = ValidateOption.IncludeUntouched | ValidateOption.IncludeChildrenRecursively;

const Main: FC<IMainProps> = (props) => {
  const { id, editType, pageStatus } = props;
  const isDetail = editType === 'detail';
  const isCopy = editType === 'copy';
  const isEdit = editType === 'edit';

  const { dispatch } = useContext(Context);

  const [loading, toggleLoading] = useState(false);
  const [btnLoading, toggleBtnLoading] = useState(false);

  const formRef = useRef<ZentForm<any> | null>(null);

  const isDisableConfirmBtn = useMemo(
    () =>
      isDetail ||
      isBranchStore ||
      (!isCopy && (pageStatus === EventStatus.ENDED || pageStatus === EventStatus.INVALID)),
    [pageStatus, isCopy, isDetail],
  );

  const disableName = useMemo(
    () =>
      isEdit &&
      ((pageStatus !== EventStatus.NOT_STARTED && pageStatus !== EventStatus.PROCESS) ||
        isBranchStore),
    [pageStatus, isEdit],
  );

  const disableGoods = useMemo(
    () => isEdit && (pageStatus !== EventStatus.NOT_STARTED || isBranchStore),
    [pageStatus, isEdit],
  );

  const disableTime = useMemo(
    () =>
      isBranchStore || isDetail
        ? [true, true]
        : [
          isEdit && pageStatus !== EventStatus.NOT_STARTED,
          isEdit &&
            (pageStatus === EventStatus.ENDED || pageStatus === EventStatus.INVALID),
        ],
    [pageStatus, isDetail, isEdit],
  );

  // WARNING: 务必保持 config 引用不变，否则获取到的 Form 实例字段会为空
  const config: IFormCreatorConfig[] = useMemo(
    () => [
      BaseInfo({ isDetail, disableName, disableGoods, disableTime }),
      ActiveObject({ disabled: isDetail || disableGoods }),
      ActivityAward({
        id: id,
        disableGoods,
        disabled: isDetail || disableGoods,
      }),
    ],
    [disableGoods, disableName, disableTime, id, isDetail],
  );

  useEffect(() => {
    if (id && (isEdit || isCopy || isDetail)) {
      toggleLoading(true);
      getDetailByActivityId({ activityId: Number(id) })
        .then(async (res) => {
          const designatedKdtIds = res.designatedKdtIds || [];
          let shopInfo = DEFAULT_SHOP_INFO_VALUE;

          if (isHqStore && res.designateType === 2) {
            shopInfo = await getCompus(res.designateType, designatedKdtIds);
          } else {
            shopInfo = {
              applicableCampusList: [],
              applicableCampusType: 1,
            };
          }

          res.shopInfo = shopInfo;

          const parsedFormData = submitData2formData(res);

          if (parsedFormData) {
            formRef.current && formRef.current.initialize({
              commissionRewardType: parsedFormData.commissionRewardType
            });
            // 编辑时，先决定分佣奖励的类型后再patchValue，防止直接初始化所有值导致佣金金额没有被设置
            formRef.current &&
              formRef.current.patchValue(
                editType === 'copy'
                  ? { ...parsedFormData, time: [] } // 如果为复制
                  : parsedFormData,
              );
          }

          if (editType === 'copy') {
            formRef.current && formRef.current.validate(VALIDATE_OPTION);
          }
        })
        .catch((e) => Notify.error(e || '获取详情信息失败，请稍后重试'))
        .finally(() => toggleLoading(false));
    }
  }, [editType, id, isCopy, isDetail, isEdit]);

  const getCompus = async (designateType, designatedKdtIds) => {
    const res = await getCompusAPI({
      isAllCampus: designateType === 1,
      campusKdtIds: designatedKdtIds,
    });

    const campus = res.map((campu) => {
      const { province, city, county, address } = campu.address || {};
      const wholeAddress = `${province}${city}${county}${address}`;
      return Object.assign({}, campu, { address: wholeAddress });
    });

    return {
      applicableCampusType: designateType === 2 ? 0 : 1,
      applicableCampusList: campus,
    };
  };

  const scrollIntoFirstError = () => {
    try {
      const formErrorDom = document.querySelectorAll('form .zent-form-error');
      if (formErrorDom) {
        let ele = formErrorDom[0] as any;
        while (ele) {
          ele = ele.parentNode;
          /** 注意：所有存在错误提示的字段请手动在该字段父容器上添加 form-error-control 类名，以便校验未通过时能滚动到对应的字段 */
          if (ele && ele.nodeType === 1 && ele.className.includes('form-error-control')) {
            ele.scrollIntoView();
            break;
          }
        }
      }
    } catch (err) {}
  };

  const handleSubmit = useCallback(() => {
    if (isEdit && !id) {
      Notify.error('编辑活动，id不能为空，请返回列表重试');
      return;
    }

    if (formRef.current) {
      toggleBtnLoading(true);
      dispatch({
        type: UPDATE_STATE,
        payload: {
          formSubmitted: true,
        },
      });

      formRef.current
        .validate(VALIDATE_OPTION)
        .then((errors) => errors.findIndex((item) => !isNil(item)))
        .then((firstErrorIndex) => {
          const formData = formRef.current?.getValue() as any;
          const { phasedRewardDetails, rewardSettings, courseSelect } = formData;
          // 校验奖励设置
          if (
            checkGoodsPriceEqualsZero({
              rewardSettings: rewardSettings || [],
              courseSelect: courseSelect || {},
            }) ||
            (Array.isArray(phasedRewardDetails) &&
              (!phasedRewardDetails.length || !checkRewardContentIsValid(phasedRewardDetails)))
          ) {
            scrollIntoFirstError();
            return;
          }

          if (firstErrorIndex === -1) {
            return formData2submitData(formData);
          }
          scrollIntoFirstError();
          return undefined;
        })
        .then((params) => {
          // 如果表单提交有错误
          if (!params) {
            return;
          }

          return isEdit
            ? updateReferralActive({ ...params, id: Number(id) })
            : crateReferralActive(params);
        })
        .then((res) => {
          if (!res) return;

          if (!isEdit) {
            clickTracker({
              eventName: '创建活动',
              eventSign: 'referral_create',
              pageType: TRACK_REFERRAL_CREATE,
              otherParams: {
                eventType: EventTypeEnum.ADD,
              },
            });
          }
          Notify.success(`${isEdit ? '编辑' : '创建'}成功`);
          hashHistory.goBack();
        })
        .catch((e) => {
          Notify.error(e || '提交表单失败，请稍后重试');
        })
        .finally(() => {
          toggleBtnLoading(false);
        });
    } else {
      Notify.error('无法获取表单数据，请刷新后重试');
    }
  }, [dispatch, id, isEdit]);

  const submitWrapper = useCallback(() => {
    pctCheck()
      .then(() => {
        handleSubmit();
      })
      .catch(() => {});
  }, [handleSubmit]);

  return (
    <div className="form-wrapper app-design">
      <ErrorBoundary>
        <BlockLoading loading={loading}>
          <EasyForm
            ref={(form) => {
              formRef.current = form;
            }}
            config={config}
            layout="horizontal"
          />
        </BlockLoading>
      </ErrorBoundary>
      {BottomActions({ disabled: isDisableConfirmBtn, btnLoading, onSubmit: submitWrapper })}
    </div>
  );
};

export default Main;
