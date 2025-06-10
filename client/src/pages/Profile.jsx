import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import EditablePost from '../components/EditablePost';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const user = useSelector((state) => state.auth.user);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchUserPosts();
    }
  }, [user]);

  const fetchUserPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/posts/me', {
        withCredentials: true,
      });
      setPosts(res.data);
    } catch (err) {
      console.error(err);
      setError('Could not load your posts.');
    }
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  };

  const handlePostDeleted = (postId) => {
    setPosts((prev) => prev.filter((post) => post.id !== postId));
  };

  const handleGoBack = () => {
    navigate('/home');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
          <button
            onClick={handleGoBack}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            ← Back to Home
          </button>
        </div>

        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Joined:</strong> {new Date(user.created_at).toLocaleDateString()}</p>

        <h2 className="text-xl font-semibold mt-6 mb-3">My Posts</h2>
        {error && <p className="text-red-600">{error}</p>}
        {posts.length === 0 ? (
          <p className="text-gray-500">No posts created yet.</p>
        ) : (
          posts.map((post) => (
            <EditablePost
              key={post.id}
              post={post}
              onPostUpdated={handlePostUpdated}
              onPostDeleted={handlePostDeleted}
            />
          ))
        )}
      </div>
    </div>
  );
}
