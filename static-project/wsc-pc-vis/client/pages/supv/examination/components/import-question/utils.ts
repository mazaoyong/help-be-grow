export class NumberSet {
  private _table: Record<string, number>;
  private _size: number;
  private _order: number;

  constructor(items: number[] = []) {
    let _order = 0;
    let _size = 0;
    this._table = items.reduce((table, item) => {
      const key = String(item);
      if (!(key in table)) {
        table[key] = _order++;
        _size++;
      }
      return table;
    },
    Object.create(null)
    );
    this._order = _order;
    this._size = _size;
  }

  has(item: number): boolean {
    return (String(item) in this._table);
  }

  add(item: number): NumberSet {
    if (!(this.has(item))) {
      this._table[String(item)] = this._order++;
      this._size++;
    }
    return this;
  }

  delete(item: number): Boolean {
    if (!this.has(item)) {
      return false;
    }
    delete this._table[String(item)];
    this._size--;
    return true;
  }

  get size(): number {
    return this._size;
  }

  keys(): number[] {
    return this.values();
  }

  values(): number[] {
    const _table = this._table;
    return Object.keys(_table)
      .sort((a, b) => _table[a] - _table[b])
      .map((value) => Number(value));
  }

  clear(): void{
    this._order = 0;
    this._size = 0;
    this._table = Object.create(null);
  }

  // not implemented: [@@iterator] , forEach(), entries()
}

interface INode {
  type:string;
  text?:string;
  nodes: INode[]
}

const getText :(parsed: INode[])=>string = (parsed) => {
  let result = '';
  parsed.forEach((node) => {
    switch (node.type) {
      case 'img':
        result += '[图片]';
        break;
      case 'video':
      case 'iframe':
        result += '[视频]';
        break;
      default:
        result += String(node.text || '');
    }
    result += getText(node.nodes);
  });
  return result;
};

export const parseRichTextJson: (jsonText: string) => string = (jsonText) => {
  try {
    const { parsed, origin = '-' } = JSON.parse(jsonText);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return origin;
    }
    return getText(parsed) || '-';
  } catch {
    return '-';
  }
};
