import React from 'react';
import { Notify, FormControl, Form, IValidators, FormError } from 'zent';
import { IopenDialogOptions } from '@youzan/ebiz-components/es/types/dialog';
import {
  openMoveClassifyDialog as openClassifyListDialog,
  IClassifyTreeItem,
} from '@ability-center/supv/question-bank';

import { IMoveClassifyProps } from '../../../types';
import './styles.scss';

interface ICategoryType {
  categoryName: string;
}
interface ICategoryFieldProps {
  label: string;
  name: string;
  validators?: IValidators<number>;
  selectedCategory?: ICategoryType;
  dialogProps?: IopenDialogOptions<IMoveClassifyProps>;
  needSystemDefault?: boolean;
}

const CategoryField: React.FC<ICategoryFieldProps> = (props) => {
  const {
    name,
    validators,
    dialogProps,
    selectedCategory,
    needSystemDefault = false,
    ...controlProps
  } = props;
  const categoryModel = Form.useField<number>(name, 0, validators);
  const [currentCategory, setCurrentCategory] = React.useState<IClassifyTreeItem>();

  const handleOpenClassifyList = React.useCallback(() => {
    openClassifyListDialog(
      { depPointer: [], showSubtitle: false, needSystemDefault },
      { ...dialogProps },
    )
      .afterClosed()
      .then((categoryData) => {
        categoryModel.value = categoryData.targetId;
        if (categoryData.rowData) {
          // 触发校验
          categoryModel.validate();
          setCurrentCategory(categoryData.rowData);
        }
      })
      .catch((err) => err && Notify.error(err));
  }, [categoryModel, dialogProps, needSystemDefault]);

  const displayCategoryTitle = React.useMemo(() => {
    if (!Number(categoryModel.value)) {
      return '';
    }
    return (
      (currentCategory && currentCategory.title) ||
      (selectedCategory && selectedCategory.categoryName)
    );
  }, [categoryModel.value, currentCategory, selectedCategory]);

  return (
    <FormControl {...controlProps} invalid={!!categoryModel.error} className="base-setting__category-field">
      <section className="category-field__inner">
        <div className="category-name">{displayCategoryTitle}</div>
        <a className="cursor-link" onClick={handleOpenClassifyList}>
          选择
        </a>
      </section>
      {categoryModel.error && <FormError>{categoryModel.error.message}</FormError>}
    </FormControl>
  );
};

export default CategoryField;
