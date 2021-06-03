export const toolBarConfig = [['bold', '|', 'uploadimage', 'insertvideo']];
const LimitationErrorMsg = {
  name: 'limitation',
  message: '文本长度过长',
};
export const limitation = (value: string) => {
  return value.length <= 50000 ? null : LimitationErrorMsg;
};

const transP = (node) => {
  node.tagName = 'p';
  delete node.attrs.style;
};

interface IUEditorConfigProps {
  placeholder?: string;
  autoFloatEnabled?: boolean;
}
export const UEditorConfig = (params: IUEditorConfigProps) => {
  const { placeholder, autoFloatEnabled = true } = params;
  return {
    pasteplain: true,
    autoFloatEnabled,
    initialFrameWidth: 640,
    enableContextMenu: false,
    autoClearinitialContent: !!placeholder,
    maximumWords: 20000,
    initialContent: `<span style="color: #C8C9CC">${placeholder}</span>`,
    filterTxtRules: {
      caption: transP,
      th: transP,
      tr: transP,
      h1: transP,
      h2: transP,
      h3: transP,
      h4: transP,
      h5: transP,
      h6: transP,
    },
  };
};

const toolbarAutoFloatWhiteList: RegExp[] = [/question-bank#\/(edit|create|duplicate)/];
export const isToolbarAutoFloat = () => {
  const href = location.href;
  return toolbarAutoFloatWhiteList.some((whiteList) => whiteList.test(href));
};

export const uploadDefaultConfig = {
  materials: true,
  type: 'image',
  tokenUrl: `${window._global.url.v4}/api/iron/materials/shopPubImgUploadToken.json`,
  maxAmount: 1,
  kdtId: window._global.kdtId,
};
