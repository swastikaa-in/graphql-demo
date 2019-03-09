import jwt from 'jsonwebtoken';
import { AuthenticationError, UserInputError } from 'apollo-server';

const createToken = async (user, secret, expiresIn) => {
  const { id, email, username } = user;
  return await jwt.sign({ id, email, username }, secret, {
    expiresIn,
  });
};

export default {
    Mutation: {
            signUp: async (
            parent,
            { username, email, password },
            { models, secret },
            ) => {
                    const user = {
                        'username':username,
                        'email':email,
                        'password':password
                    };

            return { token: createToken(user, secret, '30m') };
    },
    signIn: async (
      parent,
      { login, password },
      { models, secret },
    ) => {
       const user = {
                        'username':login,
                        'password':password
                    };

      if (login!=='sri420') {
        throw new UserInputError(
          'No user found with this login credentials.',
        );
      }

     // const isValid = await user.validatePassword(password);

      if (password!=='test123$') {
        throw new AuthenticationError('Invalid password.');
      }

      return { token: createToken(user, secret, '30m') };
    },
 // },
  },
  Query: {
    users: (parent, args, { models }) => {
      return Object.values(models.users);
    },
    user: (parent, { id }, { models }) => {
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