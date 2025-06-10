// controllers/commentController.js
const pool = require('../config/database');

// Create a new comment
exports.createComment = async (req, res) => {
  const { postId } = req.params;
  const { name, comment } = req.body;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `INSERT INTO comments (posts_id, users_id, name, comment)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [postId, userId, name, comment]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating comment:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Retrieve comments for a post
exports.getCommentsByPostId = async (req, res) => {
  const { postId } = req.params;

  try {
    const result = await pool.query(
      `SELECT c.*, u.name AS user_name
       FROM comments c
       JOIN users u ON c.users_id = u.id
       WHERE c.posts_id = $1 AND c.is_deleted = 0
       ORDER BY c.created_at DESC`,
      [postId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a comment
exports.updateComment = async (req, res) => {
  const { commentId } = req.params;
  const { name, comment } = req.body;
  const userId = req.user.id;

  try {
    const existing = await pool.query(
      `SELECT * FROM comments WHERE id = $1 AND is_deleted = 0`,
      [commentId]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (existing.rows[0].users_id !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const result = await pool.query(
      `UPDATE comments
       SET name = $1, comment = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [name, comment, commentId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating comment:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user.id;

  try {
    const existing = await pool.query(
      `SELECT * FROM comments WHERE id = $1 AND is_deleted = 0`,
      [commentId]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (existing.rows[0].users_id !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await pool.query(
      `UPDATE comments
       SET is_deleted = 1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [commentId]
    );

    res.json({ message: 'Comment deleted' });
  } catch (err) {
    console.error('Error deleting comment:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
