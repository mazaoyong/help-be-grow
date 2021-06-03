import { IRichTextJSON, IParagraph } from '@ability-center/supv/question-bank';
/**
 * 该方法用于将富文本解析成JSON对象
 *
 * @param {string} text 原始字符串
 * @return {IRichTextJSON}
 */
function parseRichtext2JSON(text: string): IRichTextJSON {
  const trimText = text.replace(/\r|\n|\t|(\s*?(?=<))/g, '');
  // 替换iframe标签为video

  try {
    const stack: string[] = [];
    const paragraphs = recursionMatchParagraphs(trimText, stack);

    if (paragraphs.length) {
      paragraphs.forEach(mapAssets);
    }
    // 替换图片中的属性为size
    return {
      origin: removeDangerousString(trimText),
      parsed: paragraphs,
    };
  } catch (err) {
    console.error(err);
    return {
      origin: removeDangerousString(trimText),
      parsed: [],
    };
  }
}

export default parseRichtext2JSON;

// 移除xss包对序列化之后的
function removeDangerousString(originStr: string): string {
  let filterString = originStr;
  // js-xss 包对 target 解析会将序列化之后的文本默认添加上引号
  filterString = filterString.replace(/target=([^\s]*?)\s/, '');
  return filterString;
}

function getDecodeHTMLString(originStr: string): string {
  return originStr.replace(/&nbsp;/g, ' ');
}

const baseTagStartMatcher = '<(\\w+)([^<]*)>';
const baseTagCloseMatcher = '<\\/(\\w+)>';
const baseSelfMatcher = '^<(\\w*)([^<]*)\\/>';
const tagStartMatcher = new RegExp(`^${baseTagStartMatcher}([^<]*)(.*)`);
const tagCloseMatcher = new RegExp(`^${baseTagCloseMatcher}(.*)`);
const selfCloseTagMatcher = new RegExp(`${baseSelfMatcher}(.*)`);
const pureContentMatcher = /([^<]*)(.*)$/;

function recursionMatchParagraphs(originText: string, stack: string[]): IParagraph[] {
  const paragraphs: IParagraph[] = [];
  const tempParagraphs: IParagraph[] = [];
  let leftText = originText;
  let interrupt = false;

  // 尝试匹配标签开头
  while (!interrupt && (leftText || stack.length)) {
    const isUselessLoop = checkUselessLoop(leftText);
    leftText = matchTagStart(leftText, tempParagraphs, stack);
    leftText = matchTagClose(leftText, paragraphs, tempParagraphs, stack);
    leftText = matchSelfCloseTag(leftText, paragraphs, tempParagraphs, stack);
    leftText = matchPureContent(leftText, paragraphs, tempParagraphs, stack);
    interrupt = isUselessLoop(leftText);
  }
  return paragraphs;
}

function checkUselessLoop(prevText: string) {
  return (curText: string): boolean => {
    return prevText === curText;
  };
}

function matchSelfCloseTag(
  originText: string,
  paragraphs: IParagraph[],
  tempParagraphs: IParagraph[],
  stack: string[],
): string {
  if (originText) {
    const matchedSelfClose = originText.match(selfCloseTagMatcher);
    if (matchedSelfClose) {
      const [, selfCloseTagName, attr, leftText] = matchedSelfClose;
      const tempSelfParagraph: IParagraph = {
        type: selfCloseTagName,
        attr,
        text: '',
        nodes: [],
      };
      if (stack.length) {
        const parentParagraphs = tempParagraphs[stack.length - 1];
        if (parentParagraphs) {
          parentParagraphs.nodes.push(tempSelfParagraph);
        }
      } else {
        paragraphs.push(tempSelfParagraph);
      }

      return leftText;
    }
  }
  return originText;
}

function matchPureContent(
  originText: string,
  paragraphs: IParagraph[],
  tempParagraphs: IParagraph[],
  stack: string[],
): string {
  if (originText) {
    const matchedPureContent = originText.match(pureContentMatcher);
    if (matchedPureContent) {
      const [, pureContent, leftText] = matchedPureContent;
      if (pureContent !== '') {
        const tempSelfParagraph: IParagraph = {
          type: '',
          attr: '',
          text: getDecodeHTMLString(pureContent),
          nodes: [],
        };
        if (stack.length) {
          const parentParagraphs = tempParagraphs[stack.length - 1];
          if (parentParagraphs) {
            parentParagraphs.nodes.push(tempSelfParagraph);
          }
        } else {
          paragraphs.push(tempSelfParagraph);
        }
      }

      return leftText;
    }
  }
  return originText;
}

function matchTagStart(originText: string, tempParagraphs: IParagraph[], stack: string[]): string {
  if (originText) {
    // 尝试匹配下自闭合标签
    const isSelfCloseTag = selfCloseTagMatcher.test(originText);
    const matchedStart = originText.match(tagStartMatcher);
    if (!isSelfCloseTag && matchedStart) {
      const [, openTagName, attr, text, leftText] = matchedStart;
      stack.push(openTagName);
      tempParagraphs.push({
        type: openTagName,
        attr,
        text: getDecodeHTMLString(text),
        nodes: [],
      });
      return leftText;
    }
  }
  return originText;
}

function matchTagClose(
  originText: string,
  paragraphs: IParagraph[],
  tempParagraphs: IParagraph[],
  stack: string[],
): string {
  const matchedClose = originText.match(tagCloseMatcher);
  if (matchedClose) {
    const [, closeTagName, leftText] = matchedClose;
    if (stack.length && tempParagraphs.length) {
      const latestOpenTagName = stack[stack.length - 1];
      if (latestOpenTagName === closeTagName) {
        if (tempParagraphs.length) {
          const [parentParagraphs, currentParagraphs] = tempParagraphs.splice(-2);
          if (currentParagraphs) {
            parentParagraphs.nodes.push(currentParagraphs);
            tempParagraphs.push(parentParagraphs);
          } else {
            paragraphs.push(parentParagraphs);
          }
        }
        stack.pop();
      }
    }
    return leftText;
  }
  return originText;
}

const sourceMatcher = /(src="(.+?)"\s?)/;

const imgSizeMatcher = (property: 'width' | 'height') =>
  new RegExp(`data-origin-${property}=[\\"](\\d+)\\s?`);
const matchWidth = imgSizeMatcher('width');
const matchHeight = imgSizeMatcher('height');
function mapAssets(paragraph: IParagraph) {
  const { type, attr = '', nodes } = paragraph;
  // 添加资源
  const matchedSource = attr.match(sourceMatcher);
  if (matchedSource) {
    const [, replacerStr, source] = matchedSource;
    paragraph.src = source;
    paragraph.attr = attr.replace(replacerStr, '');
  }

  if (type === 'img') {
    const matchedWidth = attr.match(matchWidth);
    const matchedHeight = attr.match(matchHeight);
    if (matchedWidth && matchedHeight) {
      const [, w] = matchedWidth;
      const [, h] = matchedHeight;
      paragraph.size = { w, h };
      delete paragraph.attr;
    }
  }

  if (nodes.length) {
    nodes.forEach(mapAssets);
  }
}
