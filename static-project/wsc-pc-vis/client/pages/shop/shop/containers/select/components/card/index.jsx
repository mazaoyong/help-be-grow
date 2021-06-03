/**
 * 版本选择卡片，抄袭自零售连锁
 */
import React from 'react';
import { Button } from 'zent';
import './style.scss';

export default function Card({ title, subTitle, desc, submitText, icon, onClick }) {
  return (
    <div className='select-card'>
      {icon && (
        <img className="icon" src="https://b.yzcdn.cn/image/iconrecomand20190309.png" alt="推荐" />
      )}
      <div className="title">{title}</div>
      <div className="title sub">{subTitle}</div>
      <div className="text">{desc}</div>
      <Button type="primary" className="card-button" onClick={onClick}>
        {submitText}
      </Button>
    </div>
  );
}
