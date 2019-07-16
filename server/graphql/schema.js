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
    onConnect: async ({ token, refreshToken }, webSocket, context) => {
      console.log(`subscription client connected.`);
      if (token && refreshToken) {
        let user = null;

        try {
          const payload = jwt.verify(token, SECRET);
          user = payload.user;
        } catch (err) {
          const newTokens = await refreshTokens(
            token,
            refreshToken,
            models,
            SECRET,
            SECRET2
          );
          user = newTokens.user;
        }
        if(!user) {
          throw new Error('invalid auth tokens')
        }

        return true;
      } else {
        throw new Error('missing auth tokens');
      }
    },
    onDisconnect: async (webSocket, context) => {
      console.log(`subscription client disconnected.`);
    },
  },
});

export default SERVER;
