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
export declare enum JsonTypeEmus {
    WHITESPACE = 0,
    NEXT_LINE = 1,
    BRACE = 2,
    BRACKET = 3,
    COLON = 4,
    COMMA = 5,
    NUMBER_LITERAL = 6,
    STRING_KEY = 7,
    STRING_LITERAL = 8,
    BOOLEAN_LITERAL = 9,
    NULL_LITERAL = 10
}
interface IJsonGetTokensOptions {
    pretty?: boolean;
}
export interface IJsonToken {
    type: JsonTypeEmus;
    value: string;
}
declare type JsonLikeType = Record<string, any> | Object;
export declare function getTokens(json: JsonLikeType, options?: IJsonGetTokensOptions): IJsonToken[];
export {};
