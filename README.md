# TalkSphere 🌐
## 📖 Overview

**TalkSphere** is an interactive community platform designed for students to write reviews about courses and faculty, rate them, and share helpful learning resources. Developed as part of the CSE470 course, it creates a collaborative environment where learners can make informed academic choices, exchange knowledge, and support each other's studies through meaningful discussions and peer engagement.

The platform fosters open dialogue, knowledge exchange, and community building through a comprehensive system of posts, comments, ratings, and moderation tools.

---

## ✨ Key Features

### 🔐 Authentication & User Profiles

- **User Registration**: Email and password-based account creation with secure access control
- **Social Login**: Quick authentication via Google OAuth, reducing friction and improving signup conversion
- **Password Reset**: Secure password recovery through email verification links
- **Profile Picture Management**: Upload, edit, and update profile pictures for personal representation
- **User Activity Summary**: View other users' contribution metrics (posts, comments, upvotes)
- **Profile Customization**: Personalize user profiles with bio and profile information

### 📝 Post Creation & Feed System

- **Rich Content Support**: Create text and image posts for versatile content sharing
- **Post Editing & Deletion**: Modify or remove your own posts anytime
- **Post Preview**: Review how posts will appear before publishing
- **Save/Bookmark Posts**: Create a personal library of interesting or important content
- **Infinite Scroll Feed**: Seamless browsing experience with automatic content loading
- **Trending Section**: Highlights popular posts getting high engagement to motivate quality content creation

### 👍 Voting & Rating System

- **Upvote/Downvote Posts**: Express approval or disapproval on posts
- **Vote Integrity**: Prevent multiple votes from the same user per post/comment
- **Vote Display**: Show total votes prominently on posts and comments
- **Undo Vote Option**: Change or retract votes with flexibility
- **Report Posts**: Flag inappropriate, spam, or misleading content for moderation review

### 💬 Comments & Discussion

- **Post Comments**: Share thoughts and opinions to encourage engagement
- **Edit/Delete Comments**: Correct or remove your own comments
- **Nested Replies**: Create discussion threads with hierarchical comment structure
- **Comment Collapsing**: Manage long threads by expanding/collapsing for readability
- **Comment Voting**: Upvote/downvote comments to highlight helpful responses
- **Rich Discussion Threads**: Facilitate organized and easy-to-follow conversations

### 🛡️ Admin & Moderation Panel

- **User Management**: Ban or suspend users who violate community guidelines
- **Content Moderation**: Delete inappropriate posts/comments that violate policies
- **Report Management**: Review user reports and take appropriate actions
- **Announcements**: Broadcast system-wide messages for updates and maintenance notifications
- **User Activity Monitoring**: View user statistics and detect unusual behavior patterns
- **Community Safety**: Maintain a healthy, respectful, and inclusive environment

---

## 📸 Screenshots

### Home Page - Landing & Authentication

<div align="center">
  <img src="./website screenshot/Home Page.png" alt="Home Page" width="100%">
</div>

### Feed - Main Discussion Platform

<div align="center">
  <img src="./website screenshot/Feed.png" alt="Feed" width="100%">
</div>

### User Profile

<div align="center">
  <img src="./website screenshot/Profile.png" alt="Profile" width="100%">
</div>

---

## 🏗️ Technology Stack

### Frontend

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + DaisyUI
- **Authentication**: Firebase
- **HTTP Client**: Axios
- **Routing**: React Router v7
- **Notifications**: React Hot Toast
- **UI Libraries**: Lucide React, React Icons, SweetAlert2
- **Carousel**: React Slick
- **Tooltips**: React Tooltip
- **Infinite Scroll**: React Infinite Scroll Component

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Middleware**: CORS, JSON Parser
- **Environment**: dotenv for configuration
- **Development**: Nodemon for auto-reload

---

## 📁 Project Structure

```
TalkSphere/
├── backend/
│   ├── src/
│   │   ├── server.js                 # Express server entry point
│   │   ├── config/
│   │   │   └── db.js                # MongoDB connection configuration
│   │   ├── models/                  # Mongoose schemas
│   │   │   ├── announcementModel.js
│   │   │   ├── commentModel.js
│   │   │   ├── postModel.js
│   │   │   ├── reportModel.js
│   │   │   └── userModel.js
│   │   ├── controllers/             # Business logic
│   │   │   ├── announcementController.js
│   │   │   ├── commentController.js
│   │   │   ├── postController.js
│   │   │   ├── reportController.js
│   │   │   └── userController.js
│   │   ├── routes/                  # API endpoints
│   │   │   ├── announcementRoutes.js
│   │   │   ├── commentRoutes.js
│   │   │   ├── postRoutes.js
│   │   │   ├── reportRoutes.js
│   │   │   └── userRoutes.js
│   │   └── middleware/
│   │       └── authMiddleware.js    # Authentication middleware
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── main.tsx                 # React entry point
│   │   ├── App.tsx                  # Root component
│   │   ├── Router/
│   │   │   ├── Router.tsx           # Route definitions
│   │   │   ├── PrivateRoutes.tsx    # Protected routes
│   │   │   └── AdminRoutes.tsx      # Admin-only routes
│   │   ├── pages/
│   │   │   ├── Home/                # Landing & auth pages
│   │   │   │   ├── Home.tsx
│   │   │   │   ├── Login.tsx
│   │   │   │   ├── Signup.tsx
│   │   │   │   └── Description.tsx
│   │   │   ├── Feed/                # Main feed pages
│   │   │   │   ├── NewsFeed.tsx
│   │   │   │   ├── CreatePost.tsx
│   │   │   │   ├── MyProfile.tsx
│   │   │   │   ├── UserProfile.tsx
│   │   │   │   └── Favorites.tsx
│   │   │   ├── Post/
│   │   │   │   ├── PostDetails.tsx
│   │   │   │   └── EditPost.tsx
│   │   │   └── Moderation/          # Admin pages
│   │   │       ├── Reports.tsx
│   │   │       ├── AllAnnouncements.tsx
│   │   │       └── Users.tsx
│   │   ├── components/              # Reusable components
│   │   │   ├── common/
│   │   │   ├── feed/
│   │   │   ├── announcements/
│   │   │   ├── Comment/
│   │   │   ├── ReportPostModal.tsx
│   │   │   └── ReportCommentModal.tsx
│   │   ├── utilities/
│   │   │   ├── axios.ts             # Axios configuration
│   │   │   └── imageUpload.ts       # Image upload helper
│   │   └── config/
│   │       ├── AuthProvider.tsx     # Auth context
│   │       └── firebase.config.ts   # Firebase configuration
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── README.md
│
├── Class Diagram/
│   └── cse470_classDiagram.drawio
├── LICENSE
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas cloud database)
- Firebase account (for authentication)
- Git

### Backend Setup

1. **Navigate to backend directory**

   ```bash
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create `.env` file** in the backend directory

   ```
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   ```

4. **Start the server**

   ```bash
   # Development with auto-reload
   npm run dev

   # Production
   npm start
   ```

   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Firebase** in `src/config/firebase.config.ts`

   ```typescript
   // Add your Firebase configuration
   export const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     // ... other config
   };
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:5173`

5. **Build for production**
   ```bash
   npm run build
   ```

---
