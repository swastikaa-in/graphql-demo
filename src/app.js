import jwt from 'jsonwebtoken';


import express from 'express';

import { ApolloServer,AuthenticationError } from 'apollo-server-express';

import schema from './schema';
import resolvers from './resolvers';
import models from './models';

import cors from 'cors';

const app = express();
import 'dotenv/config';

const getMe = async req => {
  const token = req.headers['x-token'];

  if (token) {
    try {
      return await jwt.verify(token, process.env.SECRET);
    } catch (e) {
      throw new AuthenticationError(
        'Your session expired. Sign in again.',
      );
    }
  }
};
const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: async ({ req }) => {
        const me = await getMe(req);

        return {
            models,
            me,
            secret: process.env.SECRET,
        };
  },
});

server.applyMiddleware({ app, path: '/graphql' });

app.use(cors());

app.listen({ port: 8000 }, () => {
    console.log('Apollo Server on http://localhost:8000/graphql');
});
