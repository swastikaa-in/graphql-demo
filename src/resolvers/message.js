import uuidv4 from 'uuid/v4';
import { ForbiddenError } from 'apollo-server';

export default {
    Query: {
        messages: (parent, args, { me, models }) => {
            if (!me) {
                throw new ForbiddenError('Not authenticated as user.');
            }
            console.log('me.id:' + me.id);

            //return Object.values(models.messages);
            return Object.values(models.messages).filter(
                message => message.userId === me.id,
            );
        },
        message: (parent, { id }, { me, models }) => {
            if (!me) {
                throw new ForbiddenError('Not authenticated as user.');
            }
            console.log('me.id:' + me.id);
            console.log('me.username:' + me.username);
            const retValue = Object.values(models.messages).filter(
                message => ((message.userId === me.id) && (message.id == id)),
            );
            console.log(retValue[0]);

            return retValue[0];
     
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