import React, { FC } from 'react';
import './index.scss';

const BlankState: FC<{text?:string;}> = ({ text = '暂无数据' }) => {
  return (<div className="examination__blank-state">
    <div className="examination__blank-state-content">
      <img src="https://img.yzcdn.cn/upload_files/2020/06/08/Fir2hBnyBBNIZThC_f9AV9ztESFp.png" />
      <p>{text}</p>
    </div>
  </div>);
};

export default BlankState;
