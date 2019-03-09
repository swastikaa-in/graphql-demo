import express from 'express';

import { ApolloServer } from 'apollo-server-express';

import schema from './schema';
import resolvers from './resolvers';
import models from './models';

import cors from 'cors';
import uuidv4 from 'uuid/v4';
const app = express();



const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: {
        models,
        me: models.users[1],
  },
});

server.applyMiddleware({ app, path: '/graphql' });

app.use(cors());

app.listen({ port: 8000 }, () => {
    console.log('Apollo Server on http://localhost:8000/graphql');
});
