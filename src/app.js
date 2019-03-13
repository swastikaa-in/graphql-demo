//Import Framrework / Libraries
import jwt from 'jsonwebtoken';
import express from 'express';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import cors from 'cors';
import 'dotenv/config';
const AuthenticatedDirective = require('./directives/AuthenticatedDirective')
const HasRoleDirective = require('./directives/HasRoleDirective')


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
                'Token Invalid or Expired. Please Pass Valid Token.',
            );
        }
    }else{
         throw new AuthenticationError('Request Not Authenticated. Provide Valid Token!')
    }
};
const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
     schemaDirectives: {
     isAuthenticated: AuthenticatedDirective,
     hasRole:HasRoleDirective
    // custom name for @hasRole
    //hasRole: customAuth().hasRole,
  },

    context: async ({ req }) => {
        const me = await getMe(req);
        console.log(' in context me is:' + me);
        return {
            models,
            me,
            secret: process.env.SECRET
        };
    }
  
    
});

server.applyMiddleware({ app, path: '/' });

app.use(cors());


app.listen({ port: 8000 }, () => {
    console.log('Apollo Server on http://localhost:8000');
});
