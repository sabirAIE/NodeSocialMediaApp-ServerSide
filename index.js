const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");

//Configuration imports
const { MONGODB } = require("./config.js");
//imports GraphQl
const typeDefs = require("./graphql/typedefs");
//model resolvers
const resolvers = require("./graphql/resolvers");

//port
const PORT = process.env.PORT || 4000;
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

mongoose
  .connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB Connected");
    return server.listen({ port: PORT });
  })
  .then((result) => {
    console.log(`Server Started at ${result.url}`);
  })
  .catch((err) => {
    console.log(err);
  });
