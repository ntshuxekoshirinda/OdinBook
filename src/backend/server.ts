import express from 'express';
import cors from 'cors';
import path from 'path';
import { users, posts, User, Post, Comment } from './db';

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// Serve Static Frontend Assets built by Vite
app.use(express.static(path.join(__dirname, '../frontend')));

// --- Authentication API ---
app.post('/api/auth/login', (req, res) => {
  const { username } = req.body;
  let user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
  
  if (!user) {
    // Auto-create standard user if not found for easy demonstration
    user = {
      id: Math.random().toString(36).substr(2, 9),
      username,
      displayName: username.charAt(0).toUpperCase() + username.slice(1),
      profilePhoto: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
      isGuest: false,
      following: [],
      followers: [],
      pendingFollowRequests: []
    };
    users.push(user);
  }
  res.json(user);
});

app.post('/api/auth/guest', (req, res) => {
  const { alias } = req.body;
  if (!alias) return res.status(400).json({ error: "Alias is required" });
  
  const guestUser: User = {
    id: Math.random().toString(36).substr(2, 9),
    username: `${alias.toLowerCase()}-guest`,
    displayName: `${alias}-guest`,
    profilePhoto: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=150",
    isGuest: true,
    following: [],
    followers: [],
    pendingFollowRequests: []
  };
  
  users.push(guestUser);
  res.json(guestUser);
});

// --- Users & Relationships API ---
app.get('/api/users', (req, res) => {
  res.json(users);
});

app.post('/api/users/follow-request', (req, res) => {
  const { currentUserId, targetUserId } = req.body;
  const target = users.find(u => u.id === targetUserId);
  
  if (target && !target.pendingFollowRequests.includes(currentUserId)) {
    target.pendingFollowRequests.push(currentUserId);
    return res.json({ success: true, target });
  }
  res.status(404).json({ error: "User not found or request already pending" });
});

// --- Posts API ---
app.get('/api/posts', (req, res) => {
  const { userId } = req.query;
  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  // Index requirement: Show posts from current user and users they are following
  const visibleUserIds = [user.id, ...user.following];
  const filteredPosts = posts.filter(post => visibleUserIds.includes(post.authorId));
  
  res.json(filteredPosts.sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime()));
});

app.post('/api/posts', (req, res) => {
  const { authorId, content } = req.body;
  const user = users.find(u => u.id === authorId);
  if (!user) return res.status(404).json({ error: "Author not found" });

  const newPost: Post = {
    id: Math.random().toString(36).substr(2, 9),
    authorId: user.id,
    authorName: user.displayName,
    authorPhoto: user.profilePhoto,
    content,
    likes: [],
    comments: [],
    createdAt: new Date()
  };

  posts.unshift(newPost);
  res.json(newPost);
});

app.post('/api/posts/:id/like', (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  const post = posts.find(p => p.id === id);
  
  if (post) {
    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter(uid => uid !== userId); // Unlike
    } else {
      post.likes.push(userId); // Like
    }
    return res.json(post);
  }
  res.status(404).json({ error: "Post not found" });
});

app.post('/api/posts/:id/comment', (req, res) => {
  const { id } = req.params;
  const { userId, text } = req.body;
  const post = posts.find(p => p.id === id);
  const user = users.find(u => u.id === userId);

  if (post && user) {
    const newComment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      postId: id,
      authorId: user.id,
      authorName: user.displayName,
      text,
      createdAt: new Date()
    };
    post.comments.push(newComment);
    return res.json(post);
  }
  res.status(404).json({ error: "Post or User not found" });
});

// Fallback to React app router
// Fallback to React app router - Using modern Regex pattern matching
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});