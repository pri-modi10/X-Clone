const express = require('express');
const router = express.Router();
const { postValidation } = require('../middlewares/validators');
const { validateRequest } = require('../middlewares/validationMiddleware');
const {
  createPost,
  getAllPosts,
  softDeletePost,
  getUserPosts,
  updatePost
} = require('../controllers/postController');

// Create post
router.post('/', postValidation, validateRequest, createPost);

// Get all posts
router.get('/', getAllPosts);

// Soft delete post
router.delete('/:id/delete', softDeletePost);

// Get posts by logged-in user
router.get('/me', getUserPosts); 

// Edit post
router.put('/:id/edit', postValidation, validateRequest, updatePost); 

module.exports = router;
