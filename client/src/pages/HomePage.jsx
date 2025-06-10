import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PostComponent from '../components/PostComponent';
import { setUser } from '../redux/authSlice';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ name: '', content: '' });
  const [error, setError] = useState('');
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch posts on mount
  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
  window.scrollTo(0, 0);
}, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/posts', {
        withCredentials: true,
      });
      setPosts(res.data);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout', null, {
        withCredentials: true,
      });
      dispatch(setUser(null));
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim() || !form.content.trim()) {
      return setError('All fields are required.');
    }

    try {
      const res = await axios.post('http://localhost:5000/api/posts', form, {
        withCredentials: true,
      });
      setPosts([res.data, ...posts]);
      setForm({ name: '', content: '' });
    } catch (err) {
      console.error('Post creation failed:', err);
      const errors = err.response?.data?.errors;
      if (errors && Array.isArray(errors) && errors.length > 0) {
        return setError(errors[0].msg); // or display all using map if you prefer
      }
      const msg = err.response?.data?.message || 'Failed to create post.';
      setError(msg);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 py-10 px-4">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Welcome, {user.name}</h1>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/profile')}
              className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="text-sm bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>

        <h2 className="text-lg font-semibold mb-2 text-gray-700">Create a Post</h2>
        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-3 mb-6">
          <input
            name="name"
            placeholder="Post Title"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 text-black"
            value={form.name}
            onChange={handleChange}
          />
          <textarea
            name="content"
            placeholder="What's on your mind?"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 text-black"
            rows={3}
            value={form.content}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            Post
          </button>
        </form>

        <h2 className="text-lg font-semibold mb-4 text-gray-700">Posts:</h2>
        {posts.length === 0 ? (
          <p className="text-gray-500 text-center">No posts yet.</p>
        ) : (
          posts.map((post) => <PostComponent key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}
