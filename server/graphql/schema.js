import { ApolloServer } from 'apollo-server-express';
import models from '../models';
import TYPEDEFS from './types';
import RESOLVERS from './resolvers';
import config from '../config';
import { connect } from 'net';

const { SECRET, SECRET2 } = config;

const SERVER = new ApolloServer({
  typeDefs: TYPEDEFS,
  resolvers: RESOLVERS,
  context: ({ req, connection }) => {
    if (connection) {
      return {
        ...connection.context,
        models,
        SECRET,
        SECRET2,
      };
    } else {
      return {
        models,
        user: req.user,
        SECRET,
        SECRET2,
      };
    }
  },
  playground: {
    settings: {
      'editor.theme': 'dark',
    },
  },
  subscriptions: {
    path: '/subscriptions',
    onConnect: async (connectionParams, webSocket, context) => {
      console.log(
        `subscription client connected.`
      );
    },
    onDisconnect: async (webSocket, context) => {
      console.log(`subscription client disconnected.`);
    },
  },
});

export default SERVER;
