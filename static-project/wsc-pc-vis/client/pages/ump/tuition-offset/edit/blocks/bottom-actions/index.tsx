import React from 'react';
import { Link } from 'react-router';
import { Button } from 'zent';
import { IFormCreatorConfig } from '@youzan/ebiz-components/es/types/easy-form-archive';

interface IBottomActionsProps {
  disabled?: boolean;
  btnLoading: boolean;
  onSubmit: () => void;
}

const BottomActions = (props: IBottomActionsProps): IFormCreatorConfig => {
  const { disabled, btnLoading, onSubmit } = props;

  return (
    <div className="easy-form-actions">
      {!disabled &&
        <Button type="primary" htmlType="submit" loading={btnLoading} onClick={onSubmit}>
          保存
        </Button>
      }
      <Link to="list" style={{ marginLeft: 8 }}>
        <Button disabled={false}>
          {!disabled ? '取消' : '返回'}
        </Button>
      </Link>
    </div>
  );
};

export default BottomActions;
