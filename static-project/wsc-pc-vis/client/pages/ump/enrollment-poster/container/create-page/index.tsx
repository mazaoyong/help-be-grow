import React, { useEffect, useMemo } from 'react';
import { hot } from 'react-hot-loader';
import {
  Provider,
  useStore,
  useStoreBy,
  IFormData,
  checkHasSelectedRelatedContent,
} from '../../store';
import ImagePreview from '../../components/ImagePreview';
import { Form, FormStrategy, Button, Notify, BlockLoading } from 'zent';
import TitleField from '../../components/fields/TitleField';
import ModelField from '../../components/fields/ModelField';
import FixedModelField from '../../components/fields/FixedModelField';
import RelatedContentField from '../../components/fields/RelatedContentField';
import { createPoster, ICreateParams, getById, IEditParams, editPoster, getQrcode } from '../../api';
import { RELATED_TYPE, nameMaxLength, ENROLLMENT_POSTER_CREATE } from '../../contants';
import { hashHistory } from 'react-router';
import { createUniqueResourceAlias, uploadQrcodeToCDN } from '../../utils';
import { Button as SamButton } from '@youzan/sam-components';
import { visitTracker } from 'components/logger';
import getQrcodePosition, { IDrawStyle, textImageUrl } from './get-qrcode-position';
import { VersionEnum } from '../../types';

interface CreatePageProps {
  params: {
    id: string,
  };
  location: {
    query: {
      formValue: string; // 进入页面时设置表单内容
      returnUrl: string; // 点击取消时返回的页面url，不传则hashHistory.goBack();
      [key: string]: string;
    };
  };
}

