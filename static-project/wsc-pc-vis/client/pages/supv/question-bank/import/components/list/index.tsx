import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { IListContext } from '@youzan/ebiz-components/es/types/easy-list';

import ImportList from 'components/import-list';
import { findImportTaskByPage } from '../../../../api/question-bank';

const QuestionImportList = forwardRef<IListContext | null, {}>(
  function QuestionImportListWithProps(_, ref) {
    const listRef = useRef<IListContext | null>(null);
    useImperativeHandle(ref, () => listRef.current as any);

    return (
      <ImportList
        ref={listRef}
        className="question-bank__import-list"
        needValidation={true}
        enablePolling={true}
        findImportTaskByPageRequest={findImportTaskByPage}
      />
    );
  }
);

export default QuestionImportList;
