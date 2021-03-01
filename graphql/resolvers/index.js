//import all Resolvers
const postResolvers = require('./postResolver');
const userResolvers = require('./userResolver');

module.exports = {
    Posts:{
        likeCount :(parent) => parent.likes.length,
        commentCount: (parent) => parent.comments.length
    },
    Query:{
        ...postResolvers.Query,
    },
    Mutation:{
        ...userResolvers.Mutation,
        ...postResolvers.Mutation
    }
}