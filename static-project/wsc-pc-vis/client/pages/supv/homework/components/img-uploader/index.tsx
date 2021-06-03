import * as React from 'react';
import { IImguploaderProps, IImgValue, IImgLocalProps, IImgOutputValue } from './types';
import { Upload } from '@youzan/react-components';

let imgIndex = 0;
const ImgUploader: React.FC<IImguploaderProps> = (props) => {
  const propsConfig = props;

  const getInitList = React.useCallback(function(list: IImgValue[]) : IImgLocalProps[] {
    console.log('img-uploader init', list);
    return list.map(item => {
      return {
        data: item.url,
        key: ++imgIndex,
        status: item.status || 0,
        origin: item,
        imgId: item.imgId || 0,
        extra: {},
      };
    });
  }, []);

  const [list, setList] = React.useState(() => {
    document.addEventListener(`uploaderViewContainer-${propsConfig.anchor}`, (ev: any) => {
      console.log('接收到来自 uploader-view-container 的消息', ev.detail.list);
      if (ev.detail.type === 'image') {
        const list = ev.detail.list;
        const newList = getInitList(list);

        // 更新本地数据
        setList(newList);
        // 触发外部更新回调
        propsConfig.onChanged(formatOutputList(newList));
      }
    });

    console.log('img-uploader 初始化');
    return getInitList(propsConfig.value);
  });

  React.useEffect(() => {
    setList(getInitList(propsConfig.value));

    // 为了 uploader-view-container 的数据交互
    const event = new CustomEvent(`imgUploaderSingle-${propsConfig.anchor}`, { 'detail': { list: propsConfig.value } });
    document.dispatchEvent(event);
  }, [propsConfig.value, getInitList]);

  const getAddInitList = React.useCallback(function(fileList: any[]) : IImgLocalProps[] {
    // status: 0: 上传成功 1：刚接收 -1：上传失败
    console.log('img-uploader init Add', fileList);
    return fileList.map(item => {
      return {
        data: item.attachment_url,
        imgId: item.attachment_id,
        key: ++imgIndex,
        name: '',
        status: 0,
        origin: {},
        extra: item,
      };
    });
  }, []);

  const formatOutputList = React.useCallback(function(list: IImgLocalProps[]) : IImgOutputValue[] {
    return list.map(item => {
      return {
        url: item.data,
        status: item.status,
        imgId: item.imgId,
        extra: item.extra,
        ...item.origin,
      };
    });
  }, []);

  const handleList = React.useCallback((data) => {
    console.log('[img-uplaoder] handleImgList', data);
    const newlist = getAddInitList(data);
    const nextList = list.concat(newlist);

    setList(nextList);
    propsConfig.onChanged(formatOutputList(nextList));
  }, [list, setList, formatOutputList, getAddInitList, propsConfig]);

  return (
    <div>
      <Upload
        materials={true}
        type="image"
        tokenUrl={`${_global.url.v4}/vis/commom/material/getQiniuAggregateUploadToken.json`}
        fetchUrl={`${window._global.url.materials}/shop/fetchPubImg.json`}
        maxSize={10 * 1024 * 1024}
        maxAmount={propsConfig.max - list.length}
        trigger={() => props.children}
        triggerClassName="custom-upload-trigger"
        accept="image/gif, image/jpeg, image/png, image/bmp"
        kdtId={window._global.kdtId}
        onSuccess={handleList}
      />
    </div>
  );
};

export default ImgUploader;
