// Shared auth helpers — import these from any page instead of calling
// supabase.auth directly, so the rest of the app doesn't need to know
// the Supabase-specific API shape.

import { supabase } from './supabaseClient.js';

/**
 * Creates a new account.
 * Returns { user, error }. If error is null, signup succeeded.
 */
export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  return { user: data?.user ?? null, error };
}

/**
 * Logs an existing user in.
 * Returns { user, error }. If error is null, login succeeded.
 */
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { user: data?.user ?? null, error };
}

/**
 * Logs the current user out.
 */
export async function signOutUser() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

/**
 * Returns the currently logged-in user, or null if no one is logged in.
 * Use this on page load to decide what to show (e.g. hide "Create Post" for guests).
 */
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user;
}

/**
 * Subscribes to login/logout changes. Call this once per page if the page's
 * UI needs to react live to auth state (e.g. showing/hiding a nav button).
 * `callback` receives the user object, or null when logged out.
 */
export function onAuthChange(callback) {
  supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
}

/**
 * Maps common Supabase auth error messages to friendlier text for the UI.
 */
export function getFriendlyAuthError(error) {
  if (!error) return '';
  const msg = error.message || '';
  if (msg.includes('Invalid login credentials')) {
    return 'Incorrect email or password. Please try again.';
  }
  if (msg.includes('User already registered')) {
    return 'An account with this email already exists. Try logging in instead.';
  }
  if (msg.includes('Password should be at least')) {
    return 'Password must be at least 6 characters long.';
  }
  return msg || 'Something went wrong. Please try again.';
}
