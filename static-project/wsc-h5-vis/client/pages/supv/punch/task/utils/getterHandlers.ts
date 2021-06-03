type DiaryType = { id: number } & Record<string, any>;
export function getDiaryWithoutMyDiaryId<T extends DiaryType[] = any[]>(
  sourceDiaryList: T,
  myDiaryId: number
): T {
  if (myDiaryId > 0) {
    return sourceDiaryList.filter(diary => diary.id !== myDiaryId) as T;
  }
  return sourceDiaryList;
}
