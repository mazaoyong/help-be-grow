import { QuestionScene } from '../../constants';
import { THeaderConfig } from './Header';
import { TContentConfig } from './Content';

interface IScenePieceConfig {
  scene: Symbol;
  headerConfig?: THeaderConfig;
  contentConfig?: TContentConfig;
}
export const SCENE_PIECE_CONFIG: IScenePieceConfig[] = [
  {
    scene: QuestionScene.EDITSCORE,
    headerConfig: {
      ShowScore: true,
      ShowToolBar: true,
      ScoreEdit: true,
      ShowResult: false,
      ShowRules: true,
      ToolbarDisabled: false,
    },
    contentConfig: {
      ShowAnswer: true,
      ShowOptions: true,
      ShowStudentAnswer: false,
      ShowComment: false,
      CommentEdit: false,
      AnswerLabelWidthFixed: false,
    }
  },
  {
    scene: QuestionScene.REVIEW,
    headerConfig: {
      ShowScore: true,
      ShowToolBar: false,
      ScoreEdit: false,
      ShowResult: true,
      ShowRules: false,
      ToolbarDisabled: false,
    },
    contentConfig: {
      ShowAnswer: true,
      ShowOptions: true,
      ShowStudentAnswer: true,
      ShowComment: true,
      CommentEdit: true,
      AnswerLabelWidthFixed: true,
    }
  },
  {
    scene: QuestionScene.STATISTICS,
    headerConfig: {
      ShowScore: false,
      ShowToolBar: false,
      ScoreEdit: false,
      ShowResult: false,
      ShowRules: false,
      ToolbarDisabled: false,
      Foldable: true,
      ShowCorrectRate: true,
    },
    contentConfig: {
      ShowAnswer: true,
      ShowOptions: true,
      ShowStudentAnswer: false,
      ShowComment: false,
      CommentEdit: false,
      AnswerLabelWidthFixed: false,
      ShowChosenRate: true,
    }
  }
];
