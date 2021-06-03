/*****************
 * 奖励页新建奖励
 */
import React, { FC, useCallback, useMemo } from 'react';
import AddCardGrid, { IProps as IAddCardGridProps } from '@ability-center/course/add-card-grid';
import { Button } from '@youzan/sam-components';
import { isEduBranchStore } from '@youzan/utils-shop';
import { hashHistory } from 'react-router';
import './style.scss';

const AddCardTabs:FC<{}> = () => {
  const handleCreateClick = useCallback<((type: string) => void)>((type) => {
    hashHistory.push(`/add?type=${type}`);
  }, []);

  const getBtn = useCallback((type: string) => {
    return <Button name="编辑" type="primary" onClick={() => handleCreateClick(type)} disabled={isEduBranchStore}>立即创建</Button>;
  }, [handleCreateClick]);

  const config: IAddCardGridProps['list'] = useMemo(() => [
    {
      title: '消课奖励',
      content: ['完成消课任务后发放奖励，提高消课率', '促进学员活跃'],
      footer: getBtn('processing'),
    },
    {
      title: '入学奖励',
      content: ['购买指定活动课程后发放奖励，提高转化率'],
      footer: getBtn('start'),
    },
    {
      title: '毕业奖励',
      content: ['完成指定课程完成后发放奖励，提高复购率'],
      footer: getBtn('end'),
    },
  ], [getBtn]);

  return (
    <div className='rewards-card__wrapper'>
      <AddCardGrid list={config} />
    </div>
  );
};

export default AddCardTabs;
