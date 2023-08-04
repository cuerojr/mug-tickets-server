const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Admin = require('../models/adminModel');
const { generateJWT } = require('../config/authentication');

class AdminController {    
    constructor(){}

    async getAll(req, res = response) {
      try {
        const admins = await Admin.find({});

        res.status(200).json({
          ok: true,
          admins
        });

      } catch (err) {
        res.status(500).json({
          ok: false,
          error: 'Unable to fetch admin',
        });      
      }
    }
  
    async filter(req, res = response) {
      try {
        const admin = await Admin.find(req.query);
        if (admin.length < 1) {
            return res.status(404).json({
              ok: false,
              error: 'No admin matched your search'
            });
        } 

        res.status(200).json({
          ok: true,
          admin
        });
      } catch (err) {
        res.status(500).json({ 
          ok: false, 
          error: err.message 
        });
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
        const existEmail = await Admin.findOne({ email });

        if(existEmail){
          return res.status(400).json({
            ok: false,
            msg: 'There is an error with the email'
          })
        }

        const admin = new Admin({ 
          dni, 
          firstName, 
          lastName,
          email,
          password
        });

        //encrypt
        const salt = bcryptjs.genSaltSync();
        admin.password = bcryptjs.hashSync( password, salt );

        await admin.save();

        const token = await generateJWT(admin._id);
        
        res.status(200).json({
          ok: true,
          admin,
          token
        });
      } catch (err) {
        console.error(`Error occurred while creating user - ${err}`);
        res.status(500).json({
          ok: false,
          error: 'Unable to create admin',
        });      
      }
    }
  
    async get(req, res = response) {
      const { id } = req.params;      
      try {
        const admin = await Admin.findById(id);

        if (!admin) {
          return res.status(404).json({
            ok: false,
            error: 'Admin not found',
          });
        }
        
        res.status(200).json({
          ok: true,
          admin
        });     
      } catch (err) {
        console.error(`Error occurred while fetching user with ID "${id}" - ${err}`);
        res.status(500).json({
          ok: false,
          error: 'Unable to fetch admin information',
        });      
      }
    }
  
    async update(req, res = response) {
      const id = req.params.id;
      const {         
        dni, 
        firstName, 
        lastName,
        email,
        password
      } = req.body;

      try {
        const admin = await Admin.findByIdAndUpdate(id, 
          { 
            dni,
            firstName,
            lastName,
            email,
            password
          }, 
          { 
            new: true 
          });

        if (!admin) {
          return res.status(404).json({
            ok: false,
            error: 'Admin not found',
          });
        }  

        res.status(200).json({
          ok: true,
          admin
        });
      } catch (err) {
        console.error(`Error occurred while updating admin with ID "${id}" - ${err}`);
        res.status(500).json({
          ok: false,
          error: 'Unable to update admin information',
        });
      }
    }

    async delete(req, res = response) {
      const { id } = req.params;

      try {
        const admin = await Admin.findByIdAndRemove(id, { new: true });
        if (!admin) {
          return res.status(404).json({
            ok: false,
            error: 'Admin not found',
          });
        }

        res.status(200).json({
          ok: true
        });
      } catch (err) {
        console.error(`Error occurred while deleting admin with ID "${id}" - ${err}`);
        res.status(500).json({
          ok: false,
          error: 'Unable to delete admin information',
        });
      }
    }
}

module.exports = {
  AdminController
};
