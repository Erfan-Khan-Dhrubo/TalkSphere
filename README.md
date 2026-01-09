# TalkSphere 🌐

<div align="center">

![TalkSphere](https://img.shields.io/badge/TalkSphere-Community%20Platform-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![React](https://img.shields.io/badge/React-19.2-61dafb)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)
![License](https://img.shields.io/badge/License-ISC-yellow)

</div>

## 📖 Overview

**TalkSphere** is an interactive community platform designed for students to write reviews about courses and faculty, rate them, and share helpful learning resources. It creates a collaborative environment where learners can make informed academic choices, exchange knowledge, and support each other's studies through meaningful discussions and peer engagement.

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

## 📡 API Endpoints

### Users
- `POST /api/users/register` - Create new user account
- `POST /api/users/login` - User login
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `POST /api/users/forgot-password` - Request password reset

### Posts
- `GET /api/posts` - Get all posts with pagination
- `POST /api/posts` - Create new post
- `GET /api/posts/:id` - Get post details
- `PUT /api/posts/:id` - Edit post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/upvote` - Upvote post
- `POST /api/posts/:id/downvote` - Downvote post
- `POST /api/posts/:id/favorite` - Save/bookmark post

### Comments
- `GET /api/comments/:postId` - Get post comments
- `POST /api/comments` - Create comment
- `PUT /api/comments/:id` - Edit comment
- `DELETE /api/comments/:id` - Delete comment
- `POST /api/comments/:id/upvote` - Upvote comment
- `POST /api/comments/:id/downvote` - Downvote comment

### Reports
- `POST /api/reports` - Submit content report
- `GET /api/reports` - Get all reports (admin only)
- `PUT /api/reports/:id` - Update report status (admin only)
- `DELETE /api/reports/:id` - Delete report (admin only)

### Announcements
- `GET /api/announcements` - Get all announcements
- `POST /api/announcements` - Create announcement (admin only)
- `PUT /api/announcements/:id` - Edit announcement (admin only)
- `DELETE /api/announcements/:id` - Delete announcement (admin only)

---

## 🔒 Security Features

- **Firebase Authentication**: Secure user authentication with email/password and OAuth
- **JWT Tokens**: Token-based API authentication for secure requests
- **Input Validation**: Server-side validation of all user inputs
- **CORS Protection**: Configured Cross-Origin Resource Sharing
- **Password Hashing**: Secure password storage and hashing
- **Role-Based Access**: Different permission levels for users and admins

---

## 🎯 Core Workflows

### User Journey
1. **Registration/Login** - Create account or sign in
2. **Profile Setup** - Upload profile picture and customize profile
3. **Explore Feed** - Browse posts from community members
4. **Engagement** - Upvote, comment, and bookmark posts
5. **Create Content** - Write and publish posts with images
6. **Community Building** - Follow discussions and build reputation

### Moderation Workflow
1. **Report Submission** - Users report inappropriate content
2. **Report Review** - Admins review reported posts/comments
3. **Action Taken** - Delete content or warn/suspend users
4. **Announcements** - Communicate guidelines and updates to community

---

## 🛠️ Development Guidelines

### Code Style
- Follow ESLint configuration for consistent formatting
- Use TypeScript for type safety in frontend
- Use descriptive names for variables and functions
- Add comments for complex logic

### Testing
```bash
# Frontend
npm run lint

# Backend
# Add your testing framework here
```

### Git Workflow
1. Create feature branch: `git checkout -b feature/feature-name`
2. Commit changes: `git commit -m "Add feature"`
3. Push to branch: `git push origin feature/feature-name`
4. Create Pull Request

---

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGO_URI` in `.env` file
- Verify network access if using MongoDB Atlas

### Frontend Build Issues
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`
- Rebuild TypeScript: `tsc -b`

### CORS Issues
- Verify frontend URL in backend CORS configuration
- Check if API calls are using correct backend URL

---

## 📈 Future Enhancements

- [ ] Real-time notifications with WebSocket
- [ ] Direct messaging between users
- [ ] Advanced search and filtering
- [ ] User following/follower system
- [ ] Content recommendation algorithm
- [ ] Email notifications
- [ ] Two-factor authentication
- [ ] API rate limiting
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)

---

## 📞 Support

For issues, questions, or suggestions, please open an issue on the project repository.

---

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

## 👥 Contributors

- Project developed as part of CSE 470 (Software Project)
- Built with passion for creating a better learning community

---

<div align="center">

Made with ❤️ for the student community

**TalkSphere** - *Where students connect and learn together*

</div>
