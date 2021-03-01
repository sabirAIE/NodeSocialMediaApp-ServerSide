const {AuthenticationError, UserInputError} = require('apollo-server');
const { argsToArgsConfig } = require('graphql/type/definition');
//model Imports
const PostModel = require('../../models/PostModel');

//authentication header imported
const checkAuth = require('../../util/checkAuth');


module.exports = {
    Query:{
        async getPosts(){
            try{
                const allPosts = await PostModel.find().sort({createdAt:-1});
                return allPosts;
            }catch(error){
                throw new Error(error);
            }
        },
        async getPost(_,{postId}){
            try {
                const post = await PostModel.findById(postId);
                if(post){
                    return post;
                }else{
                    throw new Error('Post not Found');
                }
            } catch (error) {
                throw new Error(error);
            }
        }
    },
    Mutation:{
        async createPost(_,{body},context){
            const user = checkAuth(context);
            
            if(body.trim() === ''){
                throw new Error('Post body must be not empty');
            }

            const newPost = new PostModel({
                body,
                user:user.indexOf,
                userName:user.userName,
                createdAt: new Date().toISOString()
            });

            const post = await newPost.save();
            return post;
        },

        async deletePost(_,{postId},context){
            const user = checkAuth(context);
            try {
                const post  = await PostModel.findById(postId);
                if(user.userName === post.userName){
                    await post.delete();
                    return 'Post deleted successfully';
                }else{
                    throw new AuthenticationError("Action not allowed");
                }
            } catch (error) {
                throw new Error(error);
            }
        },

        //comment on the post
        async createComment(_,{postId,body},context){
            const {userName} = checkAuth(context);

            if(body.trim() === ''){
                throw new UserInputError('Please write something',{
                    errors:{
                        body:'Comment body must not Empty'
                    }
                });
            }
            const post = await PostModel.findById(postId);
            
            if(post){
                post.comments.unshift({
                    body,
                    userName,
                    createdAt: new Date().toISOString()
                });
                await post.save();
                return post;
            }else{
                throw new UserInputError('Post not Found');
            }
        },

        async deleteComment(_,{postId,commentId},context){
            const {userName} = checkAuth(context);

            const post = await PostModel.findById(postId);
            if(post){
                const commentIndex = post.comments.findIndex(c => c.id === commentId);
                if(post.comments[commentIndex].userName === userName){
                    post.comments.splice(commentIndex,1);
                    await post.save();
                    return post;
                }else{
                    throw new AuthenticationError('Action not Allowed');
                }
            }else{
                throw new UserInputError('Post not Found');
            }
        },

        //like on post
        async likePost(_,{postId},context){
            const {userName} = checkAuth(context);
            
            const post = await PostModel.findById(postId);
            if(post){
                if(post.likes.find(like => like.userName === userName)){
                    //post allready likeed, unlike it
                    post.likes = post.likes.filter(like => like.userName !==userName);
                }else{
                    //not liked, like it
                    post.likes.push({
                        userName,
                        createdAt: new Date().toISOString()
                    });
                }
                await post.save();
                return post;
            }else{
                throw new UserInputError('Post not found');
            }
        }
    }
}