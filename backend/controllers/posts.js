const Post = require('../models/post');

exports.createPost = (req,res,next)=>{
  const url = req.protocol + '://' + req.get("host");
  imagePath =  url + "/images/" + req.file.filename
  const post = new Post({
    title : req.body.title,
    content : req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  post.save().then(result=>{
    res.status(201).json({
      message: "Post Added Successfully",
      post: {
        ...result,
        id: result._id
      }
    });
  })
  .catch(error =>{
    res.status(500).json({
      message: "Creation of new post failed!"
    });
  });
}

exports.fetchPostId = (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post){
      res.status(200).json(post);
    }
    else{
      res.status(404).json({message: 'Post not Found!'});
    }
  })
  .catch(error=>{
    res.status(500).json({
      message: "Fetching post Failed!"
    });
  })
}

exports.editPost = (req, res, next)=>{
  let imagePath = req.body.imagePath;
  if(req.file){
    const url = req.protocol + '://' + req.get("host");
    imagePath =  url + "/images/" + req.file.filename
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  //console.log(req.body.content);
  Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post)
  .then(result=>{
    if (result.n > 0){
      res.status(200).json({
        message: "Updated!"
      });
    }
    else{
      res.status(401).json({
        message: "Not Authorized!"
      });
    }
  })
  .catch(error=>{
    res.status(500).json({
      message: "Couldn't update post!"
    });
  })
}

exports.fetchPosts = (req,res,next)=>{
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const postQuery =Post.find();
  let fetchedPosts;
  if (pageSize && currentPage){
    postQuery
      .skip(pageSize*(currentPage-1))
      .limit(pageSize);
  }
  postQuery.
    then(documents =>{
      fetchedPosts = documents;
      return Post.countDocuments();
    })
    .then(count=>{
      res.status(200).json({
        message: 'Posts Fetched Correctly!',
        posts: fetchedPosts,
        maxPosts: count
      });
    })
    .catch(error=>{
      res.status(500).json({
        message: "Fetching post Failed!"
      });
    })
}

exports.deletePost = (req, res, next)=>{
  Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result=>{
    if (result.n >0){
      res.status(200).json({
        message: "Post Deleted!"
      });
    }
    else{
      res.status(401).json({
        message: "Not Authorized!"
      });
    }
  })
  .catch(error=>{
    res.status(500).json({
      message: "Deleting post Failed!"
    });
  })
}
