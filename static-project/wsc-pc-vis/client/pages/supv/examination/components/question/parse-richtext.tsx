import React from 'react';
import styles from './index.m.scss';
import { previewImage } from 'zent';

type RichTextType = 'p' | 'img' | 'iframe' | 'strong' | 'br' | 'a' | '';

interface IParsedData {
  type: RichTextType;
  text: string;
  nodes: IParsedData[];
  src?: string;
  attr?: string;
}

interface IRichTextProps {
  parsed: IParsedData[];
  preview?: (src: string) => void;
  parentType?: RichTextType;
  textWrap?: boolean;
  root?: boolean;
}

export interface IParseRichTextProps {
  richtext: string;
  context?: string[];
  textWrap?: boolean;
}

const mediaType: RichTextType[] = ['img', 'iframe'];

const RichText = (props: IRichTextProps) => {
  const { parsed, preview, textWrap = false, root = true } = props;
  return (
    <div className={styles.richtext}>
      {parsed.map((item, index) => {
        const { type, src, text, attr } = item;
        const comp: JSX.Element[] = [];
        // 前一个元素是否是图片或视频元素
        let prevIsMedia = index > 0 && mediaType.includes(parsed[index - 1].type);

        // 非媒体元素如果前一个是媒体元素需要加换行
        if (prevIsMedia && !mediaType.includes(type) && type !== 'br') {
          comp.push(<br key={0} />);
        } else if (mediaType.includes(type) && index === 0 && !root) {
          comp.push(<br key={0} />);
        }

        switch (type) {
          case 'p':
            if (textWrap) {
              comp.push(<p key={1}>{text}</p>);
            } else {
              comp.push(<span key={1}>{text}</span>);
            }
            break;
          case 'strong':
            comp.push(<strong key={1}>{text}</strong>);
            break;
          case 'img':
            if (!prevIsMedia && index > 0) {
              comp.push(<br key={0} />);
            }
            comp.push(<img key={1} src={src} onClick={() => preview && preview(src || '')} />);
            break;
          case 'iframe':
            if (!prevIsMedia && index > 0) {
              comp.push(<br key={0} />);
            }
            comp.push(<iframe key={1} src={src} allowFullScreen={true} frameBorder={0}></iframe>);
            break;
          case 'br':
            comp.push(<br key={1} />);
            break;
          case 'a':
            const attrArr = (attr || '').split(/\s+/).filter(item => item.length > 0);
            const attrProps = {};
            attrArr.forEach(item => {
              const keyValues = item.split('=');
              (keyValues[0] === 'class') && (keyValues[0] = 'className');
              attrProps[keyValues[0]] = keyValues[1].replace(/"/g, '');
            });
            comp.push(<a key={1} {...attrProps}>{
              <RichText
                key={2}
                parentType={type}
                parsed={item.nodes}
                textWrap={textWrap}
                root={false}
              />}</a>);
            break;
          default:
            text && comp.push(<span key={1}>{text}</span>);
            break;
        }

        if (item.nodes.length > 0 && type !== 'a') {
          comp.push(
            <RichText
              key={2}
              parentType={type}
              parsed={item.nodes}
              preview={preview}
              textWrap={textWrap}
              root={false}
            />,
          );
        }

        // 媒体元素如果是最后一个元素需要加一个换行
        if (mediaType.includes(type) && index === parsed.length - 1) {
          comp.push(<br key={3} />);
        }
        return comp;
      })}
    </div>
  );
};

const RecursiveGetImageUrl = (arr: string[], parsed: IParsedData[]) => {
  parsed.forEach((item) => {
    if (item.type === 'img') {
      arr.push(item.src || '');
    }
    if (item.nodes.length > 0) {
      RecursiveGetImageUrl(arr, item.nodes);
    }
  });
  return arr;
};

const ParseRichText = (props: IParseRichTextProps) => {
  const { richtext, context, textWrap } = props;
  try {
    const parsedObj = JSON.parse(richtext);
    const parsed = parsedObj.parsed;
    // 如果没有parsed字段，那么返回origin
    if (!parsed || parsed.length === 0) {
      if (parsedObj.origin !== undefined) {
        return parsedObj.origin;
      }
      return richtext;
    }

    // 如果有上下文，需要遍历所有图片
    let imgArr: string[] = [];
    if (context) {
      const allParsed = context.map((item) => JSON.parse(item).parsed);
      allParsed.forEach((par) => RecursiveGetImageUrl(imgArr, par));
    } else {
      RecursiveGetImageUrl(imgArr, parsed);
    }
    const preview = (src: string) => {
      previewImage({
        images: imgArr,
        index: imgArr.indexOf(src),
        scaleRatio: 3,
      });
    };
    return <RichText parsed={parsed} preview={preview} textWrap={textWrap} />;
  } catch (e) {}
  return richtext;
};

export default ParseRichText;
