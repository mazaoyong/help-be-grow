import { IJsonToken, JsonTypeEmus } from './lexer';
interface IJsonColorizeOpts {
    colors?: Record<string, string>;
}
export declare function colorize(tokens: IJsonToken[], options?: IJsonColorizeOpts): {
    type: JsonTypeEmus;
    value: string;
    color: string;
}[];
export {};
