const { response } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/userModel');
const { generateJWT } = require('../config/authentication');

class LogInController {    
    constructor(){}

    async login(req, res = response) {
        const { email, password } = req.body;

        try {
            //Check Email
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Email no válido'
                });
            }

            //Check Password
            const validPassword = bcryptjs.compareSync(password, user.password);

            if(!validPassword){
                return res.status(400).json({
                    ok: false,
                    msg: 'Pass no válido'
                });
            }

            const token = await generateJWT(user._id);

            res.json({
                ok: true,
                token
            });
        } catch (err) {
            console.error(err.message);
        }
    }

}

module.exports = LogInController;