// Home feed: fetches all study posts from Supabase and renders them as cards.
// Role 4 (Subject Filter) will extend loadPosts() to accept a subject argument —
// see the note near the bottom of this file.

import { supabase } from './supabaseClient.js';

const feedGrid = document.getElementById('feed-grid');

/**
 * Escapes user-provided text before inserting it into innerHTML, so a post
 * containing "<script>" or similar can't run as real HTML.
 */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

function renderLoading() {
  feedGrid.innerHTML = `
    <div class="feed-state">
      <p>Loading study posts...</p>
    </div>
  `;
}

function renderError() {
  feedGrid.innerHTML = `
    <div class="feed-state">
      <h3>Couldn't load posts</h3>
      <p>Something went wrong fetching study posts. Please refresh the page.</p>
    </div>
  `;
}

function renderEmpty() {
  feedGrid.innerHTML = `
    <div class="feed-state">
      <svg class="feed-state-icon" width="72" height="70" viewBox="0 0 120 115" aria-hidden="true">
        <polygon points="100,66 80,100.64 40,100.64 20,66 40,31.36 80,31.36" fill="none" stroke="#E8A33D" stroke-width="3"/>
        <line x1="60" y1="55" x2="60" y2="77" stroke="#E8A33D" stroke-width="3" stroke-linecap="round"/>
        <line x1="49" y1="66" x2="71" y2="66" stroke="#E8A33D" stroke-width="3" stroke-linecap="round"/>
      </svg>
      <h3>This board's empty</h3>
      <p>Be the first to pin a study group — drop your Telegram or LINE link and classmates can join in seconds.</p>
      <a href="pages/create-post.html" class="btn-primary">Post a study group</a>
    </div>
  `;
}

function renderPosts(posts) {
  feedGrid.innerHTML = posts.map(post => `
    <a class="post-card" href="pages/post-detail.html?id=${encodeURIComponent(post.id)}">
      <span class="subject-badge">${escapeHtml(post.subject)}</span>
      <h3>${escapeHtml(post.title)}</h3>
      <p class="post-description">${escapeHtml(post.description)}</p>
      ${post.schedule ? `<p class="post-schedule">📅 ${escapeHtml(post.schedule)}</p>` : ''}
    </a>
  `).join('');
}

/**
 * Fetches and renders posts. Pass a subject string to filter by subject,
 * or leave undefined to show all posts.
 * Role 4 will call this same function from the subject dropdown's change handler.
 */
export async function loadPosts(subject) {
  renderLoading();

  let query = supabase
    .from('study_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (subject) {
    query = query.eq('subject', subject);
  }

  const { data: posts, error } = await query;

  if (error) {
    console.error('Error loading posts:', error);
    renderError();
    return;
  }

  if (!posts || posts.length === 0) {
    renderEmpty();
    return;
  }

  renderPosts(posts);
}

// Initial load — show all posts, unfiltered.
loadPosts();
