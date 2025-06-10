import { useState } from 'react';
import axios from 'axios';

export default function EditablePost({ post, onPostUpdated, onPostDeleted }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: post.name, content: post.content });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    setError('');
    try {
      const res = await axios.put(`http://localhost:5000/api/posts/${post.id}/edit`, form, {
        withCredentials: true,
      });
      onPostUpdated(res.data);
      setEditing(false);
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.msg || 'Update failed.';
      setError(msg);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/posts/${post.id}/delete`, {
        withCredentials: true,
      });
      onPostDeleted(post.id);
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  return (
    <div className="border p-4 rounded-lg shadow mb-4 bg-gray-50">
      {editing ? (
        <>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full mb-2 p-2 border rounded"
          />
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="flex gap-2">
            <button onClick={handleUpdate} className="bg-blue-600 text-white px-3 py-1 rounded">Save</button>
            <button onClick={() => setEditing(false)} className="bg-gray-400 text-white px-3 py-1 rounded">Cancel</button>
          </div>
        </>
      ) : (
        <>
          <h3 className="text-lg font-semibold">{post.name}</h3>
          <p>{post.content}</p>
          <p className="text-sm text-gray-500 mt-1">
            Posted on: {new Date(post.created_at).toLocaleString()}
          </p>
          <div className="flex gap-2 mt-2">
            <button onClick={() => setEditing(true)} className="text-blue-600 hover:underline">Edit</button>
            <button onClick={handleDelete} className="text-red-600 hover:underline">Delete</button>
          </div>
        </>
      )}
    </div>
  );
}
