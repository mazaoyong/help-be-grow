import React from 'react';
import { Button } from 'zent';

import { QuestionEditLink, getClassifyManageUrl } from '@ability-center/supv/question-bank';
import { getQustionBankImportUrl } from '../../../utils/navigators';

interface IOperatorButtonsProps {
  categoryId: number;
  categoryName: string;
}

const OperatorButtons: React.FC<IOperatorButtonsProps> = (props) => {
  const { categoryId, categoryName } = props;
  const classifyManageURL = React.useMemo(() => getClassifyManageUrl(), []);
  const questionBankURL = React.useMemo(() => getQustionBankImportUrl(), []);

  return (
    <div className="question-bank__list-buttons">
      <QuestionEditLink
        queries={{ type: 'create', categoryId, categoryName }}
        linkProps={{ target: '_self', displayType: 'button' }}
      >
        新建题目
      </QuestionEditLink>
      <Button href={questionBankURL}>批量导入</Button>
      <Button href={classifyManageURL} target="_blank">
        分类管理
      </Button>
    </div>
  );
};

export default OperatorButtons;
