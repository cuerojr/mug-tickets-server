const { response } = require('express');
const User = require('../models/userModel');

class UserController {
    
    constructor(){}

    async getAll(req, res = response) {
      try {
        const users = await User.find({});
        res.json({
          ok: true,
          users
        });
      } catch (err) {
        console.error(err.message);
      }
    }
  
    async create(req, res = response) {
      try {
        const { 
          name, 
          dni, 
          firstName, 
          lastName 
        } = req.body;
        
        const newUser = new User({ 
          name, 
          dni, 
          firstName, 
          lastName 
        });

        await newUser.save();

        res.json(newUser);
      } catch (err) {
        console.error(err.message);
      }
    }
  
    async get(req, res = response) {
      try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.json(user);      
      } catch (err) {
        console.error(err.message);
      }
    }
  
    async update(req, res = response) {
      try {
        const { id } = req.params;
        const { name, description } = req.body;
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