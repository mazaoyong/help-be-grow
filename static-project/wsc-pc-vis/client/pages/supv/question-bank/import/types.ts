export interface IQuestionImportPageProps {
  handleTabChange: (id: number) => void;
  onNextStep?: (() => void) | null;
}
