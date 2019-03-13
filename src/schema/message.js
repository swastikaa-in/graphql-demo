import { gql } from 'apollo-server-express';

export default gql`
  directive @hasRole(role:String) on FIELD | FIELD_DEFINITION

  extend type Query {
    messages: [Message!]! 
    message(id: ID!): Message 
  }

  extend type Mutation {
    createMessage(text: String!): Message!
    deleteMessage(id: ID!): Boolean!
  }

  type Message {
    id: ID! @hasRole(role:"ADMIN")
    text: String!  @hasRole(role:"MEMBER")
    user: User!  @hasRole(role:"ADMIN")
  }
`;