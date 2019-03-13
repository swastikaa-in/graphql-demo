import {  AuthenticationError } from 'apollo-server-express';

const { SchemaDirectiveVisitor } = require('apollo-server-express')
    const { defaultFieldResolver } = require('graphql')

    class AuthenticatedDirective extends SchemaDirectiveVisitor {
      visitFieldDefinition (field) {
		  
		  console.log('In AuthDirective visitFieldDefinition...');
        const { resolve = defaultFieldResolver } = field

        field.resolve = async function (...args) {
          // extract user from context
          const { me } = args[2]
		  
		 
		  

          if (!me) {
			console.log('No Valid token in Request... ');
            throw new AuthenticationError('Request Not Authenticated. Provide Valid Token!')
          }
		   console.log('In Auth Directive ,me is:'+ me);

		   
        

          return resolve.apply(this, args)
        }
      }
    }

    module.exports = AuthenticatedDirective