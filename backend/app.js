const express = require('express')
const app = express();
const Post = require('./models/post');
const mongoose = require('mongoose');
const { createShorthandPropertyAssignment } = require('typescript');
module.exports = app;

mongoose.connect("mongodb+srv://mean-guy:ms4oLOh2E0ohtcEo@mean-recap.na2pg.mongodb.net/mean-db?retryWrites=true&w=majority",  {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
  console.log('Database Connected!');
})
.catch(()=>{
  console.log('Database Not Connected!');
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader('Access-Control-Allow-Methods',
    "GET, POST, PATCH, DELETE, OPTIONS, PUT"
  )
  next();
});


app.post('/posts', (req,res,next)=>{
  const post = new Post({
    title : req.body.title,
    content : req.body.content
  });
  post.save().then(result=>{
    res.status(201).json({
      message: "Post Added Successfully",
      postId: result._id
    });
  });

});

app.get('/posts', (req,res,next)=>{
  Post.find()
    .then(documents =>{
      console.log(documents);
      res.status(200).json({
        message: 'Posts Fetched Correctly!',
        posts: documents
      });
    });
});

app.delete("/posts/:id", (req, res, next)=>{
  Post.deleteOne({_id: req.params.id}).then(result=>{
    console.log(result)
    res.status(200).json({message: "Post Deleted"});
  });
});




