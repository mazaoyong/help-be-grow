import React, { FC, useRef } from 'react';
import { Checkbox, Radio, Disabled } from 'zent';
import { BlankLink } from '@youzan/react-components';
import InfoCollectField from 'components/field/info-collect';
import { IAttributeDTO } from 'components/field/info-collect/types';

import './style.scss';

const CustomItemRender: FC<any> = ({ item, needVerifyCode, onNeedVerifyCodeChange }) => {
  const isContractPhone = item.attributeKey === 'edu_stuContractPhone';
  const isStuName = item.attributeKey === 'edu_stuName';
  if (isContractPhone) {
    return (
      <div className="info-collect-contract-phone" key={item.attributeId}>
        <Checkbox disabled checked value={item.attributeId}>
          {item.attributeTitle}
        </Checkbox>
        <div className="info-collect-need-verify">
          <Radio.Group value={needVerifyCode} onChange={e => onNeedVerifyCodeChange(e.target.value)}>
            <Radio value={1}>需要验证码</Radio>
            <Radio value={0}>无需验证码</Radio>
          </Radio.Group>
          <div className="form-description">
            发送短信的费用，将从你的短信额度中扣除。
            <BlankLink href={`${_global.url.v4}/message/messagepush#/messagegroup`}>查看剩余短信数量</BlankLink>
          </div>
        </div>
      </div>
    );
  }
  if (isStuName) {
    return (
      <Checkbox key={item.attributeId} value={item.attributeId} disabled checked>
        {item.attributeTitle}
      </Checkbox>
    );
  }
  return (
    <Checkbox key={item.attributeId} value={item.attributeId}>
      {item.attributeTitle}
    </Checkbox>
  );
};

export const CustomInfoCollectField: FC<any> = ({ onChange, value, ...props }) => {
  const topOptions = useRef<IAttributeDTO[]>([]);
  const onInfoCollectChange = (val: { customizeItems: number[] }) => {
    // 容错处理，必选联系人手机/学员姓名
    let needChange = false;
    topOptions.current.forEach(it => {
      if (!val.customizeItems.includes(it.attributeId)) {
        val.customizeItems.push(it.attributeId);
        needChange = true;
      }
    });
    if (needChange) onInfoCollectChange({ customizeItems: val.customizeItems });

    onChange({ ...value, infoCollect: val });
  };
  const onNeedVerifyCodeChange = (val) => {
    onChange({ ...value, needVerifyCode: val });
  };

  return (
    <Disabled value={props.disabled === true}>
      <InfoCollectField
        sceneId={0} // 默认展示商家后台设置的所有资料项
        {...props}
        value={value.infoCollect}
        onChange={onInfoCollectChange}
        enableSessionStorage={false}
        expandLimit={7}
        formatItems={(items: IAttributeDTO[]) => {
          topOptions.current = [];
          const top = topOptions.current;
          const contractPhoneIndex = items.findIndex(it => it.attributeKey === 'edu_stuContractPhone');
          if (contractPhoneIndex !== -1) {
            const item = items.splice(contractPhoneIndex, 1);
            top.push(...item);
          }
          const stuNameIndex = items.findIndex(it => it.attributeKey === 'edu_stuName');
          if (stuNameIndex !== -1) {
            const item = items.splice(stuNameIndex, 1);
            top.push(...item);
          }

          return top.concat(items);
        }}
        renderItem={(itemRenderProps) => (
          <CustomItemRender
            {...itemRenderProps}
            needVerifyCode={value.needVerifyCode}
            onNeedVerifyCodeChange={onNeedVerifyCodeChange}
          />
        )}
      />
    </Disabled>
  );
};
