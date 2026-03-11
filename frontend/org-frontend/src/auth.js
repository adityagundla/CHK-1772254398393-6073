import { supabase } from './supabase';

const TOKEN_KEY = 'token';
const USER_TYPE_KEY = 'userType';
const ORG_DATA_KEY = 'orgData';

export const signupOrg = async ({
  orgName,
  orgEmail,
  orgId,
  registrationNumber,
  password,
  orgType,
  address,
  phone,
  website
}) => {
  const { data, error } = await supabase.auth.signUp({
    email: orgEmail,
    password,
    options: {
      data: {
        orgName,
        orgId,
        registrationNumber,
        type: 'organization',
        orgType,
        address,
        phone,
        website
      }
    }
  });

  if (error) {
    throw new Error(error.message);
  }

  const orgData = {
    id: orgId,
    uid: data.user?.id,
    name: orgName,
    email: orgEmail,
    registrationNumber,
    type: orgType,
    address,
    phone,
    website,
    verified: false,
    registeredAt: data.user?.created_at
  };

  // If email confirmation is OFF, data.session will be present.
  const token = data.session?.access_token || 'dev-token-org-' + Math.random().toString(36).substring(7);

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_TYPE_KEY, 'organization');
  localStorage.setItem(ORG_DATA_KEY, JSON.stringify(orgData));
  window.dispatchEvent(new Event('storage'));

  return { orgData, token };
};

export const loginOrg = async ({ email, password, orgId }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    throw new Error(error.message);
  }

  const meta = data.user.user_metadata || {};
  
  const org = {
    id: meta.orgId || orgId || 'unknown',
    uid: data.user.id,
    name: meta.orgName || email.split('@')[0] + ' Corp',
    email,
    registrationNumber: meta.registrationNumber || '',
    type: meta.orgType || 'other',
    address: meta.address || '',
    phone: meta.phone || '',
    website: meta.website || '',
    verified: true,
    registeredAt: data.user.created_at
  };

  localStorage.setItem(TOKEN_KEY, data.session.access_token);
  localStorage.setItem(USER_TYPE_KEY, 'organization');
  localStorage.setItem(ORG_DATA_KEY, JSON.stringify(org));
  window.dispatchEvent(new Event('storage'));

  return { orgData: org, token: data.session.access_token };
};

export const logout = async () => {
  await supabase.auth.signOut();
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_TYPE_KEY);
  localStorage.removeItem(ORG_DATA_KEY);
  window.dispatchEvent(new Event('storage'));
};
