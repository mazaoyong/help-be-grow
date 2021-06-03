import { Select } from '@zent/compat';
import React from 'react';
import { Input, Button } from 'zent';
import { BRANCH_STORE_NAME } from 'constants/chain';
import assign from 'lodash/assign';
const Option = Select.Option;
export const SCHOOL_STATUS = [`全部${BRANCH_STORE_NAME}状态`, '试用期内', '服务期内', '保护期内', '打烊'];
export const SCHOOL_KEY_STATUS = [null, 'try', 'valid', 'protect', 'close'];
const SHOP_CREATE_LINK = 'https://www.youzan.com/v4/shop/online-store#/';

export default function FilterFC(props) {
  const { fetchData, datasets } = props;

  const onSelectChangeHandler = (data) => {
    const { filterInfo, pageInfo } = datasets;
    fetchData({ filterConditions: assign({}, filterInfo, { currentSelect: data }), pageConditions: pageInfo });
  };

  const onPressSearch = (data) => {
    const { filterInfo, pageInfo } = datasets;
    fetchData({ filterConditions: assign({}, filterInfo, { searchValue: data }), pageConditions: pageInfo });
  };

  const onRefreshClick = () => {
    const { filterInfo, pageInfo } = datasets;
    fetchData({ filterConditions: filterInfo, pageConditions: pageInfo });
  };
  return <>
    <div style={{ display: 'flex' }} className='school-choose-action'>
      <Button onClick={() => {
        window.open(SHOP_CREATE_LINK);
      }}>新建{BRANCH_STORE_NAME}</Button>
      <span onClick={onRefreshClick} className="refresh-btn">刷新</span>
    </div>
    <div style={{ display: 'flex' }} className='school-choose-filter'>
      <Select
        onChange={(e) => onSelectChangeHandler(e.target.value)}
      >
        {SCHOOL_STATUS.map((item, index) => {
          return <Option key={index} value={SCHOOL_KEY_STATUS[index]}>{item}</Option>;
        })}
      </Select>
      <Input
        icon="search"
        width='150px'
        placeholder={`请输入${BRANCH_STORE_NAME}名称`}
        onPressEnter={(e) => onPressSearch(e.target.value)}
      />
    </div>
  </>;
}
