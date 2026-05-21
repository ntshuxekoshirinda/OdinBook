import React, { useState, useEffect } from 'react';
import { User, Post } from '../backend/db';
import './style.css';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<'feed' | 'directory' | 'profile'>('feed');
  const [posts, setPosts] = useState<Post[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  
  // Auth inputs
  const [usernameInput, setUsernameInput] = useState('');
  const [guestAliasInput, setGuestAliasInput] = useState('');
  
  // Interactive interactive content creation state
  const [newPostContent, setNewPostContent] = useState('');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    if (currentUser) {
      fetchFeed();
      fetchDirectory();
    }
  }, [currentUser, view]);

  const fetchFeed = async () => {
    if (!currentUser) return;
    const res = await fetch(`/api/posts?userId=${currentUser.id}`);
    const data = await res.json();
    setPosts(data);
  };

  const fetchDirectory = async () => {
    const res = await fetch('/api/users');
    const data = await res.json();
    setAllUsers(data);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: usernameInput })
    });
    const user = await res.json();
    setCurrentUser(user);
  };

  const handleGuestLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestAliasInput.trim()) return;
    const res = await fetch('/api/auth/guest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ alias: guestAliasInput })
    });
    const user = await res.json();
    setCurrentUser(user);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() || !currentUser) return;
    await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authorId: currentUser.id, content: newPostContent })
    });
    setNewPostContent('');
    fetchFeed();
  };

  const handleLike = async (postId: string) => {
    if (!currentUser) return;
    await fetch(`/api/posts/${postId}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUser.id })
    });
    fetchFeed();
  };

  const handleComment = async (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim() || !currentUser) return;
    await fetch(`/api/posts/${postId}/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUser.id, text })
    });
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    fetchFeed();
  };

  const handleFollowRequest = async (targetUserId: string) => {
    if (!currentUser) return;
    await fetch('/api/users/follow-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentUserId: currentUser.id, targetUserId })
    });
    fetchDirectory();
  };

  // Guard Clause: Force sign-in view if unauthenticated
  if (!currentUser) {
    return (
      <div className="auth-container">
        <h2>Welcome to Phase</h2>
        <div className="auth-box">
          <form onSubmit={handleLogin}>
            <h3>Sign In</h3>
            <input type="text" placeholder="Enter username" value={usernameInput} onChange={e => setUsernameInput(e.target.value)} />
            <button type="submit" style={{ marginTop: '10px', width: '100%' }}>Login</button>
          </form>
          
          <form onSubmit={handleGuestLogin} className="auth-section">
            <h3>Guest Access</h3>
            <input type="text" placeholder="Enter alias" value={guestAliasInput} onChange={e => setGuestAliasInput(e.target.value)} />
            <button type="submit" style={{ marginTop: '10px', width: '100%' }}>Explore as Guest</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <nav>
        <div style={{ padding: '10px 16px', fontWeight: 'bold' }}>Hello, {currentUser.displayName}</div>
        <button className={view === 'feed' ? 'active' : ''} onClick={() => setView('feed')}>Home Feed</button>
        <button className={view === 'directory' ? 'active' : ''} onClick={() => setView('directory')}>Find Users</button>
        <button className={view === 'profile' ? 'active' : ''} onClick={() => setView('profile')}>My Profile</button>
        <button onClick={() => setCurrentUser(null)} style={{ marginTop: 'auto', background: '#dc2626' }}>Logout</button>
      </nav>

      <main>
        {view === 'feed' && (
          <div className="feed-container">
            <form onSubmit={handleCreatePost} className="card">
              <input type="text" style={{ width: '100%', boxSizing: 'border-box' }} placeholder="What's happening?" value={newPostContent} onChange={e => setNewPostContent(e.target.value)} />
              <button type="submit" style={{ marginTop: '10px' }}>Post</button>
            </form>

            {posts.map(post => (
              <div key={post.id} className="card">
                <div className="post-header">
                  <img src={post.authorPhoto} alt={post.authorName} className="avatar" />
                  <strong>{post.authorName}</strong>
                </div>
                <p>{post.content}</p>
                <button onClick={() => handleLike(post.id)}>
                  ❤️ {post.likes.length} Likes
                </button>

                <div className="comment-section">
                  {post.comments.map(c => (
                    <div key={c.id} className="comment">
                      <strong>{c.authorName}:</strong> {c.text}
                    </div>
                  ))}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <input type="text" placeholder="Write a comment..." value={commentInputs[post.id] || ''} onChange={e => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })} />
                    <button onClick={() => handleComment(post.id)}>Reply</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === 'directory' && (
          <div className="directory-container card">
            <h3>User Directory</h3>
            {allUsers.filter(u => u.id !== currentUser.id).map(user => {
              const isFollowing = currentUser.following.includes(user.id);
              const hasRequested = user.pendingFollowRequests.includes(currentUser.id);
              
              return (
                <div key={user.id} className="user-row" style={{ justifyContent: 'space-between', borderBottom: '1px solid var(--border)', padding: '10px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={user.profilePhoto} className="avatar" alt={user.displayName} />
                    <span>{user.displayName}</span>
                  </div>
                  {isFollowing ? (
                    <span style={{ color: 'green' }}>✓ Following</span>
                        ) : hasRequested ? (
                    <span style={{ color: 'var(--text-muted)' }}>Pending Approval</span>
                        ) : (
                    <button onClick={() => handleFollowRequest(user.id)}>Follow</button>            
                    )}
                </div>
              );
            })}
          </div>
        )}

       {view === 'profile' && (
            <div className="profile-container">
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <img src={currentUser.profilePhoto} className="avatar" style={{ width: '80px', height: '80px' }} alt={currentUser.displayName} />
                <div>
                <h2>{currentUser.displayName}</h2>
                    <p style={{ color: 'var(--text-muted)' }}>@{currentUser.username}</p>
                    <p>{currentUser.isGuest ? "⚡ Guest Account" : "Verified Member"}</p>
                </div>
            </div>
    
                <h3>Your Submissions</h3>
                {posts.filter(p => p.authorId === currentUser.id).map(post => (
            <div key={post.id} className="card">
                    <p>{post.content}</p>
                <small style={{ color: 'var(--text-muted)' }}>{post.likes.length} Likes · {post.comments.length} Comments</small>
            </div>
        ))}
        </div>
        )}
      </main>
    </div>
  );
}