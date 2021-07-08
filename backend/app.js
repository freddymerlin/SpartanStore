const express = require('express')
const app = express();
const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");
const mongoose = require('mongoose');
const { createShorthandPropertyAssignment } = require('typescript');
const path = require('path');

mongoose.connect("mongodb+srv://mean-guy:ms4oLOh2E0ohtcEo@mean-recap.na2pg.mongodb.net/mean-db?&w=majority",  {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
  console.log('Database Connected!');
})
.catch(()=>{
  console.log('Database Not Connected!');
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/images", express.static(path.join("backend/images")));
app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader('Access-Control-Allow-Methods',
    "GET, POST, PATCH, DELETE, OPTIONS, PUT"
  )
  next();
});


app.use('/posts', postsRoutes);
app.use('/user', userRoutes);

module.exports = app;
