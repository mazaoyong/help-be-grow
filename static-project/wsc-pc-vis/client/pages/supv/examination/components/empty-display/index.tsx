import React from 'react';

import { hashHistory } from 'react-router';
import { Link as SamLink } from '@youzan/sam-components';
import styles from './index.m.scss';

import { SAM_NAME } from '../../constants';

interface IEmptyDisplayProps {
  text: string;
  newText: string;
  hashPath?: string;
  onClick?: () => void;
}

function EmptyDisplay(props: IEmptyDisplayProps) {
  const { text, newText, hashPath, onClick } = props;
  return (
    <div className={styles.empty}>
      <div className={styles.image}>
        <img src="https://img.yzcdn.cn/public_files/a1795e31787cadcacbc3fdf5b6f8c0ac.png" />
      </div>
      <div className={styles.info}>
        {text}，
        <SamLink className={styles.link} name={SAM_NAME.EDIT_EXAM} onClick={
          hashPath ? () => hashHistory.push(hashPath) : onClick}>
          {newText}
        </SamLink>
      </div>
    </div>
  );
}
export default EmptyDisplay;
