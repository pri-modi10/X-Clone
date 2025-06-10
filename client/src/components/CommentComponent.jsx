// components/CommentComponent.jsx

import { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

export default function CommentComponent({ comment, onUpdate, onDelete }) {
  const user = useSelector((state) => state.auth.user);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ name: comment.name, comment: comment.comment });
  const [error, setError] = useState('');

  const handleEdit = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/posts/comments/${comment.id}`,
        form,
        { withCredentials: true }
      );
      onUpdate(res.data);
      setIsEditing(false);
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors && Array.isArray(errors) && errors.length > 0) {
        return setError(errors[0].msg);
      }
      const msg = err.response?.data?.message || 'Failed to update comment.';
      setError(msg);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/posts/comments/${comment.id}`, {
        withCredentials: true,
      });
      onDelete(comment.id);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white p-2 rounded shadow mb-2">
        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
        <input
          name="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full px-2 py-1 border border-gray-300 rounded mb-2"
        />
        <textarea
          name="comment"
          value={form.comment}
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
          className="w-full px-2 py-1 border border-gray-300 rounded mb-2"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleEdit}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="bg-gray-300 text-black px-3 py-1 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-2 rounded shadow mb-2">
      <div className="flex justify-between items-center">
        <h4 className="text-md font-semibold text-gray-800">{comment.name}</h4>
        <span className="text-xs text-gray-500">
          {new Date(comment.created_at).toLocaleString()}
        </span>
      </div>
      <p className="text-sm text-gray-700">{comment.comment}</p>
      <p className="mt-1 text-xs text-gray-500 italic">Commented by: {comment.user_name}</p>
      {user && user.id === comment.users_id && (
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-blue-600 hover:underline"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-sm text-red-600 hover:underline"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
