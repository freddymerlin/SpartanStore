const express = require('express')
const router = express.Router();;
const PostController = require('../controllers/posts');
const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file')

router.post('', checkAuth, extractFile, PostController.createPost);
router.get('/:id', PostController.fetchPostId);
router.put('/:id', checkAuth, extractFile, PostController.editPost);
router.get('', PostController.fetchPosts);
router.delete("/:id", checkAuth, PostController.deletePost);

module.exports = router;
