import { supabase } from './supabase';
import { registerUser } from './services/api';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';
const USER_TYPE_KEY = 'userType';

export const signup = async ({ name, email, password }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        type: 'user'
      }
    }
  });

  if (error) {
    throw new Error(error.message);
  }

  const userData = {
    name,
    email,
    uid: data.user?.id,
    registeredAt: data.user?.created_at
  };

  // If email confirmation is OFF, data.session will be present.
  // If we just want to bypass for development, we use a fallback token.
  const token = data.session?.access_token || 'dev-token-' + Math.random().toString(36).substring(7);
  
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(userData));
  localStorage.setItem(USER_TYPE_KEY, 'user');
  window.dispatchEvent(new Event('storage'));

  // Mirror to PostgreSQL
  try {
    await registerUser({
      id: userData.uid,
      name: userData.name,
      email: userData.email
    });
  } catch (e) {
    console.error('Failed to register user in PostgreSQL', e);
  }

  return { userData, token };
};

export const login = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    throw new Error(error.message);
  }

  const userData = {
    name: data.user.user_metadata?.name || email.split('@')[0],
    email,
    uid: data.user.id
  };

  localStorage.setItem(TOKEN_KEY, data.session.access_token);
  localStorage.setItem(USER_KEY, JSON.stringify(userData));
  localStorage.setItem(USER_TYPE_KEY, 'user');
  window.dispatchEvent(new Event('storage'));

  // Ensure mirrored to PostgreSQL
  try {
    await registerUser({
      id: userData.uid,
      name: userData.name,
      email: userData.email
    });
  } catch (e) {
    console.error('Failed to register user in PostgreSQL', e);
  }

  return { userData, token: data.session.access_token };
};

export const logout = async () => {
  await supabase.auth.signOut();
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(USER_TYPE_KEY);
  window.dispatchEvent(new Event('storage'));
};
