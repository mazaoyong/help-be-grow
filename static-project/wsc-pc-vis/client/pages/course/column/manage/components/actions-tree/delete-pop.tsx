import { Pop } from '@zent/compat';
import { Button } from 'zent';
import React, { FC, useState } from 'react';

const DeletePop: FC<{ onDelete: Function, onCancel?: () => void, onClick?: () => void }> = (props) => {
  const { onDelete, onCancel, onClick } = props;
  const [showPop, setShowPop] = useState<boolean>(false);
  return (
    <Pop
      trigger="none"
      visible={showPop}
      position={'top-right'}
      content={
        <div>
          <p>删除后将不可恢复，确定删除？ 该分类下的课程将被移动到“未分类”下。</p>
          <div style={{ textAlign: 'right', marginTop: '15px', width: '100%' }}>
            <Button onClick={(e) => {
              e.stopPropagation();
              onCancel && onCancel();
              setShowPop(false);
            }}>取消</Button>
            <Button type="primary" onClick={(e) => {
              e.stopPropagation();
              setShowPop(false);
              onDelete();
            }}>
              确定
            </Button>
          </div>
        </div>
      }
    >
      <span className="column-basetree__operation__item" onClick={(e) => {
        e.stopPropagation();
        onClick && onClick();
        setShowPop(true);
      }}>删除</span>
    </Pop>
  );
};

export default DeletePop;
