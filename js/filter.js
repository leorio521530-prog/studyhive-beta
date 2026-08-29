// Subject filter for the home feed. Renders a dropdown into #filter-container
// and re-queries the feed (via feed.js's loadPosts) whenever the selection changes.
//
// This file imports loadPosts from feed.js, which also means importing this
// file is enough to trigger the feed's initial unfiltered load — see index.html,
// which only needs to include this script, not feed.js separately.

import { SUBJECTS } from './constants.js';
import { loadPosts } from './feed.js';

function renderFilter() {
  const container = document.getElementById('filter-container');
  if (!container) return;

  const label = document.createElement('label');
  label.setAttribute('for', 'subject-filter');
  label.className = 'filter-label';
  label.textContent = 'Filter by subject';

  const select = document.createElement('select');
  select.id = 'subject-filter';
  select.className = 'subject-filter-select';

  const allOption = document.createElement('option');
  allOption.value = '';
  allOption.textContent = 'All subjects';
  select.appendChild(allOption);

  SUBJECTS.forEach((subject) => {
    const option = document.createElement('option');
    option.value = subject;
    option.textContent = subject;
    select.appendChild(option);
  });

  select.addEventListener('change', () => {
    loadPosts(select.value || undefined);
  });

  container.appendChild(label);
  container.appendChild(select);
}

renderFilter();
