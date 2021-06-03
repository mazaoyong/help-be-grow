import React from 'react';
import Component from './ChooseSchool';
import useChooseDialog from '../dialog-selector';
import assign from 'lodash/assign';
import './index.scss';
/**
 * @param  {} config 读取属性传入dialog, componentConfig为组件属性，包含{Foot, Filter，...listprops}自定义组件可传(Foot, Filter为自定义头部，脚部)， dialogConfig包含zent的dialog属性，及onSubmit, onClose, onOpen三个回调接口
 * @return [] Array [open, Dialog] Dialog为包含课程选择的dialog组件，默认关闭。open为打开Dialog事件
 */
function SchoolSelector(config) {
  const { componentConfig, dialogConfig = {} } = config || {};
  return useChooseDialog(<Component {...componentConfig}></Component>, assign({ onSubmit: null, onClose: null, onOpen: null, title: '上课校区', style: { width: '690px' } }, dialogConfig));
}

export default SchoolSelector;
