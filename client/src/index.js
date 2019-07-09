import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import * as serviceWorker from './serviceWorker';
import Router from './router';
import 'antd/dist/antd.css';
import './index.scss';

// eslint-disable-next-line
const GRAPHQL_API_PORT = process.env.REACT_APP_GRAPHQL_API_PORT;
const httpLink = new createHttpLink({ uri: `http://localhost:${GRAPHQL_API_PORT}/graphql` });

const middlewareLink = setContext(() => ({
  headers: {
    'x-token': localStorage.getItem('token'),
    'x-refresh-token': localStorage.getItem('refreshToken'),
  },
}));

const afterwareLink = new ApolloLink((operation, forward) => {
  return forward(operation).map((response) => {
    const {
      response: { headers },
    } = operation.getContext();
    if (headers) {
      const token = headers.get('x-token');
      const refreshToken = headers.get('x-refresh-token');

      if (token) {
        localStorage.setItem('token', token);
      }

      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
    }

    return response;
  });
});

const httpLinkWithMiddleware = afterwareLink.concat(
  middlewareLink.concat(httpLink),
);


const link = httpLinkWithMiddleware;

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

const App = (
  <ApolloProvider client={client}>
    <Router />
  </ApolloProvider>
);

ReactDOM.render(App, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
