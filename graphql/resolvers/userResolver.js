const bcrypt  = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../../models/UserModel');
const {UserInputError} = require('apollo-server');
const {validateRegisterInput, validateLoginInput} = require('../../util/validators');

//Configuration imports
const {SECRET_KEY} = require('../../config');



function generateToken(response){
    return jwt.sign({
        id:response.id,
        email:response.email,
        userName:response.userName
        }, SECRET_KEY,{expiresIn:'1h'}
    );
}

module.exports = {

    Mutation:{
        //login Mutation
        async login(_,{ loginInput:{email,password} },context,info){
            const { errors,valid} = validateLoginInput(email,password);
            if(!valid){
                throw new UserInputError('Errors',{errors});
            }
            const user = await UserModel.findOne({email})
            if(!user){
                errors.genral = 'Userid Not Found, Try to remember your Id';
                throw new UserInputError('Error',{errors});
            }

            const passwordMatch = await bcrypt.compare(password,user.password);
            if(!passwordMatch){
                errors.genral = 'Invalid Credentials, Try again';
                throw new UserInputError('Invalid Credentials, Try again',{errors});
            }
            const token = generateToken(user);
            return {
                id:user._id,
                token:token,
                ...user._doc,
            };
        },


        async register(_,{registerInput:{ userName,email, password, confirmPassword}},context,info){
            // TODO: validate userdata
            const {errors,valid} = validateRegisterInput(userName,email, password, confirmPassword);
            if(!valid){
                throw new UserInputError('Errors',{errors});
            }
            // TODO: Make Sure allready Exist
            const user = await UserModel.findOne({userName});
            if(user){
                throw new UserInputError('User Name is Taken',{
                    errors:{
                        userName:'This user name is taken'
                    }
                });
            }else{
                const isNewEmail = await UserModel.findOne({email});
                if(isNewEmail){
                    throw new UserInputError('Email is allready Registered',{
                        errors:{
                            email:'Email is allready Registered'
                        }
                    });
                }
            }
            // TODO: Hash the password before putting to databse
            password = await bcrypt.hash(password,12);
            const newUser = new UserModel({
                userName,
                password,
                email,
                createdAt: new Date().toISOString()
            });
            //ger userdata
            const response = await newUser.save();

            const token = generateToken(response);

            return {
                id:response._id,
                token:token,
                ...response._doc,
            };

        }
    }
};