import React, { FC, useState, useEffect, useCallback, useMemo, useRef, useContext } from 'react';
import { ErrorBoundary, Disabled, BlockLoading, Notify, Form } from 'zent';
import { ZentForm } from 'zent/es/form/ZentForm';
import { EasyFormArchive } from '@youzan/ebiz-components';
import { IFormCreatorConfig } from '@youzan/ebiz-components/es/types/easy-form-archive';
import isNil from 'lodash/isNil';
import buildUrl from '@youzan/utils/url/buildUrl';
import { abilityCheck } from 'fns/auth/ability-check-status';

import { Context, editType } from '../../context';
import BaseInfo from '../base-info';
import EventSettings from '../event-settings';
import BottomActions from '../bottom-actions';
import { create, getTuitionOffsetDetailById, edit, findProductsWithSku } from '../../../api/edit';
import { formData2submitData, submitData2formData, parsePriceRange } from '../../utils';
import { EventCourseType } from '../../types';
import { EventStatus } from '../../../types';

import { APPID, AbilityCode, AppName } from '../../../constants';

import './styles.scss';

const { EasyForm } = EasyFormArchive;

interface IMainProps {
  id?: string;
  editType: editType; // easyform使用context中取得的值作为deps时会导致form结构为{}, 只能从props中传入
  pageStatus?: EventStatus;
}

const { ValidateOption } = Form;

const VALIDATE_OPTION = ValidateOption.IncludeUntouched | ValidateOption.IncludeChildrenRecursively;

