//Import Framework / Libraries
import jwt from 'jsonwebtoken';
import express from 'express';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import cors from 'cors';
import 'dotenv/config';

//Import Application Specific Schemas,Resolvers and Models
import schema from './schema';
import resolvers from './resolvers';
import models from './models';



const app = express();


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
    formatError: error => {
        console.log(error);
        console.log(error.extensions.exception);
        //return new Error('Internal server error');
        // Or, you can delete the exception information
        delete error.extensions.exception;
        return error;
    },
});

server.applyMiddleware({ app, path: '/' });

app.use(cors());


app.listen({ port: 8000 }, () => {
    console.log('Apollo Server on http://localhost:8000/graphql');
});
