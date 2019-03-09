import uuidv4 from 'uuid/v4';
import { ForbiddenError } from 'apollo-server';

export default {
  Query: {
    messages: (parent, args, { models }) => {
     return Object.values(models.messages);
    },
    message: (parent, { id }, { models }) => {
     return models.messages[id];
    },
  },

  Mutation: {
    createMessage: (parent, { text }, { me, models }) => {
         if (!me) {
        throw new ForbiddenError('Not authenticated as user.');
      }
      console.log(me);
       const id = uuidv4();
      const message = {
        id,
        text,
        userId: me.id,
      };
console.log(message);
      models.messages[id] = message;
      models.users[me.id].messageIds.push(id);

      return message;
    },

    deleteMessage: (parent, { id }, { models }) => {
        const { [id]: message, ...otherMessages } = models.messages;

      if (!message) {
        return false;
      }

      models.messages = otherMessages;

      return true;
    },
  },

  Message: {
    user: (message, args, { models }) => {
      return models.users[message.userId];
    },
  },
};