const jwt = require('jsonwebtoken');
const {AuthenticationError} = require('apollo-server');
//Configuration imports
const {SECRET_KEY} = require('../config');


module.exports = (context) =>{
    const authHeader = context.req.headers.authorization;
    if(authHeader){
        //send the value with Bearer
        const token = authHeader.split('Bearer ')[1];
        if(token){
            try {
                const user = jwt.verify(token,SECRET_KEY);
                return user;
            } catch (error) {
                throw new AuthenticationError('Invalid or Expired token');
            }
        }else{
            throw new Error("Authentication token must be 'Bearer [token]");
        }
    }
    throw new Error('Authorization Header must be Provided');
}