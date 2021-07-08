const express = require('express')
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require('../models/user');

router.post("/signup", (req, res, next)=>{
  console.log("\n\n\n", req.body.password);
  bcrypt.hash(req.body.password, 10)
    .then(hash =>{
      const user = new User({
        email: req.body.email,
        password: hash
      })
      user.save()
        .then(result=>{
          res.status(201).json({
            message: 'New User Saved!',
            result: result
          });
        })
        .catch(err=>{
          res.status(500).json({
            error: err
          });
        });
    });
});


module.exports = router;
