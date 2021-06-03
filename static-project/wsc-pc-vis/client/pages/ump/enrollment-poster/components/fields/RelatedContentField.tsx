import React from 'react';
import { FormField, Sweetalert } from 'zent';
import '@youzan/react-components/es/components/choose-dialog/style';
import { clickTracker } from 'components/logger';
import RelatedContentCourse from './RelatedContentCourse';
import RelatedContentRegis from './RelatedContentRegis';
import RelatedContentFixedCode from './RelatedContentFixedCode';
import RelatedContentLiveCode from './RelatedContentLiveCode';
import { useStore, useStoreByValidFlag } from '../../store';
import { RELATED_TYPE, ENROLLMENT_POSTER_CREATE } from '../../contants';

function ReleatedContent() {
  const [store, dispatch] = useStore();
  const { formData } = store;

  const clickLogger = templateType => {
    clickTracker({
      eventName: '报名内容',
      eventSign: 'enrollment_content',
      pageType: ENROLLMENT_POSTER_CREATE,
      otherParams: {
        contentType: templateType,
      }
    });
  };

  const onRadioChange = _type => {
    const baseResetData = {
      qrcode: '',
      course: null,
      regisform: null,
      fixedQrcode: '',
      liveCode: null,
    };
    // 如果已选择固定海报
    if (formData.modelType === 1 && formData.modelImageUrl) {
      Sweetalert.confirm({
        content: '更换关联内容会清除固定模板，确认是否继续？',
        confirmText: '我再想想',
        cancelText: '确定',
        onCancel: () => {
          dispatch({
            formData: Object.assign({}, formData, {
              relatedType: _type,
              modelImageUrl: '',
              designId: '',
              ...baseResetData,
            }),
          });
          clickLogger(_type);
        },
      });
      return;
    }
    dispatch({
      formData: Object.assign({}, formData, { relatedType: _type, ...baseResetData }),
    });
    clickLogger(_type);
  };
  // radio没有radioGroup是因为GoodsSelector里没有定义radioGroup，导致一直找父级radioGroup
  return (
    <div className="related-content">
      <RelatedContentCourse onRadioChange={() => onRadioChange(RELATED_TYPE.COURSE)} />
      <RelatedContentRegis onRadioChange={() => onRadioChange(RELATED_TYPE.REGISFORM)} />
      <RelatedContentFixedCode onRadioChange={() => onRadioChange(RELATED_TYPE.FIXEDQRCODE)} />
      <RelatedContentLiveCode onRadioChange={() => onRadioChange(RELATED_TYPE.LIVECODE)} />
    </div>
  );
}

export default function RelatedContentField() {
  const [isValid] = useStoreByValidFlag('relatedSelect');
  const className = isValid ? '' : 'has-error';
  return (
    <FormField
      className={className}
      name="templateType"
      label="关联报名内容："
      defaultValue={0}
      required
    >
      {() => <ReleatedContent />}
    </FormField>
  );
}
