import { Pop, Form } from '@zent/compat';
import React, { FC, useEffect, useState, useCallback, useMemo } from 'react';
import SessionStorage from '@youzan/utils/browser/session_storage';
import {
  Notify,
  BlockLoading,
  FormControl,
  Checkbox,
  RadioGroup,
  Radio,
  IRadioEvent,
} from 'zent';
import { Operations, BlankLink } from '@youzan/react-components';
import { isEduShop } from '@youzan/utils-shop';
import { isInStoreCondition } from 'fns/chain';

import InfoCollectionBox from './InfoCollectionBox';

import { getInfoCollectionSettingsByAlias } from './api';
import {
  IInfoCollectionProps,
  IInfoCollectionValues,
  IAttributeDTO,
  BooleanLike,
  NeedVerifyCodeEnum,
  CollectPageTypeEnum,
} from './types';
import constants from './constants';
import './style.scss';

const { getControlGroup } = Form;
const ADD_PROFILE_HREF = window._global.isYZEdu
  ? `${window._global.url.v4}/vis/edu/settings/student-profile#/list?action=OPEN_NEW`
  : `${window._global.url.v4}/scrm/setting/diyCustomerInfo?addType=custom`;

const InfoCollection: FC<IInfoCollectionProps> = (props) => {
  const {
    value,
    onChange,
    renderItem,
    formatItems,
    expandLimit,
    enableSessionStorage = true,
    showRecordsLink = true,
    showInClue = false,
    infoCollectHelpDesc,
    showDesc = true,
    sceneId = 6, // 场景值id默认值为6
    isCoursePage = false,
    disabled,
  } = props;
  const [loading, setLoading] = useState(false);
  const [infoCollectionSettings, setSettings] = useState<IAttributeDTO[]>([]);
  const [passiveValues, setPassiveValues] = useState<IInfoCollectionValues>(value);
  const [isSelectPhone, setIsSelectPhone] = useState(false);
  const [inClueState, setInClueState] = useState<BooleanLike>(
    (showInClue && value.inClue) || BooleanLike.False,
  );

  const collectInfoOperationItems = useMemo(() => {
    let items: React.ReactNode[] = [];
    if (showRecordsLink) {
      items.push(
        <BlankLink
          key="viewRecord"
          href={isEduShop ? '/v4/vis/pct/page/record' : '/v4/vis/pct/page/tabs#/order'}>
            查看采集记录
        </BlankLink>
      );
    }

    if (showDesc && !isCoursePage) {
      items.unshift(
        <Preview key="preview" imgUrl={constants.PREVIEW_IMAGE} />
      );
    }

    return items;
  }, [isCoursePage, showDesc, showRecordsLink]);

  const handleCollectInfoChange = useCallback((values: number[], settings: IAttributeDTO[]) => {
    if (!isCoursePage) return;

    let selectedPhone = false;
    const PHONE_ITEM = settings.find(s => s.attributeKey === 'edu_stuContractPhone');
    if (PHONE_ITEM) {
      selectedPhone = values.includes(PHONE_ITEM.attributeId);
    }

    setIsSelectPhone(selectedPhone);

    if (!selectedPhone) {
      // 未选择手机号时重置手机号配置
      setPassiveValues((prevPassiveValues) => ({
        ...prevPassiveValues,
        needVerifyCode: NeedVerifyCodeEnum.UNNEED,
      }));
    }
  }, [isCoursePage]);

  const fetch = useCallback(() => {
    setLoading(true);
    getInfoCollectionSettingsByAlias({ sceneId })
      .then((res) => {
        if (res.length > 0) {
          const settings = formatItems ? formatItems(res) : res;
          setSettings(settings);
        }
      })
      .catch((err) => {
        Notify.error(err);
      })
      .finally(() => setLoading(false));
  }, [formatItems, sceneId]);

  const handleInfoCollectionBoxChange = useCallback<(values: number[]) => void>(
    (values) => {
      handleCollectInfoChange(values, infoCollectionSettings);
      enableSessionStorage && SessionStorage.setItem('tempInfoCollect', values);
      setPassiveValues((prevPassiveValues) => ({
        ...prevPassiveValues,
        customizeItems: values || [],
      }));
    },
  [enableSessionStorage, handleCollectInfoChange, infoCollectionSettings],
  );

  const handleNeedVerifyCodeChange = useCallback<(e: IRadioEvent<NeedVerifyCodeEnum>) => void>(
    (value) => {
      setPassiveValues((prevPassiveValues) => ({
        ...prevPassiveValues,
        needVerifyCode: value.target.value,
      }));
    },
  [],
  );

  const handleCollectPageTypeChange = useCallback<(e: IRadioEvent<CollectPageTypeEnum>) => void>(
    (value) => {
      setPassiveValues((prevPassiveValues) => ({
        ...prevPassiveValues,
        collectPageType: value.target.value,
      }));
    },
  [],
  );

  const triggerInClueState = useCallback(() => {
    setInClueState((prevClueState) => {
      const curClueState =
        prevClueState === BooleanLike.False ? BooleanLike.True : BooleanLike.False;
      setPassiveValues((prevPassiveValues) => ({
        ...prevPassiveValues,
        inClue: curClueState,
      }));
      return curClueState;
    });
  }, []);

  useEffect(fetch, []);
  useEffect(() => {
    onChange(passiveValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passiveValues]);

  const tempValue = enableSessionStorage && SessionStorage.getItem('tempInfoCollect');
  return (
    <BlockLoading loading={loading}>
      {/* ====================== 显示信息 ======================  */}
      {infoCollectionSettings && infoCollectionSettings.length > 0 && (
        <InfoCollectionBox
          render={renderItem}
          isInClue={inClueState}
          expandLimit={expandLimit}
          tempValue={tempValue || ''}
          value={value.customizeItems || []}
          onChange={handleInfoCollectionBoxChange}
          attributeItems={infoCollectionSettings}
          disabled={disabled}
        />
      )}
      <Operations
        className="info-collect__line info-collect__ops"
        items={
          isInStoreCondition({
            supportHqStore: true,
            supportSingleStore: true,
            supportRetailSingleShop: true
          })
            ? [
              <a
                key="add"
                target="_blank"
                rel="noreferrer noopener"
                className="cursor-link"
                href={ADD_PROFILE_HREF}
              >
              添加自定义字段
              </a>,
              <div key="refresh" className="cursor-link" onClick={fetch}>
              刷新
              </div>,
            ]
            : [
              <div key="refresh" className="cursor-link" onClick={fetch}>
              刷新
              </div>
            ]
        }
      />
      {showDesc ? (
        <div className="info-collect__line info-collect__preview">
          <span>
            {infoCollectHelpDesc ||
              '信息采集是设置客户在支付、领取时需填写的信息，不建议设置过多。'}
          </span>
          <Operations items={collectInfoOperationItems} />
        </div>
      ) : null}

      {/* ====================== 手机号配置 ======================  */}
      {
        isCoursePage && isSelectPhone && (
          <FormControl label="手机号配置：" className="info-collect__extra">
            <RadioGroup onChange={handleNeedVerifyCodeChange} value={value.needVerifyCode}>
              <Radio value={NeedVerifyCodeEnum.NEED}>需要验证码</Radio>
              <Radio value={NeedVerifyCodeEnum.UNNEED}>无需验证码</Radio>
            </RadioGroup>
            <div className="info-collect__preview info-collect__desc">
              <span>发送短信的费用，将从你的短信额度中扣除。</span>
              <Operations
                items={[
                  <BlankLink
                    key="viewMessage"
                    href={`${_global.url.v4}/message/messagepush#/messagegroup`}>
                      查看剩余短信数量
                  </BlankLink>,
                ]}
              />
            </div>
          </FormControl>
        )
      }

      {/* ====================== 采集页面 ======================  */}
      {
        isCoursePage && (
          <FormControl label="采集页面：" className="info-collect__extra">
            <RadioGroup
              onChange={handleCollectPageTypeChange}
              value={value.collectPageType}
              className="info-collect__extra__page-type"
            >
              <div>
                <Radio value={CollectPageTypeEnum.BEFORE_PURCHASE}>
                  订单提交页(购买前)
                </Radio>
                <span className="info-collect__preview">
                  <Operations
                    items={
                      [<Preview key="preview" imgUrl={constants.PREVIEW_BEFORE_PURCHASE_IMAGE} />]
                    }
                  />
                </span>
              </div>
              <div>
                <Radio value={CollectPageTypeEnum.AFTER_PURCHASE}>
                  课程详情页(购买后)
                </Radio>
                <span className="info-collect__preview">
                  <Operations
                    items={
                      [<Preview key="preview" imgUrl={constants.PREVIEW_AFTER_PURCHASE_IMAGE} />]
                    }
                  />
                </span>
              </div>
            </RadioGroup>
          </FormControl>
        )
      }

      {/* ====================== 进入线索 ======================  */}
      {showInClue && (
        <FormControl label="进入线索：" className="info-collect__extra">
          <Checkbox
            value="inClue"
            onChange={triggerInClueState}
            checked={inClueState === BooleanLike.True}
            disabled={disabled}
          >
            开启
          </Checkbox>
          <div className="info-collect__preview info-collect__desc">
            <span>{infoCollectHelpDesc || '选择开启，则信息采集的信息会进入线索，且学员姓名、手机号是必填字段。'}</span>
          </div>
        </FormControl>
      )}
    </BlockLoading>
  );
};

const Preview: FC<{ key: string, imgUrl: string }> = ({ imgUrl }) => (
  <Pop
    trigger="click"
    position="auto-bottom-center"
    content={<img width="400" src={imgUrl} alt="信息采集预览.png" />}
  >
    <div className="cursor-link">查看示例</div>
  </Pop>
);

export default getControlGroup(InfoCollection);
export { constants, NeedVerifyCodeEnum, CollectPageTypeEnum };
