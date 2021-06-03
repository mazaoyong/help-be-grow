import React, { useCallback } from 'react';
import getAttributeValue from '../../utils/get-attribute-value';
import { Img } from '@youzan/ebiz-components';

const { ImgWrap } = Img;
const RecordDetail = ({ data }) => {
  const { attributes } = data;

  const getAttrValue = useCallback((attributeKey, dataType, attributeValue) => {
    switch (attributeKey) {
      case 'edu_stuAva':
        return attributeValue ? <ImgWrap src={attributeValue} width="75px" height="75px" cover /> : '-';
      default:
        return getAttributeValue(attributeValue, dataType, attributeKey);
    }
  }, []);

  return (
    <div className="bd">
      {
        attributes.map(({ attributeId, attributeTitle, attributeKey, attributeValue, dataType }) => {
          return (
            <dl key={attributeId}>
              <dt>{attributeTitle || '-'}：</dt>
              <dd>{getAttrValue(attributeKey, dataType, attributeValue) || '-'}</dd>
            </dl>
          );
        })
      }
      {attributes.length === 0 && (
        <p className="empty-label">暂无信息</p>
      )}
    </div>
  );
};

export default RecordDetail;
