const express = require('express')
const app = express();

module.exports = app;

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
  const post = req.body;
  console.log(post);
  res.status(201).json({
    message: "Post Added Successfully"
  });
});

app.get('/posts', (req,res,next)=>{
  const posts = [
    {id: 'id1', title: 'First Post', content: 'Asdfljk alskdajf'},
    {id: 'id2', title: 'Second Post', content: 'Ffljk alskdajf'},
    {id: 'id3', title: 'Third Post', content: 'Sdfljk alskdajf'}
  ];
  res.status(200).json({
    message: 'Posts Fetched Correctly!',
    posts: posts
  });
});




