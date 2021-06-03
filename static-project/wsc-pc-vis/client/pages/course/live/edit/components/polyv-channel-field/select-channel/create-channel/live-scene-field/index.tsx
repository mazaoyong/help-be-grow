import { Pop, Form } from '@zent/compat';
import React, { useCallback } from 'react';
import { Radio, RadioGroup } from 'zent';
import { Scene } from '../../enums';
import style from './index.m.scss';

const { getControlGroup } = Form;

function LiveScene(props) {
  const { onChange, disabled } = props;
  const handleChange = useCallback(e => {
    onChange(e.target.value);
  }, [onChange]);

  return (
    <div className={style['live-scene-field']}>
      <RadioGroup onChange={handleChange} value={props.value} disabled={disabled}>
        <Radio value={Scene.normal}>
          普通直播
        </Radio>
        <div className={style['field-tip']}>
          适用于：活动拍摄、屏幕共享直播，使用网页或OBS软件发起直播。
          <Pop trigger="click" position="right-center" content={
            <div>
              <img width="280" height="607" src="https://img.yzcdn.cn/cdn/preview-normal.png" />
            </div>}
          >
            <a href="javascript:;">效果预览</a>
          </Pop>
        </div>
        <Radio value={Scene.threeScreen}>
          三分屏直播
        </Radio>
        <div className={style['field-tip']}>
          适用于：PPT三分屏直播。
          <Pop trigger="click" position="right-center" content={
            <div>
              <img width="280" height="607" src="https://img.yzcdn.cn/cdn/preview-three.png" />
            </div>}
          >
            <a href="javascript:;">效果预览</a>
          </Pop>
        </div>
      </RadioGroup>
    </div>
  );
}

export default getControlGroup(LiveScene);
