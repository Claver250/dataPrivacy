const joi = require('joi');

const userSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).max(30).required(),
    role: joi.text().required()
});

const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().email().required()
});

module.exports = {userSchema, loginSchema};