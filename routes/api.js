module.exports = function(jwt, User) {
  var api = require('express').Router();
  
  var tokenProtected = function(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    
    if (token) {
      jwt.verify(token, req.app.get('superSecret'), function(err, decoded) {
        if (err) {
          return res.json({success: false, message: 'Failed to authenticate token'});
        } else {
          req.userdata = decoded;
          next();
        }
      });
    } else {
      return res.status(403).send({
        success: false,
        message: 'No token provided'
      });
    }
    
  };


  api.get('/', function(req, res) {
    res.json({message: 'Welcome to the coolest API in the world'});
  });

  // route to return all users (GET http://localhost:8000/api/users)
  api.get('/users', tokenProtected, function(req, res) {
    User.all().then(function(data) {
      res.json(data);
    }).catch(function(err) {
      res.json({error: true, message: err});
    });
  });

  // route to authenticate a user (POST http://localhost:8000/api/authenticate)
  api.post('/authenticate', function(req, res) {
    User.findOne({
      name: req.body.name
    }).then(function(user) {
      if (user.password !== req.body.password) {
        throw Error; 
      } else {
        var token = jwt.sign({name: user.name, id: user.id}, req.app.get('superSecret'), {
          expiresIn: 86400 // expires in 24 hours
        });
        res.json({
          success: true,
          message: 'Enjoy your token',
          token: token
        });
      }
    }).catch(function(err) {
      res.json({success: false, message: 'Auth failed'});
    });
  });

  return api;
};
