const express = require('express')
const router = express.Router();;
const PostController = require('../controllers/posts');
const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file')
const {uploadFile, getFileStream} = require('../s3')

router.post('', checkAuth, extractFile,
async (req,res, next) => {
  req.files.forEach( async element => {
    console.log(element)
    const result = await uploadFile(element)
    console.log(result)
  });
  next();
  },
PostController.createPost);

router.get('/:id', PostController.fetchPostId);

router.put('/:id', checkAuth, extractFile,
async (req,res, next) => {
  req.files.forEach(async element => {
    console.log(element)
    const result = await uploadFile(element)
    console.log(result)
  });
  next();
  },
PostController.editPost);
router.get('', PostController.fetchPosts);
router.delete("/:id", checkAuth, PostController.deletePost);

module.exports = router;
