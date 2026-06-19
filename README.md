# CPMAI Exam Studio PWA

An offline-first Progressive Web App for CPMAI exam preparation.

## What is included

- Complete CPMAI study guide organized by the five major exam domains
- Flashcards
- Practice mode with 1,200 original practice questions
- 10 mock exams, each designed as a 120-question exam experience
- Detailed answer explanations
- Bookmarks
- Notes
- Search
- Statistics and weak-area recommendations
- Dark mode
- Mobile and desktop optimized layout
- PWA manifest and service worker for installable/offline use

## Fastest way to publish with Netlify

1. Create a free Netlify account.
2. Create a free GitHub account.
3. Upload this folder to a new GitHub repository.
4. In Netlify, choose **Add new site** > **Import an existing project**.
5. Select your GitHub repository.
6. Use these build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
7. Click **Deploy**.
8. Open the Netlify URL once. Then install it on mobile or desktop.

## Fastest way to publish with Vercel

1. Create a free GitHub account.
2. Upload this folder to a new GitHub repository.
3. Create a free Vercel account.
4. Click **New Project**.
5. Import the GitHub repository.
6. Vercel should auto-detect Vite/React.
7. Click **Deploy**.

## Local preview, optional

If you want to test it locally:

```bash
npm install
npm run dev
```

Then open the local URL shown in your terminal.

## Offline/PWA notes

- The app must be hosted on HTTPS for full PWA installation and service worker behavior.
- Netlify and Vercel provide HTTPS automatically.
- Open the deployed site once while online so the browser can cache it.
- User progress, bookmarks, notes, and dark mode are saved in the browser using localStorage.

## Important exam-content note

The practice questions are original study questions generated for preparation. They are not copied from PMI, Cognilytica, or any copyrighted exam bank.
