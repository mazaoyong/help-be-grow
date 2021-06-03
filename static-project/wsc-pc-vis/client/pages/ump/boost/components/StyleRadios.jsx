import { Pop, Form } from '@zent/compat';
import React from 'react';
import { Radio } from 'zent';

const RadioGroup = Radio.Group;
const getControlGroup = Form.getControlGroup;

function StyleRadios({ disabled, value: style, onChange }) {
  const ExampleImage = ({ style }) => {
    const src = style === 0
      ? 'https://b.yzcdn.cn/public_files/682a3cb52a250f7c0b3da4b2cf51520e.png!middle.jpg'
      : 'https://b.yzcdn.cn/public_files/aada8434135ebcd9902dd9a088bd71f7.png!middle.jpg';

    return <img width="160" height="283" src={src} />;
  };

  const ExamplePop = ({ style }) => (
    <Pop trigger="hover" content={<ExampleImage style={style} />}>
      <span className="example">查看示例</span>
    </Pop>
  );

  const handleChange = e => onChange({ value: e.target.value });

  return (
    <RadioGroup disabled={false} onChange={handleChange} value={style}>
      <Radio className="boost-reward_radio" value={0}>
        优先展示课程信息 <ExamplePop style={0} />
      </Radio>
      <Radio className="boost-reward_radio" value={1}>
        优先展示奖励信息 <ExamplePop style={1} />
      </Radio>
    </RadioGroup>
  );
}

export default getControlGroup(StyleRadios);
