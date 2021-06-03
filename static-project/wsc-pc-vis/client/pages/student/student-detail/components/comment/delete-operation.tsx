import { Pop } from '@zent/compat';
import React, { FC, useState } from 'react';
import { Button, Notify } from 'zent';
import { deleteMoments } from './api';

interface IOperationColumnProps {
  mentionedUsers: any[];
  postId: number;
  setLoading: (boolean)=>void;
}

const OperationPop: FC<IOperationColumnProps> = (props) => {
  const { mentionedUsers, postId, setLoading } = props;
  const [ visible, setVisible ] = useState(false);

  return <Pop trigger='click' visible={visible} onVisibleChange={(visible) => { setVisible(visible); }} content={<div style={{ display: 'flex', lineHeight: '32px' }}>
    {mentionedUsers && mentionedUsers.length === 1 && <span>确定删除？</span>}
    {mentionedUsers && mentionedUsers.length > 1 && <div>{`${mentionedUsers[0].userName}等${mentionedUsers.length}`}名学员的该条点评都将删除，确定删除？</div>}
    <span>
      <Button onClick={() => setVisible(false)}>取消</Button>
      <Button onClick={() => {
        deleteMoments({
          command: {
            postId,
          },
        }).then(resp => {
          if (resp) {
            Notify.success('删除成功');
            setVisible(false);
            setLoading(true);
          }
        }).catch(err => {
          Notify.error(err);
          setVisible(false);
        });
      }} type="primary">确定</Button>
    </span>
  </div>}>
    <span className="moments_operation_modify">删除</span>
  </Pop>;
};

export default OperationPop;
