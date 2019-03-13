import { gql } from 'apollo-server-express';

export default gql`


  
  extend type Query {
    users: [User!]  @hasRole(role:"ADMIN")
    user(id: ID!): User  @hasRole(role:"ADMIN")
    me: User 
  }
extend type Mutation {
    signUp(
      username: String!
      email: String! 
      password: String!
    ): Token!
    signIn(login: String!, password: String!): Token!
  }
  type Token {
    token: String!
  }

  type User {
    id: ID!
    username: String! 
    email: String @hasRole(role:"MEMBER")
    messages: [Message!] 
  }
`;