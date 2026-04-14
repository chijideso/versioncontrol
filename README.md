# SocialConnect - Social Media App

A modern social media application built with React, Vite, Firebase, and Mantine UI.

## Features

- **User Authentication**: Email/Password and Google Sign-in
- **Feed & Posts**: Create and view posts with text and images
- **Social Features**: 
  - Like posts with real-time updates
  - Comment on posts
  - Follow/Unfollow users
  - Hashtags in posts (auto-detected)
- **Messaging**: Direct messaging with other users
- **Trending**: Browse trending hashtags and discover popular content
- **Search**: Search posts and users in real-time
- **Profile Management**: Update personal info, bio, and avatar
- **Dark/Light Mode**: Toggle theme preference
- **Responsive Design**: Works on desktop and mobile

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Firebase Setup:**
   - Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password and Google provider)
   - Enable Firestore Database
   - Enable Storage
   - Copy your Firebase config to `.env` file (already done)

3. **Firestore Security Rules:**
   Make sure your Firestore rules allow authenticated users to read/write:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

4. **Storage Rules:**
   ```
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /{allPaths=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

5. **Run the app:**
   ```bash
   npm run dev
   # or
   yarn run dev
   ```

## Usage

- **Feed**: View posts, like them, comment, and follow other users
- **Search**: Find posts and users by keyword or hashtag
- **Messages**: Send and receive direct messages
- **Trending**: Discover popular hashtags and trending content
- **Profile**: Update your information, avatar, and bio
- **Dark Mode**: Toggle between light and dark themes
- **Seed Feed**: Add sample posts to test the app

## Troubleshooting

- **Posting not working:** Check browser console for errors. Ensure Firebase is properly configured and Firestore/Storage rules allow authenticated access.
- **Auth issues:** Verify Firebase Auth is enabled and configured.
- **Images not uploading:** Check Storage rules and ensure the bucket is correct.

## Tech Stack

- React 19
- Vite
- Firebase (Auth, Firestore, Storage)
- Mantine UI
- React Router DOM
