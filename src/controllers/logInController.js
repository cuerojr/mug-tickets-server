const { response } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/userModel');
const { generateJWT } = require('../config/authentication');
const { googleVerify } = require('../helpers/google-verify');
class LogInController {    
    constructor(){}

    async login(req, res = response) {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Email no válido'
                });
            }

            const validPassword = bcryptjs.compareSync(password, user.password);
            if(!validPassword){
                return res.status(400).json({
                    ok: false,
                    msg: 'Pass no válido'
                });
            }

            const token = await generateJWT(user._id);
            res.status(200).json({
                ok: true,
                token
            });
        } catch (err) {
            res.status(500).json({ 
                ok: false, 
                error: err.message 
            });
        }
    }

    async googleSignIn(req, res = response) {
        try {
            const { token } = req.body;
            const { email, picture, name, family_name, given_name } = await googleVerify(token);
            
            const userDB = await User.findOne({ email });
            let newUser;
            if(!userDB) {
                newUser = new User({
                    email,
                    firstName: given_name,
                    lastName: family_name,
                    dni: 0,
                    password: '@@@',
                    image: picture,
                    google: true
                })
            } else {
                newUser = userDB;
                newUser.google = true;
            }

            await newUser.save();
            const newToken = await generateJWT(newUser.id);


            res.status(200).json({
                ok: true,
                name,
                email,
                picture,
                newToken
            });
        } catch (err) {
            res.status(500).json({ 
                ok: false, 
                error: err.message 
            });
        } 
    }
}

module.exports = {
    LogInController
};