const express = require('express');
const bodyParser = require("body-parser");
const app = express();
module.exports = app;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) =>{
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers",
  "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods",
  "GET, POST, PATCH, DELETE, OPTIONS");
  next();
});

app.post("/api/posts", (req, res, next) =>{
  const post = req.body;
  console.log(post);
  res.status(201).json({
    message: "Post added!"
  });
});


app.get('/api/posts',(req, res, next) =>{
  const posts = [
    {
      id: "asdsad",
      title: "Server Side Test1",
      content: "Lore ipsum daysd"
    },
    {
      id: "asdsad",
      title: "Server Side Test2",
      content: "Lore ipsum daysdad asd sad sa asq1qqq s"
    },
    {
      id: "asdsad",
      title: "Server Side Test3",
      content: "Lore ipsum daysd asd as sdsa d sad asfreswfs dsf"
    }
  ];
  res.status(200).json({
    message:"Posts fetched Successfully!",
    posts: posts
  });
});
