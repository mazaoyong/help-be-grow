# 业务级公用方法

## 文件内容

| 文件     | 说明               |
| -------- | ------------------ |
| auth     | 权限相关方法       |
| date     | 时间处理相关方法   |
| new-ajax | ajax 请求方法      |
| currency | 货币单位转换       |
| dom      | dom 操作方法       |
| format   | 格式化相关方法     |
| router   | 路由封装方法       |
| chain    | 连锁相关方法和组件 |
| image    | 图片处理方法       |
| qrcode   | 二维码处理         |
| text     | 字符串处理         |

## 模块描述

### fns/text

#### caculate

> 这个方法用于统计字符串的长度，可以通过指定maxium来判断字符长度是否超出特定的值，如果为0，表示infinity

1. 主要方法 getTextLengthAndPos

> 方法描述：主要用于统计字符串长度

```typescript
function getTextLengthAndPos(
  text: string,
  options?: IGetTextLengthAndPosOptions
): [length: number, overflowPos: number];
// 如果指定了maxium，如果字符串长度超出了最大长度，那么length的值会是-1，overflowPos也会是真正超出长度的位置

interface IGetTextLengthAndPosOptions {
  /** 多少英文字母等于一个汉字，默认为2个字母为统计为一个字 */
  convertEngChar?: number;
  /** 需要统计的最大数字 */
  maxium?: number;
}
```

如果需要统计字符串长度，请使用这个方法

2. isOverflow

> 方法描述：用于判断一个字符串是否超出长度

```typescript
function isOverflow(text: string, maxium: number): boolean;
```

这个方法内部调用`getTextLengthAndPos`来计算，如果只是单纯判断是否超出某个长度，可以用这个，如果需要指定中英文字符的不同权重，那么请用`getTextLengthAndPos`方法。

3. clipOverflowPart

> 方法描述：裁剪字符串

```typescript
function clipOverflowPart(
  text: string,
  limitation: number,
  suffix = '...'
): [isOverflow: boolean, clipedWithSuffix: string];
```

这个方法同样调用`getTextLengthAndPos`方法，然后返回值中会返回一个带有后缀的裁剪后的字符串(`clipedWithSuffix`)