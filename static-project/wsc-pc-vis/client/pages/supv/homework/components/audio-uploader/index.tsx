import { Pop } from '@zent/compat';
import * as React from 'react';
import { Notify } from 'zent';
import { IAudiouploaderProps, IAudioValue, IAudioLocalProps, IAudioOutputValue } from './types';
import { UploadV2 } from '@youzan/react-components';
import RecordComponent from './record';
import './style.scss';
import { MAX_SIZE_DEFAULT } from './constants';

const makeEvent = (name: string, config: object) => {
  const event = new CustomEvent(name, { 'detail': config });
  document.dispatchEvent(event);
};

let audioIndex = 0;
const AudioUploader: React.FC<IAudiouploaderProps> = (props) => {
  const propsConfig = props;

  const [isShowMaterialUploader, setShowMaterialUploader] = React.useState(false);

  const getInitList = React.useCallback(function(list: IAudioValue[]) : IAudioLocalProps[] {
    console.log('img-uploader init', list);
    return list.map(item => {
      return {
        data: item.url,
        key: ++audioIndex,
        status: item.status || 0,
        origin: item,
        name: item.name || '',
        audioId: item.audioId || 0,
        extra: {},
      };
    });
  }, []);

  const [list, setList] = React.useState(() => {
    // 监听展示容器的消息
    document.addEventListener(`uploaderViewContainer-${propsConfig.anchor}`, (ev: any) => {
      console.log('接收到来自 uploader-view-container 的消息', ev.detail.list);
      if (ev.detail.type === 'audio') {
        const list = ev.detail.list;
        const newList = getInitList(list);

        // 更新本地数据
        setList(newList);
        // 触发外部更新回调
        propsConfig.onChanged(formatOutputList(newList));
      }
    });

    // 监听录音组件的消息
    document.addEventListener(`audioUploaderRecord-${propsConfig.anchor}`, (ev: any) => {
      if (ev.detail.type === 'data') {
        console.log('接收到来自 audioUploaderRecord 的消息', ev.detail.list, list);
        handleList(ev.detail.list);
      }
    });
    return getInitList(propsConfig.value);
  });

  // 来源 value 数据更新
  React.useEffect(() => {
    setList(getInitList(propsConfig.value));

    // 为了 uploader-view-container 的数据交互
    makeEvent(`audioUploaderSingle-${propsConfig.anchor}`, { list: propsConfig.value });
  }, [propsConfig.value, propsConfig.anchor]);

  const getAddInitList = React.useCallback(function(fileList: any[]) : IAudioLocalProps[] {
    // status: 0: 上传成功 1：刚接收 -1：上传失败
    console.log('audio-uploader init Add', fileList);
    return fileList.map(item => {
      return {
        data: item.attachment_url.replace('http://', 'https://'),
        audioId: item.attachment_id,
        key: ++audioIndex,
        name: item.attachment_title,
        status: 0,
        origin: {},
        extra: item,
      };
    });
  }, []);

  const formatOutputList = React.useCallback(function(list: IAudioLocalProps[]) : IAudioOutputValue[] {
    return list.map(item => {
      return {
        url: item.data,
        status: item.status,
        audioId: item.audioId,
        extra: item.extra,
        name: item.name,
        ...item.origin,
      };
    });
  }, []);

  const handleList = React.useCallback((data) => {
    const newlist = getAddInitList(data);

    setList((preState) => {
      if (props.max && preState.length >= props.max) {
        Notify.error(`你最多只能选择${props.max}个音频`);
        return preState;
      }
      const nextList = preState.concat(newlist);
      propsConfig.onChanged(formatOutputList(nextList));
      return nextList;
    });
  }, [list, setList, formatOutputList, getAddInitList, propsConfig]);

  const handleClickRecord = React.useCallback((pop) => {
    pop.close();

    if (props.max && list.length >= props.max) {
      Notify.error(`你最多只能选择${props.max}个音频`);
    }
    makeEvent(`audioUploaderRecord-${props.anchor}`, {
      show: true,
      type: 'show',
    });
  }, [props.anchor]);

  const handleClickMaterial = React.useCallback((pop) => {
    pop.close();
    setShowMaterialUploader(true);
  }, []);

  const ChooseList = Pop.withPop((pop) => {
    return (
      <div className="choose-list">
        <div
          className="choose-list__item"
          onClick={handleClickRecord.bind(null, (pop as any).pop)}
        >录制语音</div>
        <div
          className="choose-list__item"
          onClick={handleClickMaterial.bind(null, (pop as any).pop)}
        >从素材中心选择</div>
      </div>
    );
  });

  const Uplader = (UploaderProps) => {
    return (
      <UploadV2.VoiceUpload
        channel="owl_broad_audio"
        materials
        auto={UploaderProps.auto}
        tokenUrl={
          `${_global.url.v4}/vis/commom/material/getPublicBroadLimitAudioUploadToken.json`
        }
        maxSize={((props.maxSize || 0) * 1024 * 1024) || MAX_SIZE_DEFAULT}
        maxAmount={props.max ? props.max - list.length : undefined}
        className="audio-uploader"
        defaultTriggerClassName="upload-audio-trigger"
        accept="audio/mp3, audio/amr, audio/mpeg, .wav, .m4a"
        trigger={UploaderProps.children || null}
        onSuccess={(res) => {
          handleList(res);
          setShowMaterialUploader(false);
        }}
        onError={() => setShowMaterialUploader(false)}
      />
    );
  };

  return (
    <div>
      {
        isShowMaterialUploader ? (
          <Uplader auto={true} />
        ) : null
      }

      {
        props.supportRecord ? (
          <Pop trigger={'click'} position="bottom-center" closeOnClickOutside={true} className="audio-uploader-pop" {...props.popProps} content={<ChooseList />}>
            <div>{props.children}</div>
          </Pop>
        ) : (
          Uplader({
            auto: false,
            children: props.children
          })
        )
      }
    </div>
  );
};

export default AudioUploader;
export const Record = RecordComponent;
