import { createModule } from '@youzan/tany-vue';
import FormModel from './models/form';
import Root from './Root';
import './style.scss';

const ModuleBookEdit = createModule(Root, FormModel);

export default ModuleBookEdit;
