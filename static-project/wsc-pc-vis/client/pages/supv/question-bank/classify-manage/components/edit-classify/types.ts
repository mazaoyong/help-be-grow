interface IAddClassifyProps {
  type: 'add';
  parentId?: number;
}

interface IModifyClassifyProps {
  type: 'edit';
  name: string;
  id: number;
}

export type IEditClassifyProps = IAddClassifyProps | IModifyClassifyProps;

interface IAddClassifyData {
  type: 'add';
  parentId: number;
  name: string;
}

interface IModifyClassifyData {
  type: 'edit';
  id: number;
  name: string;
}

export type IEditClassifyData<T = ''> = T extends 'add'
  ? IAddClassifyData
  : T extends 'edit'
    ? IModifyClassifyData
    : IAddClassifyData | IModifyClassifyData;
