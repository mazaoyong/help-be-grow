import React from 'react';
import { Button, Form, openDialog, Notify, BlockLoading } from 'zent';
import { EasyFormArchive } from '@youzan/ebiz-components';
import { ZentForm } from 'zent/es/form/ZentForm';
import pick from 'lodash/pick';

import { uploadTrackerInfo } from '../record-manage';
// import basicFormConfigs, { basicPickList } from './basic-form-configs';
import marqueeFormConfigs, { MarqueeTypeEnums, marqueePickList } from './marquee-form-configs';
import { getLiveSetting, ILiveSettingResponse, updateLiveSetting } from '../../../api/live-manage';
import PreviewVideo from '../../components/preview-video';
import { FoundationAvailable } from '../../types';
import './styles.scss';

interface IRoomSettingProps {
  alias: string;
  name: string;
}

const { ValidateOption } = Form;
const VALIDATE_OPTION = ValidateOption.IncludeUntouched | ValidateOption.IncludeChildrenRecursively;

const { EasyForm } = EasyFormArchive;

const RoomSetting: React.FC<IRoomSettingProps> = (props) => {
  const { alias, name } = props;
  const [fetchInitData, setFetchState] = React.useState(true);
  const [blockUpdating, setBlockUpdating] = React.useState(false);
  const [blockPreviewBtn, toggleBlockPreview] = React.useState(false);
  const [defaultSettings, setDefaultSettings] = React.useState<Record<string, any>>({});
  // const basicFormRef = React.useRef<ZentForm<any> | null>(null);
  const marqueeFormRef = React.useRef<ZentForm<any> | null>(null);

  const initLiveRoomSetting = React.useCallback(() => {
    setFetchState(true);
    getLiveSetting({ alias })
      .then((liveSetting) => {
        setDefaultSettings(liveSetting);
        // const basicFormValues = pick(liveSetting, basicPickList);
        const marqueeFormValues = pick(liveSetting, marqueePickList);
        if (/** basicFormRef.current && */ marqueeFormRef.current) {
          // basicFormRef.current.patchValue(basicFormValues);
          marqueeFormRef.current.patchValue(marqueeFormValues);
        }
      })
      .catch(Notify.error)
      .finally(() => setFetchState(false));
  }, [alias]);

  const getSubmitData = React.useCallback(
    (isValidate: boolean) => {
      if (isValidate) {
        // const basicFormValues = basicFormRef.current && basicFormRef.current.getValue();
        // @upgrade: zent8
        const marqueeFormValues = marqueeFormRef.current && (marqueeFormRef.current as ZentForm<{}>).getValue();
        const liveSetting = Object.assign(
          {},
          defaultSettings,
          /** basicFormValues, */ marqueeFormValues,
        );

        return Promise.resolve(liveSetting as ILiveSettingResponse);
      }
      return Promise.reject();
    },
    [defaultSettings],
  );

  const baseTrackParams = React.useMemo(
    () => ({
      liveName: name,
      liveAlias: alias,
    }),
    [alias, name],
  );
  const handleManualSubmitForms = React.useCallback(() => {
    if (/** basicFormRef.current && */ marqueeFormRef.current) {
      Promise.all([
        // basicFormRef.current.validate(ValidateOption.IncludeUntouched),
        marqueeFormRef.current.validate(VALIDATE_OPTION),
      ])
        // .then(([basicFormErrors, marqueeFormErrors]) =>
        //   (basicFormErrors as any[]).concat(marqueeFormErrors).every((err) => err === null),
        // )
        .then(([marqueeFormErrors]) => (marqueeFormErrors as any[]).every((err) => err === null))
        .then(getSubmitData)
        .then((liveSetting) => {
          setBlockUpdating(true);
          return updateLiveSetting({ alias, liveSetting }).then((success) => {
            if (success) {
              uploadTrackerInfo({
                eventName: '修改直播间设置',
                eventSign: 'modifyLiveRoomSetting',
                otherParams: Object.assign({}, baseTrackParams, {
                  openMarquee: liveSetting.openMarquee,
                  // TODO: 弹幕埋点
                }),
              });
              Notify.success('更新直播间设置成功');
              initLiveRoomSetting();
            }
          });
        })
        .catch((err) => err && Notify.error(err))
        .finally(() => {
          setBlockUpdating(false);
        });
    }
  }, [alias, baseTrackParams, getSubmitData, initLiveRoomSetting]);

  const openMarqueePreviewDialog = React.useCallback((marqueeSetting) => {
    if (marqueeSetting) {
      const marqueeContent = marqueeSetting.marqueeContent || '跑马灯内容';
      const marqueeType = marqueeSetting.marqueeType;
      const fontSize = marqueeSetting.marqueeFontSize;
      const opacity = (100 - marqueeSetting.marqueeOpacity) / 100;
      const color = marqueeSetting.marqueeFontColor;
      const content = marqueeType === MarqueeTypeEnums.STATIC_TEXT ? marqueeContent : '客户名称';
      openDialog({
        dialogId: 'preview-marquee',
        title: '跑马灯预览',
        children: (
          <PreviewVideo
            previewId="previewMarquee"
            videoSource="https://img.yzcdn.cn/video/youzaneduintroductionvideo_smart.mp4"
            watermarkSetting={{
              content,
              contentStyle: { fontSize, opacity, color, height: fontSize },
            }}
          />
        ),
      });
    }
  }, []);

  const handleOpenPreviewDialog = React.useCallback(() => {
    marqueeFormRef.current &&
      marqueeFormRef.current
        .validate(VALIDATE_OPTION)
        .then((marqueeFormErrors) => (marqueeFormErrors as any[]).every((err) => err === null))
        .then((isValid) => {
          if (isValid) return marqueeFormRef.current && marqueeFormRef.current.getValue();
          return Promise.reject();
        })
        .then(openMarqueePreviewDialog)
        .catch(() => {
          /** do nothing */
        });
  }, [openMarqueePreviewDialog]);

  const handleToggleMarquee = React.useCallback((state: FoundationAvailable) => {
    toggleBlockPreview(state === FoundationAvailable.DISABLED);
  }, []);

  React.useLayoutEffect(initLiveRoomSetting, [initLiveRoomSetting]);

  React.useLayoutEffect(() => {
    if (marqueeFormRef.current) {
      // form不支持自定义onChange事件，这里需要手动订阅下Rx对象
      const currentModel = marqueeFormRef.current.model.get('openMarquee');
      if (currentModel) {
        currentModel.value$.subscribe(handleToggleMarquee);
      }
    }
  }, [handleToggleMarquee]);

  return (
    <BlockLoading loading={fetchInitData} className="live-manage__roomSetting">
      {/* <section className="content-box">
        <div className="header">
          <div className="partial">
            <h1 className="subtitle">基础设置</h1>
          </div>
        </div>
        <section>
          <EasyForm
            ref={(form) => (basicFormRef.current = form)}
            layout="horizontal"
            config={basicFormConfigs()}
          />
        </section>
      </section> */}
      <section className="content-box">
        <div className="header">
          <div className="partial">
            <h1 className="subtitle">跑马灯设置</h1>
          </div>
        </div>
        <section>
          <EasyForm
            ref={(form) => (marqueeFormRef.current = form)}
            layout="horizontal"
            config={marqueeFormConfigs()}
          />
          {!blockPreviewBtn && (
            <Button
              outline
              className="preview-marquee"
              type="primary"
              bordered={false}
              onClick={handleOpenPreviewDialog}
            >
              跑马灯预览
            </Button>
          )}
        </section>
      </section>
      <div className="submit-footer" role="submit-footer">
        <div>
          <Button loading={blockUpdating} type="primary" onClick={handleManualSubmitForms}>
            保存
          </Button>
        </div>
      </div>
    </BlockLoading>
  );
};

export default RoomSetting;
