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

// 1. Seed Initial Users (Mixing permanent accounts and sample guests)
export const users: User[] = [
  {
    id: "1",
    username: "alex",
    displayName: "Alex Rivera",
    profilePhoto: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
    isGuest: false,
    following: ["2", "3"], // Alex follows Jordan and Sarah
    followers: ["2"],
    pendingFollowRequests: []
  },
  {
    id: "2",
    username: "jordan",
    displayName: "Jordan Lee",
    profilePhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    isGuest: false,
    following: ["1"], // Jordan follows Alex
    followers: ["1", "4"],
    pendingFollowRequests: ["3"] // Sarah sent a follow request to Jordan
  },
  {
    id: "3",
    username: "sarah_codes",
    displayName: "Sarah Jenkins",
    profilePhoto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    isGuest: false,
    following: [],
    followers: ["1"],
    pendingFollowRequests: []
  },
  {
    id: "4",
    username: "coderx-guest",
    displayName: "CoderX-guest",
    profilePhoto: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=150",
    isGuest: true,
    following: ["2"], // This guest follows Jordan
    followers: [],
    pendingFollowRequests: []
  }
];

// 2. Seed Initial Posts (Text posts with pre-built likes and comment threads)
export const posts: Post[] = [
  {
    id: "p1",
    authorId: "2",
    authorName: "Jordan Lee",
    authorPhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    content: "Just managed to deploy my first full-stack TypeScript app to Render! The routing engine setup took a bit of fiddling but it runs beautifully now. 🚀",
    likes: ["1", "4"], // Liked by Alex and CoderX-guest
    comments: [
      {
        id: "c1",
        postId: "p1",
        authorId: "1",
        authorName: "Alex Rivera",
        text: "Let's go! Drop the live URL, I want to test out the guest login flow.",
        createdAt: new Date(Date.now() - 3000000)
      },
      {
        id: "c2",
        postId: "p1",
        authorId: "4",
        authorName: "CoderX-guest",
        text: "Works great! Smooth as butter on my end.",
        createdAt: new Date(Date.now() - 1500000)
      }
    ],
    createdAt: new Date(Date.now() - 3600000) // 1 hour ago
  },
  {
    id: "p2",
    authorId: "3",
    authorName: "Sarah Jenkins",
    authorPhoto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    content: "Is anyone else exploring Express 5 and the updated path-to-regexp parsing system? Breaking changes hit hard but the strict routing is definitely cleaner.",
    likes: ["1"], // Liked by Alex
    comments: [
      {
        id: "c3",
        postId: "p2",
        authorId: "2",
        authorName: "Jordan Lee",
        text: "Yes! Spent the morning moving away from legacy string wildcards to clean regex patterns. Much safer.",
        createdAt: new Date(Date.now() - 600000)
      }
    ],
    createdAt: new Date(Date.now() - 7200000) // 2 hours ago
  },
  {
    id: "p3",
    authorId: "1",
    authorName: "Alex Rivera",
    authorPhoto: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
    content: "Architecting social media indexing engines today. Reminding myself: index optimization saves server memory on small hosting environments!",
    likes: [],
    comments: [],
    createdAt: new Date(Date.now() - 14400000) // 4 hours ago
  }
];