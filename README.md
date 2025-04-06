# EitherOr Frontend 🎭

This is the **frontend** for the EitherOr app – a fun "Would You Rather" style web application where users can register, vote on questions, mark them as weird, and comment. The app is built using **React** and styled with **Tailwind CSS**, while authentication is handled via **Firebase Auth**.

---

## 📁 Project Structure

```bash
src/
├── api.js                  # Axios for backend communication
├── App.jsx                 # Main app component with routes
├── index.css               # Tailwind CSS imports
├── main.jsx                # Vite entry point
├── config/
│   └── firebase.js         # Firebase configuration setup
├── components/
│   ├── common/
│   │   └── Spinner.jsx     # Reusable loading spinner
│   ├── layout/
│   │   ├── Header.jsx      # App navigation bar
│   │   └── Footer.jsx      # Footer content
│   ├── contexts/
│   │   └── UserContext.jsx # Global user context (email, uid)
│   ├── firebaseUser/
│   │   ├── Login.jsx       # Firebase email/password & Google login form
│   │   ├── LogoutButton.jsx # Button to log out and clear token
│   │   ├── Register.jsx    # Registration form with verification logic
│   │   └── ProtectedRoute.jsx # Redirects unauthenticated users
│   ├── buttons/
│   │   └── GoBackButton.jsx # Optional back button component
│   └── comments/
│       ├── CreateComment.jsx # Add comment to a question
│       ├── EditComment.jsx   # Edit own comment
│       └── DeleteComment.jsx # Delete own comment
├── questions/
│   ├── CreateQuestion.jsx   # Add a new Would You Rather question
│   ├── EditQuestion.jsx     # Update question text
│   ├── DeleteQuestion.jsx   # Remove a question (creator only)
│   ├── QuestionCard.jsx     # Single question preview with "See Details" button
│   ├── QuestionDetails.jsx  # Full question + voting + comments
│   └── QuestionList.jsx     # Lists questions with filters & pagination
└── pages/
    └── MainPage.jsx         # Home page with random content and links
```

---

## 🌐 Features

- ✅ View, create, edit, and delete questions
- ✅ Vote anonymously (stored via UUID in localStorage)
- ✅ Sort questions by newest, popularity, or weirdness
- ✅ Comment on questions (auth required)
- ✅ Edit and delete questions (auth required)
- ✅ Firebase email/password auth with email verification
- ✅ Google login option
- ✅ Protected routes for creating/editing/deleting
- ✅ Tailwind styling and responsive layout

---

## 🔐 Authentication Flow

- Registration requires acceptance of rules
- Email verification required for standard accounts
- Google users skip email verification
- Auth token stored in `localStorage` and sent with requests via Axios headers
- User info managed globally via `UserContext`

---

## 🚀 Environment

In `.env`, define:

```bash
VITE_BASE_URL=https://your-backend-url.onrender.com
```

---

## 📦 Installation & Run

```bash
# Install dependencies
npm install

# Run dev server
npm run dev
```

---

## 🧪 Deployment Notes

- Make sure `VITE_BASE_URL` is set to the **full backend base URL**
- If switching backend from Render, no other frontend changes are needed

---

