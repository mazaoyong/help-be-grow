const baseFileSize = 15000; // excel模板文件原始文件大小
const sizeUnit = 40; // 推算出的一条数据的大小

// 用于学员导入项目导入前，预估excel文件的行数（大致预估）
export default function estimateRows(size: number) {
  if (size <= 0) {
    return 0;
  }
  return Math.ceil(Math.max((size - baseFileSize), 0) / sizeUnit);
};
