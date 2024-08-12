

import Joi from "joi"


const signupValid=Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(/^[A-Z][A-Za-z0-9]{7,50}$/).required(),
    rePassword:Joi.valid(Joi.ref('password')).required(),
})

const signInValid=Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().pattern(/^[A-Z][A-Za-z0-9]{7,50}$/).required(),
})

export {
    signupValid,
    signInValid

}