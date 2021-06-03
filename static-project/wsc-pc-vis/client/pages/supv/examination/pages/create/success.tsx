import React, { useState } from 'react';
import { Button } from 'zent';
import { hashHistory } from 'react-router';
import Promotion from '../../components/promotion';
import store from './store';

export default function Success({ next }) {
  const [promVisble, setPromVisible] = useState(false);
  const [id] = store.useStoreBy('id');
  const backToNew = () => {
    next && next();
    hashHistory.replace('/create');
  };
  const backToList = () => {
    hashHistory.replace('/list');
  };
  return (
    <div className="success">
      <div className="success-icon">
        <img src="https://b.yzcdn.cn/public_files/71f393905a6d43d7bd44e2dcb5ed4244.png" />
      </div>
      <div className="success-tip">考试创建成功</div>
      <div className="success-btn">
        <Button type="primary" onClick={() => setPromVisible(true)}>
          预览二维码
        </Button>
      </div>
      <div className="success-link">
        <div className="success-link-item">
          <a rel="noopener noreferrer" className="cursor-link" onClick={backToNew}>
            继续新建考试
          </a>
        </div>
        <div className="success-link-item">
          <a rel="noopener noreferrer" className="cursor-link" onClick={backToList}>
            返回考试列表
          </a>
        </div>
      </div>
      <Promotion
        mode="preview"
        url={`https://h5.youzan.com/wscvis/supv/examination/answer/preview?examId=${id}&kdt_id=${_global.kdtId}`}
        visible={promVisble}
        onClose={() => setPromVisible(false)}
      />
    </div>
  );
}
