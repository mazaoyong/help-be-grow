import { Pop } from '@zent/compat';
import React, { useState, useEffect, FC } from 'react';
import { FormField, BlockLoading, FormError, Notify } from 'zent';
import CKTDesign, { SCENES, ICKTDesignData, ICKTDesignProps } from '@youzan/ckt-design';
import { clickTracker } from 'components/logger';
import {
  useStore,
  useStoreByValidFlag,
  checkHasSelectedRelatedContent,
} from '../../store';
import { ENROLLMENT_POSTER_CREATE } from '../../contants';
import { VersionEnum } from '../../types';
const { open } = CKTDesign;

enum EditTypeEnum {
  ADD,
  EDIT,
}

interface IUploadContainerProps {
  disabled: boolean;
}
const UploadContainer: FC<IUploadContainerProps> = function(props) {
  const { disabled, children } = props;
  return disabled ? (
    <Pop trigger="hover" content="请先关联报名内容">
      {children}
    </Pop>
  ) : (
    <>{children}</>
  );
};
function FixedModelSelect() {
  const [loading, setLoading] = useState(false);
  const [lastQRCodeUrl, setLastQRCodeUrl] = useState('');
  const [isValid, setValid] = useStoreByValidFlag('fixedModelSelect');
  const [store, dispatch] = useStore();
  const { formData } = store;
  const { version, modelImageUrl = '', qrcode = '', designId: cktDesignId } = formData;
  const disabled = !checkHasSelectedRelatedContent(formData);

  useEffect(() => {
    if (modelImageUrl) {
      setValid(true);
    }
  }, [modelImageUrl, setValid]);

  const clickLogger = (editType: EditTypeEnum) => {
    clickTracker({
      eventName: '选择主题模板',
      eventSign: 'select_theme_template',
      pageType: ENROLLMENT_POSTER_CREATE,
      otherParams: {
        editType,
      },
    });
  };

  const onBeforeComplete = () => {
    setLoading(true);
  };
  const onComplete = (cktData: ICKTDesignData) => {
    setLoading(false);
    const { isCktImage, url, designId } = cktData;
    if (!isCktImage) {
      dispatch({
        formData: Object.assign({}, formData, { modelImageUrl: url, designId, version: VersionEnum.NEW }),
      });
    }
  };
  const handleItemDelete = () => {
    dispatch({
      formData: Object.assign({}, formData, { modelImageUrl: '', designId: '' }),
    });
  };
  const handleCKTClick = () => {
    if (disabled) return;
    const options: ICKTDesignProps = {
      beforeComplete: onBeforeComplete,
      afterComplete: onComplete,
      auth: true,
      chuangKitDesignOption: {
        show_history_design: 1,
      },
    };

    if (!modelImageUrl || qrcode !== lastQRCodeUrl) {
      options['qrcodeUrl'] = qrcode;
      setLastQRCodeUrl(qrcode);
    }

    if (cktDesignId && options.chuangKitDesignOption) {
      // TODO(meijign): 因之前接的是免费版本，没有用户的概念
      // 每次调起创客贴的编辑器，创客贴都会临时创建一个账号
      // 这期接入授权后，用户的账号是固定的，但之前免费版创建的设计图片不属于一个账号体系，导致没有权限编辑
      // 需要等待创客贴修复，先临时这么解
      if (version === VersionEnum.NEW) {
        options.chuangKitDesignOption['design_id'] = cktDesignId;
        clickLogger(EditTypeEnum.EDIT);
      } else {
        Notify.info('这个素材模板不支持再编辑啦，请重新创建1个新模板。');
        return;
      }
    } else {
      options['scene'] = SCENES.PHONE_POSTER_PRO;
      clickLogger(EditTypeEnum.ADD);
    }

    open(options);
  };

  return (
    <BlockLoading loading={loading}>
      <div className={`fixed-model-select${disabled ? ' dis' : ''}`}>
        {modelImageUrl ? (
          <div className="image-sortable__item">
            <img src={modelImageUrl} onClick={handleCKTClick} />
            <Pop
              trigger="click"
              content={<div>删除后需要重新创建模板，确认删除吗？</div>}
              onConfirm={() => handleItemDelete()}
              confirmText="确定"
              position="top-center"
              className="pop-delete"
            >
              <a className="close-modal small">×</a>
            </Pop>
          </div>
        ) : (
          <UploadContainer disabled={disabled}>
            <div className="rc-upload model-select-upload" onClick={handleCKTClick}>
              <div className="rc-upload-trigger">
                <span>+</span>
              </div>
              <p className="rc-upload-tips"></p>
            </div>
          </UploadContainer>
        )}
        {!isValid && <FormError>请选择模板</FormError>}
      </div>
    </BlockLoading>
  );
}

export default function FixedModelField() {
  const [isValid] = useStoreByValidFlag('fixedModelSelect');
  const className = isValid ? '' : 'has-error';
  return (
    <FormField
      className={className}
      name="templateType"
      label="固定主题模板："
      defaultValue={'templateType'}
      required
    >
      {() => <FixedModelSelect />}
    </FormField>
  );
}
