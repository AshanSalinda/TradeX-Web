import React from 'react'


function Validation(values){
    
    let error={}
    
    const password_pattern= /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-z0-9]{8,}$/

    if(values.username ===""){
        error.username="Username should not be empty"
    
    }else{
        <span>Login Success</span>
    }

    if(values.password === ""){
        error.password="Password should not be empty"
    }
    else if(!password_pattern.test(values.password)){
        error.password="Password must include Uppercase, Lowercase & numbers"
    }
    return error;
}
export default Validation;