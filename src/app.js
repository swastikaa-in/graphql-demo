//Import Framrework / Libraries
import jwt from 'jsonwebtoken';
import express from 'express';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import cors from 'cors';
import 'dotenv/config';
//const IsAdminDirective = require('./directives/isAdmin')
const AuthorizationDirective = require('./directives/AuthorizationDirective')


//Import Application Specific Schemas,Resolvers and Models
import schema from './schema';
import resolvers from './resolvers';
import models from './models';


const app = express();

const getMe = async req => {
    const token = req.headers['x-token'];
    if (token) {
        try {
             return await jwt.verify(token, process.env.JWT_SECRET);
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
	schemaDirectives: {
		auth: AuthorizationDirective
     },
    context: async ({ req }) => {
        const me = await getMe(req);
        return {
            models,
            me,
            secret: process.env.SECRET,
        };
    },
    /*formatError: error => {
        console.log(error);
        //delete error.locations;
        showLocations: false,
        delete error.extensions.exception;
        
        return error;
    }*/
    formatError(err) {
        console.log(err);
        return {
            code:err.extensions.code,
            message:err.message + " For Path: " + err.path,
            //developerMessage: err.locations,  
            moreInfo:'testing',
            timestamp:err.message.timestamp
         // message: err.message,
         // path: err.path,
         // code: err.originalError && err.originalError.code // <-- The trick is here
         // locations: err.locations,
         // path: err.path
        }
      }
    
});

server.applyMiddleware({ app, path: '/' });

app.use(cors());


app.listen({ port: 8000 }, () => {
    console.log('Apollo Server on http://localhost:8000/graphql');
});
