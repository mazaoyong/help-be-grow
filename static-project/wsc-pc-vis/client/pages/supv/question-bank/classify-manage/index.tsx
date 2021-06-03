import React from 'react';
import { Button, Notify } from 'zent';

import ClassifyList from './components/classify-list';
import openEditClassifyDialog from './components/edit-classify';
import { createCategory } from '../../api/question-bank';

import { IClassifyManageProps } from './types';
import './styles.scss';

const ClassifyManage: React.FC<IClassifyManageProps> = () => {
  const [forceUpdateKey, setUpdateKey] = React.useState(0);
  const handleAddClassify = React.useCallback(() => {
    openEditClassifyDialog({
      type: 'add',
      submitEffect(query) {
        return createCategory(query)
          .then((success) => {
            success ? Notify.success('创建成功') : Notify.error('创建失败');
            return success;
          });
      },
    })
      .afterClosed()
      .then(() => {
        setUpdateKey((prevUpdateKey) => prevUpdateKey + 1);
      })
      .catch((err) => err && Notify.error(err));
  }, []);

  return (
    <div className="question-bank__classify-manage">
      <h1>分类管理</h1>
      <section>
        <Button type="primary" onClick={handleAddClassify}>
          新建分类
        </Button>
      </section>
      <ClassifyList updateSignal={forceUpdateKey} withHeader showOperators />
    </div>
  );
};

export default ClassifyManage;
