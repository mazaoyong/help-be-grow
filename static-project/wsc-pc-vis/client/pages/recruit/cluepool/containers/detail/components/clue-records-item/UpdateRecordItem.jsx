// 变更跟进记录
import React, { useState, useMemo, useCallback } from 'react';
import { ClampLines, previewImage, Icon } from 'zent';
import { Dialog, Img } from '@youzan/ebiz-components';
import { format } from 'date-fns';
import ClueRecordsEdit from '../clue-records-edit';
import ItemHeader from './ItemHeader';

const { ImgWrap } = Img;
const { openDialog } = Dialog;
// 变更跟进记录
const UpdateRecordItem = ({ data, onUpdate, onChange }) => {
  const [toggle, setToggle] = useState(true);
  const { operateInfo, id, clueId } = data;
  const { recordText, imageList, revisitTime } = operateInfo;

  const text = useMemo(() => {
    if (toggle) {
      return (
        <ClampLines
          lines={1}
          resizable
          showPop={false}
          extra={(
            <span className="cursor-link gray" onClick={() => setToggle(false)}>展开</span>
          )}
          text={recordText}
        />
      );
    }

    return <pre>{recordText}</pre>;
  }, [recordText, toggle]);

  // 图片预览
  const handlePreview = useCallback((i) => {
    previewImage({
      images: imageList,
      index: i,
      scaleRatio: 1,
    });
  }, [imageList]);

  const hadnleEdit = useCallback(() => {
    const dialogRef = openDialog(ClueRecordsEdit, {
      title: '编辑跟进记录',
      data: {
        isEdit: true,
        id,
        clueId,
        recordText,
        imageList,
        revisitTime,
        onChange,
      },
      style: {
        width: '700px',
      },
    });

    dialogRef.afterClosed()
      .then(() => {
        onUpdate();
      });
  }, [id, clueId, imageList, recordText, revisitTime, onUpdate, onChange]);

  return (
    <>
      <ItemHeader data={operateInfo} phase="添加跟进记录" />
      <div className="item__body">
        <div style={{ marginBottom: '20px' }}>
          {text}
        </div>
        <div className="item__body__img-list">
          {imageList.map((pic, i) => (
            <div key={pic}>
              <ImgWrap
                width="40px"
                height="40px"
                cover
                src={pic}
                onClick={() => handlePreview(i)}
              />
            </div>
          ))}
        </div>
        <footer className="item__body__footer">
          {!!revisitTime && (
            <div className="item__body__revist">
              回访时间：{format(revisitTime, 'YYYY-MM-DD HH:mm:ss')}
            </div>
          )}
          <span className="edit gray" onClick={hadnleEdit} ><Icon type="checkin-o" /> 编辑</span>
        </footer>
      </div>
    </>
  );
};

export default UpdateRecordItem;
