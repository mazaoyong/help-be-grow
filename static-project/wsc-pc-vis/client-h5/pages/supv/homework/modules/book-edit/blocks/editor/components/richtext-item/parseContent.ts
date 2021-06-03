interface IContent {
  type: 'text' | 'image';
  content: string;
}

export function parseContent(content: string): any[] {
  return [content];
}
