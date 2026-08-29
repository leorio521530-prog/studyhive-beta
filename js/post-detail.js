// Post detail page: fetches a single post by its ID (from the URL query string),
// renders it, detects whether its description contains a Telegram or LINE link,
// and shows Edit/Delete buttons only if the logged-in user owns the post.

import { supabase } from './supabaseClient.js';
import { getCurrentUser } from './auth.js';

const contentEl = document.getElementById('post-detail-content');

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

/**
 * Looks for a Telegram or LINE URL inside a block of text (with or without
 * a leading "https://"), and returns its type + a normalized, clickable URL.
 * Returns null if no recognizable link is found.
 */
function findGroupLink(text) {
  const urlRegex = /((?:https?:\/\/)?(?:t\.me|telegram\.me|line\.me|liff\.line\.me)\/[^\s)]+)/i;
  const match = text.match(urlRegex);
  if (!match) return null;

  let url = match[1];
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }

  const type = /t\.me|telegram\.me/i.test(url) ? 'telegram' : 'line';
  return { type, url };
}

function renderLinkBadge(description) {
  const link = findGroupLink(description);

  if (!link) {
    // Fallback: no recognizable Telegram/LINE link, but there might still be
    // a generic URL in the description worth surfacing as a plain link.
    const genericMatch = description.match(/https?:\/\/[^\s)]+/i);
    if (!genericMatch) return '';
    return `
      <a class="link-badge link-badge-generic" href="${escapeHtml(genericMatch[0])}" target="_blank" rel="noopener noreferrer">
        <img src="../assets/icons/link.svg" alt="" width="18" height="18" />
        Open link
      </a>
    `;
  }

  const label = link.type === 'telegram' ? 'Open Telegram group' : 'Open LINE group';
  const iconSrc = link.type === 'telegram' ? '../assets/icons/telegram.svg' : '../assets/icons/line.svg';

  return `
    <a class="link-badge link-badge-${link.type}" href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">
      <img src="${iconSrc}" alt="" width="18" height="18" />
      ${label}
    </a>
  `;
}

function renderLoading() {
  contentEl.innerHTML = `<div class="feed-state"><p>Loading post...</p></div>`;
}

function renderNotFound() {
  contentEl.innerHTML = `
    <div class="feed-state">
      <h3>Post not found</h3>
      <p>This study post may have been deleted. <a href="../index.html">Back to the feed</a>.</p>
    </div>
  `;
}

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

async function renderPost(post, currentUser) {
  const isOwner = currentUser && currentUser.id === post.owner_id;

  contentEl.innerHTML = `
    <span class="subject-badge">${escapeHtml(post.subject)}</span>
    <h1>${escapeHtml(post.title)}</h1>
    <p class="post-detail-meta">
      Posted ${formatDate(post.created_at)}
      ${post.schedule ? ` · 📅 ${escapeHtml(post.schedule)}` : ''}
    </p>

    <p class="post-detail-description">${escapeHtml(post.description)}</p>

    ${renderLinkBadge(post.description)}

    ${isOwner ? `
      <div class="post-actions">
        <a class="btn-secondary" href="edit-post.html?id=${encodeURIComponent(post.id)}">Edit post</a>
        <button class="btn-danger" id="delete-btn">Delete post</button>
      </div>
    ` : ''}
  `;

  if (isOwner) {
    document.getElementById('delete-btn').addEventListener('click', async () => {
      const confirmed = window.confirm('Delete this study post? This can\'t be undone.');
      if (!confirmed) return;

      const { error } = await supabase.from('study_posts').delete().eq('id', post.id);

      if (error) {
        console.error('Error deleting post:', error);
        alert('Something went wrong deleting the post. Please try again.');
        return;
      }

      window.location.href = '../index.html';
    });
  }
}

async function init() {
  renderLoading();

  const postId = new URLSearchParams(window.location.search).get('id');
  if (!postId) {
    renderNotFound();
    return;
  }

  const [{ data: post, error }, currentUser] = await Promise.all([
    supabase.from('study_posts').select('*').eq('id', postId).single(),
    getCurrentUser(),
  ]);

  if (error || !post) {
    renderNotFound();
    return;
  }

  renderPost(post, currentUser);
}

init();
