import { createRoutes as createFormRoutes } from 'us-forms-system/lib/helpers';

import { addSaveInProgressRoutes } from '../common/schemaform/save-in-progress/helpers';

import formConfig from './config/form';
import HealthCareApp from './HealthCareApp.jsx';

const route = {
  path: '/',
  component: HealthCareApp,
  indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
  childRoutes: addSaveInProgressRoutes(formConfig, createFormRoutes(formConfig)),
};

export default route;
