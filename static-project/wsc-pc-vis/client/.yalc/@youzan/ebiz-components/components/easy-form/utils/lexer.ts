/**
 * ANNOUNCEMENT
 *
 * CAUSE THE ORIGINAL METHOD CAN'T DISPLAY COLORIZE-JSON IN BROWSER,
 * SO I DUPLICATED FROM [json-colorizer](https://github.com/joeattardi/json-colorizer/blob/master/src/lib/lexer.js)
 * AND MODIFIED IT IN ORDER TO CONVERT JSON TO TOKENS, AND DISPLAY THEM IN BROWSER FINALLY.
 *
 * 声明
 *
 * 以为原始的方法不能将染色后的json字符串展示在浏览器中，所以将原方法
 * [json-colorizer](https://github.com/joeattardi/json-colorizer/blob/master/src/lib/lexer.js)
 * 拷贝并加以修改，最终得到json-token让其能够在浏览器中展示
 *
 * @see json-colorizer https://github.com/joeattardi/json-colorizer/blob/master/src/lib/lexer.js
 * @author Joe Attardi
 */
export enum JsonTypeEmus {
  WHITESPACE = 0,
  NEXT_LINE,
  BRACE,
  BRACKET,
  COLON,
  COMMA,
  NUMBER_LITERAL,
  STRING_KEY,
  STRING_LITERAL,
  BOOLEAN_LITERAL,
  NULL_LITERAL,
}
const tokenTypes = [
  { regex: /^\s+/, tokenType: JsonTypeEmus.WHITESPACE },
  { regex: /^[{}]/, tokenType: JsonTypeEmus.BRACE },
  { regex: /^[[\]]/, tokenType: JsonTypeEmus.BRACKET },
  { regex: /^:/, tokenType: JsonTypeEmus.COLON },
  { regex: /^,/, tokenType: JsonTypeEmus.COMMA },
  { regex: /^-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/i, tokenType: JsonTypeEmus.NUMBER_LITERAL },
  { regex: /^"(?:\\.|[^"\\])*"(?=\s*:)/, tokenType: JsonTypeEmus.STRING_KEY },
  { regex: /^"(?:\\.|[^"\\])*"/, tokenType: JsonTypeEmus.STRING_LITERAL },
  { regex: /^true|^false/, tokenType: JsonTypeEmus.BOOLEAN_LITERAL },
  { regex: /^null/, tokenType: JsonTypeEmus.NULL_LITERAL },
];

interface IJsonGetTokensOptions {
  pretty?: boolean;
}
export interface IJsonToken {
  type: JsonTypeEmus;
  value: string;
}
type JsonLikeType = Record<string, any> | Object;
export function getTokens(json: JsonLikeType, options: IJsonGetTokensOptions = {}) {
  let input;

  if (options.pretty) {
    const inputObj = typeof json === 'string' ? JSON.parse(json) : json;
    input = JSON.stringify(inputObj, null, 4);
  } else {
    input = typeof json === 'string' ? json : JSON.stringify(json);
  }

  let tokens: IJsonToken[] = [];
  let foundToken: boolean;

  do {
    foundToken = false;
    for (let i = 0; i < tokenTypes.length; i++) {
      const match = tokenTypes[i].regex.exec(input);
      if (match) {
        const type = tokenTypes[i].tokenType;
        let value = match[0];
        if (type === JsonTypeEmus.WHITESPACE) {
          const newLineSymbol = value.match(/^[\r\n]/);
          if (newLineSymbol) {
            // 如果匹配到换行符，不管几个，都添加一个换行标记
            tokens.push({ type: JsonTypeEmus.NEXT_LINE, value: '<br/>' });
          }
          value = value.replace(/[\r\n]/g, '').replace(/\s/g, '&nbsp;');
        }
        tokens.push({ type, value });
        input = input.substring(match[0].length);
        foundToken = true;
        break;
      }
    }
  } while (_allTokensAnalyzed(input, foundToken));

  return tokens;
}

/**
 * @author Willian Magalhães Gonçalves
 * @description Are all tokens analyzed?
 * @private
 */
function _allTokensAnalyzed(input: any, foundToken: boolean): boolean {
  const safeInput = input || {};

  const inputLength = safeInput.length;
  return inputLength > 0 && foundToken;
}
