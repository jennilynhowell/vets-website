import { transformForSubmit } from 'us-forms-system/lib/js/helpers';
import environment from '../../../platform/utilities/environment';

function transform(formConfig, form) {
  const newCase = JSON.parse(transformForSubmit(formConfig, form));
  return JSON.stringify({
    newCase
  });
}

export function submit(form, formConfig) {
  const headers = {
    'Content-Type': 'application/json',
    'X-Key-Inflection': 'snake',
  };

  const body = transform(formConfig, form);

  return fetch(`${environment.API_URL}/v0/time_of_need/time_of_need_submission`, {
    body,
    headers,
    method: 'POST'
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }

    return new Error('vets_client_error: Network request failed');
  }).catch(respOrError => {
    if (respOrError instanceof Response) {
      return new Error(`vets_server_error: ${respOrError.statusText}`);
    }

    return respOrError;
  });
}

