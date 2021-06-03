import { IJsonToken, JsonTypeEmus } from './lexer';

const defaultColors: Record<string, string> = {
  [JsonTypeEmus.BRACE]: 'gray',
  [JsonTypeEmus.BRACKET]: 'gray',
  [JsonTypeEmus.COLON]: 'gray',
  [JsonTypeEmus.COMMA]: 'gray',
  [JsonTypeEmus.STRING_KEY]: '#8ce10b',
  [JsonTypeEmus.STRING_LITERAL]: '#ffb900',
  [JsonTypeEmus.NUMBER_LITERAL]: '#008df8',
  [JsonTypeEmus.BOOLEAN_LITERAL]: '#6d43a6',
  [JsonTypeEmus.NULL_LITERAL]: 'white',
};

interface IJsonColorizeOpts {
  colors?: Record<string, string>;
}
export function colorize(tokens: IJsonToken[], options: IJsonColorizeOpts = {}) {
  const colors = options.colors || {};

  return tokens.map((token) => {
    const colorKey = colors[token.type] || defaultColors[token.type];

    return {
      color: colorKey,
      ...token,
    };
  });
}
