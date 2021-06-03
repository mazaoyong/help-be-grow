import React from 'react';
import { Button } from 'zent';

interface IFooterProps {
  index: number;
  nextDisabled?: boolean;
  nextLoading?: boolean;
  isEdit?: boolean;
  onClick?: () => void;
  onLastClick?: () => void;
  onCancelClick?: () => void;
}

export default function Footer(props: IFooterProps) {
  const {
    onClick,
    index,
    onLastClick,
    onCancelClick,
    nextDisabled = false,
    nextLoading = false,
    isEdit = false,
  } = props;
  return (
    <div className="submit-footer expand" role="submit-footer">
      <div>
        {index === 1 && (
          <>
            <Button htmlType="submit" onClick={onCancelClick}>
              取消
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              onClick={onClick}
              disabled={nextDisabled}
              loading={nextLoading}
            >
              下一步
            </Button>
          </>
        )}
        {index === 2 && (
          <>
            <Button htmlType="submit" onClick={onLastClick}>
              上一步
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              onClick={onClick}
              disabled={nextDisabled}
              loading={nextLoading}
            >
              {isEdit ? '保存' : '创建'}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