function CreatePage({ params, location }: CreatePageProps) {
  const form = Form.useForm(FormStrategy.View);
  const [data, dispatch] = useStore();
  const [loading, setLoading] = useStoreBy('editLoading');
  const { formData, validFlag } = data;
  const { modelType, resourceAlias = '', bgImageHeight = 0, bgImageWidth = 0 } = formData;
  const { formValue: queryFormValue, returnUrl } = location.query || {};

  useEffect(() => {
    visitTracker({ pageType: ENROLLMENT_POSTER_CREATE, eventName: '浏览编辑招生海报' });
  }, []);

  useEffect(() => {
    // 编辑模式
    if (params.id) {
      const id = parseInt(params.id);
      getById({ id }).then(data => {
        /* form.patchValue({
          title: data.title,
        }); */
        const oformData: IFormData = {
          id,
          title: data.title,
          resourceAlias: data.resourceAlias,
          modelType: data.templateType,
          modelImageUrl: data.templateType === 0 ? data.bgImage : data.templatePicUrl,
          relatedType: data.relevantContextType,
          qrcode: data.qrcodeUrl,
          bgImageWidth: data.bgImageWidth || 0,
          bgImageHeight: data.bgImageHeight || 0,
          designId: data.designId,
          version: data.version,
        };
        try {
          switch (data.relevantContextType) {
            case RELATED_TYPE.COURSE:
              oformData.course = JSON.parse(data.relevantContext);
              break;
            case RELATED_TYPE.REGISFORM:
              oformData.regisform = JSON.parse(data.relevantContext);
              break;
            case RELATED_TYPE.FIXEDQRCODE:
              oformData.fixedQrcode = data.relevantContext;
              break;
            case RELATED_TYPE.LIVECODE:
              oformData.liveCode = JSON.parse(data.relevantContext);
              break;
          }
          dispatch({
            formData: oformData,
          });
        } catch (e) {
          Notify.error('数据解析错误');
        }
      });
    } else if (queryFormValue) {
      try {
        const queryFormData = JSON.parse(queryFormValue);

        Promise
          .resolve(queryFormData)
          .then((data) => {
            if (data.fixedQrcode) {
              return getQrcode(data.fixedQrcode, { width: 150, height: 150 })
                .then(code => uploadQrcodeToCDN(code))
                .then(data => data['attachment_url'])
                .then(codeUrl => ({
                  ...data,
                  fixedQrcode: codeUrl,
                  qrcode: codeUrl,
                }));
            }
            return data;
          })
          .then((data) => {
            dispatch({ formData: { ...formData, ...data } });
          });
      } catch (e) {
        Notify.error('数据解析错误');
        console.error('初始化新建海报表单失败', e, queryFormValue);
      }
    }
  }, [params.id, queryFormValue]);

  useEffect(() => {
    // 编辑模式不生成
    if (params.id) return;

    if (resourceAlias === '') {
      dispatch({
        formData: Object.assign({}, formData, { resourceAlias: createUniqueResourceAlias() }),
      });
    }
  }, [formData, dispatch, resourceAlias, params]);

  const styles: IDrawStyle = useMemo(() => {
    return getQrcodePosition(bgImageHeight, bgImageWidth);
  }, [bgImageHeight, bgImageWidth]);

  const validate = () => {
    const { title, modelImageUrl, modelType } = formData;
    if (!title || title.length > nameMaxLength) {
      validFlag.title = false;
    }
    if (!modelImageUrl && modelType === 0) {
      validFlag.modelSelect = false;
    }
    if (!checkHasSelectedRelatedContent(formData)) {
      validFlag.relatedSelect = false;
    }
    // 与上面分开的原因是按顺序提示
    if (!modelImageUrl && modelType === 1) {
      validFlag.fixedModelSelect = false;
    }
    dispatch({
      validFlag: { ...validFlag },
    });
    return (
      validFlag.title &&
      validFlag.modelSelect &&
      validFlag.relatedSelect &&
      validFlag.fixedModelSelect
    );
  };
  const onSubmit = () => {
    if (!formData) return;
    if (!validate()) return;
    setLoading(true);
    const { relatedType } = formData;
    // const values = form.getValue();
    let relevantContext = '';
    switch (relatedType) {
      case RELATED_TYPE.COURSE:
        relevantContext = JSON.stringify(formData.course);
        break;
      case RELATED_TYPE.REGISFORM:
        relevantContext = JSON.stringify(formData.regisform);
        break;
      case RELATED_TYPE.FIXEDQRCODE:
        if (!formData.fixedQrcode) return;
        relevantContext = formData.fixedQrcode;
        break;
      case RELATED_TYPE.LIVECODE:
        relevantContext = JSON.stringify(formData.liveCode);
        break;
    }

    const baseData: any = {
      templateType: formData.modelType,
      relevantContext,
      relevantContextType: formData.relatedType,
      designId: formData.designId || '',
      title: formData.title,
      templatePicUrl: formData.modelImageUrl || '',
      qrcodeUrl: formData.qrcode || '',
      bgImageWidth: formData.bgImageWidth || 0,
      bgImageHeight: formData.bgImageHeight || 0,
      version: VersionEnum.NEW,
    };

    if (formData.modelType === 0) {
      baseData.drawQrcodeDTO = {
        distanceX: styles.qrcodePosition.x,
        distanceY: styles.qrcodePosition.y,
        qrcodeWidth: styles.qrcodePosition.width,
        qrcodeHeight: styles.qrcodePosition.height,
      };
      baseData.drawTextDTO = {
        distanceX: styles.textPosition.x,
        distanceY: styles.textPosition.y,
        qrcodeWidth: styles.textPosition.width,
        qrcodeHeight: styles.textPosition.height,
        textUrl: textImageUrl,
      };
    }

    if (params.id) {
      let _params: IEditParams = Object.assign({}, baseData, {
        id: parseInt(params.id),
      });
      editPoster(_params)
        .then(() => {
          Notify.success('更新成功');
          hashHistory.push('/list');
        })
        .catch(() => {
          Notify.error('更新失败');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      let _params: ICreateParams = Object.assign({}, baseData, {
        resourceAlias,
      });
      createPoster(_params)
        .then(() => {
          Notify.success('创建成功');
          hashHistory.push('/list');
        })
        .catch(() => {
          Notify.error('创建失败');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <BlockLoading loading={loading}>
      <div className="enrollment-poster-create">
        <ImagePreview styles={styles} />
        <Form layout="horizontal" form={form} className="create-form" onSubmit={onSubmit}>
          <TitleField />
          <ModelField />
          <RelatedContentField />
          {modelType === 1 && <FixedModelField />}
          <div className="app-design">
            <div className="app-actions">
              <div className="form-actions new-actions text-center">
                <SamButton name="编辑" type="primary" htmlType="submit">
                  保存
                </SamButton>
                {/* TODO 考虑提示 */}
                <Button onClick={() => {
                  if (returnUrl) window.location.href = returnUrl;
                  else hashHistory.goBack();
                }}>取消</Button>
              </div>
            </div>
          </div>
        </Form>
      </div>
    </BlockLoading>
  );
}

function CreatePageWithProvider(props) {
  return (
    <Provider>
      <CreatePage {...props} />
    </Provider>
  );
}

export default hot(module)(CreatePageWithProvider);
