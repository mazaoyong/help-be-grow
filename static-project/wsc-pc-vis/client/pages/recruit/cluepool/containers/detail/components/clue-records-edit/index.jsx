// 编辑动态记录
import React, { useCallback, useState } from 'react';
import { Input, Button, Icon, previewImage, Tag, Notify } from 'zent';
import { Icon as EbizIcon, Dialog, Img } from '@youzan/ebiz-components';
import SelectRecordTimeDialog from '../select-record-time-dialog';
import UploadImg from './UploadImg';

import { format } from 'date-fns';

import { createClueRecordAPI, updateClueRecordAPI } from '../../../../api';
import './style.scss';

const { ImgWrap } = Img;
const { openDialog } = Dialog;

const ClueRecordsEdit = ({ dialogref, data = {}, clueId, onChange }) => {
  const _clueId = clueId || data.clueId;
  const { isEdit = false } = data;
  const [loading, setLoading] = useState(false);
  const [recordText, setRecordText] = useState(data.recordText || '');
  const [imageList, setImageList] = useState(data.imageList || []);
  const [revisitTime, setRevisitTime] = useState(data.revisitTime);
  const [hover, setHover] = useState(-1);

  const onUploadSuccess = useCallback((data) => {
    const newPics = data.map(pic => {
      const url = pic.attachment_url.replace('http://', 'https://');
      return url;
    });
    setImageList([...new Set([...imageList, ...newPics])]);
  }, [imageList]);

  // 图片预览
  const handlePreview = useCallback((i) => {
    previewImage({
      images: imageList,
      index: i,
      scaleRatio: 3,
    });
  }, [imageList]);

  const onPicDelete = useCallback((pic) => {
    const newPic = imageList.filter(p => p !== pic);
    setImageList([...newPic]);
  }, [imageList]);

  const handleSelectTime = useCallback(() => {
    const dialogRef = openDialog(SelectRecordTimeDialog, {
      title: '选择回访时间',
      style: { width: '400px' },
    });
    dialogRef.afterClosed().then(res => {
      setRevisitTime(res);
    });
  }, []);

  const handleCreateRecord = useCallback(() => {
    const req = {
      clueId: _clueId,
      recordText,
      imageList,
    };

    if (revisitTime) {
      req.revisitTime = format(revisitTime, 'YYYY-MM-DD HH:mm:ss');
    }

    createClueRecordAPI(req)
      .then(() => {
        setRecordText('');
        setImageList([]);
        setRevisitTime(null);
        onChange && onChange();
        Notify.success('添加成功');
      })
      .catch((errMsg) => {
        Notify.error(errMsg || '添加动态记录失败');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [_clueId, imageList, recordText, revisitTime, onChange]);

  const handleUpdateRecord = useCallback(() => {
    const req = {
      clueId: _clueId,
      recordId: data.id,
      recordText,
      imageList,
    };

    if (revisitTime) {
      req.revisitTime = format(revisitTime, 'YYYY-MM-DD HH:mm:ss');
    }

    updateClueRecordAPI(req)
      .then(() => {
        Notify.success('更新动态记录成功');
        onChange && onChange();
        data.onChange && data.onChange();
        dialogref.submit();
      })
      .catch((errMsg) => {
        Notify.error(errMsg || '更新动态记录失败');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [_clueId, data.id, data.onChange, dialogref, imageList, recordText, revisitTime, onChange]);

  const handleSubmit = useCallback(() => {
    if (recordText === '') {
      Notify.error('请填写跟进内容');
      return;
    }

    setLoading(true);
    if (isEdit) {
      handleUpdateRecord();
    } else {
      handleCreateRecord();
    }
  }, [handleCreateRecord, handleUpdateRecord, isEdit, recordText]);

  return (
    <article className="clue-reacords__edit">
      <div className="clue-reacords__edit__textarea-wrap">
        <Input
          className="clue-reacords__edit__textarea"
          type="textarea"
          placeholder="添加跟进内容"
          maxLength={1000}
          autoSize
          value={recordText}
          onChange={evt => setRecordText(evt.target.value)}
        />
        <p className="input-tip">最多可输入1000字</p>
        {imageList.length > 0 && (
          <div className="clue-reacords__edit__img-wrap">
            {imageList.map((pic, i) => (
              <div key={pic} className="clue-reacords__edit__img__item" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(-1)}>
                <ImgWrap
                  width="40px"
                  height="40px"
                  src={pic}
                  cover
                  onClick={() => handlePreview(i)}
                />
                {hover === i && (<Icon type="close-circle" onClick={() => onPicDelete(pic)} />)}
              </div>
            ))}
          </div>
        )}
        {!!revisitTime && (
          <div className="clue-reacords__edit__revist-list-wrap">
            <Tag
              outline
              theme="grey"
              closable
              onClose={() => setRevisitTime(null)}
            >
              回访时间：{format(revisitTime, 'YYYY-MM-DD HH:mm:ss')}
            </Tag>
          </div>
        )}
      </div>
      <div className="clue-reacords__edit__actions">
        <div className="clue-reacords__edit__actions__left">
          <UploadImg selectedLength={imageList.length} onUploadSuccess={onUploadSuccess} />
          <dl className="cursor-link" onClick={handleSelectTime}>
            <dt><EbizIcon type="followup-o" size="18px" color="#999999" /></dt>
            <dd>回访时间</dd>
          </dl>
        </div>
        <Button type="primary" loading={loading} onClick={handleSubmit}>{isEdit ? '保存' : '添加'}</Button>
      </div>
    </article >
  );
};

export default ClueRecordsEdit;
