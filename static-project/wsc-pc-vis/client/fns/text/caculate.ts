interface IGetTextLengthAndPosOptions {
  /** 多少英文字母等于一个汉字，默认为2个字母为统计为一个字 */
  convertASCIIChar?: number;
  /** 需要统计的最大数字 */
  maxium?: number;
}

/**
 * 统计字符串的长度
 *
 * @author ChangeHow
 * @param {string} text 需要统计的字符串
 * @param {any} options 配置选项，可以配置多少英文等效为一个中文字符等……
 * @return {number[]} 返回字符串长度，如果返回-1表示超出限制长度
 */
export function getTextLengthAndPos(text: string, options?: IGetTextLengthAndPosOptions): number[] {
  if (!text) {
    return [0, 0];
  }
  const OPTIONS: Required<IGetTextLengthAndPosOptions> = Object.assign({
    convertASCIIChar: 2,
    maxium: 0,
  }, options);

  // z
  const CHARCODE_END = 122;
  // 0
  const CHARCODE_START = 48;

  const splitedText = text.split('');
  const splitedTextLength = splitedText.length;
  const MAXIUM = OPTIONS.maxium * OPTIONS.convertASCIIChar;
  if (MAXIUM > 0) {
    // 有最大限制
    let sum = 0;
    for (let index = 0; index < splitedTextLength; index++) {
      const currentChar = text.charCodeAt(index);
      if (currentChar >= CHARCODE_START && currentChar <= CHARCODE_END) {
        sum += 1;
      } else {
        sum += OPTIONS.convertASCIIChar;
      }
      if (sum > MAXIUM) {
        return [-1, index];
      }
    }
  }

  return [splitedTextLength, splitedTextLength - 1];
}

/**
 * 判断字符串是否超出某个长度
 *
 * @author ChangeHow
 * @param {string} text 需要判断的字符串
 * @param {number} limitation 限制长度
 * @param {number} convertASCIIChar 一个中文字符等于几个英文字符长度
 * @return {boolean}
 */
export function isOverflow(text: string, limitation: number, convertASCIIChar: number = 2): boolean {
  const textLengthAndPos = getTextLengthAndPos(text, { maxium: limitation, convertASCIIChar })[0];
  return textLengthAndPos === -1;
}

/**
 * 裁剪字符串
 *
 * @author ChangeHow
 * @param {string} text 需要判断的字符串
 * @param {number} limitation 限制长度
 * @param {string} [suffix='...'] 后缀
 * @return {[boolean, string]} [是否超出规定字符数，切割后的字符串]
 */
export function clipOverflowPart(text: string, limitation: number, suffix = '...'): [boolean, string] {
  const textLengthAndPos = getTextLengthAndPos(text, { maxium: limitation });
  if (textLengthAndPos[0] === -1) {
    return [true, text.substring(0, textLengthAndPos[1]) + suffix];
  }
  return [false, text];
}

// 手机号脱敏
export function desensitivePhone(phone: string) {
  if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(phone))){  
    return phone; 
  }
  return phone.replace(/([\d]{3})[\d]{4}([\d]{4})/, '$1****$2');
}