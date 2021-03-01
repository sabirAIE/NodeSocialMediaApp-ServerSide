//validate Register input Data
module.exports.validateRegisterInput = (userName,email, password, confirmPassword) =>{
    const errors = {};
    
    if(userName.trim()===''){
        errors.userName = 'User name must not be empty';
    }

    if(email.trim()===''){
        errors.email = 'Email must not be empty';
    }

    if(password.trim()===''){
        errors.password = 'Password must not be empty';
    }else if(password !=confirmPassword){
        errors.confirmPassword = 'Password did not Match';
    }

    return {
        errors,
        valid:Object.keys(errors).length<1
    };
}

//validate Login input Data
module.exports.validateLoginInput = (email,password) =>{
    const errors = {};
    if(email.trim() === ''){
        errors.email = 'Email must not be empty';
    }
    if(password === ''){
        errors.password = 'Password must not be empty';
    }

    return {
        errors,
        valid:Object.keys(errors).length<1
    };
}