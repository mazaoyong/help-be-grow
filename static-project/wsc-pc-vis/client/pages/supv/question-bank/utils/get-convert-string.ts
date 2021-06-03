import { IRichTextJSON, IParagraph } from '@ability-center/supv/question-bank';

const testJSON = /^{".*}$/;
function getConvertString(
  originValue: string,
  predicate: (value: IParagraph) => string,
): string {
  try {
    if (testJSON.test(originValue)) {
      const convertedJSON: IRichTextJSON = JSON.parse(originValue);
      const { origin, parsed } = convertedJSON;
      if (Array.isArray(parsed) && parsed.length) {
        return parsed.map(predicate).join('');
      }
      return origin;
    }
    return originValue;
  } catch (err) {
    console.error('转换富文本出错，使用原始字符传初始化');
    console.error('[error string]', originValue);
    return originValue;
  }
}

export default getConvertString;
