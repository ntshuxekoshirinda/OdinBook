export interface User {
  id: string;
  username: string;
  displayName: string;
  profilePhoto: string;
  isGuest: boolean;
  following: string[];       // User IDs
  followers: string[];       // User IDs
  pendingFollowRequests: string[]; // User IDs who requested to follow this user
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  text: string;
  createdAt: Date;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorPhoto: string;
  content: string;
  likes: string[]; // User IDs who liked
  comments: Comment[];
  createdAt: Date;
}

// Seed Initial Data
export const users: User[] = [
  { id: "1", username: "alex", displayName: "Alex Rivera", profilePhoto: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150", isGuest: false, following: ["2"], followers: [], pendingFollowRequests: [] },
  { id: "2", username: "jordan", displayName: "Jordan Lee", profilePhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", isGuest: false, following: [], followers: ["1"], pendingFollowRequests: [] }
];

export const posts: Post[] = [
  {
    id: "p1",
    authorId: "2",
    authorName: "Jordan Lee",
    authorPhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    content: "Building an app for Render deployment today! Loving TypeScript.",
    likes: ["1"],
    comments: [
      { id: "c1", postId: "p1", authorId: "1", authorName: "Alex Rivera", text: "Looks awesome, Jordan!", createdAt: new Date() }
    ],
    createdAt: new Date(Date.now() - 3600000)
  }
];