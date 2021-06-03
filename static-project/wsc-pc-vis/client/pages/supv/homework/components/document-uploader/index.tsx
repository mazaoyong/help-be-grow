import * as React from 'react';
import { UploadV2 } from '@youzan/react-components';
import {
  IDocumentUploaderProps,
  IDocumentValue,
  IDocumentLocalProps,
  IDocumentOutputValue,
} from './types';

let documentIndex = 0;

const DocumentUploader: React.FC<IDocumentUploaderProps> = ({
  anchor,
  maxAmount,
  value,
  onChanged,
  children,
}) => {
  const getInitList = React.useCallback((list: IDocumentValue[]): IDocumentLocalProps[] => {
    return list.map(item => {
      return {
        data: item.url,
        key: ++documentIndex,
        origin: item,
        name: item.name || '',
        documentId: item.documentId || 0,
        extra: {},
        size: item.size,
        fileExt: item.fileExt,
      };
    });
  }, []);

  const formatOutputList = React.useCallback(
    (list: IDocumentLocalProps[]): IDocumentOutputValue[] => {
      return list.map(item => {
        return {
          documentId: item.documentId,
          url: item.data,
          name: item.name,
          size: item.size,
          fileExt: item.fileExt,
          extra: item.extra,
          ...item.origin,
        };
      });
    },
    [],
  );

  const getAddInitList = React.useCallback((fileList: any[]): IDocumentLocalProps[] => {
    return fileList.map(item => {
      return {
        data: item.attachment_url.replace('http://', 'https://'),
        key: ++documentIndex,
        origin: {},
        documentId: item.attachment_id,
        name: item.attachment_title,
        extra: item,
        size: item.attachment_size,
        fileExt: item.file_ext,
      };
    });
  }, []);

  const [list, setList] = React.useState<IDocumentLocalProps[]>(() => {
    // 监听展示容器的消息
    document.addEventListener(`uploaderViewContainer-${anchor}`, (ev: any) => {
      console.log('接收到来自 uploader-view-container 的消息', ev.detail.list);
      if (ev.detail.type === 'document') {
        const list = ev.detail.list;
        const newList = getInitList(list);

        // 更新本地数据
        setList(newList);
        // 触发外部更新回调
        onChanged(formatOutputList(newList));
      }
    });

    return getInitList(value);
  });

  // 来源 value 数据更新
  React.useEffect(() => {
    setList(getInitList(value));

    // 为了 uploader-view-container 的数据交互
    const event = new CustomEvent(`documentUploader-${anchor}`, {
      detail: { list: value },
    });
    document.dispatchEvent(event);
  }, [value, anchor, getInitList]);

  const handleList = React.useCallback(
    data => {
      const newlist = getAddInitList(data);

      setList(preState => {
        const nextList = preState.concat(newlist);
        onChanged(formatOutputList(nextList));
        return nextList;
      });
    },
    [getAddInitList, onChanged, formatOutputList],
  );

  return (
    <UploadV2.DocumentUpload
      materials
      channel="wsc_web"
      maxAmount={maxAmount - list.length}
      trigger={children}
      onSuccess={handleList}
    />
  );
};

export default DocumentUploader;
