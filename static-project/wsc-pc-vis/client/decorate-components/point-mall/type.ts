export interface IChooseGoodsProps {
  visiblity: boolean;
  onClose: (...args) => void;
  onConfirm: (...args) => void;
}

export interface IPointMallEditorProps {
  visiblity: boolean;
  meta: Record<string, any>; // setMetaProperty
}
