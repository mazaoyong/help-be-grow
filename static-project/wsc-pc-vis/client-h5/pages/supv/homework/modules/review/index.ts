import { createModule } from '@youzan/tany-vue';
import RootComponent from './Root';
import RootModel from './Root.model';
import './style.scss';

const ModuleBookEdit = createModule(RootComponent, RootModel);

export default ModuleBookEdit;
