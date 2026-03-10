import { supabase } from './supabase';

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
    uid: data.user.id,
    registeredAt: data.user.created_at
  };

  localStorage.setItem(TOKEN_KEY, data.session?.access_token || 'pending');
  localStorage.setItem(USER_KEY, JSON.stringify(userData));
  localStorage.setItem(USER_TYPE_KEY, 'user');
  window.dispatchEvent(new Event('storage'));

  return { userData, token: data.session?.access_token };
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

  return { userData, token: data.session.access_token };
};

export const logout = async () => {
  await supabase.auth.signOut();
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(USER_TYPE_KEY);
  window.dispatchEvent(new Event('storage'));
};
