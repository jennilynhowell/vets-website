// import fullSchema from 'vets-json-schema/dist/XX-XXXXX-schema.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;


const formConfig = {
  urlPrefix: '/',
  submitUrl: '/v0/api',
  trackingPrefix: 'time-of-need',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: 'XX-XXXXX',
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for time of need.',
    noAuth: 'Please sign in again to continue your application for time of need.'
  },
  title: 'Time of Need',
  defaultDefinitions: {},
  chapters: {
    chapter1: {
      title: 'Interment Information',
      pages: {
        page1: {
          path: 'interment-info',
          title: 'Interment Information',
          uiSchema: {
            burialActivityType: {
              'ui:title': 'Burial Type',
            },
            emblem: {
              'ui:title': 'Emblem'
            },
            remainsType: {
              'ui:title': 'Remains Type'
            }
          },
          schema: {
            type: 'object',
            required: [
              'burialActivityType',
              'emblem',
              'remainsType'
            ],
            properties: {
              burialActivityType: {
                type: 'string',
                'enum': [
                  'I',
                  'D',
                  'R',
                  'S',
                  'T'
                ],
                enumNames: [
                  'Interment',
                  'Disinterment',
                  'Reinterment',
                  'Memorial Service Only',
                  'Direct Interment'
                ]
              },
              emblem: {
                type: 'string'
              },
              remainsType: {
                type: 'string'
              }
            }
          }
        }
      }
    }
  }
};

export default formConfig;
