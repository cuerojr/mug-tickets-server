const jwt = require('jsonwebtoken');
const config = require('./server');
const User = require('../models/userModel');

const auth = async (req, res, next) => {
  try {
    const { header } = req;
    const token = header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, config.jwt.secret);
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

    if (!user) {
      res.status(404).json({ 
        ok: false, 
        error: `Event with id ${id} not found.` 
      });
      throw new Error('User not found or token invalid');
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Unauthorized' });
  }
};

const generateJWT = ( uid ) => new Promise((resolve, reject) => {
  const payload = {
    uid
  };
  jwt.sign( payload, process.env.JWT_SECRET, {
    expiresIn: '12h'
  }, (err, token) => {  
    if(err) {
      console.log(err);
      reject('Error generating JWT');
    } else {
      resolve(token);
    }  
  });
});


module.exports = {
  auth,
  generateJWT
};