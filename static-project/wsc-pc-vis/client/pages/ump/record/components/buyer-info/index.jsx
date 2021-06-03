import { LayoutRow as Row, LayoutCol as Col, LayoutGrid as Grid } from 'zent';
import { DataType } from '@ability-center/student';
import React, { useMemo } from 'react';
import { format } from 'date-fns';
import get from 'lodash/get';
import './style.scss';

export default ({ data }) => {
  const buyerInfos = useMemo(() => {
    return get(data, 'customizeItems', []);
  }, [data]);

  if (buyerInfos.length === 0) {
    return null;
  }

  return (
    <Grid>
      <Row className="records-buyer-info-row">
        {buyerInfos.map(({ attributeTitle, attributeValue, attributeId, dataType }) => {
          const numberizeDataType = Number(dataType);

          return (
            <Col className="records-buyer-info-col" span={24} key={attributeId}>
              <label>{attributeTitle}：</label>
              <span> {valueAdaptor(attributeValue, numberizeDataType) || '-'}</span>
            </Col>
          );
        })}
      </Row>
    </Grid>
  );
};

const GENER_LIST = ['未知', '男', '女'];
const TIME_FORMAT_STR = 'YYYY-MM-DD';

function valueAdaptor(value, dataType) {
  if (!value) return undefined;
  switch (dataType) {
    case DataType.ADDRESS:
    case DataType.PROVINCE:
      return convertAddressLike(value);
    case DataType.GENDER:
      return convertGender(value);
    case DataType.DATE:
      return format(value, TIME_FORMAT_STR);
    case DataType.PHONE:
      let mobile = value;
      if (String(value).length > 11) {
        const countryCode = mobile.slice(0, 3);
        const phoneNumber = mobile.slice(-11);
        mobile = countryCode.concat(' ', phoneNumber);
      }
      return mobile;
    default:
      return value;
  }
}

function convertAddressLike(value) {
  try {
    const addressList = JSON.parse(value);
    if (Array.isArray(addressList)) {
      // try to convert address when it similar to JSON string
      return addressList.map(address => address.name).join(' ');
    }
    return undefined;
  } catch (e) {
    return value;
  }
}

function convertGender(value) {
  return GENER_LIST[Number(value)] || GENER_LIST[0];
}
