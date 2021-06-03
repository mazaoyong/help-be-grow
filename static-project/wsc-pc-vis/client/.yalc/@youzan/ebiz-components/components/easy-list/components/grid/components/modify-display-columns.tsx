import React from 'react';
import { Checkbox, Button } from 'zent';

import Dialog, { IDialogChildrenProps } from '../../../../dialog';

const { openDialog, DialogBody, DialogFooter } = Dialog;
const { Group: CheckboxGroup } = Checkbox;

interface IModifyCustomColumns {
  alternativeColumnNames: string[];
  displayColumnIdxList: number[];
}
const ModifyDisplayColumns: React.FC<IDialogChildrenProps<number[], IModifyCustomColumns>> = (
  props
) => {
  const { alternativeColumnNames, displayColumnIdxList } = props.data;
  const [fullDisplayList] = React.useState(alternativeColumnNames.map((_, idx) => idx));
  const [checkedList, setCheckedList] = React.useState(displayColumnIdxList);

  const handleClick = React.useCallback(() => {
    props.dialogref.submit(checkedList);
  }, [checkedList, props.dialogref]);

  const handleSelectAll = React.useCallback(
    (e: any) => {
      if (e.target.checked) {
        setCheckedList(fullDisplayList);
      } else {
        setCheckedList([]);
      }
    },
    [fullDisplayList]
  );

  const [isCheckedAll, isIndeterminate] = React.useMemo(
    () => [
      checkedList.length === alternativeColumnNames.length,
      checkedList.length > 0 && checkedList.length < alternativeColumnNames.length,
    ],
    [alternativeColumnNames.length, checkedList.length]
  );

  return (
    <div data-testid="custom-columns-dialog" className="custom-columns__container">
      <DialogBody>
        <section>
          <Checkbox
            checked={isCheckedAll}
            indeterminate={isIndeterminate}
            onChange={handleSelectAll}
          >
            全选
          </Checkbox>
        </section>
        <section className="custom-columns__item-box">
          <CheckboxGroup value={checkedList} onChange={setCheckedList}>
            {alternativeColumnNames.map((label, idx) => (
              <div className="custom-columns__item" key={idx}>
                <Checkbox value={idx}>{label}</Checkbox>
              </div>
            ))}
          </CheckboxGroup>
        </section>
      </DialogBody>
      <DialogFooter>
        <Button onClick={props.dialogref.close}>取消</Button>
        <Button type="primary" onClick={handleClick}>
          确定
        </Button>
      </DialogFooter>
    </div>
  );
};

export const openModifyDisplayColumns = (
  data: IModifyCustomColumns & {
    title: string;
  }
) =>
  openDialog(ModifyDisplayColumns, {
    title: data.title,
    data: data,
  });
