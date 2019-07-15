import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { createServer } from 'http';
import SCHEMA from './graphql/schema';
import { refreshTokens } from './auth';
import models from './models';
import config from './config';

const { SECRET, SECRET2 } = config;

const app = express();
// enable cors
// const corsOptions = {
//   origin: 'http://localhost:3000',
//   credentials: true,
// };

app.use(cors('*'));

const addUser = async (req, res, next) => {
  const token = req.headers['x-token'];
  if (token) {
    try {
      const { user } = jwt.verify(token, SECRET);
      req.user = user;
    } catch (err) {
      const refreshToken = req.headers['x-refresh-token'];
      const newTokens = await refreshTokens(
        token,
        refreshToken,
        models,
        SECRET,
        SECRET2
      );
      if (newTokens.token && newTokens.refreshToken) {
        res.set('Access-Control-Expose-Headers', 'x-token', 'x-refresh-token');
        res.set('x-token', newTokens.token);
        res.set('x-refresh-token', newTokens.refreshToken);
      }
      req.user = newTokens.user;
    }
  }
  next();
};

app.use(addUser);

SCHEMA.applyMiddleware({
  app,
});

const PORT = process.env.PORT || 3000;

const eraseDatabaseOnSync = false;
const server = createServer(app);

models.sequelize.sync({ force: eraseDatabaseOnSync }).then(() => {

  server.listen(PORT, () => {
    console.log(`http://localhost:${PORT}${SCHEMA.graphqlPath}`);
    console.log(`ws://localhost:${PORT}${SCHEMA.subscriptionsPath}`);

    SCHEMA.installSubscriptionHandlers(server);
  });
});

export default app;
