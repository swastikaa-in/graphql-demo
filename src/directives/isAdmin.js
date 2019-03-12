import {  ForbiddenError } from 'apollo-server-express';

const { SchemaDirectiveVisitor } = require('apollo-server-express')
    const { defaultFieldResolver } = require('graphql')

    class IsAdminDirective extends SchemaDirectiveVisitor {
      visitFieldDefinition (field) {
		  
		  console.log('In ADMIN Directive visitFieldDefinition...');
        const { resolve = defaultFieldResolver } = field

        field.resolve = async function (...args) {
          // extract user from context
          const { me } = args[2]
		  
		  console.log('In ADMIN Directive ,me is:'+ me);
		  

          if (!me) {
			   console.log('In ADMIN Directive throwing Error ');
            throw new Error('You are not authenticated!')
          }

		    const curRoles = me.roles;
			 console.log('In ADMIN Directive curRoles is: ' + curRoles);
            if (curRoles.indexOf('ADMIN') == -1) {
				return "403-Access Denied";
            }
        
 console.log('In ADMIN Directive applying...');
          return resolve.apply(this, args)
        }
      }
    }

    module.exports = IsAdminDirective