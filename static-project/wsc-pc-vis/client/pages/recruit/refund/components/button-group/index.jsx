import React from 'react';
import { Button as SamButton } from '@youzan/sam-components';

import './styles.scss';

export default function ButtonGroup() {
  return (
    <div className="edu-refund-submit">
      <SamButton
        name="编辑"
        className="edu-refund-submit-button"
        type="primary"
        htmlType="submit"
      >
        退课
      </SamButton>
    </div>
  );
}
