# StudyHive

A simple web platform for posting and browsing study group listings. Users create posts describing a study session and drop their Telegram or LINE group link in the description — no in-app chat or membership system, just a feed for discovery.

Built with plain HTML, CSS, and JavaScript on the frontend, with [Supabase](https://supabase.com) (Postgres + Auth) as the backend.

---

## Features

- Sign up / log in / log out (Supabase Auth)
- Browse all study posts on the home feed, newest first
- Filter posts by subject
- Create a new study post (title, subject, description with your group link, optional schedule)
- View a post's full details, with automatic Telegram/LINE link detection and a clickable badge
- Edit or delete your own posts (enforced both in the UI and via database rules)

---

## Project Structure

```
studyhive/
├── index.html              # Home feed
├── pages/
│   ├── login.html
│   ├── signup.html
│   ├── create-post.html
│   ├── post-detail.html
│   └── edit-post.html
├── css/
│   └── styles.css          # Shared design tokens + all component styles
├── js/
│   ├── supabaseClient.js   # Supabase connection (needs your project keys — see Setup)
│   ├── auth.js             # Sign up / login / logout / current-user helpers
│   ├── nav.js               # Keeps the nav bar in sync with login state on every page
│   ├── constants.js        # Shared SUBJECTS list (used by filter + create/edit forms)
│   ├── feed.js              # Fetches and renders the home feed
│   ├── filter.js            # Subject filter dropdown
│   └── post-detail.js       # Post detail page: fetch, link detection, delete
├── assets/
│   └── icons/               # Telegram / LINE / generic link icons
└── README.md
```

---

## Setup

### 1. Get your Supabase project keys

If you're joining this project, ask the Supabase Architect (Role 1) for:
- The **Project URL**
- The **anon public key**

(Never use or share the `service_role` key — it bypasses all security rules.)

### 2. Add your keys

Open `js/supabaseClient.js` and replace the placeholders:

```js
const supabaseUrl = 'YOUR_PROJECT_URL';
const supabaseKey = 'YOUR_ANON_PUBLIC_KEY';
```

### 3. Run it locally

This is a static site — no build step, no npm install required. The easiest way to run it locally:

- **VS Code**: install the "Live Server" extension, right-click `index.html`, choose "Open with Live Server."
- **Command line**: `python3 -m http.server 8000` from the project root, then visit `http://localhost:8000`.

Opening `index.html` directly as a `file://` URL will **not** work — ES module imports require a real server.

---

## Team Roles

This project was built across 9 roles. See the team's role guide and GitHub collaboration guide (shared separately) for the full breakdown of who owns what and how we use branches/PRs. Quick summary:

| Role | Owns |
|---|---|
| 1. Supabase Architect | Database schema, RLS policies, `supabaseClient.js` |
| 2. Auth Pages | `login.html`, `signup.html`, `auth.js` |
| 3. Home Feed | `index.html`, `feed.js` |
| 4. Subject Filter | `filter.js`, `constants.js` |
| 5. Create Post Form | `create-post.html` |
| 6. Post Detail + Link Detection | `post-detail.html`, `post-detail.js` |
| 7. Edit/Delete Own Post | `edit-post.html` |
| 8. UI/Styling & Responsiveness | `styles.css`, `assets/icons/` |
| 9. Integration, QA & Docs | This README, GitHub board, end-to-end testing |

---

## Manual Testing Checklist

Before a demo or submission, walk through this full flow in a fresh incognito window:

- [ ] Sign up with a new account
- [ ] Log out, then log back in with that account
- [ ] Create a study post with a Telegram link in the description
- [ ] Confirm it appears on the home feed
- [ ] Filter the feed by that post's subject — confirm it still shows
- [ ] Filter by a different subject — confirm it's hidden
- [ ] Click into the post's detail page — confirm the Telegram badge appears and opens the right link
- [ ] Edit the post (change the title) — confirm the change appears on the detail page
- [ ] Log in as a **different** user — confirm Edit/Delete buttons do **not** appear on someone else's post
- [ ] Delete the post as its owner — confirm it disappears from the feed
- [ ] Try creating a post while logged out — confirm you're blocked with a clear message

---

## Known Limitations (by design, for MVP scope)

- No in-app chat or group membership — Telegram/LINE links are external
- No image uploads or avatars
- Subject list is hardcoded in `constants.js` (not database-driven)
- No real-time feed updates (posts require a page refresh to appear for other users)
