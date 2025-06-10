import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import CommentComponent from './commentComponent';

export default function PostComponent({ post }) {
  const user = useSelector((state) => state.auth.user);
  const [comments, setComments] = useState([]);
  const [commentForm, setCommentForm] = useState({ name: '', comment: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/posts/${post.id}/comments`);
      setComments(res.data);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    }
  };

  const handleCommentChange = (e) => {
    setCommentForm({ ...commentForm, [e.target.name]: e.target.value });
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!commentForm.name.trim() || !commentForm.comment.trim()) {
      return setError('All fields are required.');
    }

    try {
      const res = await axios.post(
        `http://localhost:5000/api/posts/${post.id}/comments`,
        commentForm,
        { withCredentials: true }
      );
      setComments([res.data, ...comments]);
      setCommentForm({ name: '', comment: '' });
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors && errors.length > 0) {
        return setError(errors[0].msg);
      }
      const msg = err.response?.data?.message || 'Failed to post comment.';
      setError(msg);
    }
  };

  const handleCommentUpdate = (updatedComment) => {
    setComments((prev) =>
      prev.map((c) => (c.id === updatedComment.id ? updatedComment : c))
    );
  };

  const handleCommentDelete = (commentId) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-xl font-bold text-gray-800">{post.name}</h3>
        <span className="text-xs text-gray-500">
          {new Date(post.created_at).toLocaleString()}
        </span>
      </div>

      <p className="text-gray-700 mb-2">{post.content}</p>
      <p className="text-sm text-gray-500 italic">Posted by: {post.user_name}</p>

      <div className="mt-4">
        <h4 className="text-lg font-semibold mb-2">Comments</h4>

        {user ? (
          <form onSubmit={handleCommentSubmit} className="mb-4 space-y-2">
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <input
              name="name"
              value={commentForm.name}
              onChange={handleCommentChange}
              placeholder="Comment Title"
              className="w-full px-2 py-1 border rounded"
            />
            <textarea
              name="comment"
              value={commentForm.comment}
              onChange={handleCommentChange}
              placeholder="Write your comment..."
              className="w-full px-2 py-1 border rounded"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
            >
              Add Comment
            </button>
          </form>
        ) : (
          <p className="text-sm text-gray-500">Login to comment.</p>
        )}

        {comments.length === 0 ? (
          <p className="text-gray-500">No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <CommentComponent
              key={comment.id}
              comment={comment}
              onUpdate={handleCommentUpdate}
              onDelete={handleCommentDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
