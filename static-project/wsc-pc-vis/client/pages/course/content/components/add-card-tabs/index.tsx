/*****************
 * 内容页新建图文，音频，视频卡片组
 */
import React, { useMemo } from 'react';
import AddCardGrid, { IProps as IAddCardGridProps } from '../../../components/add-card-grid';
import { Button } from '@youzan/sam-components';
import { LockWrap } from '@youzan/ebiz-components';
import { LockType } from '@youzan/ebiz-components/es/lock-wrap';
import './style.scss';

interface IAddCardTabsProps {
  handleAddClick: Function;
  isLock: boolean;
}

export default function AddCardTabs(props: IAddCardTabsProps) {
  const { handleAddClick, isLock } = props;

  const config: IAddCardGridProps['list'] = useMemo(() => [
    {
      title: '图文',
      content: ['可以添加文字和图片的单篇内容'],
      footer: (
        <LockWrap lockType={LockType.PCT_SHOP} isLock={isLock} onClick={() => handleAddClick(null, 'text')}>
          <Button type="primary" name="活动管理" >立即新建</Button>
        </LockWrap>
      ),
    },
    {
      title: '音频',
      content: ['可以添加一段音频及介绍的单篇内容'],
      footer: (
        <LockWrap lockType={LockType.PCT_SHOP} isLock={isLock} onClick={() => handleAddClick(null, 'audio')}>
          <Button type="primary" name="活动管理" >立即新建</Button>
        </LockWrap>
      ),
    },
    {
      title: '视频',
      content: ['可以添加一段录播视频及介绍的单篇内容'],
      footer: (
        <LockWrap lockType={LockType.PCT_SHOP} isLock={isLock} onClick={() => handleAddClick(null, 'video')}>
          <Button type="primary" name="活动管理" >立即新建</Button>
        </LockWrap>
      ),
    },
  ], [handleAddClick, isLock]);

  return (
    <div className='content-card__wrapper'>
      <AddCardGrid list={config} />
    </div>
  );
}