const Main: FC<IMainProps> = (props) => {
  const { id, editType, pageStatus } = props;
  const { state, dispatch } = useContext(Context);

  const [loading, toggleLoading] = useState(false);
  const [btnLoading, toggleBtnLoading] = useState(false);

  const isEdit = useMemo(() => editType === 'edit', [editType]);
  const isDetail = useMemo(() => editType === 'detail', [editType]);
  const isCopy = useMemo(() => editType === 'copy', [editType]);
  const isEventEnded = pageStatus === EventStatus.ended;

  const formRef = useRef<ZentForm<any> | null>(null);

  const config: IFormCreatorConfig[] =
    useMemo(() => [
      {
        keyName: 'base-info',
        component: ({ children }) => (
          <div className="form-block">
            <h2 className="new-title">基础信息</h2>
            {children}
          </div>
        ),
        children: BaseInfo({ editType, id, eventStatus: pageStatus }),
      },
      {
        keyName: 'event-settings',
        component: ({ children }) => (
          <div className="form-block">
            <h2 className="new-title">活动规则</h2>
            {children}
          </div>
        ),
        children: EventSettings({ editType, eventStatus: pageStatus }),
      },
    ], [id, editType, pageStatus]);

  useEffect(() => {
    if (id && !state.alias && editType !== 'add' && editType !== 'initial') {
      toggleLoading(true);
      getTuitionOffsetDetailById({ id })
        .then(async res => {
          if (res) {
            if (res.rangeType === EventCourseType.partial && res.goodsIds.length > 0) {
              await findProductsWithSku({
                query: {
                  goodsIds: res.goodsIds,
                  resortByCreateAtDesc: false,
                },
              })
                .then(data => {
                  if (data) {
                    res.goodsIds = data.map(goodsItem => {
                      const priceList = goodsItem.skuList
                        ? goodsItem.skuList
                          .map(sku => sku.price)
                          .sort((a: number, b: number) => a - b)
                        : [];
                      return {
                        goodsId: goodsItem.goodsId,
                        goodsName: goodsItem.title,
                        goodsImage: goodsItem.cover,
                        goodsDetailUrl: buildUrl(
                          `https://h5.youzan.com/wscgoods/detail/${goodsItem.goodsAlias}?fromStore=true`,
                          '',
                          _global.kdtId,
                        ),
                        goodsPrice: goodsItem.skuList && goodsItem.skuList.length > 1 // 商品包含sku规格，且规格超过1种
                          ? parsePriceRange(priceList)
                          : goodsItem.price,
                        goodsSkuInfo: goodsItem.skuList.map(sku => sku.skuDesc),
                        skuCnt: (goodsItem.skuList && goodsItem.skuList.length) || 0,
                      };
                    });
                  }
                })
                .catch(e => {
                  Notify.error(e || '获取已选课程商品详情失败，请刷新重试');
                });
            }
          }
          return res;
        })
        .then(res => {
          const parsedFormData = submitData2formData(res);
          formRef.current && formRef.current.initialize(
            isCopy
              ? { ...parsedFormData, time: [] } // 如果为复制
              : parsedFormData
          );
          if (isCopy) {
            formRef.current && formRef.current.validate(VALIDATE_OPTION);
          }
          if (!state.alias && res.alias) {
            dispatch({
              type: 'UPDATE_STATE',
              payload: {
                alias: res.alias,
              }
            });
          }
          if (isEdit && pageStatus === EventStatus.ended) { // 如果进入页面的时候发现活动已经结束了
            history.replaceState(null, '', `/v4/vis/ump/tuition-offset#/detail/${id}`); // history操作避免触发effect
          }
        })
        .catch(e => {
          Notify.error(e || '获取详情信息失败，请稍后重试');
        })
        .finally(() => {
          toggleLoading(false);
        });
    }
  }, [id, state.alias, editType, dispatch, isCopy, isEdit, pageStatus]);

  const handleSuccess = useCallback(({ id }) => {
    dispatch({
      type: 'UPDATE_STATE',
      payload: {
        showSuccessPage: true,
        id,
      },
    });
  }, [dispatch]);

  // const onSubmit = useCallback(() => {
  //   formRef.current && formRef.current.submit();
  // }, []); // 这种方法不会正确触发scrollToError

  const handleSubmit = useCallback(() => {
    const isEdit = editType === 'edit';
    if (isEdit && !id) {
      Notify.error('编辑活动，id不能为空，请返回列表重试');
      return;
    }

    if (formRef.current) {
      toggleBtnLoading(true);
      dispatch({
        type: 'UPDATE_STATE',
        payload: {
          formSubmitted: true,
        },
      });

      formRef.current
        .validate(VALIDATE_OPTION)
        .then((errors) => errors.findIndex(item => !isNil(item)))
        .then((firstErrorIndex) => {
          if (firstErrorIndex === -1) {
            const data = formRef.current && formRef.current.getValue();
            return formData2submitData(data);
          }
          // 手动触发
          try {
            document.querySelectorAll('form .zent-form-control')[firstErrorIndex].scrollIntoView();
          } catch (err) {}
          return undefined;
        })
        .then(params => {
          if (!params) { // 如果表单提交有错误
            return;
          }

          return isEdit
            ? edit({ params: { ...params, id: Number(id) } })
            : create({ params });
        })
        .then(res => {
          if (res) {
            if (!isEdit) { // 如果是新建
              history.replaceState(null, '', `/v4/vis/ump/tuition-offset#/add/${res}`); // history操作避免触发effect
            }
            handleSuccess({ id: isEdit ? id : res });
          }
        })
        .catch(e => {
          Notify.error(e || '提交表单失败，请稍后重试');
        })
        .finally(() => {
          toggleBtnLoading(false);
        });
    } else {
      Notify.error('无法获取表单数据，请刷新后重试');
    };
  }, [editType, handleSuccess, id, dispatch]);

  const saveCheck = useCallback(() => {
    abilityCheck({
      abilityCode: AbilityCode,
      appId: APPID,
      name: AppName
    }).then(() => {
      handleSubmit();
    });
  }, [handleSubmit]);

  return (
    <div className="form-wrapper app-design">
      <ErrorBoundary>
        <Disabled value={(isEdit && pageStatus && isEventEnded) || isDetail}>
          <BlockLoading loading={loading}>
            <EasyForm
              ref={form => { formRef.current = form; }}
              config={config}
              layout="horizontal"
            />
          </BlockLoading>
        </Disabled>
      </ErrorBoundary>
      {BottomActions({ disabled: (isEdit && isEventEnded) || isDetail, btnLoading, onSubmit: saveCheck })}
    </div>
  );
};

export default Main;
