import jwt from 'jsonwebtoken';
import { AuthenticationError, UserInputError } from 'apollo-server';
import _ from 'lodash';

const createToken = async (user, secret, expiresIn) => {
  const { id, email, username } = user;
  return await jwt.sign({ id, email, username }, secret, {
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
    const users=Object.values(models.users);
    console.log('users:' + users);
    const pos=_.findIndex(users, {'username':login,'password':password});
    console.log('pos:' + pos);


      if (pos==-1) {
        throw new UserInputError(
          'Invalid Username/Password. Access Denied',
        );
      }
      console.log('Sign-in Successful');
   const luser=users[pos];
    console.log('User Profile is:' + luser);
     const user = {
                        'username':luser.username,
                        'email':luser.email,
                        'id':luser.id
                    };
  console.log('user is:' + user);
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