import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {Router, browserHistory} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
import configureStore from './store';
import 'less';
import {message} from 'antd';
// Create redux store with history
// this uses the singleton browserHistory provided by react-router
// Optionally, this could be changed to leverage a created history
// e.g. `const browserHistory = useRouterHistory(createBrowserHistory)();`
const initialState = {};
const store = configureStore(initialState, browserHistory);

// Sync history and store, as the react-router-redux reducer
// is under the non-default key ("routing"), selectLocationState
// must be provided for resolving how to retrieve the "route" in the state
import {selectLocationState} from 'client/App/selector';
const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: selectLocationState(),
});

// Set up the router, wrapping all Routes in the App component
import App from 'client/App/components/Index';
import createRoutes from './routes';
const rootRoute = {
  component: App,
  childRoutes: createRoutes(store),
};

moment.locale('zh-cn');
message.config({
  duration: 4,
});

ReactDOM.render(
  <Provider store={store}>
    <Router
      history={history}
      routes={rootRoute}
    />
  </Provider>,
  document.getElementById('app')
);
