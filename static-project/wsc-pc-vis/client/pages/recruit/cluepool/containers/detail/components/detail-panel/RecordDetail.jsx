import React, { useCallback } from 'react';
import getAttributeValue from '../../utils/get-attribute-value';
import { Img, Dialog } from '@youzan/ebiz-components';
import { Button } from 'zent';
import './record-detail.scss';

const { ImgWrap } = Img;

const { DialogFooter } = Dialog;

const RecordDetail = ({ data, dialogref }) => {
  const { attributes, scene = 'clue' } = data;

  const getAttrValue = useCallback((attributeKey, dataType, attributeValue) => {
    switch (attributeKey) {
      case 'edu_stuAva':
        return attributeValue ? <ImgWrap src={attributeValue} width="75px" height="75px" cover /> : '-';
      default:
        const value = getAttributeValue(attributeValue, dataType, attributeKey, scene);
        return value || '-';
    }
  }, [scene]);

  return (
    <>
      <div className="bd">
        {
          attributes.map(({ attributeId, attributeTitle, attributeKey, attributeValue, dataType }) => {
            return (
              <dl key={attributeId}>
                <dt>{attributeTitle || '-'}</dt>
                <dd>{getAttrValue(attributeKey, dataType, attributeValue) || '-'}</dd>
              </dl>
            );
          })
        }
        {attributes.length === 0 && (
          <p className="empty-label">暂无信息</p>
        )}
      </div>
      <DialogFooter>
        <Button
          type="primary"
          onClick={() => {
            dialogref && dialogref.close();
          }}
        >关闭</Button>
      </DialogFooter>
    </>
  );
};

export default RecordDetail;
