import jwt from 'jsonwebtoken';
import { AuthenticationError, ForbiddenError, UserInputError } from 'apollo-server';
import _ from 'lodash';

const createToken = async (user, secret, expiresIn) => {
    const { id, email, username, roles } = user;
    return await jwt.sign({ id, email, username, roles }, secret, {
        expiresIn,
    });
};

export default {
    Mutation: {
        signIn: async (
            parent,
            { login, password },
            { models, secret },
        ) => {
            const users = Object.values(models.users);
            const pos = _.findIndex(users, { 'username': login, 'password': password });
            if (pos == -1) {
                throw new UserInputError(
                    'Invalid Username/Password. Access Denied',
                );
            }
            const user = users[pos];
            return { token: createToken(user, secret, '30m') };
        },

    },
    Query: {
        users: (parent, args, { models, me }) => {
            if (!me) {
                throw new AuthenticationError('Not authenticated as user(401).');
            }
            const curRoles = me.roles;
            if (curRoles.indexOf('ADMIN') == -1) {
                throw new ForbiddenError('Access Denied(403).');
            }
            return Object.values(models.users);
        },
        user: (parent, { id }, { models, me }) => {
            if (!me) {
                throw new AuthenticationError('Not authenticated as user(401).');
            }
            const curRoles = me.roles;
            if (curRoles.indexOf('ADMIN') == -1) {
                throw new ForbiddenError('Access Denied(403).');
            }
            return models.users[id];
        },
        me: (parent, args, { me }) => {
            return me;
        },
    },

    User: {
        messages: (user, args, { models }) => {
            return Object.values(models.messages).filter(
                message => message.userId === user.id,
            );
        },
    },
};