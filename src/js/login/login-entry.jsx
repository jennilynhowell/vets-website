import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';

import initReact from '../common/init-react';

import Main from './containers/Main';

require('../common');  // Bring in the common javascript.

export default function createLoginWidget(store) {
  function init() {
    ReactDOM.render((
      <Provider store={store}>
        <Main/>
      </Provider>
      ), document.getElementById('login-root'));
  }

  initReact(init);
}
