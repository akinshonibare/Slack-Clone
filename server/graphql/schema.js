import { ApolloServer } from 'apollo-server-express';
import models from '../models';
import TYPEDEFS from './types';
import RESOLVERS from './resolvers';
import config from '../config';

const { SECRET, SECRET2 } = config;

const SERVER = new ApolloServer({
  typeDefs: TYPEDEFS,
  resolvers: RESOLVERS,
  context: ({ req }) => ({
    models, user: req.user, SECRET, SECRET2,
  }),
  playground: {
    endpoint: `http://localhost:${process.env.PORT || 3000}/graphql`,
    settings: {
      'editor.theme': 'dark',
    },
  },
});

export default SERVER;
