import { Pop } from '@zent/compat';
import React, { useCallback } from 'react';
import { Input } from 'zent';
import { Img } from '@youzan/ebiz-components';

import './index.scss';

const { ImgWrap } = Img;

const exampleImg = 'https://b.yzcdn.cn/public_files/6a4b55c094aeb328913b3675630ac6ca.png';

interface IProps extends Record<string, any> {
  label: string;
  name: string;
  defaultValue: string;
  changeHasRuleInput: () => void;
}

const RuleField: React.FC<IProps> = (props) => {
  const { value, onChange, disabled, changeHasRuleInput } = props;
  const handleChange = useCallback(({ target: { value } }) => {
    if (value) {
      changeHasRuleInput();
    }
    onChange(value);
  }, [changeHasRuleInput, onChange]);
  return (
    <div className="rule-field">
      <Input
        disabled={disabled}
        type='textarea'
        placeholder='请填写活动规则'
        maxLength={1000}
        showCount={true}
        value={value}
        onChange={handleChange}
      />
      <div className='rule-field-example'>
        <Pop
          trigger="hover"
          position='bottom-left'
          content={
            <div className="example-pop">
              <ImgWrap
                width="240px"
                height="519px"
                src={exampleImg}
                alt="图片示例"
                backgroundColor="#FFF"
              />
            </div>
          }
        >
          <span>查看示例</span>
        </Pop>
      </div>
    </div>
  );
};

export default RuleField;
