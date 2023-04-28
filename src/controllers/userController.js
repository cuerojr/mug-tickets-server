const { response } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/userModel');
const Ticket = require('../models/ticketModel');

class UserController {
    
    constructor(){}

    async getAll(req, res = response) {
      try {
        const users = await User.find({})
                                .populate('purchasedTickets', {
                                  purchaser: 1,
                                  attendee: 1, 
                                  validated: 1, 
                                  purchased: 1, 
                                  purchaseDate: 1, 
                                  validationDate: 1, 
                                  qrCode: 1,
                                  purchaserId: 0
                                });

        res.json({
          ok: true,
          users
        });

      } catch (err) {
        console.error(err.message);
      }
    }
  
    async create(req, res = response) {
      const { 
        dni, 
        firstName, 
        lastName,
        email,
        password
      } = req.body;
      
      try {       
        const existEmail = await User.findOne({ email });

        if(existEmail){
          return res.status(400).json({
            ok: false,
            msg: 'There is an error with the email'
          })
        }

        const newUser = new User({ 
          dni, 
          firstName, 
          lastName,
          email,
          password
        });

        //encrypt
        const salt = bcryptjs.genSaltSync();
        newUser.password = bcryptjs.hashSync( password, salt );

        await newUser.save();

        res.json(newUser);
      } catch (err) {
        console.error(err.message);
      }
    }
  
    async get(req, res = response) {
      const { id } = req.params;
      
      try {
        const user = await User.findById(id);

        res.json(user);      
      } catch (err) {
        console.error(err.message);
      }
    }
  
    async update(req, res = response) {
      const { id, name, description } = req.body;

      try {
        const user = await User.findByIdAndUpdate(id, { name, description }, { new: true });
        res.json(user);
      } catch (err) {
        console.error(err.message);
      }
    }

    async delete(req, res = response) {
      try {
        /*const { id } = req.params;
        const { name, description } = req.body;
        const resource = await Resource.findByIdAndUpdate(id, { name, description }, { new: true });
        res.json(resource);*/
      } catch (err) {
        console.error(err.message);
      }
    }
}

module.exports = UserController;
