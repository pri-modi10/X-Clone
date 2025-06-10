// routes/comments.js

const express = require('express');
const router = express.Router();
const { commentValidation } = require('../middlewares/validators');
const { validateRequest } = require('../middlewares/validationMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const { 
    getCommentsByPostId,
    deleteComment,
    updateComment,
    createComment, 
} = require('../controllers/commentController');

// Create a comment
router.post(
  '/:postId/comments',
  authMiddleware,
  commentValidation,
  validateRequest,
  createComment
);

// Get comments for a post
router.get('/:postId/comments', getCommentsByPostId);

// Update a comment
router.put(
  '/comments/:commentId',
  authMiddleware,
  commentValidation,
  validateRequest,
  updateComment
);

// Delete a comment
router.delete(
  '/comments/:commentId',
  authMiddleware,
  deleteComment
);

module.exports = router;
