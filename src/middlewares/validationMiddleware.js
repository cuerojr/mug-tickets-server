const { response } = require('express');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

class ValidationsMiddlewares {
    constructor() { }

    validateFields(req, res = response, next) {
        const errors = validationResult( req );
    
        if(!errors.isEmpty()) {
          return res.status(400).json({
            ok: false,
            errors: errors.mapped()
          });
        }    
        next();        
    }

    validateJWT(req, res = response, next) {    
      const token = req.header('x-token');

      if(!token) {
        return res.status(401).json({
          ok: false,
          msg: 'There is no token'
        });
      }

      try{
        const { uid } = jwt.verify( token, process.env.JWT_SECRET );

        req.uid = uid;
        
        next();
      } catch(error) {
        return res.status(401).json({
          ok: false,
          msg: 'Wrong token'
        })
      }     
  }

  validateIfAdmin(req, res = response, next) {
    const token = req.header('x-token');

    if(!token) {
      return res.status(401).json({
        ok: false,
        msg: 'There is no token'
      });
    }
    try{
      const { uid } = jwt.verify( token, process.env.JWT_SECRET );
      if(!uid){
        return res.status(401).json({
          ok: false,
          msg: "Can't access there."
        });
      } 
      
      next();
    } catch(error) {
      return res.status(401).json({
        ok: false,
        msg: 'Wrong token'
      });
    }   
  }
}

module.exports = ValidationsMiddlewares;