import {  ForbiddenError } from 'apollo-server-express';
import { AccessDeniedError } from '../errors/AccessDeniedError';

const { SchemaDirectiveVisitor } = require('apollo-server-express')
    const { defaultFieldResolver } = require('graphql')

    class HasRoleDirective extends SchemaDirectiveVisitor {
  visitObject(type) {
    this.ensureFieldsWrapped(type);
    type._requiredAuthRole = this.args.role;
  }
  // Visitor methods for nested types like fields and arguments
  // also receive a details object that provides information about
  // the parent and grandparent types.
  visitFieldDefinition(field, details) {
    this.ensureFieldsWrapped(details.objectType);
    field._requiredAuthRole = this.args.role;
  }

  ensureFieldsWrapped(objectType) {
    // Mark the GraphQLObjectType object to avoid re-wrapping:
    if (objectType._authFieldsWrapped) return;
    objectType._authFieldsWrapped = true;

    const fields = objectType.getFields();

    Object.keys(fields).forEach(fieldName => {
      const field = fields[fieldName];
      const { resolve = defaultFieldResolver } = field;
      field.resolve = async function (...args) {
        // Get the required Role from the field first, falling back
        // to the objectType if no Role is required by the field:
        const requiredRole =
          field._requiredAuthRole ||
          objectType._requiredAuthRole;

		 console.log('***requiredRole :' + requiredRole);
		 
        if (! requiredRole) {
     	  console.log('**Not Required Role');
          return resolve.apply(this, args);
        }

        const context = args[2];
        const userRoles = context.me.roles;
        console.log('**userRole is:' + userRoles);

		if (userRoles.indexOf(requiredRole) == -1) {
				//return null;
        console.log('Does Not Have Required Role');
              throw new ForbiddenError('Access Denied- 403');
            }
		
        return resolve.apply(this, args);
      };
    });
  }
}

    module.exports = HasRoleDirective