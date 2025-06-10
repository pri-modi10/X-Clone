const db = require('../config/database');

// Create new post
exports.createPost = async (req, res) => {
  const { name, content } = req.body;
  const userId = req.session.user?.id;

  if (!userId) return res.status(401).json({ message: 'Not authenticated' });

  try {
    const newPost = await db.query(
      'INSERT INTO posts (users_id, name, content) VALUES ($1, $2, $3) RETURNING *',
      [userId, name, content]
    );
    res.status(201).json(newPost.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Post creation failed', error: err.message });
  }
};

// Fetch all posts (excluding soft deleted ones)
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await db.query(`
      SELECT posts.*, users.name AS user_name 
      FROM posts 
      JOIN users ON users.id = posts.users_id
      WHERE posts.is_deleted = 0
      ORDER BY created_at DESC
    `);
    res.json(posts.rows);
  } catch (err) {
    res.status(500).json({ message: 'Fetching posts failed', error: err.message });
  }
};

// Soft delete a post (only if post belongs to user)
exports.softDeletePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.session.user?.id;

  if (!userId) return res.status(401).json({ message: 'Not authenticated' });

  try {
    const result = await db.query(
      'UPDATE posts SET is_deleted = 1 WHERE id = $1 AND users_id = $2 RETURNING *',
      [postId, userId]
    );

    if (result.rowCount === 0) {
      return res.status(403).json({ message: 'Unauthorized or post not found' });
    }

    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Deletion failed', error: err.message });
  }
};

// Get posts of the logged-in user
exports.getUserPosts = async (req, res) => {
  const userId = req.session.user?.id;

  if (!userId) return res.status(401).json({ message: 'Not authenticated' });

  try {
    const posts = await db.query(
      `SELECT * FROM posts WHERE users_id = $1 AND is_deleted = 0 ORDER BY created_at DESC`,
      [userId]
    );
    res.json(posts.rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user posts', error: err.message });
  }
};

// Update a post (only if post belongs to user)
exports.updatePost = async (req, res) => {
  const { name, content } = req.body;
  const postId = req.params.id;
  const userId = req.session.user?.id;

  if (!userId) return res.status(401).json({ message: 'Not authenticated' });

  try {
    const result = await db.query(
      `UPDATE posts SET name = $1, content = $2, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $3 AND users_id = $4 AND is_deleted = 0 
       RETURNING *`,
      [name, content, postId, userId]
    );

    if (result.rowCount === 0) {
      return res.status(403).json({ message: 'Unauthorized or post not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};
