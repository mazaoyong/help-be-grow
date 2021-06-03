let index = 0;
// export const addIndex<T> = (list: object[]): T[] => {
//   return list.map(o => {
//     return {
//       ...o,
//       uploaderFileIndex: ++index,
//     };
//   });
// };

export function addIndex<R>(list: R[]): R[] {
  return list.map(o => {
    return {
      ...o,
      uploaderFileIndex: ++index,
    };
  });
}

export function removeIndex<R>(list: R[]): R[] {
  return list.map((o: any) => {
    delete o.uploaderFileIndex;
    return o;
  });
};
