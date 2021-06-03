import { React } from '@youzan/tany-react';
import { Checkbox } from 'zent';

// 信息采集开启
interface IInfoCollectOpenProps {
  value: boolean;
  onChange: any;
  disabled?: boolean;
}

const NeedInfoCollect = (props: IInfoCollectOpenProps) => {
  const { value, onChange, disabled } = props;

  return (
    <div className="need-info-collect">
      <Checkbox
        disabled={disabled || false}
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
      >
        开启
      </Checkbox>
    </div>
  );
};

export default NeedInfoCollect;
