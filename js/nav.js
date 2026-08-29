// Shared nav logic: shows "Create Post" + "Log out" when logged in,
// or "Log in" + "Sign up" when logged out. Import this on any page that
// includes the nav-links markup with the IDs used below.

import { getCurrentUser, onAuthChange, signOutUser } from './auth.js';

function updateNavForUser(user) {
  const createPostLink = document.getElementById('nav-create-post');
  const loginLink = document.getElementById('nav-login');
  const signupLink = document.getElementById('nav-signup');
  const logoutBtn = document.getElementById('nav-logout');

  const isLoggedIn = Boolean(user);
  const currentPage = window.location.pathname.split('/').pop();

  if (createPostLink) createPostLink.style.display = isLoggedIn ? 'inline-block' : 'none';
  if (logoutBtn) logoutBtn.style.display = isLoggedIn ? 'inline-block' : 'none';

  // Don't show a link to the page the user is already on.
  if (loginLink) {
    loginLink.style.display = (!isLoggedIn && currentPage !== 'login.html') ? 'inline-block' : 'none';
  }
  if (signupLink) {
    signupLink.style.display = (!isLoggedIn && currentPage !== 'signup.html') ? 'inline-block' : 'none';
  }
}

export async function initNav() {
  const user = await getCurrentUser();
  updateNavForUser(user);

  onAuthChange((updatedUser) => {
    updateNavForUser(updatedUser);
  });

  const logoutBtn = document.getElementById('nav-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await signOutUser();
      window.location.href = '/index.html';
    });
  }
}

initNav();
