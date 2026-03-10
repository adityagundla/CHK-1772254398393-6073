// Simple org auth implementation for local demo (not secure; for prototyping only)

const ORGS_KEY = 'organizations';
const TOKEN_KEY = 'token';
const USER_TYPE_KEY = 'userType';
const ORG_DATA_KEY = 'orgData';

const generateToken = () =>
  Math.random().toString(36).substring(2) + Date.now().toString(36);

const loadOrgs = () => {
  try {
    return JSON.parse(localStorage.getItem(ORGS_KEY) || '[]');
  } catch {
    return [];
  }
};

const saveOrgs = (orgs) => {
  localStorage.setItem(ORGS_KEY, JSON.stringify(orgs));
};

export const signupOrg = ({
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
  let orgs = loadOrgs();

  // If an organization already exists with this email or ID, replace it
  orgs = orgs.filter((org) => !(org.email === orgEmail || org.id === orgId));

  const orgData = {
    id: orgId,
    uid: generateToken(),
    name: orgName,
    email: orgEmail,
    password,
    registrationNumber,
    type: orgType,
    address,
    phone,
    website,
    verified: false,
    registeredAt: new Date().toISOString()
  };

  orgs.push(orgData);
  saveOrgs(orgs);

  const token = generateToken();
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_TYPE_KEY, 'organization');
  localStorage.setItem(ORG_DATA_KEY, JSON.stringify(orgData));
  window.dispatchEvent(new Event('storage'));

  return { orgData, token };
};

export const loginOrg = ({ email, password, orgId }) => {
  const orgs = loadOrgs();
  let org = orgs.find((o) => o.email === email || o.id === orgId);

  // If the org doesn't exist yet, create it with minimal info.
  if (!org) {
    org = {
      id: orgId,
      uid: generateToken(),
      name: email.split('@')[0] + ' Corp',
      email,
      password,
      registrationNumber: orgId,
      type: 'financial',
      address: '',
      phone: '',
      website: '',
      verified: true,
      registeredAt: new Date().toISOString()
    };
    orgs.push(org);
    saveOrgs(orgs);
  }

  if (org.password !== password) {
    throw new Error('Invalid email, organization ID, or password');
  }

  const token = generateToken();
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_TYPE_KEY, 'organization');
  localStorage.setItem(ORG_DATA_KEY, JSON.stringify(org));
  window.dispatchEvent(new Event('storage'));

  return { orgData: org, token };
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_TYPE_KEY);
  localStorage.removeItem(ORG_DATA_KEY);
  window.dispatchEvent(new Event('storage'));
};
