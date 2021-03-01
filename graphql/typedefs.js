const gql = require("graphql-tag");

module.exports = gql`
  type Posts {
    id: ID!
    body: String!
    userName: String!
    createdAt: String!
    comments: [Comment]!
    likes: [Like]!
    likeCount: Int!
    commentCount: Int!
  }
  type Comment {
    id: ID!
    body: String!
    createdAt: String!
    userName: String!
  }
  type Like {
    id: ID!
    createdAt: String
    userName: String!
  }

  type Users {
    id: ID!
    token: String!
    userName: String!
    password: String!
    email: String!
    createdAt: String!
  }
  input RegisterInput {
    userName: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
  input LoginInput {
    email: String!
    password: String!
  }
  type Query {
    getPosts: [Posts]
    getPost(postId: ID!): Posts!
  }
  type Mutation {
    register(registerInput: RegisterInput): Users!
    login(loginInput: LoginInput): Users!
    createPost(body: String!): Posts!
    deletePost(postId: ID!): String!
    createComment(postId: ID!, body: String!): Posts!
    deleteComment(postId: ID!, commentId: ID!): Posts!
    likePost(postId: ID!): Posts!
  }
`;
